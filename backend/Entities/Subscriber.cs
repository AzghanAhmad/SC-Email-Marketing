namespace ScribeCount.Email.Api.Entities;

public class Subscriber
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Status { get; set; } = "active";
    public DateTime JoinedAt { get; set; }

    public User User { get; set; } = null!;
}
