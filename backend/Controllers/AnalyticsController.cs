using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ScribeCount.Email.Api.DTOs;
using ScribeCount.Email.Api.Services;

namespace ScribeCount.Email.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/v1/analytics")]
public class AnalyticsController(AnalyticsService analytics) : ControllerBase
{
    private Guid UserId => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub")!);

    [HttpGet]
    public async Task<ActionResult<AnalyticsBundleDto>> GetAnalytics([FromQuery] int days = 30) =>
        Ok(await analytics.GetBundleAsync(UserId, Math.Clamp(days, 7, 365)));

    [HttpGet("marketing")]
    public async Task<ActionResult<MarketingAnalyticsDto>> GetMarketingAnalytics([FromQuery] int days = 30) =>
        Ok(await analytics.GetMarketingAnalyticsAsync(UserId, Math.Clamp(days, 7, 365)));
}
