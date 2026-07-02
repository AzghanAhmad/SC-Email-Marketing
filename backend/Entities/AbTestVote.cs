namespace ScribeCount.Email.Api.Entities;

public class AbTestVote
{
    public Guid Id { get; set; }
    public Guid AbTestId { get; set; }
    public string Variant { get; set; } = "";
    public string VoterKey { get; set; } = "";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public AbTest AbTest { get; set; } = null!;
}
