namespace ScribeCount.Email.Api.Entities;

public class AbTest
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Name { get; set; } = "";
    public string SubjectA { get; set; } = "";
    public string SubjectB { get; set; } = "";
    public int TestSize { get; set; } = 20;
    public string WinnerMetric { get; set; } = "opens";
    public int WaitHours { get; set; } = 8;
    public string Status { get; set; } = "draft";
    public decimal? OpenRateA { get; set; }
    public decimal? OpenRateB { get; set; }
    public string? Winner { get; set; }
    public int VotesA { get; set; }
    public int VotesB { get; set; }
    public DateTime? StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<AbTestVote> Votes { get; set; } = [];

    public User User { get; set; } = null!;
}
