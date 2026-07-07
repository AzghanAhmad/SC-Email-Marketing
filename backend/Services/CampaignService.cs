using System.Globalization;
using System.Text.Json;
using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore;
using ScribeCount.Email.Api.Data;
using ScribeCount.Email.Api.DTOs;
using ScribeCount.Email.Api.Entities;

namespace ScribeCount.Email.Api.Services;

public class CampaignService(AppDbContext db, AudienceService audience, SesEmailService ses, CampaignTrackingService tracking, SettingsService settings, ILogger<CampaignService> logger)
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
        var releasePlan = await db.ReleasePlans.FirstOrDefaultAsync(r => r.UserId == userId);

        var abTestDtos = new List<AbTestDto>();
        foreach (var t in abTests)
            abTestDtos.Add(await MapAbTestAsync(t));

        return new CampaignsBundleDto(
            campaigns.Select(MapCampaign).ToList(),
            events.Select(MapCalendarEvent).ToList(),
            MapNewsletter(newsletter ?? new NewsletterSchedule { UserId = userId }),
            abTestDtos,
            releasePlan is null ? null : MapReleasePlan(releasePlan)
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

        if (c.Status == "sent" && c.SentAt == null)
            c.Status = "draft";

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

        var sentRecipients = await DeliverCampaignEmailsAsync(userId, c, recipients);

        c.Status = "sent";
        c.SentAt = sentAt;
        c.SentCount = sentRecipients.Count;
        await audience.RecordCampaignSendActivitiesAsync(userId, c, sentRecipients);
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

    private async Task<IReadOnlyList<Subscriber>> DeliverCampaignEmailsAsync(Guid userId, Campaign campaign, IReadOnlyList<Subscriber> recipients)
    {
        if (campaign.UserId != userId)
            throw new UnauthorizedAccessException("Cannot send a campaign that belongs to another account.");

        if (!ses.IsConfigured)
        {
            throw new InvalidOperationException(
                "Amazon SES is not configured. Platform campaigns send through SES (see Settings → Domain and docs/AWS-SES-SNS-SETUP.md).");
        }

        var sentRecipients = new List<Subscriber>();
        string? lastError = null;

        foreach (var recipient in recipients)
        {
            if (!string.Equals(recipient.Status, "active", StringComparison.OrdinalIgnoreCase))
            {
                logger.LogInformation(
                    "Skipped recipient {Email} — status is {Status}",
                    recipient.Email, recipient.Status);
                continue;
            }

            if (recipient.Status is "bounced" or "complained" or "unsubscribed")
                continue;

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
                var body = await BuildRecipientCampaignHtmlAsync(campaign, recipient, token, userId);
                var subject = CampaignMergeTagService.Apply(campaign.Subject, campaign, recipient);
                await ses.SendAsync(new PlatformSendRequest(
                    userId,
                    recipient.Email,
                    subject,
                    body,
                    "campaign",
                    recipient.Id,
                    campaign.Id));
                sentRecipients.Add(recipient);
            }
            catch (Exception ex)
            {
                lastError = ex is InvalidOperationException ioe ? ioe.Message : ex.Message;
                logger.LogWarning(ex, "Failed to send campaign {CampaignId} to {Email}", campaign.Id, recipient.Email);
            }
        }

        if (sentRecipients.Count == 0)
        {
            var detail = string.IsNullOrWhiteSpace(lastError)
                ? "Check SES configuration and recipient addresses."
                : lastError;
            throw new InvalidOperationException(
                $"Campaign could not be delivered via Amazon SES. {detail}");
        }

        return sentRecipients;
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

    public async Task<string?> RecordCampaignClickAsync(string token, string? encodedDestination)
    {
        if (!tracking.TryParseToken(token, out var campaignId, out var subscriberId, out var userId))
            return null;

        if (!tracking.TryDecodeClickDestination(encodedDestination, out var destination))
            return null;

        var campaign = await db.Campaigns.FirstOrDefaultAsync(c => c.Id == campaignId && c.UserId == userId);
        if (campaign is null) return null;

        await RecordCampaignOpenAsync(token);

        var alreadyClicked = await db.SubscriberActivities.AnyAsync(a =>
            a.CampaignId == campaignId
            && a.SubscriberId == subscriberId
            && a.ActivityType == "campaign_clicked");
        if (!alreadyClicked)
        {
            var fromEmail = ParseExtras(campaign.ExtrasJson).GetValueOrDefault("fromEmail") ?? campaign.FromName;
            db.SubscriberActivities.Add(new SubscriberActivity
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                SubscriberId = subscriberId,
                ActivityType = "campaign_clicked",
                Title = "Email campaign link clicked",
                Description = $"({campaign.Name}) {destination}",
                CampaignId = campaign.Id,
                CampaignSubject = campaign.Subject,
                CampaignFrom = fromEmail,
                Status = "clicked",
                OccurredAt = DateTime.UtcNow
            });
            await db.SaveChangesAsync();
            await RefreshCampaignStatsAsync(campaign);
            await db.SaveChangesAsync();
        }

        return destination;
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

        var html = await BuildRecipientCampaignHtmlAsync(campaign, subscriber, token, userId, includeTrackingPixel: false);
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

    private async Task<string> BuildRecipientCampaignHtmlAsync(
        Campaign campaign,
        Subscriber recipient,
        string token,
        Guid userId,
        bool includeTrackingPixel = true)
    {
        var unsubUrl = tracking.UnsubscribeUrl(token);
        var viewUrl = tracking.ViewInBrowserUrl(token);
        var prefUrl = tracking.PreferenceUrl(token);
        var openPixel = includeTrackingPixel
            ? $"""<img src="{tracking.OpenTrackingUrl(token)}" width="1" height="1" alt="" style="display:block;width:1px;height:1px;border:0;margin:0;padding:0;" />"""
            : "";

        var content = string.IsNullOrWhiteSpace(campaign.Content) ? "<p></p>" : campaign.Content;
        content = CampaignMergeTagService.Apply(content, campaign, recipient);

        if (!PreferenceFooterHelper.HasFooter(content))
        {
            var (footer, domain) = await settings.GetUserFooterAsync(userId);
            content = PreferenceFooterHelper.AppendFooter(content, footer, domain);
        }

        content = InjectCampaignLinks(content, unsubUrl, viewUrl, prefUrl);
        content = RewriteLinksForClickTracking(content, token, unsubUrl, viewUrl, prefUrl);

        return content + openPixel;
    }

    private string RewriteLinksForClickTracking(string html, string token, string unsubUrl, string viewUrl, string prefUrl)
    {
        return Regex.Replace(
            html,
            """<a\s+([^>]*?)href\s*=\s*["']([^"']+)["']([^>]*)>""",
            match =>
            {
                var href = match.Groups[2].Value;
                if (ShouldSkipClickTracking(href, unsubUrl, viewUrl, prefUrl))
                    return match.Value;

                var tracked = tracking.ClickTrackingUrl(token, href);
                return $"""<a{match.Groups[1].Value}href="{tracked}"{match.Groups[3].Value}>""";
            },
            RegexOptions.IgnoreCase);
    }

    private static bool ShouldSkipClickTracking(string href, string unsubUrl, string viewUrl, string prefUrl)
    {
        if (string.IsNullOrWhiteSpace(href)) return true;
        if (href.StartsWith('#')) return true;
        if (href.StartsWith("mailto:", StringComparison.OrdinalIgnoreCase)) return true;
        if (href.StartsWith("tel:", StringComparison.OrdinalIgnoreCase)) return true;
        if (href.Contains("{{", StringComparison.Ordinal)) return true;
        if (href.Contains("/public/campaigns/click", StringComparison.OrdinalIgnoreCase)) return true;
        if (href.Contains("/public/campaigns/open.gif", StringComparison.OrdinalIgnoreCase)) return true;
        if (string.Equals(href, unsubUrl, StringComparison.OrdinalIgnoreCase)) return true;
        if (string.Equals(href, viewUrl, StringComparison.OrdinalIgnoreCase)) return true;
        if (string.Equals(href, prefUrl, StringComparison.OrdinalIgnoreCase)) return true;
        if (href.Contains("/unsubscribe", StringComparison.OrdinalIgnoreCase)) return true;
        if (href.Contains("/email/view", StringComparison.OrdinalIgnoreCase)) return true;
        if (href.Contains("/preferences", StringComparison.OrdinalIgnoreCase)) return true;
        return false;
    }

    private static string InjectCampaignLinks(string html, string unsubUrl, string viewUrl, string prefUrl)
    {
        html = html.Replace("{{unsubscribe_url}}", unsubUrl, StringComparison.OrdinalIgnoreCase)
            .Replace("{{view_in_browser_url}}", viewUrl, StringComparison.OrdinalIgnoreCase)
            .Replace("{{preference_url}}", prefUrl, StringComparison.OrdinalIgnoreCase);

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

        html = Regex.Replace(
            html,
            """<a([^>]*?)href\s*=\s*["']{{preference_url}}["']([^>]*?)>""",
            $"""<a$1href="{prefUrl}"$2>""",
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

        var subject = request.Subject ?? "Campaign preview";
        var body = "<p>This is a campaign test send via Amazon SES.</p>";

        if (!string.IsNullOrWhiteSpace(request.CampaignId) && Guid.TryParse(request.CampaignId, out var campaignId))
        {
            var campaign = await db.Campaigns.FirstOrDefaultAsync(c => c.Id == campaignId && c.UserId == userId);
            if (campaign is null) return null;
            subject = string.IsNullOrWhiteSpace(request.Subject) ? campaign.Subject : request.Subject;
            body = string.IsNullOrWhiteSpace(campaign.Content)
                ? body
                : campaign.Content;
        }

        await ses.SendAsync(new PlatformSendRequest(
            userId,
            user.Email,
            $"[TEST] {subject}",
            body,
            "campaign_test"));

        return new TestSendResponse(
            $"Test email sent via Amazon SES to {user.Email}. Subject: \"{subject}\"",
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

        if (string.Equals(dto.Status, "active", StringComparison.OrdinalIgnoreCase))
            existing.NextSendAt ??= ComputeNextNewsletterSendAt(existing);
        else if (string.Equals(dto.Status, "paused", StringComparison.OrdinalIgnoreCase))
            existing.NextSendAt = null;

        await db.SaveChangesAsync();
        return MapNewsletter(existing);
    }

    public async Task<ReleasePlanDto> SaveReleasePlanAsync(Guid userId, SaveReleasePlanRequest request)
    {
        var plan = await db.ReleasePlans.FirstOrDefaultAsync(r => r.UserId == userId);
        if (plan is null)
        {
            plan = new ReleasePlan { Id = Guid.NewGuid(), UserId = userId };
            db.ReleasePlans.Add(plan);
        }

        plan.BookTitle = request.BookTitle?.Trim() ?? "";
        plan.ReleaseDate = ParseDate(request.ReleaseDate);
        plan.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
        return MapReleasePlan(plan);
    }

    public async Task<AbTestDto?> LaunchAbTestAsync(Guid userId, Guid id)
    {
        var test = await db.AbTests.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
        if (test is null) return null;

        if (test.Status is "running" or "complete")
            throw new InvalidOperationException("This A/B test has already been launched.");

        if (string.IsNullOrWhiteSpace(test.SubjectA) || string.IsNullOrWhiteSpace(test.SubjectB))
            throw new InvalidOperationException("Both subject lines are required before launching.");

        test.Status = "running";
        test.StartedAt = DateTime.UtcNow;
        if (test.EndsAt is null)
            test.EndsAt = test.StartedAt.Value.AddHours(test.WaitHours);
        test.CompletedAt = null;
        test.Winner = null;
        test.VotesA = 0;
        test.VotesB = 0;
        test.OpenRateA = null;
        test.OpenRateB = null;
        test.WinnerCampaignId = null;
        test.WinnerSentAt = null;
        test.CampaignIdA = null;
        test.CampaignIdB = null;
        test.HeldSubscriberIdsJson = "[]";

        var existingVotes = await db.AbTestVotes.Where(v => v.AbTestId == test.Id).ToListAsync();
        if (existingVotes.Count > 0)
            db.AbTestVotes.RemoveRange(existingVotes);

        await db.SaveChangesAsync();

        try
        {
            await LaunchAbTestEmailSplitsAsync(test);
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "A/B test {AbTestId} launched for voting but email split sends failed", test.Id);
        }

        await db.SaveChangesAsync();
        return await MapAbTestAsync(test);
    }

    public async Task<AbTestDto?> EndAbTestAsync(Guid userId, Guid id, CancellationToken cancellationToken = default)
    {
        var test = await db.AbTests.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId, cancellationToken);
        if (test is null) return null;

        if (test.Status != "running")
            throw new InvalidOperationException("Only a running A/B test can be ended early.");

        await CompleteAbTestAsync(test, cancellationToken);
        await db.SaveChangesAsync(cancellationToken);
        return await MapAbTestAsync(test);
    }

    public async Task<PublicAbTestDto?> GetPublicAbTestAsync(Guid id)
    {
        var test = await db.AbTests.AsNoTracking().FirstOrDefaultAsync(t => t.Id == id);
        if (test is null) return null;

        return new PublicAbTestDto(
            test.Id.ToString(),
            test.Name,
            test.SubjectA,
            test.SubjectB,
            test.Status,
            test.VotesA,
            test.VotesB,
            test.Winner,
            test.Status == "running");
    }

    public async Task<VoteAbTestResponse?> VoteOnAbTestAsync(Guid id, VoteAbTestRequest request, string voterKey)
    {
        var test = await db.AbTests.FirstOrDefaultAsync(t => t.Id == id);
        if (test is null) return null;

        if (test.Status != "running")
            throw new InvalidOperationException("This A/B test is not accepting votes.");

        var variant = request.Variant?.Trim().ToUpperInvariant();
        if (variant is not ("A" or "B"))
            throw new InvalidOperationException("Vote must be for variant A or B.");

        var key = string.IsNullOrWhiteSpace(request.VoterToken) ? voterKey : request.VoterToken.Trim();
        if (string.IsNullOrWhiteSpace(key))
            throw new InvalidOperationException("Could not identify voter.");

        var existing = await db.AbTestVotes.FirstOrDefaultAsync(v => v.AbTestId == id && v.VoterKey == key);
        if (existing is not null)
            throw new InvalidOperationException("You have already voted on this test.");

        db.AbTestVotes.Add(new AbTestVote
        {
            Id = Guid.NewGuid(),
            AbTestId = id,
            Variant = variant,
            VoterKey = key,
        });

        if (variant == "A") test.VotesA++;
        else test.VotesB++;

        await db.SaveChangesAsync();

        return new VoteAbTestResponse(
            "Thanks — your vote was recorded.",
            test.VotesA,
            test.VotesB,
            test.Winner,
            test.Status);
    }

    public async Task ProcessDueAbTestsAsync(CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;
        var due = await db.AbTests
            .Where(t => t.Status == "running"
                && t.StartedAt != null
                && (
                    (t.EndsAt != null && t.EndsAt <= now)
                    || (t.EndsAt == null && t.StartedAt!.Value.AddHours(t.WaitHours) <= now)))
            .ToListAsync(cancellationToken);

        foreach (var test in due)
        {
            await CompleteAbTestAsync(test, cancellationToken);
            await db.SaveChangesAsync(cancellationToken);
        }
    }

    public async Task ProcessDueNewslettersAsync(CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;
        var due = await db.NewsletterSchedules
            .Where(n => n.Status == "active"
                && n.NextSendAt != null
                && n.NextSendAt <= now)
            .ToListAsync(cancellationToken);

        foreach (var schedule in due)
        {
            try
            {
                await SendNewsletterIssueAsync(schedule, cancellationToken);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Failed to send newsletter issue for user {UserId}", schedule.UserId);
            }
        }
    }

    private async Task SendNewsletterIssueAsync(NewsletterSchedule schedule, CancellationToken cancellationToken)
    {
        var body = schedule.Content;
        if (!string.IsNullOrWhiteSpace(schedule.ReplyQuestion))
            body += $"\n\n<p><strong>Reply to this email:</strong> {System.Net.WebUtility.HtmlEncode(schedule.ReplyQuestion)}</p>";

        var campaign = new Campaign
        {
            Id = Guid.NewGuid(),
            UserId = schedule.UserId,
            Name = $"{schedule.Name} — {DateTime.UtcNow:MMM d, yyyy}",
            Subject = string.IsNullOrWhiteSpace(schedule.Subject) ? schedule.Name : schedule.Subject,
            PreviewText = schedule.PreviewText,
            Content = body,
            CampaignType = "newsletter",
            Status = "draft",
            FromName = "Newsletter",
            SendToSegment = "newsletter",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };
        db.Campaigns.Add(campaign);
        await db.SaveChangesAsync(cancellationToken);

        await SendCampaignAsync(schedule.UserId, campaign.Id, scheduleOnly: false);

        schedule.LastSentAt = DateTime.UtcNow;
        schedule.NextSendAt = ComputeNextNewsletterSendAt(schedule, schedule.LastSentAt.Value);
        schedule.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync(cancellationToken);
    }

    private async Task CompleteAbTestAsync(AbTest test, CancellationToken cancellationToken = default)
    {
        test.Status = "complete";
        test.CompletedAt = DateTime.UtcNow;

        if (test.CampaignIdA.HasValue && test.CampaignIdB.HasValue)
            await ApplyEngagementWinnerAsync(test, cancellationToken);
        else
            ApplyVoteWinner(test);

        await TryAutoSendAbTestWinnerAsync(test, cancellationToken);
    }

    private async Task ApplyEngagementWinnerAsync(AbTest test, CancellationToken cancellationToken)
    {
        var campaignA = await db.Campaigns.FirstOrDefaultAsync(c => c.Id == test.CampaignIdA, cancellationToken);
        var campaignB = await db.Campaigns.FirstOrDefaultAsync(c => c.Id == test.CampaignIdB, cancellationToken);
        if (campaignA is not null) await RefreshCampaignStatsAsync(campaignA);
        if (campaignB is not null) await RefreshCampaignStatsAsync(campaignB);

        test.OpenRateA = campaignA?.OpenRate;
        test.OpenRateB = campaignB?.OpenRate;

        var useClicks = string.Equals(test.WinnerMetric, "clicks", StringComparison.OrdinalIgnoreCase);
        var metricA = useClicks ? campaignA?.ClickRate ?? 0 : campaignA?.OpenRate ?? 0;
        var metricB = useClicks ? campaignB?.ClickRate ?? 0 : campaignB?.OpenRate ?? 0;

        if (metricA > metricB)
            test.Winner = "A";
        else if (metricB > metricA)
            test.Winner = "B";
        else if (campaignA?.SentCount > 0 || campaignB?.SentCount > 0)
            test.Winner = "tie";
        else
            ApplyVoteWinner(test);
    }

    private static void ApplyVoteWinner(AbTest test)
    {
        if (test.VotesA > test.VotesB)
        {
            test.Winner = "A";
            test.OpenRateA = 100;
            test.OpenRateB = 0;
        }
        else if (test.VotesB > test.VotesA)
        {
            test.Winner = "B";
            test.OpenRateA = 0;
            test.OpenRateB = 100;
        }
        else
        {
            test.Winner = test.VotesA == 0 && test.VotesB == 0 ? null : "tie";
            test.OpenRateA = 50;
            test.OpenRateB = 50;
        }
    }

    private async Task LaunchAbTestEmailSplitsAsync(AbTest test)
    {
        if (string.IsNullOrWhiteSpace(test.Content))
            return;

        if (!ses.IsConfigured)
        {
            logger.LogInformation("Skipping A/B email split for {AbTestId} — SES is not configured", test.Id);
            return;
        }

        var pseudoCampaign = new Campaign
        {
            UserId = test.UserId,
            SendToSegment = string.IsNullOrWhiteSpace(test.SendToSegment) ? "all" : test.SendToSegment,
            ExtrasJson = "{}",
        };

        var recipients = await audience.ResolveCampaignRecipientsAsync(test.UserId, pseudoCampaign, []);
        recipients = recipients
            .Where(r => r.UserId == test.UserId && string.Equals(r.Status, "active", StringComparison.OrdinalIgnoreCase))
            .ToList();
        if (recipients.Count == 0)
        {
            logger.LogInformation("Skipping A/B email split for {AbTestId} — no active recipients", test.Id);
            return;
        }

        var testCount = Math.Max(1, (int)Math.Round(recipients.Count * test.TestSize / 100.0, MidpointRounding.AwayFromZero));
        if (testCount * 2 > recipients.Count)
            testCount = Math.Max(1, recipients.Count / 2);

        var shuffled = recipients.OrderBy(_ => Guid.NewGuid()).ToList();
        var groupA = shuffled.Take(testCount).ToList();
        var groupB = shuffled.Skip(testCount).Take(testCount).ToList();
        var held = shuffled.Skip(testCount * 2).ToList();

        test.HeldSubscriberIdsJson = JsonSerializer.Serialize(held.Select(s => s.Id.ToString()).ToList(), JsonOptions);

        var campaignA = CreateAbTestCampaign(test, "A", test.SubjectA);
        var campaignB = CreateAbTestCampaign(test, "B", test.SubjectB);
        db.Campaigns.Add(campaignA);
        db.Campaigns.Add(campaignB);
        test.CampaignIdA = campaignA.Id;
        test.CampaignIdB = campaignB.Id;
        await db.SaveChangesAsync();

        await SendCampaignToRecipientsAsync(test.UserId, campaignA, groupA);
        await SendCampaignToRecipientsAsync(test.UserId, campaignB, groupB);
    }

    private static Campaign CreateAbTestCampaign(AbTest test, string variant, string subject) => new()
    {
        Id = Guid.NewGuid(),
        UserId = test.UserId,
        Name = $"{test.Name} — Version {variant}",
        Subject = subject,
        Content = test.Content,
        CampaignType = "ab-test",
        Status = "draft",
        FromName = "Campaign",
        SendToSegment = test.SendToSegment,
        CreatedAt = DateTime.UtcNow,
        UpdatedAt = DateTime.UtcNow,
        ExtrasJson = JsonSerializer.Serialize(new Dictionary<string, string>
        {
            ["abTestId"] = test.Id.ToString(),
            ["abVariant"] = variant,
        }, JsonOptions),
    };

    private async Task<int> SendCampaignToRecipientsAsync(
        Guid userId,
        Campaign campaign,
        IReadOnlyList<Subscriber> recipients)
    {
        if (recipients.Count == 0)
            return 0;

        var sentAt = DateTime.UtcNow;
        var sentRecipients = await DeliverCampaignEmailsAsync(userId, campaign, recipients);
        campaign.Status = "sent";
        campaign.SentAt = sentAt;
        campaign.SentCount = sentRecipients.Count;
        await audience.RecordCampaignSendActivitiesAsync(userId, campaign, sentRecipients);
        await RefreshCampaignStatsAsync(campaign);
        campaign.UpdatedAt = DateTime.UtcNow;
        return sentRecipients.Count;
    }

    private async Task TryAutoSendAbTestWinnerAsync(AbTest test, CancellationToken cancellationToken)
    {
        if (!test.AutoSendWinner || test.WinnerSentAt.HasValue)
            return;

        if (test.Winner is not ("A" or "B"))
            return;

        if (string.IsNullOrWhiteSpace(test.Content))
            return;

        if (!ses.IsConfigured)
        {
            logger.LogInformation("Skipping A/B winner send for {AbTestId} — SES is not configured", test.Id);
            return;
        }

        var heldIds = ParseHeldSubscriberIds(test.HeldSubscriberIdsJson);
        List<Subscriber> recipients;

        if (heldIds.Count > 0)
        {
            recipients = await db.Subscribers
                .Where(s => s.UserId == test.UserId && heldIds.Contains(s.Id))
                .ToListAsync(cancellationToken);
        }
        else
        {
            var pseudoCampaign = new Campaign
            {
                UserId = test.UserId,
                SendToSegment = string.IsNullOrWhiteSpace(test.SendToSegment) ? "all" : test.SendToSegment,
                ExtrasJson = "{}",
            };
            recipients = await audience.ResolveCampaignRecipientsAsync(test.UserId, pseudoCampaign, []);
            recipients = recipients
                .Where(r => r.UserId == test.UserId && string.Equals(r.Status, "active", StringComparison.OrdinalIgnoreCase))
                .ToList();
        }

        if (recipients.Count == 0)
        {
            logger.LogInformation("Skipping A/B winner send for {AbTestId} — no recipients for remainder", test.Id);
            return;
        }

        var winningSubject = test.Winner == "A" ? test.SubjectA : test.SubjectB;
        var winnerCampaign = new Campaign
        {
            Id = Guid.NewGuid(),
            UserId = test.UserId,
            Name = $"{test.Name} — Winner ({test.Winner})",
            Subject = winningSubject,
            Content = test.Content,
            CampaignType = "ab-test-winner",
            Status = "draft",
            FromName = "Campaign",
            SendToSegment = test.SendToSegment,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            ExtrasJson = JsonSerializer.Serialize(new Dictionary<string, string>
            {
                ["abTestId"] = test.Id.ToString(),
                ["abWinner"] = test.Winner,
            }, JsonOptions),
        };

        db.Campaigns.Add(winnerCampaign);
        test.WinnerCampaignId = winnerCampaign.Id;
        await db.SaveChangesAsync(cancellationToken);

        await SendCampaignToRecipientsAsync(test.UserId, winnerCampaign, recipients);
        test.WinnerSentAt = DateTime.UtcNow;
    }

    private static List<Guid> ParseHeldSubscriberIds(string? json)
    {
        if (string.IsNullOrWhiteSpace(json))
            return [];

        try
        {
            return JsonSerializer.Deserialize<List<string>>(json, JsonOptions)?
                .Select(s => Guid.TryParse(s, out var id) ? id : Guid.Empty)
                .Where(id => id != Guid.Empty)
                .ToList() ?? [];
        }
        catch
        {
            return [];
        }
    }

    private static DateTime ComputeNextNewsletterSendAt(NewsletterSchedule schedule, DateTime? after = null)
    {
        var baseTime = after ?? DateTime.UtcNow;
        if (!TimeSpan.TryParse(schedule.SendTime, out var sendTime))
            sendTime = new TimeSpan(9, 0, 0);

        var candidate = baseTime.Date.Add(sendTime);
        if (candidate <= baseTime)
            candidate = candidate.AddDays(1);

        if (string.Equals(schedule.Frequency, "weekly", StringComparison.OrdinalIgnoreCase))
        {
            while (candidate.DayOfWeek.ToString() != schedule.DayOfWeek || candidate <= baseTime)
                candidate = candidate.AddDays(1);
        }
        else if (string.Equals(schedule.Frequency, "biweekly", StringComparison.OrdinalIgnoreCase))
        {
            while (candidate.DayOfWeek.ToString() != schedule.DayOfWeek || candidate <= baseTime)
                candidate = candidate.AddDays(1);
            if (schedule.LastSentAt.HasValue && (candidate - schedule.LastSentAt.Value).TotalDays < 13)
                candidate = candidate.AddDays(14);
        }
        else
        {
            var day = schedule.DayOfMonth switch
            {
                "2nd" => 2,
                "3rd" => 3,
                "last" => DateTime.DaysInMonth(candidate.Year, candidate.Month),
                _ => 1,
            };
            candidate = new DateTime(candidate.Year, candidate.Month, Math.Min(day, DateTime.DaysInMonth(candidate.Year, candidate.Month)), sendTime.Hours, sendTime.Minutes, 0, DateTimeKind.Utc);
            if (candidate <= baseTime)
            {
                var nextMonth = candidate.AddMonths(1);
                var nextDay = schedule.DayOfMonth == "last"
                    ? DateTime.DaysInMonth(nextMonth.Year, nextMonth.Month)
                    : Math.Min(day, DateTime.DaysInMonth(nextMonth.Year, nextMonth.Month));
                candidate = new DateTime(nextMonth.Year, nextMonth.Month, nextDay, sendTime.Hours, sendTime.Minutes, 0, DateTimeKind.Utc);
            }
        }

        return candidate;
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
            EndsAt = request.EndsAt,
            Content = request.Content?.Trim() ?? "",
            SendToSegment = string.IsNullOrWhiteSpace(request.SendToSegment) ? "all" : request.SendToSegment.Trim(),
            AutoSendWinner = request.AutoSendWinner,
            Status = "draft",
        };
        db.AbTests.Add(test);
        await db.SaveChangesAsync();
        return await MapAbTestAsync(test);
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

    private static ReleasePlanDto MapReleasePlan(ReleasePlan plan) => new(
        plan.BookTitle,
        plan.ReleaseDate?.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture));

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
        n.Status,
        n.NextSendAt,
        n.LastSentAt
    );

    private async Task<AbTestDto> MapAbTestAsync(AbTest t)
    {
        decimal? clickA = null;
        decimal? clickB = null;
        decimal? openA = t.OpenRateA;
        decimal? openB = t.OpenRateB;

        if (t.CampaignIdA.HasValue)
        {
            var campaignA = await db.Campaigns.AsNoTracking().FirstOrDefaultAsync(c => c.Id == t.CampaignIdA.Value);
            if (campaignA is not null)
            {
                clickA = campaignA.ClickRate;
                openA ??= campaignA.OpenRate;
            }
        }

        if (t.CampaignIdB.HasValue)
        {
            var campaignB = await db.Campaigns.AsNoTracking().FirstOrDefaultAsync(c => c.Id == t.CampaignIdB.Value);
            if (campaignB is not null)
            {
                clickB = campaignB.ClickRate;
                openB ??= campaignB.OpenRate;
            }
        }

        return new AbTestDto(
            t.Id.ToString(),
            t.Name,
            t.SubjectA,
            t.SubjectB,
            t.TestSize,
            t.WinnerMetric,
            t.WaitHours,
            t.Status,
            openA,
            openB,
            clickA,
            clickB,
            t.Winner,
            t.VotesA,
            t.VotesB,
            t.StartedAt,
            t.CompletedAt,
            t.EndsAt,
            string.IsNullOrWhiteSpace(t.Content) ? null : t.Content,
            t.SendToSegment,
            t.AutoSendWinner,
            t.WinnerSentAt,
            $"/ab-test/{t.Id}"
        );
    }

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
