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

    [HttpPost("forms")]
    public async Task<ActionResult<SignUpFormDto>> CreateForm([FromBody] CreateSignUpFormRequest request) =>
        Ok(await website.CreateFormAsync(UserId, request));

    [HttpPost("landing-pages")]
    public async Task<ActionResult<LandingPageDto>> CreateLandingPage([FromBody] CreateLandingPageRequest request) =>
        Ok(await website.CreateLandingPageAsync(UserId, request));
}
