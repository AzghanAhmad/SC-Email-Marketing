using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using ScribeCount.Email.Api.Data;

#nullable disable

namespace ScribeCount.Email.Api.Data.Migrations
{
    [DbContext(typeof(AppDbContext))]
    [Migration("20260628200000_AddAudienceFolders")]
    public partial class AddAudienceFolders : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                CREATE TABLE IF NOT EXISTS `AudienceFolders` (
                    `Id` char(36) COLLATE ascii_general_ci NOT NULL,
                    `UserId` char(36) COLLATE ascii_general_ci NOT NULL,
                    `Kind` varchar(32) CHARACTER SET utf8mb4 NOT NULL,
                    `Name` longtext CHARACTER SET utf8mb4 NOT NULL,
                    `CreatedAt` datetime(6) NOT NULL,
                    PRIMARY KEY (`Id`),
                    CONSTRAINT `FK_AudienceFolders_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `Users` (`Id`) ON DELETE CASCADE
                ) CHARACTER SET=utf8mb4;
                """);

            migrationBuilder.Sql("""
                SET @sql = IF(
                    (SELECT COUNT(*) FROM information_schema.columns
                     WHERE table_schema = DATABASE() AND table_name = 'AudienceLists' AND column_name = 'FolderId') = 0,
                    'ALTER TABLE `AudienceLists` ADD `FolderId` char(36) COLLATE ascii_general_ci NULL',
                    'SELECT 1');
                PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
                """);

            migrationBuilder.Sql("""
                SET @sql = IF(
                    (SELECT COUNT(*) FROM information_schema.columns
                     WHERE table_schema = DATABASE() AND table_name = 'AudienceLists' AND column_name = 'UpdatedAt') = 0,
                    'ALTER TABLE `AudienceLists` ADD `UpdatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)',
                    'SELECT 1');
                PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
                """);

            migrationBuilder.Sql("""
                SET @sql = IF(
                    (SELECT COUNT(*) FROM information_schema.columns
                     WHERE table_schema = DATABASE() AND table_name = 'AudienceSegmentItems' AND column_name = 'FolderId') = 0,
                    'ALTER TABLE `AudienceSegmentItems` ADD `FolderId` char(36) COLLATE ascii_general_ci NULL',
                    'SELECT 1');
                PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
                """);

            migrationBuilder.Sql("""
                SET @sql = IF(
                    (SELECT COUNT(*) FROM information_schema.columns
                     WHERE table_schema = DATABASE() AND table_name = 'AudienceSegmentItems' AND column_name = 'RuleConfigJson') = 0,
                    'ALTER TABLE `AudienceSegmentItems` ADD `RuleConfigJson` longtext CHARACTER SET utf8mb4 NULL',
                    'SELECT 1');
                PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
                """);

            migrationBuilder.Sql("""
                UPDATE `AudienceSegmentItems` SET `RuleConfigJson` = '{}' WHERE `RuleConfigJson` IS NULL;
                """);

            migrationBuilder.Sql("""
                SET @sql = IF(
                    (SELECT IS_NULLABLE FROM information_schema.columns
                     WHERE table_schema = DATABASE() AND table_name = 'AudienceSegmentItems' AND column_name = 'RuleConfigJson') = 'YES',
                    'ALTER TABLE `AudienceSegmentItems` MODIFY `RuleConfigJson` longtext CHARACTER SET utf8mb4 NOT NULL',
                    'SELECT 1');
                PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
                """);

            migrationBuilder.Sql("""
                SET @sql = IF(
                    (SELECT COUNT(*) FROM information_schema.columns
                     WHERE table_schema = DATABASE() AND table_name = 'AudienceSegmentItems' AND column_name = 'UpdatedAt') = 0,
                    'ALTER TABLE `AudienceSegmentItems` ADD `UpdatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)',
                    'SELECT 1');
                PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
                """);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "AudienceFolders");
        }
    }
}
