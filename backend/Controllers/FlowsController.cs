using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ScribeCount.Email.Api.Data;
using ScribeCount.Email.Api.DTOs;
using ScribeCount.Email.Api.Entities;
using ScribeCount.Email.Api.Services;

namespace ScribeCount.Email.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/v1/flows")]
public class FlowsController(AppDbContext db, FlowService flowService) : ControllerBase
{
    private static readonly JsonSerializerOptions JsonOptions = new() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

    [HttpGet]
    public async Task<ActionResult<List<FlowDto>>> GetMyFlows()
    {
        var flows = await db.UserFlows.Where(f => f.UserId == GetUserId()).OrderByDescending(f => f.UpdatedAt).ToListAsync();
        return Ok(flows.Select(MapFlow).ToList());
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<FlowDto>> GetById(Guid id)
    {
        var flow = await db.UserFlows.FirstOrDefaultAsync(f => f.Id == id && f.UserId == GetUserId());
        if (flow is null) return NotFound();
        return Ok(MapFlow(flow));
    }

    [HttpPost("install")]
    public async Task<ActionResult<FlowDto>> InstallFromTemplate([FromBody] InstallFlowRequest request)
    {
        var template = await db.FlowTemplates.FindAsync(request.TemplateId);
        if (template is null) return NotFound(new { message = "Template not found." });

        var flow = new UserFlow
        {
            Id = Guid.NewGuid(),
            UserId = GetUserId(),
            TemplateId = template.Id,
            Name = template.Name,
            Description = template.Description,
            Status = "draft",
            Triggers = 0,
            Family = template.Family,
            GoalExit = template.GoalExit,
            Priority = template.Priority,
            RequiresWebhook = template.RequiresWebhook,
            StepsJson = template.StepsJson
        };

        db.UserFlows.Add(flow);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = flow.Id }, MapFlow(flow));
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<FlowDto>> Update(Guid id, [FromBody] UpdateFlowRequest request)
    {
        var flow = await db.UserFlows.FirstOrDefaultAsync(f => f.Id == id && f.UserId == GetUserId());
        if (flow is null) return NotFound();

        if (!string.IsNullOrWhiteSpace(request.Name)) flow.Name = request.Name;
        if (!string.IsNullOrWhiteSpace(request.Description)) flow.Description = request.Description;
        if (!string.IsNullOrWhiteSpace(request.Status)) flow.Status = request.Status;
        if (request.Steps is not null) flow.StepsJson = JsonSerializer.Serialize(request.Steps, JsonOptions);
        flow.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync();
        return Ok(MapFlow(flow));
    }

    [HttpPost("{id:guid}/trigger")]
    public async Task<ActionResult<FlowTriggerResultDto>> Trigger(Guid id)
    {
        try
        {
            var result = await flowService.TriggerFlowAsync(GetUserId(), id);
            return result is null ? NotFound() : Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("{id:guid}/email-metrics")]
    public async Task<ActionResult<FlowEmailMetricsDto>> GetEmailMetrics(Guid id)
    {
        var metrics = await flowService.GetFlowEmailMetricsAsync(GetUserId(), id);
        return metrics is null ? NotFound() : Ok(metrics);
    }

    [HttpGet("{id:guid}/results")]
    public async Task<ActionResult<FlowResultsDto>> GetResults(Guid id)
    {
        var results = await flowService.GetFlowResultsAsync(GetUserId(), id);
        return results is null ? NotFound() : Ok(results);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var flow = await db.UserFlows.FirstOrDefaultAsync(f => f.Id == id && f.UserId == GetUserId());
        if (flow is null) return NotFound();
        db.UserFlows.Remove(flow);
        await db.SaveChangesAsync();
        return NoContent();
    }

    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub")!);

    private static FlowDto MapFlow(UserFlow f)
    {
        var steps = FlowService.ParseSteps(f.StepsJson);
        object? metrics = string.IsNullOrWhiteSpace(f.SubscriptionMetricsJson)
            ? null
            : JsonSerializer.Deserialize<object>(f.SubscriptionMetricsJson, JsonOptions);
        return new FlowDto(
            f.Id.ToString(), f.Name, f.Description, f.Status, f.Triggers, f.Family, f.GoalExit,
            f.Priority, f.RequiresWebhook, steps, metrics, f.TemplateId);
    }
}
