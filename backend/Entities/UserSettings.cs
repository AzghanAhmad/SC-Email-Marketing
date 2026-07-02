namespace ScribeCount.Email.Api.Entities;

public class UserSettings
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public string Json { get; set; } = "{}";
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
