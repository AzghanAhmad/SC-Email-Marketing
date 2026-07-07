using System.Globalization;
using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using ScribeCount.Email.Api.Configuration;
using ScribeCount.Email.Api.Data;
using ScribeCount.Email.Api.Entities;

namespace ScribeCount.Email.Api.Services;

public class SnsWebhookService(
    AppDbContext db,
    IOptions<SesOptions> options,
    IHttpClientFactory httpClientFactory,
    ILogger<SnsWebhookService> logger)
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    public async Task HandleAsync(string body, CancellationToken cancellationToken = default)
    {
        using var doc = JsonDocument.Parse(body);
        var root = doc.RootElement;
        var type = root.TryGetProperty("Type", out var typeEl) ? typeEl.GetString() : null;

        if (string.Equals(type, "SubscriptionConfirmation", StringComparison.OrdinalIgnoreCase))
        {
            await ConfirmSubscriptionAsync(root, cancellationToken);
            return;
        }

        if (string.Equals(type, "Notification", StringComparison.OrdinalIgnoreCase))
        {
            if (options.Value.VerifySnsSignatures)
                await EnsureValidSignatureAsync(root, cancellationToken);

            var message = root.TryGetProperty("Message", out var msgEl) ? msgEl.GetString() : null;
            if (string.IsNullOrWhiteSpace(message))
            {
                logger.LogWarning("SNS notification missing Message body");
                return;
            }

            await ProcessSesNotificationAsync(message, cancellationToken);
            return;
        }

        if (string.Equals(type, "UnsubscribeConfirmation", StringComparison.OrdinalIgnoreCase))
        {
            logger.LogInformation("SNS unsubscribe confirmation received");
            return;
        }

        // Direct SES event payload (some proxies unwrap SNS)
        if (root.TryGetProperty("notificationType", out _) || root.TryGetProperty("eventType", out _))
        {
            await ProcessSesNotificationAsync(body, cancellationToken);
        }
    }

    private async Task ConfirmSubscriptionAsync(JsonElement root, CancellationToken cancellationToken)
    {
        if (!root.TryGetProperty("SubscribeURL", out var urlEl))
            return;

        var url = urlEl.GetString();
        if (string.IsNullOrWhiteSpace(url) || !url.StartsWith("https://", StringComparison.OrdinalIgnoreCase))
        {
            logger.LogWarning("Invalid SNS SubscribeURL");
            return;
        }

        var client = httpClientFactory.CreateClient("sns");
        var response = await client.GetAsync(url, cancellationToken);
        logger.LogInformation("SNS subscription confirmation HTTP {Status}", (int)response.StatusCode);
    }

    private async Task EnsureValidSignatureAsync(JsonElement root, CancellationToken cancellationToken)
    {
        var signatureVersion = root.TryGetProperty("SignatureVersion", out var sv) ? sv.GetString() : "1";
        if (signatureVersion != "1")
            throw new InvalidOperationException($"Unsupported SNS SignatureVersion: {signatureVersion}");

        var certUrl = root.TryGetProperty("SigningCertURL", out var cu) ? cu.GetString() : null;
        var signature = root.TryGetProperty("Signature", out var sig) ? sig.GetString() : null;
        var type = root.GetProperty("Type").GetString() ?? "";

        if (string.IsNullOrWhiteSpace(certUrl) || string.IsNullOrWhiteSpace(signature))
            throw new InvalidOperationException("SNS message missing signature fields.");

        if (!Uri.TryCreate(certUrl, UriKind.Absolute, out var certUri)
            || certUri.Scheme != Uri.UriSchemeHttps
            || !certUri.Host.EndsWith(".amazonaws.com", StringComparison.OrdinalIgnoreCase))
        {
            throw new InvalidOperationException("SNS SigningCertURL is not a trusted Amazon URL.");
        }

        var client = httpClientFactory.CreateClient("sns");
        var certBytes = await client.GetByteArrayAsync(certUri, cancellationToken);
        using var cert = X509CertificateLoader.LoadCertificate(certBytes);
        using var rsa = cert.GetRSAPublicKey()
            ?? throw new InvalidOperationException("SNS certificate has no RSA key.");

        var stringToSign = BuildStringToSign(root, type);
        var signatureBytes = Convert.FromBase64String(signature);
        if (!rsa.VerifyData(Encoding.UTF8.GetBytes(stringToSign), signatureBytes, HashAlgorithmName.SHA1, RSASignaturePadding.Pkcs1))
            throw new InvalidOperationException("SNS signature verification failed.");
    }

    private static string BuildStringToSign(JsonElement root, string type)
    {
        var sb = new StringBuilder();
        void Append(string key)
        {
            if (!root.TryGetProperty(key, out var el)) return;
            sb.Append(key).Append('\n').Append(el.GetString()).Append('\n');
        }

        if (type is "Notification")
        {
            Append("Message");
            Append("MessageId");
            if (root.TryGetProperty("Subject", out _))
                Append("Subject");
            Append("Timestamp");
            Append("TopicArn");
            Append("Type");
        }
        else
        {
            Append("Message");
            Append("MessageId");
            Append("SubscribeURL");
            Append("Timestamp");
            Append("Token");
            Append("TopicArn");
            Append("Type");
        }

        return sb.ToString();
    }

    private async Task ProcessSesNotificationAsync(string messageJson, CancellationToken cancellationToken)
    {
        using var doc = JsonDocument.Parse(messageJson);
        var root = doc.RootElement;

        var notificationType = root.TryGetProperty("notificationType", out var nt)
            ? nt.GetString()
            : root.TryGetProperty("eventType", out var et) ? et.GetString() : null;

        if (string.IsNullOrWhiteSpace(notificationType))
        {
            logger.LogWarning("SES notification missing notificationType");
            return;
        }

        var mail = root.TryGetProperty("mail", out var mailEl) ? mailEl : default;
        var sesMessageId = mail.ValueKind == JsonValueKind.Object && mail.TryGetProperty("messageId", out var mid)
            ? mid.GetString() ?? ""
            : "";

        var tags = ParseTags(mail);
        Guid? userId = ParseGuidTag(tags, "user_id");
        Guid? subscriberId = ParseGuidTag(tags, "subscriber_id");
        Guid? campaignId = ParseGuidTag(tags, "campaign_id");
        Guid? flowId = ParseGuidTag(tags, "flow_id");
        var source = tags.GetValueOrDefault("source") ?? "sns";

        OutboundEmailMessage? outbound = null;
        if (!string.IsNullOrWhiteSpace(sesMessageId))
        {
            outbound = await db.OutboundEmailMessages
                .FirstOrDefaultAsync(m => m.SesMessageId == sesMessageId, cancellationToken);
            if (outbound is not null)
            {
                userId ??= outbound.UserId;
                subscriberId ??= outbound.SubscriberId;
                campaignId ??= outbound.CampaignId;
                flowId ??= outbound.FlowId;
                source = outbound.Source;
            }
        }

        var eventType = notificationType.ToLowerInvariant() switch
        {
            "bounce" => "bounce",
            "complaint" => "complaint",
            "delivery" => "delivery",
            _ => notificationType.ToLowerInvariant()
        };

        var recipients = ExtractRecipients(root, eventType);
        var bounceType = "";
        var diagnostic = "";

        if (eventType == "bounce" && root.TryGetProperty("bounce", out var bounce))
        {
            bounceType = bounce.TryGetProperty("bounceType", out var bt) ? bt.GetString() ?? "" : "";
            if (bounce.TryGetProperty("bouncedRecipients", out var br) && br.ValueKind == JsonValueKind.Array)
            {
                foreach (var r in br.EnumerateArray())
                {
                    if (r.TryGetProperty("diagnosticCode", out var dc))
                    {
                        diagnostic = dc.GetString() ?? "";
                        break;
                    }
                }
            }
        }

        var occurredAt = DateTime.UtcNow;
        if (mail.ValueKind == JsonValueKind.Object && mail.TryGetProperty("timestamp", out var ts)
            && DateTime.TryParse(ts.GetString(), CultureInfo.InvariantCulture,
                DateTimeStyles.AssumeUniversal | DateTimeStyles.AdjustToUniversal, out var parsed))
        {
            occurredAt = parsed;
        }

        if (recipients.Count == 0 && outbound is not null)
            recipients.Add(outbound.ToEmail);

        foreach (var email in recipients.Distinct(StringComparer.OrdinalIgnoreCase))
        {
            var normalized = email.Trim().ToLowerInvariant();
            db.DeliveryEvents.Add(new DeliveryEvent
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                SubscriberId = subscriberId,
                CampaignId = campaignId,
                FlowId = flowId,
                OutboundMessageId = outbound?.Id,
                EventType = eventType,
                BounceType = bounceType,
                Email = normalized,
                SesMessageId = sesMessageId,
                Source = source,
                DiagnosticCode = diagnostic,
                RawPayload = messageJson.Length > 50_000 ? messageJson[..50_000] : messageJson,
                OccurredAt = occurredAt,
                ReceivedAt = DateTime.UtcNow,
            });

            await ApplySuppressionAsync(userId, subscriberId, normalized, eventType, bounceType, cancellationToken);
        }

        if (outbound is not null)
        {
            outbound.Status = eventType switch
            {
                "delivery" => "delivered",
                "bounce" => string.Equals(bounceType, "Permanent", StringComparison.OrdinalIgnoreCase)
                    ? "bounced"
                    : "soft_bounced",
                "complaint" => "complained",
                _ => outbound.Status
            };
            if (eventType == "delivery") outbound.DeliveredAt = occurredAt;
            if (eventType == "bounce") outbound.BouncedAt = occurredAt;
            if (eventType == "complaint") outbound.ComplainedAt = occurredAt;
        }

        await db.SaveChangesAsync(cancellationToken);
        logger.LogInformation(
            "Processed SES {EventType} for message {MessageId} ({Count} recipient(s))",
            eventType, sesMessageId, recipients.Count);
    }

    private async Task ApplySuppressionAsync(
        Guid? userId,
        Guid? subscriberId,
        string email,
        string eventType,
        string bounceType,
        CancellationToken cancellationToken)
    {
        Subscriber? subscriber = null;
        if (subscriberId.HasValue)
            subscriber = await db.Subscribers.FirstOrDefaultAsync(s => s.Id == subscriberId.Value, cancellationToken);

        if (subscriber is null && userId.HasValue)
        {
            subscriber = await db.Subscribers.FirstOrDefaultAsync(
                s => s.UserId == userId.Value && s.Email.ToLower() == email,
                cancellationToken);
        }

        if (subscriber is null)
        {
            subscriber = await db.Subscribers.FirstOrDefaultAsync(
                s => s.Email.ToLower() == email,
                cancellationToken);
        }

        if (subscriber is null) return;

        if (eventType == "complaint")
        {
            subscriber.Status = "complained";
            subscriber.Note = AppendNote(subscriber.Note, "Suppressed: spam complaint via SES/SNS");
            return;
        }

        if (eventType == "bounce"
            && string.Equals(bounceType, "Permanent", StringComparison.OrdinalIgnoreCase))
        {
            subscriber.Status = "bounced";
            subscriber.Note = AppendNote(subscriber.Note, "Suppressed: hard bounce via SES/SNS");
        }
    }

    private static string AppendNote(string existing, string addition)
    {
        if (string.IsNullOrWhiteSpace(existing)) return addition;
        if (existing.Contains(addition, StringComparison.OrdinalIgnoreCase)) return existing;
        return $"{existing} | {addition}";
    }

    private static Dictionary<string, string> ParseTags(JsonElement mail)
    {
        var tags = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
        if (mail.ValueKind != JsonValueKind.Object || !mail.TryGetProperty("tags", out var tagsEl))
            return tags;

        if (tagsEl.ValueKind != JsonValueKind.Object) return tags;

        foreach (var prop in tagsEl.EnumerateObject())
        {
            if (prop.Value.ValueKind == JsonValueKind.Array && prop.Value.GetArrayLength() > 0)
                tags[prop.Name] = prop.Value[0].GetString() ?? "";
            else if (prop.Value.ValueKind == JsonValueKind.String)
                tags[prop.Name] = prop.Value.GetString() ?? "";
        }

        return tags;
    }

    private static Guid? ParseGuidTag(Dictionary<string, string> tags, string key)
    {
        if (!tags.TryGetValue(key, out var value) || string.IsNullOrWhiteSpace(value))
            return null;
        return Guid.TryParseExact(value, "N", out var g) || Guid.TryParse(value, out g) ? g : null;
    }

    private static List<string> ExtractRecipients(JsonElement root, string eventType)
    {
        var list = new List<string>();

        void FromArray(JsonElement parent, string arrayName, string emailProp)
        {
            if (!parent.TryGetProperty(arrayName, out var arr) || arr.ValueKind != JsonValueKind.Array)
                return;
            foreach (var item in arr.EnumerateArray())
            {
                if (item.ValueKind == JsonValueKind.String)
                    list.Add(item.GetString() ?? "");
                else if (item.TryGetProperty(emailProp, out var em))
                    list.Add(em.GetString() ?? "");
            }
        }

        if (eventType == "bounce" && root.TryGetProperty("bounce", out var bounce))
            FromArray(bounce, "bouncedRecipients", "emailAddress");
        else if (eventType == "complaint" && root.TryGetProperty("complaint", out var complaint))
            FromArray(complaint, "complainedRecipients", "emailAddress");
        else if (eventType == "delivery" && root.TryGetProperty("delivery", out var delivery))
            FromArray(delivery, "recipients", "emailAddress");

        if (list.Count == 0
            && root.TryGetProperty("mail", out var mail)
            && mail.TryGetProperty("destination", out var dest)
            && dest.ValueKind == JsonValueKind.Array)
        {
            foreach (var d in dest.EnumerateArray())
                list.Add(d.GetString() ?? "");
        }

        return list.Where(e => !string.IsNullOrWhiteSpace(e)).ToList();
    }
}
