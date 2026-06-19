using Microsoft.EntityFrameworkCore;
using MySqlConnector;
using ScribeCount.Email.Api.Data;

namespace ScribeCount.Email.Api.Services;

public static class MigrationHelper
{
    private static readonly IReadOnlyDictionary<string, string[]> MigrationTables = new Dictionary<string, string[]>
    {
        ["20260619072423_InitialCreate"] =
        [
            "Users", "FlowTemplates", "MailboxConnections", "MailboxMessages", "UserFlows"
        ],
        ["20260619112347_AddDashboardEntities"] =
        [
            "CampaignMetrics", "DashboardActivities", "SubscriberGrowthPoints", "Subscribers"
        ],
        ["20260619150000_AddCampaignEntities"] =
        [
            "Campaigns", "CampaignCalendarEvents", "NewsletterSchedules", "AbTests"
        ],
    };

    public static async Task MigrateAsync(AppDbContext db, ILogger logger, CancellationToken cancellationToken = default)
    {
        await ReconcileAppliedMigrationsAsync(db, logger, cancellationToken);

        try
        {
            await db.Database.MigrateAsync(cancellationToken);
        }
        catch (MySqlException ex) when (IsAlreadyExists(ex))
        {
            logger.LogWarning(ex, "Migration DDL conflict — reconciling migration history and retrying");
            await ReconcileAppliedMigrationsAsync(db, logger, cancellationToken);
            await db.Database.MigrateAsync(cancellationToken);
        }
    }

    private static bool IsAlreadyExists(MySqlException ex) =>
        ex.Message.Contains("already exists", StringComparison.OrdinalIgnoreCase);

    private static async Task ReconcileAppliedMigrationsAsync(
        AppDbContext db,
        ILogger logger,
        CancellationToken cancellationToken)
    {
        var pending = await db.Database.GetPendingMigrationsAsync(cancellationToken);
        var applied = (await db.Database.GetAppliedMigrationsAsync(cancellationToken)).ToHashSet();

        foreach (var migrationId in pending)
        {
            if (!MigrationTables.TryGetValue(migrationId, out var tables))
                continue;

            if (!applied.Contains(migrationId) && await AllTablesExistAsync(db, tables, cancellationToken))
            {
                await db.Database.ExecuteSqlRawAsync(
                    "INSERT IGNORE INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`) VALUES ({0}, {1})",
                    [migrationId, "9.0.4"],
                    cancellationToken);
                logger.LogInformation(
                    "Marked migration {MigrationId} as applied because all tables already exist",
                    migrationId);
            }
        }
    }

    private static async Task<bool> AllTablesExistAsync(
        AppDbContext db,
        IEnumerable<string> tables,
        CancellationToken cancellationToken)
    {
        foreach (var table in tables)
        {
            if (!await TableExistsAsync(db, table, cancellationToken))
                return false;
        }

        return true;
    }

    private static async Task<bool> TableExistsAsync(
        AppDbContext db,
        string table,
        CancellationToken cancellationToken)
    {
        var connection = db.Database.GetDbConnection();
        var shouldClose = connection.State != System.Data.ConnectionState.Open;
        if (shouldClose)
            await connection.OpenAsync(cancellationToken);

        try
        {
            await using var command = connection.CreateCommand();
            command.CommandText = """
                SELECT COUNT(*)
                FROM information_schema.tables
                WHERE table_schema = DATABASE()
                  AND table_name = @table
                """;
            var parameter = command.CreateParameter();
            parameter.ParameterName = "@table";
            parameter.Value = table;
            command.Parameters.Add(parameter);

            var result = await command.ExecuteScalarAsync(cancellationToken);
            return Convert.ToInt64(result) > 0;
        }
        finally
        {
            if (shouldClose)
                await connection.CloseAsync();
        }
    }
}
