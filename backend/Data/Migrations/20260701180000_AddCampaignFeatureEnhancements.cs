using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using ScribeCount.Email.Api.Data;

#nullable disable

namespace ScribeCount.Email.Api.Data.Migrations
{
    [DbContext(typeof(AppDbContext))]
    [Migration("20260701180000_AddCampaignFeatureEnhancements")]
    public partial class AddCampaignFeatureEnhancements : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                CREATE TABLE IF NOT EXISTS `ReleasePlans` (
                    `Id` char(36) COLLATE ascii_general_ci NOT NULL,
                    `UserId` char(36) COLLATE ascii_general_ci NOT NULL,
                    `BookTitle` varchar(256) CHARACTER SET utf8mb4 NOT NULL DEFAULT '',
                    `ReleaseDate` datetime(6) NULL,
                    `UpdatedAt` datetime(6) NOT NULL,
                    PRIMARY KEY (`Id`),
                    UNIQUE KEY `IX_ReleasePlans_UserId` (`UserId`),
                    CONSTRAINT `FK_ReleasePlans_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `Users` (`Id`) ON DELETE CASCADE
                ) CHARACTER SET=utf8mb4;
                """);

            migrationBuilder.Sql("""
                CREATE TABLE IF NOT EXISTS `AbTestVotes` (
                    `Id` char(36) COLLATE ascii_general_ci NOT NULL,
                    `AbTestId` char(36) COLLATE ascii_general_ci NOT NULL,
                    `Variant` varchar(8) CHARACTER SET utf8mb4 NOT NULL,
                    `VoterKey` varchar(128) CHARACTER SET utf8mb4 NOT NULL,
                    `CreatedAt` datetime(6) NOT NULL,
                    PRIMARY KEY (`Id`),
                    UNIQUE KEY `IX_AbTestVotes_AbTestId_VoterKey` (`AbTestId`, `VoterKey`),
                    CONSTRAINT `FK_AbTestVotes_AbTests_AbTestId` FOREIGN KEY (`AbTestId`) REFERENCES `AbTests` (`Id`) ON DELETE CASCADE
                ) CHARACTER SET=utf8mb4;
                """);

            foreach (var (table, column, definition) in new (string, string, string)[]
            {
                ("AbTests", "VotesA", "int NOT NULL DEFAULT 0"),
                ("AbTests", "VotesB", "int NOT NULL DEFAULT 0"),
                ("AbTests", "StartedAt", "datetime(6) NULL"),
                ("AbTests", "CompletedAt", "datetime(6) NULL"),
                ("NewsletterSchedules", "NextSendAt", "datetime(6) NULL"),
                ("NewsletterSchedules", "LastSentAt", "datetime(6) NULL"),
            })
            {
                migrationBuilder.Sql($"""
                    SET @sql = IF(
                        (SELECT COUNT(*) FROM information_schema.columns
                         WHERE table_schema = DATABASE() AND table_name = '{table}' AND column_name = '{column}') = 0,
                        'ALTER TABLE `{table}` ADD `{column}` {definition}',
                        'SELECT 1');
                    PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
                    """);
            }
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP TABLE IF EXISTS `AbTestVotes`;");
            migrationBuilder.Sql("DROP TABLE IF EXISTS `ReleasePlans`;");

            foreach (var (table, column) in new (string, string)[]
            {
                ("AbTests", "VotesA"),
                ("AbTests", "VotesB"),
                ("AbTests", "StartedAt"),
                ("AbTests", "CompletedAt"),
                ("NewsletterSchedules", "NextSendAt"),
                ("NewsletterSchedules", "LastSentAt"),
            })
            {
                migrationBuilder.Sql($"""
                    SET @sql = IF(
                        (SELECT COUNT(*) FROM information_schema.columns
                         WHERE table_schema = DATABASE() AND table_name = '{table}' AND column_name = '{column}') > 0,
                        'ALTER TABLE `{table}` DROP COLUMN `{column}`',
                        'SELECT 1');
                    PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
                    """);
            }
        }
    }
}
