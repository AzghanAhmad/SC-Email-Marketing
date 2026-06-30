using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using ScribeCount.Email.Api.Data;

namespace ScribeCount.Email.Api.Middleware;

public class StaleSessionMiddleware(RequestDelegate next)
{
    public const string Message = "Your session is no longer valid. Please sign out and sign in again.";

    public async Task InvokeAsync(HttpContext context, AppDbContext db)
    {
        if (context.User.Identity?.IsAuthenticated == true
            && context.Request.Path.StartsWithSegments("/api"))
        {
            var userIdClaim = context.User.FindFirstValue(JwtRegisteredClaimNames.Sub)
                ?? context.User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (Guid.TryParse(userIdClaim, out var userId)
                && !await db.Users.AsNoTracking().AnyAsync(u => u.Id == userId))
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                await context.Response.WriteAsJsonAsync(new { message = Message });
                return;
            }
        }

        await next(context);
    }
}

public static class StaleSessionMiddlewareExtensions
{
    public static IApplicationBuilder UseStaleSessionGuard(this IApplicationBuilder app) =>
        app.UseMiddleware<StaleSessionMiddleware>();
}
