namespace ScribeCount.Email.Api.Configuration;

/// <summary>
/// Minimal .env loader. Reads KEY=VALUE lines from a .env file and promotes them to
/// process environment variables so ASP.NET configuration can bind them (using the
/// standard "__" -> ":" section convention). Existing environment variables are never
/// overwritten, so real deployment env vars always win over the local .env file.
/// </summary>
public static class DotEnv
{
    public static void Load(string? path = null)
    {
        path ??= FindEnvFile();
        if (path is null || !File.Exists(path)) return;

        foreach (var rawLine in File.ReadAllLines(path))
        {
            var line = rawLine.Trim();
            if (line.Length == 0 || line.StartsWith('#')) continue;

            var separator = line.IndexOf('=');
            if (separator <= 0) continue;

            var key = line[..separator].Trim();
            var value = line[(separator + 1)..].Trim();

            // Strip surrounding quotes if present.
            if (value.Length >= 2 &&
                ((value[0] == '"' && value[^1] == '"') || (value[0] == '\'' && value[^1] == '\'')))
            {
                value = value[1..^1];
            }

            if (string.IsNullOrEmpty(key)) continue;

            // Don't override real environment variables (deployment secrets take priority).
            if (!string.IsNullOrEmpty(Environment.GetEnvironmentVariable(key))) continue;

            Environment.SetEnvironmentVariable(key, value);
        }
    }

    private static string? FindEnvFile()
    {
        var dir = new DirectoryInfo(Directory.GetCurrentDirectory());
        for (var i = 0; i < 5 && dir is not null; i++)
        {
            var candidate = Path.Combine(dir.FullName, ".env");
            if (File.Exists(candidate)) return candidate;
            dir = dir.Parent;
        }
        return null;
    }
}
