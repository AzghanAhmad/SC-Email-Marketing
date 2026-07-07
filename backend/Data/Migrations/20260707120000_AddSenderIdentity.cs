using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using ScribeCount.Email.Api.Data;

#nullable disable

namespace ScribeCount.Email.Api.Data.Migrations;

[DbContext(typeof(AppDbContext))]
[Migration("20260707120000_AddSenderIdentity")]
public partial class AddSenderIdentity : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.Sql("""
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
            """);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(name: "SenderIdentities");
    }
}
