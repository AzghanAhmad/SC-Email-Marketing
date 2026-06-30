using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using ScribeCount.Email.Api.Data;

#nullable disable

namespace ScribeCount.Email.Api.Data.Migrations
{
    [DbContext(typeof(AppDbContext))]
    [Migration("20260628210000_AddEmailTemplatePreviewFields")]
    public partial class AddEmailTemplatePreviewFields : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            foreach (var (column, definition) in new (string, string)[]
            {
                ("SubjectLine", "longtext CHARACTER SET utf8mb4 NOT NULL"),
                ("PreviewText", "longtext CHARACTER SET utf8mb4 NOT NULL"),
                ("HtmlBody", "longtext CHARACTER SET utf8mb4 NOT NULL"),
                ("IconKey", "varchar(32) CHARACTER SET utf8mb4 NOT NULL DEFAULT ''mail''"),
                ("SuggestedCampaignType", "varchar(64) CHARACTER SET utf8mb4 NOT NULL DEFAULT ''newsletter''"),
            })
            {
                migrationBuilder.Sql($"""
                    SET @sql = IF(
                        (SELECT COUNT(*) FROM information_schema.columns
                         WHERE table_schema = DATABASE() AND table_name = 'EmailTemplates' AND column_name = '{column}') = 0,
                        'ALTER TABLE `EmailTemplates` ADD `{column}` {definition}',
                        'SELECT 1');
                    PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
                    """);
            }
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            foreach (var column in new[] { "SubjectLine", "PreviewText", "HtmlBody", "IconKey", "SuggestedCampaignType" })
            {
                migrationBuilder.Sql($"""
                    SET @sql = IF(
                        (SELECT COUNT(*) FROM information_schema.columns
                         WHERE table_schema = DATABASE() AND table_name = 'EmailTemplates' AND column_name = '{column}') > 0,
                        'ALTER TABLE `EmailTemplates` DROP COLUMN `{column}`',
                        'SELECT 1');
                    PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
                    """);
            }
        }
    }
}
