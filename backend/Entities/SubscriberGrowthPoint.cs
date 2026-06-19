namespace ScribeCount.Email.Api.Entities;

public class SubscriberGrowthPoint
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string MonthLabel { get; set; } = string.Empty;
    public int SortOrder { get; set; }
    public int SubscriberCount { get; set; }

    public User User { get; set; } = null!;
}
