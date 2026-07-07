using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ScribeCount.Email.Api.DTOs;
using ScribeCount.Email.Api.Services;

namespace ScribeCount.Email.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/v1/deliverability")]
public class DeliverabilityController(SesEmailService ses, ILogger<DeliverabilityController> logger) : ControllerBase
{
    [HttpGet("ses/status")]
    public async Task<ActionResult<SesStatusDto>> GetSesStatus(CancellationToken cancellationToken) =>
        Ok(await ses.GetStatusAsync(GetUserId(), cancellationToken));

    [HttpGet("ses/verify-identity")]
    public async Task<ActionResult<SesIdentityStatusDto>> VerifyIdentity(
        [FromQuery] string? value,
        CancellationToken cancellationToken) =>
        Ok(await ses.CheckIdentityAsync(value, cancellationToken));

    [HttpPost("ses/test-send")]
    public async Task<ActionResult<SesTestSendResponse>> TestSend(
        [FromBody] SesTestSendRequest? request,
        CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        var to = request?.ToEmail?.Trim();
        if (string.IsNullOrWhiteSpace(to))
            return BadRequest(new { message = "ToEmail is required." });

        try
        {
            var messageId = await ses.SendAsync(new PlatformSendRequest(
                userId,
                to,
                request?.Subject ?? "ScribeCount SES test",
                request?.Body ?? "<p>This is a test message sent via Amazon SES.</p><p>If you received this, SES send is working.</p>",
                "test"), cancellationToken);

            return Ok(new SesTestSendResponse(
                "Test email sent via Amazon SES.",
                to,
                messageId));
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "SES test send failed for {Email}", to);
            var (title, detail) = SesEmailService.DescribeSendFailure(ex, to);
            return BadRequest(new { title, detail, message = detail, success = false });
        }
    }

    private Guid GetUserId() =>
        Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub")!);
}
