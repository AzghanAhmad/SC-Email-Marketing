namespace ScribeCount.Email.Api.Entities;

public class CampaignMetric
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string MonthLabel { get; set; } = string.Empty;
    public int SortOrder { get; set; }
    public int SentCount { get; set; }
    public int OpenedCount { get; set; }
    public decimal Revenue { get; set; }
    public string Status { get; set; } = "sent";

    public User User { get; set; } = null!;
}
