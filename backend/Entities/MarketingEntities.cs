namespace ScribeCount.Email.Api.Entities;

public class AudienceFolder
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    /// <summary>list or segment</summary>
    public string Kind { get; set; } = "list";
    public string Name { get; set; } = "";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public User User { get; set; } = null!;
}

public class AudienceList
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid? FolderId { get; set; }
    public string Name { get; set; } = "";
    public string Description { get; set; } = "";
    public string Color { get; set; } = "#3b82f6";
    public string OptInMethod { get; set; } = "Double";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public User User { get; set; } = null!;
    public AudienceFolder? Folder { get; set; }
}

public class AudienceSegmentItem
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid? FolderId { get; set; }
    public string Name { get; set; } = "";
    public string Description { get; set; } = "";
    public string Color { get; set; } = "#10b981";
    public string RuleType { get; set; } = "active";
    /// <summary>JSON for rule params e.g. {"listId":"..."}</summary>
    public string RuleConfigJson { get; set; } = "{}";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public User User { get; set; } = null!;
    public AudienceFolder? Folder { get; set; }
}

public class EmailTemplate
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Name { get; set; } = "";
    public string Category { get; set; } = "";
    public string PreviewCode { get; set; } = "NL";
    public string Description { get; set; } = "";
    public string SubjectLine { get; set; } = "";
    public string PreviewText { get; set; } = "";
    public string HtmlBody { get; set; } = "";
    public string IconKey { get; set; } = "mail";
    public string SuggestedCampaignType { get; set; } = "newsletter";
    public bool IsCustom { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public User User { get; set; } = null!;
}

public class ContentBlock
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Name { get; set; } = "";
    public string BlockType { get; set; } = "";
    public string Description { get; set; } = "";
    public string IconKey { get; set; } = "book";
    public string? HtmlBody { get; set; }
    public int UsedInCount { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public User User { get; set; } = null!;
}

public class BrandProfile
{
    public Guid UserId { get; set; }
    public string ColorsJson { get; set; } = "[]";
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public User User { get; set; } = null!;
}

public class BrandAsset
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Name { get; set; } = "";
    public string FileType { get; set; } = "";
    public long SizeBytes { get; set; }
    public string IconKey { get; set; } = "image";
    public string? StoragePath { get; set; }
    public string? MimeType { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public User User { get; set; } = null!;
}

public class SignUpForm
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Name { get; set; } = "";
    public string FormType { get; set; } = "Popup";
    public string Status { get; set; } = "draft";
    public Guid? TargetListId { get; set; }
    public string TargetListName { get; set; } = "";
    public int Submissions { get; set; }
    public decimal ConversionRate { get; set; }
    public string ContentJson { get; set; } = "{}";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public User User { get; set; } = null!;
}

public class LandingPage
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Name { get; set; } = "";
    public string Slug { get; set; } = "";
    public string Status { get; set; } = "draft";
    public string ThemeGradient { get; set; } = "linear-gradient(135deg,#1e3a5f,#2d5a87)";
    public string IconKey { get; set; } = "book";
    public int Visits { get; set; }
    public int Signups { get; set; }
    public string ContentJson { get; set; } = "{}";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public User User { get; set; } = null!;
}

public class GrowthToolConfig
{
    public Guid UserId { get; set; }
    public string ToolKey { get; set; } = "";
    public string ConfigJson { get; set; } = "{}";
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public User User { get; set; } = null!;
}
