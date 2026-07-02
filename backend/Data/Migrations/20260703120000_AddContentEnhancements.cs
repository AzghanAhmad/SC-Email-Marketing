using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using ScribeCount.Email.Api.Data;

#nullable disable

namespace ScribeCount.Email.Api.Data.Migrations
{
    [DbContext(typeof(AppDbContext))]
    [Migration("20260703120000_AddContentEnhancements")]
    public partial class AddContentEnhancements : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            foreach (var (table, column, definition) in new[]
            {
                ("ContentBlocks", "HtmlBody", "longtext CHARACTER SET utf8mb4 NULL"),
                ("EmailTemplates", "IsCustom", "tinyint(1) NOT NULL DEFAULT 0"),
                ("BrandAssets", "StoragePath", "longtext CHARACTER SET utf8mb4 NULL"),
                ("BrandAssets", "MimeType", "longtext CHARACTER SET utf8mb4 NULL"),
            })
            {
                migrationBuilder.Sql($"""
                    SET @sql = IF(
                        (SELECT COUNT(*) FROM information_schema.columns
                         WHERE table_schema = DATABASE() AND table_name = '{table}' AND column_name = '{column}') = 0,
                        'ALTER TABLE `{table}` ADD `{column}` {definition}',
                        'SELECT 1');
                    PREPARE stmt FROM @sql;
                    EXECUTE stmt;
                    DEALLOCATE PREPARE stmt;
                    """);
            }
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            foreach (var (table, column) in new[]
            {
                ("ContentBlocks", "HtmlBody"),
                ("EmailTemplates", "IsCustom"),
                ("BrandAssets", "StoragePath"),
                ("BrandAssets", "MimeType"),
            })
            {
                migrationBuilder.Sql($"""
                    SET @sql = IF(
                        (SELECT COUNT(*) FROM information_schema.columns
                         WHERE table_schema = DATABASE() AND table_name = '{table}' AND column_name = '{column}') > 0,
                        'ALTER TABLE `{table}` DROP COLUMN `{column}`',
                        'SELECT 1');
                    PREPARE stmt FROM @sql;
                    EXECUTE stmt;
                    DEALLOCATE PREPARE stmt;
                    """);
            }
        }
    }
}
