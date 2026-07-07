using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ScribeCount.Email.Api.DTOs;
using ScribeCount.Email.Api.Services;

namespace ScribeCount.Email.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/v1/audience")]
public class AudienceController(AudienceService audience) : ControllerBase
{
    private Guid UserId => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub")!);

    [HttpGet("profiles")]
    public async Task<ActionResult<List<SubscriberProfileDto>>> GetProfiles(
        [FromQuery] string? search,
        [FromQuery] string? status,
        [FromQuery] Guid? listId,
        [FromQuery] Guid? segmentId) =>
        Ok(await audience.GetProfilesAsync(UserId, search, status, listId, segmentId));

    [HttpPost("profiles")]
    public async Task<ActionResult<SubscriberProfileDto>> CreateProfile([FromBody] CreateSubscriberRequest request) =>
        Ok(await audience.CreateProfileAsync(UserId, request));

    [HttpGet("profiles/{id:guid}")]
    public async Task<ActionResult<SubscriberProfileDetailDto>> GetProfile(Guid id)
    {
        var profile = await audience.GetProfileDetailAsync(UserId, id);
        return profile is null ? NotFound() : Ok(profile);
    }

    [HttpPut("profiles/{id:guid}")]
    public async Task<ActionResult<SubscriberProfileDetailDto>> UpdateProfile(Guid id, [FromBody] UpdateSubscriberRequest request)
    {
        var profile = await audience.UpdateProfileAsync(UserId, id, request);
        return profile is null ? NotFound() : Ok(profile);
    }

    [HttpDelete("profiles/{id:guid}")]
    public async Task<IActionResult> DeleteProfile(Guid id)
    {
        var deleted = await audience.DeleteProfileAsync(UserId, id);
        return deleted ? NoContent() : NotFound();
    }

    [HttpPost("import")]
    public async Task<ActionResult<ImportSubscribersResult>> ImportSubscribers(
        [FromBody] ImportSubscribersRequest request) =>
        Ok(await audience.ImportSubscribersAsync(UserId, request));

    [HttpGet("lists-segments")]
    public async Task<ActionResult<ListsSegmentsBundleDto>> GetListsSegments() =>
        Ok(await audience.GetListsSegmentsAsync(UserId));

    [HttpPost("folders")]
    public async Task<ActionResult<AudienceFolderDto>> CreateFolder([FromBody] CreateAudienceFolderRequest request) =>
        Ok(await audience.CreateFolderAsync(UserId, request));

    [HttpPost("lists")]
    public async Task<ActionResult<AudienceListDto>> CreateList([FromBody] CreateAudienceListRequest request) =>
        Ok(await audience.CreateListAsync(UserId, request));

    [HttpPost("segments")]
    public async Task<ActionResult<AudienceSegmentCardDto>> CreateSegment([FromBody] CreateAudienceSegmentRequest request) =>
        Ok(await audience.CreateSegmentAsync(UserId, request));

    [HttpGet("growth-tools")]
    public async Task<ActionResult<GrowthToolsBundleDto>> GetGrowthTools() =>
        Ok(await audience.GetGrowthToolsAsync(UserId));

    [HttpPut("growth-tools/{toolKey}")]
    public async Task<IActionResult> SaveGrowthToolConfig(string toolKey, [FromBody] SaveGrowthToolConfigRequest request)
    {
        await audience.SaveGrowthToolConfigAsync(UserId, toolKey, request);
        return NoContent();
    }
}
