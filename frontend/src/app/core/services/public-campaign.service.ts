import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface UnsubscribePreview {
  email: string;
  campaignName: string;
  fromName: string;
  alreadyUnsubscribed: boolean;
}

export interface UnsubscribeResult {
  message: string;
  email: string;
  alreadyUnsubscribed: boolean;
}

export interface CampaignView {
  subject: string;
  fromName: string;
  campaignName: string;
  htmlBody: string;
  previewText: string;
}

export interface PublicAbTest {
  id: string;
  name: string;
  subjectA: string;
  subjectB: string;
  status: string;
  votesA: number;
  votesB: number;
  winner?: string;
  votingOpen: boolean;
}

export interface VoteAbTestResponse {
  message: string;
  votesA: number;
  votesB: number;
  winner?: string;
  status: string;
}

@Injectable({ providedIn: 'root' })
export class PublicCampaignService {
  private api = inject(ApiService);

  getUnsubscribePreview(token: string): Observable<UnsubscribePreview> {
    return this.api.get<UnsubscribePreview>(`/public/campaigns/unsubscribe?token=${encodeURIComponent(token)}`);
  }

  confirmUnsubscribe(token: string): Observable<UnsubscribeResult> {
    return this.api.post<UnsubscribeResult>('/public/campaigns/unsubscribe', { token });
  }

  getCampaignView(token: string): Observable<CampaignView> {
    return this.api.get<CampaignView>(`/public/campaigns/view?token=${encodeURIComponent(token)}`);
  }

  getAbTest(id: string): Observable<PublicAbTest> {
    return this.api.get<PublicAbTest>(`/public/campaigns/ab-tests/${id}`);
  }

  voteAbTest(id: string, variant: 'A' | 'B', voterToken?: string): Observable<VoteAbTestResponse> {
    return this.api.post<VoteAbTestResponse>(`/public/campaigns/ab-tests/${id}/vote`, { variant, voterToken });
  }
}
