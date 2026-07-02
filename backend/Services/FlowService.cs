using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using ScribeCount.Email.Api.Data;
using ScribeCount.Email.Api.DTOs;
using ScribeCount.Email.Api.Entities;

namespace ScribeCount.Email.Api.Services;

public class FlowService(AppDbContext db, MailboxService mailbox, ILogger<FlowService> logger)
{
    private static readonly JsonSerializerOptions JsonOptions = new() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

    private static readonly HashSet<string> AutoAdvanceTypes = new(StringComparer.OrdinalIgnoreCase)
    {
        "trigger", "billing-trigger", "wait", "goal-exit"
    };

    public async Task<FlowTriggerResultDto?> TriggerFlowAsync(Guid userId, Guid flowId)
    {
        var flow = await db.UserFlows.FirstOrDefaultAsync(f => f.Id == flowId && f.UserId == userId);
        if (flow is null) return null;

        if (!string.Equals(flow.Status, "active", StringComparison.OrdinalIgnoreCase))
            throw new InvalidOperationException("Activate this flow before triggering it.");

        var steps = ParseSteps(flow.StepsJson);
        if (steps.Count == 0)
            throw new InvalidOperationException("Add at least one step before triggering this flow.");

        var subscribers = await db.Subscribers
            .Where(s => s.UserId == userId && s.Status == "active")
            .ToListAsync();

        if (subscribers.Count == 0)
            throw new InvalidOperationException("No active subscribers to enroll in this flow.");

        var run = new FlowRun
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            UserFlowId = flowId,
            Status = "running",
            EnrolledCount = subscribers.Count,
            StartedAt = DateTime.UtcNow,
        };
        db.FlowRuns.Add(run);

        var startIndex = FirstInteractiveStepIndex(steps);
        foreach (var subscriber in subscribers)
        {
            var token = Convert.ToHexString(Guid.NewGuid().ToByteArray()).ToLowerInvariant();
            db.FlowEnrollments.Add(new FlowEnrollment
            {
                Id = Guid.NewGuid(),
                FlowRunId = run.Id,
                SubscriberId = subscriber.Id,
                Token = token,
                CurrentStepIndex = startIndex,
                Status = startIndex >= steps.Count ? "completed" : "in_progress",
                StartedAt = DateTime.UtcNow,
                CompletedAt = startIndex >= steps.Count ? DateTime.UtcNow : null,
            });
        }

        flow.Triggers += 1;
        flow.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();

        await NotifyEnrolledSubscribersAsync(userId, flow, run.Id, subscribers);

        if (startIndex >= steps.Count)
        {
            run.Status = "complete";
            run.CompletedAt = DateTime.UtcNow;
            run.CompletedCount = subscribers.Count;
            await db.SaveChangesAsync();
        }

        return new FlowTriggerResultDto(
            run.Id.ToString(),
            subscribers.Count,
            $"Flow triggered for {subscribers.Count} subscriber(s).");
    }

    public async Task<FlowResultsDto?> GetFlowResultsAsync(Guid userId, Guid flowId)
    {
        var flow = await db.UserFlows.AsNoTracking().FirstOrDefaultAsync(f => f.Id == flowId && f.UserId == userId);
        if (flow is null) return null;

        var runs = await db.FlowRuns.AsNoTracking()
            .Where(r => r.UserFlowId == flowId && r.UserId == userId)
            .OrderByDescending(r => r.StartedAt)
            .ToListAsync();

        var enrollments = await db.FlowEnrollments.AsNoTracking()
            .Include(e => e.Subscriber)
            .Include(e => e.Responses)
            .Where(e => e.FlowRun.UserFlowId == flowId && e.FlowRun.UserId == userId)
            .OrderByDescending(e => e.StartedAt)
            .ToListAsync();

        var responses = enrollments
            .SelectMany(e => e.Responses.Select(r => new FlowResponseRowDto(
                e.Subscriber.Name,
                e.Subscriber.Email,
                r.StepLabel,
                r.StepType,
                SummarizeResponse(r.ResponseJson),
                r.SubmittedAt)))
            .OrderByDescending(r => r.SubmittedAt)
            .ToList();

        return new FlowResultsDto(
            flowId.ToString(),
            runs.Count,
            enrollments.Count,
            enrollments.Count(e => e.Status == "completed"),
            enrollments.Count(e => e.Status == "in_progress"),
            runs.Select(r => new FlowRunSummaryDto(
                r.Id.ToString(),
                r.StartedAt,
                r.Status,
                r.EnrolledCount,
                r.CompletedCount)).ToList(),
            responses);
    }

    public async Task<PublicFlowEnrollmentDto?> GetPublicEnrollmentAsync(string token)
    {
        var enrollment = await db.FlowEnrollments
            .Include(e => e.Subscriber)
            .Include(e => e.FlowRun).ThenInclude(r => r.UserFlow)
            .FirstOrDefaultAsync(e => e.Token == token);

        if (enrollment is null) return null;

        var flow = enrollment.FlowRun.UserFlow;
        var steps = ParseSteps(flow.StepsJson);

        if (enrollment.Status == "completed" || enrollment.CurrentStepIndex >= steps.Count)
        {
            return new PublicFlowEnrollmentDto(
                flow.Name,
                enrollment.Subscriber.Name,
                null,
                steps.Count,
                steps.Count,
                true,
                "You have completed this flow. Thank you!");
        }

        var current = steps[enrollment.CurrentStepIndex];
        return new PublicFlowEnrollmentDto(
            flow.Name,
            enrollment.Subscriber.Name,
            current,
            enrollment.CurrentStepIndex + 1,
            steps.Count,
            false,
            null);
    }

    public async Task<PublicFlowEnrollmentDto?> SubmitStepAsync(string token, SubmitFlowStepRequest request)
    {
        var enrollment = await db.FlowEnrollments
            .Include(e => e.Subscriber)
            .Include(e => e.FlowRun).ThenInclude(r => r.UserFlow)
            .Include(e => e.FlowRun).ThenInclude(r => r.Enrollments)
            .FirstOrDefaultAsync(e => e.Token == token);

        if (enrollment is null) return null;
        if (enrollment.Status == "completed")
            throw new InvalidOperationException("This flow is already completed.");

        var flow = enrollment.FlowRun.UserFlow;
        var steps = ParseSteps(flow.StepsJson);
        if (enrollment.CurrentStepIndex >= steps.Count)
        {
            enrollment.Status = "completed";
            enrollment.CompletedAt = DateTime.UtcNow;
            await db.SaveChangesAsync();
            return await GetPublicEnrollmentAsync(token);
        }

        var step = steps[enrollment.CurrentStepIndex];
        var responses = request.Responses ?? new Dictionary<string, string>();

        ValidateStepSubmission(step, responses);

        db.FlowStepResponses.Add(new FlowStepResponse
        {
            Id = Guid.NewGuid(),
            FlowEnrollmentId = enrollment.Id,
            StepId = step.Id,
            StepLabel = step.Label,
            StepType = step.Type,
            ResponseJson = JsonSerializer.Serialize(responses, JsonOptions),
            SubmittedAt = DateTime.UtcNow,
        });

        enrollment.CurrentStepIndex = NextStepIndex(steps, enrollment.CurrentStepIndex + 1);

        if (enrollment.CurrentStepIndex >= steps.Count)
        {
            enrollment.Status = "completed";
            enrollment.CompletedAt = DateTime.UtcNow;
            enrollment.FlowRun.CompletedCount = enrollment.FlowRun.Enrollments.Count(e => e.Status == "completed" || e.Id == enrollment.Id);
            if (enrollment.FlowRun.CompletedCount >= enrollment.FlowRun.EnrolledCount)
            {
                enrollment.FlowRun.Status = "complete";
                enrollment.FlowRun.CompletedAt = DateTime.UtcNow;
            }
        }

        await db.SaveChangesAsync();
        return await GetPublicEnrollmentAsync(token);
    }

    public static List<FlowStepDto> ParseSteps(string stepsJson) =>
        JsonSerializer.Deserialize<List<FlowStepDto>>(stepsJson, JsonOptions) ?? [];

    private static int FirstInteractiveStepIndex(List<FlowStepDto> steps)
    {
        for (var i = 0; i < steps.Count; i++)
        {
            if (!AutoAdvanceTypes.Contains(steps[i].Type))
                return i;
        }
        return steps.Count;
    }

    private static int NextStepIndex(List<FlowStepDto> steps, int fromIndex)
    {
        for (var i = fromIndex; i < steps.Count; i++)
        {
            if (!AutoAdvanceTypes.Contains(steps[i].Type))
                return i;
        }
        return steps.Count;
    }

    private static void ValidateStepSubmission(FlowStepDto step, Dictionary<string, string> responses)
    {
        if (step.Type.Equals("email", StringComparison.OrdinalIgnoreCase))
            return;

        if (step.Type.Equals("form", StringComparison.OrdinalIgnoreCase))
        {
            foreach (var field in step.FormFields ?? [])
            {
                responses.TryGetValue(field.Id, out var val);
                if (field.Required && string.IsNullOrWhiteSpace(val))
                    throw new InvalidOperationException($"\"{field.Label}\" is required.");
            }
            return;
        }

        if (step.Type.Equals("condition", StringComparison.OrdinalIgnoreCase))
        {
            if (!responses.ContainsKey("choice") || string.IsNullOrWhiteSpace(responses["choice"]))
                throw new InvalidOperationException("Please select an option.");
        }
    }

    private async Task NotifyEnrolledSubscribersAsync(Guid userId, UserFlow flow, Guid runId, List<Subscriber> subscribers)
    {
        var steps = ParseSteps(flow.StepsJson);
        var firstEmail = steps.FirstOrDefault(s => s.Type.Equals("email", StringComparison.OrdinalIgnoreCase));
        var subject = firstEmail?.Subject ?? $"You're invited: {flow.Name}";
        var bodyTemplate = firstEmail?.EmailBody ?? $"<p>You've been enrolled in <strong>{flow.Name}</strong>.</p>";

        foreach (var subscriber in subscribers)
        {
            var enrollment = await db.FlowEnrollments
                .FirstOrDefaultAsync(e => e.FlowRunId == runId && e.SubscriberId == subscriber.Id);
            if (enrollment is null) continue;

            var baseUrl = Environment.GetEnvironmentVariable("PUBLIC_APP_URL") ?? "http://localhost:4200";
            var link = $"{baseUrl.TrimEnd('/')}/flow/respond/{enrollment.Token}";
            var body = $"{bodyTemplate}<p><a href=\"{link}\">Open your flow steps</a></p>";

            try
            {
                await mailbox.SendEmailAsync(userId, new SendEmailRequest(
                    subscriber.Email,
                    subject,
                    body));
            }
            catch (Exception ex)
            {
                logger.LogWarning(ex, "Could not send flow notification to {Email}", subscriber.Email);
            }
        }
    }

    private static string SummarizeResponse(string json)
    {
        try
        {
            var dict = JsonSerializer.Deserialize<Dictionary<string, string>>(json, JsonOptions) ?? [];
            if (dict.Count == 0) return "Completed";
            return string.Join("; ", dict.Select(kv => $"{kv.Key}: {kv.Value}"));
        }
        catch
        {
            return json.Length > 120 ? json[..120] + "…" : json;
        }
    }
}
