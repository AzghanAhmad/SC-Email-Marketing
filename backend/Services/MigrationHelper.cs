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
        ["20260704120000_AddUserSettings"] = ["UserSettings"],
        ["20260707120000_AddSenderIdentity"] = ["SenderIdentities"],
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
        await EnsureAbTestSchemaAsync(db, logger, cancellationToken);
        await EnsureSesSchemaAsync(db, logger, cancellationToken);
        await EnsureFlowEmailSchemaAsync(db, logger, cancellationToken);
        await EnsureUserSettingsSchemaAsync(db, logger, cancellationToken);
        await EnsureSenderIdentitySchemaAsync(db, logger, cancellationToken);
        await EnsureBrandAssetSchemaAsync(db, logger, cancellationToken);
        await EnsureMySqlPacketSizeAsync(db, logger, cancellationToken);
    }

    private static bool IsKeyTooLong(MySqlException ex) =>
        ex.Message.Contains("key was too long", StringComparison.OrdinalIgnoreCase);

    private static bool IsAlreadyExists(MySqlException ex) =>
        ex.Message.Contains("already exists", StringComparison.OrdinalIgnoreCase)
        || ex.Message.Contains("Duplicate column", StringComparison.OrdinalIgnoreCase);

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

    private static async Task EnsureAbTestSchemaAsync(
        AppDbContext db,
        ILogger logger,
        CancellationToken cancellationToken)
    {
        if (!await TableExistsAsync(db, "AbTests", cancellationToken))
            return;

        var columns = new (string Table, string Column, string Definition)[]
        {
            ("AbTests", "EndsAt", "datetime(6) NULL"),
            ("AbTests", "Content", "longtext CHARACTER SET utf8mb4 NULL"),
            ("AbTests", "SendToSegment", "varchar(64) CHARACTER SET utf8mb4 NOT NULL DEFAULT 'all'"),
            ("AbTests", "AutoSendWinner", "tinyint(1) NOT NULL DEFAULT 1"),
            ("AbTests", "CampaignIdA", "char(36) CHARACTER SET ascii COLLATE ascii_general_ci NULL"),
            ("AbTests", "CampaignIdB", "char(36) CHARACTER SET ascii COLLATE ascii_general_ci NULL"),
            ("AbTests", "HeldSubscriberIdsJson", "longtext CHARACTER SET utf8mb4 NULL"),
            ("AbTests", "WinnerCampaignId", "char(36) CHARACTER SET ascii COLLATE ascii_general_ci NULL"),
            ("AbTests", "WinnerSentAt", "datetime(6) NULL"),
        };

        foreach (var (table, column, definition) in columns)
            await EnsureColumnAsync(db, table, column, definition, cancellationToken);

        await db.Database.ExecuteSqlRawAsync(
            "UPDATE `AbTests` SET `Content` = '' WHERE `Content` IS NULL",
            cancellationToken);
        await db.Database.ExecuteSqlRawAsync(
            "UPDATE `AbTests` SET `HeldSubscriberIdsJson` = '[]' WHERE `HeldSubscriberIdsJson` IS NULL",
            cancellationToken);

        logger.LogDebug("AbTests schema verified");
    }

    private static async Task EnsureUserSettingsSchemaAsync(
        AppDbContext db,
        ILogger logger,
        CancellationToken cancellationToken)
    {
        if (await TableExistsAsync(db, "UserSettings", cancellationToken))
            return;

        await db.Database.ExecuteSqlRawAsync("""
            CREATE TABLE IF NOT EXISTS `UserSettings` (
                `UserId` char(36) COLLATE ascii_general_ci NOT NULL,
                `Json` longtext CHARACTER SET utf8mb4 NOT NULL,
                `UpdatedAt` datetime(6) NOT NULL,
                PRIMARY KEY (`UserId`),
                CONSTRAINT `FK_UserSettings_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `Users` (`Id`) ON DELETE CASCADE
            ) CHARACTER SET=utf8mb4;
            """, cancellationToken);

        logger.LogInformation("Created UserSettings table");
    }

    private static async Task EnsureSenderIdentitySchemaAsync(
        AppDbContext db,
        ILogger logger,
        CancellationToken cancellationToken)
    {
        if (await TableExistsAsync(db, "SenderIdentities", cancellationToken))
            return;

        await db.Database.ExecuteSqlRawAsync("""
            CREATE TABLE IF NOT EXISTS `SenderIdentities` (
                `Id` char(36) COLLATE ascii_general_ci NOT NULL,
                `UserId` char(36) COLLATE ascii_general_ci NOT NULL,
                `FromEmail` varchar(320) CHARACTER SET utf8mb4 NOT NULL,
                `FromName` varchar(200) CHARACTER SET utf8mb4 NOT NULL,
                `Verified` tinyint(1) NOT NULL DEFAULT 0,
                `VerifiedAt` datetime(6) NULL,
                `PendingEmail` varchar(320) CHARACTER SET utf8mb4 NOT NULL,
                `PendingName` varchar(200) CHARACTER SET utf8mb4 NOT NULL,
                `OtpHash` varchar(128) CHARACTER SET utf8mb4 NOT NULL,
                `OtpExpiresAt` datetime(6) NULL,
                `OtpLastSentAt` datetime(6) NULL,
                `OtpAttempts` int NOT NULL DEFAULT 0,
                `CreatedAt` datetime(6) NOT NULL,
                `UpdatedAt` datetime(6) NOT NULL,
                PRIMARY KEY (`Id`),
                UNIQUE KEY `IX_SenderIdentities_UserId` (`UserId`),
                KEY `IX_SenderIdentities_FromEmail` (`FromEmail`),
                CONSTRAINT `FK_SenderIdentities_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `Users` (`Id`) ON DELETE CASCADE
            ) CHARACTER SET=utf8mb4;
            """, cancellationToken);

        logger.LogInformation("Created SenderIdentities table");
    }

    private static async Task EnsureBrandAssetSchemaAsync(
        AppDbContext db,
        ILogger logger,
        CancellationToken cancellationToken)
    {
        if (!await TableExistsAsync(db, "BrandAssets", cancellationToken))
            return;

        var columns = new (string Table, string Column, string Definition)[]
        {
            ("BrandAssets", "StoragePath", "longtext CHARACTER SET utf8mb4 NULL"),
            ("BrandAssets", "MimeType", "longtext CHARACTER SET utf8mb4 NULL"),
        };

        foreach (var (table, column, definition) in columns)
            await EnsureColumnAsync(db, table, column, definition, cancellationToken);

        logger.LogDebug("BrandAssets schema verified");
    }

    private static async Task EnsureColumnAsync(
        AppDbContext db,
        string table,
        string column,
        string definition,
        CancellationToken cancellationToken)
    {
        if (await ColumnExistsAsync(db, table, column, cancellationToken))
            return;

        await db.Database.ExecuteSqlRawAsync(
            $"ALTER TABLE `{table}` ADD `{column}` {definition}",
            cancellationToken);
    }

    private static async Task<bool> ColumnExistsAsync(
        AppDbContext db,
        string table,
        string column,
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
                FROM information_schema.columns
                WHERE table_schema = DATABASE()
                  AND LOWER(table_name) = LOWER(@table)
                  AND LOWER(column_name) = LOWER(@column)
                """;
            var tableParam = command.CreateParameter();
            tableParam.ParameterName = "@table";
            tableParam.Value = table;
            command.Parameters.Add(tableParam);

            var columnParam = command.CreateParameter();
            columnParam.ParameterName = "@column";
            columnParam.Value = column;
            command.Parameters.Add(columnParam);

            var result = await command.ExecuteScalarAsync(cancellationToken);
            return Convert.ToInt64(result) > 0;
        }
        finally
        {
            if (shouldClose)
                await connection.CloseAsync();
        }
    }

    private static async Task EnsureSesSchemaAsync(
        AppDbContext db,
        ILogger logger,
        CancellationToken cancellationToken)
    {
        await EnsureSesTableAsync(db, logger, "SesOutboundMessages", """
            CREATE TABLE `SesOutboundMessages` (
                `Id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
                `UserId` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
                `SubscriberId` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NULL,
                `CampaignId` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NULL,
                `FlowId` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NULL,
                `Source` varchar(64) CHARACTER SET utf8mb4 NOT NULL,
                `ToEmail` varchar(320) CHARACTER SET utf8mb4 NOT NULL,
                `Subject` longtext CHARACTER SET utf8mb4 NOT NULL,
                `SesMessageId` varchar(200) CHARACTER SET utf8mb4 NOT NULL,
                `Status` varchar(32) CHARACTER SET utf8mb4 NOT NULL,
                `SentAt` datetime(6) NOT NULL,
                `DeliveredAt` datetime(6) NULL,
                `BouncedAt` datetime(6) NULL,
                `ComplainedAt` datetime(6) NULL,
                PRIMARY KEY (`Id`),
                KEY `IX_SesOutboundMessages_SesMessageId` (`SesMessageId`),
                KEY `IX_SesOutboundMessages_UserId_SentAt` (`UserId`, `SentAt`),
                CONSTRAINT `FK_SesOutboundMessages_Users_UserId`
                    FOREIGN KEY (`UserId`) REFERENCES `Users` (`Id`) ON DELETE CASCADE
            ) CHARACTER SET=utf8mb4;
            """, cancellationToken);

        await EnsureSesTableAsync(db, logger, "SesDeliveryEvents", """
            CREATE TABLE `SesDeliveryEvents` (
                `Id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
                `UserId` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NULL,
                `SubscriberId` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NULL,
                `CampaignId` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NULL,
                `FlowId` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NULL,
                `OutboundMessageId` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NULL,
                `EventType` varchar(32) CHARACTER SET utf8mb4 NOT NULL,
                `BounceType` varchar(32) CHARACTER SET utf8mb4 NOT NULL,
                `Email` varchar(320) CHARACTER SET utf8mb4 NOT NULL,
                `SesMessageId` varchar(200) CHARACTER SET utf8mb4 NOT NULL,
                `Source` varchar(64) CHARACTER SET utf8mb4 NOT NULL,
                `DiagnosticCode` longtext CHARACTER SET utf8mb4 NOT NULL,
                `RawPayload` longtext CHARACTER SET utf8mb4 NOT NULL,
                `OccurredAt` datetime(6) NOT NULL,
                `ReceivedAt` datetime(6) NOT NULL,
                PRIMARY KEY (`Id`),
                KEY `IX_SesDeliveryEvents_SesMessageId` (`SesMessageId`),
                KEY `IX_SesDeliveryEvents_UserId_OccurredAt` (`UserId`, `OccurredAt`),
                KEY `IX_SesDeliveryEvents_Email_EventType` (`Email`, `EventType`)
            ) CHARACTER SET=utf8mb4;
            """, cancellationToken);

        logger.LogInformation("SES/SNS tables verified (SesOutboundMessages, SesDeliveryEvents)");
    }

    private static async Task EnsureFlowEmailSchemaAsync(
        AppDbContext db,
        ILogger logger,
        CancellationToken cancellationToken)
    {
        await EnsureSesTableAsync(db, logger, "FlowEmailQueue", """
            CREATE TABLE `FlowEmailQueue` (
                `Id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
                `UserId` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
                `FlowId` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
                `FlowRunId` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
                `FlowEnrollmentId` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
                `SubscriberId` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
                `StepId` varchar(64) CHARACTER SET utf8mb4 NOT NULL,
                `Subject` varchar(500) CHARACTER SET utf8mb4 NOT NULL,
                `HtmlBody` longtext CHARACTER SET utf8mb4 NOT NULL,
                `ScheduledAtUtc` datetime(6) NOT NULL,
                `SentAt` datetime(6) NULL,
                `Status` varchar(32) CHARACTER SET utf8mb4 NOT NULL,
                `ErrorMessage` longtext CHARACTER SET utf8mb4 NULL,
                PRIMARY KEY (`Id`),
                KEY `IX_FlowEmailQueue_Status_ScheduledAtUtc` (`Status`, `ScheduledAtUtc`),
                KEY `IX_FlowEmailQueue_FlowId_StepId` (`FlowId`, `StepId`),
                CONSTRAINT `FK_FlowEmailQueue_Users_UserId`
                    FOREIGN KEY (`UserId`) REFERENCES `Users` (`Id`) ON DELETE CASCADE
            ) CHARACTER SET=utf8mb4;
            """, cancellationToken);

        if (await TableExistsAsync(db, "SesOutboundMessages", cancellationToken))
            await EnsureColumnAsync(db, "SesOutboundMessages", "StepId", "varchar(64) CHARACTER SET utf8mb4 NULL", cancellationToken);

        logger.LogInformation("Flow email queue schema verified");
    }

    private static async Task EnsureSesTableAsync(
        AppDbContext db,
        ILogger logger,
        string table,
        string createSql,
        CancellationToken cancellationToken)
    {
        var exists = await TableExistsAsync(db, table, cancellationToken);
        if (exists)
        {
            try
            {
                await db.Database.ExecuteSqlRawAsync($"SELECT 1 FROM `{table}` LIMIT 1", cancellationToken);
                return;
            }
            catch (Exception ex)
            {
                logger.LogWarning(ex, "SES table {Table} is broken — recreating", table);
            }
        }

        await DropSesTableAsync(db, logger, table, cancellationToken);

        try
        {
            await db.Database.ExecuteSqlRawAsync(createSql, cancellationToken);
            logger.LogInformation("Created SES table {Table}", table);
            return;
        }
        catch (MySqlException ex) when (IsOrphanedTablespace(ex))
        {
            logger.LogWarning(ex, "Orphaned InnoDB tablespace for {Table} — discarding and retrying", table);
            await DiscardOrphanedTablespaceAsync(db, logger, table, cancellationToken);
            await db.Database.ExecuteSqlRawAsync(createSql, cancellationToken);
            logger.LogInformation("Created SES table {Table} after tablespace cleanup", table);
        }
    }

    private static async Task DropSesTableAsync(
        AppDbContext db,
        ILogger logger,
        string table,
        CancellationToken cancellationToken)
    {
        try
        {
            await db.Database.ExecuteSqlRawAsync($"DROP TABLE IF EXISTS `{table}`", cancellationToken);
        }
        catch (Exception ex)
        {
            logger.LogDebug(ex, "DROP TABLE {Table} failed (may already be gone)", table);
        }
    }

    private static async Task DiscardOrphanedTablespaceAsync(
        AppDbContext db,
        ILogger logger,
        string table,
        CancellationToken cancellationToken)
    {
        await DropSesTableAsync(db, logger, table, cancellationToken);
        try
        {
            await db.Database.ExecuteSqlRawAsync(
                $"CREATE TABLE `{table}` (`_discard` char(1) NOT NULL) ENGINE=InnoDB",
                cancellationToken);
            await db.Database.ExecuteSqlRawAsync(
                $"ALTER TABLE `{table}` DISCARD TABLESPACE",
                cancellationToken);
            await db.Database.ExecuteSqlRawAsync($"DROP TABLE `{table}`", cancellationToken);
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Could not discard orphaned tablespace for {Table}", table);
        }
    }

    private static bool IsOrphanedTablespace(MySqlException ex) =>
        ex.Message.Contains("Tablespace", StringComparison.OrdinalIgnoreCase)
        || ex.Message.Contains("doesn't exist in engine", StringComparison.OrdinalIgnoreCase);

    private static async Task EnsureMySqlPacketSizeAsync(
        AppDbContext db,
        ILogger logger,
        CancellationToken cancellationToken)
    {
        try
        {
            await db.Database.ExecuteSqlRawAsync(
                "SET GLOBAL max_allowed_packet = 67108864",
                cancellationToken);
            logger.LogInformation("MySQL max_allowed_packet set to 64MB");
        }
        catch (Exception ex)
        {
            logger.LogDebug(ex, "Could not set GLOBAL max_allowed_packet (may require elevated DB privileges)");
        }
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
