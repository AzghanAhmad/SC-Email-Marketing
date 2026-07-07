using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ScribeCount.Email.Api.Data.Migrations;

/// <summary>
/// Syncs the EF model snapshot with the current entity model.
/// Schema DDL is applied by earlier manual migrations and MigrationHelper runtime ensures.
/// </summary>
public partial class SyncPendingModelChanges : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
    }
}
