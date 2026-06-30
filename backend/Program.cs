using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;
using ScribeCount.Email.Api.Data;
using ScribeCount.Email.Api.Middleware;
using ScribeCount.Email.Api.Serialization;
using ScribeCount.Email.Api.Services;

var builder = WebApplication.CreateBuilder(args);

var port = Environment.GetEnvironmentVariable("PORT");
if (!string.IsNullOrWhiteSpace(port))
{
    builder.WebHost.UseUrls($"http://0.0.0.0:{port}");
}

builder.WebHost.ConfigureKestrel(options =>
{
    options.Limits.MaxRequestBodySize = 50 * 1024 * 1024;
});

builder.Services.AddControllers()
    .AddJsonOptions(o =>
    {
        o.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        o.JsonSerializerOptions.Converters.Add(new UtcDateTimeJsonConverter());
        o.JsonSerializerOptions.Converters.Add(new NullableUtcDateTimeJsonConverter());
    });

builder.Services.AddOpenApi();
builder.Services.AddDbContext<AppDbContext>(options =>
{
    var conn = DatabaseConfiguration.ResolveConnectionString(builder.Configuration, builder.Environment);
    var serverVersion = new MySqlServerVersion(new Version(8, 0, 36));
    options.UseMySql(conn, serverVersion, mysqlOptions =>
    {
        mysqlOptions.EnableRetryOnFailure(
            maxRetryCount: 5,
            maxRetryDelay: TimeSpan.FromSeconds(10),
            errorNumbersToAdd: null
        );
        mysqlOptions.CommandTimeout(60);
        mysqlOptions.SchemaBehavior(Pomelo.EntityFrameworkCore.MySql.Infrastructure.MySqlSchemaBehavior.Ignore);
    });
});

builder.Services.AddScoped<JwtTokenService>();
builder.Services.AddScoped<DatabaseSeeder>();
builder.Services.AddScoped<MailboxService>();
builder.Services.AddScoped<DashboardService>();
builder.Services.AddScoped<AnalyticsService>();
builder.Services.AddScoped<AudienceService>();
builder.Services.AddScoped<ContentService>();
builder.Services.AddScoped<WebsiteService>();
builder.Services.AddScoped<CampaignTrackingService>();
builder.Services.AddScoped<CampaignService>();
builder.Services.AddHostedService<CampaignSchedulerService>();

var jwtKey = builder.Configuration["Jwt:Key"] ?? "ScribeCount-Dev-Secret-Key-Change-In-Production-32chars!";
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });
builder.Services.AddAuthorization();

builder.Services.AddCors(options =>
{
    var origins = builder.Configuration.GetSection("Cors:Origins").Get<string[]>()
        ?? ["http://localhost:4200"];
    options.AddPolicy("Frontend", policy =>
        policy.WithOrigins(origins)
            .AllowAnyHeader()
            .AllowAnyMethod());
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var seeder = scope.ServiceProvider.GetRequiredService<DatabaseSeeder>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    try
    {
        await seeder.SeedAsync();
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Database setup failed. Check ConnectionStrings:DefaultConnection (local XAMPP or Railway). See backend/README.md");
        throw;
    }
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("Frontend");
app.UseAuthentication();
app.UseStaleSessionGuard();
app.UseAuthorization();

var wwwrootPath = Path.Combine(app.Environment.ContentRootPath, "wwwroot");
var indexHtml = Path.Combine(wwwrootPath, "index.html");
var indexCsr = Path.Combine(wwwrootPath, "index.csr.html");
var hasFrontend = File.Exists(indexHtml) || File.Exists(indexCsr);
var spaEntry = File.Exists(indexHtml) ? "index.html" : "index.csr.html";

if (hasFrontend)
{
    app.UseDefaultFiles();
    app.UseStaticFiles();
}

app.MapControllers();
app.MapGet("/health", () => Results.Ok(new { status = "healthy" }));

if (hasFrontend)
{
    app.MapFallbackToFile(spaEntry);
}
else
{
    app.MapGet("/", () => Results.Ok(new
    {
        service = "ScribeCount Email API",
        status = "running",
        docs = "/api/v1",
        health = "/health",
        hint = "Build frontend into wwwroot for the web UI (npm run build:static in frontend/)."
    }));
}

app.Run();
