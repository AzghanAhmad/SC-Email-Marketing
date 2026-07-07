using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using ScribeCount.Email.Api.Data;

#nullable disable

namespace ScribeCount.Email.Api.Data.Migrations;

[DbContext(typeof(AppDbContext))]
[Migration("20260704120000_AddUserSettings")]
public partial class AddUserSettings : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.Sql("""
            CREATE TABLE IF NOT EXISTS `UserSettings` (
                `UserId` char(36) COLLATE ascii_general_ci NOT NULL,
                `Json` longtext CHARACTER SET utf8mb4 NOT NULL,
                `UpdatedAt` datetime(6) NOT NULL,
                PRIMARY KEY (`UserId`),
                CONSTRAINT `FK_UserSettings_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `Users` (`Id`) ON DELETE CASCADE
            ) CHARACTER SET=utf8mb4;
            """);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(name: "UserSettings");
    }
}
