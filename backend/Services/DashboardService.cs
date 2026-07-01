using Microsoft.EntityFrameworkCore;
using ScribeCount.Email.Api.Data;
using ScribeCount.Email.Api.DTOs;
using ScribeCount.Email.Api.Entities;

namespace ScribeCount.Email.Api.Services;

public class DashboardService(AppDbContext db)
{
    public async Task<DashboardDto> GetDashboardAsync(Guid userId, string? userName)
    {
        var subscribers = await db.Subscribers.Where(s => s.UserId == userId).ToListAsync();
        var campaigns = await db.Campaigns
            .Where(c => c.UserId == userId)
            .OrderByDescending(c => c.SentAt ?? c.CreatedAt)
            .ToListAsync();
        var activities = await db.SubscriberActivities.Where(a => a.UserId == userId).ToListAsync();

        var sentCampaigns = campaigns.Where(c => c.Status == "sent").ToList();
        var periodEnd = DateTime.UtcNow;
        var periodStart = periodEnd.AddDays(-30);
        var prevPeriodStart = periodStart.AddDays(-30);

        var activeCount = subscribers.Count(s => s.Status == "active");
        var prevActiveCount = MetricsHelper.ActiveSubscribersAt(subscribers, activities, periodStart);
        var subscriberGrowth = prevActiveCount == 0
            ? (activeCount > 0 ? 100.0 : 0)
            : Math.Round((activeCount - prevActiveCount) / (double)prevActiveCount * 100, 1);

        var periodSent = CountSends(activities, periodStart, periodEnd);
        var prevSent = CountSends(activities, prevPeriodStart, periodStart);
        var emailsGrowth = prevSent == 0 ? 0 : Math.Round((periodSent - prevSent) / (double)prevSent * 100, 1);

        var periodOpens = CountUniqueOpens(activities, periodStart, periodEnd);
        var prevOpens = CountUniqueOpens(activities, prevPeriodStart, periodStart);
        var openRate = periodSent > 0 ? Math.Round(periodOpens * 100.0 / periodSent, 1) : 0;
        var prevOpenRate = prevSent > 0 ? Math.Round(prevOpens * 100.0 / prevSent, 1) : 0;
        var openRateGrowth = Math.Round(openRate - prevOpenRate, 1);

        var revenue = MetricsHelper.SumSaleRevenue(activities, periodStart, periodEnd);
        var prevRevenue = MetricsHelper.SumSaleRevenue(activities, prevPeriodStart, periodStart);
        var revenueGrowth = prevRevenue == 0
            ? (revenue > 0 ? 100.0 : 0)
            : Math.Round((double)((revenue - prevRevenue) / prevRevenue * 100), 1);

        var campaignChart = BuildCampaignChart(activities);
        var growthChart = BuildGrowthChart(subscribers, activities);

        var stats = new DashboardStatsDto(
            activeCount, subscriberGrowth, periodSent, emailsGrowth,
            openRate, openRateGrowth, revenue, revenueGrowth);

        var attributedRevenue = activities
            .Where(a => MetricsHelper.IsPurchaseActivity(a)
                && a.CampaignId != null
                && a.OccurredAt >= periodStart
                && a.OccurredAt <= periodEnd)
            .Sum(MetricsHelper.ParseSaleAmount);
        var directRevenue = Math.Max(0, revenue - attributedRevenue);
        var attributedPct = revenue == 0 ? 0 : Math.Round(attributedRevenue / revenue * 100);

        var performance = new PerformanceSummaryDto(
            revenue, revenueGrowth, attributedRevenue, revenueGrowth,
            $"{periodStart:MMM d, yyyy} — {periodEnd:MMM d, yyyy}");

        var perRecipient = periodSent > 0 ? revenue / periodSent : 0;
        var attribution = new List<AttributionItemDto>
        {
            new("Per Recipient", periodSent > 0 ? $"${perRecipient:0.00}" : "$0.00", "", "user"),
            new("Campaigns", attributedRevenue > 0 ? $"${attributedRevenue:0.00}" : "$0", attributedRevenue > 0 ? $"{attributedPct:0}%" : "", "campaign"),
            new("Flows", "$0", "", "flow"),
            new("Email", attributedRevenue > 0 ? $"${attributedRevenue:0.00}" : "$0", attributedRevenue > 0 ? $"{attributedPct:0}%" : "", "email"),
            new("Direct Sales", directRevenue > 0 ? $"${directRevenue:0.00}" : "$0", directRevenue > 0 && revenue > 0 ? $"{Math.Round(directRevenue / revenue * 100):0}%" : "", "cart")
        };

        var recentActivity = await BuildRecentActivityAsync(userId, campaigns, subscribers, activities);
        var firstName = string.IsNullOrWhiteSpace(userName) ? "there" : userName.Split(' ')[0];

        return new DashboardDto(
            stats, performance, attribution, campaignChart, growthChart, recentActivity,
            periodStart.ToString("MMM d, yyyy"), periodEnd.ToString("MMM d, yyyy"), firstName);
    }

    private static int CountSends(IReadOnlyList<SubscriberActivity> activities, DateTime from, DateTime to) =>
        activities.Count(a =>
            a.ActivityType == "campaign_sent"
            && a.OccurredAt >= from
            && a.OccurredAt < to);

    private static int CountUniqueOpens(IReadOnlyList<SubscriberActivity> activities, DateTime from, DateTime to) =>
        activities
            .Where(a =>
                (a.ActivityType == "campaign_opened"
                 || a.ActivityType is "unsubscribed" or "unsubscribe")
                && a.OccurredAt >= from
                && a.OccurredAt < to)
            .Select(a => (a.SubscriberId, a.CampaignId))
            .Distinct()
            .Count();

    private static List<CampaignChartPointDto> BuildCampaignChart(IReadOnlyList<SubscriberActivity> activities)
    {
        var months = Enumerable.Range(0, 4).Select(i => DateTime.UtcNow.AddMonths(-3 + i)).ToList();
        return months.Select(m =>
        {
            var monthStart = new DateTime(m.Year, m.Month, 1, 0, 0, 0, DateTimeKind.Utc);
            var monthEnd = monthStart.AddMonths(1);
            var sent = activities.Count(a =>
                a.ActivityType == "campaign_sent"
                && a.OccurredAt >= monthStart
                && a.OccurredAt < monthEnd);
            var opened = activities
                .Where(a =>
                    (a.ActivityType == "campaign_opened"
                     || a.ActivityType is "unsubscribed" or "unsubscribe")
                    && a.OccurredAt >= monthStart
                    && a.OccurredAt < monthEnd)
                .Select(a => (a.SubscriberId, a.CampaignId))
                .Distinct()
                .Count();
            return new CampaignChartPointDto(m.ToString("MMM"), sent, opened);
        }).ToList();
    }

    private static List<SubscriberGrowthPointDto> BuildGrowthChart(
        IReadOnlyList<Subscriber> subscribers, IReadOnlyList<SubscriberActivity> activities)
    {
        var months = Enumerable.Range(0, 6).Select(i => DateTime.UtcNow.AddMonths(-5 + i)).ToList();
        return months.Select(m =>
        {
            var monthEnd = new DateTime(m.Year, m.Month, DateTime.DaysInMonth(m.Year, m.Month), 23, 59, 59, DateTimeKind.Utc);
            var count = MetricsHelper.ActiveSubscribersAt(subscribers, activities, monthEnd);
            return new SubscriberGrowthPointDto(m.ToString("MMM"), count);
        }).ToList();
    }

    private async Task<List<DashboardActivityDto>> BuildRecentActivityAsync(
        Guid userId, List<Campaign> campaigns, List<Subscriber> subscribers, List<SubscriberActivity> activities)
    {
        var items = new List<(DateTime At, DashboardActivityDto Item)>();

        foreach (var c in campaigns.Where(c => c.Status is "sent" or "scheduled").Take(5))
        {
            var type = c.Status == "scheduled" ? "scheduled" : "campaign";
            var msg = c.Status == "scheduled"
                ? $"Campaign \"{c.Name}\" scheduled for {c.ScheduledAt:MMM d}"
                : $"Campaign \"{c.Name}\" sent to {c.SentCount:N0} subscribers";
            items.Add((c.SentAt ?? c.ScheduledAt ?? c.UpdatedAt,
                new DashboardActivityDto(c.Id.ToString(), type, msg, "", MapActivityIcon(type))));
        }

        foreach (var s in subscribers.OrderByDescending(s => s.JoinedAt).Take(5))
        {
            items.Add((s.JoinedAt,
                new DashboardActivityDto(s.Id.ToString(), "subscriber",
                    $"New subscriber: {s.Email} joined", "", "subscriber")));
        }

        foreach (var sale in activities
            .Where(a => MetricsHelper.IsPurchaseActivity(a))
            .OrderByDescending(a => a.OccurredAt)
            .Take(3))
        {
            var amount = MetricsHelper.ParseSaleAmount(sale);
            items.Add((sale.OccurredAt,
                new DashboardActivityDto(sale.Id.ToString(), "campaign",
                    amount > 0 ? $"Sale recorded — ${amount:0.00}" : "Sale recorded",
                    "", "campaign")));
        }

        var flows = await db.UserFlows.Where(f => f.UserId == userId && f.Status == "active").Take(3).ToListAsync();
        foreach (var f in flows)
        {
            items.Add((f.UpdatedAt,
                new DashboardActivityDto(f.Id.ToString(), "flow",
                    $"Flow \"{f.Name}\" is active", "", "flow")));
        }

        return items
            .OrderByDescending(a => a.At)
            .Take(8)
            .Select(a => a.Item with { Time = FormatRelativeTime(a.At) })
            .ToList();
    }

    private static string MapActivityIcon(string type) => type switch
    {
        "campaign" => "campaign",
        "subscriber" => "subscriber",
        "flow" => "flow",
        "scheduled" => "scheduled",
        _ => "campaign"
    };

    private static string FormatRelativeTime(DateTime occurred)
    {
        var diff = DateTime.UtcNow - occurred;
        if (diff.TotalMinutes < 60) return $"{Math.Max(1, (int)diff.TotalMinutes)} min ago";
        if (diff.TotalHours < 24) return $"{(int)diff.TotalHours} hours ago";
        if (diff.TotalDays < 2) return "1 day ago";
        return $"{(int)diff.TotalDays} days ago";
    }
}
