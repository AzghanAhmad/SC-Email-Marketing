using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using ScribeCount.Email.Api.Data;
using ScribeCount.Email.Api.DTOs;
using ScribeCount.Email.Api.Entities;

namespace ScribeCount.Email.Api.Services;

public class AudienceService(AppDbContext db)
{
    private static readonly JsonSerializerOptions JsonOptions = new() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

    private static readonly GrowthToolDto[] ToolCatalog =
    [
        new("manage-forms", "Manage sign-up forms", "Gather information about your readers, serve them offers, and show personalized content.", "Manage", "Create and manage your sign-up forms", "collect", "form", null),
        new("customize-pages", "Customize subscribe and preference pages", "Collect new subscribers for specific lists and manage global subscribe and preference pages.", "Customize", "Configure subscription preferences", "collect", "settings", null),
        new("reader-magnet", "Reader magnet delivery", "Automate delivery of reader magnets to new subscribers via email or download link.", "Setup", "Configure reader magnet delivery automation", "build", "book", null),
        new("landing-builder", "Landing page builder", "Create beautiful, mobile-responsive landing pages for your book launches and giveaways.", "Build", "Create a new landing page", "build", "landing", null),
        new("checkout", "Add subscribers at checkout", "Set up your integration to enable customers to sign up for email marketing at checkout.", "Connect", "Connect your checkout to capture subscribers", "integrate", "checkout", null),
        new("bookfunnel", "Integrate with BookFunnel", "Seamlessly connect subscribers and add them to ScribeCount through BookFunnel delivery.", "Integrate", "Connect your BookFunnel account", "integrate", "link", null),
        new("import", "Import from other providers", "Migrate your subscriber list from Mailchimp, ConvertKit, or other email providers.", "Import", "Start the migration wizard", "integrate", "upload", null),
    ];

    public async Task<List<SubscriberProfileDto>> GetProfilesAsync(
        Guid userId, string? search, string? status, Guid? listId = null, Guid? segmentId = null)
    {
        var query = db.Subscribers.Where(s => s.UserId == userId);
        if (!string.IsNullOrWhiteSpace(status))
            query = query.Where(s => s.Status == status);
        if (!string.IsNullOrWhiteSpace(search))
        {
            var q = search.Trim().ToLower();
            query = query.Where(s => s.Name.ToLower().Contains(q) || s.Email.ToLower().Contains(q));
        }

        var rows = await query.OrderByDescending(s => s.JoinedAt).ToListAsync();

        if (listId.HasValue)
            rows = rows.Where(s => ParseListIds(s).Contains(listId.Value)).ToList();

        if (segmentId.HasValue)
        {
            var segment = await db.AudienceSegmentItems
                .FirstOrDefaultAsync(s => s.Id == segmentId.Value && s.UserId == userId);
            if (segment is not null)
            {
                var lists = await db.AudienceLists.Where(l => l.UserId == userId).ToListAsync();
                rows = rows.Where(s => SubscriberMatchesRule(s, segment.RuleType, segment.RuleConfigJson, lists)).ToList();
            }
            else
            {
                rows = [];
            }
        }

        return rows
            .GroupBy(s => s.Email.Trim().ToLowerInvariant())
            .Select(g => g.OrderByDescending(s => s.JoinedAt).First())
            .OrderByDescending(s => s.JoinedAt)
            .Select(MapSubscriber)
            .ToList();
    }

    public async Task<int> CountAudienceRecipientsAsync(
        Guid userId,
        IReadOnlyList<string>? listIds,
        IReadOnlyList<string>? segmentIds,
        IReadOnlyList<string>? contactIds,
        bool excludeUnengaged,
        IReadOnlyList<string>? suppressionRules,
        string? fallbackSegment = null,
        string? arcTag = null)
    {
        var recipients = await ResolveAudienceRecipientsAsync(
            userId, listIds, segmentIds, contactIds, excludeUnengaged, suppressionRules, fallbackSegment, arcTag);
        return recipients.Count;
    }

    public async Task<(int BeforeSuppression, int AfterSuppression)> EstimateAudienceReachAsync(
        Guid userId,
        IReadOnlyList<string>? listIds,
        IReadOnlyList<string>? segmentIds,
        IReadOnlyList<string>? contactIds,
        bool excludeUnengaged,
        IReadOnlyList<string>? suppressionRules,
        string? fallbackSegment,
        string? arcTag = null)
    {
        var before = await ResolveAudienceRecipientsAsync(
            userId, listIds, segmentIds, contactIds, excludeUnengaged, [], fallbackSegment, arcTag);
        var after = await ResolveAudienceRecipientsAsync(
            userId, listIds, segmentIds, contactIds, excludeUnengaged, suppressionRules, fallbackSegment, arcTag);
        return (before.Count, after.Count);
    }

    public async Task<SubscriberProfileDto> CreateProfileAsync(Guid userId, CreateSubscriberRequest request)
    {
        var normalizedEmail = request.Email.Trim().ToLowerInvariant();
        var existing = await db.Subscribers
            .FirstOrDefaultAsync(s => s.UserId == userId && s.Email == normalizedEmail);
        if (existing is not null)
            throw new InvalidOperationException($"A profile with email {normalizedEmail} already exists.");

        var listIds = ResolveListIds(request.ListIds, request.ListId);
        var subscriber = new Subscriber
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Name = request.Name.Trim(),
            Email = normalizedEmail,
            Status = string.IsNullOrWhiteSpace(request.Status) ? "active" : request.Status,
            TagsJson = JsonSerializer.Serialize(request.Tags ?? [], JsonOptions),
            ListIdsJson = JsonSerializer.Serialize(listIds.Select(id => id.ToString()).ToList(), JsonOptions),
            Note = request.Note?.Trim() ?? "",
            OpenRate = request.OpenRate ?? 0,
            ClickRate = 0,
            ListId = listIds.FirstOrDefault(),
            JoinedAt = DateTime.UtcNow
        };
        db.Subscribers.Add(subscriber);
        db.SubscriberActivities.Add(new SubscriberActivity
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            SubscriberId = subscriber.Id,
            ActivityType = "profile_added",
            Title = "Added by you",
            Description = $"Contact added on {subscriber.JoinedAt:MMMM d, yyyy}",
            Status = "completed",
            OccurredAt = subscriber.JoinedAt
        });
        await db.SaveChangesAsync();
        return MapSubscriber(subscriber);
    }

    public async Task<ImportSubscribersResult> ImportSubscribersAsync(Guid userId, ImportSubscribersRequest request)
    {
        var errors = new List<string>();
        var contacts = request.Contacts ?? [];

        // Resolve target list: create a new one if a name was supplied, otherwise use the selected list.
        AudienceList? targetList = null;
        if (!string.IsNullOrWhiteSpace(request.NewListName))
        {
            var now = DateTime.UtcNow;
            targetList = new AudienceList
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Name = request.NewListName.Trim(),
                Description = "Imported subscribers",
                Color = "#3b82f6",
                OptInMethod = "Single",
                CreatedAt = now,
                UpdatedAt = now
            };
            db.AudienceLists.Add(targetList);
            await db.SaveChangesAsync();
        }
        else if (request.ListId.HasValue)
        {
            targetList = await db.AudienceLists
                .FirstOrDefaultAsync(l => l.Id == request.ListId.Value && l.UserId == userId);
            if (targetList is null)
                errors.Add("Selected list was not found; contacts were imported without a list.");
        }

        var globalTags = (request.Tags ?? [])
            .Select(t => t.Trim())
            .Where(t => t.Length > 0)
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        var duplicateMode = string.IsNullOrWhiteSpace(request.DuplicateMode)
            ? "skip"
            : request.DuplicateMode.Trim().ToLowerInvariant();

        var existing = await db.Subscribers.Where(s => s.UserId == userId).ToListAsync();
        var byEmail = new Dictionary<string, Subscriber>(StringComparer.OrdinalIgnoreCase);
        foreach (var s in existing)
            byEmail.TryAdd(s.Email.Trim().ToLowerInvariant(), s);

        var seenInFile = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        int imported = 0, updated = 0, skipped = 0, invalid = 0, duplicatesInFile = 0;
        var now2 = DateTime.UtcNow;

        foreach (var row in contacts)
        {
            var email = (row.Email ?? "").Trim().ToLowerInvariant();
            if (!IsValidEmail(email))
            {
                invalid++;
                continue;
            }

            if (!seenInFile.Add(email))
            {
                duplicatesInFile++;
                continue;
            }

            var name = ResolveContactName(row);
            var rowTags = MergeTags(globalTags, row.Tags);
            var status = NormalizeStatus(row.Status);

            if (byEmail.TryGetValue(email, out var existingSub))
            {
                if (duplicateMode == "skip")
                {
                    skipped++;
                    continue;
                }

                // update mode: merge into the existing subscriber
                if (!string.IsNullOrWhiteSpace(name)) existingSub.Name = name;
                if (rowTags.Count > 0)
                {
                    var merged = ParseTags(existingSub.TagsJson)
                        .Concat(rowTags)
                        .Select(t => t.Trim())
                        .Where(t => t.Length > 0)
                        .Distinct(StringComparer.OrdinalIgnoreCase)
                        .ToList();
                    existingSub.TagsJson = JsonSerializer.Serialize(merged, JsonOptions);
                }
                if (targetList is not null)
                {
                    var listIds = ParseListIds(existingSub);
                    if (!listIds.Contains(targetList.Id))
                    {
                        listIds.Add(targetList.Id);
                        existingSub.ListIdsJson = JsonSerializer.Serialize(
                            listIds.Select(id => id.ToString()).ToList(), JsonOptions);
                        existingSub.ListId ??= targetList.Id;
                    }
                }
                updated++;
                continue;
            }

            var listIdsForNew = targetList is not null ? new List<Guid> { targetList.Id } : new List<Guid>();
            var subscriber = new Subscriber
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Name = string.IsNullOrWhiteSpace(name) ? email.Split('@')[0] : name,
                Email = email,
                Status = status,
                TagsJson = JsonSerializer.Serialize(rowTags, JsonOptions),
                ListIdsJson = JsonSerializer.Serialize(listIdsForNew.Select(id => id.ToString()).ToList(), JsonOptions),
                Note = "",
                OpenRate = 0,
                ClickRate = 0,
                ListId = listIdsForNew.FirstOrDefault(),
                JoinedAt = now2
            };
            db.Subscribers.Add(subscriber);
            db.SubscriberActivities.Add(new SubscriberActivity
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                SubscriberId = subscriber.Id,
                ActivityType = "profile_added",
                Title = "Imported",
                Description = $"Imported on {now2:MMMM d, yyyy}",
                Status = "completed",
                OccurredAt = now2
            });
            byEmail[email] = subscriber;
            imported++;
        }

        if (targetList is not null)
            targetList.UpdatedAt = now2;

        await db.SaveChangesAsync();

        return new ImportSubscribersResult(
            contacts.Count, imported, updated, skipped, invalid, duplicatesInFile,
            targetList?.Id.ToString(), targetList?.Name, errors);
    }

    private static string ResolveContactName(ImportContactRow row)
    {
        if (!string.IsNullOrWhiteSpace(row.Name)) return row.Name.Trim();
        var joined = string.Join(" ", new[] { row.FirstName, row.LastName }
            .Where(p => !string.IsNullOrWhiteSpace(p))
            .Select(p => p!.Trim()));
        return joined;
    }

    private static List<string> MergeTags(List<string> globalTags, List<string>? rowTags)
    {
        return globalTags
            .Concat(rowTags ?? [])
            .Select(t => t.Trim())
            .Where(t => t.Length > 0)
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();
    }

    private static string NormalizeStatus(string? status)
    {
        var s = (status ?? "").Trim().ToLowerInvariant();
        return s switch
        {
            "active" or "subscribed" or "confirmed" => "active",
            "unsubscribed" or "unsub" or "opted_out" or "opted out" => "unsubscribed",
            "bounced" or "bounce" => "bounced",
            "inactive" => "inactive",
            _ => "active"
        };
    }

    private static bool IsValidEmail(string email)
    {
        if (string.IsNullOrWhiteSpace(email)) return false;
        var at = email.IndexOf('@');
        if (at <= 0 || at != email.LastIndexOf('@')) return false;
        var dot = email.IndexOf('.', at);
        return dot > at + 1 && dot < email.Length - 1;
    }

    public async Task<SubscriberProfileDetailDto?> GetProfileDetailAsync(Guid userId, Guid id)
    {
        var subscriber = await db.Subscribers.FirstOrDefaultAsync(s => s.Id == id && s.UserId == userId);
        if (subscriber is null) return null;

        await EnsureSubscriberActivitiesAsync(userId, subscriber);

        var lists = await db.AudienceLists.Where(l => l.UserId == userId).ToListAsync();
        var segments = await db.AudienceSegmentItems.Where(s => s.UserId == userId).ToListAsync();
        var allSubscribers = await db.Subscribers.Where(s => s.UserId == userId).ToListAsync();
        var activities = await db.SubscriberActivities
            .Where(a => a.SubscriberId == id && a.UserId == userId)
            .OrderByDescending(a => a.OccurredAt).Take(50).ToListAsync();

        var memberListIds = ParseListIds(subscriber);
        var memberLists = lists.Where(l => memberListIds.Contains(l.Id))
            .Select(l => new ProfileListItemDto(l.Id.ToString(), l.Name, l.Color)).ToList();

        var matchedSegments = segments
            .Where(seg => SubscriberMatchesRule(subscriber, seg.RuleType, seg.RuleConfigJson, lists))
            .Select(seg => new ProfileSegmentItemDto(seg.Id.ToString(), seg.Name, RuleLabel(seg.RuleType, seg.RuleConfigJson, lists)))
            .ToList();

        var stats = BuildCampaignStats(subscriber, activities);
        var (first, last) = SplitName(subscriber.Name);

        return new SubscriberProfileDetailDto(
            subscriber.Id.ToString(), first, last, subscriber.Email, subscriber.Status,
            ParseTags(subscriber.TagsJson), subscriber.OpenRate, subscriber.ClickRate,
            subscriber.JoinedAt.ToString("MMMM d, yyyy"), subscriber.Note,
            new ProfileChannelDto(
                subscriber.Status == "active",
                subscriber.Status == "active",
                subscriber.Status is "unsubscribed" or "bounced"),
            stats,
            memberLists, lists.Count,
            matchedSegments,
            activities.Select(MapActivity).ToList());
    }

    public async Task<SubscriberProfileDetailDto?> UpdateProfileAsync(Guid userId, Guid id, UpdateSubscriberRequest request)
    {
        var subscriber = await db.Subscribers.FirstOrDefaultAsync(s => s.Id == id && s.UserId == userId);
        if (subscriber is null) return null;

        if (!string.IsNullOrWhiteSpace(request.Name)) subscriber.Name = request.Name.Trim();
        if (!string.IsNullOrWhiteSpace(request.Email)) subscriber.Email = request.Email.Trim().ToLowerInvariant();
        if (!string.IsNullOrWhiteSpace(request.Status)) subscriber.Status = request.Status;
        if (request.Tags is not null) subscriber.TagsJson = JsonSerializer.Serialize(request.Tags, JsonOptions);
        if (request.OpenRate.HasValue) subscriber.OpenRate = request.OpenRate.Value;
        if (request.ClickRate.HasValue) subscriber.ClickRate = request.ClickRate.Value;
        if (request.Note is not null) subscriber.Note = request.Note;
        if (request.ListIds is not null)
        {
            var listGuids = request.ListIds
                .Select(s => Guid.TryParse(s, out var g) ? g : (Guid?)null)
                .Where(g => g.HasValue).Select(g => g!.Value).Distinct().ToList();
            subscriber.ListIdsJson = JsonSerializer.Serialize(listGuids.Select(g => g.ToString()).ToList(), JsonOptions);
            subscriber.ListId = listGuids.FirstOrDefault();
        }

        await db.SaveChangesAsync();
        return await GetProfileDetailAsync(userId, id);
    }

    public async Task<bool> DeleteProfileAsync(Guid userId, Guid id)
    {
        var subscriber = await db.Subscribers.FirstOrDefaultAsync(s => s.Id == id && s.UserId == userId);
        if (subscriber is null) return false;

        var activities = await db.SubscriberActivities.Where(a => a.SubscriberId == id).ToListAsync();
        if (activities.Count > 0)
            db.SubscriberActivities.RemoveRange(activities);

        db.Subscribers.Remove(subscriber);
        await db.SaveChangesAsync();
        return true;
    }

    private static readonly SegmentTemplateDto[] EmailSegmentTemplates =
    [
        new("active", "All active email subscribers", "Subscribed contacts who can receive email campaigns", "active", "Subscription"),
        new("high_engagement", "Highly engaged readers", "Contacts with email open rate above 50%", "open_rate_gt_50", "Engagement"),
        new("low_engagement", "Low engagement", "Contacts with email open rate below 10%", "open_rate_lt_10", "Engagement"),
        new("new_subscribers", "New email subscribers", "Subscribed in the last 30 days", "new_30d", "Subscription"),
        new("re_engagement", "Re-engagement needed", "Inactive subscribers who haven't engaged recently", "inactive_90d", "Engagement"),
        new("never_opened", "Never opened an email", "Subscribers who have never opened a campaign", "never_opened", "Engagement"),
        new("bounced", "Bounced email addresses", "Contacts with hard or soft bounces", "bounced", "Deliverability"),
        new("unsubscribed", "Unsubscribed", "Contacts who opted out of email campaigns", "unsubscribed", "Subscription"),
    ];

    public async Task<ListsSegmentsBundleDto> GetListsSegmentsAsync(Guid userId)
    {
        await EnsureDefaultFoldersAsync(userId);

        var folders = await db.AudienceFolders.Where(f => f.UserId == userId).OrderBy(f => f.Name).ToListAsync();
        var lists = await db.AudienceLists.Where(l => l.UserId == userId).Include(l => l.Folder)
            .OrderByDescending(l => l.UpdatedAt).ToListAsync();
        var segments = await db.AudienceSegmentItems.Where(s => s.UserId == userId).Include(s => s.Folder)
            .OrderByDescending(s => s.UpdatedAt).ToListAsync();
        var subscribers = await db.Subscribers.Where(s => s.UserId == userId).ToListAsync();

        var listFolderDtos = folders.Where(f => f.Kind == "list").Select(f => new AudienceFolderDto(
            f.Id.ToString(), f.Name, f.Kind,
            lists.Count(l => l.FolderId == f.Id))).ToList();

        var segmentFolderDtos = folders.Where(f => f.Kind == "segment").Select(f => new AudienceFolderDto(
            f.Id.ToString(), f.Name, f.Kind,
            segments.Count(s => s.FolderId == f.Id))).ToList();

        var listDtos = lists.Select(l => MapList(l, subscribers)).ToList();
        var segmentDtos = segments.Select(s => MapSegment(s, subscribers, lists)).ToList();

        var overview = new ListsSegmentsOverviewDto(
            subscribers.Count,
            subscribers.Count(s => s.Status == "active"),
            lists.Count,
            segments.Count,
            "Email");

        return new ListsSegmentsBundleDto(
            overview, listFolderDtos, segmentFolderDtos, listDtos, segmentDtos,
            EmailSegmentTemplates.ToList());
    }

    public async Task<AudienceFolderDto> CreateFolderAsync(Guid userId, CreateAudienceFolderRequest request)
    {
        var kind = string.IsNullOrWhiteSpace(request.Kind) ? "list" : request.Kind.Trim().ToLowerInvariant();
        var folder = new AudienceFolder
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Kind = kind is "segment" ? "segment" : "list",
            Name = request.Name.Trim(),
            CreatedAt = DateTime.UtcNow
        };
        db.AudienceFolders.Add(folder);
        await db.SaveChangesAsync();
        return new AudienceFolderDto(folder.Id.ToString(), folder.Name, folder.Kind, 0);
    }

    public async Task<AudienceListDto> CreateListAsync(Guid userId, CreateAudienceListRequest request)
    {
        var now = DateTime.UtcNow;
        var list = new AudienceList
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            FolderId = request.FolderId,
            Name = request.Name.Trim(),
            Description = request.Description?.Trim() ?? "",
            Color = string.IsNullOrWhiteSpace(request.Color) ? "#3b82f6" : request.Color,
            OptInMethod = string.IsNullOrWhiteSpace(request.OptInMethod) ? "Double" : request.OptInMethod,
            CreatedAt = now,
            UpdatedAt = now
        };
        db.AudienceLists.Add(list);
        await db.SaveChangesAsync();
        await db.Entry(list).Reference(l => l.Folder).LoadAsync();
        return MapList(list, []);
    }

    public async Task<AudienceSegmentCardDto> CreateSegmentAsync(Guid userId, CreateAudienceSegmentRequest request)
    {
        var now = DateTime.UtcNow;
        var segment = new AudienceSegmentItem
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            FolderId = request.FolderId,
            Name = request.Name.Trim(),
            Description = request.Description?.Trim() ?? "",
            Color = string.IsNullOrWhiteSpace(request.Color) ? "#10b981" : request.Color,
            RuleType = string.IsNullOrWhiteSpace(request.RuleType) ? "active" : request.RuleType,
            RuleConfigJson = string.IsNullOrWhiteSpace(request.RuleConfigJson) ? "{}" : request.RuleConfigJson,
            CreatedAt = now,
            UpdatedAt = now
        };
        db.AudienceSegmentItems.Add(segment);
        await db.SaveChangesAsync();
        await db.Entry(segment).Reference(s => s.Folder).LoadAsync();
        var subscribers = await db.Subscribers.Where(s => s.UserId == userId).ToListAsync();
        var lists = await db.AudienceLists.Where(l => l.UserId == userId).ToListAsync();
        return MapSegment(segment, subscribers, lists);
    }

    private async Task EnsureDefaultFoldersAsync(Guid userId)
    {
        if (await db.AudienceFolders.AnyAsync(f => f.UserId == userId)) return;
        var now = DateTime.UtcNow;
        db.AudienceFolders.AddRange(
            new AudienceFolder { Id = Guid.NewGuid(), UserId = userId, Kind = "list", Name = "Newsletter", CreatedAt = now },
            new AudienceFolder { Id = Guid.NewGuid(), UserId = userId, Kind = "list", Name = "Launch & ARC", CreatedAt = now },
            new AudienceFolder { Id = Guid.NewGuid(), UserId = userId, Kind = "segment", Name = "Engagement", CreatedAt = now },
            new AudienceFolder { Id = Guid.NewGuid(), UserId = userId, Kind = "segment", Name = "Deliverability", CreatedAt = now }
        );
        await db.SaveChangesAsync();
    }

    private static AudienceListDto MapList(AudienceList l, List<Subscriber> subscribers) => new(
        l.Id.ToString(), l.Name, l.Description,
        subscribers.Count(s => ParseListIds(s).Contains(l.Id)),
        l.Color, l.OptInMethod,
        l.CreatedAt.ToString("MMM d, yyyy"),
        l.UpdatedAt.ToString("MMM d, yyyy"),
        l.FolderId?.ToString(), l.Folder?.Name);

    private static AudienceSegmentCardDto MapSegment(
        AudienceSegmentItem s, List<Subscriber> subscribers, List<AudienceList> lists) => new(
        s.Id.ToString(), s.Name, s.Description,
        CountForRule(subscribers, s.RuleType, s.RuleConfigJson),
        s.Color, s.RuleType,
        RuleLabel(s.RuleType, s.RuleConfigJson, lists),
        s.FolderId?.ToString(), s.Folder?.Name,
        s.CreatedAt.ToString("MMM d, yyyy"),
        s.UpdatedAt.ToString("MMM d, yyyy"),
        true);

    private static string RuleLabel(string ruleType, string ruleConfigJson, List<AudienceList> lists)
    {
        if (ruleType == "member_of_list")
        {
            try
            {
                using var doc = JsonDocument.Parse(ruleConfigJson);
                if (doc.RootElement.TryGetProperty("listId", out var idEl)
                    && Guid.TryParse(idEl.GetString(), out var listId))
                {
                    var list = lists.FirstOrDefault(l => l.Id == listId);
                    return list is null ? "Member of list" : $"Member of \"{list.Name}\"";
                }
            }
            catch { /* ignore */ }
            return "Member of list";
        }

        return ruleType switch
        {
            "open_rate_gt_50" => "Email open rate > 50%",
            "open_rate_lt_10" => "Email open rate < 10%",
            "inactive_90d" => "Inactive 90+ days",
            "bounced" => "Bounced email address",
            "new_30d" => "Subscribed in last 30 days",
            "never_opened" => "Never opened an email",
            "unsubscribed" => "Unsubscribed from email",
            "active" => "Subscribed to email campaigns",
            _ => "Custom email rule"
        };
    }

    private static int CountForRule(List<Subscriber> subscribers, string ruleType, string ruleConfigJson = "{}") => ruleType switch
    {
        "open_rate_gt_50" => subscribers.Count(s => s.OpenRate > 50 && s.Status == "active"),
        "open_rate_lt_10" => subscribers.Count(s => s.OpenRate < 10 && s.Status == "active"),
        "inactive_90d" => subscribers.Count(s => s.Status == "inactive"),
        "bounced" => subscribers.Count(s => s.Status == "bounced"),
        "new_30d" => subscribers.Count(s => s.JoinedAt >= DateTime.UtcNow.AddDays(-30)),
        "never_opened" => subscribers.Count(s => s.OpenRate == 0 && s.Status == "active"),
        "unsubscribed" => subscribers.Count(s => s.Status == "unsubscribed"),
        "member_of_list" => CountMemberOfList(subscribers, ruleConfigJson),
        "active" => subscribers.Count(s => s.Status == "active"),
        _ => subscribers.Count(s => s.Status == "active")
    };

    private static int CountMemberOfList(List<Subscriber> subscribers, string ruleConfigJson)
    {
        try
        {
            using var doc = JsonDocument.Parse(ruleConfigJson);
            if (doc.RootElement.TryGetProperty("listId", out var idEl)
                && Guid.TryParse(idEl.GetString(), out var listId))
                return subscribers.Count(s => ParseListIds(s).Contains(listId));
        }
        catch { /* ignore */ }
        return 0;
    }

    public async Task<GrowthToolsBundleDto> GetGrowthToolsAsync(Guid userId)
    {
        var configs = await db.GrowthToolConfigs.Where(c => c.UserId == userId).ToListAsync();
        var configMap = configs.ToDictionary(c => c.ToolKey, c => c.ConfigJson);
        var tools = ToolCatalog.Select(t => t with
        {
            ConfigJson = configMap.GetValueOrDefault(t.Key)
        }).ToList();
        return new GrowthToolsBundleDto(tools);
    }

    public async Task SaveGrowthToolConfigAsync(Guid userId, string toolKey, SaveGrowthToolConfigRequest request)
    {
        var existing = await db.GrowthToolConfigs.FindAsync(userId, toolKey);
        if (existing is null)
        {
            db.GrowthToolConfigs.Add(new GrowthToolConfig
            {
                UserId = userId,
                ToolKey = toolKey,
                ConfigJson = request.ConfigJson ?? "{}",
                UpdatedAt = DateTime.UtcNow
            });
        }
        else
        {
            existing.ConfigJson = request.ConfigJson ?? "{}";
            existing.UpdatedAt = DateTime.UtcNow;
        }
        await db.SaveChangesAsync();
    }

    private static SubscriberProfileDto MapSubscriber(Subscriber s)
    {
        return new SubscriberProfileDto(
            s.Id.ToString(), s.Name, s.Email, s.Status, ParseTags(s.TagsJson), s.OpenRate,
            s.JoinedAt.ToString("MMM d, yyyy"), s.ListId?.ToString());
    }

    private static List<string> ParseTags(string json)
    {
        try { return JsonSerializer.Deserialize<List<string>>(json, JsonOptions) ?? []; }
        catch { return []; }
    }

    private static List<Guid> ParseListIds(Subscriber s)
    {
        var ids = new List<Guid>();
        if (s.ListId.HasValue) ids.Add(s.ListId.Value);
        try
        {
            var fromJson = JsonSerializer.Deserialize<List<string>>(s.ListIdsJson, JsonOptions) ?? [];
            foreach (var id in fromJson)
                if (Guid.TryParse(id, out var g) && !ids.Contains(g)) ids.Add(g);
        }
        catch { /* ignore */ }
        return ids;
    }

    private static List<Guid> ResolveListIds(List<string>? listIds, Guid? listId)
    {
        var ids = new List<Guid>();
        if (listId.HasValue) ids.Add(listId.Value);
        if (listIds is not null)
            foreach (var s in listIds)
                if (Guid.TryParse(s, out var g) && !ids.Contains(g)) ids.Add(g);
        return ids;
    }

    private static (string First, string Last) SplitName(string name)
    {
        var parts = name.Trim().Split(' ', 2, StringSplitOptions.RemoveEmptyEntries);
        return parts.Length switch
        {
            0 => ("", ""),
            1 => (parts[0], ""),
            _ => (parts[0], parts[1])
        };
    }

    private static bool SubscriberMatchesRule(Subscriber s, string ruleType, string ruleConfigJson, List<AudienceList> lists)
    {
        return ruleType switch
        {
            "open_rate_gt_50" => s.OpenRate > 50 && s.Status == "active",
            "open_rate_lt_10" => s.OpenRate < 10 && s.Status == "active",
            "inactive_90d" => s.Status == "inactive",
            "bounced" => s.Status == "bounced",
            "new_30d" => s.JoinedAt >= DateTime.UtcNow.AddDays(-30),
            "never_opened" => s.OpenRate == 0 && s.Status == "active",
            "unsubscribed" => s.Status == "unsubscribed",
            "member_of_list" => IsMemberOfList(s, ruleConfigJson),
            "active" => s.Status == "active",
            _ => s.Status == "active"
        };
    }

    private static bool IsMemberOfList(Subscriber s, string ruleConfigJson)
    {
        try
        {
            using var doc = JsonDocument.Parse(ruleConfigJson);
            if (doc.RootElement.TryGetProperty("listId", out var idEl)
                && Guid.TryParse(idEl.GetString(), out var listId))
                return ParseListIds(s).Contains(listId);
        }
        catch { /* ignore */ }
        return false;
    }

    public async Task<List<Subscriber>> ResolveCampaignRecipientsAsync(
        Guid userId, Campaign campaign, IReadOnlyList<string>? suppressionRules = null)
    {
        var extras = ParseExtrasDict(campaign.ExtrasJson);
        var contactIds = ParseStringListFromJson(extras.GetValueOrDefault("recipientContactIds"));
        var listIds = ParseStringListFromJson(extras.GetValueOrDefault("recipientListIds"));
        var segmentIds = ParseStringListFromJson(extras.GetValueOrDefault("recipientSegmentIds"));
        var excludeUnengaged = extras.GetValueOrDefault("excludeUnengaged") == "true";
        var rules = suppressionRules ?? ParseSuppressionFromExtras(extras);

        var arcTag = extras.GetValueOrDefault("arcTag");
        return await ResolveAudienceRecipientsAsync(
            userId, listIds, segmentIds, contactIds, excludeUnengaged, rules, campaign.SendToSegment, arcTag);
    }

    public async Task<List<Subscriber>> ResolveAudienceRecipientsAsync(
        Guid userId,
        IReadOnlyList<string>? listIds,
        IReadOnlyList<string>? segmentIds,
        IReadOnlyList<string>? contactIds,
        bool excludeUnengaged,
        IReadOnlyList<string>? suppressionRules,
        string? fallbackSegment,
        string? arcTag = null)
    {
        var subscribers = await db.Subscribers.Where(s => s.UserId == userId).ToListAsync();
        if (subscribers.Count == 0) return [];

        var lists = await db.AudienceLists.Where(l => l.UserId == userId).ToListAsync();
        var segments = await db.AudienceSegmentItems.Where(s => s.UserId == userId).ToListAsync();
        var parsedListIds = ParseGuidListFromStrings(listIds);
        var parsedSegmentIds = ParseGuidListFromStrings(segmentIds);
        var parsedContactIds = ParseGuidListFromStrings(contactIds);
        var rules = suppressionRules ?? [];

        var recipientIds = new HashSet<Guid>();

        foreach (var id in parsedContactIds)
        {
            if (subscribers.Any(s => s.Id == id)) recipientIds.Add(id);
        }

        if (parsedListIds.Count > 0)
        {
            foreach (var s in subscribers)
            {
                if (parsedListIds.Any(lid => ParseListIds(s).Contains(lid)))
                    recipientIds.Add(s.Id);
            }
        }

        if (parsedSegmentIds.Count > 0)
        {
            var selectedSegments = segments.Where(seg => parsedSegmentIds.Contains(seg.Id)).ToList();
            foreach (var s in subscribers)
            {
                if (selectedSegments.Any(seg => SubscriberMatchesRule(s, seg.RuleType, seg.RuleConfigJson, lists)))
                    recipientIds.Add(s.Id);
            }
        }

        if (recipientIds.Count == 0 && Guid.TryParse(fallbackSegment, out var segmentGuid))
        {
            var seg = segments.FirstOrDefault(s => s.Id == segmentGuid);
            if (seg is not null)
            {
                var active = subscribers.Where(s => s.Status == "active").ToList();
                foreach (var s in active.Where(s => SubscriberMatchesRule(s, seg.RuleType, seg.RuleConfigJson, lists)))
                    recipientIds.Add(s.Id);
            }
        }

        var results = subscribers.Where(s => recipientIds.Contains(s.Id)).ToList();
        if (excludeUnengaged)
            results = results.Where(s => s.OpenRate >= 10 || s.OpenRate == 0).ToList();

        results = await ApplySuppressionAsync(userId, results, rules, arcTag);
        if (parsedContactIds.Count > 0)
            return results.Where(s => s.Status == "active" || parsedContactIds.Contains(s.Id)).ToList();

        return results.Where(s => s.Status == "active").ToList();
    }

    public async Task RecordCampaignSendActivitiesAsync(Guid userId, Campaign campaign, IReadOnlyList<Subscriber> recipients)
    {
        if (recipients.Count == 0) return;

        var sentAt = campaign.SentAt ?? DateTime.UtcNow;
        var fromEmail = TryReadExtra(campaign.ExtrasJson, "fromEmail") ?? campaign.FromName;

        var alreadySent = await db.SubscriberActivities
            .Where(a => a.CampaignId == campaign.Id && a.ActivityType == "campaign_sent")
            .Select(a => a.SubscriberId)
            .ToListAsync();
        var existing = alreadySent.ToHashSet();

        foreach (var subscriber in recipients)
        {
            if (subscriber.UserId != userId) continue;
            if (existing.Contains(subscriber.Id)) continue;

            db.SubscriberActivities.Add(new SubscriberActivity
            {
                Id = Guid.NewGuid(), UserId = userId, SubscriberId = subscriber.Id,
                ActivityType = "campaign_sent", Title = "Email campaign sent",
                Description = campaign.Name, CampaignId = campaign.Id,
                CampaignSubject = campaign.Subject, CampaignFrom = fromEmail,
                Status = "sent", OccurredAt = sentAt
            });
            db.SubscriberActivities.Add(new SubscriberActivity
            {
                Id = Guid.NewGuid(), UserId = userId, SubscriberId = subscriber.Id,
                ActivityType = "campaign_delivered", Title = "Email campaign delivered",
                Description = $"({campaign.Name}) {campaign.Subject}",
                CampaignId = campaign.Id, CampaignSubject = campaign.Subject, CampaignFrom = fromEmail,
                Status = "delivered", OccurredAt = sentAt.AddMinutes(1)
            });
        }

        foreach (var subscriber in recipients)
        {
            var acts = await db.SubscriberActivities
                .Where(a => a.SubscriberId == subscriber.Id && a.UserId == userId)
                .ToListAsync();
            var sent = acts.Count(a => a.ActivityType == "campaign_sent");
            if (sent == 0) continue;
            var opens = acts.Count(a => a.ActivityType == "campaign_opened");
            var clicks = acts.Count(a => a.ActivityType == "campaign_clicked");
            subscriber.OpenRate = Math.Round(opens * 100m / sent, 1);
            subscriber.ClickRate = Math.Round(clicks * 100m / sent, 1);
        }
    }

    private static ProfileCampaignStatsDto BuildCampaignStats(Subscriber s, List<SubscriberActivity> activities)
    {
        var sent = activities.Count(a => a.ActivityType == "campaign_sent");
        var delivered = activities.Count(a => a.ActivityType == "campaign_delivered");
        if (delivered == 0 && sent > 0) delivered = sent;
        var opens = activities.Count(a => a.ActivityType == "campaign_opened");
        var clicks = activities.Count(a => a.ActivityType == "campaign_clicked");

        static int Pct(int part, int total) => total == 0 ? 0 : (int)Math.Round(part * 100m / total);

        return new ProfileCampaignStatsDto(
            sent, delivered, Pct(delivered, sent),
            opens, Pct(opens, delivered),
            clicks, Pct(clicks, delivered));
    }

    private static ProfileActivityDto MapActivity(SubscriberActivity a) => new(
        a.Id.ToString(), a.ActivityType, a.Title, a.Description,
        a.CampaignId?.ToString(), a.CampaignSubject, a.CampaignFrom,
        a.Status, a.OccurredAt.ToString("MMMM d, yyyy 'at' h:mm tt"),
        RelativeTime(a.OccurredAt));

    private static string RelativeTime(DateTime dt)
    {
        var diff = DateTime.UtcNow - dt;
        if (diff.TotalMinutes < 60) return $"{Math.Max(1, (int)diff.TotalMinutes)} minutes ago";
        if (diff.TotalHours < 24) return $"{(int)diff.TotalHours} hours ago";
        if (diff.TotalDays < 7) return $"{(int)diff.TotalDays} days ago";
        return dt.ToString("MMM d, yyyy");
    }

    private async Task EnsureSubscriberActivitiesAsync(Guid userId, Subscriber subscriber)
    {
        var hasActivities = await db.SubscriberActivities.AnyAsync(a => a.SubscriberId == subscriber.Id);
        if (hasActivities) return;

        var joined = new SubscriberActivity
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            SubscriberId = subscriber.Id,
            ActivityType = "profile_added",
            Title = "Added by you",
            Description = $"Added by you on {subscriber.JoinedAt:MMMM d, yyyy}",
            Status = "completed",
            OccurredAt = subscriber.JoinedAt
        };
        db.SubscriberActivities.Add(joined);
        await db.SaveChangesAsync();
    }

    private static string? TryReadExtra(string json, string key)
    {
        try
        {
            using var doc = JsonDocument.Parse(json);
            if (doc.RootElement.TryGetProperty(key, out var el)) return el.GetString();
        }
        catch { /* ignore */ }
        return null;
    }

    private static Dictionary<string, string> ParseExtrasDict(string json)
    {
        if (string.IsNullOrWhiteSpace(json) || json == "{}") return new Dictionary<string, string>();
        try
        {
            return JsonSerializer.Deserialize<Dictionary<string, string>>(json, JsonOptions)
                ?? new Dictionary<string, string>();
        }
        catch { return new Dictionary<string, string>(); }
    }

    private static List<string> ParseStringListFromJson(string? json)
    {
        if (string.IsNullOrWhiteSpace(json)) return [];
        try
        {
            return JsonSerializer.Deserialize<List<string>>(json, JsonOptions) ?? [];
        }
        catch { return []; }
    }

    private static List<Guid> ParseGuidListFromStrings(IReadOnlyList<string>? ids)
    {
        if (ids is null || ids.Count == 0) return [];
        return ids.Select(s => Guid.TryParse(s, out var g) ? g : (Guid?)null)
            .Where(g => g.HasValue).Select(g => g!.Value).Distinct().ToList();
    }

    private static List<Guid> ParseGuidListFromJson(string? json)
    {
        if (string.IsNullOrWhiteSpace(json)) return [];
        try
        {
            var ids = JsonSerializer.Deserialize<List<string>>(json, JsonOptions) ?? [];
            return ids.Select(s => Guid.TryParse(s, out var g) ? g : (Guid?)null)
                .Where(g => g.HasValue).Select(g => g!.Value).Distinct().ToList();
        }
        catch { return []; }
    }

    private static List<string> ParseSuppressionFromExtras(Dictionary<string, string> extras)
    {
        if (!extras.TryGetValue("suppressionRules", out var json) || string.IsNullOrWhiteSpace(json)) return [];
        try { return JsonSerializer.Deserialize<List<string>>(json, JsonOptions) ?? []; }
        catch { return []; }
    }

    private async Task<List<Subscriber>> ApplySuppressionAsync(
        Guid userId, List<Subscriber> subs, IReadOnlyList<string> rules, string? arcTag)
    {
        if (rules.Count == 0) return subs;

        var subscriberIds = subs.Select(s => s.Id).ToList();
        var activities = subscriberIds.Count == 0
            ? []
            : await db.SubscriberActivities
                .Where(a => a.UserId == userId && subscriberIds.Contains(a.SubscriberId))
                .ToListAsync();
        var bySubscriber = activities
            .GroupBy(a => a.SubscriberId)
            .ToDictionary(g => g.Key, g => (IReadOnlyList<SubscriberActivity>)g.ToList());

        return subs.Where(s => !ShouldSuppressSubscriber(s, rules, bySubscriber, arcTag)).ToList();
    }

    private static bool ShouldSuppressSubscriber(
        Subscriber s,
        IReadOnlyList<string> rules,
        IReadOnlyDictionary<Guid, IReadOnlyList<SubscriberActivity>> activitiesBySubscriber,
        string? arcTag)
    {
        if (rules.Contains("bounced") && s.Status == "bounced") return true;
        if (rules.Contains("recent-unsubs") && IsRecentUnsubscriber(s, activitiesBySubscriber)) return true;
        if (rules.Contains("new-subscribers") && s.JoinedAt >= DateTime.UtcNow.AddHours(-48)) return true;
        if (rules.Contains("existing-buyers") && IsExistingBuyer(s, activitiesBySubscriber)) return true;
        if (rules.Contains("arc-readers") && IsArcReader(s, arcTag)) return true;
        return false;
    }

    private static bool IsRecentUnsubscriber(
        Subscriber s,
        IReadOnlyDictionary<Guid, IReadOnlyList<SubscriberActivity>> activitiesBySubscriber)
    {
        if (s.Status == "unsubscribed") return true;
        if (!activitiesBySubscriber.TryGetValue(s.Id, out var acts)) return false;

        var cutoff = DateTime.UtcNow.AddDays(-30);
        return acts.Any(a =>
            a.OccurredAt >= cutoff &&
            (a.ActivityType is "unsubscribed" or "unsubscribe"
             || a.Title.Contains("unsubscrib", StringComparison.OrdinalIgnoreCase)
             || a.Description.Contains("unsubscrib", StringComparison.OrdinalIgnoreCase)));
    }

    private static bool IsExistingBuyer(
        Subscriber s,
        IReadOnlyDictionary<Guid, IReadOnlyList<SubscriberActivity>> activitiesBySubscriber)
    {
        if (HasAnyTag(s, "buyer", "purchased", "existing-buyer", "pre-order", "preorder", "customer", "preorder-buyer"))
            return true;

        if (!activitiesBySubscriber.TryGetValue(s.Id, out var acts)) return false;

        return acts.Any(a =>
            a.ActivityType is "purchase" or "order" or "order_confirmed" or "pre_order" or "book_purchase"
            || a.Title.Contains("purchase", StringComparison.OrdinalIgnoreCase)
            || a.Title.Contains("ordered", StringComparison.OrdinalIgnoreCase)
            || a.Description.Contains("purchase", StringComparison.OrdinalIgnoreCase));
    }

    private static bool IsArcReader(Subscriber s, string? arcTag)
    {
        var tags = new List<string> { "arc-reader", "arc", "arc_reader", "advance-reader", "arc-team" };
        if (!string.IsNullOrWhiteSpace(arcTag))
            tags.Add(arcTag.Trim());
        return HasAnyTag(s, tags.ToArray());
    }

    private static bool HasAnyTag(Subscriber s, params string[] tags)
    {
        var normalized = ParseTags(s.TagsJson)
            .Select(t => t.Trim().ToLowerInvariant())
            .Where(t => t.Length > 0)
            .ToHashSet();
        return tags.Any(t => normalized.Contains(t.Trim().ToLowerInvariant()));
    }

    private static bool SimulateEngagement(Guid subscriberId, Guid campaignId, decimal rate, int salt = 0)
    {
        if (rate <= 0) return false;
        var bucket = Math.Abs(HashCode.Combine(subscriberId, campaignId, salt)) % 100;
        return bucket < (int)Math.Round(rate);
    }
}
