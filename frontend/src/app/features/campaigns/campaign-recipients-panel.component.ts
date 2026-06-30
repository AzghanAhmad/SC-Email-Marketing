import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  AudienceApiService,
  AudienceList,
  AudienceSegmentCard,
  SubscriberProfile,
} from '../../core/services/audience-api.service';
import { groupByFolder } from '../audience/audience-campaign-links';

export interface CampaignRecipients {
  listIds: string[];
  segmentIds: string[];
  contactIds: string[];
  excludeUnengaged: boolean;
}

type RecipientTab = 'lists' | 'segments' | 'contacts';

@Component({
  selector: 'app-campaign-recipients-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="recipients-panel">
      <h2 class="panel-title">Recipients</h2>
      <p class="panel-sub">The people who receive your campaign</p>

      <div class="form-group">
        <label class="form-label">Send to</label>
        <p class="field-hint">Select list(s), segment(s) or individual contacts — same as Brevo campaign recipients</p>
        <div class="search-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input class="search-input" type="text" placeholder="Search lists, segments, contacts…" [(ngModel)]="searchQuery" (ngModelChange)="onSearchChange()" />
        </div>
      </div>

      <div class="recipient-tabs">
        <button class="recipient-tab" [class.active]="tab === 'lists'" (click)="tab = 'lists'">
          Lists <span class="tab-pill">{{ local.listIds.length || '' }}</span>
        </button>
        <button class="recipient-tab" [class.active]="tab === 'segments'" (click)="tab = 'segments'">
          Segments <span class="tab-pill">{{ local.segmentIds.length || '' }}</span>
        </button>
        <button class="recipient-tab" [class.active]="tab === 'contacts'" (click)="tab = 'contacts'">
          Individual contacts <span class="tab-pill">{{ local.contactIds.length || '' }}</span>
        </button>
      </div>

      <div class="recipient-list" *ngIf="tab === 'lists'">
        <ng-container *ngFor="let group of groupedLists">
          <div class="folder-block">
            <button type="button" class="folder-toggle" (click)="toggleFolder('list', group.folderId)">
              <svg class="chevron" [class.open]="isFolderOpen('list', group.folderId)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polyline points="9 18 15 12 9 6"/></svg>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="14" height="14"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
              <span>{{ group.folderName }}</span>
              <span class="folder-meta">{{ group.items.length }} list(s)</span>
            </button>
            <div *ngIf="isFolderOpen('list', group.folderId)">
              <label class="recipient-item" *ngFor="let list of group.items">
                <input type="checkbox" [checked]="isListSelected(list.id)" (change)="toggleList(list.id)" />
                <div class="recipient-info">
                  <span class="recipient-name">
                    <span class="color-dot" [style.background]="list.color"></span>
                    {{ list.name }}
                  </span>
                  <span class="recipient-meta">{{ list.count | number }} contacts</span>
                </div>
              </label>
            </div>
          </div>
        </ng-container>
        <p class="empty-hint" *ngIf="groupedLists.length === 0">No lists found. <a routerLink="/audience/lists-segments">Create a list</a></p>
      </div>

      <div class="recipient-list" *ngIf="tab === 'segments'">
        <ng-container *ngFor="let group of groupedSegments">
          <div class="folder-block">
            <button type="button" class="folder-toggle" (click)="toggleFolder('segment', group.folderId)">
              <svg class="chevron" [class.open]="isFolderOpen('segment', group.folderId)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polyline points="9 18 15 12 9 6"/></svg>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="14" height="14"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
              <span>{{ group.folderName }}</span>
              <span class="folder-meta">{{ group.items.length }} segment(s)</span>
            </button>
            <div *ngIf="isFolderOpen('segment', group.folderId)">
              <label class="recipient-item" *ngFor="let seg of group.items">
                <input type="checkbox" [checked]="isSegmentSelected(seg.id)" (change)="toggleSegment(seg.id)" />
                <div class="recipient-info">
                  <span class="recipient-name">
                    <span class="color-dot" [style.background]="seg.color"></span>
                    {{ seg.name }}
                  </span>
                  <span class="recipient-meta">{{ seg.count | number }} contacts · {{ seg.ruleLabel }}</span>
                </div>
              </label>
            </div>
          </div>
        </ng-container>
        <p class="empty-hint" *ngIf="groupedSegments.length === 0">No segments found. <a routerLink="/audience/lists-segments">Create a segment</a></p>
      </div>

      <div class="recipient-list" *ngIf="tab === 'contacts'">
        <label class="recipient-item" *ngFor="let c of filteredContacts">
          <input type="checkbox" [checked]="isContactSelected(c.id)" (change)="toggleContact(c.id)" />
          <div class="recipient-info">
            <span class="recipient-name">{{ c.name || c.email }}</span>
            <span class="recipient-meta">{{ c.email }}</span>
          </div>
        </label>
        <p class="empty-hint" *ngIf="filteredContacts.length === 0">No contacts found.</p>
      </div>

      <div class="selection-summary" *ngIf="hasSelection">
        <span *ngIf="local.listIds.length">{{ local.listIds.length }} list(s)</span>
        <span *ngIf="local.segmentIds.length">{{ local.segmentIds.length }} segment(s)</span>
        <span *ngIf="local.contactIds.length">{{ local.contactIds.length }} contact(s)</span>
        selected
      </div>

      <label class="unengaged-toggle">
        <input type="checkbox" [(ngModel)]="local.excludeUnengaged" (ngModelChange)="emitChange()" />
        <span>Don't send to unengaged contacts</span>
      </label>

      <div class="recipient-footer">
        <div class="recipient-count">
          <strong>{{ estimatedRecipients | number }}</strong> estimated recipients
        </div>
        <p class="plan-note">Lists and segments from your audience are used when this campaign sends.</p>
      </div>
    </div>
  `,
  styles: [`
    .panel-title { font-size:1.25rem; font-weight:700; color:#0f172a; margin:0 0 .25rem; }
    .panel-sub { font-size:.875rem; color:#64748b; margin:0 0 1.25rem; }
    .form-group { margin-bottom:1rem; }
    .form-label { display:block; font-size:.8125rem; font-weight:600; color:#334155; margin-bottom:.25rem; }
    .field-hint { font-size:.75rem; color:#94a3b8; margin:0 0 .5rem; }
    .search-wrap { display:flex; align-items:center; gap:.5rem; padding:.5rem .75rem; border:1.5px solid #e2e8f0; border-radius:10px; background:#fff; }
    .search-wrap svg { color:#94a3b8; flex-shrink:0; }
    .search-input { border:none; outline:none; flex:1; font-size:.875rem; font-family:inherit; background:transparent; }
    .recipient-tabs { display:flex; gap:.25rem; margin-bottom:1rem; border-bottom:1px solid #e2e8f0; }
    .recipient-tab { padding:.5rem 1rem; border:none; background:transparent; font-size:.8125rem; font-weight:500; color:#64748b; cursor:pointer; font-family:inherit; border-bottom:2px solid transparent; margin-bottom:-1px; display:flex; align-items:center; gap:.35rem; }
    .recipient-tab.active { color:#3b82f6; font-weight:600; border-bottom-color:#3b82f6; }
    .tab-pill { font-size:.65rem; background:rgba(59,130,246,0.12); color:#3b82f6; padding:.1rem .35rem; border-radius:100px; min-width:14px; text-align:center; }
    .recipient-list { max-height:320px; overflow-y:auto; border:1.5px solid #e2e8f0; border-radius:12px; margin-bottom:1rem; }
    .folder-block { border-bottom:1px solid #f1f5f9; }
    .folder-block:last-child { border-bottom:none; }
    .folder-toggle { width:100%; display:flex; align-items:center; gap:.5rem; padding:.625rem .875rem; border:none; background:#f8fafc; font-size:.8125rem; font-weight:600; color:#334155; cursor:pointer; font-family:inherit; text-align:left; }
    .folder-toggle:hover { background:#f1f5f9; }
    .folder-meta { margin-left:auto; font-size:.72rem; font-weight:500; color:#94a3b8; }
    .chevron { transition:transform .15s; color:#94a3b8; }
    .chevron.open { transform:rotate(90deg); }
    .recipient-item { display:flex; align-items:center; gap:.75rem; padding:.75rem 1rem .75rem 1.75rem; border-bottom:1px solid #f8fafc; cursor:pointer; }
    .recipient-item:last-child { border-bottom:none; }
    .recipient-item:hover { background:#f8fafc; }
    .recipient-item input { width:16px; height:16px; accent-color:#3b82f6; }
    .recipient-info { display:flex; flex-direction:column; gap:.1rem; min-width:0; }
    .recipient-name { font-size:.875rem; font-weight:600; color:#0f172a; display:flex; align-items:center; gap:.5rem; }
    .color-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
    .recipient-meta { font-size:.75rem; color:#94a3b8; }
    .empty-hint { padding:1.5rem; text-align:center; color:#94a3b8; font-size:.8125rem; margin:0; }
    .empty-hint a { color:#3b82f6; }
    .selection-summary { font-size:.8125rem; color:#3b82f6; font-weight:600; margin-bottom:.75rem; display:flex; gap:.5rem; flex-wrap:wrap; }
    .unengaged-toggle { display:flex; align-items:center; gap:.625rem; font-size:.875rem; color:#334155; margin-bottom:1rem; cursor:pointer; }
    .unengaged-toggle input { width:16px; height:16px; accent-color:#3b82f6; }
    .recipient-footer { background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:12px; padding:1rem 1.25rem; }
    .recipient-count { font-size:1rem; color:#0f172a; margin-bottom:.25rem; }
    .plan-note { font-size:.75rem; color:#94a3b8; margin:0; }
  `]
})
export class CampaignRecipientsPanelComponent implements OnInit {
  private audienceApi = inject(AudienceApiService);

  @Input() recipients: CampaignRecipients = { listIds: [], segmentIds: [], contactIds: [], excludeUnengaged: false };
  @Output() recipientsChange = new EventEmitter<CampaignRecipients>();

  tab: RecipientTab = 'lists';
  searchQuery = '';
  lists: AudienceList[] = [];
  segments: AudienceSegmentCard[] = [];
  contacts: SubscriberProfile[] = [];
  local: CampaignRecipients = { listIds: [], segmentIds: [], contactIds: [], excludeUnengaged: false };
  openFolders = new Set<string>();

  ngOnInit() {
    this.local = { ...this.recipients, listIds: [...this.recipients.listIds], segmentIds: [...this.recipients.segmentIds], contactIds: [...this.recipients.contactIds] };
    this.audienceApi.getListsSegments().subscribe(bundle => {
      this.lists = bundle.lists;
      this.segments = bundle.segments;
      for (const g of groupByFolder(this.lists)) this.openFolders.add(`list:${g.folderId}`);
      for (const g of groupByFolder(this.segments)) this.openFolders.add(`segment:${g.folderId}`);
      if (this.local.listIds.length) this.tab = 'lists';
      else if (this.local.segmentIds.length) this.tab = 'segments';
      else if (this.local.contactIds.length) this.tab = 'contacts';
    });
    this.loadContacts();
  }

  get filteredLists() {
    const q = this.searchQuery.toLowerCase();
    return this.lists.filter(l => !q || l.name.toLowerCase().includes(q));
  }

  get filteredSegments() {
    const q = this.searchQuery.toLowerCase();
    return this.segments.filter(s => !q || s.name.toLowerCase().includes(q));
  }

  get groupedLists() {
    return groupByFolder(this.filteredLists);
  }

  get groupedSegments() {
    return groupByFolder(this.filteredSegments);
  }

  get filteredContacts() {
    const q = this.searchQuery.toLowerCase();
    return this.contacts.filter(c => !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
  }

  get hasSelection(): boolean {
    return this.local.listIds.length > 0 || this.local.segmentIds.length > 0 || this.local.contactIds.length > 0;
  }

  get estimatedRecipients(): number {
    let total = 0;
    for (const id of this.local.listIds) total += this.lists.find(l => l.id === id)?.count ?? 0;
    for (const id of this.local.segmentIds) total += this.segments.find(s => s.id === id)?.count ?? 0;
    total += this.local.contactIds.length;
    if (this.local.excludeUnengaged && total > 0) total = Math.max(1, Math.round(total * 0.85));
    return total;
  }

  folderKey(kind: 'list' | 'segment', folderId: string) {
    return `${kind}:${folderId}`;
  }

  isFolderOpen(kind: 'list' | 'segment', folderId: string) {
    return this.openFolders.has(this.folderKey(kind, folderId));
  }

  toggleFolder(kind: 'list' | 'segment', folderId: string) {
    const key = this.folderKey(kind, folderId);
    if (this.openFolders.has(key)) this.openFolders.delete(key);
    else this.openFolders.add(key);
  }

  onSearchChange() {
    if (this.tab === 'contacts') this.loadContacts();
  }

  loadContacts() {
    this.audienceApi.getProfiles(this.searchQuery || undefined).subscribe(c => this.contacts = c);
  }

  isListSelected(id: string) { return this.local.listIds.includes(id); }
  isSegmentSelected(id: string) { return this.local.segmentIds.includes(id); }
  isContactSelected(id: string) { return this.local.contactIds.includes(id); }

  toggleList(id: string) {
    this.local.listIds = this.isListSelected(id) ? this.local.listIds.filter(x => x !== id) : [...this.local.listIds, id];
    this.emitChange();
  }

  toggleSegment(id: string) {
    this.local.segmentIds = this.isSegmentSelected(id) ? this.local.segmentIds.filter(x => x !== id) : [...this.local.segmentIds, id];
    this.emitChange();
  }

  toggleContact(id: string) {
    this.local.contactIds = this.isContactSelected(id) ? this.local.contactIds.filter(x => x !== id) : [...this.local.contactIds, id];
    this.emitChange();
  }

  emitChange() {
    this.recipientsChange.emit({ ...this.local });
  }
}
