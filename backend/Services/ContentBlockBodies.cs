namespace ScribeCount.Email.Api.Services;

public static class ContentBlockBodies
{
    private static readonly Dictionary<string, string> ByType = new(StringComparer.OrdinalIgnoreCase)
    {
        ["Book Card"] = BookCard(),
        ["Series Reading Order"] = SeriesReadingOrder(),
        ["Pull Quote"] = PullQuote(),
        ["CTA Button"] = CtaButton(),
        ["Author Bio"] = AuthorBio(),
        ["Social Follow Row"] = SocialFollowRow(),
    };

    public static string Get(string blockType, string? name = null)
    {
        if (ByType.TryGetValue(blockType, out var html)) return html;
        if (!string.IsNullOrWhiteSpace(name) && ByType.TryGetValue(name, out html)) return html;
        return CtaButton();
    }

    private static string BookCard() => """
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:24px auto;font-family:Georgia,serif;">
          <tr>
            <td style="width:120px;vertical-align:top;padding-right:16px;">
              <div style="width:110px;height:160px;background:linear-gradient(135deg,#dbeafe,#bfdbfe);border-radius:8px;display:flex;align-items:center;justify-content:center;color:#3b82f6;font-size:12px;font-family:Arial,sans-serif;">Book Cover</div>
            </td>
            <td style="vertical-align:top;">
              <h2 style="margin:0 0 8px;font-size:20px;color:#0f172a;">{{book_title}}</h2>
              <p style="margin:0 0 12px;font-size:14px;color:#64748b;font-style:italic;">A story readers can't put down.</p>
              <p style="margin:0 0 16px;font-size:14px;color:#475569;line-height:1.6;">Add a short hook about this title — why your subscribers will love it.</p>
              <a href="{{store_link}}" style="display:inline-block;background:#3b82f6;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;font-family:Arial,sans-serif;font-size:14px;">Get the book</a>
            </td>
          </tr>
        </table>
        """;

    private static string SeriesReadingOrder() => """
        <div style="max-width:560px;margin:24px auto;padding:20px;background:#f8fafc;border-radius:12px;font-family:Arial,sans-serif;">
          <h3 style="margin:0 0 16px;font-size:16px;color:#0f172a;">Read the series in order</h3>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="padding:8px 0;font-size:14px;color:#334155;"><strong>1.</strong> Book One — <em>The Beginning</em></td></tr>
            <tr><td style="padding:8px 0;font-size:14px;color:#334155;"><strong>2.</strong> Book Two — <em>The Journey</em></td></tr>
            <tr><td style="padding:8px 0;font-size:14px;color:#334155;"><strong>3.</strong> Book Three — <em>The Finale</em></td></tr>
          </table>
        </div>
        """;

    private static string PullQuote() => """
        <blockquote style="max-width:520px;margin:28px auto;padding:20px 24px;border-left:4px solid #6366f1;background:#f8fafc;border-radius:0 12px 12px 0;font-family:Georgia,serif;">
          <p style="margin:0 0 10px;font-size:17px;color:#334155;font-style:italic;line-height:1.6;">"This kept me up until 3am — I couldn't put it down."</p>
          <footer style="font-size:13px;color:#94a3b8;font-family:Arial,sans-serif;">— Early reader review</footer>
        </blockquote>
        """;

    private static string CtaButton() => """
        <p style="text-align:center;margin:28px 0;">
          <a href="{{store_link}}" style="display:inline-block;background:#3b82f6;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;font-family:Arial,sans-serif;font-size:15px;">Shop now</a>
        </p>
        """;

    private static string AuthorBio() => """
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:24px auto;font-family:Arial,sans-serif;">
          <tr>
            <td style="width:72px;vertical-align:top;padding-right:16px;">
              <div style="width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#3b82f6);"></div>
            </td>
            <td style="vertical-align:top;">
              <p style="margin:0 0 6px;font-size:15px;font-weight:700;color:#0f172a;">{{author_name}}</p>
              <p style="margin:0;font-size:14px;color:#475569;line-height:1.6;">Write a short author bio here — what you write, where readers can find you, and why you love connecting with your audience.</p>
            </td>
          </tr>
        </table>
        """;

    private static string SocialFollowRow() => """
        <p style="text-align:center;margin:24px 0;font-family:Arial,sans-serif;">
          <span style="font-size:13px;color:#64748b;display:block;margin-bottom:12px;">Follow me for updates</span>
          <a href="#" style="display:inline-block;margin:0 8px;color:#3b82f6;font-size:14px;font-weight:600;text-decoration:none;">Instagram</a>
          <a href="#" style="display:inline-block;margin:0 8px;color:#3b82f6;font-size:14px;font-weight:600;text-decoration:none;">Facebook</a>
          <a href="#" style="display:inline-block;margin:0 8px;color:#3b82f6;font-size:14px;font-weight:600;text-decoration:none;">Goodreads</a>
        </p>
        """;
}
