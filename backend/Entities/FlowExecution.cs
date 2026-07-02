namespace ScribeCount.Email.Api.Entities;

public class FlowRun
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid UserFlowId { get; set; }
    public string Status { get; set; } = "running";
    public int EnrolledCount { get; set; }
    public int CompletedCount { get; set; }
    public DateTime StartedAt { get; set; } = DateTime.UtcNow;
    public DateTime? CompletedAt { get; set; }

    public User User { get; set; } = null!;
    public UserFlow UserFlow { get; set; } = null!;
    public ICollection<FlowEnrollment> Enrollments { get; set; } = [];
}

public class FlowEnrollment
{
    public Guid Id { get; set; }
    public Guid FlowRunId { get; set; }
    public Guid SubscriberId { get; set; }
    public string Token { get; set; } = "";
    public int CurrentStepIndex { get; set; }
    public string Status { get; set; } = "in_progress";
    public DateTime StartedAt { get; set; } = DateTime.UtcNow;
    public DateTime? CompletedAt { get; set; }

    public FlowRun FlowRun { get; set; } = null!;
    public Subscriber Subscriber { get; set; } = null!;
    public ICollection<FlowStepResponse> Responses { get; set; } = [];
}

public class FlowStepResponse
{
    public Guid Id { get; set; }
    public Guid FlowEnrollmentId { get; set; }
    public string StepId { get; set; } = "";
    public string StepLabel { get; set; } = "";
    public string StepType { get; set; } = "";
    public string ResponseJson { get; set; } = "{}";
    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;

    public FlowEnrollment FlowEnrollment { get; set; } = null!;
}
