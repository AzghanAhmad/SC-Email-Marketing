namespace ScribeCount.Email.Api.Services;

public static class MailboxHosting
{
    public static bool IsSmtpRestrictedHosting() =>
        !string.IsNullOrWhiteSpace(Environment.GetEnvironmentVariable("RAILWAY_ENVIRONMENT"))
        || !string.IsNullOrWhiteSpace(Environment.GetEnvironmentVariable("RAILWAY_PROJECT_ID"))
        || !string.IsNullOrWhiteSpace(Environment.GetEnvironmentVariable("RENDER"))
        || !string.IsNullOrWhiteSpace(Environment.GetEnvironmentVariable("FLY_APP_NAME"))
        || string.Equals(Environment.GetEnvironmentVariable("MAILBOX_SKIP_SMTP_VERIFY"), "true", StringComparison.OrdinalIgnoreCase);

    public static string SmtpRestrictedHostingNote =>
        "This server blocks outbound SMTP (common on Railway and similar hosts). Inbox sync via IMAP works; sending from Compose may not work from this deployment.";

    public static string SmtpSendBlockedMessage =>
        "Sending failed because this deployment cannot reach SMTP servers (blocked by your hosting provider). Inbox sync still works. Run the API locally for send, use a VPS, or configure an HTTP-based email relay.";
}
