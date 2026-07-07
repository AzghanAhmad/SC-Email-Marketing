namespace ScribeCount.Email.Api.Entities;

/// <summary>
/// A user's verified "From" sending address. A user may only have one, and each
/// address can be claimed (verified) by at most one user. Ownership is proven by
/// an OTP emailed to the address before it becomes active.
/// </summary>
public class SenderIdentity
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }

    /// <summary>The active, verified From email. Empty until first verification.</summary>
    public string FromEmail { get; set; } = "";
    public string FromName { get; set; } = "";
    public bool Verified { get; set; }
    public DateTime? VerifiedAt { get; set; }

    /// <summary>The address awaiting OTP confirmation (may differ from FromEmail).</summary>
    public string PendingEmail { get; set; } = "";
    public string PendingName { get; set; } = "";
    public string OtpHash { get; set; } = "";
    public DateTime? OtpExpiresAt { get; set; }
    public DateTime? OtpLastSentAt { get; set; }
    public int OtpAttempts { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = null!;
}
