using Microsoft.EntityFrameworkCore;
using ScribeCount.Email.Api.Data;
using ScribeCount.Email.Api.DTOs;
using ScribeCount.Email.Api.Entities;

namespace ScribeCount.Email.Api.Services;

public class AnalyticsService(AppDbContext db, IndustryBenchmarkService industryBenchmarks)
{
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
        var openChange = PctChange(prevOpenRate, openRate);

        var periodClicks = CountUniqueClicks(activities, periodStart, periodEnd);
        var prevClicks = CountUniqueClicks(activities, prevStart, periodStart);
        var clickRate = periodSentActs > 0 ? Math.Round(periodClicks * 100.0 / periodSentActs, 1) : 0;
        var prevClickRate = prevSentActs > 0 ? Math.Round(prevClicks * 100.0 / prevSentActs, 1) : 0;
        var clickChange = PctChange(prevClickRate, clickRate);

        var periodUnsubs = activities.Count(a =>
            (a.ActivityType is "unsubscribed" or "unsubscribe") && a.OccurredAt >= periodStart && a.OccurredAt <= periodEnd);
        var prevUnsubs = activities.Count(a =>
            (a.ActivityType is "unsubscribed" or "unsubscribe") && a.OccurredAt >= prevStart && a.OccurredAt < periodStart);
        var unsubRatePeriod = periodSentActs > 0 ? Math.Round(periodUnsubs * 100.0 / periodSentActs, 2) : 0;
        var prevUnsubRatePeriod = prevSentActs > 0 ? Math.Round(prevUnsubs * 100.0 / prevSentActs, 2) : 0;
        var unsubChange = PctChange(prevUnsubRatePeriod, unsubRatePeriod);

        var deliveryEvents = await db.DeliveryEvents
            .Where(e => e.UserId == userId && e.OccurredAt >= prevStart && e.OccurredAt <= periodEnd)
            .ToListAsync();
        var periodDeliveryEvents = deliveryEvents.Where(e => e.OccurredAt >= periodStart).ToList();
        var prevDeliveryEvents = deliveryEvents.Where(e => e.OccurredAt < periodStart).ToList();

        var periodBounces = periodDeliveryEvents.Count(e => e.EventType == "bounce");
        var prevBounces = prevDeliveryEvents.Count(e => e.EventType == "bounce");
        var periodComplaints = periodDeliveryEvents.Count(e => e.EventType == "complaint");
        var bounceRatePeriod = periodSentActs > 0 ? Math.Round(periodBounces * 100.0 / periodSentActs, 2) : 0;
        var prevBounceRatePeriod = prevSentActs > 0 ? Math.Round(prevBounces * 100.0 / prevSentActs, 2) : 0;
        var bounceChange = PctChange(prevBounceRatePeriod, bounceRatePeriod);
        var complaintRatePeriod = periodSentActs > 0 ? Math.Round(periodComplaints * 100.0 / periodSentActs, 3) : 0;

        var bounceRate = subscribers.Count == 0 ? 0 : subscribers.Count(s => s.Status == "bounced") / (double)subscribers.Count * 100;
        var unsubRate = subscribers.Count == 0 ? 0 : subscribers.Count(s => s.Status == "unsubscribed") / (double)subscribers.Count * 100;

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
        var prevRevenuePerEmail = prevSent > 0 ? prevRevenue / prevSent : 0;
        var revenuePerEmailChange = PctChange((double)prevRevenuePerEmail, (double)revenuePerEmail);

        var listGrowth = GrowthThisPeriod(subscribers, periodStart);
        var prevListGrowth = subscribers.Count(s => s.JoinedAt >= prevStart && s.JoinedAt < periodStart);
        var listGrowthChange = PctChange(prevListGrowth, listGrowth);

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
        var subscriberGrowth = BuildSubscriberGrowth(subscribers, activities);
        var campaignFunnel = BuildCampaignFunnel(periodCampaigns, activities);

        var metrics = new List<MetricCardDto>
        {
            new("Open Rate", $"{openRate:0.0}%", openChange, "#3b82f6", ""),
            new("Click Rate", $"{clickRate:0.0}%", clickChange, "#8b5cf6", ""),
            new("Bounce Rate", $"{bounceRatePeriod:0.0}%", bounceChange, "#ef4444", ""),
            new("Unsubscribe Rate", $"{unsubRatePeriod:0.0}%", unsubChange, "#f59e0b", ""),
            new("Revenue/Email", totalSent > 0 ? $"${revenuePerEmail:0.00}" : "$0.00", revenuePerEmailChange, "#10b981", ""),
            new("List Growth", $"+{listGrowth}", listGrowthChange, "#6366f1", "")
        };

        var totalOpens = periodOpens;
        var prevOpensCount = prevOpens;
        var totalClicks = periodClicks;
        var prevClicksCount = prevClicks;

        var metricDetails = new List<MetricDetailRowDto>
        {
            new("Total Opens", totalOpens.ToString("N0"), prevOpensCount.ToString("N0"), PctChange(prevOpensCount, totalOpens), StatusForChange(PctChange(prevOpensCount, totalOpens))),
            new("Unique Clicks", totalClicks.ToString("N0"), prevClicksCount.ToString("N0"), PctChange(prevClicksCount, totalClicks), StatusForChange(PctChange(prevClicksCount, totalClicks))),
            new("Deliverability", $"{100 - bounceRate:0.0}%", "—", 0, bounceRate <= 2 ? "Healthy" : "Needs attention"),
            new("Spam Complaints", $"{complaintRatePeriod:0.000}%", "—", 0, complaintRatePeriod < 0.01 ? "Healthy" : "Needs attention"),
            new("Revenue (Total)", totalRevenue > 0 ? $"${totalRevenue:0,0}" : "$0", prevRevenue > 0 ? $"${prevRevenue:0,0}" : "$0", revenueChange, StatusForChange(revenueChange))
        };

        var flowSteps = await BuildFlowStepsAsync(userId, periodStart, periodEnd);
        var goalExitRates = await BuildGoalExitRatesAsync(userId, flows, subscribers);
        var sendAuditRows = await BuildSendAuditRowsAsync(userId, periodStart, periodEnd);

        var deliverabilityScore = ComputeDeliverabilityScore(openRate, clickRate, bounceRate, unsubRate);
        var scoreHistory = BuildScoreHistory(deliverabilityScore);
        var scoreChange = scoreHistory.Count >= 2 ? scoreHistory[^1].Score - scoreHistory[^2].Score : 0;

        var deliverabilityMetrics = new List<DeliverabilityMetricDto>
        {
            new("Open rate", $"{openRate:0.1}%", "greater than 33.0%", openRate >= 33 ? "good" : openRate >= 20 ? "warning" : "danger"),
            new("Click rate", $"{clickRate:0.2}%", "greater than 1.20%", clickRate >= 1.2 ? "good" : clickRate >= 0.5 ? "warning" : "danger"),
            new("Bounce rate", $"{bounceRate:0.2}%", "less than 1.00%", bounceRate <= 1 ? "good" : bounceRate <= 2.5 ? "warning" : "danger"),
            new("Unsubscribe rate", $"{unsubRate:0.2}%", "less than 0.30%", unsubRate <= 0.3 ? "good" : unsubRate <= 0.75 ? "warning" : "danger"),
            new("Spam complaint rate", $"{complaintRatePeriod:0.000}%", "less than 0.01%",
                complaintRatePeriod < 0.01 ? "good" : complaintRatePeriod < 0.05 ? "warning" : "danger")
        };

        var deliveryReports = periodCampaigns.Take(10).Select(c =>
        {
            var campaignEvents = periodDeliveryEvents.Where(e => e.CampaignId == c.Id).ToList();
            var delivered = campaignEvents.Count(e => e.EventType == "delivery");
            var bounced = campaignEvents.Count(e => e.EventType == "bounce");
            if (delivered == 0 && bounced == 0 && c.SentCount > 0)
            {
                // No SNS events yet — show sent as pending delivery confirmation
                delivered = 0;
                bounced = 0;
            }
            var rate = c.SentCount == 0 ? 0 : Math.Round(delivered / (double)c.SentCount * 100, 1);
            return new DeliveryReportRowDto(c.Name, c.SentCount, delivered, bounced, rate);
        }).ToList();

        var hardBounces = periodDeliveryEvents.Count(e =>
            e.EventType == "bounce" && e.BounceType.Equals("Permanent", StringComparison.OrdinalIgnoreCase));
        var softBounces = periodDeliveryEvents.Count(e =>
            e.EventType == "bounce" && !e.BounceType.Equals("Permanent", StringComparison.OrdinalIgnoreCase));
        var bouncedCount = subscribers.Count(s => s.Status == "bounced");
        var complainedCount = subscribers.Count(s => s.Status == "complained");
        var suppressedCount = subscribers.Count(s => s.Status is "suppressed" or "inactive" or "bounced" or "complained");
        var bounceStats = new List<BounceStatDto>
        {
            new("Hard Bounces", hardBounces > 0 ? hardBounces.ToString() : bouncedCount.ToString(),
                subscribers.Count == 0 ? "0" : $"{(hardBounces > 0 ? hardBounces : bouncedCount) / (double)subscribers.Count * 100:0.00}", "hard-bounce"),
            new("Soft Bounces", softBounces.ToString(),
                subscribers.Count == 0 ? "0" : $"{softBounces / (double)subscribers.Count * 100:0.00}", "soft-bounce"),
            new("Suppressed", suppressedCount.ToString(),
                subscribers.Count == 0 ? "0" : $"{suppressedCount / (double)subscribers.Count * 100:0.00}", "suppressed"),
            new("Complaints", periodComplaints > 0 ? periodComplaints.ToString() : complainedCount.ToString(),
                subscribers.Count == 0 ? "0" : $"{(periodComplaints > 0 ? periodComplaints : complainedCount) / (double)subscribers.Count * 100:0.00}", "complaint")
        };

        var bouncedEmails = periodDeliveryEvents
            .Where(e => e.EventType is "bounce" or "complaint")
            .OrderByDescending(e => e.OccurredAt)
            .Take(10)
            .Select(e => new BouncedEmailRowDto(
                e.Email,
                e.EventType == "complaint" ? "complaint"
                    : e.BounceType.Equals("Permanent", StringComparison.OrdinalIgnoreCase) ? "hard" : "soft",
                string.IsNullOrWhiteSpace(e.DiagnosticCode) ? e.EventType : e.DiagnosticCode,
                e.OccurredAt.ToString("MMM d, yyyy")))
            .ToList();

        if (bouncedEmails.Count == 0)
        {
            bouncedEmails = subscribers
                .Where(s => s.Status is "bounced" or "complained")
                .Take(10)
                .Select(s => new BouncedEmailRowDto(
                    s.Email,
                    s.Status == "complained" ? "complaint" : "hard",
                    s.Status == "complained" ? "Spam complaint" : "Hard bounce",
                    s.JoinedAt.ToString("MMM d, yyyy")))
                .ToList();
        }

        var benchmarks = await BuildBenchmarksAsync(openRate, clickRate, bounceRate, unsubRate, revenuePerEmail);
        var listHealth = BuildListHealth(subscribers, activities, periodStart);
        var customReports = BuildCustomReports(userId, periodCampaigns, subscribers, totalSent, openRate);
        var deliverabilityActions = BuildDeliverabilityActions(openRate, bounceRate, unsubRate);

        return new AnalyticsBundleDto(
            kpis, volumeData, engagementTrend, engBreakdown, subscriberGrowth, campaignFunnel,
            metrics, metricDetails, flowSteps, goalExitRates, sendAuditRows,
            deliverabilityScore, scoreChange, scoreHistory, deliverabilityMetrics, deliveryReports,
            bounceStats, bouncedEmails, benchmarks,
            listHealth.Kpis, listHealth.Trend, listHealth.Outcomes, listHealth.Flagged,
            customReports, deliverabilityActions
        );
    }

    public async Task<MarketingAnalyticsDto> GetMarketingAnalyticsAsync(Guid userId, int periodDays = 30)
    {
        var bundle = await GetBundleAsync(userId, periodDays);
        var periodEnd = DateTime.UtcNow;
        var periodStart = periodEnd.AddDays(-periodDays);
        var prevStart = periodStart.AddDays(-periodDays);

        var activities = await db.SubscriberActivities.Where(a => a.UserId == userId).ToListAsync();
        var campaigns = await db.Campaigns.Where(c => c.UserId == userId && c.Status == "sent").ToListAsync();
        var periodCampaigns = campaigns.Where(c => c.SentAt >= periodStart && c.SentAt <= periodEnd).ToList();

        var revenue = MetricsHelper.SumSaleRevenue(activities, periodStart, periodEnd);
        var prevRevenue = MetricsHelper.SumSaleRevenue(activities, prevStart, periodStart);
        var revenueChange = prevRevenue == 0 ? (revenue > 0 ? 100.0 : 0) : (double)((revenue - prevRevenue) / prevRevenue * 100);

        var attributed = activities
            .Where(a => MetricsHelper.IsPurchaseActivity(a) && a.CampaignId != null && a.OccurredAt >= periodStart && a.OccurredAt <= periodEnd)
            .Sum(MetricsHelper.ParseSaleAmount);
        var attrChange = prevRevenue == 0 ? 0 : revenueChange;

        var performance = new PerformanceSummaryDto(
            revenue, revenueChange, attributed, attrChange,
            $"{periodStart:MMM d, yyyy} — {periodEnd:MMM d, yyyy}");

        var periodSent = periodCampaigns.Sum(c => c.SentCount);
        var perRecipient = periodSent > 0 ? revenue / periodSent : 0;
        var direct = Math.Max(0, revenue - attributed);
        var attrPct = revenue == 0 ? 0 : Math.Round(attributed / revenue * 100);

        var attribution = new List<AttributionItemDto>
        {
            new("Per Recipient", periodSent > 0 ? $"${perRecipient:0.00}" : "$0.00", "", "user"),
            new("Campaigns", attributed > 0 ? $"${attributed:0.00}" : "$0", attributed > 0 ? $"{attrPct:0}%" : "", "campaign"),
            new("Flows", "$0", "", "flow"),
            new("Email", attributed > 0 ? $"${attributed:0.00}" : "$0", attributed > 0 ? $"{attrPct:0}%" : "", "email"),
            new("Direct Sales", direct > 0 ? $"${direct:0.00}" : "$0", direct > 0 && revenue > 0 ? $"{Math.Round(direct / revenue * 100):0}%" : "", "cart")
        };

        var maxCampaignRev = periodCampaigns.Select(c => activities
            .Where(a => a.CampaignId == c.Id && MetricsHelper.IsPurchaseActivity(a))
            .Sum(MetricsHelper.ParseSaleAmount)).DefaultIfEmpty(0).Max();

        var campaignImpact = periodCampaigns.Take(8).Select(c =>
        {
            var rev = activities.Where(a => a.CampaignId == c.Id && MetricsHelper.IsPurchaseActivity(a)).Sum(MetricsHelper.ParseSaleAmount);
            var pct = maxCampaignRev == 0 ? 0 : (double)(rev / maxCampaignRev * 100);
            return new MarketingCampaignImpactDto(c.Name, rev > 0 ? $"${rev:0,0}" : "$0", c.SentCount, (double)c.OpenRate, Math.Round(pct, 1));
        }).ToList();

        var sources = new List<MarketingSourceDto>
        {
            new("Email Campaigns", attributed > 0 ? $"${attributed:0,0}" : "$0", revenue == 0 ? 0 : (double)(attributed / revenue * 100), "#3b82f6"),
            new("Direct / Other", direct > 0 ? $"${direct:0,0}" : "$0", revenue == 0 ? 0 : (double)(direct / revenue * 100), "#8b5cf6"),
            new("Flows", "$0", 0, "#10b981"),
        };

        return new MarketingAnalyticsDto(
            performance, attribution, sources, campaignImpact,
            bundle.VolumeData, bundle.EngagementTrend,
            periodStart.ToString("MMM d, yyyy"), periodEnd.ToString("MMM d, yyyy"));
    }

    private static List<SubscriberGrowthPointDto> BuildSubscriberGrowth(
        IReadOnlyList<Subscriber> subscribers, IReadOnlyList<SubscriberActivity> activities) =>
        ChartMonthHelper.LastMonths(6).Select(m =>
        {
            var monthEnd = new DateTime(m.Year, m.Month, DateTime.DaysInMonth(m.Year, m.Month), 23, 59, 59, DateTimeKind.Utc);
            var count = MetricsHelper.ActiveSubscribersAt(subscribers, activities, monthEnd);
            return new SubscriberGrowthPointDto(ChartMonthHelper.Label(m), count);
        }).ToList();

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

    private static string StatusForChange(double change) =>
        change > 5 ? "Improving" : change < -5 ? "Declining" : "Stable";

    private static List<VolumeDataPointDto> BuildVolumeData(List<Campaign> campaigns)
    {
        return ChartMonthHelper.LastMonths(6).Select(m =>
        {
            var label = ChartMonthHelper.Label(m);
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
        return ChartMonthHelper.LastMonths(6).Select(m =>
        {
            var label = ChartMonthHelper.Label(m);
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

    private async Task<List<FlowStepRowDto>> BuildFlowStepsAsync(Guid userId, DateTime periodStart, DateTime periodEnd)
    {
        var responses = await db.FlowStepResponses.AsNoTracking()
            .Include(r => r.FlowEnrollment).ThenInclude(e => e.FlowRun).ThenInclude(r => r.UserFlow)
            .Include(r => r.FlowEnrollment).ThenInclude(e => e.Subscriber)
            .Where(r => r.FlowEnrollment.FlowRun.UserId == userId
                && r.SubmittedAt >= periodStart && r.SubmittedAt <= periodEnd)
            .ToListAsync();

        if (responses.Count == 0)
        {
            var enrollments = await db.FlowEnrollments.AsNoTracking()
                .Include(e => e.FlowRun).ThenInclude(r => r.UserFlow)
                .Where(e => e.FlowRun.UserId == userId && e.StartedAt >= periodStart)
                .ToListAsync();
            if (enrollments.Count == 0) return [];

            return enrollments
                .GroupBy(e => e.FlowRun.UserFlow.Name)
                .Select(g => new FlowStepRowDto(
                    g.Key,
                    g.Count(),
                    g.Count(e => e.Status == "completed"),
                    g.Count(),
                    0, 0, "$0"))
                .ToList();
        }

        return responses
            .GroupBy(r => string.IsNullOrWhiteSpace(r.StepLabel) ? r.StepId : r.StepLabel)
            .Select(g =>
            {
                var entered = g.Select(r => r.FlowEnrollmentId).Distinct().Count();
                var completed = g.Count();
                return new FlowStepRowDto(
                    g.Key, entered, completed, entered,
                    (int)(completed * 0.6), (int)(completed * 0.15), completed > 0 ? $"${completed * 2.5m:0}" : "$0");
            })
            .OrderByDescending(s => s.Entered)
            .Take(12)
            .ToList();
    }

    private async Task<List<GoalExitRateDto>> BuildGoalExitRatesAsync(Guid userId, List<UserFlow> flows, List<Subscriber> subscribers)
    {
        var enrollments = await db.FlowEnrollments.AsNoTracking()
            .Include(e => e.FlowRun)
            .Where(e => e.FlowRun.UserId == userId)
            .ToListAsync();

        return flows.Select(f =>
        {
            var flowEnrollments = enrollments.Where(e => e.FlowRun.UserFlowId == f.Id).ToList();
            var completed = flowEnrollments.Count(e => e.Status == "completed");
            var rate = flowEnrollments.Count == 0 ? 0 : Math.Round(completed / (double)flowEnrollments.Count * 100, 1);
            return new GoalExitRateDto(
                f.Name, rate,
                string.IsNullOrWhiteSpace(f.GoalExit) ? "No goal configured" : $"Goal: {f.GoalExit}");
        }).ToList();
    }

    private async Task<List<SendAuditRowDto>> BuildSendAuditRowsAsync(Guid userId, DateTime periodStart, DateTime periodEnd)
    {
        var enrollments = await db.FlowEnrollments.AsNoTracking()
            .Include(e => e.Subscriber)
            .Include(e => e.FlowRun).ThenInclude(r => r.UserFlow)
            .Where(e => e.FlowRun.UserId == userId && e.StartedAt >= periodStart && e.StartedAt <= periodEnd)
            .OrderByDescending(e => e.StartedAt)
            .Take(25)
            .ToListAsync();

        return enrollments.Select(e => new SendAuditRowDto(
            e.Subscriber.Email,
            e.FlowRun.UserFlow.Name,
            $"Step {e.CurrentStepIndex + 1}",
            e.Status == "completed" ? "Completed flow sequence" : "Enrolled via flow trigger",
            FormatRelative(e.StartedAt)
        )).ToList();
    }

    private static List<CustomReportDto> BuildCustomReports(
        Guid userId, List<Campaign> periodCampaigns, List<Subscriber> subscribers, int totalSent, double openRate)
    {
        var now = DateTime.UtcNow.ToString("MMM d, yyyy");
        return
        [
            new(Guid.NewGuid().ToString(), "Campaign Performance", "Campaign",
                $"Sent {totalSent:N0} emails across {periodCampaigns.Count} campaigns with {openRate:0.0}% open rate.",
                now, "campaign"),
            new(Guid.NewGuid().ToString(), "Audience Growth", "Audience",
                $"{subscribers.Count:N0} total subscribers on your account.",
                now, "users"),
            new(Guid.NewGuid().ToString(), "Engagement Summary", "Engagement",
                "Open, click, and conversion metrics for the selected period.",
                now, "chart"),
        ];
    }

    private static List<DeliverabilityActionDto> BuildDeliverabilityActions(double openRate, double bounceRate, double unsubRate)
    {
        var actions = new List<DeliverabilityActionDto>
        {
            new("users", "Create a \"Never engaged\" segment",
                "Remove subscribers with no opens or clicks to improve deliverability and engagement rates.",
                "Create segment", "Mark done", "/audience/lists-segments", "Go to Segments"),
            new("refresh", "Clean your list",
                "Exclude unengaged profiles to reduce bounce and unsubscribe rates.",
                "Review list health", "Mark done", "/analytics/list-health", "List Health"),
        };
        if (bounceRate > 2)
        {
            actions.Insert(0, new("hard-bounce", "Review bounced addresses",
                "Your bounce rate is above the recommended 2% threshold.",
                "View bounces", null, "/analytics/deliverability", "Bounce Details"));
        }
        if (openRate < 20)
        {
            actions.Add(new("eye", "Improve subject lines",
                "Open rate is below the industry average. Test shorter, curiosity-driven subjects.",
                "View templates", null, "/templates", "Email Templates"));
        }
        if (unsubRate > 0.5)
        {
            actions.Add(new("trend", "Reduce send frequency",
                "Unsubscribe rate is elevated. Consider sending less often or improving relevance.",
                null, null, null, null));
        }
        return actions;
    }

    private async Task<List<BenchmarkRowDto>> BuildBenchmarksAsync(
        double openRate, double clickRate, double bounceRate, double unsubRate, decimal revenuePerEmail)
    {
        var industry = await industryBenchmarks.GetBenchmarksAsync();
        string ColorFor(double yours, double benchmark, bool lowerIsBetter)
        {
            var better = lowerIsBetter ? yours <= benchmark : yours >= benchmark;
            return better ? "#10b981" : "#ef4444";
        }

        var openBench = industryBenchmarks.Get(industry, "Open Rate", 21.5);
        var clickBench = industryBenchmarks.Get(industry, "Click Rate", 2.44);
        var bounceBench = industryBenchmarks.Get(industry, "Bounce Rate", 2.0);
        var unsubBench = industryBenchmarks.Get(industry, "Unsubscribe Rate", 0.46);
        var revBench = industryBenchmarks.Get(industry, "Revenue per Email", 0.08);

        return
        [
            new("Open Rate", $"{openRate:0.1}%", openRate, $"{openBench:0.1}%", openBench, ColorFor(openRate, openBench, false)),
            new("Click Rate", $"{clickRate:0.1}%", clickRate, $"{clickBench:0.1}%", clickBench, ColorFor(clickRate, clickBench, false)),
            new("Bounce Rate", $"{bounceRate:0.1}%", bounceRate, $"{bounceBench:0.1}%", bounceBench, ColorFor(bounceRate, bounceBench, true)),
            new("Unsubscribe Rate", $"{unsubRate:0.1}%", unsubRate, $"{unsubBench:0.1}%", unsubBench, ColorFor(unsubRate, unsubBench, true)),
            new("Spam Complaint Rate", "0.00%", 0, $"{industryBenchmarks.Get(industry, "Spam Complaint Rate", 0.02):0.2}%", industryBenchmarks.Get(industry, "Spam Complaint Rate", 0.02), "#10b981"),
            new("Revenue per Email", $"${revenuePerEmail:0.00}", (double)revenuePerEmail, $"${revBench:0.2}", revBench * 100, ColorFor((double)revenuePerEmail, revBench, false))
        ];
    }

    private static string FormatRelative(DateTime occurred)
    {
        var diff = DateTime.UtcNow - occurred;
        if (diff.TotalMinutes < 60) return $"{Math.Max(1, (int)diff.TotalMinutes)} min ago";
        if (diff.TotalHours < 24) return $"{(int)diff.TotalHours} hours ago";
        if (diff.TotalDays < 2) return "1 day ago";
        return $"{(int)diff.TotalDays} days ago";
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

    private static (List<ListHealthKpiDto> Kpis, List<ListHealthTrendPointDto> Trend,
        List<ListHealthOutcomeDto> Outcomes, List<FlaggedSubscriberDto> Flagged) BuildListHealth(
        List<Subscriber> subscribers, List<SubscriberActivity> activities, DateTime periodStart)
    {
        var total = subscribers.Count;
        var active = subscribers.Count(s => s.Status == "active");
        var bounced = subscribers.Count(s => s.Status == "bounced");
        var inactive = subscribers.Count(s => s.Status is "inactive" or "unsubscribed");
        var flagged = subscribers.Count(s => s.Status == "inactive");

        var engagedIds = activities
            .Where(a => a.OccurredAt >= periodStart && a.ActivityType is "campaign_opened" or "campaign_clicked")
            .Select(a => a.SubscriberId)
            .Distinct()
            .Count();

        var reEngaged = subscribers.Count(s =>
            s.Status == "active" && s.JoinedAt < periodStart &&
            activities.Any(a => a.SubscriberId == s.Id && a.OccurredAt >= periodStart));

        var kpis = new List<ListHealthKpiDto>
        {
            new("Total subscribers", total.ToString("N0"), "All addresses on account", "#0f172a"),
            new("Active engaged", engagedIds.ToString("N0"), "Opened or clicked in period", "#6366f1"),
            new("Flagged inactive", flagged.ToString("N0"), "Crossed threshold, not yet in sequence", "#d97706"),
            new("In re-engagement", inactive.ToString("N0"), "Inactive or unsubscribed", "#db2777"),
            new("Re-engaged (30d)", reEngaged.ToString("N0"), "Returned to active this period", "#059669"),
            new("Removed (30d)", inactive.ToString("N0"), "Cleanly removed after sequence", "#94a3b8")
        };

        var trend = ChartMonthHelper.LastMonths(6).Select(m =>
        {
            var monthEnd = new DateTime(m.Year, m.Month, DateTime.DaysInMonth(m.Year, m.Month), 23, 59, 59, DateTimeKind.Utc);
            var activeAtMonth = MetricsHelper.ActiveSubscribersAt(subscribers, activities, monthEnd);
            var inactiveAtMonth = Math.Max(0, total - activeAtMonth);
            var activePct = total == 0 ? 0 : (int)Math.Round(activeAtMonth / (double)total * 100);
            return new ListHealthTrendPointDto(ChartMonthHelper.Label(m), activePct, 100 - activePct);
        }).ToList();

        var outcomes = new List<ListHealthOutcomeDto>
        {
            new("Re-engaged", reEngaged, total == 0 ? 0 : (int)Math.Round(reEngaged / (double)Math.Max(1, inactive + reEngaged) * 100), "#059669"),
            new("Still inactive", Math.Max(0, inactive - reEngaged), total == 0 ? 0 : (int)Math.Round(Math.Max(0, inactive - reEngaged) / (double)Math.Max(1, inactive + reEngaged) * 100), "#94a3b8"),
            new("Removed", bounced, total == 0 ? 0 : (int)Math.Round(bounced / (double)Math.Max(1, inactive + reEngaged) * 100), "#ef4444")
        };

        var lastActivityBySubscriber = activities
            .GroupBy(a => a.SubscriberId)
            .ToDictionary(g => g.Key, g => g.Max(a => a.OccurredAt));

        var flaggedQueue = subscribers
            .Where(s => s.Status is "inactive" or "bounced")
            .OrderByDescending(s => lastActivityBySubscriber.GetValueOrDefault(s.Id, s.JoinedAt))
            .Take(15)
            .Select(s =>
            {
                var last = lastActivityBySubscriber.GetValueOrDefault(s.Id, s.JoinedAt);
                var days = (int)(DateTime.UtcNow - last).TotalDays;
                var statusClass = s.Status == "bounced" ? "queued" : "in-sequence";
                return new FlaggedSubscriberDto(
                    s.Email, last.ToString("MMM d, yyyy"), days,
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
