using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ScribeCount.Email.Api.DTOs;
using ScribeCount.Email.Api.Services;

namespace ScribeCount.Email.Api.Controllers;

[ApiController]
[AllowAnonymous]
[Route("api/v1/public/flows")]
public class PublicFlowController(FlowService flows) : ControllerBase
{
    [HttpGet("respond/{token}")]
    public async Task<ActionResult<PublicFlowEnrollmentDto>> GetEnrollment(string token)
    {
        var enrollment = await flows.GetPublicEnrollmentAsync(token);
        return enrollment is null ? NotFound(new { message = "This flow link is invalid or expired." }) : Ok(enrollment);
    }

    [HttpPost("respond/{token}")]
    public async Task<ActionResult<PublicFlowEnrollmentDto>> SubmitStep(string token, [FromBody] SubmitFlowStepRequest request)
    {
        try
        {
            var result = await flows.SubmitStepAsync(token, request);
            return result is null ? NotFound(new { message = "This flow link is invalid or expired." }) : Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
