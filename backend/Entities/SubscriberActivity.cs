namespace ScribeCount.Email.Api.Entities;

public class SubscriberActivity
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid SubscriberId { get; set; }
    public string ActivityType { get; set; } = "";
    public string Title { get; set; } = "";
    public string Description { get; set; } = "";
    public Guid? CampaignId { get; set; }
    public string? CampaignSubject { get; set; }
    public string? CampaignFrom { get; set; }
    public string Status { get; set; } = "";
    public DateTime OccurredAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = null!;
    public Subscriber Subscriber { get; set; } = null!;
}
