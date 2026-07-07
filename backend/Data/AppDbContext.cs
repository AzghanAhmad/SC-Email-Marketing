using Microsoft.EntityFrameworkCore;
using ScribeCount.Email.Api.Entities;

namespace ScribeCount.Email.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<FlowTemplate> FlowTemplates => Set<FlowTemplate>();
    public DbSet<UserFlow> UserFlows => Set<UserFlow>();
    public DbSet<FlowRun> FlowRuns => Set<FlowRun>();
    public DbSet<FlowEnrollment> FlowEnrollments => Set<FlowEnrollment>();
    public DbSet<FlowStepResponse> FlowStepResponses => Set<FlowStepResponse>();
    public DbSet<MailboxConnection> MailboxConnections => Set<MailboxConnection>();
    public DbSet<MailboxMessage> MailboxMessages => Set<MailboxMessage>();
    public DbSet<Subscriber> Subscribers => Set<Subscriber>();
    public DbSet<CampaignMetric> CampaignMetrics => Set<CampaignMetric>();
    public DbSet<Campaign> Campaigns => Set<Campaign>();
    public DbSet<CampaignCalendarEvent> CampaignCalendarEvents => Set<CampaignCalendarEvent>();
    public DbSet<NewsletterSchedule> NewsletterSchedules => Set<NewsletterSchedule>();
    public DbSet<AbTest> AbTests => Set<AbTest>();
    public DbSet<AbTestVote> AbTestVotes => Set<AbTestVote>();
    public DbSet<ReleasePlan> ReleasePlans => Set<ReleasePlan>();
    public DbSet<SubscriberGrowthPoint> SubscriberGrowthPoints => Set<SubscriberGrowthPoint>();
    public DbSet<DashboardActivity> DashboardActivities => Set<DashboardActivity>();
    public DbSet<AudienceFolder> AudienceFolders => Set<AudienceFolder>();
    public DbSet<AudienceList> AudienceLists => Set<AudienceList>();
    public DbSet<AudienceSegmentItem> AudienceSegmentItems => Set<AudienceSegmentItem>();
    public DbSet<EmailTemplate> EmailTemplates => Set<EmailTemplate>();
    public DbSet<ContentBlock> ContentBlocks => Set<ContentBlock>();
    public DbSet<BrandProfile> BrandProfiles => Set<BrandProfile>();
    public DbSet<BrandAsset> BrandAssets => Set<BrandAsset>();
    public DbSet<SignUpForm> SignUpForms => Set<SignUpForm>();
    public DbSet<LandingPage> LandingPages => Set<LandingPage>();
    public DbSet<GrowthToolConfig> GrowthToolConfigs => Set<GrowthToolConfig>();
    public DbSet<SubscriberActivity> SubscriberActivities => Set<SubscriberActivity>();
    public DbSet<UserSettings> UserSettings => Set<UserSettings>();
    public DbSet<SenderIdentity> SenderIdentities => Set<SenderIdentity>();
    public DbSet<OutboundEmailMessage> OutboundEmailMessages => Set<OutboundEmailMessage>();
    public DbSet<DeliveryEvent> DeliveryEvents => Set<DeliveryEvent>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(e =>
        {
            e.HasIndex(x => x.Email).IsUnique();
        });

        modelBuilder.Entity<FlowTemplate>(e =>
        {
            e.HasKey(x => x.Id);
        });

        modelBuilder.Entity<UserFlow>(e =>
        {
            e.HasOne(x => x.User).WithMany(x => x.Flows).HasForeignKey(x => x.UserId);
        });

        modelBuilder.Entity<FlowRun>(e =>
        {
            e.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId);
            e.HasOne(x => x.UserFlow).WithMany().HasForeignKey(x => x.UserFlowId);
        });

        modelBuilder.Entity<FlowEnrollment>(e =>
        {
            e.HasOne(x => x.FlowRun).WithMany(x => x.Enrollments).HasForeignKey(x => x.FlowRunId);
            e.HasOne(x => x.Subscriber).WithMany().HasForeignKey(x => x.SubscriberId);
            e.HasIndex(x => x.Token).IsUnique();
        });

        modelBuilder.Entity<FlowStepResponse>(e =>
        {
            e.HasOne(x => x.FlowEnrollment).WithMany(x => x.Responses).HasForeignKey(x => x.FlowEnrollmentId);
        });

        modelBuilder.Entity<MailboxConnection>(e =>
        {
            e.HasOne(x => x.User).WithOne(x => x.MailboxConnection).HasForeignKey<MailboxConnection>(x => x.UserId);
            e.HasIndex(x => x.UserId).IsUnique();
        });

        modelBuilder.Entity<MailboxMessage>(e =>
        {
            e.HasOne(x => x.User).WithMany(x => x.MailboxMessages).HasForeignKey(x => x.UserId);
            e.HasIndex(x => new { x.UserId, x.Folder });
        });

        modelBuilder.Entity<Subscriber>(e =>
        {
            e.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId);
            e.HasIndex(x => x.UserId);
            e.HasIndex(x => new { x.UserId, x.ListId });
        });

        modelBuilder.Entity<CampaignMetric>(e =>
        {
            e.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId);
            e.HasIndex(x => x.UserId);
        });

        modelBuilder.Entity<SubscriberGrowthPoint>(e =>
        {
            e.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId);
            e.HasIndex(x => new { x.UserId, x.SortOrder });
        });

        modelBuilder.Entity<DashboardActivity>(e =>
        {
            e.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId);
            e.HasIndex(x => new { x.UserId, x.OccurredAt });
        });

        modelBuilder.Entity<Campaign>(e =>
        {
            e.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId);
            e.Property(x => x.Status).HasMaxLength(64);
            e.HasIndex(x => new { x.UserId, x.Status });
        });

        modelBuilder.Entity<CampaignCalendarEvent>(e =>
        {
            e.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId);
            e.HasIndex(x => x.UserId);
        });

        modelBuilder.Entity<NewsletterSchedule>(e =>
        {
            e.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId);
            e.HasIndex(x => x.UserId).IsUnique();
        });

        modelBuilder.Entity<AbTest>(e =>
        {
            e.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId);
            e.HasIndex(x => x.UserId);
        });

        modelBuilder.Entity<AbTestVote>(e =>
        {
            e.HasOne(x => x.AbTest).WithMany(x => x.Votes).HasForeignKey(x => x.AbTestId);
            e.HasIndex(x => new { x.AbTestId, x.VoterKey }).IsUnique();
        });

        modelBuilder.Entity<ReleasePlan>(e =>
        {
            e.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId);
            e.HasIndex(x => x.UserId).IsUnique();
        });

        modelBuilder.Entity<AudienceFolder>(e =>
        {
            e.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId);
            e.HasIndex(x => new { x.UserId, x.Kind });
        });

        modelBuilder.Entity<AudienceList>(e =>
        {
            e.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId);
            e.HasOne(x => x.Folder).WithMany().HasForeignKey(x => x.FolderId).OnDelete(DeleteBehavior.SetNull);
            e.HasIndex(x => x.UserId);
        });

        modelBuilder.Entity<AudienceSegmentItem>(e =>
        {
            e.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId);
            e.HasOne(x => x.Folder).WithMany().HasForeignKey(x => x.FolderId).OnDelete(DeleteBehavior.SetNull);
            e.HasIndex(x => x.UserId);
        });

        modelBuilder.Entity<EmailTemplate>(e =>
        {
            e.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId);
            e.HasIndex(x => x.UserId);
        });

        modelBuilder.Entity<ContentBlock>(e =>
        {
            e.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId);
            e.HasIndex(x => x.UserId);
        });

        modelBuilder.Entity<BrandProfile>(e =>
        {
            e.HasKey(x => x.UserId);
            e.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId);
        });

        modelBuilder.Entity<BrandAsset>(e =>
        {
            e.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId);
            e.HasIndex(x => x.UserId);
        });

        modelBuilder.Entity<SignUpForm>(e =>
        {
            e.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId);
            e.HasIndex(x => x.UserId);
        });

        modelBuilder.Entity<LandingPage>(e =>
        {
            e.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId);
            e.HasIndex(x => new { x.UserId, x.Slug }).IsUnique();
        });

        modelBuilder.Entity<GrowthToolConfig>(e =>
        {
            e.HasKey(x => new { x.UserId, x.ToolKey });
            e.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId);
        });

        modelBuilder.Entity<SubscriberActivity>(e =>
        {
            e.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId);
            e.HasOne(x => x.Subscriber).WithMany().HasForeignKey(x => x.SubscriberId);
            e.HasIndex(x => new { x.SubscriberId, x.OccurredAt });
        });

        modelBuilder.Entity<UserSettings>(e =>
        {
            e.HasKey(x => x.UserId);
            e.HasOne(x => x.User).WithOne().HasForeignKey<UserSettings>(x => x.UserId);
        });

        modelBuilder.Entity<SenderIdentity>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId);
            e.HasIndex(x => x.UserId).IsUnique();
            e.HasIndex(x => x.FromEmail);
            e.Property(x => x.FromEmail).HasMaxLength(320);
            e.Property(x => x.PendingEmail).HasMaxLength(320);
            e.Property(x => x.FromName).HasMaxLength(200);
            e.Property(x => x.PendingName).HasMaxLength(200);
            e.Property(x => x.OtpHash).HasMaxLength(128);
        });

        modelBuilder.Entity<OutboundEmailMessage>(e =>
        {
            e.ToTable("SesOutboundMessages");
            e.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId);
            e.HasIndex(x => x.SesMessageId);
            e.HasIndex(x => new { x.UserId, x.SentAt });
            e.Property(x => x.Status).HasMaxLength(32);
            e.Property(x => x.Source).HasMaxLength(64);
            e.Property(x => x.ToEmail).HasMaxLength(320);
            e.Property(x => x.SesMessageId).HasMaxLength(200);
        });

        modelBuilder.Entity<DeliveryEvent>(e =>
        {
            e.ToTable("SesDeliveryEvents");
            e.HasIndex(x => x.SesMessageId);
            e.HasIndex(x => new { x.UserId, x.OccurredAt });
            e.HasIndex(x => new { x.Email, x.EventType });
            e.Property(x => x.EventType).HasMaxLength(32);
            e.Property(x => x.BounceType).HasMaxLength(32);
            e.Property(x => x.Email).HasMaxLength(320);
            e.Property(x => x.SesMessageId).HasMaxLength(200);
            e.Property(x => x.Source).HasMaxLength(64);
        });
    }
}
