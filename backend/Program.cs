using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;
using ScribeCount.Email.Api.Data;
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
    .AddJsonOptions(o => o.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase);

builder.Services.AddOpenApi();
builder.Services.AddDbContext<AppDbContext>(options =>
{
    var conn = DatabaseConfiguration.ResolveConnectionString(builder.Configuration);
    var serverVersion = new MySqlServerVersion(new Version(8, 0, 36));
    options.UseMySql(conn, serverVersion);
});

builder.Services.AddScoped<JwtTokenService>();
builder.Services.AddScoped<DatabaseSeeder>();
builder.Services.AddScoped<MailboxService>();
builder.Services.AddScoped<DashboardService>();
builder.Services.AddScoped<CampaignService>();

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
app.UseAuthorization();
app.MapControllers();

app.Run();
