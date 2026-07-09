namespace ScribeCount.Email.Api.DTOs;

public record SesStatusDto(
    bool Enabled,
    bool Configured,
    string Region,
    string FromEmail,
    string FromName,
    string ConfigurationSetName,
    bool HasCredentials,
    string Message,
    List<string> Checklist,
    SesIdentityStatusDto? FromIdentity = null);

public record SesIdentityStatusDto(
    string Identity,
    string IdentityType,
    bool FoundInAccount,
    bool Verified,
    string VerificationStatus,
    string Message);

public record SesTestSendRequest(string? ToEmail, string? Subject, string? Body);

public record SesTestSendResponse(string Message, string ToEmail, string? SesMessageId, bool Success = true);

public record PlatformSendRequest(
    Guid UserId,
    string ToEmail,
    string Subject,
    string HtmlBody,
    string Source,
    Guid? SubscriberId = null,
    Guid? CampaignId = null,
    Guid? FlowId = null,
    string? StepId = null);

public record SenderIdentityDto(
    string FromEmail,
    string FromName,
    bool Verified,
    string? VerifiedAt,
    string PendingEmail,
    bool HasPendingOtp,
    string DefaultFromEmail,
    bool UsingDefault,
    string Message);

public record RequestSenderOtpRequest(string FromEmail, string? FromName);

public record VerifySenderOtpRequest(string Code);

public record SenderOtpResponse(bool Success, string Message, SenderIdentityDto Identity);
