using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using ScribeCount.Email.Api.Data;
using ScribeCount.Email.Api.DTOs;
using ScribeCount.Email.Api.Entities;

namespace ScribeCount.Email.Api.Services;

public class FlowService(AppDbContext db, SesEmailService ses, ILogger<FlowService> logger)
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

        ValidateEmailStepsBeforeTrigger(flow, steps);

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

        await QueueScheduledEmailsAsync(userId, flow, run.Id, subscribers);

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

    public async Task<FlowEmailMetricsDto?> GetFlowEmailMetricsAsync(Guid userId, Guid flowId)
    {
        var flow = await db.UserFlows.AsNoTracking()
            .FirstOrDefaultAsync(f => f.Id == flowId && f.UserId == userId);
        if (flow is null) return null;

        var steps = ParseSteps(flow.StepsJson)
            .Where(s => s.Type.Equals("email", StringComparison.OrdinalIgnoreCase))
            .ToList();

        var outbound = await db.OutboundEmailMessages.AsNoTracking()
            .Where(m => m.FlowId == flowId && m.UserId == userId)
            .ToListAsync();

        var emails = new List<FlowEmailMetricDto>();
        foreach (var step in steps)
        {
            var matches = outbound.Where(m => MatchesEmailStep(m, step)).ToList();
            var sent = matches.Count;
            var delivered = matches.Count(m =>
                string.Equals(m.Status, "delivered", StringComparison.OrdinalIgnoreCase)
                || m.DeliveredAt.HasValue);
            var deliveryRate = sent > 0 ? Math.Round(delivered / (double)sent * 100, 1) : 0;
            emails.Add(new FlowEmailMetricDto(
                step.Id,
                step.Label,
                step.ScheduledAt,
                sent,
                delivered,
                deliveryRate,
                deliveryRate));
        }

        var signals = BuildEmailSignals(emails);
        var totalSent = outbound.Count;
        var totalDelivered = outbound.Count(m =>
            string.Equals(m.Status, "delivered", StringComparison.OrdinalIgnoreCase)
            || m.DeliveredAt.HasValue);

        return new FlowEmailMetricsDto(flow.Triggers, totalSent, totalDelivered, emails, signals);
    }

    public async Task ProcessDueFlowEmailsAsync(CancellationToken cancellationToken = default)
    {
        var due = await db.FlowEmailQueue
            .Where(q => q.Status == "pending" && q.ScheduledAtUtc <= DateTime.UtcNow)
            .OrderBy(q => q.ScheduledAtUtc)
            .Take(40)
            .ToListAsync(cancellationToken);

        if (due.Count == 0) return;

        foreach (var item in due)
        {
            var subscriber = await db.Subscribers.FindAsync([item.SubscriberId], cancellationToken);
            if (subscriber is null || !string.Equals(subscriber.Status, "active", StringComparison.OrdinalIgnoreCase))
            {
                item.Status = "skipped";
                item.ErrorMessage = "Subscriber inactive";
                continue;
            }

            try
            {
                await ses.SendAsync(new PlatformSendRequest(
                    item.UserId,
                    subscriber.Email,
                    item.Subject,
                    item.HtmlBody,
                    "flow",
                    subscriber.Id,
                    FlowId: item.FlowId,
                    StepId: item.StepId), cancellationToken);
                item.Status = "sent";
                item.SentAt = DateTime.UtcNow;
                item.ErrorMessage = null;
            }
            catch (Exception ex)
            {
                item.Status = "failed";
                item.ErrorMessage = ex.Message.Length > 500 ? ex.Message[..500] : ex.Message;
                logger.LogWarning(ex, "Failed to send queued flow email {QueueId}", item.Id);
            }
        }

        await db.SaveChangesAsync(cancellationToken);
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

    private static void ValidateEmailStepsBeforeTrigger(UserFlow flow, List<FlowStepDto> steps)
    {
        var emailSteps = steps
            .Where(s => s.Type.Equals("email", StringComparison.OrdinalIgnoreCase))
            .ToList();
        if (emailSteps.Count == 0) return;

        var isWelcomeSequence = string.Equals(flow.TemplateId, "t1", StringComparison.OrdinalIgnoreCase);
        var problems = new List<string>();

        foreach (var step in emailSteps)
        {
            var missing = new List<string>();
            if (string.IsNullOrWhiteSpace(step.Subject))
                missing.Add("subject line");
            if (string.IsNullOrWhiteSpace(step.EmailBody))
                missing.Add("email body");
            if (isWelcomeSequence && string.IsNullOrWhiteSpace(step.ScheduledAt))
                missing.Add("send date & time");

            if (missing.Count > 0)
                problems.Add($"{step.Label}: add {string.Join(" and ", missing)}");
        }

        if (problems.Count > 0)
        {
            throw new InvalidOperationException(
                "Complete all email steps before triggering this flow. " + string.Join(" · ", problems));
        }
    }

    private static bool MatchesEmailStep(OutboundEmailMessage message, FlowStepDto step)
    {
        if (!string.IsNullOrWhiteSpace(message.StepId) && message.StepId == step.Id)
            return true;
        return !string.IsNullOrWhiteSpace(step.Subject)
            && string.Equals(message.Subject, step.Subject, StringComparison.Ordinal);
    }

    private static List<FlowEmailSignalDto> BuildEmailSignals(List<FlowEmailMetricDto> emails)
    {
        var signals = new List<FlowEmailSignalDto>();
        if (emails.Count == 0)
        {
            signals.Add(new FlowEmailSignalDto("warn", "No flow emails sent yet — trigger the flow to start collecting data."));
            return signals;
        }

        if (emails.All(e => e.Sent == 0))
        {
            signals.Add(new FlowEmailSignalDto("warn", "Emails are scheduled but none have been sent yet. Check send dates or wait for the scheduled time."));
            return signals;
        }

        for (var i = 1; i < emails.Count; i++)
        {
            var prev = emails[i - 1];
            var curr = emails[i];
            if (prev.Sent > 0 && curr.Sent > 0 && curr.DeliveryRate < prev.DeliveryRate - 8)
            {
                signals.Add(new FlowEmailSignalDto("warn",
                    $"Delivery rate dropped at {curr.StepLabel} — review subject line or send timing."));
            }
        }

        var best = emails.Where(e => e.Sent > 0).OrderByDescending(e => e.DeliveryRate).FirstOrDefault();
        if (best is not null && best.DeliveryRate >= 90)
        {
            signals.Add(new FlowEmailSignalDto("good",
                $"{best.StepLabel} is performing strongly with {best.DeliveryRate}% delivery rate."));
        }

        if (signals.Count == 0)
            signals.Add(new FlowEmailSignalDto("good", "Flow emails are sending — keep monitoring delivery rates per step."));

        return signals;
    }

    private async Task QueueScheduledEmailsAsync(
        Guid userId, UserFlow flow, Guid runId, List<Subscriber> subscribers)
    {
        var steps = ParseSteps(flow.StepsJson);
        var emailSteps = steps
            .Where(s => s.Type.Equals("email", StringComparison.OrdinalIgnoreCase))
            .ToList();
        if (emailSteps.Count == 0) return;

        var baseUrl = Environment.GetEnvironmentVariable("PUBLIC_APP_URL") ?? "http://localhost:4200";
        var now = DateTime.UtcNow;

        foreach (var subscriber in subscribers)
        {
            if (!string.Equals(subscriber.Status, "active", StringComparison.OrdinalIgnoreCase))
                continue;

            var enrollment = await db.FlowEnrollments
                .FirstOrDefaultAsync(e => e.FlowRunId == runId && e.SubscriberId == subscriber.Id);
            if (enrollment is null) continue;

            var link = $"{baseUrl.TrimEnd('/')}/flow/respond/{enrollment.Token}";

            foreach (var emailStep in emailSteps)
            {
                var scheduledAt = ResolveScheduledAt(emailStep, now);
                var body = $"{emailStep.EmailBody}<p><a href=\"{link}\">Open your flow steps</a></p>";

                db.FlowEmailQueue.Add(new FlowEmailQueueItem
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    FlowId = flow.Id,
                    FlowRunId = runId,
                    FlowEnrollmentId = enrollment.Id,
                    SubscriberId = subscriber.Id,
                    StepId = emailStep.Id,
                    Subject = emailStep.Subject!.Trim(),
                    HtmlBody = body,
                    ScheduledAtUtc = scheduledAt,
                    Status = "pending",
                });
            }
        }

        await db.SaveChangesAsync();
    }

    private static DateTime ResolveScheduledAt(FlowStepDto emailStep, DateTime fallbackUtc)
    {
        if (!string.IsNullOrWhiteSpace(emailStep.ScheduledAt)
            && DateTime.TryParse(emailStep.ScheduledAt, null, System.Globalization.DateTimeStyles.RoundtripKind, out var parsed))
        {
            return parsed.Kind switch
            {
                DateTimeKind.Utc => parsed,
                DateTimeKind.Local => parsed.ToUniversalTime(),
                _ => DateTime.SpecifyKind(parsed, DateTimeKind.Utc),
            };
        }

        return fallbackUtc;
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
