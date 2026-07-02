import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Campaign } from '../models/campaign.models';
import { environment } from '../../../environments/environment';

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
  isCustom: boolean;
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
  url?: string | null;
  mimeType?: string | null;
}

export interface ContentBundle {
  templates: EmailTemplate[];
  blocks: ContentBlock[];
  brandColors: BrandColor[];
  assets: BrandAsset[];
  websiteTemplates: WebsiteTemplate[];
}

export interface WebsiteTemplate {
  id: string;
  name: string;
  category: string;
  previewCode: string;
  description: string;
  htmlBody: string;
  iconKey: string;
  templateKind: 'signup-form' | 'landing-page';
  formType?: string;
  themeGradient?: string;
  suggestedName: string;
  headline: string;
  bodyDescription: string;
  buttonText: string;
  thankYouMessage: string;
  defaultStatus: string;
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

  createCustomTemplate(body: { name: string; description?: string; subjectLine?: string }): Observable<EmailTemplate> {
    return this.api.post<EmailTemplate>('/content/templates', body);
  }

  updateTemplate(id: string, body: { name?: string; description?: string; subjectLine?: string; htmlBody?: string }): Observable<EmailTemplate> {
    return this.api.put<EmailTemplate>(`/content/templates/${id}`, body);
  }

  deleteTemplate(id: string): Observable<void> {
    return this.api.delete<void>(`/content/templates/${id}`);
  }

  appendBlockToTemplate(templateId: string, blockId: string, insertAtStart = false): Observable<EmailTemplate> {
    return this.api.post<EmailTemplate>(`/content/templates/${templateId}/blocks/${blockId}`, { insertAtStart });
  }

  useTemplate(id: string): Observable<Campaign> {
    return this.api.post<Campaign>(`/content/templates/${id}/use`, {});
  }

  getWebsiteTemplate(id: string): Observable<WebsiteTemplate> {
    return this.api.get<WebsiteTemplate>(`/content/website-templates/${id}`);
  }

  getBlock(id: string): Observable<ContentBlock> {
    return this.api.get<ContentBlock>(`/content/blocks/${id}`);
  }

  createBlock(body: { name: string; blockType: string; description: string; iconKey: string }): Observable<ContentBlock> {
    return this.api.post<ContentBlock>('/content/blocks', body);
  }

  updateBlock(id: string, body: { name?: string; blockType?: string; description?: string; iconKey?: string; htmlBody?: string }): Observable<ContentBlock> {
    return this.api.put<ContentBlock>(`/content/blocks/${id}`, body);
  }

  deleteBlock(id: string): Observable<void> {
    return this.api.delete<void>(`/content/blocks/${id}`);
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

  uploadAsset(file: File, name: string, assetCategory: string): Observable<BrandAsset> {
    const form = new FormData();
    form.append('file', file);
    form.append('name', name);
    form.append('assetCategory', assetCategory);
    return this.api.postForm<BrandAsset>('/content/brand/assets/upload', form);
  }

  deleteAsset(id: string): Observable<void> {
    return this.api.delete<void>(`/content/brand/assets/${id}`);
  }

  assetFullUrl(asset: BrandAsset): string | null {
    if (!asset.url) return null;
    if (asset.url.startsWith('http')) return asset.url;
    const origin = environment.apiUrl.replace(/\/api\/v1\/?$/, '');
    return `${origin}${asset.url}`;
  }
}
