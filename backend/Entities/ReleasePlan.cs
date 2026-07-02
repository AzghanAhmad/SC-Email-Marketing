namespace ScribeCount.Email.Api.Entities;

public class ReleasePlan
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string BookTitle { get; set; } = "";
    public DateTime? ReleaseDate { get; set; }
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = null!;
}
