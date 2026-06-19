namespace ScribeCount.Email.Api.Entities;

public class FlowTemplate
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Family { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string GoalExit { get; set; } = string.Empty;
    public int EstimatedSetupMinutes { get; set; }
    public string? Priority { get; set; }
    public bool RequiresWebhook { get; set; }
    public string StepsJson { get; set; } = "[]";
}
