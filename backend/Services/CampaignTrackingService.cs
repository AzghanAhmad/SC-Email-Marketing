using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.WebUtilities;

namespace ScribeCount.Email.Api.Services;

public class CampaignTrackingService(IConfiguration configuration)
{
    private readonly byte[] _key = Encoding.UTF8.GetBytes(
        configuration["Jwt:Key"] ?? "ScribeCount-Dev-Secret-Key-Change-In-Production-32chars!");

    public string PublicAppBaseUrl =>
        (configuration["App:PublicBaseUrl"] ?? "http://localhost:4200").TrimEnd('/');

    public string PublicApiBaseUrl =>
        (configuration["App:ApiBaseUrl"] ?? "http://localhost:5065/api/v1").TrimEnd('/');

    public string CreateToken(Guid campaignId, Guid subscriberId, Guid userId)
    {
        var payload = $"{campaignId:N}|{subscriberId:N}|{userId:N}";
        var payloadBytes = Encoding.UTF8.GetBytes(payload);
        var signature = ComputeHmac(payloadBytes);
        return $"{WebEncoders.Base64UrlEncode(payloadBytes)}.{WebEncoders.Base64UrlEncode(signature)}";
    }

    public bool TryParseToken(string? token, out Guid campaignId, out Guid subscriberId, out Guid userId)
    {
        campaignId = Guid.Empty;
        subscriberId = Guid.Empty;
        userId = Guid.Empty;

        if (string.IsNullOrWhiteSpace(token)) return false;
        var parts = token.Split('.', 2);
        if (parts.Length != 2) return false;

        byte[] payloadBytes;
        byte[] signatureBytes;
        try
        {
            payloadBytes = WebEncoders.Base64UrlDecode(parts[0]);
            signatureBytes = WebEncoders.Base64UrlDecode(parts[1]);
        }
        catch
        {
            return false;
        }

        var expected = ComputeHmac(payloadBytes);
        if (!CryptographicOperations.FixedTimeEquals(expected, signatureBytes)) return false;

        var payload = Encoding.UTF8.GetString(payloadBytes);
        var segments = payload.Split('|');
        if (segments.Length != 3) return false;

        return Guid.TryParse(segments[0], out campaignId)
            && Guid.TryParse(segments[1], out subscriberId)
            && Guid.TryParse(segments[2], out userId);
    }

    public string UnsubscribeUrl(string token) => $"{PublicAppBaseUrl}/unsubscribe?token={Uri.EscapeDataString(token)}";

    public string ViewInBrowserUrl(string token) => $"{PublicAppBaseUrl}/email/view?token={Uri.EscapeDataString(token)}";

    public string OpenTrackingUrl(string token) => $"{PublicApiBaseUrl}/public/campaigns/open.gif?token={Uri.EscapeDataString(token)}";

    private byte[] ComputeHmac(byte[] payload)
    {
        using var hmac = new HMACSHA256(_key);
        return hmac.ComputeHash(payload);
    }
}
