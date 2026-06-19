namespace ScribeCount.Email.Api.DTOs;

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
    string? TriggerEvent = null
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
    object? SubscriptionMetrics = null
);

public record InstallFlowRequest(string TemplateId);
public record UpdateFlowRequest(
    string? Name,
    string? Description,
    string? Status,
    List<FlowStepDto>? Steps
);
