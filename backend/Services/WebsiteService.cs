using System.Globalization;
using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore;
using ScribeCount.Email.Api.Data;
using ScribeCount.Email.Api.DTOs;
using ScribeCount.Email.Api.Entities;

namespace ScribeCount.Email.Api.Services;

public class WebsiteService(AppDbContext db)
{
    private static readonly Dictionary<string, string> FormTypeIcons = new(StringComparer.OrdinalIgnoreCase)
    {
        ["Popup"] = "form",
        ["Embedded"] = "landing",
        ["Flyout"] = "book",
        ["Full Page"] = "trend",
    };

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

    public async Task<SignUpFormDto> CreateFormAsync(Guid userId, CreateSignUpFormRequest request)
    {
        var listName = request.TargetListName ?? "";
        if (request.TargetListId.HasValue)
        {
            var list = await db.AudienceLists.FirstOrDefaultAsync(l => l.Id == request.TargetListId && l.UserId == userId);
            if (list is not null) listName = list.Name;
        }

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
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        db.SignUpForms.Add(form);
        await db.SaveChangesAsync();
        return MapForm(form);
    }

    public async Task<LandingPageDto> CreateLandingPageAsync(Guid userId, CreateLandingPageRequest request)
    {
        var slug = Slugify(request.Name);
        var baseSlug = slug;
        var i = 1;
        while (await db.LandingPages.AnyAsync(p => p.UserId == userId && p.Slug == slug))
            slug = $"{baseSlug}-{++i}";

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
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        db.LandingPages.Add(page);
        await db.SaveChangesAsync();
        return MapPage(page);
    }

    private static SignUpFormDto MapForm(SignUpForm f) => new(
        f.Id.ToString(), f.Name, f.FormType, f.Status, f.Submissions, f.ConversionRate,
        f.TargetListName, f.UpdatedAt.ToString("MMM d, yyyy"),
        FormTypeIcons.GetValueOrDefault(f.FormType, "form"));

    private static LandingPageDto MapPage(LandingPage p)
    {
        var conv = p.Visits == 0 ? 0 : Math.Round(p.Signups / (double)p.Visits * 100, 1);
        return new LandingPageDto(
            p.Id.ToString(), p.Name, p.Status, $"scribecount.com/p/{p.Slug}",
            p.Visits, p.Signups, conv, p.ThemeGradient, p.IconKey);
    }

    private static string Slugify(string name)
    {
        var slug = name.ToLowerInvariant();
        slug = Regex.Replace(slug, @"[^a-z0-9]+", "-");
        slug = slug.Trim('-');
        return string.IsNullOrWhiteSpace(slug) ? "page" : slug;
    }
}
