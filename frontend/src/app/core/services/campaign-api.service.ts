import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Campaign } from './mock-data.service';

export interface CalendarEvent {
  id: string;
  name: string;
  type: string;
  date: string;
  status: 'planned' | 'draft' | 'scheduled' | 'sent';
  daysFromRelease?: number;
}

export interface NewsletterSchedule {
  name: string;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  dayOfWeek: string;
  dayOfMonth: string;
  sendTime: string;
  timezoneOptimized: boolean;
  subject: string;
  previewText: string;
  replyQuestion: string;
  content: string;
  status: 'active' | 'paused' | 'draft';
}

export interface AbTest {
  id: string;
  name: string;
  subjectA: string;
  subjectB: string;
  testSize: number;
  winnerMetric: 'opens' | 'clicks';
  waitHours: number;
  status: 'draft' | 'running' | 'complete';
  openRateA?: number;
  openRateB?: number;
  winner?: 'A' | 'B';
}

export interface CampaignsBundle {
  campaigns: Campaign[];
  calendarEvents: CalendarEvent[];
  newsletter: NewsletterSchedule;
  abTests: AbTest[];
}

export interface CreateCampaignPayload {
  name: string;
  subject: string;
  previewText?: string;
  content?: string;
  campaignType?: string;
  fromName?: string;
  sendToSegment?: string;
  status?: string;
  scheduledAt?: string | null;
  extras?: Record<string, string>;
}

@Injectable({ providedIn: 'root' })
export class CampaignApiService {
  constructor(private api: ApiService) {}

  getBundle(): Observable<CampaignsBundle> {
    return this.api.get<CampaignsBundle>('/campaigns');
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
}
