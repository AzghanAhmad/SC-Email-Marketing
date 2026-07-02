using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ScribeCount.Email.Api.DTOs;
using ScribeCount.Email.Api.Services;

namespace ScribeCount.Email.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/v1/content")]
public class ContentController(ContentService content, CampaignService campaigns) : ControllerBase
{
    private Guid UserId => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub")!);

    [HttpGet]
    public async Task<ActionResult<ContentBundleDto>> GetContent() =>
        Ok(await content.GetBundleAsync(UserId));

    [HttpGet("templates/{id:guid}")]
    public async Task<ActionResult<EmailTemplateDto>> GetTemplate(Guid id)
    {
        var template = await content.GetTemplateAsync(UserId, id);
        return template is null ? NotFound() : Ok(template);
    }

    [HttpPost("templates")]
    public async Task<ActionResult<EmailTemplateDto>> CreateCustomTemplate([FromBody] CreateCustomTemplateRequest request)
    {
        try
        {
            return Ok(await content.CreateCustomTemplateAsync(UserId, request));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("templates/{id:guid}")]
    public async Task<ActionResult<EmailTemplateDto>> UpdateTemplate(Guid id, [FromBody] UpdateEmailTemplateRequest request)
    {
        var template = await content.UpdateTemplateAsync(UserId, id, request);
        return template is null ? NotFound(new { message = "Custom template not found." }) : Ok(template);
    }

    [HttpDelete("templates/{id:guid}")]
    public async Task<IActionResult> DeleteTemplate(Guid id)
    {
        var deleted = await content.DeleteTemplateAsync(UserId, id);
        return deleted ? NoContent() : NotFound(new { message = "Custom template not found." });
    }

    [HttpPost("templates/{templateId:guid}/blocks/{blockId:guid}")]
    public async Task<ActionResult<EmailTemplateDto>> AppendBlockToTemplate(
        Guid templateId, Guid blockId, [FromBody] AppendBlockToTemplateRequest? request = null)
    {
        var template = await content.AppendBlockToTemplateAsync(UserId, templateId, blockId, request);
        return template is null
            ? NotFound(new { message = "Custom template or block not found." })
            : Ok(template);
    }

    [HttpGet("website-templates/{id}")]
    public ActionResult<WebsiteTemplateDto> GetWebsiteTemplate(string id)
    {
        var template = content.GetWebsiteTemplate(id);
        return template is null ? NotFound() : Ok(template);
    }

    [HttpPost("templates/{id:guid}/use")]
    public async Task<ActionResult<CampaignDto>> UseTemplate(Guid id)
    {
        var template = await content.GetTemplateAsync(UserId, id);
        if (template is null) return NotFound();

        var created = await campaigns.CreateCampaignAsync(UserId, new CreateCampaignRequest(
            Name: $"{template.Name} Campaign",
            Subject: template.SubjectLine,
            PreviewText: template.PreviewText,
            Content: template.HtmlBody,
            CampaignType: template.SuggestedCampaignType,
            FromName: null,
            SendToSegment: "all",
            Status: "draft",
            ScheduledAt: null,
            Extras: new Dictionary<string, string> { ["emailTemplateId"] = template.Id }
        ));
        return Ok(created);
    }

    [HttpGet("blocks/{id:guid}")]
    public async Task<ActionResult<ContentBlockDto>> GetBlock(Guid id)
    {
        var block = await content.GetBlockAsync(UserId, id);
        return block is null ? NotFound() : Ok(block);
    }

    [HttpPost("blocks")]
    public async Task<ActionResult<ContentBlockDto>> CreateBlock([FromBody] CreateContentBlockRequest request) =>
        Ok(await content.CreateBlockAsync(UserId, request));

    [HttpPut("blocks/{id:guid}")]
    public async Task<ActionResult<ContentBlockDto>> UpdateBlock(Guid id, [FromBody] UpdateContentBlockRequest request)
    {
        var block = await content.UpdateBlockAsync(UserId, id, request);
        return block is null ? NotFound() : Ok(block);
    }

    [HttpDelete("blocks/{id:guid}")]
    public async Task<IActionResult> DeleteBlock(Guid id)
    {
        var deleted = await content.DeleteBlockAsync(UserId, id);
        return deleted ? NoContent() : NotFound();
    }

    [HttpPost("blocks/{id:guid}/use")]
    public async Task<ActionResult<CampaignDto>> UseBlock(Guid id)
    {
        var block = await content.GetBlockAsync(UserId, id);
        if (block is null) return NotFound();

        await content.RecordBlockUseAsync(UserId, id);

        var created = await campaigns.CreateCampaignAsync(UserId, new CreateCampaignRequest(
            Name: $"{block.Name} Campaign",
            Subject: "",
            PreviewText: "",
            Content: block.HtmlBody,
            CampaignType: "newsletter",
            FromName: null,
            SendToSegment: "all",
            Status: "draft",
            ScheduledAt: null,
            Extras: new Dictionary<string, string>
            {
                ["contentBlockId"] = block.Id,
                ["contentBlockName"] = block.Name
            }
        ));
        return Ok(created);
    }

    [HttpPut("brand/colors")]
    public async Task<ActionResult<List<BrandColorDto>>> UpdateBrandColors([FromBody] UpdateBrandColorsRequest request) =>
        Ok(await content.UpdateBrandColorsAsync(UserId, request));

    [HttpPost("brand/assets")]
    public async Task<ActionResult<BrandAssetDto>> CreateAsset([FromBody] CreateBrandAssetRequest request) =>
        Ok(await content.CreateAssetAsync(UserId, request));

    [HttpPost("brand/assets/upload")]
    [RequestSizeLimit(10 * 1024 * 1024)]
    public async Task<ActionResult<BrandAssetDto>> UploadAsset(
        [FromForm] IFormFile file,
        [FromForm] string name,
        [FromForm] string assetCategory)
    {
        try
        {
            return Ok(await content.UploadAssetAsync(UserId, file, name, assetCategory));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("brand/assets/{id:guid}")]
    public async Task<IActionResult> DeleteAsset(Guid id)
    {
        var deleted = await content.DeleteAssetAsync(UserId, id);
        return deleted ? NoContent() : NotFound();
    }
}
