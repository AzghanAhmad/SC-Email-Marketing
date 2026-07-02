namespace ScribeCount.Email.Api.Services;

public class CampaignFeatureSchedulerService(IServiceProvider services, ILogger<CampaignFeatureSchedulerService> logger) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var scope = services.CreateScope();
                var campaigns = scope.ServiceProvider.GetRequiredService<CampaignService>();
                await campaigns.ProcessDueAbTestsAsync(stoppingToken);
                await campaigns.ProcessDueNewslettersAsync(stoppingToken);
            }
            catch (Exception ex) when (ex is not OperationCanceledException)
            {
                logger.LogError(ex, "Campaign feature scheduler failed");
            }

            await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
        }
    }
}
