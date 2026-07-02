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
    DateTime? SentAt,
    Dictionary<string, string>? Extras,
    int UniqueOpens = 0,
    int UniqueClicks = 0,
    decimal ConversionRate = 0
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
    string Status,
    DateTime? NextSendAt = null,
    DateTime? LastSentAt = null
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
    string? Winner,
    int VotesA,
    int VotesB,
    DateTime? StartedAt,
    DateTime? CompletedAt,
    string? PublicUrl = null
);

public record PublicAbTestDto(
    string Id,
    string Name,
    string SubjectA,
    string SubjectB,
    string Status,
    int VotesA,
    int VotesB,
    string? Winner,
    bool VotingOpen
);

public record VoteAbTestRequest(string Variant, string? VoterToken);

public record VoteAbTestResponse(
    string Message,
    int VotesA,
    int VotesB,
    string? Winner,
    string Status
);

public record ReleasePlanDto(string BookTitle, string? ReleaseDate);

public record SaveReleasePlanRequest(string? BookTitle, string? ReleaseDate);

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
    List<AbTestDto> AbTests,
    ReleasePlanDto? ReleasePlan = null
);

public record AudienceSegmentDto(
    string Id,
    string Name,
    int Count,
    string Description
);

public record ReachEstimateDto(
    int SegmentCount,
    int ExcludedCount,
    int EstimatedSendCount
);

public record ReachEstimateRequest(
    string? Segment,
    List<string>? EnabledSuppressionRules,
    List<string>? ListIds = null,
    List<string>? SegmentIds = null,
    List<string>? ContactIds = null,
    bool ExcludeUnengaged = false,
    string? ArcTag = null);

public record TestSendRequest(
    string? CampaignId,
    string? Subject,
    string? PreviewText,
    string? Content,
    string? FromName
);

public record TestSendResponse(string Message, string SentTo);

public record UpdateCalendarEventRequest(
    string? Name,
    string? Type,
    string? Date,
    string? Status
);

public record UnsubscribePreviewDto(
    string Email,
    string CampaignName,
    string FromName,
    bool AlreadyUnsubscribed
);

public record UnsubscribeConfirmRequest(string Token);

public record UnsubscribeResultDto(
    string Message,
    string Email,
    bool AlreadyUnsubscribed
);

public record CampaignViewDto(
    string Subject,
    string FromName,
    string CampaignName,
    string HtmlBody,
    string PreviewText
);
