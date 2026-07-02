import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface NotificationSetting {
  key: string;
  title: string;
  description: string;
  enabled: boolean;
}

export interface PreferenceEmailType {
  key: string;
  name: string;
  description: string;
  enabled: boolean;
  subscriberCount: number;
}

export interface PreferenceFrequency {
  key: string;
  name: string;
  description: string;
  enabled: boolean;
  iconKey: string;
}

export interface StoreEventSettings {
  purchase: boolean;
  abandonedCart: boolean;
  abandonedCheckout: boolean;
  optIn: boolean;
  autoAddPurchasers: boolean;
}

export interface StoreConnection {
  connected: boolean;
  storeUrl: string;
  connectedSince?: string | null;
  eventsReceived: number;
  lastEvent?: string | null;
  events: StoreEventSettings;
}

export interface IntegrationItem {
  key: string;
  name: string;
  description: string;
  connected: boolean;
  iconKey: string;
  comingSoon: boolean;
}

export interface UserSettings {
  notifications: NotificationSetting[];
  preferenceEmailTypes: PreferenceEmailType[];
  preferenceFrequencies: PreferenceFrequency[];
  integrations: IntegrationItem[];
  store: StoreConnection;
  brandDomain?: string | null;
}

@Injectable({ providedIn: 'root' })
export class SettingsApiService {
  constructor(private api: ApiService) {}

  getSettings(): Observable<UserSettings> {
    return this.api.get<UserSettings>('/settings');
  }

  updateNotifications(notifications: NotificationSetting[]): Observable<UserSettings> {
    return this.api.put<UserSettings>('/settings/notifications', { notifications });
  }

  updatePreferences(emailTypes: PreferenceEmailType[], frequencies: PreferenceFrequency[]): Observable<UserSettings> {
    return this.api.put<UserSettings>('/settings/preferences', { emailTypes, frequencies });
  }

  updateStore(payload: { connected: boolean; storeUrl: string; events: StoreEventSettings }): Observable<UserSettings> {
    return this.api.put<UserSettings>('/settings/store', payload);
  }

  connectStore(storeUrl: string): Observable<UserSettings> {
    return this.api.post<UserSettings>('/settings/store/connect', { storeUrl });
  }

  disconnectStore(): Observable<UserSettings> {
    return this.api.post<UserSettings>('/settings/store/disconnect', {});
  }

  testStore(): Observable<UserSettings> {
    return this.api.post<UserSettings>('/settings/store/test', {});
  }
}
