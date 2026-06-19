namespace ScribeCount.Email.Api.Services;

public static class DatabaseConfiguration
{
    public static string ResolveConnectionString(IConfiguration configuration)
    {
        var fromConfig = configuration.GetConnectionString("DefaultConnection");
        if (!string.IsNullOrWhiteSpace(fromConfig))
            return fromConfig.Trim();

        var fromUrl = ParseMySqlUrl(
            Environment.GetEnvironmentVariable("MYSQL_URL")
            ?? Environment.GetEnvironmentVariable("DATABASE_URL"));
        if (!string.IsNullOrWhiteSpace(fromUrl))
            return fromUrl;

        var host = Environment.GetEnvironmentVariable("MYSQLHOST")
            ?? Environment.GetEnvironmentVariable("MYSQL_HOST");
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

        if (!string.IsNullOrWhiteSpace(host))
        {
            return $"Server={host};Port={port};Database={database};User={user};Password={password};SslMode=Required;";
        }

        return "Server=localhost;Port=3306;Database=scribecount_email;User=root;Password=;";
    }

    private static string? ParseMySqlUrl(string? url)
    {
        if (string.IsNullOrWhiteSpace(url))
            return null;

        if (!Uri.TryCreate(url, UriKind.Absolute, out var uri))
            return null;

        var userInfo = uri.UserInfo.Split(':', 2);
        var user = userInfo.Length > 0 ? Uri.UnescapeDataString(userInfo[0]) : "root";
        var password = userInfo.Length > 1 ? Uri.UnescapeDataString(userInfo[1]) : "";
        var database = uri.AbsolutePath.TrimStart('/');
        if (string.IsNullOrWhiteSpace(database))
            database = "railway";

        var port = uri.Port > 0 ? uri.Port : 3306;
        return $"Server={uri.Host};Port={port};Database={database};User={user};Password={password};SslMode=Required;";
    }
}
