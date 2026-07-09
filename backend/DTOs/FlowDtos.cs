namespace ScribeCount.Email.Api.DTOs;

public record FlowFormFieldDto(
    string Id,
    string Label,
    string Type,
    bool Required = false,
    List<string>? Options = null
);

public record FlowStepDto(
    string Id,
    string Type,
    string Label,
    string Detail,
    string? Subject = null,
    string? PreviewText = null,
    string? EmailBody = null,
    int? WaitDuration = null,
    string? WaitUnit = null,
    string? ConditionType = null,
    string? TriggerEvent = null,
    string? ScheduledAt = null,
    List<FlowFormFieldDto>? FormFields = null
);

public record FlowTemplateDto(
    string Id,
    string Name,
    string Family,
    string Description,
    string GoalExit,
    int EstimatedSetupMinutes,
    string? Priority,
    bool? RequiresWebhook,
    List<FlowStepDto> Steps
);

public record FlowDto(
    string Id,
    string Name,
    string Description,
    string Status,
    int Triggers,
    string Family,
    string GoalExit,
    string? Priority,
    bool? RequiresWebhook,
    List<FlowStepDto> Steps,
    object? SubscriptionMetrics = null,
    string? TemplateId = null
);

public record FlowTriggerResultDto(
    string RunId,
    int EnrolledCount,
    string Message
);

public record FlowEmailMetricDto(
    string StepId,
    string StepLabel,
    string? ScheduledAt,
    int Sent,
    int Delivered,
    double DeliveryRate,
    double OpenRate
);

public record FlowEmailMetricsDto(
    int TotalTriggers,
    int TotalSent,
    int TotalDelivered,
    List<FlowEmailMetricDto> Emails,
    List<FlowEmailSignalDto> Signals
);

public record FlowEmailSignalDto(
    string Type,
    string Signal
);

public record FlowResultsDto(
    string FlowId,
    int TotalRuns,
    int TotalEnrollments,
    int CompletedEnrollments,
    int InProgressEnrollments,
    List<FlowRunSummaryDto> Runs,
    List<FlowResponseRowDto> Responses
);

public record FlowRunSummaryDto(
    string Id,
    DateTime StartedAt,
    string Status,
    int Enrolled,
    int Completed
);

public record FlowResponseRowDto(
    string SubscriberName,
    string SubscriberEmail,
    string StepLabel,
    string StepType,
    string ResponseSummary,
    DateTime SubmittedAt
);

public record PublicFlowEnrollmentDto(
    string FlowName,
    string SubscriberName,
    FlowStepDto? CurrentStep,
    int StepIndex,
    int TotalSteps,
    bool Completed,
    string? Message
);

public record SubmitFlowStepRequest(Dictionary<string, string>? Responses);

public record InstallFlowRequest(string TemplateId);
public record UpdateFlowRequest(
    string? Name,
    string? Description,
    string? Status,
    List<FlowStepDto>? Steps
);
