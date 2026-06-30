using System;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using ScribeCount.Email.Api.Data;

#nullable disable

namespace ScribeCount.Email.Api.Data.Migrations
{
    [DbContext(typeof(AppDbContext))]
    [Migration("20260619150000_AddCampaignEntities")]
    public partial class AddCampaignEntities : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // MySQL commits each DDL statement immediately, so use IF NOT EXISTS for safe retries.
            migrationBuilder.Sql("""
                CREATE TABLE IF NOT EXISTS `Campaigns` (
                    `Id` char(36) COLLATE ascii_general_ci NOT NULL,
                    `UserId` char(36) COLLATE ascii_general_ci NOT NULL,
                    `Name` longtext CHARACTER SET utf8mb4 NOT NULL,
                    `Subject` longtext CHARACTER SET utf8mb4 NOT NULL,
                    `PreviewText` longtext CHARACTER SET utf8mb4 NOT NULL,
                    `Content` longtext CHARACTER SET utf8mb4 NOT NULL,
                    `CampaignType` longtext CHARACTER SET utf8mb4 NOT NULL,
                    `Status` varchar(64) CHARACTER SET utf8mb4 NOT NULL,
                    `FromName` longtext CHARACTER SET utf8mb4 NOT NULL,
                    `SendToSegment` longtext CHARACTER SET utf8mb4 NOT NULL,
                    `OpenRate` decimal(65,30) NOT NULL,
                    `ClickRate` decimal(65,30) NOT NULL,
                    `SentCount` int NOT NULL,
                    `ScheduledAt` datetime(6) NULL,
                    `SentAt` datetime(6) NULL,
                    `ExtrasJson` longtext CHARACTER SET utf8mb4 NOT NULL,
                    `CreatedAt` datetime(6) NOT NULL,
                    `UpdatedAt` datetime(6) NOT NULL,
                    PRIMARY KEY (`Id`),
                    CONSTRAINT `FK_Campaigns_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `Users` (`Id`) ON DELETE CASCADE
                ) CHARACTER SET=utf8mb4;
                """);

            migrationBuilder.Sql("""
                CREATE TABLE IF NOT EXISTS `CampaignCalendarEvents` (
                    `Id` char(36) COLLATE ascii_general_ci NOT NULL,
                    `UserId` char(36) COLLATE ascii_general_ci NOT NULL,
                    `Name` longtext CHARACTER SET utf8mb4 NOT NULL,
                    `Type` longtext CHARACTER SET utf8mb4 NOT NULL,
                    `Status` longtext CHARACTER SET utf8mb4 NOT NULL,
                    `EventDate` datetime(6) NOT NULL,
                    `DaysFromRelease` int NULL,
                    `CreatedAt` datetime(6) NOT NULL,
                    PRIMARY KEY (`Id`),
                    CONSTRAINT `FK_CampaignCalendarEvents_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `Users` (`Id`) ON DELETE CASCADE
                ) CHARACTER SET=utf8mb4;
                """);

            migrationBuilder.Sql("""
                CREATE TABLE IF NOT EXISTS `NewsletterSchedules` (
                    `Id` char(36) COLLATE ascii_general_ci NOT NULL,
                    `UserId` char(36) COLLATE ascii_general_ci NOT NULL,
                    `Name` longtext CHARACTER SET utf8mb4 NOT NULL,
                    `Frequency` longtext CHARACTER SET utf8mb4 NOT NULL,
                    `DayOfWeek` longtext CHARACTER SET utf8mb4 NOT NULL,
                    `DayOfMonth` longtext CHARACTER SET utf8mb4 NOT NULL,
                    `SendTime` longtext CHARACTER SET utf8mb4 NOT NULL,
                    `TimezoneOptimized` tinyint(1) NOT NULL,
                    `Subject` longtext CHARACTER SET utf8mb4 NOT NULL,
                    `PreviewText` longtext CHARACTER SET utf8mb4 NOT NULL,
                    `ReplyQuestion` longtext CHARACTER SET utf8mb4 NOT NULL,
                    `Content` longtext CHARACTER SET utf8mb4 NOT NULL,
                    `Status` longtext CHARACTER SET utf8mb4 NOT NULL,
                    `UpdatedAt` datetime(6) NOT NULL,
                    PRIMARY KEY (`Id`),
                    CONSTRAINT `FK_NewsletterSchedules_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `Users` (`Id`) ON DELETE CASCADE
                ) CHARACTER SET=utf8mb4;
                """);

            migrationBuilder.Sql("""
                CREATE TABLE IF NOT EXISTS `AbTests` (
                    `Id` char(36) COLLATE ascii_general_ci NOT NULL,
                    `UserId` char(36) COLLATE ascii_general_ci NOT NULL,
                    `Name` longtext CHARACTER SET utf8mb4 NOT NULL,
                    `SubjectA` longtext CHARACTER SET utf8mb4 NOT NULL,
                    `SubjectB` longtext CHARACTER SET utf8mb4 NOT NULL,
                    `TestSize` int NOT NULL,
                    `WinnerMetric` longtext CHARACTER SET utf8mb4 NOT NULL,
                    `WaitHours` int NOT NULL,
                    `Status` longtext CHARACTER SET utf8mb4 NOT NULL,
                    `OpenRateA` decimal(65,30) NULL,
                    `OpenRateB` decimal(65,30) NULL,
                    `Winner` longtext CHARACTER SET utf8mb4 NULL,
                    `CreatedAt` datetime(6) NOT NULL,
                    PRIMARY KEY (`Id`),
                    CONSTRAINT `FK_AbTests_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `Users` (`Id`) ON DELETE CASCADE
                ) CHARACTER SET=utf8mb4;
                """);

            migrationBuilder.Sql("""
                SET @sql = IF(
                    (SELECT COUNT(*) FROM information_schema.statistics
                     WHERE table_schema = DATABASE() AND table_name = 'Campaigns' AND index_name = 'IX_Campaigns_UserId_Status') = 0,
                    'CREATE INDEX `IX_Campaigns_UserId_Status` ON `Campaigns` (`UserId`, `Status`)',
                    'SELECT 1');
                PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
                """);

            migrationBuilder.Sql("""
                SET @sql = IF(
                    (SELECT COUNT(*) FROM information_schema.statistics
                     WHERE table_schema = DATABASE() AND table_name = 'CampaignCalendarEvents' AND index_name = 'IX_CampaignCalendarEvents_UserId') = 0,
                    'CREATE INDEX `IX_CampaignCalendarEvents_UserId` ON `CampaignCalendarEvents` (`UserId`)',
                    'SELECT 1');
                PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
                """);

            migrationBuilder.Sql("""
                SET @sql = IF(
                    (SELECT COUNT(*) FROM information_schema.statistics
                     WHERE table_schema = DATABASE() AND table_name = 'NewsletterSchedules' AND index_name = 'IX_NewsletterSchedules_UserId') = 0,
                    'CREATE UNIQUE INDEX `IX_NewsletterSchedules_UserId` ON `NewsletterSchedules` (`UserId`)',
                    'SELECT 1');
                PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
                """);

            migrationBuilder.Sql("""
                SET @sql = IF(
                    (SELECT COUNT(*) FROM information_schema.statistics
                     WHERE table_schema = DATABASE() AND table_name = 'AbTests' AND index_name = 'IX_AbTests_UserId') = 0,
                    'CREATE INDEX `IX_AbTests_UserId` ON `AbTests` (`UserId`)',
                    'SELECT 1');
                PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
                """);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "AbTests");
            migrationBuilder.DropTable(name: "NewsletterSchedules");
            migrationBuilder.DropTable(name: "CampaignCalendarEvents");
            migrationBuilder.DropTable(name: "Campaigns");
        }
    }
}
