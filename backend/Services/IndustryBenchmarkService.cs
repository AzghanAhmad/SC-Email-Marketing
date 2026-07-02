using System.Text.Json;
using Microsoft.Extensions.Caching.Memory;

namespace ScribeCount.Email.Api.Services;

public class IndustryBenchmarkService(IWebHostEnvironment env, IMemoryCache cache, ILogger<IndustryBenchmarkService> logger)
{
    private static readonly Dictionary<string, double> Defaults = new(StringComparer.OrdinalIgnoreCase)
    {
        ["Open Rate"] = 21.5,
        ["Click Rate"] = 2.44,
        ["Bounce Rate"] = 2.0,
        ["Unsubscribe Rate"] = 0.46,
        ["Spam Complaint Rate"] = 0.02,
        ["Revenue per Email"] = 0.08
    };

    private static readonly JsonSerializerOptions JsonOptions = new() { PropertyNameCaseInsensitive = true };

    public async Task<Dictionary<string, double>> GetBenchmarksAsync()
    {
        if (cache.TryGetValue<Dictionary<string, double>>("industry-benchmarks", out var cached) && cached is not null)
            return cached;

        var path = Path.Combine(env.ContentRootPath, "wwwroot", "data", "industry-benchmarks.json");
        try
        {
            if (File.Exists(path))
            {
                await using var stream = File.OpenRead(path);
                var doc = await JsonSerializer.DeserializeAsync<BenchmarkFile>(stream, JsonOptions);
                if (doc?.Metrics is { Count: > 0 })
                {
                    cache.Set("industry-benchmarks", doc.Metrics, TimeSpan.FromHours(24));
                    return doc.Metrics;
                }
            }
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Failed to load industry benchmarks file");
        }

        cache.Set("industry-benchmarks", Defaults, TimeSpan.FromHours(24));
        return new Dictionary<string, double>(Defaults, StringComparer.OrdinalIgnoreCase);
    }

    public double Get(Dictionary<string, double> benchmarks, string key, double fallback) =>
        benchmarks.TryGetValue(key, out var val) ? val : fallback;

    private sealed class BenchmarkFile
    {
        public string? Source { get; set; }
        public string? UpdatedAt { get; set; }
        public Dictionary<string, double>? Metrics { get; set; }
    }
}

public static class ChartMonthHelper
{
    public static List<DateTime> LastMonths(int count)
    {
        var anchor = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1, 0, 0, 0, DateTimeKind.Utc);
        return Enumerable.Range(0, count).Select(i => anchor.AddMonths(-(count - 1) + i)).ToList();
    }

    public static string Label(DateTime month) => month.ToString("MMM yy");
}
