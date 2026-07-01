using System.Text.Json;

namespace ScribeCount.Email.Api.Services;

public record WebsitePageContent(
    string Headline,
    string Description,
    string ButtonText,
    string ThankYouMessage);

public static class WebsiteContentHelper
{
    private static readonly JsonSerializerOptions Options = new() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

    public static WebsitePageContent DefaultForm(string name) => new(
        $"Join {name.Trim()}",
        "Get exclusive updates, free chapters, and early access.",
        "Subscribe",
        "Thanks — you're on the list!");

    public static WebsitePageContent DefaultLanding(string name) => new(
        name.Trim(),
        "Download your free reader magnet and stay in the loop on new releases.",
        "Get access",
        "You're in! Check your inbox for next steps.");

    public static WebsitePageContent Parse(string? json, WebsitePageContent fallback)
    {
        if (string.IsNullOrWhiteSpace(json)) return fallback;
        try
        {
            var parsed = JsonSerializer.Deserialize<WebsitePageContent>(json, Options);
            if (parsed is null) return fallback;
            return new WebsitePageContent(
                string.IsNullOrWhiteSpace(parsed.Headline) ? fallback.Headline : parsed.Headline.Trim(),
                string.IsNullOrWhiteSpace(parsed.Description) ? fallback.Description : parsed.Description.Trim(),
                string.IsNullOrWhiteSpace(parsed.ButtonText) ? fallback.ButtonText : parsed.ButtonText.Trim(),
                string.IsNullOrWhiteSpace(parsed.ThankYouMessage) ? fallback.ThankYouMessage : parsed.ThankYouMessage.Trim());
        }
        catch
        {
            return fallback;
        }
    }

    public static string Serialize(WebsitePageContent content) =>
        JsonSerializer.Serialize(content, Options);

    public static WebsitePageContent Merge(WebsitePageContent current, WebsitePageContent? updates)
    {
        if (updates is null) return current;
        return new WebsitePageContent(
            string.IsNullOrWhiteSpace(updates.Headline) ? current.Headline : updates.Headline.Trim(),
            string.IsNullOrWhiteSpace(updates.Description) ? current.Description : updates.Description.Trim(),
            string.IsNullOrWhiteSpace(updates.ButtonText) ? current.ButtonText : updates.ButtonText.Trim(),
            string.IsNullOrWhiteSpace(updates.ThankYouMessage) ? current.ThankYouMessage : updates.ThankYouMessage.Trim());
    }
}
