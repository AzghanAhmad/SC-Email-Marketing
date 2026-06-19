namespace ScribeCount.Email.Api.Entities;

public class DashboardActivity
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string ActivityType { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public DateTime OccurredAt { get; set; }

    public User User { get; set; } = null!;
}
