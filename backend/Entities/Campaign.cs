namespace ScribeCount.Email.Api.Entities;

public class Campaign
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Name { get; set; } = "";
    public string Subject { get; set; } = "";
    public string PreviewText { get; set; } = "";
    public string Content { get; set; } = "";
    public string CampaignType { get; set; } = "";
    public string Status { get; set; } = "draft";
    public string FromName { get; set; } = "";
    public string SendToSegment { get; set; } = "all";
    public decimal OpenRate { get; set; }
    public decimal ClickRate { get; set; }
    public int SentCount { get; set; }
    public DateTime? ScheduledAt { get; set; }
    public DateTime? SentAt { get; set; }
    public string ExtrasJson { get; set; } = "{}";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = null!;
}
