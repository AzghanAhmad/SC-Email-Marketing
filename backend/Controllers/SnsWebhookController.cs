using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ScribeCount.Email.Api.Services;

namespace ScribeCount.Email.Api.Controllers;

/// <summary>Public HTTPS endpoint for Amazon SNS (bounce / complaint / delivery).</summary>
[ApiController]
[AllowAnonymous]
[Route("api/v1/webhooks/sns")]
public class SnsWebhookController(SnsWebhookService sns, ILogger<SnsWebhookController> logger) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Receive(CancellationToken cancellationToken)
    {
        using var reader = new StreamReader(Request.Body);
        var body = await reader.ReadToEndAsync(cancellationToken);
        if (string.IsNullOrWhiteSpace(body))
            return BadRequest(new { message = "Empty SNS payload." });

        try
        {
            await sns.HandleAsync(body, cancellationToken);
            return Ok(new { message = "ok" });
        }
        catch (InvalidOperationException ex)
        {
            logger.LogWarning(ex, "SNS webhook rejected");
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "SNS webhook failed");
            return StatusCode(500, new { message = "Failed to process SNS notification." });
        }
    }
}
