using System.Globalization;
using System.Net;
using System.Text.Json;
using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore;
using ScribeCount.Email.Api.Data;
using ScribeCount.Email.Api.DTOs;
using ScribeCount.Email.Api.Entities;

namespace ScribeCount.Email.Api.Services;

public class WebsiteService(
    AppDbContext db,
    IConfiguration configuration,
    SesEmailService ses,
    ILogger<WebsiteService> logger)
{
    private string PublicBaseUrl =>
        (configuration["App:PublicBaseUrl"] ?? "http://localhost:4200").TrimEnd('/');

    private string LandingPageUrl(string slug) => $"{PublicBaseUrl}/p/{slug}";

    private string SignUpFormUrl(Guid id) => $"{PublicBaseUrl}/website/forms/preview/{id}";
    private static readonly Dictionary<string, string> FormTypeIcons = new(StringComparer.OrdinalIgnoreCase)
    {
        ["Popup"] = "form",
        ["Embedded"] = "landing",
        ["Flyout"] = "book",
        ["Full Page"] = "trend",
    };

    private static readonly JsonSerializerOptions JsonOptions = new() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

    public async Task<WebsiteBundleDto> GetBundleAsync(Guid userId)
    {
        var forms = await db.SignUpForms.Where(f => f.UserId == userId)
            .OrderByDescending(f => f.UpdatedAt).ToListAsync();
        var pages = await db.LandingPages.Where(p => p.UserId == userId)
            .OrderByDescending(p => p.UpdatedAt).ToListAsync();
        var lists = await db.AudienceLists.Where(l => l.UserId == userId)
            .OrderBy(l => l.Name).ToListAsync();
        var subscribers = await db.Subscribers.Where(s => s.UserId == userId).ToListAsync();

        var listDtos = lists.Select(l => new AudienceListDto(
            l.Id.ToString(), l.Name, l.Description,
            subscribers.Count(s => s.ListId == l.Id),
            l.Color, l.OptInMethod,
            l.CreatedAt.ToString("MMM d, yyyy"),
            l.UpdatedAt.ToString("MMM d, yyyy"),
            l.FolderId?.ToString(), null)).ToList();

        var totalSubmissions = forms.Sum(f => f.Submissions);
        var activeForms = forms.Count(f => f.Status == "active");
        var avgConversion = forms.Count == 0 ? 0 : forms.Average(f => (double)f.ConversionRate);

        var stats = new List<SignUpFormStatsDto>
        {
            new("Total Forms", forms.Count.ToString(), 0),
            new("Total Submissions", totalSubmissions.ToString("N0", CultureInfo.InvariantCulture), 0),
            new("Avg Conversion", forms.Count == 0 ? "0%" : $"{avgConversion:0.0}%", 0),
            new("Active Forms", activeForms.ToString(), 0),
        };

        return new WebsiteBundleDto(
            stats,
            forms.Select(MapForm).ToList(),
            pages.Select(MapPage).ToList(),
            listDtos
        );
    }

    public async Task<SignUpFormDto?> GetFormAsync(Guid userId, Guid id)
    {
        var form = await db.SignUpForms.FirstOrDefaultAsync(f => f.Id == id && f.UserId == userId);
        return form is null ? null : MapForm(form);
    }

    public async Task<SignUpFormDto> CreateFormAsync(Guid userId, CreateSignUpFormRequest request)
    {
        var listName = request.TargetListName ?? "";
        if (request.TargetListId.HasValue)
        {
            var list = await db.AudienceLists.FirstOrDefaultAsync(l => l.Id == request.TargetListId && l.UserId == userId);
            if (list is not null) listName = list.Name;
        }

        var content = BuildFormContent(request.Name, request.Headline, request.Description, request.ButtonText, request.ThankYouMessage);
        var form = new SignUpForm
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Name = request.Name.Trim(),
            FormType = request.FormType.Trim(),
            Status = string.IsNullOrWhiteSpace(request.Status) ? "draft" : request.Status,
            TargetListId = request.TargetListId,
            TargetListName = listName,
            Submissions = 0,
            ConversionRate = 0,
            ContentJson = WebsiteContentHelper.Serialize(content),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        db.SignUpForms.Add(form);
        await db.SaveChangesAsync();
        return MapForm(form);
    }

    public async Task<SignUpFormDto?> UpdateFormAsync(Guid userId, Guid id, UpdateSignUpFormRequest request)
    {
        var form = await db.SignUpForms.FirstOrDefaultAsync(f => f.Id == id && f.UserId == userId);
        if (form is null) return null;

        var listName = request.TargetListName ?? "";
        if (request.TargetListId.HasValue)
        {
            var list = await db.AudienceLists.FirstOrDefaultAsync(l => l.Id == request.TargetListId && l.UserId == userId);
            if (list is not null) listName = list.Name;
        }

        var fallback = WebsiteContentHelper.DefaultForm(request.Name);
        var current = WebsiteContentHelper.Parse(form.ContentJson, fallback);
        var merged = WebsiteContentHelper.Merge(current, new WebsitePageContent(
            request.Headline ?? "", request.Description ?? "", request.ButtonText ?? "", request.ThankYouMessage ?? ""));

        form.Name = request.Name.Trim();
        form.FormType = request.FormType.Trim();
        form.Status = string.IsNullOrWhiteSpace(request.Status) ? form.Status : request.Status;
        form.TargetListId = request.TargetListId;
        form.TargetListName = listName;
        form.ContentJson = WebsiteContentHelper.Serialize(merged);
        form.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
        return MapForm(form);
    }

    public async Task<bool> DeleteFormAsync(Guid userId, Guid id)
    {
        var form = await db.SignUpForms.FirstOrDefaultAsync(f => f.Id == id && f.UserId == userId);
        if (form is null) return false;
        db.SignUpForms.Remove(form);
        await db.SaveChangesAsync();
        return true;
    }

    public async Task<LandingPageDto?> GetLandingPageAsync(Guid userId, Guid id)
    {
        var page = await db.LandingPages.FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);
        return page is null ? null : MapPage(page);
    }

    public async Task<LandingPageDto> CreateLandingPageAsync(Guid userId, CreateLandingPageRequest request)
    {
        var slug = Slugify(request.Name);
        var baseSlug = slug;
        var i = 1;
        while (await db.LandingPages.AnyAsync(p => p.UserId == userId && p.Slug == slug))
            slug = $"{baseSlug}-{++i}";

        var content = BuildLandingContent(request.Name, request.Headline, request.Description, request.ButtonText, request.ThankYouMessage);
        var page = new LandingPage
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Name = request.Name.Trim(),
            Slug = slug,
            Status = string.IsNullOrWhiteSpace(request.Status) ? "draft" : request.Status,
            ThemeGradient = string.IsNullOrWhiteSpace(request.ThemeGradient)
                ? "linear-gradient(135deg,#1e3a5f,#2d5a87)" : request.ThemeGradient,
            IconKey = string.IsNullOrWhiteSpace(request.IconKey) ? "book" : request.IconKey,
            Visits = 0,
            Signups = 0,
            ContentJson = WebsiteContentHelper.Serialize(content),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        db.LandingPages.Add(page);
        await db.SaveChangesAsync();
        return MapPage(page);
    }

    public async Task<LandingPageDto?> UpdateLandingPageAsync(Guid userId, Guid id, UpdateLandingPageRequest request)
    {
        var page = await db.LandingPages.FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);
        if (page is null) return null;

        var fallback = WebsiteContentHelper.DefaultLanding(request.Name);
        var current = WebsiteContentHelper.Parse(page.ContentJson, fallback);
        var merged = WebsiteContentHelper.Merge(current, new WebsitePageContent(
            request.Headline ?? "", request.Description ?? "", request.ButtonText ?? "", request.ThankYouMessage ?? ""));

        if (!string.IsNullOrWhiteSpace(request.Slug))
        {
            var slug = Slugify(request.Slug);
            if (slug != page.Slug && await db.LandingPages.AnyAsync(p => p.UserId == userId && p.Slug == slug && p.Id != id))
                throw new InvalidOperationException("A landing page with that URL slug already exists.");
            page.Slug = slug;
        }

        page.Name = request.Name.Trim();
        page.Status = string.IsNullOrWhiteSpace(request.Status) ? page.Status : request.Status;
        page.ThemeGradient = string.IsNullOrWhiteSpace(request.ThemeGradient) ? page.ThemeGradient : request.ThemeGradient;
        page.IconKey = string.IsNullOrWhiteSpace(request.IconKey) ? page.IconKey : request.IconKey;
        page.ContentJson = WebsiteContentHelper.Serialize(merged);
        page.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
        return MapPage(page);
    }

    public async Task<bool> DeleteLandingPageAsync(Guid userId, Guid id)
    {
        var page = await db.LandingPages.FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);
        if (page is null) return false;
        db.LandingPages.Remove(page);
        await db.SaveChangesAsync();
        return true;
    }

    public async Task<PublicFormPreviewDto?> GetPublicFormAsync(Guid id, bool allowDraft = false)
    {
        var form = await db.SignUpForms.FirstOrDefaultAsync(f => f.Id == id);
        if (form is null) return null;
        if (!allowDraft && form.Status != "active") return null;
        return MapPublicForm(form);
    }

    public async Task<PublicLandingPageDto?> GetPublicLandingPageAsync(string slug, bool trackVisit = true)
    {
        var page = await db.LandingPages.FirstOrDefaultAsync(p => p.Slug == slug && p.Status == "published");
        if (page is null) return null;
        if (trackVisit)
        {
            page.Visits++;
            page.UpdatedAt = DateTime.UtcNow;
            await db.SaveChangesAsync();
        }
        return MapPublicLanding(page);
    }

    public async Task<PublicLandingPageDto?> GetLandingPagePreviewAsync(Guid userId, Guid id)
    {
        var page = await db.LandingPages.FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);
        return page is null ? null : MapPublicLanding(page);
    }

    public async Task<PublicFormSubmitResult?> SubmitFormAsync(Guid formId, PublicFormSubmitRequest request)
    {
        var form = await db.SignUpForms.FirstOrDefaultAsync(f => f.Id == formId && f.Status == "active");
        if (form is null) return null;

        var email = request.Email.Trim().ToLowerInvariant();
        if (string.IsNullOrWhiteSpace(email) || !email.Contains('@'))
            return new PublicFormSubmitResult("Please enter a valid email address.", false);

        var subscriberId = await UpsertSubscriberAsync(form.UserId, email, request.FirstName, form.TargetListId, "sign_up_form", form.Name);

        form.Submissions++;
        form.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();

        var content = WebsiteContentHelper.Parse(form.ContentJson, WebsiteContentHelper.DefaultForm(form.Name));
        await TrySendSignupWelcomeEmailAsync(form.UserId, subscriberId, email, request.FirstName, form.Name, content, "sign_up_form");

        return new PublicFormSubmitResult(content.ThankYouMessage, true);
    }

    public async Task<PublicFormSubmitResult?> SubmitLandingPageAsync(string slug, PublicFormSubmitRequest request)
    {
        var page = await db.LandingPages.FirstOrDefaultAsync(p => p.Slug == slug && p.Status == "published");
        if (page is null) return null;

        var email = request.Email.Trim().ToLowerInvariant();
        if (string.IsNullOrWhiteSpace(email) || !email.Contains('@'))
            return new PublicFormSubmitResult("Please enter a valid email address.", false);

        var defaultListId = await db.AudienceLists
            .Where(l => l.UserId == page.UserId)
            .OrderBy(l => l.CreatedAt)
            .Select(l => (Guid?)l.Id)
            .FirstOrDefaultAsync();

        var subscriberId = await UpsertSubscriberAsync(page.UserId, email, request.FirstName, defaultListId, "landing_page", page.Name);

        page.Signups++;
        page.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();

        var content = WebsiteContentHelper.Parse(page.ContentJson, WebsiteContentHelper.DefaultLanding(page.Name));
        await TrySendSignupWelcomeEmailAsync(page.UserId, subscriberId, email, request.FirstName, page.Name, content, "landing_page");

        return new PublicFormSubmitResult(content.ThankYouMessage, true);
    }

    private async Task<Guid> UpsertSubscriberAsync(
        Guid userId, string email, string? firstName, Guid? listId, string sourceType, string sourceName)
    {
        var name = string.IsNullOrWhiteSpace(firstName) ? email.Split('@')[0] : firstName.Trim();
        var existing = await db.Subscribers.FirstOrDefaultAsync(s => s.UserId == userId && s.Email == email);
        if (existing is not null)
        {
            if (existing.Status == "unsubscribed") existing.Status = "active";
            if (listId.HasValue)
            {
                var listIds = ParseListIds(existing.ListIdsJson);
                var listKey = listId.Value.ToString();
                if (!listIds.Contains(listKey))
                {
                    listIds.Add(listKey);
                    existing.ListIdsJson = JsonSerializer.Serialize(listIds, JsonOptions);
                }
                existing.ListId ??= listId;
            }
            await db.SaveChangesAsync();
            return existing.Id;
        }

        var newId = Guid.NewGuid();
        var listIdsForNew = listId.HasValue ? new List<string> { listId.Value.ToString() } : [];
        db.Subscribers.Add(new Subscriber
        {
            Id = newId,
            UserId = userId,
            Name = name,
            Email = email,
            Status = "active",
            TagsJson = JsonSerializer.Serialize(new[] { sourceType }, JsonOptions),
            ListIdsJson = JsonSerializer.Serialize(listIdsForNew, JsonOptions),
            Note = $"Signed up via {sourceName}",
            OpenRate = 0,
            ClickRate = 0,
            ListId = listId,
            JoinedAt = DateTime.UtcNow
        });
        await db.SaveChangesAsync();
        return newId;
    }

    private async Task TrySendSignupWelcomeEmailAsync(
        Guid userId,
        Guid subscriberId,
        string toEmail,
        string? firstName,
        string sourceName,
        WebsitePageContent content,
        string source)
    {
        if (!ses.IsConfigured) return;

        var greeting = string.IsNullOrWhiteSpace(firstName) ? "there" : firstName.Trim();
        var subject = string.IsNullOrWhiteSpace(content.Headline) ? $"Welcome to {sourceName}" : content.Headline;
        var html = $"""
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#0f172a;line-height:1.6">
              <h1 style="margin:0 0 16px;font-size:24px;line-height:1.3">{WebUtility.HtmlEncode(content.ThankYouMessage)}</h1>
              <p style="margin:0 0 12px;font-size:16px">Hi {WebUtility.HtmlEncode(greeting)},</p>
              <p style="margin:0;font-size:16px;color:#334155">{WebUtility.HtmlEncode(content.Description)}</p>
            </div>
            """;

        try
        {
            await ses.SendAsync(new PlatformSendRequest(
                userId,
                toEmail,
                subject,
                html,
                source,
                subscriberId));
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Could not send signup welcome email to {Email} for {Source}", toEmail, sourceName);
        }
    }

    private static List<string> ParseListIds(string json)
    {
        try
        {
            return JsonSerializer.Deserialize<List<string>>(json, JsonOptions) ?? [];
        }
        catch
        {
            return [];
        }
    }

    private SignUpFormDto MapForm(SignUpForm f)
    {
        var content = WebsiteContentHelper.Parse(f.ContentJson, WebsiteContentHelper.DefaultForm(f.Name));
        return new SignUpFormDto(
            f.Id.ToString(), f.Name, f.FormType, f.Status, f.Submissions, f.ConversionRate,
            f.TargetListName, f.TargetListId?.ToString(), f.UpdatedAt.ToString("MMM d, yyyy"),
            FormTypeIcons.GetValueOrDefault(f.FormType, "form"),
            content.Headline, content.Description, content.ButtonText, content.ThankYouMessage,
            SignUpFormUrl(f.Id));
    }

    private LandingPageDto MapPage(LandingPage p)
    {
        var conv = p.Visits == 0 ? 0 : Math.Round(p.Signups / (double)p.Visits * 100, 1);
        var content = WebsiteContentHelper.Parse(p.ContentJson, WebsiteContentHelper.DefaultLanding(p.Name));
        return new LandingPageDto(
            p.Id.ToString(), p.Name, p.Status, p.Slug, LandingPageUrl(p.Slug),
            p.Visits, p.Signups, conv, p.ThemeGradient, p.IconKey,
            content.Headline, content.Description, content.ButtonText, content.ThankYouMessage);
    }

    private static PublicFormPreviewDto MapPublicForm(SignUpForm f)
    {
        var content = WebsiteContentHelper.Parse(f.ContentJson, WebsiteContentHelper.DefaultForm(f.Name));
        return new PublicFormPreviewDto(
            f.Id.ToString(), f.Name, f.FormType, f.Status,
            content.Headline, content.Description, content.ButtonText, content.ThankYouMessage);
    }

    private static PublicLandingPageDto MapPublicLanding(LandingPage p)
    {
        var content = WebsiteContentHelper.Parse(p.ContentJson, WebsiteContentHelper.DefaultLanding(p.Name));
        return new PublicLandingPageDto(
            p.Id.ToString(), p.Name, p.Slug, p.Status, p.ThemeGradient, p.IconKey,
            content.Headline, content.Description, content.ButtonText, content.ThankYouMessage);
    }

    private static WebsitePageContent BuildFormContent(
        string name, string? headline, string? description, string? buttonText, string? thankYou) =>
        WebsiteContentHelper.Merge(
            WebsiteContentHelper.DefaultForm(name),
            new WebsitePageContent(headline ?? "", description ?? "", buttonText ?? "", thankYou ?? ""));

    private static WebsitePageContent BuildLandingContent(
        string name, string? headline, string? description, string? buttonText, string? thankYou) =>
        WebsiteContentHelper.Merge(
            WebsiteContentHelper.DefaultLanding(name),
            new WebsitePageContent(headline ?? "", description ?? "", buttonText ?? "", thankYou ?? ""));

    private static string Slugify(string name)
    {
        var slug = name.ToLowerInvariant();
        slug = Regex.Replace(slug, @"[^a-z0-9]+", "-");
        slug = slug.Trim('-');
        return string.IsNullOrWhiteSpace(slug) ? "page" : slug;
    }
}
