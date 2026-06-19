using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;
using ScribeCount.Email.Api.Data;
using ScribeCount.Email.Api.Services;

var userId = Guid.Parse(args.ElementAtOrDefault(0) ?? "6fa79cd1-7690-43f1-8074-1e8e19cc368a");

var services = new ServiceCollection();
services.AddLogging(b => b.AddConsole().SetMinimumLevel(LogLevel.Debug));
services.AddDbContext<AppDbContext>(options =>
{
    options.UseMySql(
        "Server=localhost;Port=3306;Database=scribecount_email;User=root;Password=;",
        new MySqlServerVersion(new Version(8, 0, 36)));
});
services.AddScoped<MailboxService>();

await using var provider = services.BuildServiceProvider();
using var scope = provider.CreateScope();
var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
var mailbox = scope.ServiceProvider.GetRequiredService<MailboxService>();

var before = await db.MailboxMessages.CountAsync(m => m.UserId == userId);
Console.WriteLine($"Messages before: {before}");

try
{
    var synced = await mailbox.SyncInboxAsync(userId, 10);
    var after = await db.MailboxMessages.CountAsync(m => m.UserId == userId);
    Console.WriteLine($"Synced: {synced}, messages after: {after}");
}
catch (Exception ex)
{
    Console.WriteLine($"Sync failed: {ex}");
}
