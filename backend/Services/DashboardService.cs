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

        var sentCampaigns = campaigns.Where(c => c.Status == "sent").ToList();
        var growthChart = BuildGrowthChart(subscribers);
        var campaignChart = BuildCampaignChart(sentCampaigns);

        var latestCount = subscribers.Count;
        var monthAgo = DateTime.UtcNow.AddDays(-30);
        var prevCount = subscribers.Count(s => s.JoinedAt < monthAgo);
        var subscriberGrowth = prevCount == 0 ? 0 : Math.Round((latestCount - prevCount) / (double)prevCount * 100, 1);

        var periodStart = DateTime.UtcNow.AddDays(-30);
        var periodCampaigns = sentCampaigns.Where(c => c.SentAt >= periodStart).ToList();
        var prevPeriodStart = periodStart.AddDays(-30);
        var prevPeriodCampaigns = sentCampaigns.Where(c => c.SentAt >= prevPeriodStart && c.SentAt < periodStart).ToList();

        var emailsSent = periodCampaigns.Sum(c => c.SentCount);
        var prevEmailsSent = prevPeriodCampaigns.Sum(c => c.SentCount);
        var emailsGrowth = prevEmailsSent == 0 ? 0 : Math.Round((emailsSent - prevEmailsSent) / (double)prevEmailsSent * 100, 1);

        var openRate = WeightedRate(periodCampaigns, c => (double)c.OpenRate);
        var prevOpenRate = WeightedRate(prevPeriodCampaigns, c => (double)c.OpenRate);
        var openRateGrowth = Math.Round(openRate - prevOpenRate, 1);

        var clickRate = WeightedRate(periodCampaigns, c => (double)c.ClickRate);
        var revenue = emailsSent * (decimal)(clickRate * 0.17);
        var prevRevenue = prevEmailsSent * (decimal)(WeightedRate(prevPeriodCampaigns, c => (double)c.ClickRate) * 0.17);
        var revenueGrowth = prevRevenue == 0 ? 0 : Math.Round((double)((revenue - prevRevenue) / prevRevenue * 100), 1);

        var totalRevenue = revenue;
        var attributedRevenue = revenue;
        var attributedPct = totalRevenue == 0 ? 0 : 100m;

        var periodEnd = DateTime.UtcNow;

        var stats = new DashboardStatsDto(
            latestCount, subscriberGrowth, emailsSent, emailsGrowth,
            openRate, openRateGrowth, revenue, revenueGrowth);

        var performance = new PerformanceSummaryDto(
            totalRevenue, revenueGrowth, attributedRevenue, revenueGrowth,
            $"{periodStart:MMM d, yyyy} — {periodEnd:MMM d, yyyy}");

        var perRecipient = emailsSent == 0 ? 0 : revenue / emailsSent;
        var attribution = new List<AttributionItemDto>
        {
            new("Per Recipient", $"${perRecipient:0.00}", "", "user"),
            new("Campaigns", revenue > 0 ? $"${revenue * 0.67m:0}" : "$0", revenue > 0 ? "67%" : "", "campaign"),
            new("Flows", revenue > 0 ? $"${revenue * 0.24m:0}" : "$0", revenue > 0 ? "24%" : "", "flow"),
            new("Email", revenue > 0 ? $"${attributedRevenue:0}" : "$0", revenue > 0 ? $"{attributedPct:0}%" : "", "email"),
            new("Direct Sales", "$0", "", "cart")
        };

        var recentActivity = await BuildRecentActivityAsync(userId, campaigns, subscribers);

        var firstName = string.IsNullOrWhiteSpace(userName) ? "there" : userName.Split(' ')[0];

        return new DashboardDto(
            stats, performance, attribution, campaignChart, growthChart, recentActivity,
            periodStart.ToString("MMM d, yyyy"), periodEnd.ToString("MMM d, yyyy"), firstName);
    }

    private static double WeightedRate(List<Campaign> campaigns, Func<Campaign, double> rateFn)
    {
        var total = campaigns.Sum(c => c.SentCount);
        if (total == 0) return 0;
        return campaigns.Sum(c => rateFn(c) * c.SentCount) / total;
    }

    private static List<SubscriberGrowthPointDto> BuildGrowthChart(List<Subscriber> subscribers)
    {
        var months = Enumerable.Range(0, 6).Select(i => DateTime.UtcNow.AddMonths(-5 + i)).ToList();
        return months.Select(m =>
        {
            var count = subscribers.Count(s => s.JoinedAt <= m.AddMonths(1).AddDays(-1));
            return new SubscriberGrowthPointDto(m.ToString("MMM"), count);
        }).ToList();
    }

    private static List<CampaignChartPointDto> BuildCampaignChart(List<Campaign> sentCampaigns)
    {
        var months = Enumerable.Range(0, 4).Select(i => DateTime.UtcNow.AddMonths(-3 + i)).ToList();
        return months.Select(m =>
        {
            var monthCampaigns = sentCampaigns.Where(c =>
                c.SentAt.HasValue && c.SentAt.Value.Year == m.Year && c.SentAt.Value.Month == m.Month).ToList();
            var sent = monthCampaigns.Sum(c => c.SentCount);
            var opened = (int)(sent * WeightedRate(monthCampaigns, c => (double)c.OpenRate) / 100);
            return new CampaignChartPointDto(m.ToString("MMM"), sent, opened);
        }).ToList();
    }

    private async Task<List<DashboardActivityDto>> BuildRecentActivityAsync(
        Guid userId, List<Campaign> campaigns, List<Subscriber> subscribers)
    {
        var activities = new List<(DateTime At, DashboardActivityDto Item)>();

        foreach (var c in campaigns.Where(c => c.Status is "sent" or "scheduled").Take(5))
        {
            var type = c.Status == "scheduled" ? "scheduled" : "campaign";
            var msg = c.Status == "scheduled"
                ? $"Campaign \"{c.Name}\" scheduled for {c.ScheduledAt:MMM d}"
                : $"Campaign \"{c.Name}\" sent to {c.SentCount:N0} subscribers";
            activities.Add((c.SentAt ?? c.ScheduledAt ?? c.UpdatedAt,
                new DashboardActivityDto(c.Id.ToString(), type, msg, "", MapActivityIcon(type))));
        }

        foreach (var s in subscribers.OrderByDescending(s => s.JoinedAt).Take(5))
        {
            activities.Add((s.JoinedAt,
                new DashboardActivityDto(s.Id.ToString(), "subscriber",
                    $"New subscriber: {s.Email} joined", "", "subscriber")));
        }

        var flows = await db.UserFlows.Where(f => f.UserId == userId && f.Status == "active").Take(3).ToListAsync();
        foreach (var f in flows)
        {
            activities.Add((f.UpdatedAt,
                new DashboardActivityDto(f.Id.ToString(), "flow",
                    $"Flow \"{f.Name}\" is active", "", "flow")));
        }

        return activities
            .OrderByDescending(a => a.At)
            .Take(8)
            .Select(a =>
            {
                var item = a.Item with { Time = FormatRelativeTime(a.At) };
                return item;
            })
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
