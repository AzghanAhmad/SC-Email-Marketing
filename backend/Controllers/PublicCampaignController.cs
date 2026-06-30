using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ScribeCount.Email.Api.DTOs;
using ScribeCount.Email.Api.Services;

namespace ScribeCount.Email.Api.Controllers;

[ApiController]
[AllowAnonymous]
[Route("api/v1/public/campaigns")]
public class PublicCampaignController(CampaignService campaigns) : ControllerBase
{
    private static readonly byte[] TransparentGif =
    [
        0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00, 0x80, 0x00, 0x00,
        0xFF, 0xFF, 0xFF, 0x00, 0x00, 0x00, 0x21, 0xF9, 0x04, 0x01, 0x00, 0x00, 0x00,
        0x00, 0x2C, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0x02, 0x02,
        0x44, 0x01, 0x00, 0x3B
    ];

    [HttpGet("open.gif")]
    public async Task<IActionResult> TrackOpen([FromQuery] string token)
    {
        await campaigns.RecordCampaignOpenAsync(token);
        return File(TransparentGif, "image/gif");
    }

    [HttpGet("unsubscribe")]
    public async Task<ActionResult<UnsubscribePreviewDto>> GetUnsubscribePreview([FromQuery] string token)
    {
        var preview = await campaigns.GetUnsubscribePreviewAsync(token);
        return preview is null ? NotFound(new { message = "This unsubscribe link is invalid or has expired." }) : Ok(preview);
    }

    [HttpPost("unsubscribe")]
    public async Task<ActionResult<UnsubscribeResultDto>> ConfirmUnsubscribe([FromBody] UnsubscribeConfirmRequest request)
    {
        var result = await campaigns.ConfirmUnsubscribeAsync(request.Token);
        return result is null
            ? BadRequest(new { message = "Could not process unsubscribe request." })
            : Ok(result);
    }

    [HttpGet("view")]
    public async Task<ActionResult<CampaignViewDto>> ViewInBrowser([FromQuery] string token)
    {
        var view = await campaigns.GetCampaignViewAsync(token);
        return view is null ? NotFound(new { message = "This email view link is invalid or has expired." }) : Ok(view);
    }
}
