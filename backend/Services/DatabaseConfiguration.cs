using System.Text.RegularExpressions;

namespace ScribeCount.Email.Api.Services;

public static class DatabaseConfiguration
{
    public static string ResolveConnectionString(IConfiguration configuration)
    {
        // Railway injects these when the MySQL service is linked — prefer over manual vars.
        var fromRailwayVars = BuildFromRailwayEnvVars();
        if (fromRailwayVars != null)
            return fromRailwayVars;

        var fromUrl = NormalizeConnectionString(
            Environment.GetEnvironmentVariable("MYSQL_URL")
            ?? Environment.GetEnvironmentVariable("DATABASE_URL"));
        if (!string.IsNullOrWhiteSpace(fromUrl))
            return fromUrl;

        var fromConfig = NormalizeConnectionString(configuration.GetConnectionString("DefaultConnection"));
        if (!string.IsNullOrWhiteSpace(fromConfig))
            return fromConfig;

        return "Server=localhost;Port=3306;Database=scribecount_email;User=root;Password=;";
    }

    private static string? BuildFromRailwayEnvVars()
    {
        var host = Environment.GetEnvironmentVariable("MYSQLHOST")
            ?? Environment.GetEnvironmentVariable("MYSQL_HOST");
        if (string.IsNullOrWhiteSpace(host))
            return null;

        var port = Environment.GetEnvironmentVariable("MYSQLPORT")
            ?? Environment.GetEnvironmentVariable("MYSQL_PORT")
            ?? "3306";
        var user = Environment.GetEnvironmentVariable("MYSQLUSER")
            ?? Environment.GetEnvironmentVariable("MYSQL_USER")
            ?? "root";
        var password = Environment.GetEnvironmentVariable("MYSQLPASSWORD")
            ?? Environment.GetEnvironmentVariable("MYSQL_PASSWORD")
            ?? "";
        var database = Environment.GetEnvironmentVariable("MYSQLDATABASE")
            ?? Environment.GetEnvironmentVariable("MYSQL_DATABASE")
            ?? "railway";

        return Format(host, port, database, user, password);
    }

    private static string? NormalizeConnectionString(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
            return null;

        var trimmed = value.Trim();

        if (trimmed.StartsWith("mysql://", StringComparison.OrdinalIgnoreCase)
            || trimmed.StartsWith("mysql2://", StringComparison.OrdinalIgnoreCase))
            return ParseMySqlUrl(trimmed);

        if (trimmed.StartsWith("mysql ", StringComparison.OrdinalIgnoreCase))
            return ParseMySqlCli(trimmed);

        if (LooksLikeAdoNetConnectionString(trimmed))
            return trimmed;

        return null;
    }

    private static bool LooksLikeAdoNetConnectionString(string value) =>
        value.Contains("Server=", StringComparison.OrdinalIgnoreCase)
        || value.Contains("Host=", StringComparison.OrdinalIgnoreCase)
        || value.Contains("Data Source=", StringComparison.OrdinalIgnoreCase);

    private static string? ParseMySqlUrl(string url)
    {
        if (!Uri.TryCreate(url, UriKind.Absolute, out var uri))
            return null;

        var userInfo = uri.UserInfo.Split(':', 2);
        var user = userInfo.Length > 0 ? Uri.UnescapeDataString(userInfo[0]) : "root";
        var password = userInfo.Length > 1 ? Uri.UnescapeDataString(userInfo[1]) : "";
        var database = uri.AbsolutePath.TrimStart('/');
        if (string.IsNullOrWhiteSpace(database))
            database = "railway";

        var port = uri.Port > 0 ? uri.Port : 3306;
        return Format(uri.Host, port.ToString(), database, user, password);
    }

    private static string? ParseMySqlCli(string cli)
    {
        var tokens = Regex.Matches(cli, @"'[^']*'|\S+")
            .Select(m => m.Value.Trim('\''))
            .ToList();

        string? host = null;
        string? user = null;
        string? password = null;
        string? database = null;
        var port = "3306";

        for (var i = 0; i < tokens.Count; i++)
        {
            var token = tokens[i];
            var lower = token.ToLowerInvariant();

            switch (lower)
            {
                case "-h":
                case "--host":
                    host = NextToken(tokens, ref i);
                    break;
                case "-u":
                case "--user":
                    user = NextToken(tokens, ref i);
                    break;
                case "-p":
                case "--password":
                    password = NextToken(tokens, ref i);
                    break;
                case "--port":
                    port = NextToken(tokens, ref i) ?? port;
                    break;
                case "--protocol":
                    _ = NextToken(tokens, ref i);
                    break;
                default:
                    if (token.StartsWith("-p", StringComparison.OrdinalIgnoreCase) && token.Length > 2 && password == null)
                        password = token[2..];
                    else if (token.StartsWith("--port=", StringComparison.OrdinalIgnoreCase))
                        port = token.Split('=', 2)[1];
                    else if (token.StartsWith("--protocol=", StringComparison.OrdinalIgnoreCase))
                        _ = token.Split('=', 2)[1];
                    break;
            }
        }

        database = tokens
            .AsEnumerable()
            .Reverse()
            .FirstOrDefault(t =>
                !t.StartsWith('-')
                && !string.Equals(t, "mysql", StringComparison.OrdinalIgnoreCase)
                && !string.Equals(t, "tcp", StringComparison.OrdinalIgnoreCase)
                && !string.Equals(t, port, StringComparison.OrdinalIgnoreCase)
                && !string.Equals(t, host, StringComparison.OrdinalIgnoreCase)
                && !string.Equals(t, user, StringComparison.OrdinalIgnoreCase)
                && !string.Equals(t, password, StringComparison.OrdinalIgnoreCase));

        if (string.IsNullOrWhiteSpace(host) || string.IsNullOrWhiteSpace(user))
            return null;

        return Format(host, port, database ?? "railway", user, password ?? "");
    }

    private static string? NextToken(IReadOnlyList<string> tokens, ref int index) =>
        index + 1 < tokens.Count ? tokens[++index] : null;

    private static string Format(string host, string port, string database, string user, string password) =>
        $"Server={host};Port={port};Database={database};User={user};Password={password};SslMode=Required;";
}
