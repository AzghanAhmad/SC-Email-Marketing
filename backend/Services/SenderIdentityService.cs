using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using ScribeCount.Email.Api.Configuration;
using ScribeCount.Email.Api.Data;
using ScribeCount.Email.Api.DTOs;
using ScribeCount.Email.Api.Entities;

namespace ScribeCount.Email.Api.Services;

public class SenderIdentityService(
    AppDbContext db,
    SesEmailService ses,
    IOptions<SenderOptions> senderOptions,
    IOptions<SesOptions> sesOptions,
    ILogger<SenderIdentityService> logger)
{
    private readonly SenderOptions _sender = senderOptions.Value;
    private readonly SesOptions _ses = sesOptions.Value;

    public async Task<SenderIdentityDto> GetAsync(Guid userId)
    {
        var identity = await db.SenderIdentities.AsNoTracking().FirstOrDefaultAsync(s => s.UserId == userId);
        return MapDto(identity);
    }

    public async Task<SenderOtpResponse> RequestOtpAsync(Guid userId, RequestSenderOtpRequest request)
    {
        var email = (request.FromEmail ?? "").Trim().ToLowerInvariant();

        if (!IsValidEmail(email))
            return Fail(await GetAsync(userId), "Enter a valid email address.");

        // Already the user's active sending address — nothing to verify.
        var current = await db.SenderIdentities.FirstOrDefaultAsync(s => s.UserId == userId);
        if (current is not null && current.Verified
            && string.Equals(current.FromEmail, email, StringComparison.OrdinalIgnoreCase))
            return Fail(MapDto(current), $"You're already using {email} as your sending address.");

        // A verified address may only belong to one user.
        var claimedByOther = await db.SenderIdentities
            .AnyAsync(s => s.UserId != userId && s.Verified && s.FromEmail == email);
        if (claimedByOther)
            return Fail(await GetAsync(userId), "That address is already verified by another account.");

        // The address must be a verified identity in Amazon SES (either the exact email,
        // or its domain) before we send any OTP or allow it to become a sending address.
        var (sesVerified, sesReason) = await CheckSesVerifiedAsync(email);
        if (!sesVerified)
            return Fail(await GetAsync(userId), sesReason);

        var identity = await db.SenderIdentities.FirstOrDefaultAsync(s => s.UserId == userId);
        var now = DateTime.UtcNow;

        // Rate limit resends.
        if (identity is not null
            && identity.OtpLastSentAt.HasValue
            && string.Equals(identity.PendingEmail, email, StringComparison.OrdinalIgnoreCase)
            && (now - identity.OtpLastSentAt.Value).TotalSeconds < _sender.OtpResendSeconds)
        {
            var wait = _sender.OtpResendSeconds - (int)(now - identity.OtpLastSentAt.Value).TotalSeconds;
            return Fail(MapDto(identity), $"Please wait {Math.Max(wait, 1)}s before requesting another code.");
        }

        var code = GenerateOtp();
        var name = string.IsNullOrWhiteSpace(request.FromName) ? "" : request.FromName.Trim();

        if (identity is null)
        {
            identity = new SenderIdentity
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                CreatedAt = now,
            };
            db.SenderIdentities.Add(identity);
        }

        identity.PendingEmail = email;
        identity.PendingName = name;
        identity.OtpHash = HashOtp(userId, email, code);
        identity.OtpExpiresAt = now.AddMinutes(_sender.OtpTtlMinutes);
        identity.OtpLastSentAt = now;
        identity.OtpAttempts = 0;
        identity.UpdatedAt = now;

        try
        {
            await ses.SendSystemAsync(userId, email, "Verify your sending address",
                BuildOtpEmailHtml(code), "sender_verification");
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Failed to send sender verification OTP to {Email}", email);
            return Fail(MapDto(identity),
                "We couldn't send the verification code. Confirm the address is correct and that it can receive mail, then try again.");
        }

        await db.SaveChangesAsync();

        return new SenderOtpResponse(true,
            $"We sent a 6-digit code to {email}. It expires in {_sender.OtpTtlMinutes} minutes.",
            MapDto(identity));
    }

    public async Task<SenderOtpResponse> VerifyOtpAsync(Guid userId, VerifySenderOtpRequest request)
    {
        var identity = await db.SenderIdentities.FirstOrDefaultAsync(s => s.UserId == userId);
        if (identity is null || string.IsNullOrWhiteSpace(identity.PendingEmail))
            return Fail(MapDto(identity), "Request a verification code first.");

        var now = DateTime.UtcNow;
        if (!identity.OtpExpiresAt.HasValue || identity.OtpExpiresAt.Value < now)
            return Fail(MapDto(identity), "That code has expired. Request a new one.");

        if (identity.OtpAttempts >= _sender.OtpMaxAttempts)
            return Fail(MapDto(identity), "Too many incorrect attempts. Request a new code.");

        var code = (request.Code ?? "").Trim();
        var expected = identity.OtpHash;
        var actual = HashOtp(userId, identity.PendingEmail, code);

        if (!CryptographicOperations.FixedTimeEquals(
                Encoding.UTF8.GetBytes(expected), Encoding.UTF8.GetBytes(actual)))
        {
            identity.OtpAttempts += 1;
            identity.UpdatedAt = now;
            await db.SaveChangesAsync();
            return Fail(MapDto(identity), "Incorrect code. Please check and try again.");
        }

        // Re-check uniqueness at verification time (guards against races).
        var claimedByOther = await db.SenderIdentities
            .AnyAsync(s => s.UserId != userId && s.Verified && s.FromEmail == identity.PendingEmail);
        if (claimedByOther)
            return Fail(MapDto(identity), "That address was just verified by another account.");

        // Re-confirm the address is still a verified Amazon SES identity before switching to it.
        var (sesVerified, _) = await CheckSesVerifiedAsync(identity.PendingEmail);
        if (!sesVerified)
            return Fail(MapDto(identity),
                $"{identity.PendingEmail} is no longer a verified identity in Amazon SES. Verify it in the AWS SES console and request a new code.");

        identity.FromEmail = identity.PendingEmail;
        identity.FromName = identity.PendingName;
        identity.Verified = true;
        identity.VerifiedAt = now;
        identity.PendingEmail = "";
        identity.PendingName = "";
        identity.OtpHash = "";
        identity.OtpExpiresAt = null;
        identity.OtpAttempts = 0;
        identity.UpdatedAt = now;
        await db.SaveChangesAsync();

        return new SenderOtpResponse(true,
            $"{identity.FromEmail} is verified and is now your sending address.",
            MapDto(identity));
    }

    private SenderIdentityDto MapDto(SenderIdentity? identity)
    {
        var defaultFrom = _ses.FromEmail;

        if (identity is null)
        {
            return new SenderIdentityDto(
                "", "", false, null, "", false, defaultFrom, true,
                "Verify any email address you own to use it as your sending From address.");
        }

        var hasPending = !string.IsNullOrWhiteSpace(identity.PendingEmail)
            && identity.OtpExpiresAt.HasValue
            && identity.OtpExpiresAt.Value > DateTime.UtcNow;
        var usingDefault = !identity.Verified || string.IsNullOrWhiteSpace(identity.FromEmail);

        var message = identity.Verified && !usingDefault
            ? $"Sending from {identity.FromEmail}."
            : hasPending
                ? $"Enter the code we sent to {identity.PendingEmail}."
                : "Verify any email address you own to use it as your sending From address.";

        return new SenderIdentityDto(
            identity.FromEmail,
            identity.FromName,
            identity.Verified,
            identity.VerifiedAt?.ToString("MMMM d, yyyy 'at' h:mm tt"),
            identity.PendingEmail,
            hasPending,
            defaultFrom,
            usingDefault,
            message);
    }

    /// <summary>
    /// True when the email itself is a verified SES identity, or the domain it belongs to is
    /// (domain verification lets any address on that domain send). Returns a user-facing
    /// reason when it is not verified.
    /// </summary>
    private async Task<(bool Verified, string Reason)> CheckSesVerifiedAsync(string email)
    {
        var emailIdentity = await ses.CheckIdentityAsync(email);
        if (emailIdentity.Verified)
            return (true, "");

        var at = email.IndexOf('@');
        if (at > 0 && at < email.Length - 1)
        {
            var domain = email[(at + 1)..];
            var domainIdentity = await ses.CheckIdentityAsync(domain);
            if (domainIdentity.Verified)
                return (true, "");
        }

        var reason = emailIdentity.FoundInAccount
            ? $"{email} is in Amazon SES but not verified yet. Finish verifying it (or its domain) in the AWS SES console, then try again."
            : $"{email} is not a verified identity in Amazon SES. Add and verify the address or its domain in the AWS SES console first, then request a code.";
        return (false, reason);
    }

    private static SenderOtpResponse Fail(SenderIdentityDto dto, string message) =>
        new(false, message, dto);

    private static string GenerateOtp() =>
        RandomNumberGenerator.GetInt32(0, 1_000_000).ToString("D6");

    private static string HashOtp(Guid userId, string email, string code)
    {
        var input = $"{userId:N}:{email.Trim().ToLowerInvariant()}:{code.Trim()}";
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(input));
        return Convert.ToHexString(bytes);
    }

    private static bool IsValidEmail(string email)
    {
        if (string.IsNullOrWhiteSpace(email)) return false;
        var at = email.IndexOf('@');
        if (at <= 0 || at != email.LastIndexOf('@')) return false;
        var dot = email.IndexOf('.', at);
        return dot > at + 1 && dot < email.Length - 1;
    }

    private static string BuildOtpEmailHtml(string code) => $"""
        <div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;color:#0f172a;">
          <h2 style="margin:0 0 12px;font-size:20px;">Verify your sending address</h2>
          <p style="margin:0 0 20px;color:#475569;font-size:14px;line-height:1.5;">
            Use the code below to confirm this address as your ScribeCount sending identity.
            This code expires shortly.
          </p>
          <div style="font-size:34px;font-weight:800;letter-spacing:8px;background:#f1f5f9;border-radius:12px;padding:18px;text-align:center;color:#0f172a;">
            {code}
          </div>
          <p style="margin:20px 0 0;color:#94a3b8;font-size:12px;line-height:1.5;">
            If you didn't request this, you can safely ignore this email.
          </p>
        </div>
        """;
}
