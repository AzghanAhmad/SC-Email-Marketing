import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  AbTest,
  AudienceSegment,
  CalendarEvent,
  Campaign,
  CampaignsBundle,
  CreateCampaignPayload,
  NewsletterSchedule,
  ReachEstimate,
  ReleasePlan,
  TestSendResponse,
} from '../models/campaign.models';

export type {
  AbTest,
  AudienceSegment,
  CalendarEvent,
  Campaign,
  CampaignsBundle,
  CreateCampaignPayload,
  NewsletterSchedule,
  ReachEstimate,
  ReleasePlan,
  TestSendResponse,
};

@Injectable({ providedIn: 'root' })
export class CampaignApiService {
  constructor(private api: ApiService) {}

  getBundle(): Observable<CampaignsBundle> {
    return this.api.get<CampaignsBundle>('/campaigns');
  }

  getCampaign(id: string): Observable<Campaign> {
    return this.api.get<Campaign>(`/campaigns/${id}`);
  }

  createCampaign(payload: CreateCampaignPayload): Observable<Campaign> {
    return this.api.post<Campaign>('/campaigns', payload);
  }

  updateCampaign(id: string, payload: Partial<CreateCampaignPayload>): Observable<Campaign> {
    return this.api.put<Campaign>(`/campaigns/${id}`, payload);
  }

  deleteCampaign(id: string): Observable<void> {
    return this.api.delete<void>(`/campaigns/${id}`);
  }

  sendCampaign(id: string, scheduleOnly = false): Observable<Campaign> {
    return this.api.post<Campaign>(`/campaigns/${id}/send`, { scheduleOnly });
  }

  createAndSend(payload: CreateCampaignPayload, schedule = false): Observable<Campaign> {
    return this.api.post<Campaign>(`/campaigns/send?schedule=${schedule}`, payload);
  }

  createCalendarEvent(payload: { name: string; type: string; date?: string; status: string }): Observable<CalendarEvent> {
    return this.api.post<CalendarEvent>('/campaigns/calendar-events', payload);
  }

  saveNewsletter(schedule: NewsletterSchedule): Observable<NewsletterSchedule> {
    return this.api.put<NewsletterSchedule>('/campaigns/newsletter', schedule);
  }

  createAbTest(payload: {
    subjectA: string;
    subjectB: string;
    testSize: number;
    winnerMetric: string;
    waitHours: number;
    name?: string;
  }): Observable<AbTest> {
    return this.api.post<AbTest>('/campaigns/ab-tests', payload);
  }

  deleteAbTest(id: string): Observable<void> {
    return this.api.delete<void>(`/campaigns/ab-tests/${id}`);
  }

  getAudienceSegments(): Observable<AudienceSegment[]> {
    return this.api.get<AudienceSegment[]>('/campaigns/audience-segments');
  }

  estimateReach(payload: {
    segment?: string;
    enabledSuppressionRules: string[];
    listIds?: string[];
    segmentIds?: string[];
    contactIds?: string[];
    excludeUnengaged?: boolean;
    arcTag?: string;
  }): Observable<ReachEstimate> {
    return this.api.post<ReachEstimate>('/campaigns/estimate-reach', {
      segment: payload.segment ?? 'all',
      enabledSuppressionRules: payload.enabledSuppressionRules,
      listIds: payload.listIds,
      segmentIds: payload.segmentIds,
      contactIds: payload.contactIds,
      excludeUnengaged: payload.excludeUnengaged ?? false,
      arcTag: payload.arcTag || undefined,
    });
  }

  sendTestEmail(payload: {
    campaignId?: string;
    subject?: string;
    previewText?: string;
    content?: string;
    fromName?: string;
  }): Observable<TestSendResponse> {
    return this.api.post<TestSendResponse>('/campaigns/test-send', payload);
  }

  updateCalendarEvent(id: string, payload: Partial<{ name: string; type: string; date: string; status: string }>): Observable<CalendarEvent> {
    return this.api.put<CalendarEvent>(`/campaigns/calendar-events/${id}`, payload);
  }

  deleteCalendarEvent(id: string): Observable<void> {
    return this.api.delete<void>(`/campaigns/calendar-events/${id}`);
  }

  saveReleasePlan(payload: { bookTitle?: string; releaseDate?: string | null }): Observable<ReleasePlan> {
    return this.api.put<ReleasePlan>('/campaigns/release-plan', payload);
  }

  launchAbTest(id: string): Observable<AbTest> {
    return this.api.post<AbTest>(`/campaigns/ab-tests/${id}/launch`, {});
  }
}
