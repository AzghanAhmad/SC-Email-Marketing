using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ScribeCount.Email.Api.DTOs;
using ScribeCount.Email.Api.Services;

namespace ScribeCount.Email.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/v1/settings")]
public class SettingsController(SettingsService settings) : ControllerBase
{
    private Guid UserId => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub")!);

    [HttpGet]
    public async Task<ActionResult<UserSettingsDto>> Get() => Ok(await settings.GetAsync(UserId));

    [HttpPut("notifications")]
    public async Task<ActionResult<UserSettingsDto>> UpdateNotifications([FromBody] UpdateNotificationsRequest request) =>
        Ok(await settings.UpdateNotificationsAsync(UserId, request));

    [HttpPut("preferences")]
    public async Task<ActionResult<UserSettingsDto>> UpdatePreferences([FromBody] UpdatePreferencesRequest request) =>
        Ok(await settings.UpdatePreferencesAsync(UserId, request));

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
