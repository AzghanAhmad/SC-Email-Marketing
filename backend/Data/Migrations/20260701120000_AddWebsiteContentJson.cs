using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using ScribeCount.Email.Api.Data;

#nullable disable

namespace ScribeCount.Email.Api.Data.Migrations
{
    [DbContext(typeof(AppDbContext))]
    [Migration("20260701120000_AddWebsiteContentJson")]
    public partial class AddWebsiteContentJson : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            foreach (var table in new[] { "SignUpForms", "LandingPages" })
            {
                migrationBuilder.Sql($"""
                    SET @sql = IF(
                        (SELECT COUNT(*) FROM information_schema.columns
                         WHERE table_schema = DATABASE() AND table_name = '{table}' AND column_name = 'ContentJson') = 0,
                        'ALTER TABLE `{table}` ADD `ContentJson` longtext CHARACTER SET utf8mb4 NULL',
                        'SELECT 1');
                    PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
                    """);

                migrationBuilder.Sql($"UPDATE `{table}` SET `ContentJson` = '{{}}' WHERE `ContentJson` IS NULL;");

                migrationBuilder.Sql($"""
                    SET @sql = IF(
                        (SELECT IS_NULLABLE FROM information_schema.columns
                         WHERE table_schema = DATABASE() AND table_name = '{table}' AND column_name = 'ContentJson') = 'YES',
                        'ALTER TABLE `{table}` MODIFY `ContentJson` longtext CHARACTER SET utf8mb4 NOT NULL',
                        'SELECT 1');
                    PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
                    """);
            }
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            foreach (var table in new[] { "SignUpForms", "LandingPages" })
            {
                migrationBuilder.Sql($"""
                    SET @sql = IF(
                        (SELECT COUNT(*) FROM information_schema.columns
                         WHERE table_schema = DATABASE() AND table_name = '{table}' AND column_name = 'ContentJson') > 0,
                        'ALTER TABLE `{table}` DROP COLUMN `ContentJson`',
                        'SELECT 1');
                    PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
                    """);
            }
        }
    }
}
