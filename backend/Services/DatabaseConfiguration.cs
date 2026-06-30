using System.Text.RegularExpressions;
using Microsoft.Extensions.Hosting;

namespace ScribeCount.Email.Api.Services;

public static class DatabaseConfiguration
{
    public static async Task EnsureDatabaseExistsAsync(
        string connectionString,
        ILogger? logger = null,
        CancellationToken cancellationToken = default)
    {
        var builder = new MySqlConnector.MySqlConnectionStringBuilder(connectionString);
        var database = string.IsNullOrWhiteSpace(builder.Database) ? "scribecount_email" : builder.Database;
        var escaped = database.Replace("`", "``", StringComparison.Ordinal);

        builder.Database = "";
        await using var connection = new MySqlConnector.MySqlConnection(builder.ConnectionString);
        await connection.OpenAsync(cancellationToken);

        await using var command = connection.CreateCommand();
        command.CommandText = $"CREATE DATABASE IF NOT EXISTS `{escaped}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;";
        await command.ExecuteNonQueryAsync(cancellationToken);

        logger?.LogInformation("Database {Database} is ready", database);
    }

    public static string ResolveConnectionString(IConfiguration configuration, IHostEnvironment? environment = null)
    {
        var isDevelopment = environment?.IsDevelopment()
            ?? string.Equals(
                Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT"),
                "Development",
                StringComparison.OrdinalIgnoreCase);

        if (isDevelopment && !UseRailwayDbInDevelopment())
        {
            var local = NormalizeConnectionString(configuration.GetConnectionString("DefaultConnection"));
            if (!string.IsNullOrWhiteSpace(local))
                return ApplySslForHost(local);
        }

        var fromRailwayVars = BuildFromRailwayEnvVars();
        if (fromRailwayVars != null)
            return fromRailwayVars;

        var fromUrl = NormalizeConnectionString(
            Env("MYSQL_URL") ?? Env("DATABASE_URL"));
        if (!string.IsNullOrWhiteSpace(fromUrl))
            return ApplySslForHost(fromUrl);

        var fromConfig = NormalizeConnectionString(configuration.GetConnectionString("DefaultConnection"));
        if (!string.IsNullOrWhiteSpace(fromConfig))
            return ApplySslForHost(fromConfig);

        return DefaultLocalConnectionString();
    }

    private static bool UseRailwayDbInDevelopment() =>
        string.Equals(Env("USE_RAILWAY_DB"), "true", StringComparison.OrdinalIgnoreCase)
        || string.Equals(Env("USE_RAILWAY_DB"), "1", StringComparison.OrdinalIgnoreCase);

    private static string DefaultLocalConnectionString() =>
        "Server=127.0.0.1;Port=3306;Database=scribecount_email;User=root;Password=;SslMode=None;Connection Timeout=30;";

    private static string? BuildFromRailwayEnvVars()
    {
        var host = Env("MYSQLHOST") ?? Env("MYSQL_HOST");
        if (string.IsNullOrWhiteSpace(host))
            return null;

        var port = Env("MYSQLPORT") ?? Env("MYSQL_PORT") ?? "3306";
        var user = Env("MYSQLUSER") ?? Env("MYSQL_USER") ?? "root";
        var password = Env("MYSQLPASSWORD") ?? Env("MYSQL_PASSWORD") ?? "";
        var database = Env("MYSQLDATABASE") ?? Env("MYSQL_DATABASE") ?? "railway";

        if (string.IsNullOrWhiteSpace(database))
            database = "railway";

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

    private static string ApplySslForHost(string connectionString)
    {
        var builder = new MySqlConnector.MySqlConnectionStringBuilder(connectionString);

        if (string.IsNullOrWhiteSpace(builder.Database))
            builder.Database = "scribecount_email";

        if (IsLocalHost(builder.Server))
        {
            builder.Server = "127.0.0.1";
            builder.SslMode = MySqlConnector.MySqlSslMode.None;
        }
        else if (builder.SslMode == MySqlConnector.MySqlSslMode.Preferred)
        {
            builder.SslMode = MySqlConnector.MySqlSslMode.Required;
        }

        if (builder.ConnectionTimeout == 0)
            builder.ConnectionTimeout = 30;

        return builder.ConnectionString;
    }

    private static bool IsLocalHost(string? host)
    {
        if (string.IsNullOrWhiteSpace(host))
            return true;

        return host.Equals("localhost", StringComparison.OrdinalIgnoreCase)
            || host.Equals("127.0.0.1", StringComparison.OrdinalIgnoreCase)
            || host.Equals("::1", StringComparison.OrdinalIgnoreCase);
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

    private static string Format(string host, string port, string database, string user, string password)
    {
        var ssl = IsLocalHost(host) ? "SslMode=None" : "SslMode=Required";
        return $"Server={host};Port={port};Database={database};User={user};Password={password};{ssl};Connection Timeout=30;";
    }

    private static string? Env(string name)
    {
        var value = Environment.GetEnvironmentVariable(name);
        return string.IsNullOrWhiteSpace(value) ? null : value.Trim();
    }
}
