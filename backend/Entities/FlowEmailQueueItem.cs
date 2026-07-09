namespace ScribeCount.Email.Api.Entities;

/// <summary>Queued flow email sends scheduled for a specific date/time per subscriber.</summary>
public class FlowEmailQueueItem
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid FlowId { get; set; }
    public Guid FlowRunId { get; set; }
    public Guid FlowEnrollmentId { get; set; }
    public Guid SubscriberId { get; set; }
    public string StepId { get; set; } = "";
    public string Subject { get; set; } = "";
    public string HtmlBody { get; set; } = "";
    public DateTime ScheduledAtUtc { get; set; }
    public DateTime? SentAt { get; set; }
    public string Status { get; set; } = "pending";
    public string? ErrorMessage { get; set; }

    public User User { get; set; } = null!;
}
