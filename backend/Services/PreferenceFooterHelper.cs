using System.Text.RegularExpressions;
using ScribeCount.Email.Api.DTOs;

namespace ScribeCount.Email.Api.Services;

public static class PreferenceFooterHelper
{
    public const string FooterMarker = "data-scribecount-footer";

    public static PreferenceFooterDto DefaultFooter(string? domain = null) => new(
        $"You're receiving this because you subscribed at {domain ?? "yourdomain.com"}.",
        "123 Author Lane, New York, NY 10001",
        "Manage preferences",
        "Unsubscribe",
        "View in browser");

    public static string BuildFooterHtml(PreferenceFooterDto footer, string? domain = null)
    {
        var line = footer.SubscriptionLine.Replace("{domain}", domain ?? "yourdomain.com", StringComparison.OrdinalIgnoreCase);
        var encLine = System.Net.WebUtility.HtmlEncode(line);
        var encManage = System.Net.WebUtility.HtmlEncode(footer.ManagePreferencesLabel);
        var encUnsub = System.Net.WebUtility.HtmlEncode(footer.UnsubscribeLabel);
        var encView = System.Net.WebUtility.HtmlEncode(footer.ViewInBrowserLabel);
        var encAddr = System.Net.WebUtility.HtmlEncode(footer.PhysicalAddress);
        return
            $"<div style=\"background:#f8fafc;padding:20px 24px;text-align:center;font-size:12px;color:#94a3b8;font-family:Arial,sans-serif;border-top:1px solid #e2e8f0;margin-top:24px;\" {FooterMarker}=\"true\">" +
            $"<p style=\"margin:0 0 8px;color:#64748b;\">{encLine}</p>" +
            "<p style=\"margin:0 0 8px;\">" +
            $"<a href=\"{{{{preference_url}}}}\" style=\"color:#3b82f6;text-decoration:underline;\">{encManage}</a>" +
            " · " +
            $"<a href=\"{{{{unsubscribe_url}}}}\" style=\"color:#3b82f6;text-decoration:underline;\">{encUnsub}</a>" +
            " · " +
            $"<a href=\"{{{{view_in_browser_url}}}}\" style=\"color:#3b82f6;text-decoration:underline;\">{encView}</a>" +
            "</p>" +
            $"<p style=\"margin:0;color:#94a3b8;\">{encAddr}</p>" +
            "</div>";
    }

    public static string StripExistingFooter(string html)
    {
        if (string.IsNullOrWhiteSpace(html)) return "";
        return Regex.Replace(
            html,
            """<div[^>]*data-scribecount-footer[^>]*>[\s\S]*?</div>""",
            "",
            RegexOptions.IgnoreCase).Trim();
    }

    public static string AppendFooter(string html, PreferenceFooterDto footer, string? domain = null)
    {
        var body = StripExistingFooter(html);
        var block = BuildFooterHtml(footer, domain);
        return string.IsNullOrWhiteSpace(body) ? block : $"{body}\n{block}";
    }

    public static bool HasFooter(string? html) =>
        !string.IsNullOrWhiteSpace(html)
        && html.Contains(FooterMarker, StringComparison.OrdinalIgnoreCase);
}
