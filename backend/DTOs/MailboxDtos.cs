namespace ScribeCount.Email.Api.DTOs;

public record EmailAttachmentDto(string Name, string Size, string Type, string? ContentBase64 = null);

public record EmailAttachmentUploadDto(string Name, string Size, string Type, string ContentBase64);

public record EmailDto(
    string Id,
    string From,
    string FromEmail,
    string To,
    string ToEmail,
    string Subject,
    string Preview,
    string Body,
    DateTime Timestamp,
    bool Read,
    bool Starred,
    string Folder,
    List<EmailAttachmentDto> Attachments,
    List<string>? Labels = null
);

public record MailboxConnectionDto(
    string EmailAddress,
    string ImapHost,
    int ImapPort,
    bool ImapUseSsl,
    string SmtpHost,
    int SmtpPort,
    bool SmtpUseSsl,
    string Username,
    string Provider,
    bool IsConnected,
    DateTime? LastSyncedAt
);

public record SaveMailboxConnectionRequest(
    string EmailAddress,
    string ImapHost,
    int ImapPort,
    bool ImapUseSsl,
    string SmtpHost,
    int SmtpPort,
    bool SmtpUseSsl,
    string Username,
    string Password,
    string Provider
);

public record SendEmailRequest(string To, string Subject, string Body, List<EmailAttachmentUploadDto>? Attachments = null);
public record SaveDraftRequest(string To, string Subject, string Body, List<EmailAttachmentUploadDto>? Attachments = null);
public record ScheduleEmailRequest(string To, string Subject, string Body, DateTime? ScheduledAt, List<EmailAttachmentUploadDto>? Attachments = null);
public record UpdateMessageRequest(string To, string Subject, string Body, DateTime? ScheduledAt, List<EmailAttachmentUploadDto>? Attachments = null);

public record MailboxSetupInstructionsDto(
    string Title,
    List<MailboxProviderGuideDto> Providers,
    List<string> GeneralSteps
);

public record MailboxProviderGuideDto(
    string Provider,
    string ImapHost,
    int ImapPort,
    string SmtpHost,
    int SmtpPort,
    List<string> Steps
);
