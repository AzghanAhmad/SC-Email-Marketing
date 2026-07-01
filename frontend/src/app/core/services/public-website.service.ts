import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface PublicFormPreview {
  id: string;
  name: string;
  formType: string;
  status: string;
  headline: string;
  description: string;
  buttonText: string;
  thankYouMessage: string;
}

export interface PublicLandingPage {
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

export interface SubmitResult {
  message: string;
  success: boolean;
}

@Injectable({ providedIn: 'root' })
export class PublicWebsiteService {
  private api = inject(ApiService);

  getForm(id: string): Observable<PublicFormPreview> {
    return this.api.get<PublicFormPreview>(`/public/website/forms/${id}`);
  }

  submitForm(id: string, body: { email: string; firstName?: string }): Observable<SubmitResult> {
    return this.api.post<SubmitResult>(`/public/website/forms/${id}/submit`, body);
  }

  getLandingPage(slug: string): Observable<PublicLandingPage> {
    return this.api.get<PublicLandingPage>(`/public/website/landing-pages/${slug}`);
  }

  submitLandingPage(slug: string, body: { email: string; firstName?: string }): Observable<SubmitResult> {
    return this.api.post<SubmitResult>(`/public/website/landing-pages/${slug}/submit`, body);
  }
}
