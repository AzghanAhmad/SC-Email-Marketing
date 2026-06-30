namespace ScribeCount.Email.Api.Services;

public static class EmailTemplateBodies
{
    private const string WrapStart = """
        <div class="email-wrap" style="font-family:Georgia,'Times New Roman',serif;max-width:600px;margin:0 auto;background:#ffffff;color:#1e293b;line-height:1.6;">
        """;

    private const string WrapEnd = "</div>";

    private static readonly Dictionary<string, string> ByName = new(StringComparer.OrdinalIgnoreCase)
    {
        ["Newsletter Classic"] = NewsletterClassic(),
        ["Book Launch"] = BookLaunch(),
        ["Welcome Email"] = WelcomeEmail(),
        ["Story Excerpt"] = StoryExcerpt(),
        ["Event Invite"] = EventInvite(),
        ["Re-engagement"] = ReEngagement(),
        ["ARC Invitation"] = ArcInvitation(),
        ["New Release Notification"] = NewReleaseNotification(),
        ["Order Confirmation"] = OrderConfirmation(),
        ["Review Request"] = ReviewRequest(),
    };

    public static string Get(string templateName) =>
        ByName.TryGetValue(templateName, out var html) ? html : NewsletterClassic();

    private static string Btn(string label, string color = "#3b82f6") =>
        $"""<p style="text-align:center;margin:28px 0;"><a href="#" style="display:inline-block;background:{color};color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;font-family:Arial,sans-serif;font-size:15px;">{label}</a></p>""";

    private static string Header(string title, string accent = "#1e3a5f") =>
        $"""<div style="background:{accent};color:#ffffff;padding:28px 24px;text-align:center;"><h1 style="margin:0;font-size:26px;font-weight:700;font-family:Arial,sans-serif;">{title}</h1></div>""";

    private static string Footer() =>
        """<div style="background:#f8fafc;padding:20px 24px;text-align:center;font-size:12px;color:#94a3b8;font-family:Arial,sans-serif;border-top:1px solid #e2e8f0;"><p style="margin:0 0 6px;">You're receiving this because you subscribed to my author newsletter.</p><p style="margin:0;"><a href="{{unsubscribe_url}}" style="color:#64748b;">Unsubscribe</a> · <a href="{{view_in_browser_url}}" style="color:#64748b;">View in browser</a></p></div>""";

    private static string NewsletterClassic() => WrapStart + Header("From the Author's Desk") + """
        <div style="padding:28px 24px;">
          <p style="margin:0 0 16px;font-size:16px;">Hi {{first_name}},</p>
          <p style="margin:0 0 16px;">This month I've been deep in edits on the next book — but I wanted to pause and share a few things with you first.</p>
          <div style="background:#f1f5f9;border-left:4px solid #3b82f6;padding:16px 20px;margin:20px 0;border-radius:0 8px 8px 0;">
            <p style="margin:0 0 8px;font-weight:700;color:#0f172a;">What I'm reading</p>
            <p style="margin:0;font-size:14px;color:#475569;">A gripping thriller that kept me up until 2am — highly recommend if you love twisty plots.</p>
          </div>
          <p style="margin:0 0 16px;">There's also a sneak peek of the next chapter waiting for you below. As always, thank you for being here.</p>
        </div>
        """ + Btn("Read the latest update") + Footer() + WrapEnd;

    private static string BookLaunch() => WrapStart + Header("It's Here — Release Day!", "#3b82f6") + """
        <div style="padding:28px 24px;text-align:center;">
          <div style="width:140px;height:200px;background:linear-gradient(135deg,#dbeafe,#bfdbfe);margin:0 auto 20px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:13px;color:#3b82f6;font-family:Arial,sans-serif;">Book Cover</div>
          <h2 style="margin:0 0 8px;font-size:22px;color:#0f172a;">{{book_title}}</h2>
          <p style="margin:0 0 16px;font-size:14px;color:#64748b;font-style:italic;">A story of secrets, storms, and second chances.</p>
          <p style="margin:0 0 16px;text-align:left;">Today is the day. <strong>{{book_title}}</strong> is officially out in the world — and I couldn't have done it without readers like you.</p>
          <p style="margin:0;text-align:left;">Early readers are calling it "impossible to put down." Grab your copy now before the launch-week bonus expires.</p>
        </div>
        """ + Btn("Get Your Copy Now", "#2563eb") + Footer() + WrapEnd;

    private static string WelcomeEmail() => WrapStart + Header("Welcome to the Inner Circle", "#059669") + """
        <div style="padding:28px 24px;">
          <p style="margin:0 0 16px;font-size:16px;">Hi {{first_name}},</p>
          <p style="margin:0 0 16px;">I'm so glad you're here. This isn't just a mailing list — it's where I share the stories behind the stories, early chapters, and things I don't post anywhere else.</p>
          <p style="margin:0 0 16px;">Here's what you can expect:</p>
          <ul style="margin:0 0 20px;padding-left:20px;color:#475569;">
            <li style="margin-bottom:8px;">Exclusive excerpts before anyone else</li>
            <li style="margin-bottom:8px;">Behind-the-scenes notes from my writing desk</li>
            <li style="margin-bottom:8px;">First access to ARC spots and giveaways</li>
          </ul>
          <p style="margin:0;">To get started, tell me what you love to read — it helps me send you the right recommendations.</p>
        </div>
        """ + Btn("Take the 30-second survey", "#059669") + Footer() + WrapEnd;

    private static string StoryExcerpt() => WrapStart + Header("A Preview Just for You", "#6366f1") + """
        <div style="padding:28px 24px;">
          <p style="margin:0 0 16px;">Hi {{first_name}},</p>
          <p style="margin:0 0 20px;">I don't share this chapter publicly — only with newsletter readers. I hope it pulls you in.</p>
          <div style="background:#fafafa;border:1px solid #e2e8f0;border-radius:12px;padding:24px;font-style:italic;color:#334155;">
            <p style="margin:0 0 12px;">The harbor lights flickered once, then died. Elena stood at the window, watching the storm roll in across black water...</p>
            <p style="margin:0 0 12px;">She had promised herself she would never come back. That promise lasted exactly eleven years, three months, and six days.</p>
            <p style="margin:0;color:#94a3b8;">— Chapter 1, <em>{{book_title}}</em></p>
          </div>
        </div>
        """ + Btn("Continue reading →", "#6366f1") + Footer() + WrapEnd;

    private static string EventInvite() => WrapStart + Header("You're Invited", "#10b981") + """
        <div style="padding:28px 24px;">
          <p style="margin:0 0 16px;">Hi {{first_name}},</p>
          <p style="margin:0 0 20px;">I'm hosting a live virtual Q&amp;A and I'd love to see you there. Bring your questions — about the books, the writing process, or anything else.</p>
          <div style="background:#ecfdf5;border:1.5px solid #a7f3d0;border-radius:12px;padding:20px;margin-bottom:16px;">
            <p style="margin:0 0 6px;font-weight:700;color:#065f46;">📅 Saturday, March 15 · 7:00 PM EST</p>
            <p style="margin:0 0 6px;color:#047857;">📍 Live on Zoom (link sent after RSVP)</p>
            <p style="margin:0;color:#047857;">⏱ About 60 minutes + live Q&amp;A</p>
          </div>
          <p style="margin:0;font-size:14px;color:#64748b;">Spots are limited to keep it intimate. RSVP to reserve yours.</p>
        </div>
        """ + Btn("Reserve My Spot", "#10b981") + Footer() + WrapEnd;

    private static string ReEngagement() => WrapStart + Header("I've Missed You", "#d97706") + """
        <div style="padding:28px 24px;">
          <p style="margin:0 0 16px;">Hi {{first_name}},</p>
          <p style="margin:0 0 16px;">It's been a while since we connected, and I wanted to check in personally — not with a sales pitch, just a genuine note.</p>
          <p style="margin:0 0 16px;">A lot has changed since you last opened an email from me. I've published two new titles, and readers have been kind enough to leave some wonderful reviews.</p>
          <p style="margin:0 0 16px;">If you'd still like to hear from me, you don't need to do anything. If not, no hard feelings — you can unsubscribe below anytime.</p>
          <p style="margin:0;">Either way, thank you for ever signing up. It meant something.</p>
        </div>
        """ + Btn("Show me what I've missed", "#d97706") + Footer() + WrapEnd;

    private static string ArcInvitation() => WrapStart + Header("ARC Reader Invitation", "#8b5cf6") + """
        <div style="padding:28px 24px;">
          <p style="margin:0 0 16px;">Hi {{first_name}},</p>
          <p style="margin:0 0 16px;">You've been one of my most engaged readers — and I'm inviting a small group to read <strong>{{book_title}}</strong> before it goes on sale.</p>
          <p style="margin:0 0 16px;">As an ARC reader, you'll get:</p>
          <ul style="margin:0 0 20px;padding-left:20px;color:#475569;">
            <li style="margin-bottom:8px;">A free advance copy (ebook)</li>
            <li style="margin-bottom:8px;">4–6 weeks before public release</li>
            <li style="margin-bottom:8px;">A sincere ask for an honest review on launch day</li>
          </ul>
          <p style="margin:0;font-size:14px;color:#64748b;">Only 25 spots available. First come, first served.</p>
        </div>
        """ + Btn("Claim My ARC Spot", "#8b5cf6") + Footer() + WrapEnd;

    private static string NewReleaseNotification() => WrapStart + Header("New From Me", "#6366f1") + """
        <div style="padding:28px 24px;">
          <p style="margin:0 0 16px;">Hi {{first_name}},</p>
          <p style="margin:0 0 16px;">If you've read any of my earlier books, I think you'll especially love this one — it shares the same world you already know.</p>
          <div style="display:flex;gap:16px;align-items:flex-start;margin:20px 0;">
            <div style="width:80px;height:110px;background:linear-gradient(135deg,#e0e7ff,#c7d2fe);border-radius:6px;flex-shrink:0;"></div>
            <div>
              <h3 style="margin:0 0 6px;font-size:18px;color:#0f172a;">{{book_title}}</h3>
              <p style="margin:0 0 8px;font-size:13px;color:#64748b;">★★★★★ "Couldn't put it down" — Early reviewers</p>
              <p style="margin:0;font-size:14px;color:#475569;">Available now on all major retailers. Launch-week pricing ends Friday.</p>
            </div>
          </div>
        </div>
        """ + Btn("Get the book", "#6366f1") + Footer() + WrapEnd;

    private static string OrderConfirmation() => WrapStart + Header("Thank You for Your Order", "#0f172a") + """
        <div style="padding:28px 24px;">
          <p style="margin:0 0 16px;">Hi {{first_name}},</p>
          <p style="margin:0 0 20px;">Your order is confirmed. Here are the details:</p>
          <table style="width:100%;border-collapse:collapse;font-size:14px;font-family:Arial,sans-serif;">
            <tr style="background:#f8fafc;"><td style="padding:12px;border:1px solid #e2e8f0;font-weight:600;">Item</td><td style="padding:12px;border:1px solid #e2e8f0;font-weight:600;text-align:right;">Price</td></tr>
            <tr><td style="padding:12px;border:1px solid #e2e8f0;">{{book_title}} (ebook)</td><td style="padding:12px;border:1px solid #e2e8f0;text-align:right;">$4.99</td></tr>
            <tr style="background:#f8fafc;"><td style="padding:12px;border:1px solid #e2e8f0;font-weight:600;">Total</td><td style="padding:12px;border:1px solid #e2e8f0;text-align:right;font-weight:600;">$4.99</td></tr>
          </table>
          <p style="margin:20px 0 0;font-size:14px;color:#64748b;">Order #SC-10482 · March 1, 2026</p>
        </div>
        """ + Btn("Download your ebook", "#0f172a") + Footer() + WrapEnd;

    private static string ReviewRequest() => WrapStart + Header("Would You Leave a Review?", "#f59e0b") + """
        <div style="padding:28px 24px;">
          <p style="margin:0 0 16px;">Hi {{first_name}},</p>
          <p style="margin:0 0 16px;">You finished <strong>{{book_title}}</strong> — thank you for reading it. I hope it stayed with you.</p>
          <p style="margin:0 0 20px;">If you have two minutes, an honest review on your preferred platform helps other readers find the book. It genuinely makes a difference for indie authors.</p>
          <div style="display:flex;gap:12px;justify-content:center;margin:24px 0;">
            <a href="#" style="flex:1;text-align:center;padding:14px;background:#fff7ed;border:1.5px solid #fed7aa;border-radius:8px;text-decoration:none;color:#c2410c;font-weight:600;font-family:Arial,sans-serif;font-size:13px;">Amazon</a>
            <a href="#" style="flex:1;text-align:center;padding:14px;background:#fff7ed;border:1.5px solid #fed7aa;border-radius:8px;text-decoration:none;color:#c2410c;font-weight:600;font-family:Arial,sans-serif;font-size:13px;">Goodreads</a>
            <a href="#" style="flex:1;text-align:center;padding:14px;background:#fff7ed;border:1.5px solid #fed7aa;border-radius:8px;text-decoration:none;color:#c2410c;font-weight:600;font-family:Arial,sans-serif;font-size:13px;">Apple Books</a>
          </div>
          <p style="margin:0;font-size:13px;color:#94a3b8;text-align:center;">Even a single sentence helps. Thank you.</p>
        </div>
        """ + Footer() + WrapEnd;
}
