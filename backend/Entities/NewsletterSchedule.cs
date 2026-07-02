namespace ScribeCount.Email.Api.Entities;

public class NewsletterSchedule
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Name { get; set; } = "Monthly Reader Letter";
    public string Frequency { get; set; } = "monthly";
    public string DayOfWeek { get; set; } = "Tuesday";
    public string DayOfMonth { get; set; } = "1st";
    public string SendTime { get; set; } = "09:00";
    public bool TimezoneOptimized { get; set; } = true;
    public string Subject { get; set; } = "";
    public string PreviewText { get; set; } = "";
    public string ReplyQuestion { get; set; } = "";
    public string Content { get; set; } = "";
    public string Status { get; set; } = "draft";
    public DateTime? NextSendAt { get; set; }
    public DateTime? LastSentAt { get; set; }
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = null!;
}
