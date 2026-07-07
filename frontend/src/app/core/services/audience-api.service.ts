import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface SubscriberProfile {
  id: string;
  name: string;
  email: string;
  status: string;
  tags: string[];
  openRate: number;
  joinedAt: string;
  listId?: string;
}

export interface ProfileListItem {
  id: string;
  name: string;
  color: string;
}

export interface ProfileSegmentItem {
  id: string;
  name: string;
  ruleLabel: string;
}

export interface ProfileChannel {
  emailCampaignsSubscribed: boolean;
  transactionalSubscribed: boolean;
  emailCampaignsBlocklisted: boolean;
}

export interface ProfileCampaignStats {
  sent: number;
  delivered: number;
  deliveredPercent: number;
  uniqueOpens: number;
  uniqueOpenPercent: number;
  uniqueClicks: number;
  uniqueClickPercent: number;
}

export interface ProfileActivity {
  id: string;
  activityType: string;
  title: string;
  description: string;
  campaignId?: string;
  campaignSubject?: string;
  campaignFrom?: string;
  status: string;
  occurredAt: string;
  relativeTime: string;
}

export interface SubscriberProfileDetail {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  tags: string[];
  openRate: number;
  clickRate: number;
  joinedAt: string;
  note: string;
  channels: ProfileChannel;
  campaignStats: ProfileCampaignStats;
  lists: ProfileListItem[];
  totalLists: number;
  segments: ProfileSegmentItem[];
  activities: ProfileActivity[];
}

export interface AudienceList {
  id: string;
  name: string;
  description: string;
  count: number;
  color: string;
  optIn: string;
  created: string;
  updated: string;
  folderId?: string;
  folderName?: string;
}

export interface AudienceSegmentCard {
  id: string;
  name: string;
  description: string;
  count: number;
  color: string;
  ruleType: string;
  ruleLabel: string;
  folderId?: string;
  folderName?: string;
  created: string;
  updated: string;
  isDynamic: boolean;
}

export interface AudienceFolder {
  id: string;
  name: string;
  kind: string;
  itemCount: number;
}

export interface ListsSegmentsOverview {
  totalSubscribers: number;
  activeSubscribers: number;
  totalLists: number;
  totalSegments: number;
  channel: string;
}

export interface SegmentTemplate {
  key: string;
  name: string;
  description: string;
  ruleType: string;
  category: string;
}

export interface ListsSegmentsBundle {
  overview: ListsSegmentsOverview;
  listFolders: AudienceFolder[];
  segmentFolders: AudienceFolder[];
  lists: AudienceList[];
  segments: AudienceSegmentCard[];
  segmentTemplates: SegmentTemplate[];
}

export interface GrowthTool {
  key: string;
  name: string;
  description: string;
  action: string;
  tooltip: string;
  category: string;
  iconKey: string;
  configJson?: string;
}

export interface ImportContactRow {
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  tags?: string[];
  status?: string;
}

export interface ImportSubscribersRequest {
  contacts: ImportContactRow[];
  listId?: string;
  newListName?: string;
  duplicateMode?: 'skip' | 'update';
  tags?: string[];
}

export interface ImportSubscribersResult {
  totalRows: number;
  imported: number;
  updated: number;
  skipped: number;
  invalid: number;
  duplicates: number;
  listId?: string;
  listName?: string;
  errors: string[];
}

@Injectable({ providedIn: 'root' })
export class AudienceApiService {
  constructor(private api: ApiService) {}

  getProfiles(search?: string, status?: string, listId?: string, segmentId?: string): Observable<SubscriberProfile[]> {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (status) params.set('status', status);
    if (listId) params.set('listId', listId);
    if (segmentId) params.set('segmentId', segmentId);
    const q = params.toString();
    return this.api.get<SubscriberProfile[]>(`/audience/profiles${q ? `?${q}` : ''}`);
  }

  getProfile(id: string): Observable<SubscriberProfileDetail> {
    return this.api.get<SubscriberProfileDetail>(`/audience/profiles/${id}`);
  }

  updateProfile(id: string, body: {
    name?: string; email?: string; status?: string; tags?: string[];
    openRate?: number; clickRate?: number; note?: string; listIds?: string[];
  }): Observable<SubscriberProfileDetail> {
    return this.api.put<SubscriberProfileDetail>(`/audience/profiles/${id}`, body);
  }

  deleteProfile(id: string): Observable<void> {
    return this.api.delete<void>(`/audience/profiles/${id}`);
  }

  createProfile(body: {
    name: string; email: string; status: string;
    tags?: string[]; openRate?: number; listId?: string;
    listIds?: string[]; note?: string;
  }): Observable<SubscriberProfile> {
    return this.api.post<SubscriberProfile>('/audience/profiles', body);
  }

  importSubscribers(body: ImportSubscribersRequest): Observable<ImportSubscribersResult> {
    return this.api.post<ImportSubscribersResult>('/audience/import', body);
  }

  getListsSegments(): Observable<ListsSegmentsBundle> {
    return this.api.get<ListsSegmentsBundle>('/audience/lists-segments');
  }

  createFolder(body: { name: string; kind: 'list' | 'segment' }): Observable<AudienceFolder> {
    return this.api.post<AudienceFolder>('/audience/folders', body);
  }

  createList(body: {
    name: string; description: string; color: string;
    optInMethod: string; folderId?: string;
  }): Observable<AudienceList> {
    return this.api.post<AudienceList>('/audience/lists', body);
  }

  createSegment(body: {
    name: string; description: string; color: string;
    ruleType: string; folderId?: string; ruleConfigJson?: string;
  }): Observable<AudienceSegmentCard> {
    return this.api.post<AudienceSegmentCard>('/audience/segments', body);
  }

  getGrowthTools(): Observable<{ tools: GrowthTool[] }> {
    return this.api.get<{ tools: GrowthTool[] }>('/audience/growth-tools');
  }

  saveGrowthToolConfig(toolKey: string, configJson: string): Observable<void> {
    return this.api.put<void>(`/audience/growth-tools/${toolKey}`, { configJson });
  }
}
