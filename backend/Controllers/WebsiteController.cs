using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ScribeCount.Email.Api.DTOs;
using ScribeCount.Email.Api.Services;

namespace ScribeCount.Email.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/v1/website")]
public class WebsiteController(WebsiteService website) : ControllerBase
{
    private Guid UserId => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub")!);

    [HttpGet]
    public async Task<ActionResult<WebsiteBundleDto>> GetWebsite() =>
        Ok(await website.GetBundleAsync(UserId));

    [HttpGet("forms/{id:guid}")]
    public async Task<ActionResult<SignUpFormDto>> GetForm(Guid id)
    {
        var form = await website.GetFormAsync(UserId, id);
        return form is null ? NotFound() : Ok(form);
    }

    [HttpPost("forms")]
    public async Task<ActionResult<SignUpFormDto>> CreateForm([FromBody] CreateSignUpFormRequest request) =>
        Ok(await website.CreateFormAsync(UserId, request));

    [HttpPut("forms/{id:guid}")]
    public async Task<ActionResult<SignUpFormDto>> UpdateForm(Guid id, [FromBody] UpdateSignUpFormRequest request)
    {
        var form = await website.UpdateFormAsync(UserId, id, request);
        return form is null ? NotFound() : Ok(form);
    }

    [HttpDelete("forms/{id:guid}")]
    public async Task<IActionResult> DeleteForm(Guid id) =>
        await website.DeleteFormAsync(UserId, id) ? NoContent() : NotFound();

    [HttpGet("forms/{id:guid}/preview")]
    public async Task<ActionResult<PublicFormPreviewDto>> PreviewForm(Guid id)
    {
        var form = await website.GetPublicFormAsync(id, allowDraft: true);
        if (form is null) return NotFound();
        var owned = await website.GetFormAsync(UserId, id);
        return owned is null ? NotFound() : Ok(form);
    }

    [HttpGet("landing-pages/{id:guid}")]
    public async Task<ActionResult<LandingPageDto>> GetLandingPage(Guid id)
    {
        var page = await website.GetLandingPageAsync(UserId, id);
        return page is null ? NotFound() : Ok(page);
    }

    [HttpPost("landing-pages")]
    public async Task<ActionResult<LandingPageDto>> CreateLandingPage([FromBody] CreateLandingPageRequest request) =>
        Ok(await website.CreateLandingPageAsync(UserId, request));

    [HttpPut("landing-pages/{id:guid}")]
    public async Task<ActionResult<LandingPageDto>> UpdateLandingPage(Guid id, [FromBody] UpdateLandingPageRequest request)
    {
        try
        {
            var page = await website.UpdateLandingPageAsync(UserId, id, request);
            return page is null ? NotFound() : Ok(page);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("landing-pages/{id:guid}")]
    public async Task<IActionResult> DeleteLandingPage(Guid id) =>
        await website.DeleteLandingPageAsync(UserId, id) ? NoContent() : NotFound();

    [HttpGet("landing-pages/{id:guid}/preview")]
    public async Task<ActionResult<PublicLandingPageDto>> PreviewLandingPage(Guid id)
    {
        var page = await website.GetLandingPagePreviewAsync(UserId, id);
        return page is null ? NotFound() : Ok(page);
    }
}
