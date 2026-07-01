using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ScribeCount.Email.Api.DTOs;
using ScribeCount.Email.Api.Services;

namespace ScribeCount.Email.Api.Controllers;

[ApiController]
[AllowAnonymous]
[Route("api/v1/public/website")]
public class PublicWebsiteController(WebsiteService website) : ControllerBase
{
    [HttpGet("forms/{id:guid}")]
    public async Task<ActionResult<PublicFormPreviewDto>> GetForm(Guid id)
    {
        var form = await website.GetPublicFormAsync(id);
        return form is null ? NotFound() : Ok(form);
    }

    [HttpPost("forms/{id:guid}/submit")]
    public async Task<ActionResult<PublicFormSubmitResult>> SubmitForm(Guid id, [FromBody] PublicFormSubmitRequest request)
    {
        var result = await website.SubmitFormAsync(id, request);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpGet("landing-pages/{slug}")]
    public async Task<ActionResult<PublicLandingPageDto>> GetLandingPage(string slug)
    {
        var page = await website.GetPublicLandingPageAsync(slug);
        return page is null ? NotFound() : Ok(page);
    }

    [HttpPost("landing-pages/{slug}/submit")]
    public async Task<ActionResult<PublicFormSubmitResult>> SubmitLandingPage(string slug, [FromBody] PublicFormSubmitRequest request)
    {
        var result = await website.SubmitLandingPageAsync(slug, request);
        return result is null ? NotFound() : Ok(result);
    }
}
