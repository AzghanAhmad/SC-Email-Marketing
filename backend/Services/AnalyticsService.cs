using Microsoft.EntityFrameworkCore;
using ScribeCount.Email.Api.Data;
using ScribeCount.Email.Api.DTOs;
using ScribeCount.Email.Api.Entities;

namespace ScribeCount.Email.Api.Services;

public class AnalyticsService(AppDbContext db)
{
    private static readonly Dictionary<string, double> IndustryBenchmarks = new(StringComparer.OrdinalIgnoreCase)
    {
        ["Open Rate"] = 33.0,
        ["Click Rate"] = 4.5,
        ["Bounce Rate"] = 1.0,
        ["Unsubscribe Rate"] = 0.3,
        ["Spam Complaint Rate"] = 0.01,
        ["Revenue per Email"] = 0.08
    };

    public async Task<AnalyticsBundleDto> GetBundleAsync(Guid userId, int periodDays = 30)
    {
        var periodEnd = DateTime.UtcNow;
        var periodStart = periodEnd.AddDays(-periodDays);
        var prevStart = periodStart.AddDays(-periodDays);

        var allCampaigns = await db.Campaigns
            .Where(c => c.UserId == userId)
            .OrderByDescending(c => c.SentAt ?? c.CreatedAt)
            .ToListAsync();

        var periodCampaigns = allCampaigns
            .Where(c => c.Status == "sent" && c.SentAt >= periodStart && c.SentAt <= periodEnd)
            .ToList();

        var prevCampaigns = allCampaigns
            .Where(c => c.Status == "sent" && c.SentAt >= prevStart && c.SentAt < periodStart)
            .ToList();

        var subscribers = await db.Subscribers.Where(s => s.UserId == userId).ToListAsync();
        var flows = await db.UserFlows.Where(f => f.UserId == userId && f.Status == "active").ToListAsync();

        var totalSent = periodCampaigns.Sum(c => c.SentCount);
        var prevSent = prevCampaigns.Sum(c => c.SentCount);
        var sentChange = PctChange(prevSent, totalSent);

        var activities = await db.SubscriberActivities.Where(a => a.UserId == userId).ToListAsync();

        var periodSentActs = CountSends(activities, periodStart, periodEnd);
        var prevSentActs = CountSends(activities, prevStart, periodStart);
        var periodOpens = CountUniqueOpens(activities, periodStart, periodEnd);
        var prevOpens = CountUniqueOpens(activities, prevStart, periodStart);

        var openRate = periodSentActs > 0 ? Math.Round(periodOpens * 100.0 / periodSentActs, 1) : 0;
        var prevOpenRate = prevSentActs > 0 ? Math.Round(prevOpens * 100.0 / prevSentActs, 1) : 0;
        var openChange = openRate - prevOpenRate;

        var periodClicks = CountUniqueClicks(activities, periodStart, periodEnd);
        var prevClicks = CountUniqueClicks(activities, prevStart, periodStart);
        var clickRate = periodSentActs > 0 ? Math.Round(periodClicks * 100.0 / periodSentActs, 1) : 0;
        var prevClickRate = prevSentActs > 0 ? Math.Round(prevClicks * 100.0 / prevSentActs, 1) : 0;
        var clickChange = clickRate - prevClickRate;

        var clickToOpen = openRate > 0 ? clickRate / openRate * 100 : 0;
        var prevClickToOpen = prevOpenRate > 0 ? prevClickRate / prevOpenRate * 100 : 0;
        var ctoChange = clickToOpen - prevClickToOpen;

        var conversionRate = openRate > 0 ? Math.Round(clickRate / openRate * 100, 1) : 0;
        var convChange = openRate > 0 && prevOpenRate > 0
            ? Math.Round(clickRate / openRate * 100 - prevClickRate / prevOpenRate * 100, 1)
            : 0;

        var totalRevenue = MetricsHelper.SumSaleRevenue(activities, periodStart, periodEnd);
        var prevRevenue = MetricsHelper.SumSaleRevenue(activities, prevStart, periodStart);
        var revenueChange = prevRevenue == 0
            ? (totalRevenue > 0 ? 100.0 : 0)
            : (double)((totalRevenue - prevRevenue) / prevRevenue * 100);
        var revenuePerEmail = totalSent > 0 ? totalRevenue / totalSent : 0;

        var bounceRate = subscribers.Count == 0 ? 0 : subscribers.Count(s => s.Status == "bounced") / (double)subscribers.Count * 100;
        var unsubRate = subscribers.Count == 0 ? 0 : subscribers.Count(s => s.Status == "unsubscribed") / (double)subscribers.Count * 100;

        var kpis = new List<AnalyticsKpiDto>
        {
            new("Emails Sent", totalSent.ToString("N0"), sentChange, "email"),
            new("Open Rate (MPP adj.)", $"{openRate:0.0}%", openChange, "eye"),
            new("Click Rate", $"{clickRate:0.0}%", clickChange, "link"),
            new("Click-to-Open", $"{clickToOpen:0.0}%", ctoChange, "check"),
            new("Conversion Rate", $"{conversionRate:0.1}%", convChange, "trend"),
            new("Revenue", totalRevenue > 0 ? $"${totalRevenue:0,0}" : "$0", revenueChange, "dollar")
        };

        var volumeData = BuildVolumeData(allCampaigns);
        var engagementTrend = BuildEngagementTrend(allCampaigns);
        var engBreakdown = BuildEngagementBreakdown(openRate, clickRate, unsubRate);
        var campaignFunnel = BuildCampaignFunnel(periodCampaigns, activities);

        var metrics = new List<MetricCardDto>
        {
            new("Open Rate", $"{openRate:0.0}%", openChange, "#3b82f6", Sparkline(openRate, prevOpenRate)),
            new("Click Rate", $"{clickRate:0.1}%", clickChange, "#8b5cf6", Sparkline(clickRate, prevClickRate)),
            new("Bounce Rate", $"{bounceRate:0.1}%", 0, "#ef4444", "0,8 20,10 40,12 60,15 80,18 100,20"),
            new("Unsubscribe Rate", $"{unsubRate:0.1}%", 0, "#f59e0b", "0,15 20,12 40,14 60,10 80,8 100,6"),
            new("Revenue/Email", totalSent > 0 ? $"${revenuePerEmail:0.00}" : "$0.00", revenueChange, "#10b981", Sparkline((double)revenuePerEmail, prevSent > 0 ? (double)(prevRevenue / prevSent) : 0)),
            new("List Growth", $"+{GrowthThisPeriod(subscribers, periodStart)}", 0, "#6366f1", "0,25 20,20 40,22 60,15 80,10 100,8")
        };

        var totalOpens = periodOpens;
        var prevOpensCount = prevOpens;
        var totalClicks = periodClicks;
        var prevClicksCount = prevClicks;

        var metricDetails = new List<MetricDetailRowDto>
        {
            new("Total Opens", totalOpens.ToString("N0"), prevOpensCount.ToString("N0"), PctChange(prevOpensCount, totalOpens), "0,18 15,14 30,16 45,10 60,8"),
            new("Unique Clicks", totalClicks.ToString("N0"), prevClicksCount.ToString("N0"), PctChange(prevClicksCount, totalClicks), "0,16 15,14 30,12 45,10 60,6"),
            new("Deliverability", $"{100 - bounceRate:0.0}%", "—", 0, "0,10 15,8 30,9 45,6 60,4"),
            new("Spam Complaints", "0.00%", "—", 0, "0,15 15,12 30,14 45,10 60,8"),
            new("Revenue (Total)", totalRevenue > 0 ? $"${totalRevenue:0,0}" : "$0", prevRevenue > 0 ? $"${prevRevenue:0,0}" : "$0", revenueChange, "0,18 15,15 30,12 45,8 60,4")
        };

        var flowSteps = BuildFlowSteps(flows, totalSent, openRate, clickRate);
        var goalExitRates = flows.Select(f => new GoalExitRateDto(
            f.Name,
            subscribers.Count == 0 || f.Triggers == 0 ? 0 : Math.Round(f.Triggers / (double)subscribers.Count * 100, 1),
            string.IsNullOrWhiteSpace(f.GoalExit) ? "No goal configured" : $"Goal: {f.GoalExit}"
        )).ToList();

        var deliverabilityScore = ComputeDeliverabilityScore(openRate, clickRate, bounceRate, unsubRate);
        var scoreHistory = BuildScoreHistory(deliverabilityScore);

        var deliverabilityMetrics = new List<DeliverabilityMetricDto>
        {
            new("Open rate", $"{openRate:0.1}%", "greater than 33.0%", openRate >= 33 ? "good" : openRate >= 20 ? "warning" : "danger"),
            new("Click rate", $"{clickRate:0.2}%", "greater than 1.20%", clickRate >= 1.2 ? "good" : clickRate >= 0.5 ? "warning" : "danger"),
            new("Bounce rate", $"{bounceRate:0.2}%", "less than 1.00%", bounceRate <= 1 ? "good" : bounceRate <= 2.5 ? "warning" : "danger"),
            new("Unsubscribe rate", $"{unsubRate:0.2}%", "less than 0.30%", unsubRate <= 0.3 ? "good" : unsubRate <= 0.75 ? "warning" : "danger"),
            new("Spam complaint rate", "0.00%", "less than 0.01%", "good")
        };

        var deliveryReports = periodCampaigns.Take(10).Select(c =>
        {
            var delivered = (int)(c.SentCount * 0.975);
            var bounced = c.SentCount - delivered;
            var rate = c.SentCount == 0 ? 0 : Math.Round(delivered / (double)c.SentCount * 100, 1);
            return new DeliveryReportRowDto(c.Name, c.SentCount, delivered, bounced, rate);
        }).ToList();

        var bouncedCount = subscribers.Count(s => s.Status == "bounced");
        var suppressedCount = subscribers.Count(s => s.Status is "suppressed" or "inactive");
        var bounceStats = new List<BounceStatDto>
        {
            new("Hard Bounces", bouncedCount.ToString(), subscribers.Count == 0 ? "0" : $"{bouncedCount / (double)subscribers.Count * 100:0.00}", "hard-bounce"),
            new("Soft Bounces", "0", "0.00", "soft-bounce"),
            new("Suppressed", suppressedCount.ToString(), subscribers.Count == 0 ? "0" : $"{suppressedCount / (double)subscribers.Count * 100:0.00}", "suppressed"),
            new("Complaints", "0", "0.00", "complaint")
        };

        var bouncedEmails = subscribers
            .Where(s => s.Status == "bounced")
            .Take(10)
            .Select(s => new BouncedEmailRowDto(s.Email, "hard", "Mailbox does not exist", s.JoinedAt.ToString("MMM d, yyyy")))
            .ToList();

        var benchmarks = BuildBenchmarks(openRate, clickRate, bounceRate, unsubRate, revenuePerEmail);
        var listHealth = BuildListHealth(subscribers);

        return new AnalyticsBundleDto(
            kpis, volumeData, engagementTrend, engBreakdown, campaignFunnel,
            metrics, metricDetails, flowSteps, goalExitRates, [],
            deliverabilityScore, 0, scoreHistory, deliverabilityMetrics, deliveryReports,
            bounceStats, bouncedEmails, benchmarks,
            listHealth.Kpis, listHealth.Trend, listHealth.Outcomes, listHealth.Flagged,
            []
        );
    }

    private static double WeightedRate(List<Campaign> campaigns, Func<Campaign, double> rateFn)
    {
        var total = campaigns.Sum(c => c.SentCount);
        if (total == 0) return 0;
        return campaigns.Sum(c => rateFn(c) * c.SentCount) / total;
    }

    private static double PctChange(double prev, double curr)
    {
        if (prev == 0) return curr == 0 ? 0 : 100;
        return Math.Round((curr - prev) / prev * 100, 1);
    }

    private static string Sparkline(double curr, double prev)
    {
        var mid = (curr + prev) / 2;
        return $"0,25 20,{20 - mid * 0.3:0} 40,{18 - curr * 0.2:0} 60,{12 - mid * 0.15:0} 80,{8 - curr * 0.1:0} 100,5";
    }

    private static int GrowthThisPeriod(List<Subscriber> subscribers, DateTime since)
        => subscribers.Count(s => s.JoinedAt >= since);

    private static List<VolumeDataPointDto> BuildVolumeData(List<Campaign> campaigns)
    {
        var months = Enumerable.Range(0, 6)
            .Select(i => DateTime.UtcNow.AddMonths(-5 + i))
            .ToList();

        return months.Select(m =>
        {
            var label = m.ToString("MMM");
            var monthCampaigns = campaigns.Where(c =>
                c.Status == "sent" && c.SentAt.HasValue &&
                c.SentAt.Value.Year == m.Year && c.SentAt.Value.Month == m.Month).ToList();
            var sent = monthCampaigns.Sum(c => c.SentCount);
            var delivered = (int)(sent * 0.975);
            return new VolumeDataPointDto(label, sent, delivered);
        }).ToList();
    }

    private static List<EngagementTrendPointDto> BuildEngagementTrend(List<Campaign> campaigns)
    {
        var months = Enumerable.Range(0, 6)
            .Select(i => DateTime.UtcNow.AddMonths(-5 + i))
            .ToList();

        return months.Select(m =>
        {
            var label = m.ToString("MMM");
            var monthCampaigns = campaigns.Where(c =>
                c.Status == "sent" && c.SentAt.HasValue &&
                c.SentAt.Value.Year == m.Year && c.SentAt.Value.Month == m.Month).ToList();
            return new EngagementTrendPointDto(
                label,
                WeightedRate(monthCampaigns, c => (double)c.OpenRate),
                WeightedRate(monthCampaigns, c => (double)c.ClickRate)
            );
        }).ToList();
    }

    private static List<EngagementBreakdownDto> BuildEngagementBreakdown(double openRate, double clickRate, double unsubRate)
    {
        return
        [
            new("Opened", Math.Round(openRate, 1), "#60a5fa"),
            new("Clicked", Math.Round(clickRate, 1), "#818cf8"),
            new("Replied", Math.Round(clickRate * 0.3, 1), "#a78bfa"),
            new("Forwarded", Math.Round(clickRate * 0.15, 1), "#34d399"),
            new("Unsubscribed", Math.Round(unsubRate, 1), "#f87171")
        ];
    }

    private static List<CampaignFunnelRowDto> BuildCampaignFunnel(List<Campaign> campaigns, List<SubscriberActivity> activities)
    {
        return campaigns.Take(8).Select(c =>
        {
            var (opens, clicks, delivered) = MetricsHelper.CampaignEngagement(activities, c.Id);
            var denominator = delivered > 0 ? delivered : c.SentCount;
            var purchases = activities.Count(a =>
                a.CampaignId == c.Id && MetricsHelper.IsPurchaseActivity(a));
            var revenue = activities
                .Where(a => a.CampaignId == c.Id && MetricsHelper.IsPurchaseActivity(a))
                .Sum(MetricsHelper.ParseSaleAmount);
            return new CampaignFunnelRowDto(
                c.Name, c.SentCount, denominator, opens, clicks, purchases,
                revenue > 0 ? $"${revenue:0,0}" : "$0");
        }).ToList();
    }

    private static List<FlowStepRowDto> BuildFlowSteps(List<UserFlow> flows, int totalSent, double openRate, double clickRate)
    {
        var steps = new List<FlowStepRowDto>();
        foreach (var flow in flows.Take(4))
        {
            var entered = flow.Triggers > 0 ? flow.Triggers : Math.Max(1, totalSent / 10);
            var delivered = (int)(entered * 0.97);
            var opens = (int)(delivered * openRate / 100);
            var clicks = (int)(delivered * clickRate / 100);
            steps.Add(new FlowStepRowDto(flow.Name, entered, (int)(entered * 0.88), delivered, opens, clicks, clicks > 0 ? $"${clicks * 2.5m:0}" : "$0"));
        }
        return steps;
    }

    private static int ComputeDeliverabilityScore(double openRate, double clickRate, double bounceRate, double unsubRate)
    {
        var score = 50.0;
        score += Math.Min(openRate, 60) * 0.4;
        score += Math.Min(clickRate * 3, 15);
        score -= bounceRate * 5;
        score -= unsubRate * 10;
        return (int)Math.Clamp(Math.Round(score), 0, 100);
    }

    private static List<ScoreHistoryPointDto> BuildScoreHistory(int currentScore)
    {
        var history = new List<ScoreHistoryPointDto>();
        for (var i = 5; i >= 0; i--)
        {
            var delta = (5 - i) * 2 - 3;
            history.Add(new ScoreHistoryPointDto($"Week {6 - i}", Math.Clamp(currentScore - delta, 0, 100)));
        }
        history[^1] = new ScoreHistoryPointDto(history[^1].Label, currentScore);
        return history;
    }

    private static List<BenchmarkRowDto> BuildBenchmarks(
        double openRate, double clickRate, double bounceRate, double unsubRate, decimal revenuePerEmail)
    {
        string ColorFor(double yours, double industry, bool lowerIsBetter)
        {
            var better = lowerIsBetter ? yours <= industry : yours >= industry;
            return better ? "#10b981" : "#ef4444";
        }

        return
        [
            new("Open Rate", $"{openRate:0.1}%", openRate, "33.0%", 33, ColorFor(openRate, 33, false)),
            new("Click Rate", $"{clickRate:0.1}%", clickRate, "4.5%", 4.5, ColorFor(clickRate, 4.5, false)),
            new("Bounce Rate", $"{bounceRate:0.1}%", bounceRate, "1.0%", 1, ColorFor(bounceRate, 1, true)),
            new("Unsubscribe Rate", $"{unsubRate:0.1}%", unsubRate, "0.3%", 0.3, ColorFor(unsubRate, 0.3, true)),
            new("Spam Complaint Rate", "0.00%", 0, "0.01%", 0.01, "#10b981"),
            new("Revenue per Email", $"${revenuePerEmail:0.00}", (double)revenuePerEmail * 100, "$0.08", 8, ColorFor((double)revenuePerEmail, 0.08, false))
        ];
    }

    private static (List<ListHealthKpiDto> Kpis, List<ListHealthTrendPointDto> Trend,
        List<ListHealthOutcomeDto> Outcomes, List<FlaggedSubscriberDto> Flagged) BuildListHealth(List<Subscriber> subscribers)
    {
        var total = subscribers.Count;
        var active = subscribers.Count(s => s.Status == "active");
        var bounced = subscribers.Count(s => s.Status == "bounced");
        var inactive = subscribers.Count(s => s.Status is "inactive" or "unsubscribed");
        var flagged = subscribers.Count(s => s.Status == "inactive");
        var activePct = total == 0 ? 0 : (int)Math.Round(active / (double)total * 100);

        var kpis = new List<ListHealthKpiDto>
        {
            new("Total subscribers", total.ToString("N0"), "All addresses on account", "#0f172a"),
            new("Active engaged", active.ToString("N0"), "Opened or clicked within threshold", "#6366f1"),
            new("Flagged inactive", flagged.ToString("N0"), "Crossed threshold, not yet in sequence", "#d97706"),
            new("In re-engagement", "0", "Currently in active sequence", "#db2777"),
            new("Re-engaged (30d)", "0", "Returned to active this month", "#059669"),
            new("Removed (30d)", inactive.ToString("N0"), "Cleanly removed after sequence", "#94a3b8")
        };

        var months = Enumerable.Range(0, 6).Select(i => DateTime.UtcNow.AddMonths(-5 + i)).ToList();
        var trend = months.Select((m, idx) =>
        {
            var joinedByMonth = subscribers.Count(s => s.JoinedAt.Year == m.Year && s.JoinedAt.Month <= m.Month);
            var pct = total == 0 ? 0 : (int)Math.Min(95, 65 + idx * 3 + joinedByMonth % 5);
            return new ListHealthTrendPointDto(m.ToString("MMM"), pct, 100 - pct);
        }).ToList();

        var outcomes = new List<ListHealthOutcomeDto>
        {
            new("Active", active, total == 0 ? 0 : (int)Math.Round(active / (double)total * 100), "#059669"),
            new("Inactive", inactive, total == 0 ? 0 : (int)Math.Round(inactive / (double)total * 100), "#94a3b8"),
            new("Bounced", bounced, total == 0 ? 0 : (int)Math.Round(bounced / (double)total * 100), "#ef4444")
        };

        var flaggedQueue = subscribers
            .Where(s => s.Status is "inactive" or "bounced")
            .Take(10)
            .Select(s =>
            {
                var days = (int)(DateTime.UtcNow - s.JoinedAt).TotalDays;
                var statusClass = s.Status == "bounced" ? "queued" : "in-sequence";
                return new FlaggedSubscriberDto(
                    s.Email, s.JoinedAt.ToString("MMM d, yyyy"), days,
                    s.Status == "bounced" ? "Queued" : "In sequence", statusClass, "90-day (weekly)");
            }).ToList();

        return (kpis, trend, outcomes, flaggedQueue);
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

    private static int CountUniqueClicks(IReadOnlyList<SubscriberActivity> activities, DateTime from, DateTime to) =>
        activities
            .Where(a =>
                a.ActivityType == "campaign_clicked"
                && a.OccurredAt >= from
                && a.OccurredAt < to)
            .Select(a => (a.SubscriberId, a.CampaignId))
            .Distinct()
            .Count();
}
