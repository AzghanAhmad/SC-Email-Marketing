using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ScribeCount.Email.Api.DTOs;
using ScribeCount.Email.Api.Services;

namespace ScribeCount.Email.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/v1/campaigns")]
public class CampaignsController(CampaignService campaigns) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<CampaignsBundleDto>> GetBundle() =>
        Ok(await campaigns.GetBundleAsync(GetUserId()));

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<CampaignDto>> GetById(Guid id)
    {
        var campaign = await campaigns.GetCampaignAsync(GetUserId(), id);
        return campaign is null ? NotFound() : Ok(campaign);
    }

    [HttpPost]
    public async Task<ActionResult<CampaignDto>> Create([FromBody] CreateCampaignRequest request)
    {
        var created = await campaigns.CreateCampaignAsync(GetUserId(), request);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<CampaignDto>> Update(Guid id, [FromBody] UpdateCampaignRequest request)
    {
        var updated = await campaigns.UpdateCampaignAsync(GetUserId(), id, request);
        return updated is null ? NotFound() : Ok(updated);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await campaigns.DeleteCampaignAsync(GetUserId(), id);
        return deleted ? NoContent() : NotFound();
    }

    [HttpPost("{id:guid}/send")]
    public async Task<ActionResult<CampaignDto>> Send(Guid id, [FromBody] SendCampaignRequest? request)
    {
        var result = await campaigns.SendCampaignAsync(GetUserId(), id, request?.ScheduleOnly ?? false);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpPost("send")]
    public async Task<ActionResult<CampaignDto>> CreateAndSend([FromBody] CreateCampaignRequest request, [FromQuery] bool schedule = false)
    {
        var result = await campaigns.SendNewCampaignAsync(GetUserId(), request, schedule);
        return result is null ? BadRequest() : Ok(result);
    }

    [HttpPost("calendar-events")]
    public async Task<ActionResult<CalendarEventDto>> CreateCalendarEvent([FromBody] CreateCalendarEventRequest request)
    {
        var created = await campaigns.CreateCalendarEventAsync(GetUserId(), request);
        return Ok(created);
    }

    [HttpPut("newsletter")]
    public async Task<ActionResult<NewsletterScheduleDto>> SaveNewsletter([FromBody] NewsletterScheduleDto request)
    {
        var saved = await campaigns.SaveNewsletterAsync(GetUserId(), request);
        return Ok(saved);
    }

    [HttpPost("ab-tests")]
    public async Task<ActionResult<AbTestDto>> CreateAbTest([FromBody] CreateAbTestRequest request)
    {
        var created = await campaigns.CreateAbTestAsync(GetUserId(), request);
        return Ok(created);
    }

    [HttpDelete("ab-tests/{id:guid}")]
    public async Task<IActionResult> DeleteAbTest(Guid id)
    {
        var deleted = await campaigns.DeleteAbTestAsync(GetUserId(), id);
        return deleted ? NoContent() : NotFound();
    }

    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub")!);
}
