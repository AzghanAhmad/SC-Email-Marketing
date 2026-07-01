using System.Data.Common;
using Microsoft.EntityFrameworkCore.Diagnostics;
using MySqlConnector;

namespace ScribeCount.Email.Api.Services;

/// <summary>
/// Raises per-connection max_allowed_packet so scheduled/draft emails with attachments can be saved.
/// </summary>
public sealed class MySqlPacketSizeInterceptor : DbConnectionInterceptor
{
    private const int PacketSizeBytes = 64 * 1024 * 1024;

    public override void ConnectionOpened(DbConnection connection, ConnectionEndEventData eventData)
    {
        TryRaisePacketSize(connection);
        base.ConnectionOpened(connection, eventData);
    }

    public override async Task ConnectionOpenedAsync(
        DbConnection connection,
        ConnectionEndEventData eventData,
        CancellationToken cancellationToken = default)
    {
        await TryRaisePacketSizeAsync(connection, cancellationToken);
        await base.ConnectionOpenedAsync(connection, eventData, cancellationToken);
    }

    private static void TryRaisePacketSize(DbConnection connection)
    {
        if (connection is not MySqlConnection) return;
        try
        {
            using var cmd = connection.CreateCommand();
            cmd.CommandText = $"SET SESSION max_allowed_packet = {PacketSizeBytes};";
            cmd.ExecuteNonQuery();
        }
        catch
        {
            // Server may cap SESSION below GLOBAL; EnsureMySqlPacketSizeAsync handles GLOBAL at startup.
        }
    }

    private static async Task TryRaisePacketSizeAsync(DbConnection connection, CancellationToken cancellationToken)
    {
        if (connection is not MySqlConnection) return;
        try
        {
            await using var cmd = connection.CreateCommand();
            cmd.CommandText = $"SET SESSION max_allowed_packet = {PacketSizeBytes};";
            await cmd.ExecuteNonQueryAsync(cancellationToken);
        }
        catch
        {
            // Ignore — payload compaction and validation still apply.
        }
    }
}
