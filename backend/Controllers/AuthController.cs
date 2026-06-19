using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ScribeCount.Email.Api.Data;
using ScribeCount.Email.Api.DTOs;
using ScribeCount.Email.Api.Entities;
using ScribeCount.Email.Api.Services;

namespace ScribeCount.Email.Api.Controllers;

[ApiController]
[Route("api/v1/auth")]
public class AuthController(AppDbContext db, JwtTokenService jwt) : ControllerBase
{
    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name) || string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            return BadRequest(new { message = "Name, email, and password are required." });

        var email = request.Email.Trim().ToLowerInvariant();
        if (await db.Users.AnyAsync(u => u.Email == email))
            return Conflict(new { message = "An account with this email already exists." });

        var user = new User
        {
            Id = Guid.NewGuid(),
            Name = request.Name.Trim(),
            Email = email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password)
        };

        db.Users.Add(user);
        await db.SaveChangesAsync();

        return Ok(new AuthResponse(jwt.GenerateToken(user), ToUserDto(user, false)));
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        var user = await db.Users.Include(u => u.MailboxConnection).FirstOrDefaultAsync(u => u.Email == email);
        if (user is null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            return Unauthorized(new { message = "Invalid email or password." });

        return Ok(new AuthResponse(jwt.GenerateToken(user), ToUserDto(user, user.MailboxConnection?.IsConnected == true)));
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult<UserDto>> Me()
    {
        var userId = GetUserId();
        var user = await db.Users.Include(u => u.MailboxConnection).FirstOrDefaultAsync(u => u.Id == userId);
        if (user is null) return NotFound();
        return Ok(ToUserDto(user, user.MailboxConnection?.IsConnected == true));
    }

    [Authorize]
    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
    {
        var user = await db.Users.FindAsync(GetUserId());
        if (user is null) return NotFound();
        if (!BCrypt.Net.BCrypt.Verify(request.CurrentPassword, user.PasswordHash))
            return BadRequest(new { message = "Current password is incorrect." });

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
        await db.SaveChangesAsync();
        return NoContent();
    }

    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub)!);

    private static UserDto ToUserDto(User user, bool mailboxConnected) =>
        new(user.Id.ToString(), user.Name, user.Email, null, mailboxConnected);
}
