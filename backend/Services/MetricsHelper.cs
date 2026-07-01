using System.Globalization;
using System.Text.RegularExpressions;
using ScribeCount.Email.Api.Entities;

namespace ScribeCount.Email.Api.Services;

public static class MetricsHelper
{
  private static readonly string[] PurchaseTypes =
  [
    "purchase", "order", "order_confirmed", "pre_order", "book_purchase", "sale", "completed_purchase"
  ];

  public static bool IsPurchaseActivity(SubscriberActivity activity)
  {
    if (PurchaseTypes.Contains(activity.ActivityType, StringComparer.OrdinalIgnoreCase))
      return true;

    return activity.Title.Contains("purchase", StringComparison.OrdinalIgnoreCase)
           || activity.Title.Contains("ordered", StringComparison.OrdinalIgnoreCase)
           || activity.Description.Contains("purchase", StringComparison.OrdinalIgnoreCase)
           || activity.Description.Contains("order #", StringComparison.OrdinalIgnoreCase);
  }

  public static decimal ParseSaleAmount(SubscriberActivity activity)
  {
    var text = $"{activity.Title} {activity.Description}";
    var match = Regex.Match(text, @"\$(\d{1,6}(?:,\d{3})*(?:\.\d{2})?)");
    if (!match.Success) return 0;

    var raw = match.Groups[1].Value.Replace(",", "");
    return decimal.TryParse(raw, NumberStyles.Number, CultureInfo.InvariantCulture, out var amount)
      ? amount
      : 0;
  }

  public static decimal SumSaleRevenue(IEnumerable<SubscriberActivity> activities, DateTime? from = null, DateTime? to = null)
  {
    return activities
      .Where(a => IsPurchaseActivity(a))
      .Where(a => (!from.HasValue || a.OccurredAt >= from.Value) && (!to.HasValue || a.OccurredAt <= to.Value))
      .Sum(ParseSaleAmount);
  }

  public static (int UniqueOpens, int UniqueClicks, int Delivered) CampaignEngagement(
    IEnumerable<SubscriberActivity> activities, Guid campaignId)
  {
    var campaignActs = activities.Where(a => a.CampaignId == campaignId).ToList();
    var delivered = campaignActs
      .Where(a => a.ActivityType == "campaign_sent")
      .Select(a => a.SubscriberId)
      .Distinct()
      .Count();
    var uniqueOpens = campaignActs
      .Where(a => a.ActivityType == "campaign_opened"
                  || a.ActivityType is "unsubscribed" or "unsubscribe")
      .Select(a => a.SubscriberId)
      .Distinct()
      .Count();
    var uniqueClicks = campaignActs
      .Where(a => a.ActivityType == "campaign_clicked")
      .Select(a => a.SubscriberId)
      .Distinct()
      .Count();
    return (uniqueOpens, uniqueClicks, delivered);
  }

  public static decimal OpenRate(int uniqueOpens, int delivered) =>
    delivered <= 0 ? 0 : Math.Round(uniqueOpens * 100m / delivered, 1);

  public static decimal ClickRate(int uniqueClicks, int delivered) =>
    delivered <= 0 ? 0 : Math.Round(uniqueClicks * 100m / delivered, 1);

  public static decimal ConversionRate(int uniqueOpens, int uniqueClicks) =>
    uniqueOpens <= 0 ? 0 : Math.Round(uniqueClicks * 100m / uniqueOpens, 1);

  public static int ActiveSubscribersAt(IReadOnlyList<Subscriber> subscribers, IReadOnlyList<SubscriberActivity> activities, DateTime pointInTime)
  {
    return subscribers.Count(s =>
    {
      if (s.JoinedAt > pointInTime) return false;
      if (string.Equals(s.Status, "active", StringComparison.OrdinalIgnoreCase)) return true;
      if (!string.Equals(s.Status, "unsubscribed", StringComparison.OrdinalIgnoreCase)) return false;

      var unsubAt = activities
        .Where(a => a.SubscriberId == s.Id && a.ActivityType is "unsubscribed" or "unsubscribe")
        .Select(a => a.OccurredAt)
        .DefaultIfEmpty(DateTime.MaxValue)
        .Min();
      return unsubAt > pointInTime;
    });
  }
}
