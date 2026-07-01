using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using ScribeCount.Email.Api.Data;

#nullable disable

namespace ScribeCount.Email.Api.Data.Migrations
{
    [DbContext(typeof(AppDbContext))]
    [Migration("20260629140000_AddSubscriberProfileDetail")]
    public partial class AddSubscriberProfileDetail : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            foreach (var (column, sqlType, backfill) in new (string, string, string)[]
            {
                ("ListIdsJson", "longtext CHARACTER SET utf8mb4 NULL", "[]"),
                ("Note", "longtext CHARACTER SET utf8mb4 NULL", ""),
                ("ClickRate", "decimal(5,2) NOT NULL DEFAULT 0", null!),
            })
            {
                migrationBuilder.Sql($"""
                    SET @sql = IF(
                        (SELECT COUNT(*) FROM information_schema.columns
                         WHERE table_schema = DATABASE() AND table_name = 'Subscribers' AND column_name = '{column}') = 0,
                        'ALTER TABLE `Subscribers` ADD `{column}` {sqlType}',
                        'SELECT 1');
                    PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
                    """);

                if (backfill is not null)
                {
                    var value = backfill == "[]" ? "'[]'" : "''";
                    migrationBuilder.Sql($"""
                        UPDATE `Subscribers` SET `{column}` = {value} WHERE `{column}` IS NULL;
                        """);

                    migrationBuilder.Sql($"""
                        SET @sql = IF(
                            (SELECT IS_NULLABLE FROM information_schema.columns
                             WHERE table_schema = DATABASE() AND table_name = 'Subscribers' AND column_name = '{column}') = 'YES',
                            'ALTER TABLE `Subscribers` MODIFY `{column}` longtext CHARACTER SET utf8mb4 NOT NULL',
                            'SELECT 1');
                        PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
                        """);
                }
            }

            migrationBuilder.Sql("""
                CREATE TABLE IF NOT EXISTS `SubscriberActivities` (
                    `Id` char(36) COLLATE ascii_general_ci NOT NULL,
                    `UserId` char(36) COLLATE ascii_general_ci NOT NULL,
                    `SubscriberId` char(36) COLLATE ascii_general_ci NOT NULL,
                    `ActivityType` varchar(64) CHARACTER SET utf8mb4 NOT NULL,
                    `Title` longtext CHARACTER SET utf8mb4 NOT NULL,
                    `Description` longtext CHARACTER SET utf8mb4 NOT NULL,
                    `CampaignId` char(36) COLLATE ascii_general_ci NULL,
                    `CampaignSubject` longtext CHARACTER SET utf8mb4 NULL,
                    `CampaignFrom` longtext CHARACTER SET utf8mb4 NULL,
                    `Status` varchar(64) CHARACTER SET utf8mb4 NOT NULL,
                    `OccurredAt` datetime(6) NOT NULL,
                    PRIMARY KEY (`Id`),
                    CONSTRAINT `FK_SubscriberActivities_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `Users` (`Id`) ON DELETE CASCADE,
                    CONSTRAINT `FK_SubscriberActivities_Subscribers_SubscriberId` FOREIGN KEY (`SubscriberId`) REFERENCES `Subscribers` (`Id`) ON DELETE CASCADE
                ) CHARACTER SET=utf8mb4;
                """);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "SubscriberActivities");
            foreach (var column in new[] { "ListIdsJson", "Note", "ClickRate" })
            {
                migrationBuilder.Sql($"""
                    SET @sql = IF(
                        (SELECT COUNT(*) FROM information_schema.columns
                         WHERE table_schema = DATABASE() AND table_name = 'Subscribers' AND column_name = '{column}') > 0,
                        'ALTER TABLE `Subscribers` DROP COLUMN `{column}`',
                        'SELECT 1');
                    PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
                    """);
            }
        }
    }
}
