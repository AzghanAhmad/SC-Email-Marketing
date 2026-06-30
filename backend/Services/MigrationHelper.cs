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
        ["20260626125706_SyncCampaignModel"] =
        [
            "Campaigns", "CampaignCalendarEvents", "NewsletterSchedules", "AbTests"
        ],
    };

    public static async Task MigrateAsync(AppDbContext db, ILogger logger, CancellationToken cancellationToken = default)
    {
        var connectionString = db.Database.GetConnectionString();
        if (!string.IsNullOrWhiteSpace(connectionString))
            await DatabaseConfiguration.EnsureDatabaseExistsAsync(connectionString, logger, cancellationToken);

        await ReconcileAppliedMigrationsAsync(db, logger, cancellationToken);

        try
        {
            await db.Database.MigrateAsync(cancellationToken);
        }
        catch (MySqlException ex) when (IsAlreadyExists(ex) || IsKeyTooLong(ex))
        {
            logger.LogWarning(ex, "Migration DDL conflict — reconciling migration history and retrying");
            await ReconcileAppliedMigrationsAsync(db, logger, cancellationToken);
            await db.Database.MigrateAsync(cancellationToken);
        }

        await EnsureCampaignSchemaAsync(db, logger, cancellationToken);
    }

    private static bool IsKeyTooLong(MySqlException ex) =>
        ex.Message.Contains("key was too long", StringComparison.OrdinalIgnoreCase);

    private static bool IsAlreadyExists(MySqlException ex) =>
        ex.Message.Contains("already exists", StringComparison.OrdinalIgnoreCase);

    private static async Task EnsureCampaignSchemaAsync(
        AppDbContext db,
        ILogger logger,
        CancellationToken cancellationToken)
    {
        if (!await TableExistsAsync(db, "Campaigns", cancellationToken))
            return;

        await db.Database.ExecuteSqlRawAsync("""
            SET @sql = IF(
                (SELECT DATA_TYPE FROM information_schema.COLUMNS
                 WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Campaigns' AND COLUMN_NAME = 'Status') = 'longtext',
                'ALTER TABLE `Campaigns` MODIFY `Status` varchar(64) CHARACTER SET utf8mb4 NOT NULL',
                'SELECT 1');
            PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
            """, cancellationToken);

        await db.Database.ExecuteSqlRawAsync("""
            SET @sql = IF(
                (SELECT COUNT(*) FROM information_schema.statistics
                 WHERE table_schema = DATABASE() AND table_name = 'Campaigns' AND index_name = 'IX_Campaigns_UserId_Status') = 0,
                'CREATE INDEX `IX_Campaigns_UserId_Status` ON `Campaigns` (`UserId`, `Status`)',
                'SELECT 1');
            PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
            """, cancellationToken);

        logger.LogDebug("Campaign schema verified (Status column + UserId/Status index)");
    }

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
                  AND LOWER(table_name) = LOWER(@table)
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
