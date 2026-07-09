namespace ScribeCount.Email.Api.Services;

public class FlowSchedulerService(IServiceProvider services, ILogger<FlowSchedulerService> logger) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var scope = services.CreateScope();
                var flows = scope.ServiceProvider.GetRequiredService<FlowService>();
                await flows.ProcessDueFlowEmailsAsync(stoppingToken);
            }
            catch (Exception ex) when (ex is not OperationCanceledException)
            {
                logger.LogError(ex, "Flow email scheduler failed");
            }

            await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
        }
    }
}
