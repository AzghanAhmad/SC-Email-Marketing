namespace ScribeCount.Email.Api.Services;

public static class WebsiteTemplateBodies
{
    private static readonly Dictionary<string, string> ById = new(StringComparer.OrdinalIgnoreCase)
    {
        ["signup-reader-magnet-popup"] = SignupPopupPreview("#1e3a5f", "Get your free chapter", "Join my reader list for exclusive excerpts and launch news.", "Send me the freebie"),
        ["signup-newsletter-flyout"] = SignupFlyoutPreview("Never miss a new release", "Short updates when a book goes live — no spam."),
        ["signup-vip-embedded"] = SignupEmbeddedPreview("Become a VIP reader", "Early chapters, ARC spots, and giveaways reserved for subscribers."),
        ["signup-launch-full-page"] = SignupFullPagePreview("#4c1d95", "The wait is almost over", "Be first to know when the next book drops."),
        ["landing-reader-magnet"] = LandingPreview("linear-gradient(135deg,#1e3a5f,#2d5a87)", "Your free reader magnet", "Download the exclusive short story and join thousands of readers.", "Get my free book"),
        ["landing-book-launch"] = LandingPreview("linear-gradient(135deg,#991b1b,#dc2626)", "It's release day!", "Celebrate the launch with bonus content available this week only.", "Buy the book"),
        ["landing-arc-team"] = LandingPreview("linear-gradient(135deg,#4c1d95,#6d28d9)", "Join my ARC team", "Read early copies and help shape the final edit before publication.", "Apply for ARC access"),
        ["landing-preorder-bonus"] = LandingPreview("linear-gradient(135deg,#92400e,#d97706)", "Pre-order bonus inside", "Reserve your copy now and unlock an exclusive deleted scene.", "Claim pre-order bonus"),
    };

    public static string Get(string templateId) =>
        ById.TryGetValue(templateId, out var html) ? html : SignupPopupPreview("#1e3a5f", "Join my list", "Get updates from the author.", "Subscribe");

    private static string SignupPopupPreview(string accent, string headline, string desc, string btn) => $"""
        <div style="font-family:Arial,sans-serif;background:#f1f5f9;padding:20px;min-height:180px;position:relative;">
          <div style="position:absolute;inset:0;background:rgba(15,23,42,0.35);border-radius:8px;"></div>
          <div style="position:relative;z-index:1;background:#fff;border-radius:12px;padding:18px;max-width:220px;margin:12px auto;box-shadow:0 12px 30px rgba(0,0,0,0.15);">
            <div style="width:32px;height:4px;background:{accent};border-radius:4px;margin-bottom:10px;"></div>
            <div style="font-size:13px;font-weight:700;color:#0f172a;margin-bottom:6px;">{headline}</div>
            <div style="font-size:10px;color:#64748b;line-height:1.4;margin-bottom:10px;">{desc}</div>
            <div style="height:22px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;margin-bottom:8px;"></div>
            <div style="height:22px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;margin-bottom:10px;"></div>
            <div style="background:{accent};color:#fff;text-align:center;padding:8px;border-radius:8px;font-size:10px;font-weight:700;">{btn}</div>
          </div>
        </div>
        """;

    private static string SignupFlyoutPreview(string headline, string desc) => $"""
        <div style="font-family:Arial,sans-serif;background:#fff;padding:16px;min-height:180px;display:flex;align-items:flex-end;">
          <div style="width:100%;background:linear-gradient(135deg,#1e3a5f,#2d5a87);color:#fff;border-radius:10px;padding:14px;">
            <div style="font-size:12px;font-weight:700;margin-bottom:4px;">{headline}</div>
            <div style="font-size:9px;opacity:0.9;margin-bottom:10px;">{desc}</div>
            <div style="display:flex;gap:6px;">
              <div style="flex:1;height:20px;background:rgba(255,255,255,0.9);border-radius:6px;"></div>
              <div style="background:#fff;color:#1e3a5f;padding:4px 10px;border-radius:6px;font-size:9px;font-weight:700;">Join</div>
            </div>
          </div>
        </div>
        """;

    private static string SignupEmbeddedPreview(string headline, string desc) => $"""
        <div style="font-family:Arial,sans-serif;background:#fff;padding:16px;min-height:180px;">
          <div style="height:8px;width:60%;background:#e2e8f0;border-radius:4px;margin-bottom:12px;"></div>
          <div style="background:#f8fafc;border:1px dashed #cbd5e1;border-radius:10px;padding:14px;">
            <div style="font-size:12px;font-weight:700;color:#0f172a;margin-bottom:4px;">{headline}</div>
            <div style="font-size:9px;color:#64748b;margin-bottom:10px;">{desc}</div>
            <div style="height:20px;background:#fff;border:1px solid #e2e8f0;border-radius:6px;margin-bottom:8px;"></div>
            <div style="height:24px;background:#3b82f6;border-radius:6px;"></div>
          </div>
        </div>
        """;

    private static string SignupFullPagePreview(string accent, string headline, string desc) => $"""
        <div style="font-family:Arial,sans-serif;background:{accent};padding:24px;min-height:180px;color:#fff;text-align:center;display:flex;align-items:center;justify-content:center;">
          <div style="max-width:200px;">
            <div style="font-size:14px;font-weight:800;margin-bottom:6px;">{headline}</div>
            <div style="font-size:9px;opacity:0.9;margin-bottom:12px;line-height:1.4;">{desc}</div>
            <div style="height:20px;background:rgba(255,255,255,0.2);border-radius:6px;margin-bottom:8px;"></div>
            <div style="height:24px;background:#fff;border-radius:6px;"></div>
          </div>
        </div>
        """;

    private static string LandingPreview(string gradient, string headline, string desc, string btn) => $"""
        <div style="font-family:Arial,sans-serif;background:{gradient};padding:24px;min-height:180px;color:#fff;text-align:center;display:flex;align-items:center;justify-content:center;">
          <div style="max-width:210px;">
            <div style="width:28px;height:28px;border:2px solid rgba(255,255,255,0.5);border-radius:8px;margin:0 auto 10px;"></div>
            <div style="font-size:14px;font-weight:800;margin-bottom:6px;line-height:1.2;">{headline}</div>
            <div style="font-size:9px;opacity:0.88;margin-bottom:12px;line-height:1.4;">{desc}</div>
            <div style="background:rgba(255,255,255,0.15);border-radius:10px;padding:10px;text-align:left;">
              <div style="height:18px;background:rgba(255,255,255,0.9);border-radius:6px;margin-bottom:6px;"></div>
              <div style="height:18px;background:rgba(255,255,255,0.9);border-radius:6px;margin-bottom:8px;"></div>
              <div style="background:#fff;color:#0f172a;text-align:center;padding:7px;border-radius:6px;font-size:9px;font-weight:700;">{btn}</div>
            </div>
          </div>
        </div>
        """;
}
