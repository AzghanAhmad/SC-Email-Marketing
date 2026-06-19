using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using ScribeCount.Email.Api.Data;
using ScribeCount.Email.Api.Entities;

namespace ScribeCount.Email.Api.Services;

public class DatabaseSeeder(AppDbContext db, IWebHostEnvironment env, ILogger<DatabaseSeeder> logger)
{
    private static readonly JsonSerializerOptions JsonOptions = new() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

    public async Task SeedAsync()
    {
        await db.Database.MigrateAsync();
        await SeedFlowTemplatesAsync();
    }

    private async Task SeedFlowTemplatesAsync()
    {
        if (await db.FlowTemplates.AnyAsync()) return;

        var path = Path.Combine(env.ContentRootPath, "SeedData", "flow-templates.json");
        if (!File.Exists(path))
        {
            logger.LogWarning("Flow templates seed file not found at {Path}. Run: node backend/scripts/export-flow-templates.mjs", path);
            return;
        }

        var json = await File.ReadAllTextAsync(path);
        using var doc = JsonDocument.Parse(json);

        foreach (var item in doc.RootElement.EnumerateArray())
        {
            var steps = item.GetProperty("steps");
            db.FlowTemplates.Add(new FlowTemplate
            {
                Id = item.GetProperty("id").GetString()!,
                Name = item.GetProperty("name").GetString()!,
                Family = item.GetProperty("family").GetString()!,
                Description = item.GetProperty("description").GetString()!,
                GoalExit = item.GetProperty("goalExit").GetString()!,
                EstimatedSetupMinutes = item.GetProperty("estimatedSetupMinutes").GetInt32(),
                Priority = item.TryGetProperty("priority", out var p) && p.ValueKind != JsonValueKind.Null ? p.GetString() : null,
                RequiresWebhook = item.TryGetProperty("requiresWebhook", out var w) && w.GetBoolean(),
                StepsJson = steps.GetRawText()
            });
        }

        await db.SaveChangesAsync();
        logger.LogInformation("Seeded {Count} flow templates", await db.FlowTemplates.CountAsync());
    }

    public static T? DeserializeJson<T>(string json) =>
        JsonSerializer.Deserialize<T>(json, JsonOptions);
}
