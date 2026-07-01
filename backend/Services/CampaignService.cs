using System.Globalization;
using System.Text.Json;
using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore;
using ScribeCount.Email.Api.Data;
using ScribeCount.Email.Api.DTOs;
using ScribeCount.Email.Api.Entities;

namespace ScribeCount.Email.Api.Services;

public class CampaignService(AppDbContext db, AudienceService audience, MailboxService mailbox, CampaignTrackingService tracking, ILogger<CampaignService> logger)
{
    private static readonly JsonSerializerOptions JsonOptions = new() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

    private static readonly Dictionary<string, (string Name, string Description, double Share)> SegmentDefinitions = new()
    {
        ["all"] = ("All Subscribers", "Your entire active subscriber list", 1.0),
        ["vip"] = ("VIP Readers", "Highly engaged subscribers", 0.12),
        ["launch"] = ("Launch List", "Subscribers opted in for book launches", 0.18),
        ["newsletter"] = ("Newsletter Only", "General newsletter subscribers", 0.45),
    };

    public async Task<CampaignsBundleDto> GetBundleAsync(Guid userId)
    {
        var campaigns = await db.Campaigns.Where(c => c.UserId == userId)
            .OrderByDescending(c => c.UpdatedAt).ToListAsync();
        var events = await db.CampaignCalendarEvents.Where(e => e.UserId == userId)
            .OrderBy(e => e.EventDate).ToListAsync();
        var newsletter = await db.NewsletterSchedules.FirstOrDefaultAsync(n => n.UserId == userId);
        var abTests = await db.AbTests.Where(t => t.UserId == userId)
            .OrderByDescending(t => t.CreatedAt).ToListAsync();

        return new CampaignsBundleDto(
            campaigns.Select(MapCampaign).ToList(),
            events.Select(MapCalendarEvent).ToList(),
            MapNewsletter(newsletter ?? new NewsletterSchedule { UserId = userId }),
            abTests.Select(MapAbTest).ToList()
        );
    }

    public async Task<List<AudienceSegmentDto>> GetAudienceSegmentsAsync(Guid userId)
    {
        var activeCount = await db.Subscribers.CountAsync(s => s.UserId == userId && s.Status == "active");
        if (activeCount == 0)
        {
            return SegmentDefinitions.Select(kv => new AudienceSegmentDto(
                kv.Key, kv.Value.Name, 0, kv.Value.Description)).ToList();
        }

        return SegmentDefinitions.Select(kv =>
        {
            var count = kv.Key == "all"
                ? activeCount
                : Math.Max(1, (int)Math.Round(activeCount * kv.Value.Share));
            return new AudienceSegmentDto(kv.Key, kv.Value.Name, count, kv.Value.Description);
        }).ToList();
    }

    public async Task<ReachEstimateDto> EstimateReachAsync(Guid userId, ReachEstimateRequest request)
    {
        var segmentKey = string.IsNullOrWhiteSpace(request.Segment) ? "all" : request.Segment;
        var rules = request.EnabledSuppressionRules ?? [];

        var (before, after) = await audience.EstimateAudienceReachAsync(
            userId,
            request.ListIds,
            request.SegmentIds,
            request.ContactIds,
            request.ExcludeUnengaged,
            rules,
            segmentKey,
            request.ArcTag);

        return new ReachEstimateDto(before, Math.Max(0, before - after), after);
    }

    public async Task<CampaignDto?> GetCampaignAsync(Guid userId, Guid id)
    {
        var c = await db.Campaigns.FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);
        return c is null ? null : await MapCampaignWithStatsAsync(c);
    }

    public async Task<CampaignDto> CreateCampaignAsync(Guid userId, CreateCampaignRequest request)
    {
        var campaign = new Campaign
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Name = request.Name,
            Subject = request.Subject,
            PreviewText = request.PreviewText ?? "",
            Content = request.Content ?? "",
            CampaignType = request.CampaignType ?? "",
            FromName = request.FromName ?? "Author",
            SendToSegment = request.SendToSegment ?? "all",
            Status = request.Status ?? "draft",
            ScheduledAt = request.ScheduledAt,
            ExtrasJson = request.Extras is null ? "{}" : JsonSerializer.Serialize(request.Extras, JsonOptions),
        };
        db.Campaigns.Add(campaign);
        await db.SaveChangesAsync();
        return MapCampaign(campaign);
    }

    public async Task<CampaignDto?> UpdateCampaignAsync(Guid userId, Guid id, UpdateCampaignRequest request)
    {
        var c = await db.Campaigns.FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);
        if (c is null) return null;

        if (!string.IsNullOrWhiteSpace(request.Name)) c.Name = request.Name;
        if (!string.IsNullOrWhiteSpace(request.Subject)) c.Subject = request.Subject;
        if (request.PreviewText is not null) c.PreviewText = request.PreviewText;
        if (request.Content is not null) c.Content = request.Content;
        if (request.CampaignType is not null) c.CampaignType = request.CampaignType;
        if (!string.IsNullOrWhiteSpace(request.FromName)) c.FromName = request.FromName;
        if (!string.IsNullOrWhiteSpace(request.SendToSegment)) c.SendToSegment = request.SendToSegment;
        if (!string.IsNullOrWhiteSpace(request.Status)) c.Status = request.Status;
        if (request.ScheduledAt.HasValue) c.ScheduledAt = request.ScheduledAt;
        if (request.Extras is not null) c.ExtrasJson = JsonSerializer.Serialize(request.Extras, JsonOptions);
        c.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync();
        return MapCampaign(c);
    }

    public async Task<bool> DeleteCampaignAsync(Guid userId, Guid id)
    {
        var c = await db.Campaigns.FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);
        if (c is null) return false;
        db.Campaigns.Remove(c);
        await db.SaveChangesAsync();
        return true;
    }

    public async Task<CampaignDto?> SendCampaignAsync(Guid userId, Guid id, bool scheduleOnly)
    {
        var c = await db.Campaigns.FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);
        if (c is null) return null;

        if (c.UserId != userId)
            throw new UnauthorizedAccessException("This campaign belongs to another account.");

        if (scheduleOnly)
        {
            if (!c.ScheduledAt.HasValue)
                throw new InvalidOperationException("Pick a date and time to schedule this campaign.");

            c.Status = "scheduled";
            c.UpdatedAt = DateTime.UtcNow;
            await db.SaveChangesAsync();
            return MapCampaign(c);
        }

        if (c.Status == "sent")
            throw new InvalidOperationException("This campaign has already been sent.");

        c.ScheduledAt = null;
        var extras = ParseExtras(c.ExtrasJson);
        EnsureExplicitAudience(extras, c.SendToSegment);
        var suppression = ParseSuppressionRules(extras);
        var sentAt = DateTime.UtcNow;

        var recipients = await audience.ResolveCampaignRecipientsAsync(userId, c, suppression);
        recipients = recipients.Where(r => r.UserId == userId).ToList();
        if (recipients.Count == 0)
            throw new InvalidOperationException("No active recipients match your audience and suppression rules.");

        var delivered = await DeliverCampaignEmailsAsync(userId, c, recipients);

        c.Status = "sent";
        c.SentAt = sentAt;
        c.SentCount = delivered;
        await audience.RecordCampaignSendActivitiesAsync(userId, c, recipients);
        await RefreshCampaignStatsAsync(c);
        c.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
        return await MapCampaignWithStatsAsync(c);
    }

    public async Task ProcessDueScheduledCampaignsAsync(CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;
        var due = await db.Campaigns
            .Where(c => c.Status == "scheduled"
                && c.ScheduledAt != null
                && c.ScheduledAt <= now
                && c.SentAt == null)
            .Select(c => new { c.Id, c.UserId })
            .ToListAsync(cancellationToken);

        foreach (var item in due)
        {
            try
            {
                await SendCampaignAsync(item.UserId, item.Id, scheduleOnly: false);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Failed to send scheduled campaign {CampaignId}", item.Id);
            }
        }
    }

    private async Task<int> DeliverCampaignEmailsAsync(Guid userId, Campaign campaign, IReadOnlyList<Subscriber> recipients)
    {
        if (campaign.UserId != userId)
            throw new UnauthorizedAccessException("Cannot send a campaign that belongs to another account.");

        var conn = await db.MailboxConnections.FirstOrDefaultAsync(c => c.UserId == userId);
        if (conn is null || !conn.IsConnected)
        {
            throw new InvalidOperationException(
                "Connect your mailbox under Email → Settings before sending campaigns.");
        }

        if (conn.UserId != userId)
            throw new InvalidOperationException("Mailbox connection does not belong to your account.");

        var sent = 0;

        foreach (var recipient in recipients)
        {
            if (!string.Equals(recipient.Status, "active", StringComparison.OrdinalIgnoreCase))
            {
                logger.LogInformation(
                    "Skipped recipient {Email} — status is {Status}",
                    recipient.Email, recipient.Status);
                continue;
            }

            if (recipient.UserId != userId)
            {
                logger.LogWarning(
                    "Skipped recipient {Email} — belongs to account {RecipientUserId}, not {UserId}",
                    recipient.Email, recipient.UserId, userId);
                continue;
            }

            try
            {
                var token = tracking.CreateToken(campaign.Id, recipient.Id, userId);
                var body = BuildRecipientCampaignHtml(campaign, recipient, token);
                var subject = CampaignMergeTagService.Apply(campaign.Subject, campaign, recipient);
                await mailbox.SendEmailAsync(userId, new SendEmailRequest(
                    recipient.Email,
                    subject,
                    body));
                sent++;
            }
            catch (Exception ex)
            {
                logger.LogWarning(ex, "Failed to send campaign {CampaignId} to {Email}", campaign.Id, recipient.Email);
            }
        }

        if (sent == 0)
        {
            throw new InvalidOperationException(
                "Campaign could not be delivered. Check your mailbox connection and try again.");
        }

        return sent;
    }

    public async Task RecordCampaignOpenAsync(string token)
    {
        if (!tracking.TryParseToken(token, out var campaignId, out var subscriberId, out var userId)) return;

        var alreadyOpened = await db.SubscriberActivities.AnyAsync(a =>
            a.CampaignId == campaignId
            && a.SubscriberId == subscriberId
            && a.ActivityType == "campaign_opened");
        if (alreadyOpened) return;

        var campaign = await db.Campaigns.FirstOrDefaultAsync(c => c.Id == campaignId && c.UserId == userId);
        if (campaign is null) return;

        var fromEmail = ParseExtras(campaign.ExtrasJson).GetValueOrDefault("fromEmail") ?? campaign.FromName;
        db.SubscriberActivities.Add(new SubscriberActivity
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            SubscriberId = subscriberId,
            ActivityType = "campaign_opened",
            Title = "Email campaign opened",
            Description = $"({campaign.Name}) {campaign.Subject}",
            CampaignId = campaign.Id,
            CampaignSubject = campaign.Subject,
            CampaignFrom = fromEmail,
            Status = "opened",
            OccurredAt = DateTime.UtcNow
        });
        await db.SaveChangesAsync();
        await RefreshCampaignStatsAsync(campaign);
        await db.SaveChangesAsync();
    }

    public async Task<UnsubscribePreviewDto?> GetUnsubscribePreviewAsync(string token)
    {
        if (!tracking.TryParseToken(token, out var campaignId, out var subscriberId, out var userId)) return null;

        await RecordCampaignOpenAsync(token);

        var campaign = await db.Campaigns.AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == campaignId && c.UserId == userId);
        var subscriber = await db.Subscribers.AsNoTracking()
            .FirstOrDefaultAsync(s => s.Id == subscriberId && s.UserId == userId);
        if (campaign is null || subscriber is null) return null;

        return new UnsubscribePreviewDto(
            subscriber.Email,
            campaign.Name,
            campaign.FromName,
            subscriber.Status == "unsubscribed");
    }

    public async Task<UnsubscribeResultDto?> ConfirmUnsubscribeAsync(string token)
    {
        if (!tracking.TryParseToken(token, out var campaignId, out var subscriberId, out var userId)) return null;

        var campaign = await db.Campaigns.FirstOrDefaultAsync(c => c.Id == campaignId && c.UserId == userId);
        var subscriber = await db.Subscribers.FirstOrDefaultAsync(s => s.Id == subscriberId && s.UserId == userId);
        if (campaign is null || subscriber is null) return null;

        if (subscriber.Status == "unsubscribed")
        {
            return new UnsubscribeResultDto(
                "You are already unsubscribed from this author's emails.",
                subscriber.Email,
                true);
        }

        await RecordCampaignOpenAsync(token);

        subscriber.Status = "unsubscribed";
        db.SubscriberActivities.Add(new SubscriberActivity
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            SubscriberId = subscriber.Id,
            ActivityType = "unsubscribed",
            Title = "Unsubscribed from email",
            Description = $"Unsubscribed via campaign \"{campaign.Name}\"",
            CampaignId = campaign.Id,
            CampaignSubject = campaign.Subject,
            CampaignFrom = campaign.FromName,
            Status = "completed",
            OccurredAt = DateTime.UtcNow
        });
        await db.SaveChangesAsync();

        return new UnsubscribeResultDto(
            "You have been unsubscribed and will no longer receive emails from this list.",
            subscriber.Email,
            false);
    }

    public async Task<CampaignViewDto?> GetCampaignViewAsync(string token)
    {
        if (!tracking.TryParseToken(token, out var campaignId, out var subscriberId, out var userId)) return null;

        var campaign = await db.Campaigns.AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == campaignId && c.UserId == userId);
        var subscriber = await db.Subscribers.AsNoTracking()
            .FirstOrDefaultAsync(s => s.Id == subscriberId && s.UserId == userId);
        if (campaign is null || subscriber is null) return null;

        await RecordCampaignOpenAsync(token);

        var html = BuildRecipientCampaignHtml(campaign, subscriber, token, includeTrackingPixel: false);
        var subject = CampaignMergeTagService.Apply(campaign.Subject, campaign, subscriber);
        return new CampaignViewDto(
            subject,
            campaign.FromName,
            campaign.Name,
            html,
            campaign.PreviewText);
    }

    private async Task RefreshCampaignStatsAsync(Campaign campaign)
    {
        if (campaign.SentCount <= 0) return;

        var activities = await db.SubscriberActivities
            .Where(a => a.CampaignId == campaign.Id)
            .ToListAsync();

        var (uniqueOpens, uniqueClicks, delivered) = MetricsHelper.CampaignEngagement(activities, campaign.Id);
        var denominator = delivered > 0 ? delivered : campaign.SentCount;

        campaign.OpenRate = MetricsHelper.OpenRate(uniqueOpens, denominator);
        campaign.ClickRate = MetricsHelper.ClickRate(uniqueClicks, denominator);
        campaign.UpdatedAt = DateTime.UtcNow;
    }

    private async Task<CampaignDto> MapCampaignWithStatsAsync(Campaign c)
    {
        var activities = c.SentCount > 0
            ? await db.SubscriberActivities.Where(a => a.CampaignId == c.Id).ToListAsync()
            : [];

        var (uniqueOpens, uniqueClicks, delivered) = MetricsHelper.CampaignEngagement(activities, c.Id);
        var denominator = delivered > 0 ? delivered : c.SentCount;
        var openRate = MetricsHelper.OpenRate(uniqueOpens, denominator);
        var clickRate = MetricsHelper.ClickRate(uniqueClicks, denominator);
        var conversionRate = MetricsHelper.ConversionRate(uniqueOpens, uniqueClicks);

        return new CampaignDto(
            c.Id.ToString(),
            c.Name,
            c.Subject,
            c.PreviewText,
            c.Content,
            c.CampaignType,
            c.Status,
            c.FromName,
            c.SendToSegment,
            openRate,
            clickRate,
            c.SentCount,
            FormatDate(c.SentAt ?? c.ScheduledAt ?? c.CreatedAt),
            c.ScheduledAt,
            c.SentAt,
            ParseExtras(c.ExtrasJson),
            uniqueOpens,
            uniqueClicks,
            conversionRate);
    }

    private string BuildRecipientCampaignHtml(
        Campaign campaign,
        Subscriber recipient,
        string token,
        bool includeTrackingPixel = true)
    {
        var unsubUrl = tracking.UnsubscribeUrl(token);
        var viewUrl = tracking.ViewInBrowserUrl(token);
        var openPixel = includeTrackingPixel
            ? $"""<img src="{tracking.OpenTrackingUrl(token)}" width="1" height="1" alt="" style="display:block;width:1px;height:1px;border:0;margin:0;padding:0;" />"""
            : "";

        var content = string.IsNullOrWhiteSpace(campaign.Content) ? "<p></p>" : campaign.Content;
        content = CampaignMergeTagService.Apply(content, campaign, recipient);
        content = InjectCampaignLinks(content, unsubUrl, viewUrl);

        return content + openPixel;
    }

    private static string InjectCampaignLinks(string html, string unsubUrl, string viewUrl)
    {
        html = html.Replace("{{unsubscribe_url}}", unsubUrl, StringComparison.OrdinalIgnoreCase)
            .Replace("{{view_in_browser_url}}", viewUrl, StringComparison.OrdinalIgnoreCase);

        html = Regex.Replace(
            html,
            """<a([^>]*?)href\s*=\s*["']#["']([^>]*?)>\s*Unsubscribe\s*</a>""",
            $"""<a$1href="{unsubUrl}"$2>Unsubscribe</a>""",
            RegexOptions.IgnoreCase);

        html = Regex.Replace(
            html,
            """<a([^>]*?)href\s*=\s*["']#["']([^>]*?)>\s*View in browser\s*</a>""",
            $"""<a$1href="{viewUrl}"$2>View in browser</a>""",
            RegexOptions.IgnoreCase);

        return html;
    }

    public async Task<CampaignDto?> SendNewCampaignAsync(Guid userId, CreateCampaignRequest request, bool scheduleOnly)
    {
        var created = await CreateCampaignAsync(userId, request);
        return await SendCampaignAsync(userId, Guid.Parse(created.Id), scheduleOnly);
    }

    public async Task<TestSendResponse?> SendTestEmailAsync(Guid userId, TestSendRequest request)
    {
        var user = await db.Users.FindAsync(userId);
        if (user is null || string.IsNullOrWhiteSpace(user.Email)) return null;

        if (!string.IsNullOrWhiteSpace(request.CampaignId) && Guid.TryParse(request.CampaignId, out var campaignId))
        {
            var campaign = await db.Campaigns.FirstOrDefaultAsync(c => c.Id == campaignId && c.UserId == userId);
            if (campaign is null) return null;
        }

        return new TestSendResponse(
            $"Test preview queued for {user.Email}. Subject: \"{request.Subject ?? "Campaign preview"}\"",
            user.Email);
    }

    public async Task<CalendarEventDto> CreateCalendarEventAsync(Guid userId, CreateCalendarEventRequest request)
    {
        var date = ParseDate(request.Date) ?? DateTime.UtcNow.Date.AddDays(7);
        var ev = new CampaignCalendarEvent
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Name = request.Name,
            Type = request.Type,
            Status = request.Status,
            EventDate = date,
        };
        db.CampaignCalendarEvents.Add(ev);
        await db.SaveChangesAsync();
        return MapCalendarEvent(ev);
    }

    public async Task<CalendarEventDto?> UpdateCalendarEventAsync(Guid userId, Guid id, UpdateCalendarEventRequest request)
    {
        var ev = await db.CampaignCalendarEvents.FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);
        if (ev is null) return null;

        if (!string.IsNullOrWhiteSpace(request.Name)) ev.Name = request.Name;
        if (!string.IsNullOrWhiteSpace(request.Type)) ev.Type = request.Type;
        if (!string.IsNullOrWhiteSpace(request.Status)) ev.Status = request.Status;
        if (!string.IsNullOrWhiteSpace(request.Date))
        {
            var parsed = ParseDate(request.Date);
            if (parsed.HasValue) ev.EventDate = parsed.Value;
        }

        await db.SaveChangesAsync();
        return MapCalendarEvent(ev);
    }

    public async Task<bool> DeleteCalendarEventAsync(Guid userId, Guid id)
    {
        var ev = await db.CampaignCalendarEvents.FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);
        if (ev is null) return false;
        db.CampaignCalendarEvents.Remove(ev);
        await db.SaveChangesAsync();
        return true;
    }

    public async Task<NewsletterScheduleDto> SaveNewsletterAsync(Guid userId, NewsletterScheduleDto dto)
    {
        var existing = await db.NewsletterSchedules.FirstOrDefaultAsync(n => n.UserId == userId);
        if (existing is null)
        {
            existing = new NewsletterSchedule { Id = Guid.NewGuid(), UserId = userId };
            db.NewsletterSchedules.Add(existing);
        }

        existing.Name = dto.Name;
        existing.Frequency = dto.Frequency;
        existing.DayOfWeek = dto.DayOfWeek;
        existing.DayOfMonth = dto.DayOfMonth;
        existing.SendTime = dto.SendTime;
        existing.TimezoneOptimized = dto.TimezoneOptimized;
        existing.Subject = dto.Subject;
        existing.PreviewText = dto.PreviewText;
        existing.ReplyQuestion = dto.ReplyQuestion;
        existing.Content = dto.Content;
        existing.Status = dto.Status;
        existing.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync();
        return MapNewsletter(existing);
    }

    public async Task<AbTestDto> CreateAbTestAsync(Guid userId, CreateAbTestRequest request)
    {
        var test = new AbTest
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Name = request.Name ?? $"A/B Test {DateTime.UtcNow:MMM d}",
            SubjectA = request.SubjectA,
            SubjectB = request.SubjectB,
            TestSize = request.TestSize,
            WinnerMetric = request.WinnerMetric,
            WaitHours = request.WaitHours,
            Status = "draft",
        };
        db.AbTests.Add(test);
        await db.SaveChangesAsync();
        return MapAbTest(test);
    }

    public async Task<bool> DeleteAbTestAsync(Guid userId, Guid id)
    {
        var test = await db.AbTests.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
        if (test is null) return false;
        db.AbTests.Remove(test);
        await db.SaveChangesAsync();
        return true;
    }

    private static List<string> ParseSuppressionRules(Dictionary<string, string> extras)
    {
        if (!extras.TryGetValue("suppressionRules", out var json) || string.IsNullOrWhiteSpace(json))
            return [];
        try
        {
            return JsonSerializer.Deserialize<List<string>>(json, JsonOptions) ?? [];
        }
        catch
        {
            return [];
        }
    }

    private static void EnsureExplicitAudience(Dictionary<string, string> extras, string? sendToSegment)
    {
        static int CountIds(string? json)
        {
            if (string.IsNullOrWhiteSpace(json)) return 0;
            try
            {
                return JsonSerializer.Deserialize<List<string>>(json, JsonOptions)?.Count(id => !string.IsNullOrWhiteSpace(id)) ?? 0;
            }
            catch
            {
                return 0;
            }
        }

        var hasLists = CountIds(extras.GetValueOrDefault("recipientListIds")) > 0;
        var hasSegments = CountIds(extras.GetValueOrDefault("recipientSegmentIds")) > 0;
        var hasContacts = CountIds(extras.GetValueOrDefault("recipientContactIds")) > 0;
        var hasRealSegment = !string.IsNullOrWhiteSpace(sendToSegment) && Guid.TryParse(sendToSegment, out _);

        if (!hasLists && !hasSegments && !hasContacts && !hasRealSegment)
        {
            throw new InvalidOperationException(
                "Select at least one list, segment, or contact in the Audience step before sending.");
        }
    }

    private static CampaignDto MapCampaign(Campaign c) => new(
        c.Id.ToString(),
        c.Name,
        c.Subject,
        c.PreviewText,
        c.Content,
        c.CampaignType,
        c.Status,
        c.FromName,
        c.SendToSegment,
        c.OpenRate,
        c.ClickRate,
        c.SentCount,
        FormatDate(c.SentAt ?? c.ScheduledAt ?? c.CreatedAt),
        c.ScheduledAt,
        c.SentAt,
        ParseExtras(c.ExtrasJson)
    );

    private static Dictionary<string, string> ParseExtras(string json)
    {
        if (string.IsNullOrWhiteSpace(json) || json == "{}") return new Dictionary<string, string>();
        try
        {
            return JsonSerializer.Deserialize<Dictionary<string, string>>(json, JsonOptions)
                ?? new Dictionary<string, string>();
        }
        catch
        {
            return new Dictionary<string, string>();
        }
    }

    private static CalendarEventDto MapCalendarEvent(CampaignCalendarEvent e) => new(
        e.Id.ToString(),
        e.Name,
        e.Type,
        FormatDate(e.EventDate),
        e.Status,
        e.DaysFromRelease
    );

    private static NewsletterScheduleDto MapNewsletter(NewsletterSchedule n) => new(
        n.Name,
        n.Frequency,
        n.DayOfWeek,
        n.DayOfMonth,
        n.SendTime,
        n.TimezoneOptimized,
        n.Subject,
        n.PreviewText,
        n.ReplyQuestion,
        n.Content,
        n.Status
    );

    private static AbTestDto MapAbTest(AbTest t) => new(
        t.Id.ToString(),
        t.Name,
        t.SubjectA,
        t.SubjectB,
        t.TestSize,
        t.WinnerMetric,
        t.WaitHours,
        t.Status,
        t.OpenRateA,
        t.OpenRateB,
        t.Winner
    );

    private static string FormatDate(DateTime date) =>
        date.ToString("MMM d, yyyy", CultureInfo.InvariantCulture);

    private static DateTime? ParseDate(string? value)
    {
        if (string.IsNullOrWhiteSpace(value)) return null;
        if (DateTime.TryParse(value, CultureInfo.InvariantCulture, DateTimeStyles.AssumeUniversal, out var dt))
            return dt;
        return null;
    }
}
