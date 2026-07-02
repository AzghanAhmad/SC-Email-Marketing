namespace ScribeCount.Email.Api.Services;

public class MailboxSchedulerService(IServiceProvider services, ILogger<MailboxSchedulerService> logger) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var scope = services.CreateScope();
                var mailbox = scope.ServiceProvider.GetRequiredService<MailboxService>();
                await mailbox.ProcessDueScheduledMessagesAsync(stoppingToken);
            }
            catch (Exception ex) when (ex is not OperationCanceledException)
            {
                logger.LogError(ex, "Scheduled mailbox message processor failed");
            }

            await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken);
        }
    }
}
