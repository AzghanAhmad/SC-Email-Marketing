using Microsoft.EntityFrameworkCore;
using ScribeCount.Email.Api.Entities;

namespace ScribeCount.Email.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<FlowTemplate> FlowTemplates => Set<FlowTemplate>();
    public DbSet<UserFlow> UserFlows => Set<UserFlow>();
    public DbSet<MailboxConnection> MailboxConnections => Set<MailboxConnection>();
    public DbSet<MailboxMessage> MailboxMessages => Set<MailboxMessage>();
    public DbSet<Subscriber> Subscribers => Set<Subscriber>();
    public DbSet<CampaignMetric> CampaignMetrics => Set<CampaignMetric>();
    public DbSet<Campaign> Campaigns => Set<Campaign>();
    public DbSet<CampaignCalendarEvent> CampaignCalendarEvents => Set<CampaignCalendarEvent>();
    public DbSet<NewsletterSchedule> NewsletterSchedules => Set<NewsletterSchedule>();
    public DbSet<AbTest> AbTests => Set<AbTest>();
    public DbSet<SubscriberGrowthPoint> SubscriberGrowthPoints => Set<SubscriberGrowthPoint>();
    public DbSet<DashboardActivity> DashboardActivities => Set<DashboardActivity>();

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
    }
}
