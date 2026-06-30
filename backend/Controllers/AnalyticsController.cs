using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ScribeCount.Email.Api.Services;

namespace ScribeCount.Email.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/v1/analytics")]
public class AnalyticsController(AnalyticsService analytics) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<object>> GetAnalytics([FromQuery] int days = 30)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub")!);
        var data = await analytics.GetBundleAsync(userId, Math.Clamp(days, 7, 365));
        return Ok(data);
    }
}
