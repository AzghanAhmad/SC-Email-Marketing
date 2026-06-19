namespace ScribeCount.Email.Api.DTOs;

public record DashboardStatsDto(
    int TotalSubscribers,
    double SubscriberGrowth,
    int EmailsSent,
    double EmailsGrowth,
    double OpenRate,
    double OpenRateGrowth,
    decimal Revenue,
    double RevenueGrowth
);

public record PerformanceSummaryDto(
    decimal TotalRevenue,
    double TotalRevenueChange,
    decimal AttributedRevenue,
    double AttributedRevenueChange,
    string PeriodLabel
);

public record AttributionItemDto(string Label, string Value, string Pct, string Icon);

public record CampaignChartPointDto(string Label, int Sent, int Opened);

public record SubscriberGrowthPointDto(string Label, int Count);

public record DashboardActivityDto(string Id, string Type, string Message, string Time, string Icon);

public record DashboardDto(
    DashboardStatsDto Stats,
    PerformanceSummaryDto Performance,
    List<AttributionItemDto> Attribution,
    List<CampaignChartPointDto> CampaignChart,
    List<SubscriberGrowthPointDto> GrowthChart,
    List<DashboardActivityDto> RecentActivity,
    string PeriodStart,
    string PeriodEnd,
    string WelcomeName
);
