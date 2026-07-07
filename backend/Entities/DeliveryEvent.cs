namespace ScribeCount.Email.Api.Entities;

/// <summary>Normalized SES/SNS delivery telemetry (bounce, complaint, delivery) plus raw payload for audit.</summary>
public class DeliveryEvent
{
    public Guid Id { get; set; }
    public Guid? UserId { get; set; }
    public Guid? SubscriberId { get; set; }
    public Guid? CampaignId { get; set; }
    public Guid? FlowId { get; set; }
    public Guid? OutboundMessageId { get; set; }
    public string EventType { get; set; } = string.Empty;
    public string BounceType { get; set; } = "";
    public string Email { get; set; } = string.Empty;
    public string SesMessageId { get; set; } = string.Empty;
    public string Source { get; set; } = "sns";
    public string DiagnosticCode { get; set; } = "";
    public string RawPayload { get; set; } = "";
    public DateTime OccurredAt { get; set; }
    public DateTime ReceivedAt { get; set; }
}
