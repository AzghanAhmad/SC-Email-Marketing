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
        try
        {
            var result = await campaigns.SendCampaignAsync(GetUserId(), id, request?.ScheduleOnly ?? false);
            return result is null ? NotFound() : Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            return StatusCode(403, new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("send")]
    public async Task<ActionResult<CampaignDto>> CreateAndSend([FromBody] CreateCampaignRequest request, [FromQuery] bool schedule = false)
    {
        try
        {
            var result = await campaigns.SendNewCampaignAsync(GetUserId(), request, schedule);
            return result is null ? BadRequest(new { message = "Could not create campaign." }) : Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            return StatusCode(403, new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
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

    [HttpGet("audience-segments")]
    public async Task<ActionResult<List<AudienceSegmentDto>>> GetAudienceSegments() =>
        Ok(await campaigns.GetAudienceSegmentsAsync(GetUserId()));

    [HttpPost("estimate-reach")]
    public async Task<ActionResult<ReachEstimateDto>> EstimateReach([FromBody] ReachEstimateRequest request) =>
        Ok(await campaigns.EstimateReachAsync(GetUserId(), request));

    [HttpPost("test-send")]
    public async Task<ActionResult<TestSendResponse>> TestSend([FromBody] TestSendRequest request)
    {
        var result = await campaigns.SendTestEmailAsync(GetUserId(), request);
        return result is null ? BadRequest() : Ok(result);
    }

    [HttpPut("calendar-events/{id:guid}")]
    public async Task<ActionResult<CalendarEventDto>> UpdateCalendarEvent(Guid id, [FromBody] UpdateCalendarEventRequest request)
    {
        var updated = await campaigns.UpdateCalendarEventAsync(GetUserId(), id, request);
        return updated is null ? NotFound() : Ok(updated);
    }

    [HttpDelete("calendar-events/{id:guid}")]
    public async Task<IActionResult> DeleteCalendarEvent(Guid id)
    {
        var deleted = await campaigns.DeleteCalendarEventAsync(GetUserId(), id);
        return deleted ? NoContent() : NotFound();
    }

    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub")!);
}
