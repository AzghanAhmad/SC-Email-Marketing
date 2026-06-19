using System.Globalization;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using ScribeCount.Email.Api.Data;
using ScribeCount.Email.Api.DTOs;
using ScribeCount.Email.Api.Entities;

namespace ScribeCount.Email.Api.Services;

public class CampaignService(AppDbContext db)
{
    private static readonly JsonSerializerOptions JsonOptions = new() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

    public async Task EnsureSeedDataAsync(Guid userId)
    {
        if (await db.Campaigns.AnyAsync(c => c.UserId == userId)) return;

        var campaigns = new[]
        {
            ("March Newsletter", "What I've been writing this month...", "sent", 54.2m, 12.8m, 4821, new DateTime(2026, 3, 15)),
            ("Book Launch: The Ember Crown", "It's finally here!", "sent", 71.4m, 28.3m, 3200, new DateTime(2026, 3, 1)),
            ("New Release Notification — The Ember Crown", "The next chapter in the Ember Chronicles is here", "sent", 68.9m, 34.1m, 621, new DateTime(2026, 3, 4)),
            ("April Newsletter", "Spring reading picks + a surprise", "draft", 0m, 0m, 0, new DateTime(2026, 4, 10)),
            ("VIP Early Access", "You get to read it first...", "scheduled", 0m, 0m, 0, new DateTime(2026, 4, 8)),
            ("February Roundup", "February was wild. Here's why.", "sent", 48.9m, 9.1m, 4650, new DateTime(2026, 2, 28)),
            ("Holiday Special", "A gift from me to you", "sent", 62.1m, 18.5m, 5100, new DateTime(2025, 12, 20)),
            ("Parnassus Books Signing — Nashville", "Nashville readers: come find me at Parnassus this Saturday", "sent", 71.3m, 24.6m, 312, new DateTime(2026, 4, 5)),
            ("Live Q&A — The Ember Crown", "Live Q&A this Thursday — bring your questions about The Ember Crown", "scheduled", 0m, 0m, 0, new DateTime(2026, 5, 22)),
            ("Reader Community — Founding Invitation", "You're invited: I'm opening my reader community to my most loyal subscribers first", "draft", 0m, 0m, 0, new DateTime(2026, 6, 1)),
            ("Backlist Spotlight — The Ashford Inheritance", "The book my readers call my best work", "scheduled", 0m, 0m, 0, new DateTime(2026, 6, 20)),
        };

        foreach (var (name, subject, status, openRate, clickRate, sent, date) in campaigns)
        {
            db.Campaigns.Add(new Campaign
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Name = name,
                Subject = subject,
                Status = status,
                OpenRate = openRate,
                ClickRate = clickRate,
                SentCount = sent,
                ScheduledAt = status == "scheduled" ? date : null,
                SentAt = status == "sent" ? date : null,
                FromName = "Jane Austen",
                SendToSegment = "all",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
            });
        }

        var calendarEvents = new[]
        {
            ("ARC Invitation — The Ember Crown", "ARC Invitation", "sent", new DateTime(2026, 4, 15)),
            ("ARC Follow-Up — The Ember Crown", "ARC Follow-Up", "sent", new DateTime(2026, 4, 28)),
            ("Book Launch — The Ember Crown", "Book Launch", "sent", new DateTime(2026, 5, 1)),
            ("Post-Launch Backlist", "Backlist Spotlight", "scheduled", new DateTime(2026, 5, 8)),
            ("Flash Sale — Summer Promo", "Flash Sale", "planned", new DateTime(2026, 6, 15)),
            ("Parnassus Books Signing — Nashville", "Event Announcement", "sent", new DateTime(2026, 4, 5)),
            ("Live Q&A — The Ember Crown", "Event Announcement", "scheduled", new DateTime(2026, 5, 22)),
            ("Event Reminder — Live Q&A", "Event Announcement", "planned", new DateTime(2026, 5, 21)),
            ("Reader Community — Founding Invitation", "Reader Community", "draft", new DateTime(2026, 6, 1)),
            ("Backlist Spotlight — The Ashford Inheritance", "Backlist Spotlight", "planned", new DateTime(2026, 6, 20)),
        };

        foreach (var (name, type, status, date) in calendarEvents)
        {
            db.CampaignCalendarEvents.Add(new CampaignCalendarEvent
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Name = name,
                Type = type,
                Status = status,
                EventDate = date,
            });
        }

        db.NewsletterSchedules.Add(new NewsletterSchedule
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Name = "Monthly Reader Letter",
            Frequency = "monthly",
            DayOfWeek = "Tuesday",
            DayOfMonth = "1st",
            SendTime = "09:00",
            TimezoneOptimized = true,
            Status = "draft",
        });

        db.AbTests.Add(new AbTest
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Name = "March Newsletter",
            SubjectA = "The research that changed my book",
            SubjectB = "March Newsletter — writing update + picks",
            TestSize = 20,
            WinnerMetric = "opens",
            WaitHours = 8,
            Status = "complete",
            OpenRateA = 58.4m,
            OpenRateB = 49.1m,
            Winner = "A",
        });

        await db.SaveChangesAsync();
    }

    public async Task<CampaignsBundleDto> GetBundleAsync(Guid userId)
    {
        await EnsureSeedDataAsync(userId);

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

    public async Task<CampaignDto?> GetCampaignAsync(Guid userId, Guid id)
    {
        var c = await db.Campaigns.FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);
        return c is null ? null : MapCampaign(c);
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
            FromName = request.FromName ?? "Jane Austen",
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

        if (scheduleOnly || c.ScheduledAt.HasValue)
        {
            c.Status = "scheduled";
        }
        else
        {
            c.Status = "sent";
            c.SentAt = DateTime.UtcNow;
            c.SentCount = c.SentCount > 0 ? c.SentCount : 8421;
            if (c.OpenRate == 0) c.OpenRate = 52.0m;
            if (c.ClickRate == 0) c.ClickRate = 11.5m;
        }
        c.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
        return MapCampaign(c);
    }

    public async Task<CampaignDto?> SendNewCampaignAsync(Guid userId, CreateCampaignRequest request, bool scheduleOnly)
    {
        var created = await CreateCampaignAsync(userId, request);
        return await SendCampaignAsync(userId, Guid.Parse(created.Id), scheduleOnly);
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
        c.SentAt
    );

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
