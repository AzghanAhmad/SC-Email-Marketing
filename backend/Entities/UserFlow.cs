namespace ScribeCount.Email.Api.Entities;

public class UserFlow
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string? TemplateId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = "draft";
    public int Triggers { get; set; }
    public string Family { get; set; } = string.Empty;
    public string GoalExit { get; set; } = string.Empty;
    public string? Priority { get; set; }
    public bool RequiresWebhook { get; set; }
    public string StepsJson { get; set; } = "[]";
    public string? SubscriptionMetricsJson { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = null!;
}
