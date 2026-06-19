namespace ScribeCount.Email.Api.DTOs;

public record CampaignDto(
    string Id,
    string Name,
    string Subject,
    string PreviewText,
    string Content,
    string CampaignType,
    string Status,
    string FromName,
    string SendToSegment,
    decimal OpenRate,
    decimal ClickRate,
    int Sent,
    string Date,
    DateTime? ScheduledAt,
    DateTime? SentAt
);

public record CreateCampaignRequest(
    string Name,
    string Subject,
    string? PreviewText,
    string? Content,
    string? CampaignType,
    string? FromName,
    string? SendToSegment,
    string? Status,
    DateTime? ScheduledAt,
    Dictionary<string, string>? Extras
);

public record UpdateCampaignRequest(
    string? Name,
    string? Subject,
    string? PreviewText,
    string? Content,
    string? CampaignType,
    string? FromName,
    string? SendToSegment,
    string? Status,
    DateTime? ScheduledAt,
    Dictionary<string, string>? Extras
);

public record SendCampaignRequest(bool ScheduleOnly = false);

public record CalendarEventDto(
    string Id,
    string Name,
    string Type,
    string Date,
    string Status,
    int? DaysFromRelease
);

public record CreateCalendarEventRequest(
    string Name,
    string Type,
    string? Date,
    string Status
);

public record NewsletterScheduleDto(
    string Name,
    string Frequency,
    string DayOfWeek,
    string DayOfMonth,
    string SendTime,
    bool TimezoneOptimized,
    string Subject,
    string PreviewText,
    string ReplyQuestion,
    string Content,
    string Status
);

public record AbTestDto(
    string Id,
    string Name,
    string SubjectA,
    string SubjectB,
    int TestSize,
    string WinnerMetric,
    int WaitHours,
    string Status,
    decimal? OpenRateA,
    decimal? OpenRateB,
    string? Winner
);

public record CreateAbTestRequest(
    string SubjectA,
    string SubjectB,
    int TestSize,
    string WinnerMetric,
    int WaitHours,
    string? Name
);

public record CampaignsBundleDto(
    List<CampaignDto> Campaigns,
    List<CalendarEventDto> CalendarEvents,
    NewsletterScheduleDto Newsletter,
    List<AbTestDto> AbTests
);
