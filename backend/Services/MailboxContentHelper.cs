using System.Text.RegularExpressions;

namespace ScribeCount.Email.Api.Services;

public static class MailboxContentHelper
{
    private static readonly Regex InlineDataImageSrc = new(
        @"src\s*=\s*""data:image/[^""]+""",
        RegexOptions.IgnoreCase | RegexOptions.Compiled);

    /// <summary>Approximate max combined body + attachment JSON size (chars) before rejecting.</summary>
    public const int MaxStoredPayloadChars = 48 * 1024 * 1024;

    public static string PrepareBodyForStorage(string body)
    {
        if (string.IsNullOrEmpty(body)) return body;
        body = SanitizeHtml(body);
        return InlineDataImageSrc.Replace(body, @"src=""#inline-image-removed""");
    }

    /// <summary>Remove common XSS vectors from user-authored HTML.</summary>
    public static string SanitizeHtml(string html)
    {
        if (string.IsNullOrEmpty(html)) return html;

        var withoutScripts = Regex.Replace(html, @"<script\b[\s\S]*?</script>", string.Empty, RegexOptions.IgnoreCase);
        withoutScripts = Regex.Replace(withoutScripts, @"</?(?:script|iframe|object|embed|form|meta|link|base|style)\b[^>]*>", string.Empty, RegexOptions.IgnoreCase);
        withoutScripts = Regex.Replace(withoutScripts, @"\s+on\w+\s*=\s*(""[^""]*""|'[^']*'|[^\s>]+)", string.Empty, RegexOptions.IgnoreCase);
        withoutScripts = Regex.Replace(withoutScripts, @"\b(href|src|xlink:href)\s*=\s*(""[^""]*""|'[^']*')\s*javascript:[^""']*\2", "$1=\"#\"", RegexOptions.IgnoreCase);
        return withoutScripts;
    }

    public static string PreparePreview(string body)
    {
        var text = Regex.Replace(body, "<[^>]+>", " ");
        text = System.Net.WebUtility.HtmlDecode(text);
        text = text.Trim();
        if (text.Length > 100) return text[..100];
        return text;
    }

    public static void EnsureFitsDatabase(string body, string attachmentsJson)
    {
        var total = (body?.Length ?? 0) + (attachmentsJson?.Length ?? 0);
        if (total > MaxStoredPayloadChars)
        {
            throw new InvalidOperationException(
                "This message is too large to save. Remove large attachments or pasted images and try again.");
        }
    }

    public static bool IsPacketTooLargeException(Exception ex)
    {
        for (var current = ex; current is not null; current = current.InnerException)
        {
            if (current.Message.Contains("max_allowed_packet", StringComparison.OrdinalIgnoreCase))
                return true;
        }
        return false;
    }

    public static string PacketTooLargeUserMessage =>
        "This message is too large to save. Try removing attachments, pasted images, or long email signatures, then schedule again.";
}
