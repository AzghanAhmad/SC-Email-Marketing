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
    public DateTime? EndsAt { get; set; }
    public string Content { get; set; } = "";
    public string SendToSegment { get; set; } = "all";
    public bool AutoSendWinner { get; set; } = true;
    public Guid? CampaignIdA { get; set; }
    public Guid? CampaignIdB { get; set; }
    public string HeldSubscriberIdsJson { get; set; } = "[]";
    public Guid? WinnerCampaignId { get; set; }
    public DateTime? WinnerSentAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<AbTestVote> Votes { get; set; } = [];

    public User User { get; set; } = null!;
}
