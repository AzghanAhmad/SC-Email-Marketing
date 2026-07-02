namespace ScribeCount.Email.Api.DTOs;

public record NotificationSettingDto(string Key, string Title, string Description, bool Enabled);

public record PreferenceEmailTypeDto(string Key, string Name, string Description, bool Enabled, int SubscriberCount);

public record PreferenceFrequencyDto(string Key, string Name, string Description, bool Enabled, string IconKey);

public record StoreEventSettingsDto(bool Purchase, bool AbandonedCart, bool AbandonedCheckout, bool OptIn, bool AutoAddPurchasers);

public record StoreConnectionDto(
    bool Connected,
    string StoreUrl,
    string? ConnectedSince,
    int EventsReceived,
    string? LastEvent,
    StoreEventSettingsDto Events);

public record IntegrationItemDto(string Key, string Name, string Description, bool Connected, string IconKey, bool ComingSoon);

public record UserSettingsDto(
    List<NotificationSettingDto> Notifications,
    List<PreferenceEmailTypeDto> PreferenceEmailTypes,
    List<PreferenceFrequencyDto> PreferenceFrequencies,
    List<IntegrationItemDto> Integrations,
    StoreConnectionDto Store,
    string? BrandDomain);

public record UpdateNotificationsRequest(List<NotificationSettingDto> Notifications);

public record UpdatePreferencesRequest(
    List<PreferenceEmailTypeDto> EmailTypes,
    List<PreferenceFrequencyDto> Frequencies);

public record UpdateStoreConnectionRequest(
    bool Connected,
    string StoreUrl,
    StoreEventSettingsDto Events);

public record ConnectStoreRequest(string StoreUrl);
