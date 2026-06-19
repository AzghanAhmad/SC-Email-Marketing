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
[Authorize]
[Route("api/v1/mailbox")]
public class MailboxController(AppDbContext db, MailboxService mailbox) : ControllerBase
{
    private static readonly JsonSerializerOptions JsonOptions = new() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

    [AllowAnonymous]
    [HttpGet("setup-instructions")]
    public ActionResult<MailboxSetupInstructionsDto> GetSetupInstructions() =>
        Ok(MailboxService.GetSetupInstructions());

    [HttpGet("connection")]
    public async Task<ActionResult<MailboxConnectionDto>> GetConnection()
    {
        var conn = await db.MailboxConnections.FirstOrDefaultAsync(c => c.UserId == GetUserId());
        if (conn is null)
        {
            return Ok(new MailboxConnectionDto(
                "", "imap.gmail.com", 993, true, "smtp.gmail.com", 587, true,
                "", "gmail", false, null));
        }
        return Ok(MapConnection(conn));
    }

    [HttpPost("test")]
    public async Task<IActionResult> TestConnection([FromBody] SaveMailboxConnectionRequest? request)
    {
        var validationError = ValidateMailboxRequest(request);
        if (validationError is not null) return BadRequest(new { message = validationError });

        var (success, message) = await mailbox.TestConnectionAsync(request!);
        return success ? Ok(new { message }) : BadRequest(new { message });
    }

    [HttpPost("connect")]
    public async Task<ActionResult<MailboxConnectionDto>> Connect([FromBody] SaveMailboxConnectionRequest? request)
    {
        var validationError = ValidateMailboxRequest(request);
        if (validationError is not null) return BadRequest(new { message = validationError });

        var (success, message) = await mailbox.TestConnectionAsync(request!);
        if (!success) return BadRequest(new { message });

        var conn = await mailbox.SaveConnectionAsync(GetUserId(), request!);
        var syncMessage = "Inbox connected.";
        try
        {
            var count = await mailbox.SyncInboxAsync(GetUserId());
            syncMessage = count > 0
                ? $"Inbox connected. Imported {count} message(s)."
                : "Inbox connected. No new messages found in your mailbox.";
        }
        catch (Exception ex)
        {
            syncMessage = $"Inbox connected, but sync failed: {ex.Message}";
        }

        return Ok(new { connection = MapConnection(conn), message = syncMessage });
    }

    [HttpPost("sync")]
    public async Task<ActionResult<object>> Sync()
    {
        try
        {
            var count = await mailbox.SyncInboxAsync(GetUserId());
            return Ok(new { synced = count, message = count > 0 ? $"Synced {count} message(s)." : "Sync complete. No new messages found." });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("messages")]
    public async Task<ActionResult<List<EmailDto>>> GetMessages([FromQuery] string? folder = null)
    {
        var query = db.MailboxMessages.Where(m => m.UserId == GetUserId());
        if (!string.IsNullOrWhiteSpace(folder)) query = query.Where(m => m.Folder == folder);
        var messages = await query.OrderByDescending(m => m.Timestamp).ToListAsync();
        return Ok(messages.Select(MapMessage).ToList());
    }

    [HttpPatch("messages/{id:guid}/read")]
    public async Task<IActionResult> MarkRead(Guid id, [FromQuery] bool read = true)
    {
        var msg = await db.MailboxMessages.FirstOrDefaultAsync(m => m.Id == id && m.UserId == GetUserId());
        if (msg is null) return NotFound();
        msg.Read = read;
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpPatch("messages/{id:guid}/star")]
    public async Task<IActionResult> ToggleStar(Guid id)
    {
        var msg = await db.MailboxMessages.FirstOrDefaultAsync(m => m.Id == id && m.UserId == GetUserId());
        if (msg is null) return NotFound();
        msg.Starred = !msg.Starred;
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("messages/{id:guid}")]
    public async Task<IActionResult> DeleteMessage(Guid id)
    {
        var msg = await db.MailboxMessages.FirstOrDefaultAsync(m => m.Id == id && m.UserId == GetUserId());
        if (msg is null) return NotFound();
        msg.Folder = "trash";
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpPut("messages/{id:guid}")]
    public async Task<ActionResult<EmailDto>> UpdateMessage(Guid id, [FromBody] UpdateMessageRequest request)
    {
        var msg = await db.MailboxMessages.FirstOrDefaultAsync(m => m.Id == id && m.UserId == GetUserId());
        if (msg is null) return NotFound();
        if (msg.Folder is not ("drafts" or "scheduled"))
            return BadRequest(new { message = "Only drafts and scheduled messages can be edited." });

        var conn = await db.MailboxConnections.FirstOrDefaultAsync(c => c.UserId == GetUserId());
        var fromEmail = conn?.EmailAddress ?? msg.FromEmail;
        var preview = request.Body.Length > 100 ? request.Body[..100] : request.Body;

        msg.ToEmail = request.To;
        msg.ToName = string.IsNullOrWhiteSpace(request.To) ? "(no recipient)" : request.To.Split('@')[0];
        msg.Subject = string.IsNullOrWhiteSpace(request.Subject) ? "(no subject)" : request.Subject;
        msg.Body = request.Body;
        msg.Preview = string.IsNullOrWhiteSpace(preview) ? "(empty draft)" : preview;
        msg.FromEmail = fromEmail;
        if (request.ScheduledAt.HasValue && msg.Folder == "scheduled")
            msg.Timestamp = request.ScheduledAt.Value;
        msg.AttachmentsJson = MailboxService.SerializeAttachments(request.Attachments, msg.AttachmentsJson);

        await db.SaveChangesAsync();
        return Ok(MapMessage(msg));
    }

    [HttpPost("send")]
    public async Task<IActionResult> Send([FromBody] SendEmailRequest request)
    {
        try
        {
            await mailbox.SendEmailAsync(GetUserId(), request);
            return Ok(new { message = "Email sent." });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("drafts")]
    public async Task<ActionResult<EmailDto>> SaveDraft([FromBody] SaveDraftRequest request)
    {
        var preview = request.Body.Length > 100 ? request.Body[..100] : request.Body;
        var conn = await db.MailboxConnections.FirstOrDefaultAsync(c => c.UserId == GetUserId());
        var fromEmail = conn?.EmailAddress ?? "you@scribecount.com";

        var msg = new MailboxMessage
        {
            Id = Guid.NewGuid(),
            UserId = GetUserId(),
            FromName = "You",
            FromEmail = fromEmail,
            ToName = string.IsNullOrWhiteSpace(request.To) ? "(no recipient)" : request.To.Split('@')[0],
            ToEmail = request.To,
            Subject = string.IsNullOrWhiteSpace(request.Subject) ? "(no subject)" : request.Subject,
            Preview = string.IsNullOrWhiteSpace(preview) ? "(empty draft)" : preview,
            Body = request.Body,
            Timestamp = DateTime.UtcNow,
            Read = true,
            Starred = false,
            Folder = "drafts",
            AttachmentsJson = MailboxService.SerializeAttachments(request.Attachments)
        };
        db.MailboxMessages.Add(msg);
        await db.SaveChangesAsync();
        return Ok(MapMessage(msg));
    }

    [HttpPost("schedule")]
    public async Task<ActionResult<EmailDto>> Schedule([FromBody] ScheduleEmailRequest request)
    {
        var preview = request.Body.Length > 100 ? request.Body[..100] : request.Body;
        var conn = await db.MailboxConnections.FirstOrDefaultAsync(c => c.UserId == GetUserId());
        var fromEmail = conn?.EmailAddress ?? "you@scribecount.com";

        var msg = new MailboxMessage
        {
            Id = Guid.NewGuid(),
            UserId = GetUserId(),
            FromName = "You",
            FromEmail = fromEmail,
            ToName = string.IsNullOrWhiteSpace(request.To) ? "(no recipient)" : request.To.Split('@')[0],
            ToEmail = request.To ?? string.Empty,
            Subject = request.Subject,
            Preview = preview,
            Body = request.Body,
            Timestamp = request.ScheduledAt ?? DateTime.UtcNow.AddHours(1),
            Read = true,
            Starred = false,
            Folder = "scheduled",
            AttachmentsJson = MailboxService.SerializeAttachments(request.Attachments)
        };
        db.MailboxMessages.Add(msg);
        await db.SaveChangesAsync();
        return Ok(MapMessage(msg));
    }

    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub")!);

    private static string? ValidateMailboxRequest(SaveMailboxConnectionRequest? request)
    {
        if (request is null) return "Connection details are required.";
        if (string.IsNullOrWhiteSpace(request.EmailAddress)) return "Email address is required.";
        if (string.IsNullOrWhiteSpace(request.Username)) return "Username is required.";
        if (string.IsNullOrWhiteSpace(request.Password)) return "Password or app password is required.";
        if (string.IsNullOrWhiteSpace(request.ImapHost)) return "IMAP host is required.";
        if (string.IsNullOrWhiteSpace(request.SmtpHost)) return "SMTP host is required.";
        if (request.ImapPort is < 1 or > 65535) return "IMAP port must be between 1 and 65535.";
        if (request.SmtpPort is < 1 or > 65535) return "SMTP port must be between 1 and 65535.";
        return null;
    }

    private static MailboxConnectionDto MapConnection(MailboxConnection c) =>
        new(c.EmailAddress, c.ImapHost, c.ImapPort, c.ImapUseSsl, c.SmtpHost, c.SmtpPort, c.SmtpUseSsl, c.Username, c.Provider, c.IsConnected, c.LastSyncedAt);

    private static EmailDto MapMessage(MailboxMessage m)
    {
        var attachments = JsonSerializer.Deserialize<List<EmailAttachmentDto>>(m.AttachmentsJson, JsonOptions) ?? [];
        var labels = string.IsNullOrWhiteSpace(m.LabelsJson)
            ? null
            : JsonSerializer.Deserialize<List<string>>(m.LabelsJson, JsonOptions);
        return new EmailDto(m.Id.ToString(), m.FromName, m.FromEmail, m.ToName, m.ToEmail, m.Subject, m.Preview, m.Body, m.Timestamp, m.Read, m.Starred, m.Folder, attachments, labels);
    }
}
