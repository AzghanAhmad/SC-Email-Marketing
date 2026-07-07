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
  targetListId?: string;
  lastModified: string;
  iconKey: string;
  headline: string;
  description: string;
  buttonText: string;
  thankYouMessage: string;
  url?: string;
}

export interface LandingPageItem {
  id: string;
  name: string;
  status: string;
  slug: string;
  url: string;
  visits: number;
  signups: number;
  convRate: number;
  themeGradient: string;
  iconKey: string;
  headline: string;
  description: string;
  buttonText: string;
  thankYouMessage: string;
}

export interface WebsiteBundle {
  stats: SignUpFormStats[];
  forms: SignUpFormItem[];
  landingPages: LandingPageItem[];
  lists: AudienceList[];
}

export interface FormPreview {
  id: string;
  name: string;
  formType: string;
  status: string;
  headline: string;
  description: string;
  buttonText: string;
  thankYouMessage: string;
}

export interface LandingPagePreview {
  id: string;
  name: string;
  slug: string;
  status: string;
  themeGradient: string;
  iconKey: string;
  headline: string;
  description: string;
  buttonText: string;
  thankYouMessage: string;
}

@Injectable({ providedIn: 'root' })
export class WebsiteApiService {
  constructor(private api: ApiService) {}

  getWebsite(): Observable<WebsiteBundle> {
    return this.api.get<WebsiteBundle>('/website');
  }

  getForm(id: string): Observable<SignUpFormItem> {
    return this.api.get<SignUpFormItem>(`/website/forms/${id}`);
  }

  createForm(body: {
    name: string; formType: string; status: string;
    targetListId?: string; targetListName?: string;
    headline?: string; description?: string; buttonText?: string; thankYouMessage?: string;
  }): Observable<SignUpFormItem> {
    return this.api.post<SignUpFormItem>('/website/forms', body);
  }

  updateForm(id: string, body: {
    name: string; formType: string; status: string;
    targetListId?: string; targetListName?: string;
    headline?: string; description?: string; buttonText?: string; thankYouMessage?: string;
  }): Observable<SignUpFormItem> {
    return this.api.put<SignUpFormItem>(`/website/forms/${id}`, body);
  }

  deleteForm(id: string): Observable<void> {
    return this.api.delete<void>(`/website/forms/${id}`);
  }

  previewForm(id: string): Observable<FormPreview> {
    return this.api.get<FormPreview>(`/website/forms/${id}/preview`);
  }

  getLandingPage(id: string): Observable<LandingPageItem> {
    return this.api.get<LandingPageItem>(`/website/landing-pages/${id}`);
  }

  createLandingPage(body: {
    name: string; status: string; themeGradient: string; iconKey: string;
    headline?: string; description?: string; buttonText?: string; thankYouMessage?: string;
  }): Observable<LandingPageItem> {
    return this.api.post<LandingPageItem>('/website/landing-pages', body);
  }

  updateLandingPage(id: string, body: {
    name: string; status: string; themeGradient: string; iconKey: string; slug?: string;
    headline?: string; description?: string; buttonText?: string; thankYouMessage?: string;
  }): Observable<LandingPageItem> {
    return this.api.put<LandingPageItem>(`/website/landing-pages/${id}`, body);
  }

  deleteLandingPage(id: string): Observable<void> {
    return this.api.delete<void>(`/website/landing-pages/${id}`);
  }

  previewLandingPage(id: string): Observable<LandingPagePreview> {
    return this.api.get<LandingPagePreview>(`/website/landing-pages/${id}/preview`);
  }
}
