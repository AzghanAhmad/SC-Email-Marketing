import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { AudienceList } from './audience-api.service';

export interface SignUpFormStats {
  label: string;
  value: string;
  change: number;
}

export interface SignUpFormItem {
  id: string;
  name: string;
  type: string;
  status: string;
  submissions: number;
  conversionRate: number;
  targetList: string;
  lastModified: string;
  iconKey: string;
}

export interface LandingPageItem {
  id: string;
  name: string;
  status: string;
  url: string;
  visits: number;
  signups: number;
  convRate: number;
  themeGradient: string;
  iconKey: string;
}

export interface WebsiteBundle {
  stats: SignUpFormStats[];
  forms: SignUpFormItem[];
  landingPages: LandingPageItem[];
  lists: AudienceList[];
}

@Injectable({ providedIn: 'root' })
export class WebsiteApiService {
  constructor(private api: ApiService) {}

  getWebsite(): Observable<WebsiteBundle> {
    return this.api.get<WebsiteBundle>('/website');
  }

  createForm(body: {
    name: string; formType: string; status: string;
    targetListId?: string; targetListName?: string;
  }): Observable<SignUpFormItem> {
    return this.api.post<SignUpFormItem>('/website/forms', body);
  }

  createLandingPage(body: {
    name: string; status: string; themeGradient: string; iconKey: string;
  }): Observable<LandingPageItem> {
    return this.api.post<LandingPageItem>('/website/landing-pages', body);
  }
}
