namespace ScribeCount.Email.Api.Configuration;

public class SenderOptions
{
    public const string SectionName = "Sender";

    public int OtpTtlMinutes { get; set; } = 10;

    public int OtpResendSeconds { get; set; } = 60;

    public int OtpMaxAttempts { get; set; } = 5;
}
