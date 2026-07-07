using Amazon;
using Amazon.Runtime;
using Amazon.SimpleEmailV2;
using Amazon.SimpleEmailV2.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using ScribeCount.Email.Api.Configuration;
using ScribeCount.Email.Api.Data;
using ScribeCount.Email.Api.DTOs;
using ScribeCount.Email.Api.Entities;

namespace ScribeCount.Email.Api.Services;

public class SesEmailService(
    AppDbContext db,
    IOptions<SesOptions> options,
    ILogger<SesEmailService> logger)
{
    private readonly SesOptions _options = options.Value;
    private IAmazonSimpleEmailServiceV2? _client;

    public bool IsConfigured => _options.IsConfigured;

    public async Task<SesStatusDto> GetStatusAsync(Guid? userId = null, CancellationToken cancellationToken = default)
    {
        var hasKeys = !string.IsNullOrWhiteSpace(_options.AccessKeyId)
            || !string.IsNullOrWhiteSpace(Environment.GetEnvironmentVariable("AWS_ACCESS_KEY_ID"));

        // Reflect the user's verified sender when they have one; otherwise the platform default.
        var effectiveFromEmail = _options.FromEmail;
        var effectiveFromName = _options.FromName;
        var usingUserSender = false;
        if (userId.HasValue)
        {
            var (fromEmail, fromName) = await ResolveSenderAsync(userId.Value, cancellationToken);
            if (!string.Equals(fromEmail, _options.FromEmail, StringComparison.OrdinalIgnoreCase))
                usingUserSender = true;
            effectiveFromEmail = fromEmail;
            effectiveFromName = fromName;
        }

        var checklist = new List<string>
        {
            _options.Enabled ? "AmazonSes:Enabled is true" : "Set AmazonSes:Enabled to true",
            !string.IsNullOrWhiteSpace(effectiveFromEmail)
                ? $"From address: {effectiveFromEmail}"
                : "Verify a sending address to send from your own name",
            !string.IsNullOrWhiteSpace(_options.Region)
                ? $"Region: {_options.Region}"
                : "Set AmazonSes:Region",
            hasKeys
                ? "AWS credentials present (config or environment)"
                : "Set AccessKeyId/SecretAccessKey or AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY",
            !string.IsNullOrWhiteSpace(_options.ConfigurationSetName)
                ? $"Configuration set: {_options.ConfigurationSetName}"
                : "Set AmazonSes:ConfigurationSetName (required for SNS bounce/complaint/delivery)",
        };

        var message = _options.IsConfigured
            ? usingUserSender
                ? "Amazon SES is configured. Campaigns and flows send from your verified address."
                : "Amazon SES is configured. Campaigns and flows send through SES v2."
            : "Amazon SES is not fully configured. Platform outbound mail (campaigns/flows) requires SES.";

        SesIdentityStatusDto? fromIdentity = null;
        if (_options.IsConfigured && !string.IsNullOrWhiteSpace(effectiveFromEmail))
            fromIdentity = await CheckIdentityAsync(effectiveFromEmail, cancellationToken);

        return new SesStatusDto(
            _options.Enabled,
            _options.IsConfigured,
            _options.Region,
            effectiveFromEmail,
            effectiveFromName,
            _options.ConfigurationSetName,
            hasKeys,
            message,
            checklist,
            fromIdentity);
    }

    public SesStatusDto GetStatus() => GetStatusAsync().GetAwaiter().GetResult();

    public async Task<SesIdentityStatusDto> CheckIdentityAsync(
        string? identity,
        CancellationToken cancellationToken = default)
    {
        var normalized = NormalizeIdentity(identity);
        if (string.IsNullOrWhiteSpace(normalized))
        {
            return new SesIdentityStatusDto(
                "", "unknown", false, false, "none",
                "Enter a domain or email address to check.");
        }

        if (!_options.IsConfigured)
        {
            return new SesIdentityStatusDto(
                normalized,
                IdentityType(normalized),
                false,
                false,
                "unconfigured",
                "Amazon SES is not configured in this app yet.");
        }

        try
        {
            var client = GetClient();
            var response = await client.GetEmailIdentityAsync(
                new GetEmailIdentityRequest { EmailIdentity = normalized },
                cancellationToken);

            var status = response.VerificationStatus?.Value ?? "UNKNOWN";
            var verified = status.Equals("SUCCESS", StringComparison.OrdinalIgnoreCase);
            var message = verified
                ? "Verified in your Amazon SES account."
                : status.Equals("PENDING", StringComparison.OrdinalIgnoreCase)
                    ? "Found in your SES account — verification is still pending. Complete DNS in the AWS console."
                    : status.Equals("FAILED", StringComparison.OrdinalIgnoreCase)
                        ? "Found in your SES account but verification failed. Check DNS records in AWS."
                        : $"Found in your SES account (status: {status}).";

            return new SesIdentityStatusDto(
                normalized,
                IdentityType(normalized),
                true,
                verified,
                status,
                message);
        }
        catch (NotFoundException)
        {
            return new SesIdentityStatusDto(
                normalized,
                IdentityType(normalized),
                false,
                false,
                "NOT_FOUND",
                "Not found in your Amazon SES account. Add and verify this identity in the AWS SES console.");
        }
        catch (AmazonSimpleEmailServiceV2Exception ex)
        {
            logger.LogWarning(ex, "Could not check SES identity {Identity}", normalized);
            return new SesIdentityStatusDto(
                normalized,
                IdentityType(normalized),
                false,
                false,
                "error",
                "Could not check this identity in Amazon SES. Confirm your AWS credentials and region.");
        }
    }

    private static string NormalizeIdentity(string? value)
    {
        if (string.IsNullOrWhiteSpace(value)) return "";
        var trimmed = value.Trim().ToLowerInvariant();
        if (trimmed.Contains('@')) return trimmed;
        return trimmed.TrimStart('.');
    }

    private static string IdentityType(string identity) =>
        identity.Contains('@') ? "email" : "domain";

    /// <summary>
    /// Sends using the sender's own verified From address when they have one, otherwise
    /// the platform default. Used for campaigns, flows, and other per-user mail.
    /// </summary>
    public async Task<string> SendAsync(PlatformSendRequest request, CancellationToken cancellationToken = default)
    {
        var (fromEmail, fromName) = await ResolveSenderAsync(request.UserId, cancellationToken);
        return await SendCoreAsync(fromEmail, fromName, request, cancellationToken);
    }

    /// <summary>
    /// Sends a platform/system message (e.g. sender verification OTP) from the platform
    /// default From address, ignoring any per-user sender identity.
    /// </summary>
    public Task<string> SendSystemAsync(
        Guid userId, string toEmail, string subject, string htmlBody, string source,
        CancellationToken cancellationToken = default)
    {
        var request = new PlatformSendRequest(userId, toEmail, subject, htmlBody, source);
        return SendCoreAsync(_options.FromEmail, _options.FromName, request, cancellationToken);
    }

    /// <summary>Resolves the effective From (email, name) for a user.</summary>
    public async Task<(string FromEmail, string FromName)> ResolveSenderAsync(
        Guid userId, CancellationToken cancellationToken = default)
    {
        try
        {
            var identity = await db.SenderIdentities.AsNoTracking()
                .FirstOrDefaultAsync(s => s.UserId == userId && s.Verified, cancellationToken);
            if (identity is not null && !string.IsNullOrWhiteSpace(identity.FromEmail))
            {
                var name = string.IsNullOrWhiteSpace(identity.FromName) ? _options.FromName : identity.FromName;
                return (identity.FromEmail, name);
            }
        }
        catch
        {
            // Table may not exist yet on first boot; fall back to defaults.
        }

        return (_options.FromEmail, _options.FromName);
    }

    private async Task<string> SendCoreAsync(
        string fromEmail, string fromName, PlatformSendRequest request, CancellationToken cancellationToken)
    {
        if (!_options.IsConfigured)
        {
            throw new InvalidOperationException(
                "Amazon SES is not configured. Add AmazonSes settings (Enabled, FromEmail, Region, credentials) and restart the API. See docs/AWS-SES-SNS-SETUP.md.");
        }

        if (string.IsNullOrWhiteSpace(request.ToEmail))
            throw new InvalidOperationException("Recipient is required.");

        var client = GetClient();
        var from = string.IsNullOrWhiteSpace(fromName)
            ? fromEmail
            : $"{fromName} <{fromEmail}>";

        var tags = new List<MessageTag>
        {
            new() { Name = "user_id", Value = SanitizeTag(request.UserId.ToString("N")) },
            new() { Name = "source", Value = SanitizeTag(request.Source) },
        };
        if (request.SubscriberId.HasValue)
            tags.Add(new MessageTag { Name = "subscriber_id", Value = SanitizeTag(request.SubscriberId.Value.ToString("N")) });
        if (request.CampaignId.HasValue)
            tags.Add(new MessageTag { Name = "campaign_id", Value = SanitizeTag(request.CampaignId.Value.ToString("N")) });
        if (request.FlowId.HasValue)
            tags.Add(new MessageTag { Name = "flow_id", Value = SanitizeTag(request.FlowId.Value.ToString("N")) });

        var sendRequest = new Amazon.SimpleEmailV2.Model.SendEmailRequest
        {
            FromEmailAddress = from,
            Destination = new Destination
            {
                ToAddresses = [request.ToEmail.Trim()]
            },
            Content = new EmailContent
            {
                Simple = new Message
                {
                    Subject = new Content { Data = request.Subject },
                    Body = new Body
                    {
                        Html = new Content { Data = request.HtmlBody }
                    }
                }
            },
            EmailTags = tags,
        };

        if (!string.IsNullOrWhiteSpace(_options.ConfigurationSetName))
            sendRequest.ConfigurationSetName = _options.ConfigurationSetName;

        try
        {
            var response = await client.SendEmailAsync(sendRequest, cancellationToken);
            var messageId = response.MessageId ?? Guid.NewGuid().ToString("N");

            try
            {
                db.OutboundEmailMessages.Add(new OutboundEmailMessage
                {
                    Id = Guid.NewGuid(),
                    UserId = request.UserId,
                    SubscriberId = request.SubscriberId,
                    CampaignId = request.CampaignId,
                    FlowId = request.FlowId,
                    Source = request.Source,
                    ToEmail = request.ToEmail.Trim().ToLowerInvariant(),
                    Subject = request.Subject,
                    SesMessageId = messageId,
                    Status = "sent",
                    SentAt = DateTime.UtcNow,
                });
                await db.SaveChangesAsync(cancellationToken);
            }
            catch (Exception ex)
            {
                logger.LogWarning(ex,
                    "SES message {MessageId} was sent but outbound tracking could not be saved. Restart the API to apply SES database tables.",
                    messageId);
            }

            logger.LogInformation(
                "SES sent {Source} message {MessageId} to {Email} for user {UserId}",
                request.Source, messageId, request.ToEmail, request.UserId);

            return messageId;
        }
        catch (AmazonSimpleEmailServiceV2Exception ex)
        {
            logger.LogError(ex, "SES send failed to {Email}", request.ToEmail);
            throw new InvalidOperationException(DescribeSendFailure(ex, request.ToEmail).Detail, ex);
        }
    }

    /// <summary>Maps AWS/SES errors to short user-facing copy for the settings test-send UI.</summary>
    public static (string Title, string Detail) DescribeSendFailure(Exception ex, string? recipient = null)
    {
        var msg = ex.InnerException?.Message ?? ex.Message;
        if (ex is InvalidOperationException && ex.Message.StartsWith("Amazon SES", StringComparison.OrdinalIgnoreCase) == false
            && !string.IsNullOrWhiteSpace(ex.Message))
            msg = ex.Message;

        if (msg.Contains("not verified", StringComparison.OrdinalIgnoreCase)
            || (ex.InnerException?.Message?.Contains("not verified", StringComparison.OrdinalIgnoreCase) ?? false))
        {
            var awsMsg = ex.InnerException?.Message ?? msg;
            var identity = ExtractFailedIdentity(awsMsg) ?? recipient ?? "this address";
            return (
                "Email address not verified",
                $"{identity} is not verified in your Amazon SES account. While SES is in sandbox mode, both the From address and every recipient must be verified under Verified identities in the AWS console.");
        }

        if (msg.Contains("ConfigurationSet", StringComparison.OrdinalIgnoreCase))
        {
            return (
                "Configuration set not found",
                "The SES configuration set in your app settings does not exist in AWS. Create it in the SES console or clear AmazonSes:ConfigurationSetName in appsettings.json.");
        }

        if (msg.Contains("not configured", StringComparison.OrdinalIgnoreCase))
        {
            return (
                "SES not configured",
                "Amazon SES is not fully configured in this app. Check AmazonSes settings in appsettings.json and restart the API.");
        }

        return (
            "SES test send failed",
            "The test email could not be sent. Check that your AWS credentials, verified identities, and recipient address are correct.");
    }

    private static string? ExtractFailedIdentity(string message)
    {
        var idx = message.LastIndexOf(':');
        if (idx < 0 || idx >= message.Length - 1) return null;
        var tail = message[(idx + 1)..].Trim();
        return string.IsNullOrWhiteSpace(tail) ? null : tail;
    }

    private IAmazonSimpleEmailServiceV2 GetClient()
    {
        if (_client is not null) return _client;

        var region = RegionEndpoint.GetBySystemName(_options.Region);
        var config = new AmazonSimpleEmailServiceV2Config { RegionEndpoint = region };

        if (!string.IsNullOrWhiteSpace(_options.AccessKeyId)
            && !string.IsNullOrWhiteSpace(_options.SecretAccessKey))
        {
            var credentials = new BasicAWSCredentials(_options.AccessKeyId, _options.SecretAccessKey);
            _client = new AmazonSimpleEmailServiceV2Client(credentials, config);
        }
        else
        {
            _client = new AmazonSimpleEmailServiceV2Client(config);
        }

        return _client;
    }

    private static string SanitizeTag(string value)
    {
        if (string.IsNullOrWhiteSpace(value)) return "none";
        var cleaned = new string(value.Where(c => char.IsLetterOrDigit(c) || c is '-' or '_' or '.').ToArray());
        return cleaned.Length == 0 ? "none" : cleaned[..Math.Min(cleaned.Length, 256)];
    }
}
