using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using ScribeCount.Email.Api.Data;

#nullable disable

namespace ScribeCount.Email.Api.Data.Migrations
{
    [DbContext(typeof(AppDbContext))]
    [Migration("20260702120000_AddFlowExecution")]
    public partial class AddFlowExecution : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                CREATE TABLE IF NOT EXISTS `FlowRuns` (
                    `Id` char(36) COLLATE ascii_general_ci NOT NULL,
                    `UserId` char(36) COLLATE ascii_general_ci NOT NULL,
                    `UserFlowId` char(36) COLLATE ascii_general_ci NOT NULL,
                    `Status` varchar(32) CHARACTER SET utf8mb4 NOT NULL DEFAULT 'running',
                    `EnrolledCount` int NOT NULL DEFAULT 0,
                    `CompletedCount` int NOT NULL DEFAULT 0,
                    `StartedAt` datetime(6) NOT NULL,
                    `CompletedAt` datetime(6) NULL,
                    PRIMARY KEY (`Id`),
                    KEY `IX_FlowRuns_UserFlowId` (`UserFlowId`),
                    KEY `IX_FlowRuns_UserId` (`UserId`),
                    CONSTRAINT `FK_FlowRuns_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `Users` (`Id`) ON DELETE CASCADE,
                    CONSTRAINT `FK_FlowRuns_UserFlows_UserFlowId` FOREIGN KEY (`UserFlowId`) REFERENCES `UserFlows` (`Id`) ON DELETE CASCADE
                ) CHARACTER SET=utf8mb4;
                """);

            migrationBuilder.Sql("""
                CREATE TABLE IF NOT EXISTS `FlowEnrollments` (
                    `Id` char(36) COLLATE ascii_general_ci NOT NULL,
                    `FlowRunId` char(36) COLLATE ascii_general_ci NOT NULL,
                    `SubscriberId` char(36) COLLATE ascii_general_ci NOT NULL,
                    `Token` varchar(64) CHARACTER SET utf8mb4 NOT NULL,
                    `CurrentStepIndex` int NOT NULL DEFAULT 0,
                    `Status` varchar(32) CHARACTER SET utf8mb4 NOT NULL DEFAULT 'in_progress',
                    `StartedAt` datetime(6) NOT NULL,
                    `CompletedAt` datetime(6) NULL,
                    PRIMARY KEY (`Id`),
                    UNIQUE KEY `IX_FlowEnrollments_Token` (`Token`),
                    KEY `IX_FlowEnrollments_FlowRunId` (`FlowRunId`),
                    CONSTRAINT `FK_FlowEnrollments_FlowRuns_FlowRunId` FOREIGN KEY (`FlowRunId`) REFERENCES `FlowRuns` (`Id`) ON DELETE CASCADE,
                    CONSTRAINT `FK_FlowEnrollments_Subscribers_SubscriberId` FOREIGN KEY (`SubscriberId`) REFERENCES `Subscribers` (`Id`) ON DELETE CASCADE
                ) CHARACTER SET=utf8mb4;
                """);

            migrationBuilder.Sql("""
                CREATE TABLE IF NOT EXISTS `FlowStepResponses` (
                    `Id` char(36) COLLATE ascii_general_ci NOT NULL,
                    `FlowEnrollmentId` char(36) COLLATE ascii_general_ci NOT NULL,
                    `StepId` varchar(64) CHARACTER SET utf8mb4 NOT NULL,
                    `StepLabel` varchar(256) CHARACTER SET utf8mb4 NOT NULL DEFAULT '',
                    `StepType` varchar(32) CHARACTER SET utf8mb4 NOT NULL DEFAULT '',
                    `ResponseJson` longtext CHARACTER SET utf8mb4 NOT NULL,
                    `SubmittedAt` datetime(6) NOT NULL,
                    PRIMARY KEY (`Id`),
                    KEY `IX_FlowStepResponses_FlowEnrollmentId` (`FlowEnrollmentId`),
                    CONSTRAINT `FK_FlowStepResponses_FlowEnrollments_FlowEnrollmentId` FOREIGN KEY (`FlowEnrollmentId`) REFERENCES `FlowEnrollments` (`Id`) ON DELETE CASCADE
                ) CHARACTER SET=utf8mb4;
                """);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP TABLE IF EXISTS `FlowStepResponses`;");
            migrationBuilder.Sql("DROP TABLE IF EXISTS `FlowEnrollments`;");
            migrationBuilder.Sql("DROP TABLE IF EXISTS `FlowRuns`;");
        }
    }
}
