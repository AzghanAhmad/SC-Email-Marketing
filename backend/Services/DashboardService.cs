using Microsoft.EntityFrameworkCore;
using ScribeCount.Email.Api.Data;
using ScribeCount.Email.Api.DTOs;
using ScribeCount.Email.Api.Entities;

namespace ScribeCount.Email.Api.Services;

public class DashboardService(AppDbContext db)
{
    public async Task EnsureSeedDataAsync(Guid userId)
    {
        if (await db.SubscriberGrowthPoints.AnyAsync(x => x.UserId == userId)) return;

        var now = DateTime.UtcNow;

        var growth = new[]
        {
            ("Oct", 0, 5800), ("Nov", 1, 6200), ("Dec", 2, 6900),
            ("Jan", 3, 7400), ("Feb", 4, 7900), ("Mar", 5, 8421)
        };
        foreach (var (label, order, count) in growth)
        {
            db.SubscriberGrowthPoints.Add(new SubscriberGrowthPoint
            {
                Id = Guid.NewGuid(), UserId = userId, MonthLabel = label, SortOrder = order, SubscriberCount = count
            });
        }

        var campaigns = new[]
        {
            ("January sends", "Jan", 0, 3200, 1740, 980m, "sent"),
            ("February sends", "Feb", 1, 4650, 2274, 1120m, "sent"),
            ("March sends", "Mar", 2, 4821, 2613, 1540m, "sent"),
            ("April sends", "Apr", 3, 2100, 0, 640m, "scheduled")
        };
        foreach (var (name, label, order, sent, opened, revenue, status) in campaigns)
        {
            db.CampaignMetrics.Add(new CampaignMetric
            {
                Id = Guid.NewGuid(), UserId = userId, Name = name, MonthLabel = label,
                SortOrder = order, SentCount = sent, OpenedCount = opened, Revenue = revenue, Status = status
            });
        }

        var subscribers = new[]
        {
            ("Emily Clarke", "emily@example.com"), ("Marcus Webb", "marcus@example.com"),
            ("Sarah Kim", "sarah@example.com"), ("Priya Patel", "priya@example.com"),
            ("James O'Brien", "james@example.com"), ("Tom Nguyen", "tom@example.com")
        };
        foreach (var (name, email) in subscribers)
        {
            db.Subscribers.Add(new Subscriber
            {
                Id = Guid.NewGuid(), UserId = userId, Name = name, Email = email,
                Status = "active", JoinedAt = now.AddDays(-Random.Shared.Next(10, 120))
            });
        }

        var activities = new[]
        {
            ("campaign", "Campaign \"March Newsletter\" sent to 4,821 subscribers", now.AddHours(-2)),
            ("subscriber", "New subscriber: priya@example.com joined via landing page", now.AddHours(-4)),
            ("flow", "Welcome Flow triggered for 12 new subscribers", now.AddHours(-6)),
            ("subscriber", "New subscriber: tom@example.com joined via book link", now.AddHours(-8)),
            ("scheduled", "Campaign \"VIP Early Access\" scheduled for Apr 8", now.AddDays(-1)),
            ("flow", "Winback Flow triggered for 23 inactive subscribers", now.AddDays(-2))
        };
        foreach (var (type, message, occurred) in activities)
        {
            db.DashboardActivities.Add(new DashboardActivity
            {
                Id = Guid.NewGuid(), UserId = userId, ActivityType = type, Message = message, OccurredAt = occurred
            });
        }

        await db.SaveChangesAsync();
    }

    public async Task<DashboardDto> GetDashboardAsync(Guid userId, string? userName)
    {
        await EnsureSeedDataAsync(userId);

        var growth = await db.SubscriberGrowthPoints.Where(x => x.UserId == userId)
            .OrderBy(x => x.SortOrder).ToListAsync();
        var campaigns = await db.CampaignMetrics.Where(x => x.UserId == userId)
            .OrderBy(x => x.SortOrder).ToListAsync();
        var activities = await db.DashboardActivities.Where(x => x.UserId == userId)
            .OrderByDescending(x => x.OccurredAt).Take(8).ToListAsync();

        var latestCount = growth.LastOrDefault()?.SubscriberCount ?? 0;
        var prevCount = growth.Count >= 2 ? growth[^2].SubscriberCount : latestCount;
        var subscriberGrowth = prevCount == 0 ? 0 : Math.Round((latestCount - prevCount) / (double)prevCount * 100, 1);

        var sentCampaigns = campaigns.Where(c => c.Status == "sent").ToList();
        var emailsSent = sentCampaigns.Sum(c => c.SentCount);
        var prevMonthSent = sentCampaigns.Count >= 2 ? sentCampaigns[^2].SentCount : emailsSent;
        var lastMonthSent = sentCampaigns.LastOrDefault()?.SentCount ?? 0;
        var emailsGrowth = prevMonthSent == 0 ? 0 : Math.Round((lastMonthSent - prevMonthSent) / (double)prevMonthSent * 100, 1);

        var totalOpened = sentCampaigns.Sum(c => c.OpenedCount);
        var openRate = emailsSent == 0 ? 0 : Math.Round(totalOpened / (double)emailsSent * 100, 1);

        var lastTwo = sentCampaigns.TakeLast(2).ToList();
        double openRateGrowth = 0;
        if (lastTwo.Count == 2 && lastTwo[0].SentCount > 0 && lastTwo[1].SentCount > 0)
        {
            var prevRate = lastTwo[0].OpenedCount / (double)lastTwo[0].SentCount * 100;
            var currRate = lastTwo[1].OpenedCount / (double)lastTwo[1].SentCount * 100;
            openRateGrowth = Math.Round(currRate - prevRate, 1);
        }

        var revenue = sentCampaigns.Sum(c => c.Revenue);
        var prevRevenue = sentCampaigns.Count >= 2 ? sentCampaigns[^2].Revenue : revenue;
        var revenueGrowth = prevRevenue == 0 ? 0 : Math.Round((double)((revenue - prevRevenue) / prevRevenue * 100), 1);

        var totalRevenue = revenue + 1400m;
        var attributedRevenue = revenue;
        var attributedPct = totalRevenue == 0 ? 0 : Math.Round(attributedRevenue / totalRevenue * 100, 1);

        var periodEnd = DateTime.UtcNow;
        var periodStart = periodEnd.AddDays(-30);

        var stats = new DashboardStatsDto(
            latestCount, subscriberGrowth, emailsSent, emailsGrowth,
            openRate, openRateGrowth, revenue, revenueGrowth);

        var performance = new PerformanceSummaryDto(
            totalRevenue, 0, attributedRevenue, revenueGrowth,
            $"{periodStart:MMM d, yyyy} — {periodEnd:MMM d, yyyy}");

        var attribution = new List<AttributionItemDto>
        {
            new("Per Recipient", $"${(emailsSent == 0 ? 0 : revenue / emailsSent):0.00}", "", "user"),
            new("Campaigns", $"${revenue * 0.67m:0}", "67.1%", "campaign"),
            new("Flows", $"${revenue * 0.24m:0}", "23.8%", "flow"),
            new("Email", $"${attributedRevenue:0}", $"{attributedPct}%", "email"),
            new("Direct Sales", $"${totalRevenue - attributedRevenue:0}", $"{100 - attributedPct:0.0}%", "cart")
        };

        var campaignChart = campaigns.Select(c => new CampaignChartPointDto(c.MonthLabel, c.SentCount, c.OpenedCount)).ToList();
        var growthChart = growth.Select(g => new SubscriberGrowthPointDto(g.MonthLabel, g.SubscriberCount)).ToList();
        var recentActivity = activities.Select(a => new DashboardActivityDto(
            a.Id.ToString(), a.ActivityType, a.Message, FormatRelativeTime(a.OccurredAt), MapActivityIcon(a.ActivityType)
        )).ToList();

        var firstName = string.IsNullOrWhiteSpace(userName) ? "there" : userName.Split(' ')[0];

        return new DashboardDto(
            stats, performance, attribution, campaignChart, growthChart, recentActivity,
            periodStart.ToString("MMM d, yyyy"), periodEnd.ToString("MMM d, yyyy"), firstName);
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
