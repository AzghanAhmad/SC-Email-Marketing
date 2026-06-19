using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ScribeCount.Email.Api.Data;
using ScribeCount.Email.Api.DTOs;
using ScribeCount.Email.Api.Entities;

namespace ScribeCount.Email.Api.Controllers;

[ApiController]
[Route("api/v1/flow-templates")]
public class FlowTemplatesController(AppDbContext db) : ControllerBase
{
    private static readonly JsonSerializerOptions JsonOptions = new() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

    [HttpGet]
    public async Task<ActionResult<List<FlowTemplateDto>>> GetAll()
    {
        var templates = await db.FlowTemplates.OrderBy(t => t.Id).ToListAsync();
        return Ok(templates.Select(MapTemplate).ToList());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<FlowTemplateDto>> GetById(string id)
    {
        var template = await db.FlowTemplates.FindAsync(id);
        if (template is null) return NotFound();
        return Ok(MapTemplate(template));
    }

    private static FlowTemplateDto MapTemplate(FlowTemplate t)
    {
        var steps = JsonSerializer.Deserialize<List<FlowStepDto>>(t.StepsJson, JsonOptions) ?? [];
        return new FlowTemplateDto(t.Id, t.Name, t.Family, t.Description, t.GoalExit, t.EstimatedSetupMinutes, t.Priority, t.RequiresWebhook, steps);
    }
}
