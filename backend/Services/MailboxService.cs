using MailKit;
using MailKit.Net.Imap;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.EntityFrameworkCore;
using MimeKit;
using ScribeCount.Email.Api.Data;
using ScribeCount.Email.Api.DTOs;
using ScribeCount.Email.Api.Entities;

namespace ScribeCount.Email.Api.Services;

public class MailboxService(AppDbContext db, ILogger<MailboxService> logger)
{
    private const int MaxStoredBodyLength = 100_000;

    public static string ProtectPassword(string password) =>
        Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(password));

    public static string UnprotectPassword(string encrypted) =>
        System.Text.Encoding.UTF8.GetString(Convert.FromBase64String(encrypted));

    public async Task<(bool Success, string Message)> TestConnectionAsync(SaveMailboxConnectionRequest request)
    {
        var (username, password) = NormalizeCredentials(request);
        using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(25));
        var token = cts.Token;

        try
        {
            using var imap = new ImapClient();
            imap.Timeout = 25000;
            await imap.ConnectAsync(
                request.ImapHost, request.ImapPort,
                request.ImapUseSsl ? SecureSocketOptions.SslOnConnect : SecureSocketOptions.StartTlsWhenAvailable,
                token);
            await imap.AuthenticateAsync(username, password, token);
            await imap.DisconnectAsync(true, token);
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "IMAP connection test failed for {Email}", request.EmailAddress);
            return (false, $"IMAP failed: {MapConnectionError(ex, request.Provider)}");
        }

        try
        {
            using var smtp = new SmtpClient();
            smtp.Timeout = 25000;
            var smtpSecurity = ResolveSmtpSecurity(request);
            await smtp.ConnectAsync(request.SmtpHost, request.SmtpPort, smtpSecurity, token);
            await smtp.AuthenticateAsync(username, password, token);
            await smtp.DisconnectAsync(true, token);
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "SMTP connection test failed for {Email}", request.EmailAddress);
            return (false, $"SMTP failed: {MapConnectionError(ex, request.Provider)}");
        }

        return (true, "Connection successful. IMAP and SMTP are working.");
    }

    private static (string Username, string Password) NormalizeCredentials(SaveMailboxConnectionRequest request)
    {
        var password = request.Password.Trim().Replace(" ", "");
        var email = request.EmailAddress.Trim().ToLowerInvariant();
        var username = string.Equals(request.Provider, "gmail", StringComparison.OrdinalIgnoreCase)
            ? email
            : request.Username.Trim();
        return (username, password);
    }

    private static SecureSocketOptions ResolveSmtpSecurity(SaveMailboxConnectionRequest request)
    {
        if (request.SmtpPort == 465) return SecureSocketOptions.SslOnConnect;
        if (string.Equals(request.Provider, "gmail", StringComparison.OrdinalIgnoreCase))
            return SecureSocketOptions.StartTls;
        return request.SmtpUseSsl ? SecureSocketOptions.StartTls : SecureSocketOptions.Auto;
    }

    private static bool IsAuthFailure(Exception ex)
    {
        for (var current = ex; current != null; current = current.InnerException)
        {
            if (current is AuthenticationException) return true;
            var msg = current.Message;
            if (msg.Contains("authentication", StringComparison.OrdinalIgnoreCase)
                || msg.Contains("credentials", StringComparison.OrdinalIgnoreCase)
                || msg.Contains("invalid credentials", StringComparison.OrdinalIgnoreCase)
                || msg.Contains("535", StringComparison.OrdinalIgnoreCase)
                || msg.Contains("534", StringComparison.OrdinalIgnoreCase))
                return true;
        }
        return false;
    }

    private static string MapConnectionError(Exception ex, string provider)
    {
        var msg = ex.Message;
        if (ex is OperationCanceledException)
            return "Connection timed out. Check IMAP/SMTP host, port, and firewall settings.";

        if (IsAuthFailure(ex))
        {
            return provider switch
            {
                "gmail" => "Gmail rejected the login. Use your full @gmail.com address as username, paste the 16-character App Password (spaces are OK), and enable IMAP in Gmail → Settings → See all settings → Forwarding and POP/IMAP → Enable IMAP. Create an App Password at https://myaccount.google.com/apppasswords",
                "outlook" => "Outlook rejected the login. If 2FA is enabled, create an app password in your Microsoft account security settings and use your full email as the username.",
                "yahoo" => "Yahoo rejected the login. Generate an app password in Yahoo Account Security and use it here instead of your regular password.",
                _ => "Mail server rejected the username or password. Double-check credentials and use an app password if your provider requires one."
            };
        }

        if (msg.Contains("refused", StringComparison.OrdinalIgnoreCase)
            || msg.Contains("resolve", StringComparison.OrdinalIgnoreCase))
            return $"Could not reach the mail server ({msg}). Verify IMAP/SMTP host and port.";

        return msg;
    }

    public async Task<MailboxConnection> SaveConnectionAsync(Guid userId, SaveMailboxConnectionRequest request)
    {
        var (username, password) = NormalizeCredentials(request);
        var existing = await db.MailboxConnections.FirstOrDefaultAsync(x => x.UserId == userId);
        if (existing is null)
        {
            existing = new MailboxConnection { Id = Guid.NewGuid(), UserId = userId };
            db.MailboxConnections.Add(existing);
        }

        existing.EmailAddress = request.EmailAddress.Trim().ToLowerInvariant();
        existing.ImapHost = request.ImapHost;
        existing.ImapPort = request.ImapPort;
        existing.ImapUseSsl = request.ImapUseSsl;
        existing.SmtpHost = request.SmtpHost;
        existing.SmtpPort = request.SmtpPort;
        existing.SmtpUseSsl = request.SmtpUseSsl;
        existing.Username = username;
        existing.PasswordEncrypted = ProtectPassword(password);
        existing.Provider = request.Provider;
        existing.IsConnected = true;
        existing.LastSyncedAt = DateTime.UtcNow;

        await db.SaveChangesAsync();
        return existing;
    }

    public async Task<int> SyncInboxAsync(Guid userId, int maxMessages = 100)
    {
        var conn = await db.MailboxConnections.FirstOrDefaultAsync(x => x.UserId == userId)
            ?? throw new InvalidOperationException("Mailbox not connected.");

        if (!conn.IsConnected)
            throw new InvalidOperationException("Mailbox is not connected.");

        var password = UnprotectPassword(conn.PasswordEncrypted);
        var synced = 0;

        using var imap = new ImapClient { Timeout = 60000 };
        await imap.ConnectAsync(
            conn.ImapHost, conn.ImapPort,
            conn.ImapUseSsl ? SecureSocketOptions.SslOnConnect : SecureSocketOptions.StartTlsWhenAvailable);
        await imap.AuthenticateAsync(conn.Username, password);

        synced += await SyncFolderMessagesAsync(userId, imap.Inbox, "inbox", conn.EmailAddress, maxMessages);

        synced += await TrySyncSpecialFolderAsync(userId, imap, SpecialFolder.Sent, "sent", conn.EmailAddress, maxMessages);
        synced += await TrySyncSpecialFolderAsync(userId, imap, SpecialFolder.Drafts, "drafts", conn.EmailAddress, maxMessages);
        synced += await TrySyncSpecialFolderAsync(userId, imap, SpecialFolder.Junk, "spam", conn.EmailAddress, maxMessages);
        synced += await TrySyncSpecialFolderAsync(userId, imap, SpecialFolder.Trash, "trash", conn.EmailAddress, maxMessages);
        synced += await TrySyncNamedFolderAsync(userId, imap, "[Gmail]/Scheduled", "scheduled", conn.EmailAddress, maxMessages);

        conn.LastSyncedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
        await imap.DisconnectAsync(true);
        return synced;
    }

    private async Task<int> TrySyncSpecialFolderAsync(
        Guid userId, ImapClient imap, SpecialFolder special, string folderKey, string ownerEmail, int maxMessages)
    {
        try
        {
            var folder = imap.GetFolder(special);
            if (!folder.Exists) return 0;
            return await SyncFolderMessagesAsync(userId, folder, folderKey, ownerEmail, maxMessages);
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "{Folder} sync skipped for user {UserId}", folderKey, userId);
            return 0;
        }
    }

    private async Task<int> TrySyncNamedFolderAsync(
        Guid userId, ImapClient imap, string folderName, string folderKey, string ownerEmail, int maxMessages)
    {
        try
        {
            var folder = imap.GetFolder(folderName);
            if (!folder.Exists) return 0;
            return await SyncFolderMessagesAsync(userId, folder, folderKey, ownerEmail, maxMessages);
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "{Folder} ({FolderName}) sync skipped for user {UserId}", folderKey, folderName, userId);
            return 0;
        }
    }

    private async Task<int> SyncFolderMessagesAsync(
        Guid userId, IMailFolder folder, string folderKey, string ownerEmail, int maxMessages)
    {
        await folder.OpenAsync(FolderAccess.ReadOnly);
        if (folder.Count == 0) return 0;

        var synced = 0;
        var endIndex = folder.Count - 1;
        var startIndex = Math.Max(0, folder.Count - maxMessages);
        var summaries = folder.Fetch(
            startIndex, endIndex,
            MessageSummaryItems.UniqueId | MessageSummaryItems.Flags | MessageSummaryItems.Envelope);

        logger.LogInformation(
            "Syncing {Folder}: {Count} messages on server, fetching {Batch} summaries",
            folderKey, folder.Count, summaries.Count);

        foreach (var summary in summaries.Reverse())
        {
            try
            {
                var externalId = $"{folderKey}:{summary.UniqueId}";
                if (await db.MailboxMessages.AnyAsync(m => m.UserId == userId && m.ExternalId == externalId))
                    continue;

                var message = await folder.GetMessageAsync(summary.UniqueId);
                var from = message.From.Mailboxes.FirstOrDefault();
                var to = message.To.Mailboxes.FirstOrDefault();
                var textBody = message.TextBody ?? string.Empty;
                var htmlBody = message.HtmlBody ?? string.Empty;
                var body = TruncateBody(!string.IsNullOrWhiteSpace(htmlBody) ? htmlBody : textBody);
                var previewSource = !string.IsNullOrWhiteSpace(textBody)
                    ? textBody
                    : (message.Subject ?? string.Empty);
                var preview = previewSource.Length > 100 ? previewSource[..100] : previewSource;

                var entity = new MailboxMessage
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    ExternalId = externalId,
                    FromName = from?.Name ?? from?.Address ?? "Unknown",
                    FromEmail = from?.Address ?? string.Empty,
                    ToName = to?.Name ?? ownerEmail,
                    ToEmail = to?.Address ?? ownerEmail,
                    Subject = message.Subject ?? "(no subject)",
                    Preview = string.IsNullOrWhiteSpace(preview) ? "(no preview)" : preview,
                    Body = body,
                    Timestamp = message.Date.UtcDateTime,
                    Read = summary.Flags.HasValue && summary.Flags.Value.HasFlag(MessageFlags.Seen),
                    Starred = summary.Flags.HasValue && summary.Flags.Value.HasFlag(MessageFlags.Flagged),
                    Folder = folderKey,
                    AttachmentsJson = "[]"
                };

                db.MailboxMessages.Add(entity);
                try
                {
                    await db.SaveChangesAsync();
                    synced++;
                }
                catch (Exception saveEx)
                {
                    logger.LogWarning(saveEx, "Failed to save message {Uid} from {Folder}", summary.UniqueId, folderKey);
                    db.Entry(entity).State = EntityState.Detached;
                }
            }
            catch (Exception ex)
            {
                logger.LogWarning(ex, "Failed to import message {Uid} from {Folder}", summary.UniqueId, folderKey);
            }
        }

        return synced;
    }

    private static string TruncateBody(string body) =>
        body.Length <= MaxStoredBodyLength ? body : body[..MaxStoredBodyLength];

    public async Task SendEmailAsync(Guid userId, SendEmailRequest request)
    {
        var conn = await db.MailboxConnections.FirstOrDefaultAsync(x => x.UserId == userId)
            ?? throw new InvalidOperationException("Mailbox not connected.");

        var password = UnprotectPassword(conn.PasswordEncrypted);
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(conn.EmailAddress, conn.EmailAddress));
        message.To.Add(MailboxAddress.Parse(request.To));
        message.Subject = request.Subject;
        message.Body = BuildMimeBody(request.Body, request.Attachments);

        using var smtp = new SmtpClient();
        await smtp.ConnectAsync(conn.SmtpHost, conn.SmtpPort, conn.SmtpUseSsl ? SecureSocketOptions.StartTls : SecureSocketOptions.Auto);
        await smtp.AuthenticateAsync(conn.Username, password);
        await smtp.SendAsync(message);
        await smtp.DisconnectAsync(true);

        var preview = request.Body.Length > 100 ? request.Body[..100] : request.Body;
        db.MailboxMessages.Add(new MailboxMessage
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            FromName = "You",
            FromEmail = conn.EmailAddress,
            ToName = request.To.Split('@')[0],
            ToEmail = request.To,
            Subject = request.Subject,
            Preview = preview,
            Body = request.Body,
            Timestamp = DateTime.UtcNow,
            Read = true,
            Starred = false,
            Folder = "sent",
            AttachmentsJson = SerializeAttachments(request.Attachments)
        });
        await db.SaveChangesAsync();
    }

    public static string SerializeAttachments(List<EmailAttachmentUploadDto>? attachments, string? existingJson = null)
    {
        if (attachments is null or { Count: 0 })
            return string.IsNullOrWhiteSpace(existingJson) ? "[]" : existingJson;

        var options = new System.Text.Json.JsonSerializerOptions
        {
            PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase
        };
        var existing = string.IsNullOrWhiteSpace(existingJson)
            ? []
            : System.Text.Json.JsonSerializer.Deserialize<List<EmailAttachmentDto>>(existingJson, options) ?? [];

        var dtos = attachments.Select(a =>
        {
            var base64 = a.ContentBase64;
            if (string.IsNullOrWhiteSpace(base64))
            {
                var prev = existing.FirstOrDefault(e =>
                    string.Equals(e.Name, a.Name, StringComparison.OrdinalIgnoreCase));
                base64 = prev?.ContentBase64;
            }
            return new EmailAttachmentDto(a.Name, a.Size, a.Type, base64);
        }).Where(d => !string.IsNullOrWhiteSpace(d.ContentBase64)).ToList();

        return dtos.Count == 0 ? "[]" : System.Text.Json.JsonSerializer.Serialize(dtos, options);
    }

    private static MimeEntity BuildMimeBody(string htmlBody, List<EmailAttachmentUploadDto>? attachments)
    {
        var builder = new BodyBuilder
        {
            HtmlBody = string.IsNullOrWhiteSpace(htmlBody) ? "<p></p>" : htmlBody
        };

        if (attachments is { Count: > 0 })
        {
            foreach (var att in attachments)
            {
                if (string.IsNullOrWhiteSpace(att.ContentBase64)) continue;
                try
                {
                    var bytes = Convert.FromBase64String(att.ContentBase64);
                    builder.Attachments.Add(att.Name, bytes);
                }
                catch (FormatException)
                {
                    // Skip malformed attachment payloads.
                }
            }
        }

        return builder.ToMessageBody();
    }

    public static MailboxSetupInstructionsDto GetSetupInstructions() => new(
        "Connect your email inbox",
        [
            new("Gmail", "imap.gmail.com", 993, "smtp.gmail.com", 587,
            [
                "Enable 2-Step Verification on your Google account.",
                "Create an App Password at https://myaccount.google.com/apppasswords (choose Mail → Other → ScribeCount).",
                "Enable IMAP: Gmail → Settings gear → See all settings → Forwarding and POP/IMAP → Enable IMAP.",
                "Use your full Gmail address as the username (e.g. you@gmail.com).",
                "Paste the 16-character App Password in the password field (with or without spaces).",
                "IMAP: imap.gmail.com:993 (SSL). SMTP: smtp.gmail.com:587 (TLS)."
            ]),
            new("Outlook / Microsoft 365", "outlook.office365.com", 993, "smtp.office365.com", 587,
            [
                "Enable IMAP in Outlook settings: Settings → Mail → Sync email → IMAP.",
                "Use your full email address as the username.",
                "If 2FA is enabled, create an app password in Microsoft account security.",
                "IMAP: outlook.office365.com:993. SMTP: smtp.office365.com:587."
            ]),
            new("Yahoo Mail", "imap.mail.yahoo.com", 993, "smtp.mail.yahoo.com", 587,
            [
                "Generate an app password in Yahoo Account Security settings.",
                "Use your Yahoo email as username and the app password.",
                "IMAP: imap.mail.yahoo.com:993. SMTP: smtp.mail.yahoo.com:587."
            ]),
            new("Custom / Other", "your.imap.server", 993, "your.smtp.server", 587,
            [
                "Get IMAP and SMTP settings from your email provider.",
                "Use SSL/TLS for IMAP (usually port 993) and STARTTLS for SMTP (usually 587).",
                "Username is usually your full email address."
            ])
        ],
        [
            "After registering, go to Settings → Inbox Connection.",
            "Choose your email provider or enter custom IMAP/SMTP settings.",
            "Click Test Connection to verify credentials.",
            "Click Save & Sync to import your recent inbox messages.",
            "Your inbox in ScribeCount Email will update from your connected account."
        ]
    );
}
