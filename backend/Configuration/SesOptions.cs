namespace ScribeCount.Email.Api.Configuration;

public class SesOptions
{
    public const string SectionName = "AmazonSes";

    /// <summary>When true, campaigns/flows/platform mail send via SES v2.</summary>
    public bool Enabled { get; set; }

    public string Region { get; set; } = "us-east-1";

    /// <summary>Optional. If empty, uses the default AWS credential chain (env vars / IAM role).</summary>
    public string AccessKeyId { get; set; } = "";

    public string SecretAccessKey { get; set; } = "";

    /// <summary>Verified SES identity (email or domain address), e.g. noreply@yourdomain.com</summary>
    public string FromEmail { get; set; } = "";

    public string FromName { get; set; } = "ScribeCount Email";

    /// <summary>SES configuration set that publishes bounce/complaint/delivery to SNS.</summary>
    public string ConfigurationSetName { get; set; } = "";

    /// <summary>Verify SNS message signatures on the webhook (recommended in production).</summary>
    public bool VerifySnsSignatures { get; set; } = true;

    public bool IsConfigured =>
        Enabled
        && !string.IsNullOrWhiteSpace(FromEmail)
        && !string.IsNullOrWhiteSpace(Region);
}
