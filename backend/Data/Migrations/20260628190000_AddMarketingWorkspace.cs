using System;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using ScribeCount.Email.Api.Data;

#nullable disable

namespace ScribeCount.Email.Api.Data.Migrations
{
    [DbContext(typeof(AppDbContext))]
    [Migration("20260628190000_AddMarketingWorkspace")]
    public partial class AddMarketingWorkspace : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                SET @sql = IF(
                    (SELECT COUNT(*) FROM information_schema.columns
                     WHERE table_schema = DATABASE() AND table_name = 'Subscribers' AND column_name = 'TagsJson') = 0,
                    'ALTER TABLE `Subscribers` ADD `TagsJson` longtext CHARACTER SET utf8mb4 NULL',
                    'SELECT 1');
                PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
                """);

            migrationBuilder.Sql("""
                UPDATE `Subscribers` SET `TagsJson` = '[]' WHERE `TagsJson` IS NULL;
                """);

            migrationBuilder.Sql("""
                SET @sql = IF(
                    (SELECT IS_NULLABLE FROM information_schema.columns
                     WHERE table_schema = DATABASE() AND table_name = 'Subscribers' AND column_name = 'TagsJson') = 'YES',
                    'ALTER TABLE `Subscribers` MODIFY `TagsJson` longtext CHARACTER SET utf8mb4 NOT NULL',
                    'SELECT 1');
                PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
                """);

            migrationBuilder.Sql("""
                SET @sql = IF(
                    (SELECT COUNT(*) FROM information_schema.columns
                     WHERE table_schema = DATABASE() AND table_name = 'Subscribers' AND column_name = 'OpenRate') = 0,
                    'ALTER TABLE `Subscribers` ADD `OpenRate` decimal(65,30) NOT NULL DEFAULT 0',
                    'SELECT 1');
                PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
                """);

            migrationBuilder.Sql("""
                SET @sql = IF(
                    (SELECT COUNT(*) FROM information_schema.columns
                     WHERE table_schema = DATABASE() AND table_name = 'Subscribers' AND column_name = 'ListId') = 0,
                    'ALTER TABLE `Subscribers` ADD `ListId` char(36) COLLATE ascii_general_ci NULL',
                    'SELECT 1');
                PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
                """);

            migrationBuilder.Sql("""
                CREATE TABLE IF NOT EXISTS `AudienceLists` (
                    `Id` char(36) COLLATE ascii_general_ci NOT NULL,
                    `UserId` char(36) COLLATE ascii_general_ci NOT NULL,
                    `Name` longtext CHARACTER SET utf8mb4 NOT NULL,
                    `Description` longtext CHARACTER SET utf8mb4 NOT NULL,
                    `Color` longtext CHARACTER SET utf8mb4 NOT NULL,
                    `OptInMethod` longtext CHARACTER SET utf8mb4 NOT NULL,
                    `CreatedAt` datetime(6) NOT NULL,
                    PRIMARY KEY (`Id`),
                    CONSTRAINT `FK_AudienceLists_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `Users` (`Id`) ON DELETE CASCADE
                ) CHARACTER SET=utf8mb4;
                """);

            migrationBuilder.Sql("""
                CREATE TABLE IF NOT EXISTS `AudienceSegmentItems` (
                    `Id` char(36) COLLATE ascii_general_ci NOT NULL,
                    `UserId` char(36) COLLATE ascii_general_ci NOT NULL,
                    `Name` longtext CHARACTER SET utf8mb4 NOT NULL,
                    `Description` longtext CHARACTER SET utf8mb4 NOT NULL,
                    `Color` longtext CHARACTER SET utf8mb4 NOT NULL,
                    `RuleType` longtext CHARACTER SET utf8mb4 NOT NULL,
                    `CreatedAt` datetime(6) NOT NULL,
                    PRIMARY KEY (`Id`),
                    CONSTRAINT `FK_AudienceSegmentItems_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `Users` (`Id`) ON DELETE CASCADE
                ) CHARACTER SET=utf8mb4;
                """);

            migrationBuilder.Sql("""
                CREATE TABLE IF NOT EXISTS `EmailTemplates` (
                    `Id` char(36) COLLATE ascii_general_ci NOT NULL,
                    `UserId` char(36) COLLATE ascii_general_ci NOT NULL,
                    `Name` longtext CHARACTER SET utf8mb4 NOT NULL,
                    `Category` longtext CHARACTER SET utf8mb4 NOT NULL,
                    `PreviewCode` longtext CHARACTER SET utf8mb4 NOT NULL,
                    `Description` longtext CHARACTER SET utf8mb4 NOT NULL,
                    `CreatedAt` datetime(6) NOT NULL,
                    PRIMARY KEY (`Id`),
                    CONSTRAINT `FK_EmailTemplates_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `Users` (`Id`) ON DELETE CASCADE
                ) CHARACTER SET=utf8mb4;
                """);

            migrationBuilder.Sql("""
                CREATE TABLE IF NOT EXISTS `ContentBlocks` (
                    `Id` char(36) COLLATE ascii_general_ci NOT NULL,
                    `UserId` char(36) COLLATE ascii_general_ci NOT NULL,
                    `Name` longtext CHARACTER SET utf8mb4 NOT NULL,
                    `BlockType` longtext CHARACTER SET utf8mb4 NOT NULL,
                    `Description` longtext CHARACTER SET utf8mb4 NOT NULL,
                    `IconKey` longtext CHARACTER SET utf8mb4 NOT NULL,
                    `UsedInCount` int NOT NULL,
                    `CreatedAt` datetime(6) NOT NULL,
                    PRIMARY KEY (`Id`),
                    CONSTRAINT `FK_ContentBlocks_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `Users` (`Id`) ON DELETE CASCADE
                ) CHARACTER SET=utf8mb4;
                """);

            migrationBuilder.Sql("""
                CREATE TABLE IF NOT EXISTS `BrandProfiles` (
                    `UserId` char(36) COLLATE ascii_general_ci NOT NULL,
                    `ColorsJson` longtext CHARACTER SET utf8mb4 NOT NULL,
                    `UpdatedAt` datetime(6) NOT NULL,
                    PRIMARY KEY (`UserId`),
                    CONSTRAINT `FK_BrandProfiles_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `Users` (`Id`) ON DELETE CASCADE
                ) CHARACTER SET=utf8mb4;
                """);

            migrationBuilder.Sql("""
                CREATE TABLE IF NOT EXISTS `BrandAssets` (
                    `Id` char(36) COLLATE ascii_general_ci NOT NULL,
                    `UserId` char(36) COLLATE ascii_general_ci NOT NULL,
                    `Name` longtext CHARACTER SET utf8mb4 NOT NULL,
                    `FileType` longtext CHARACTER SET utf8mb4 NOT NULL,
                    `SizeBytes` bigint NOT NULL,
                    `IconKey` longtext CHARACTER SET utf8mb4 NOT NULL,
                    `CreatedAt` datetime(6) NOT NULL,
                    PRIMARY KEY (`Id`),
                    CONSTRAINT `FK_BrandAssets_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `Users` (`Id`) ON DELETE CASCADE
                ) CHARACTER SET=utf8mb4;
                """);

            migrationBuilder.Sql("""
                CREATE TABLE IF NOT EXISTS `SignUpForms` (
                    `Id` char(36) COLLATE ascii_general_ci NOT NULL,
                    `UserId` char(36) COLLATE ascii_general_ci NOT NULL,
                    `Name` longtext CHARACTER SET utf8mb4 NOT NULL,
                    `FormType` longtext CHARACTER SET utf8mb4 NOT NULL,
                    `Status` longtext CHARACTER SET utf8mb4 NOT NULL,
                    `TargetListId` char(36) COLLATE ascii_general_ci NULL,
                    `TargetListName` longtext CHARACTER SET utf8mb4 NOT NULL,
                    `Submissions` int NOT NULL,
                    `ConversionRate` decimal(65,30) NOT NULL,
                    `CreatedAt` datetime(6) NOT NULL,
                    `UpdatedAt` datetime(6) NOT NULL,
                    PRIMARY KEY (`Id`),
                    CONSTRAINT `FK_SignUpForms_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `Users` (`Id`) ON DELETE CASCADE
                ) CHARACTER SET=utf8mb4;
                """);

            migrationBuilder.Sql("""
                CREATE TABLE IF NOT EXISTS `LandingPages` (
                    `Id` char(36) COLLATE ascii_general_ci NOT NULL,
                    `UserId` char(36) COLLATE ascii_general_ci NOT NULL,
                    `Name` longtext CHARACTER SET utf8mb4 NOT NULL,
                    `Slug` longtext CHARACTER SET utf8mb4 NOT NULL,
                    `Status` longtext CHARACTER SET utf8mb4 NOT NULL,
                    `ThemeGradient` longtext CHARACTER SET utf8mb4 NOT NULL,
                    `IconKey` longtext CHARACTER SET utf8mb4 NOT NULL,
                    `Visits` int NOT NULL,
                    `Signups` int NOT NULL,
                    `CreatedAt` datetime(6) NOT NULL,
                    `UpdatedAt` datetime(6) NOT NULL,
                    PRIMARY KEY (`Id`),
                    CONSTRAINT `FK_LandingPages_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `Users` (`Id`) ON DELETE CASCADE
                ) CHARACTER SET=utf8mb4;
                """);

            migrationBuilder.Sql("""
                CREATE TABLE IF NOT EXISTS `GrowthToolConfigs` (
                    `UserId` char(36) COLLATE ascii_general_ci NOT NULL,
                    `ToolKey` varchar(128) CHARACTER SET utf8mb4 NOT NULL,
                    `ConfigJson` longtext CHARACTER SET utf8mb4 NOT NULL,
                    `UpdatedAt` datetime(6) NOT NULL,
                    PRIMARY KEY (`UserId`, `ToolKey`),
                    CONSTRAINT `FK_GrowthToolConfigs_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `Users` (`Id`) ON DELETE CASCADE
                ) CHARACTER SET=utf8mb4;
                """);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "GrowthToolConfigs");
            migrationBuilder.DropTable(name: "LandingPages");
            migrationBuilder.DropTable(name: "SignUpForms");
            migrationBuilder.DropTable(name: "BrandAssets");
            migrationBuilder.DropTable(name: "BrandProfiles");
            migrationBuilder.DropTable(name: "ContentBlocks");
            migrationBuilder.DropTable(name: "EmailTemplates");
            migrationBuilder.DropTable(name: "AudienceSegmentItems");
            migrationBuilder.DropTable(name: "AudienceLists");
        }
    }
}
