namespace ScribeCount.Email.Api.Services;

public class CampaignSchedulerService(IServiceProvider services, ILogger<CampaignSchedulerService> logger) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var scope = services.CreateScope();
                var campaigns = scope.ServiceProvider.GetRequiredService<CampaignService>();
                await campaigns.ProcessDueScheduledCampaignsAsync(stoppingToken);
            }
            catch (Exception ex) when (ex is not OperationCanceledException)
            {
                logger.LogError(ex, "Scheduled campaign processor failed");
            }

            await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
        }
    }
}
