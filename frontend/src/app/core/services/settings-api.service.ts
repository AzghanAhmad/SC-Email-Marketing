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

export interface PreferenceFooter {
  subscriptionLine: string;
  physicalAddress: string;
  managePreferencesLabel: string;
  unsubscribeLabel: string;
  viewInBrowserLabel: string;
}

export interface UserSettings {
  notifications: NotificationSetting[];
  preferenceEmailTypes: PreferenceEmailType[];
  preferenceFrequencies: PreferenceFrequency[];
  integrations: IntegrationItem[];
  store: StoreConnection;
  brandDomain?: string | null;
  preferenceFooter: PreferenceFooter;
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

  updatePreferences(
    emailTypes: PreferenceEmailType[],
    frequencies: PreferenceFrequency[],
    footer: PreferenceFooter,
    brandDomain: string,
  ): Observable<UserSettings> {
    return this.api.put<UserSettings>('/settings/preferences', { emailTypes, frequencies, footer, brandDomain });
  }

  applyFooterToCampaigns(campaignIds: string[]): Observable<{ updatedCount: number; message: string }> {
    return this.api.post<{ updatedCount: number; message: string }>('/settings/preferences/apply-footer', { campaignIds });
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

  getSesStatus(): Observable<SesStatus> {
    return this.api.get<SesStatus>('/deliverability/ses/status');
  }

  verifySesIdentity(value: string): Observable<SesIdentityStatus> {
    const q = encodeURIComponent(value.trim());
    return this.api.get<SesIdentityStatus>(`/deliverability/ses/verify-identity?value=${q}`);
  }

  sendSesTest(toEmail: string): Observable<{ message: string; toEmail: string; sesMessageId?: string; success?: boolean }> {
    return this.api.post('/deliverability/ses/test-send', { toEmail });
  }

  getSenderIdentity(): Observable<SenderIdentity> {
    return this.api.get<SenderIdentity>('/settings/sender');
  }

  requestSenderOtp(fromEmail: string, fromName: string): Observable<SenderOtpResponse> {
    return this.api.post<SenderOtpResponse>('/settings/sender/request-otp', { fromEmail, fromName });
  }

  verifySenderOtp(code: string): Observable<SenderOtpResponse> {
    return this.api.post<SenderOtpResponse>('/settings/sender/verify-otp', { code });
  }
}

export interface SenderIdentity {
  fromEmail: string;
  fromName: string;
  verified: boolean;
  verifiedAt?: string | null;
  pendingEmail: string;
  hasPendingOtp: boolean;
  defaultFromEmail: string;
  usingDefault: boolean;
  message: string;
}

export interface SenderOtpResponse {
  success: boolean;
  message: string;
  identity: SenderIdentity;
}

export interface SesIdentityStatus {
  identity: string;
  identityType: string;
  foundInAccount: boolean;
  verified: boolean;
  verificationStatus: string;
  message: string;
}

export interface SesStatus {
  enabled: boolean;
  configured: boolean;
  region: string;
  fromEmail: string;
  fromName: string;
  configurationSetName: string;
  hasCredentials: boolean;
  message: string;
  checklist: string[];
  fromIdentity?: SesIdentityStatus | null;
}
