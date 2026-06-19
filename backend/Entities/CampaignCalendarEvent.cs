namespace ScribeCount.Email.Api.Entities;

public class CampaignCalendarEvent
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Name { get; set; } = "";
    public string Type { get; set; } = "";
    public string Status { get; set; } = "planned";
    public DateTime EventDate { get; set; }
    public int? DaysFromRelease { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = null!;
}
