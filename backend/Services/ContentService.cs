using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using ScribeCount.Email.Api.Data;
using ScribeCount.Email.Api.DTOs;
using ScribeCount.Email.Api.Entities;

namespace ScribeCount.Email.Api.Services;

public class ContentService(AppDbContext db, IWebHostEnvironment env)
{
    private static readonly JsonSerializerOptions JsonOptions = new() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
    private const long MaxAssetBytes = 10 * 1024 * 1024;

    private static readonly HashSet<string> AllowedAssetExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".pdf"
    };

    private record TemplateDef(
        string Name, string Category, string PreviewCode, string Description,
        string SubjectLine, string PreviewText, string IconKey, string SuggestedCampaignType);

    private static readonly TemplateDef[] TemplateCatalog =
    [
        new("Newsletter Classic", "Newsletter", "NL", "Clean newsletter layout with header, body, and footer",
            "From the Author's Desk — {{month}} update", "",
            "mail", "newsletter"),
        new("Book Launch", "Launch", "BL", "High-impact launch announcement with CTA button",
            "It's here — {{book_title}} is out now!", "",
            "book", "book-launch"),
        new("Welcome Email", "Automation", "WE", "Warm welcome email for new subscribers",
            "Welcome to the inner circle, {{first_name}}", "",
            "users", "newsletter"),
        new("Story Excerpt", "Content", "SE", "Share a chapter or excerpt with your readers",
            "A chapter preview just for you", "",
            "file", "newsletter"),
        new("Event Invite", "Event", "EV", "Invite readers to a signing, webinar, or live event",
            "You're invited — live Q&A this Saturday", "",
            "calendar", "event"),
        new("Re-engagement", "Automation", "RE", "Win back inactive subscribers with a personal touch",
            "I've missed you, {{first_name}}", "",
            "refresh", "backlist"),
        new("ARC Invitation", "ARC", "BL", "Recruit advance readers from your engaged segment",
            "You're invited to join my ARC team", "",
            "star", "arc-invite"),
        new("New Release Notification", "Launch", "NL", "Targeted notification for backlist and series readers",
            "New from me — if you loved my earlier books…", "",
            "book", "new-release"),
        new("Order Confirmation", "Transaction", "NL", "Immediate receipt confirming the purchase",
            "Your order is confirmed — thank you!", "",
            "check", "newsletter"),
        new("Review Request", "Transaction", "SF", "Dedicated standalone review ask with direct platform links",
            "Would you leave a quick review?", "",
            "star", "newsletter"),
    ];

    private record BlockDef(string Name, string BlockType, string Description, string IconKey);

    private static readonly BlockDef[] BlockCatalog =
    [
        new("Book Card", "Book Card", "Cover, title, tagline, and buy button for a single title", "book"),
        new("Series Reading Order", "Series Reading Order", "Numbered book list with covers for series readers", "blocks"),
        new("Pull Quote", "Pull Quote", "Styled reader review or excerpt with accent border", "star"),
        new("CTA Button", "CTA Button", "Centered call-to-action button with custom label and URL", "link"),
        new("Author Bio", "Author Bio", "Headshot, short bio, and social links", "users"),
        new("Social Follow Row", "Social Follow Row", "Follow icons for Instagram, Facebook, Goodreads, and more", "globe"),
    ];

    private record WebsiteTemplateDef(
        string Id, string Name, string Category, string PreviewCode, string Description, string IconKey,
        string TemplateKind, string? FormType, string? ThemeGradient, string SuggestedName,
        string Headline, string BodyDescription, string ButtonText, string ThankYouMessage, string DefaultStatus);

    private static readonly WebsiteTemplateDef[] WebsiteTemplateCatalog =
    [
        new("signup-reader-magnet-popup", "Reader Magnet Popup", "Sign-up Form", "RM", "Popup form offering a free chapter or short story",
            "form", "signup-form", "Popup", null, "Reader Magnet Popup",
            "Get your free chapter", "Join my reader list for exclusive excerpts, launch news, and giveaways.",
            "Send me the freebie", "Thanks — check your inbox for your download link!", "draft"),
        new("signup-newsletter-flyout", "Newsletter Flyout", "Sign-up Form", "NF", "Bottom flyout banner for quick email capture",
            "book", "signup-form", "Flyout", null, "Newsletter Flyout",
            "Never miss a new release", "Short updates when a book goes live — no spam, just stories.",
            "Join the list", "You're in! Welcome to the inner circle.", "draft"),
        new("signup-vip-embedded", "VIP Embedded Form", "Sign-up Form", "VIP", "Embedded section for your website or blog",
            "landing", "signup-form", "Embedded", null, "VIP Readers Embedded Form",
            "Become a VIP reader", "Early chapters, ARC spots, and giveaways reserved for subscribers.",
            "Subscribe free", "Welcome aboard — your first exclusive update is on the way.", "draft"),
        new("signup-launch-full-page", "Launch Signup Page", "Sign-up Form", "LS", "Full-page signup for a book launch waitlist",
            "trend", "signup-form", "Full Page", null, "Launch Waitlist",
            "The wait is almost over", "Be first to know when the next book drops and get launch-week bonuses.",
            "Join the waitlist", "You're on the list — I'll email you the moment it's live.", "draft"),
        new("landing-reader-magnet", "Free Reader Magnet", "Landing Page", "FR", "High-converting page for a free novella or sample",
            "book", "landing-page", null, "linear-gradient(135deg,#1e3a5f,#2d5a87)", "Free Reader Magnet",
            "Your free reader magnet", "Download the exclusive short story and join thousands of readers who get my updates first.",
            "Get my free book", "You're in! Check your inbox for the download link.", "draft"),
        new("landing-book-launch", "Book Launch Page", "Landing Page", "BL", "Bold launch page with buy CTA and bonus offer",
            "book", "landing-page", null, "linear-gradient(135deg,#991b1b,#dc2626)", "Book Launch Page",
            "It's release day!", "Celebrate the launch with bonus content available this week only for new readers.",
            "Buy the book", "Thank you for celebrating launch day with me!", "draft"),
        new("landing-arc-team", "ARC Team Recruit", "Landing Page", "ARC", "Recruit advance readers for your next title",
            "star", "landing-page", null, "linear-gradient(135deg,#4c1d95,#6d28d9)", "ARC Team Signup",
            "Join my ARC team", "Read early copies and help shape the final edit before publication.",
            "Apply for ARC access", "Application received — I'll be in touch with next steps.", "draft"),
        new("landing-preorder-bonus", "Pre-order Bonus", "Landing Page", "PO", "Capture emails with an exclusive pre-order incentive",
            "trend", "landing-page", null, "linear-gradient(135deg,#92400e,#d97706)", "Pre-order Bonus Page",
            "Pre-order bonus inside", "Reserve your copy now and unlock an exclusive deleted scene.",
            "Claim pre-order bonus", "Bonus unlocked — details are heading to your inbox.", "draft"),
    ];

    private static readonly BrandColorDto[] DefaultColors =
    [
        new("Primary", "#1e3a5f"),
        new("Accent", "#3b82f6"),
        new("Success", "#10b981"),
        new("Warning", "#f59e0b"),
        new("Text", "#0f172a"),
        new("Muted", "#94a3b8"),
    ];

    private const string CustomTemplateShell = """
        <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#0f172a;">
        <!-- Add reusable blocks below -->
        </div>
        """;

    public async Task<ContentBundleDto> GetBundleAsync(Guid userId)
    {
        await EnsureTemplatesAsync(userId);
        await EnsureBlocksAsync(userId);
        await EnsureBrandProfileAsync(userId);

        var templates = await db.EmailTemplates.Where(t => t.UserId == userId)
            .OrderBy(t => t.Category).ThenBy(t => t.Name).ToListAsync();
        var blocks = await db.ContentBlocks.Where(b => b.UserId == userId)
            .OrderByDescending(b => b.CreatedAt).ToListAsync();
        var profile = await db.BrandProfiles.FindAsync(userId);
        var assets = await db.BrandAssets.Where(a => a.UserId == userId)
            .OrderByDescending(a => a.CreatedAt).ToListAsync();

        var colors = ParseColors(profile?.ColorsJson);

        return new ContentBundleDto(
            templates.Select(MapTemplate).ToList(),
            blocks.Select(MapBlock).ToList(),
            colors,
            assets.Select(MapAsset).ToList(),
            GetWebsiteTemplates()
        );
    }

    public WebsiteTemplateDto? GetWebsiteTemplate(string id) =>
        GetWebsiteTemplates().FirstOrDefault(t => t.Id.Equals(id, StringComparison.OrdinalIgnoreCase));

    public static List<WebsiteTemplateDto> GetWebsiteTemplates() =>
        WebsiteTemplateCatalog.Select(MapWebsiteTemplate).ToList();

    private static WebsiteTemplateDto MapWebsiteTemplate(WebsiteTemplateDef d) => new(
        d.Id, d.Name, d.Category, d.PreviewCode, d.Description, WebsiteTemplateBodies.Get(d.Id), d.IconKey,
        d.TemplateKind, d.FormType, d.ThemeGradient, d.SuggestedName,
        d.Headline, d.BodyDescription, d.ButtonText, d.ThankYouMessage, d.DefaultStatus);

    public async Task<EmailTemplateDto?> GetTemplateAsync(Guid userId, Guid id)
    {
        await EnsureTemplatesAsync(userId);
        var template = await db.EmailTemplates.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
        return template is null ? null : MapTemplate(template);
    }

    public async Task<EmailTemplateDto> CreateCustomTemplateAsync(Guid userId, CreateCustomTemplateRequest request)
    {
        var name = request.Name.Trim();
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Template name is required.");

        var template = new EmailTemplate
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Name = name,
            Category = "Custom",
            PreviewCode = "CT",
            Description = request.Description?.Trim() ?? "Custom template built from reusable blocks",
            SubjectLine = request.SubjectLine?.Trim() ?? "",
            PreviewText = "",
            HtmlBody = CustomTemplateShell,
            IconKey = "blocks",
            SuggestedCampaignType = "newsletter",
            IsCustom = true,
            CreatedAt = DateTime.UtcNow
        };
        db.EmailTemplates.Add(template);
        await db.SaveChangesAsync();
        return MapTemplate(template);
    }

    public async Task<EmailTemplateDto?> UpdateTemplateAsync(Guid userId, Guid id, UpdateEmailTemplateRequest request)
    {
        var template = await db.EmailTemplates.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
        if (template is null || !template.IsCustom) return null;

        if (!string.IsNullOrWhiteSpace(request.Name))
            template.Name = request.Name.Trim();
        if (request.Description is not null)
            template.Description = request.Description.Trim();
        if (request.SubjectLine is not null)
            template.SubjectLine = request.SubjectLine.Trim();
        if (request.HtmlBody is not null)
            template.HtmlBody = request.HtmlBody;

        await db.SaveChangesAsync();
        return MapTemplate(template);
    }

    public async Task<bool> DeleteTemplateAsync(Guid userId, Guid id)
    {
        var template = await db.EmailTemplates.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
        if (template is null || !template.IsCustom) return false;

        db.EmailTemplates.Remove(template);
        await db.SaveChangesAsync();
        return true;
    }

    public async Task<EmailTemplateDto?> AppendBlockToTemplateAsync(Guid userId, Guid templateId, Guid blockId, AppendBlockToTemplateRequest? request = null)
    {
        var template = await db.EmailTemplates.FirstOrDefaultAsync(t => t.Id == templateId && t.UserId == userId);
        if (template is null || !template.IsCustom) return null;

        var block = await db.ContentBlocks.FirstOrDefaultAsync(b => b.Id == blockId && b.UserId == userId);
        if (block is null) return null;

        var blockHtml = ResolveBlockHtml(block);
        var separator = "\n<!-- block:" + block.Name + " -->\n";

        if (request?.InsertAtStart == true)
            template.HtmlBody = blockHtml + separator + (template.HtmlBody ?? "");
        else
            template.HtmlBody = (template.HtmlBody ?? "") + separator + blockHtml;

        block.UsedInCount += 1;
        await db.SaveChangesAsync();
        return MapTemplate(template);
    }

    public async Task<ContentBlockDto> CreateBlockAsync(Guid userId, CreateContentBlockRequest request)
    {
        var blockType = request.BlockType.Trim();
        var name = request.Name.Trim();
        var block = new ContentBlock
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Name = name,
            BlockType = blockType,
            Description = request.Description?.Trim() ?? "",
            IconKey = string.IsNullOrWhiteSpace(request.IconKey) ? ResolveIconKey(blockType) : request.IconKey,
            HtmlBody = ContentBlockBodies.Get(blockType, name),
            UsedInCount = 0,
            CreatedAt = DateTime.UtcNow
        };
        db.ContentBlocks.Add(block);
        await db.SaveChangesAsync();
        return MapBlock(block);
    }

    public async Task<ContentBlockDto?> UpdateBlockAsync(Guid userId, Guid id, UpdateContentBlockRequest request)
    {
        var block = await db.ContentBlocks.FirstOrDefaultAsync(b => b.Id == id && b.UserId == userId);
        if (block is null) return null;

        if (!string.IsNullOrWhiteSpace(request.Name))
            block.Name = request.Name.Trim();
        if (!string.IsNullOrWhiteSpace(request.BlockType))
        {
            block.BlockType = request.BlockType.Trim();
            if (string.IsNullOrWhiteSpace(request.IconKey))
                block.IconKey = ResolveIconKey(block.BlockType);
        }
        if (request.Description is not null)
            block.Description = request.Description.Trim();
        if (!string.IsNullOrWhiteSpace(request.IconKey))
            block.IconKey = request.IconKey.Trim();
        if (request.HtmlBody is not null)
            block.HtmlBody = request.HtmlBody;

        await db.SaveChangesAsync();
        return MapBlock(block);
    }

    public async Task<bool> DeleteBlockAsync(Guid userId, Guid id)
    {
        var block = await db.ContentBlocks.FirstOrDefaultAsync(b => b.Id == id && b.UserId == userId);
        if (block is null) return false;

        db.ContentBlocks.Remove(block);
        await db.SaveChangesAsync();
        return true;
    }

    public async Task<ContentBlockDto?> GetBlockAsync(Guid userId, Guid id)
    {
        await EnsureBlocksAsync(userId);
        var block = await db.ContentBlocks.FirstOrDefaultAsync(b => b.Id == id && b.UserId == userId);
        return block is null ? null : MapBlock(block);
    }

    public async Task<ContentBlockDto?> RecordBlockUseAsync(Guid userId, Guid id)
    {
        var block = await db.ContentBlocks.FirstOrDefaultAsync(b => b.Id == id && b.UserId == userId);
        if (block is null) return null;
        block.UsedInCount += 1;
        await db.SaveChangesAsync();
        return MapBlock(block);
    }

    public async Task<List<BrandColorDto>> UpdateBrandColorsAsync(Guid userId, UpdateBrandColorsRequest request)
    {
        await EnsureBrandProfileAsync(userId);
        var profile = await db.BrandProfiles.FindAsync(userId);
        profile!.ColorsJson = JsonSerializer.Serialize(request.Colors, JsonOptions);
        profile.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
        return request.Colors;
    }

    public async Task<BrandAssetDto> CreateAssetAsync(Guid userId, CreateBrandAssetRequest request)
    {
        var asset = new BrandAsset
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Name = request.Name.Trim(),
            FileType = request.FileType?.Trim() ?? "image",
            SizeBytes = request.SizeBytes,
            IconKey = string.IsNullOrWhiteSpace(request.IconKey) ? "image" : request.IconKey,
            CreatedAt = DateTime.UtcNow
        };
        db.BrandAssets.Add(asset);
        await db.SaveChangesAsync();
        return MapAsset(asset);
    }

    public async Task<BrandAssetDto> UploadAssetAsync(Guid userId, IFormFile file, string name, string assetCategory)
    {
        if (file.Length <= 0)
            throw new ArgumentException("Please choose a file to upload.");
        if (file.Length > MaxAssetBytes)
            throw new ArgumentException("File must be 10 MB or smaller.");

        var ext = Path.GetExtension(file.FileName);
        if (string.IsNullOrWhiteSpace(ext) || !AllowedAssetExtensions.Contains(ext))
            throw new ArgumentException("Supported formats: JPG, PNG, GIF, WebP, SVG, PDF.");

        var trimmedName = name.Trim();
        if (string.IsNullOrWhiteSpace(trimmedName))
            throw new ArgumentException("Asset name is required.");

        var category = string.IsNullOrWhiteSpace(assetCategory) ? "Other" : assetCategory.Trim();
        var assetId = Guid.NewGuid();
        var relativePath = Path.Combine("uploads", userId.ToString(), assetId + ext).Replace('\\', '/');
        var absolutePath = Path.Combine(env.ContentRootPath, "wwwroot", relativePath.Replace('/', Path.DirectorySeparatorChar));
        Directory.CreateDirectory(Path.GetDirectoryName(absolutePath)!);

        await using (var stream = new FileStream(absolutePath, FileMode.Create))
            await file.CopyToAsync(stream);

        var mimeType = string.IsNullOrWhiteSpace(file.ContentType) ? GuessMimeType(ext) : file.ContentType;
        var asset = new BrandAsset
        {
            Id = assetId,
            UserId = userId,
            Name = trimmedName,
            FileType = ext.TrimStart('.').ToLowerInvariant(),
            SizeBytes = file.Length,
            IconKey = ResolveAssetIconKey(category, mimeType),
            StoragePath = "/" + relativePath,
            MimeType = mimeType,
            CreatedAt = DateTime.UtcNow
        };
        db.BrandAssets.Add(asset);
        await db.SaveChangesAsync();
        return MapAsset(asset);
    }

    public async Task<bool> DeleteAssetAsync(Guid userId, Guid id)
    {
        var asset = await db.BrandAssets.FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);
        if (asset is null) return false;

        if (!string.IsNullOrWhiteSpace(asset.StoragePath))
        {
            var relative = asset.StoragePath.TrimStart('/');
            var absolutePath = Path.Combine(env.ContentRootPath, "wwwroot", relative.Replace('/', Path.DirectorySeparatorChar));
            if (File.Exists(absolutePath))
                File.Delete(absolutePath);
        }

        db.BrandAssets.Remove(asset);
        await db.SaveChangesAsync();
        return true;
    }

    private async Task EnsureTemplatesAsync(Guid userId)
    {
        var existing = await db.EmailTemplates.Where(t => t.UserId == userId).ToListAsync();
        var byName = existing.ToDictionary(t => t.Name, StringComparer.OrdinalIgnoreCase);
        var changed = false;

        foreach (var def in TemplateCatalog)
        {
            if (byName.TryGetValue(def.Name, out var template))
            {
                if (template.IsCustom) continue;

                if (string.IsNullOrWhiteSpace(template.HtmlBody))
                {
                    ApplyDefinition(template, def);
                    changed = true;
                }
                else if (!string.IsNullOrWhiteSpace(template.PreviewText))
                {
                    template.PreviewText = "";
                    changed = true;
                }
                continue;
            }

            db.EmailTemplates.Add(CreateFromDefinition(userId, def));
            changed = true;
        }

        if (changed)
            await db.SaveChangesAsync();
    }

    private static EmailTemplate CreateFromDefinition(Guid userId, TemplateDef def) => new()
    {
        Id = Guid.NewGuid(),
        UserId = userId,
        Name = def.Name,
        Category = def.Category,
        PreviewCode = def.PreviewCode,
        Description = def.Description,
        SubjectLine = def.SubjectLine,
        PreviewText = def.PreviewText,
        HtmlBody = EmailTemplateBodies.Get(def.Name),
        IconKey = def.IconKey,
        SuggestedCampaignType = def.SuggestedCampaignType,
        IsCustom = false,
        CreatedAt = DateTime.UtcNow
    };

    private static void ApplyDefinition(EmailTemplate template, TemplateDef def)
    {
        template.Category = def.Category;
        template.PreviewCode = def.PreviewCode;
        template.Description = def.Description;
        template.SubjectLine = def.SubjectLine;
        template.PreviewText = def.PreviewText;
        template.HtmlBody = EmailTemplateBodies.Get(def.Name);
        template.IconKey = def.IconKey;
        template.SuggestedCampaignType = def.SuggestedCampaignType;
    }

    private static EmailTemplateDto MapTemplate(EmailTemplate t) => new(
        t.Id.ToString(), t.Name, t.Category, t.PreviewCode, t.Description,
        t.SubjectLine, t.PreviewText, t.HtmlBody, t.IconKey, t.SuggestedCampaignType, t.IsCustom);

    private async Task EnsureBlocksAsync(Guid userId)
    {
        var existing = await db.ContentBlocks.Where(b => b.UserId == userId).ToListAsync();
        var byName = existing.ToDictionary(b => b.Name, StringComparer.OrdinalIgnoreCase);
        var changed = false;

        foreach (var block in existing.Where(b => string.IsNullOrWhiteSpace(b.HtmlBody)))
        {
            block.HtmlBody = ContentBlockBodies.Get(block.BlockType, block.Name);
            changed = true;
        }

        foreach (var def in BlockCatalog)
        {
            if (byName.ContainsKey(def.Name)) continue;

            db.ContentBlocks.Add(new ContentBlock
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Name = def.Name,
                BlockType = def.BlockType,
                Description = def.Description,
                IconKey = def.IconKey,
                HtmlBody = ContentBlockBodies.Get(def.BlockType, def.Name),
                UsedInCount = 0,
                CreatedAt = DateTime.UtcNow
            });
            changed = true;
        }

        if (changed)
            await db.SaveChangesAsync();
    }

    private static ContentBlockDto MapBlock(ContentBlock b) => new(
        b.Id.ToString(),
        b.Name,
        b.BlockType,
        b.Description,
        b.UsedInCount,
        b.IconKey,
        ResolveBlockHtml(b));

    private static string ResolveBlockHtml(ContentBlock b) =>
        !string.IsNullOrWhiteSpace(b.HtmlBody)
            ? b.HtmlBody!
            : ContentBlockBodies.Get(b.BlockType, b.Name);

    private static BrandAssetDto MapAsset(BrandAsset a) => new(
        a.Id.ToString(),
        a.Name,
        FormatSize(a.SizeBytes),
        a.IconKey,
        a.StoragePath,
        a.MimeType);

    private async Task EnsureBrandProfileAsync(Guid userId)
    {
        if (await db.BrandProfiles.AnyAsync(p => p.UserId == userId)) return;
        db.BrandProfiles.Add(new BrandProfile
        {
            UserId = userId,
            ColorsJson = JsonSerializer.Serialize(DefaultColors, JsonOptions),
            UpdatedAt = DateTime.UtcNow
        });
        await db.SaveChangesAsync();
    }

    private static List<BrandColorDto> ParseColors(string? json)
    {
        if (string.IsNullOrWhiteSpace(json)) return DefaultColors.ToList();
        try
        {
            return JsonSerializer.Deserialize<List<BrandColorDto>>(json, JsonOptions) ?? DefaultColors.ToList();
        }
        catch
        {
            return DefaultColors.ToList();
        }
    }

    private static string FormatSize(long bytes)
    {
        if (bytes < 1024) return $"{bytes} B";
        if (bytes < 1024 * 1024) return $"{bytes / 1024.0:0.#} KB";
        return $"{bytes / (1024.0 * 1024.0):0.#} MB";
    }

    private static string ResolveIconKey(string blockType) =>
        BlockCatalog.FirstOrDefault(b => b.BlockType.Equals(blockType, StringComparison.OrdinalIgnoreCase))?.IconKey ?? "book";

    private static string ResolveAssetIconKey(string category, string mimeType)
    {
        if (category.Contains("Logo", StringComparison.OrdinalIgnoreCase)) return "palette";
        if (category.Contains("Cover", StringComparison.OrdinalIgnoreCase)) return "book";
        if (category.Contains("Author", StringComparison.OrdinalIgnoreCase)) return "users";
        if (mimeType.Contains("pdf", StringComparison.OrdinalIgnoreCase)) return "file";
        return "image";
    }

    private static string GuessMimeType(string ext) => ext.ToLowerInvariant() switch
    {
        ".jpg" or ".jpeg" => "image/jpeg",
        ".png" => "image/png",
        ".gif" => "image/gif",
        ".webp" => "image/webp",
        ".svg" => "image/svg+xml",
        ".pdf" => "application/pdf",
        _ => "application/octet-stream"
    };
}
