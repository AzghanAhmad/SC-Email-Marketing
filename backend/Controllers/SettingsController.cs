using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ScribeCount.Email.Api.DTOs;
using ScribeCount.Email.Api.Services;

namespace ScribeCount.Email.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/v1/settings")]
public class SettingsController(SettingsService settings, SenderIdentityService senderIdentity) : ControllerBase
{
    private Guid UserId => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub")!);

    [HttpGet]
    public async Task<ActionResult<UserSettingsDto>> Get() => Ok(await settings.GetAsync(UserId));

    [HttpGet("sender")]
    public async Task<ActionResult<SenderIdentityDto>> GetSender() =>
        Ok(await senderIdentity.GetAsync(UserId));

    [HttpPost("sender/request-otp")]
    public async Task<ActionResult<SenderOtpResponse>> RequestSenderOtp([FromBody] RequestSenderOtpRequest request) =>
        Ok(await senderIdentity.RequestOtpAsync(UserId, request));

    [HttpPost("sender/verify-otp")]
    public async Task<ActionResult<SenderOtpResponse>> VerifySenderOtp([FromBody] VerifySenderOtpRequest request) =>
        Ok(await senderIdentity.VerifyOtpAsync(UserId, request));

    [HttpPut("notifications")]
    public async Task<ActionResult<UserSettingsDto>> UpdateNotifications([FromBody] UpdateNotificationsRequest request) =>
        Ok(await settings.UpdateNotificationsAsync(UserId, request));

    [HttpPut("preferences")]
    public async Task<ActionResult<UserSettingsDto>> UpdatePreferences([FromBody] UpdatePreferencesRequest request) =>
        Ok(await settings.UpdatePreferencesAsync(UserId, request));

    [HttpPost("preferences/apply-footer")]
    public async Task<ActionResult<ApplyFooterResultDto>> ApplyFooterToCampaigns([FromBody] ApplyFooterToCampaignsRequest request)
    {
        var count = await settings.ApplyFooterToCampaignsAsync(UserId, request);
        return Ok(new ApplyFooterResultDto(count, count == 1
            ? "Footer applied to 1 campaign."
            : $"Footer applied to {count} campaigns."));
    }

    [HttpPut("store")]
    public async Task<ActionResult<UserSettingsDto>> UpdateStore([FromBody] UpdateStoreConnectionRequest request) =>
        Ok(await settings.UpdateStoreAsync(UserId, request));

    [HttpPost("store/connect")]
    public async Task<ActionResult<UserSettingsDto>> ConnectStore([FromBody] ConnectStoreRequest request) =>
        Ok(await settings.ConnectStoreAsync(UserId, request));

    [HttpPost("store/disconnect")]
    public async Task<ActionResult<UserSettingsDto>> DisconnectStore() =>
        Ok(await settings.DisconnectStoreAsync(UserId));

    [HttpPost("store/test")]
    public async Task<ActionResult<UserSettingsDto>> TestStore() =>
        Ok(await settings.TestStoreConnectionAsync(UserId));
}
