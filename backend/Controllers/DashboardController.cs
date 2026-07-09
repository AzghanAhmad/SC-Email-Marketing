using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ScribeCount.Email.Api.Data;
using ScribeCount.Email.Api.Services;

namespace ScribeCount.Email.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/v1/dashboard")]
public class DashboardController(AppDbContext db, DashboardService dashboard) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<object>> GetDashboard([FromQuery] int days = 7)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub")!);
        var user = await db.Users.FindAsync(userId);
        if (user is null) return NotFound();

        var data = await dashboard.GetDashboardAsync(userId, user.Name, Math.Clamp(days, 7, 365));
        return Ok(data);
    }
}
