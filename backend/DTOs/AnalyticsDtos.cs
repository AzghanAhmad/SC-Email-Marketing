namespace ScribeCount.Email.Api.DTOs;

public record AnalyticsKpiDto(string Label, string Value, double Change, string IconKey);

public record VolumeDataPointDto(string Label, int Sent, int Delivered);

public record EngagementTrendPointDto(string Label, double Open, double Click);

public record EngagementBreakdownDto(string Label, double Value, string Color);

public record CampaignFunnelRowDto(
    string Name, int Sent, int Delivered, int Opens, int Clicks, int Purchases, string Revenue);

public record MetricCardDto(string Label, string Value, double Change, string Color, string Sparkline);

public record MetricDetailRowDto(
    string Name, string Current, string Previous, double ChangeNum, string Status);

public record FlowStepRowDto(
    string Step, int Entered, int Completed, int Delivered, int Opens, int Clicks, string Revenue);

public record GoalExitRateDto(string Name, double Rate, string Note);

public record SendAuditRowDto(string Subscriber, string Flow, string Step, string Reason, string Time);

public record DeliverabilityMetricDto(string Name, string Rate, string Recommended, string StatusClass);

public record DeliveryReportRowDto(string Name, int Sent, int Delivered, int Bounced, double Rate);

public record BounceStatDto(string Label, string Value, string Pct, string IconKey);

public record BouncedEmailRowDto(string Email, string Type, string Reason, string Date);

public record ScoreHistoryPointDto(string Label, int Score);

public record BenchmarkRowDto(
    string Metric, string Yours, double YoursNum, string Industry, double IndustryNum, string YourColor);

public record ListHealthKpiDto(string Label, string Value, string Desc, string Color);

public record ListHealthTrendPointDto(string Month, int Active, int Inactive);

public record ListHealthOutcomeDto(string Name, int Count, int Pct, string Color);

public record FlaggedSubscriberDto(
    string Email, string LastEngaged, int DaysInactive, string Status, string StatusClass, string Threshold);

public record CustomReportDto(string Id, string Name, string Type, string Description, string LastUpdated, string IconKey);

public record DeliverabilityActionDto(
    string IconKey, string Title, string Description, string? PrimaryBtn, string? SecondaryBtn,
    string? LinkRoute, string? LinkLabel);

public record MarketingAnalyticsDto(
    PerformanceSummaryDto Performance,
    List<AttributionItemDto> Attribution,
    List<MarketingSourceDto> RevenueBySource,
    List<MarketingCampaignImpactDto> CampaignImpact,
    List<VolumeDataPointDto> VolumeData,
    List<EngagementTrendPointDto> EngagementTrend,
    string PeriodStart,
    string PeriodEnd);

public record MarketingSourceDto(string Name, string Value, double Pct, string Color);

public record MarketingCampaignImpactDto(
    string Name, string Revenue, int Sent, double OpenRate, double Pct);

public record CreateCustomReportRequest(string Name, string Type, string? Description);

public record AnalyticsBundleDto(
    List<AnalyticsKpiDto> Kpis,
    List<VolumeDataPointDto> VolumeData,
    List<EngagementTrendPointDto> EngagementTrend,
    List<EngagementBreakdownDto> EngagementBreakdown,
    List<SubscriberGrowthPointDto> SubscriberGrowth,
    List<CampaignFunnelRowDto> CampaignFunnel,
    List<MetricCardDto> Metrics,
    List<MetricDetailRowDto> MetricDetails,
    List<FlowStepRowDto> FlowSteps,
    List<GoalExitRateDto> GoalExitRates,
    List<SendAuditRowDto> SendAuditRows,
    int DeliverabilityScore,
    double ScoreChange,
    List<ScoreHistoryPointDto> ScoreHistory,
    List<DeliverabilityMetricDto> DeliverabilityMetrics,
    List<DeliveryReportRowDto> DeliveryReports,
    List<BounceStatDto> BounceStats,
    List<BouncedEmailRowDto> BouncedEmails,
    List<BenchmarkRowDto> Benchmarks,
    List<ListHealthKpiDto> ListHealthKpis,
    List<ListHealthTrendPointDto> ListHealthTrend,
    List<ListHealthOutcomeDto> ListHealthOutcomes,
    List<FlaggedSubscriberDto> FlaggedQueue,
    List<CustomReportDto> CustomReports,
    List<DeliverabilityActionDto> DeliverabilityActions
);
