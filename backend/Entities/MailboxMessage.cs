namespace ScribeCount.Email.Api.Entities;

public class MailboxMessage
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string? ExternalId { get; set; }
    public string FromName { get; set; } = string.Empty;
    public string FromEmail { get; set; } = string.Empty;
    public string ToName { get; set; } = string.Empty;
    public string ToEmail { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Preview { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
    public bool Read { get; set; }
    public bool Starred { get; set; }
    public string Folder { get; set; } = "inbox";
    public string AttachmentsJson { get; set; } = "[]";
    public string? LabelsJson { get; set; }

    public User User { get; set; } = null!;
}
