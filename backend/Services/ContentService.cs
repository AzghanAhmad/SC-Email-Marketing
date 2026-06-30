using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using ScribeCount.Email.Api.Data;
using ScribeCount.Email.Api.DTOs;
using ScribeCount.Email.Api.Entities;

namespace ScribeCount.Email.Api.Services;

public class ContentService(AppDbContext db)
{
    private static readonly JsonSerializerOptions JsonOptions = new() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

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

    private static readonly BrandColorDto[] DefaultColors =
    [
        new("Primary", "#1e3a5f"),
        new("Accent", "#3b82f6"),
        new("Success", "#10b981"),
        new("Warning", "#f59e0b"),
        new("Text", "#0f172a"),
        new("Muted", "#94a3b8"),
    ];

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
            assets.Select(a => new BrandAssetDto(a.Id.ToString(), a.Name, FormatSize(a.SizeBytes), a.IconKey)).ToList()
        );
    }

    public async Task<EmailTemplateDto?> GetTemplateAsync(Guid userId, Guid id)
    {
        await EnsureTemplatesAsync(userId);
        var template = await db.EmailTemplates.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
        return template is null ? null : MapTemplate(template);
    }

    public async Task<ContentBlockDto> CreateBlockAsync(Guid userId, CreateContentBlockRequest request)
    {
        var block = new ContentBlock
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Name = request.Name.Trim(),
            BlockType = request.BlockType.Trim(),
            Description = request.Description?.Trim() ?? "",
            IconKey = string.IsNullOrWhiteSpace(request.IconKey) ? "book" : request.IconKey,
            UsedInCount = 0,
            CreatedAt = DateTime.UtcNow
        };
        db.ContentBlocks.Add(block);
        await db.SaveChangesAsync();
        return new ContentBlockDto(block.Id.ToString(), block.Name, block.BlockType, block.Description, 0, block.IconKey,
            ContentBlockBodies.Get(block.BlockType, block.Name));
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
        return new BrandAssetDto(asset.Id.ToString(), asset.Name, FormatSize(asset.SizeBytes), asset.IconKey);
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
        t.SubjectLine, t.PreviewText, t.HtmlBody, t.IconKey, t.SuggestedCampaignType);

    private async Task EnsureBlocksAsync(Guid userId)
    {
        var existing = await db.ContentBlocks.Where(b => b.UserId == userId).ToListAsync();
        var byName = existing.ToDictionary(b => b.Name, StringComparer.OrdinalIgnoreCase);
        var changed = false;

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
        ContentBlockBodies.Get(b.BlockType, b.Name));

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
}
