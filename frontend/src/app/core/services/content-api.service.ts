import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Campaign } from '../models/campaign.models';

export interface EmailTemplate {
  id: string;
  name: string;
  category: string;
  preview: string;
  description: string;
  subjectLine: string;
  previewText: string;
  htmlBody: string;
  iconKey: string;
  suggestedCampaignType: string;
}

export interface ContentBlock {
  id: string;
  name: string;
  type: string;
  description: string;
  usedIn: number;
  iconKey: string;
  htmlBody: string;
}

export interface BrandColor {
  label: string;
  value: string;
}

export interface BrandAsset {
  id: string;
  name: string;
  size: string;
  iconKey: string;
}

export interface ContentBundle {
  templates: EmailTemplate[];
  blocks: ContentBlock[];
  brandColors: BrandColor[];
  assets: BrandAsset[];
}

@Injectable({ providedIn: 'root' })
export class ContentApiService {
  constructor(private api: ApiService) {}

  getContent(): Observable<ContentBundle> {
    return this.api.get<ContentBundle>('/content');
  }

  getTemplate(id: string): Observable<EmailTemplate> {
    return this.api.get<EmailTemplate>(`/content/templates/${id}`);
  }

  useTemplate(id: string): Observable<Campaign> {
    return this.api.post<Campaign>(`/content/templates/${id}/use`, {});
  }

  createBlock(body: { name: string; blockType: string; description: string; iconKey: string }): Observable<ContentBlock> {
    return this.api.post<ContentBlock>('/content/blocks', body);
  }

  useBlock(id: string): Observable<Campaign> {
    return this.api.post<Campaign>(`/content/blocks/${id}/use`, {});
  }

  updateBrandColors(colors: BrandColor[]): Observable<BrandColor[]> {
    return this.api.put<BrandColor[]>('/content/brand/colors', { colors });
  }

  createAsset(body: { name: string; fileType: string; sizeBytes: number; iconKey: string }): Observable<BrandAsset> {
    return this.api.post<BrandAsset>('/content/brand/assets', body);
  }
}
