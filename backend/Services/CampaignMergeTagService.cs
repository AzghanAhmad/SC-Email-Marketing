using System.Text.Json;
using System.Text.RegularExpressions;
using ScribeCount.Email.Api.Entities;

namespace ScribeCount.Email.Api.Services;

public static partial class CampaignMergeTagService
{
    private static readonly JsonSerializerOptions JsonOptions = new() { PropertyNameCaseInsensitive = true };

    [GeneratedRegex(@"\{\{\s*([\w_]+)\s*\}\}", RegexOptions.Compiled | RegexOptions.IgnoreCase)]
    private static partial Regex MergeTagPattern();

    public static string Apply(string? text, Campaign campaign, Subscriber subscriber)
    {
        if (string.IsNullOrEmpty(text)) return text ?? "";

        var tags = BuildTags(campaign, subscriber, ParseExtras(campaign.ExtrasJson));
        return MergeTagPattern().Replace(text, match =>
        {
            var key = match.Groups[1].Value;
            return tags.TryGetValue(key, out var value) ? value : "";
        });
    }

    private static Dictionary<string, string> BuildTags(
        Campaign campaign,
        Subscriber subscriber,
        IReadOnlyDictionary<string, string> extras)
    {
        var (firstName, lastName) = SplitName(subscriber.Name);
        if (string.IsNullOrWhiteSpace(firstName))
            firstName = subscriber.Email.Split('@')[0];

        var bookTitle = FirstNonEmpty(
            extras.GetValueOrDefault("book_title"),
            extras.GetValueOrDefault("flashSale_title"),
            extras.GetValueOrDefault("priceDrop_title"),
            extras.GetValueOrDefault("boxSet_title"),
            extras.GetValueOrDefault("backlist_title"),
            extras.GetValueOrDefault("event_name"));

        var storeLink = FirstNonEmpty(
            extras.GetValueOrDefault("directStoreLink"),
            extras.GetValueOrDefault("amazonLink"),
            extras.GetValueOrDefault("flashSale_directLink"),
            extras.GetValueOrDefault("flashSale_amazonLink"),
            extras.GetValueOrDefault("priceDrop_link"),
            extras.GetValueOrDefault("boxSet_link"));

        return new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            ["first_name"] = firstName,
            ["last_name"] = lastName,
            ["full_name"] = string.IsNullOrWhiteSpace(subscriber.Name) ? firstName : subscriber.Name.Trim(),
            ["email"] = subscriber.Email,
            ["book_title"] = bookTitle,
            ["author_name"] = campaign.FromName,
            ["month"] = DateTime.UtcNow.ToString("MMMM"),
            ["release_date"] = extras.GetValueOrDefault("release_date") ?? "",
            ["store_link"] = storeLink,
            ["order_id"] = extras.GetValueOrDefault("order_id") ?? "",
        };
    }

    private static (string First, string Last) SplitName(string? name)
    {
        if (string.IsNullOrWhiteSpace(name)) return ("", "");
        var parts = name.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);
        if (parts.Length == 0) return ("", "");
        if (parts.Length == 1) return (parts[0], "");
        return (parts[0], string.Join(' ', parts.Skip(1)));
    }

    private static string FirstNonEmpty(params string?[] values)
    {
        foreach (var value in values)
        {
            if (!string.IsNullOrWhiteSpace(value)) return value.Trim();
        }
        return "";
    }

    private static Dictionary<string, string> ParseExtras(string json)
    {
        if (string.IsNullOrWhiteSpace(json)) return new Dictionary<string, string>();
        try
        {
            return JsonSerializer.Deserialize<Dictionary<string, string>>(json, JsonOptions)
                ?? new Dictionary<string, string>();
        }
        catch
        {
            return new Dictionary<string, string>();
        }
    }
}
