namespace ScribeCount.Email.Api.Entities;

public class MailboxConnection
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string EmailAddress { get; set; } = string.Empty;
    public string ImapHost { get; set; } = string.Empty;
    public int ImapPort { get; set; } = 993;
    public bool ImapUseSsl { get; set; } = true;
    public string SmtpHost { get; set; } = string.Empty;
    public int SmtpPort { get; set; } = 587;
    public bool SmtpUseSsl { get; set; } = true;
    public string Username { get; set; } = string.Empty;
    public string PasswordEncrypted { get; set; } = string.Empty;
    public string Provider { get; set; } = "custom";
    public bool IsConnected { get; set; }
    public DateTime? LastSyncedAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = null!;
}
