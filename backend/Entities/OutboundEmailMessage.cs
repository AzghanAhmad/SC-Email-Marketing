namespace ScribeCount.Email.Api.Entities;

/// <summary>Tracks platform outbound mail sent via Amazon SES for SNS correlation.</summary>
public class OutboundEmailMessage
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid? SubscriberId { get; set; }
    public Guid? CampaignId { get; set; }
    public Guid? FlowId { get; set; }
    public string Source { get; set; } = "platform";
    public string ToEmail { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string SesMessageId { get; set; } = string.Empty;
    public string Status { get; set; } = "sent";
    public DateTime SentAt { get; set; }
    public DateTime? DeliveredAt { get; set; }
    public DateTime? BouncedAt { get; set; }
    public DateTime? ComplainedAt { get; set; }

    public User User { get; set; } = null!;
}
