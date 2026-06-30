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

    [HttpPost("blocks")]
    public async Task<ActionResult<ContentBlockDto>> CreateBlock([FromBody] CreateContentBlockRequest request) =>
        Ok(await content.CreateBlockAsync(UserId, request));

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
}
