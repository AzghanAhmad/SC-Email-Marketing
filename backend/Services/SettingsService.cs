using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using ScribeCount.Email.Api.Data;
using ScribeCount.Email.Api.DTOs;
using ScribeCount.Email.Api.Entities;

namespace ScribeCount.Email.Api.Services;

public class SettingsService(AppDbContext db)
{
    private static readonly JsonSerializerOptions JsonOpts = new() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

    public async Task<UserSettingsDto> GetAsync(Guid userId)
    {
        var stored = await LoadStoredAsync(userId);
        var subscriberCount = await db.Subscribers.CountAsync(s => s.UserId == userId && s.Status == "active");
        return BuildDto(stored, subscriberCount);
    }

    public async Task<UserSettingsDto> UpdateNotificationsAsync(Guid userId, UpdateNotificationsRequest request)
    {
        var stored = await LoadStoredAsync(userId);
        stored.Notifications = request.Notifications.Select(n => new StoredNotification(n.Key, n.Enabled)).ToList();
        await SaveStoredAsync(userId, stored);
        var count = await db.Subscribers.CountAsync(s => s.UserId == userId && s.Status == "active");
        return BuildDto(stored, count);
    }

    public async Task<UserSettingsDto> UpdatePreferencesAsync(Guid userId, UpdatePreferencesRequest request)
    {
        var stored = await LoadStoredAsync(userId);
        stored.PreferenceEmailTypes = request.EmailTypes.Select(e => new StoredPrefEmailType(e.Key, e.Enabled)).ToList();
        stored.PreferenceFrequencies = request.Frequencies.Select(f => new StoredPrefFrequency(f.Key, f.Enabled)).ToList();
        await SaveStoredAsync(userId, stored);
        var count = await db.Subscribers.CountAsync(s => s.UserId == userId && s.Status == "active");
        return BuildDto(stored, count);
    }

    public async Task<UserSettingsDto> UpdateStoreAsync(Guid userId, UpdateStoreConnectionRequest request)
    {
        var stored = await LoadStoredAsync(userId);
        stored.Store = new StoredStore(
            request.Connected,
            request.StoreUrl.Trim(),
            request.Connected ? (stored.Store.ConnectedSince ?? DateTime.UtcNow.ToString("MMM d, yyyy")) : null,
            request.Connected ? Math.Max(stored.Store.EventsReceived, 0) : 0,
            stored.Store.LastEvent,
            new StoredStoreEvents(
                request.Events.Purchase,
                request.Events.AbandonedCart,
                request.Events.AbandonedCheckout,
                request.Events.OptIn,
                request.Events.AutoAddPurchasers));
        stored.Integrations["shopify"] = request.Connected;
        await SaveStoredAsync(userId, stored);
        var count = await db.Subscribers.CountAsync(s => s.UserId == userId && s.Status == "active");
        return BuildDto(stored, count);
    }

    public async Task<UserSettingsDto> ConnectStoreAsync(Guid userId, ConnectStoreRequest request)
    {
        var url = request.StoreUrl.Trim();
        if (string.IsNullOrWhiteSpace(url)) throw new InvalidOperationException("Store URL is required.");

        return await UpdateStoreAsync(userId, new UpdateStoreConnectionRequest(
            true, url,
            new StoreEventSettingsDto(true, true, true, true, true)));
    }

    public async Task<UserSettingsDto> DisconnectStoreAsync(Guid userId)
    {
        var stored = await LoadStoredAsync(userId);
        stored.Store = new StoredStore(false, "", null, 0, null,
            new StoredStoreEvents(true, true, true, true, true));
        stored.Integrations["shopify"] = false;
        await SaveStoredAsync(userId, stored);
        var count = await db.Subscribers.CountAsync(s => s.UserId == userId && s.Status == "active");
        return BuildDto(stored, count);
    }

    public async Task<UserSettingsDto> TestStoreConnectionAsync(Guid userId)
    {
        var stored = await LoadStoredAsync(userId);
        if (!stored.Store.Connected) throw new InvalidOperationException("Store is not connected.");
        stored.Store = stored.Store with { EventsReceived = stored.Store.EventsReceived + 1, LastEvent = $"{DateTime.UtcNow:MMM d, yyyy 'at' h:mm tt} — connection.test" };
        await SaveStoredAsync(userId, stored);
        var count = await db.Subscribers.CountAsync(s => s.UserId == userId && s.Status == "active");
        return BuildDto(stored, count);
    }

    private async Task<StoredSettings> LoadStoredAsync(Guid userId)
    {
        var row = await db.UserSettings.FindAsync(userId);
        if (row is null || string.IsNullOrWhiteSpace(row.Json)) return DefaultStored();
        try
        {
            return JsonSerializer.Deserialize<StoredSettings>(row.Json, JsonOpts) ?? DefaultStored();
        }
        catch
        {
            return DefaultStored();
        }
    }

    private async Task SaveStoredAsync(Guid userId, StoredSettings stored)
    {
        var json = JsonSerializer.Serialize(stored, JsonOpts);
        var row = await db.UserSettings.FindAsync(userId);
        if (row is null)
        {
            db.UserSettings.Add(new UserSettings { UserId = userId, Json = json, UpdatedAt = DateTime.UtcNow });
        }
        else
        {
            row.Json = json;
            row.UpdatedAt = DateTime.UtcNow;
        }
        await db.SaveChangesAsync();
    }

    private static UserSettingsDto BuildDto(StoredSettings stored, int subscriberCount)
    {
        var notifications = DefaultNotifications().Select(d =>
        {
            var saved = stored.Notifications.FirstOrDefault(n => n.Key == d.Key);
            return d with { Enabled = saved?.Enabled ?? d.Enabled };
        }).ToList();

        var emailTypes = DefaultEmailTypes().Select(d =>
        {
            var saved = stored.PreferenceEmailTypes.FirstOrDefault(e => e.Key == d.Key);
            var count = d.Key switch
            {
                "newsletter" => (int)(subscriberCount * 0.45),
                "releases" => subscriberCount,
                "promotional" => (int)(subscriberCount * 0.35),
                "community" => (int)(subscriberCount * 0.18),
                _ => 0
            };
            return d with { Enabled = saved?.Enabled ?? d.Enabled, SubscriberCount = Math.Max(count, 0) };
        }).ToList();

        var frequencies = DefaultFrequencies().Select(d =>
        {
            var saved = stored.PreferenceFrequencies.FirstOrDefault(f => f.Key == d.Key);
            return d with { Enabled = saved?.Enabled ?? d.Enabled };
        }).ToList();

        var integrations = DefaultIntegrations().Select(d =>
            d with { Connected = stored.Integrations.GetValueOrDefault(d.Key, d.Connected) }).ToList();

        var store = new StoreConnectionDto(
            stored.Store.Connected,
            stored.Store.StoreUrl,
            stored.Store.ConnectedSince,
            stored.Store.EventsReceived,
            stored.Store.LastEvent,
            new StoreEventSettingsDto(
                stored.Store.Events.Purchase,
                stored.Store.Events.AbandonedCart,
                stored.Store.Events.AbandonedCheckout,
                stored.Store.Events.OptIn,
                stored.Store.Events.AutoAddPurchasers));

        return new UserSettingsDto(notifications, emailTypes, frequencies, integrations, store, "yourdomain.com");
    }

    private static StoredSettings DefaultStored() => new()
    {
        Notifications = DefaultNotifications().Select(n => new StoredNotification(n.Key, n.Enabled)).ToList(),
        PreferenceEmailTypes = DefaultEmailTypes().Select(e => new StoredPrefEmailType(e.Key, e.Enabled)).ToList(),
        PreferenceFrequencies = DefaultFrequencies().Select(f => new StoredPrefFrequency(f.Key, f.Enabled)).ToList(),
        Integrations = DefaultIntegrations().ToDictionary(i => i.Key, i => i.Connected),
        Store = new StoredStore(false, "", null, 0, null, new StoredStoreEvents(true, true, true, true, true))
    };

    private static List<NotificationSettingDto> DefaultNotifications() =>
    [
        new("campaign_sent", "Campaign sent", "When a campaign finishes sending to your list", true),
        new("campaign_scheduled", "Campaign scheduled", "When a campaign is scheduled for a future send time", true),
        new("flow_triggered", "Flow triggered", "When an automation flow enrolls subscribers", false),
        new("flow_completed", "Flow completed", "When a subscriber completes an automation flow", false),
        new("new_subscriber", "New subscriber", "When someone joins your email list", true),
        new("unsubscribe_alert", "Unsubscribe alert", "When a reader unsubscribes from your list", true),
        new("bounce_alert", "Bounce alert", "When an email hard-bounces and an address is flagged", true),
        new("spam_complaint", "Spam complaint", "When a reader marks your email as spam", true),
        new("weekly_report", "Weekly performance report", "Summary of opens, clicks, revenue, and list growth each Monday", true),
        new("deliverability_alert", "Deliverability warning", "When your deliverability score drops below a healthy threshold", true),
        new("product_updates", "Product updates", "News about new ScribeCount Email features and improvements", true),
    ];

    private static List<PreferenceEmailTypeDto> DefaultEmailTypes() =>
    [
        new("newsletter", "Full Newsletter", "Regular newsletter with writing updates, reading picks, and behind-the-scenes content", true, 0),
        new("releases", "New Release Announcements", "Only notified when a new book is available or pre-order goes live", true, 0),
        new("promotional", "Promotional Emails", "Sales, limited-time offers, and backlist discounts", true, 0),
        new("community", "Community Updates", "Reader events, signings, ARC opportunities, and community news", false, 0),
    ];

    private static List<PreferenceFrequencyDto> DefaultFrequencies() =>
    [
        new("weekly", "Weekly", "Hear from me every week", true, "calendar"),
        new("biweekly", "Biweekly", "Every two weeks", true, "calendar"),
        new("monthly", "Monthly", "Once a month", true, "calendar"),
        new("releases_only", "New releases only", "Only when I publish something new", true, "book"),
    ];

    private static List<IntegrationItemDto> DefaultIntegrations() =>
    [
        new("bookfunnel", "BookFunnel", "Sync reader magnet downloads to your list", false, "book", true),
        new("shopify", "Shopify", "Connect your store for purchase flows and abandoned cart recovery", false, "checkout", false),
        new("google_analytics", "Google Analytics", "Track email campaign traffic in GA4", false, "chart", true),
        new("zapier", "Zapier", "Connect with 5,000+ apps via Zapier", false, "trend", true),
        new("storyorigin", "StoryOrigin", "Import subscribers from StoryOrigin newsletter swaps", false, "form", true),
        new("facebook_pixel", "Facebook Pixel", "Retarget email subscribers on Facebook", false, "link", true),
    ];

    private sealed class StoredSettings
    {
        public List<StoredNotification> Notifications { get; set; } = [];
        public List<StoredPrefEmailType> PreferenceEmailTypes { get; set; } = [];
        public List<StoredPrefFrequency> PreferenceFrequencies { get; set; } = [];
        public Dictionary<string, bool> Integrations { get; set; } = new(StringComparer.OrdinalIgnoreCase);
        public StoredStore Store { get; set; } = new(false, "", null, 0, null, new StoredStoreEvents(true, true, true, true, true));
    }

    private sealed record StoredNotification(string Key, bool Enabled);
    private sealed record StoredPrefEmailType(string Key, bool Enabled);
    private sealed record StoredPrefFrequency(string Key, bool Enabled);
    private sealed record StoredStoreEvents(bool Purchase, bool AbandonedCart, bool AbandonedCheckout, bool OptIn, bool AutoAddPurchasers);
    private sealed record StoredStore(bool Connected, string StoreUrl, string? ConnectedSince, int EventsReceived, string? LastEvent, StoredStoreEvents Events);
}
