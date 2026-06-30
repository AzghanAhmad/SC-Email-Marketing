import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  AudienceApiService, AudienceList, AudienceSegmentCard, AudienceFolder,
  ListsSegmentsOverview, SegmentTemplate,
} from '../../../core/services/audience-api.service';
import { groupByFolder, AudienceFolderGroup } from '../audience-campaign-links';

@Component({
  selector: 'app-lists-segments',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="page-wrapper">
      <div class="page-header">
        <div>
          <div class="title-row">
            <h1 class="page-title">Lists & Segments</h1>
            <span class="channel-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="14" height="14"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              Email campaigns only
            </span>
          </div>
          <p class="page-subtitle">Organize email subscribers into static lists or dynamic segments for targeted campaigns</p>
        </div>
        <div class="header-actions">
          <button class="btn-ghost btn-sm" (click)="showGuide = !showGuide">
            {{ showGuide ? 'Hide guide' : 'Lists vs Segments' }}
          </button>
          <button class="btn-secondary" *ngIf="activeTab === 'lists'" (click)="openCreateFolderModal('list')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
            New Folder
          </button>
          <button class="btn-secondary" *ngIf="activeTab === 'segments'" (click)="openCreateFolderModal('segment')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
            New Folder
          </button>
          <button class="btn-secondary" *ngIf="activeTab === 'lists'" (click)="openCreateListModal()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Create List
          </button>
          <button class="btn-primary" *ngIf="activeTab === 'segments'" (click)="openCreateSegmentModal()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Create Segment
          </button>
        </div>
      </div>

      <!-- Overview stats -->
      <div class="overview-row" *ngIf="overview()">
        <div class="glass-card stat-card">
          <span class="stat-val">{{ overview()!.totalSubscribers | number }}</span>
          <span class="stat-label">Total email subscribers</span>
        </div>
        <div class="glass-card stat-card">
          <span class="stat-val">{{ overview()!.activeSubscribers | number }}</span>
          <span class="stat-label">Active (can receive email)</span>
        </div>
        <div class="glass-card stat-card">
          <span class="stat-val">{{ overview()!.totalLists }}</span>
          <span class="stat-label">Static lists</span>
        </div>
        <div class="glass-card stat-card">
          <span class="stat-val">{{ overview()!.totalSegments }}</span>
          <span class="stat-label">Dynamic segments</span>
        </div>
      </div>

      <!-- Lists vs Segments guide (Brevo-style) -->
      <div class="glass-card guide-card" *ngIf="showGuide">
        <div class="guide-grid">
          <div class="guide-col">
            <div class="guide-head">
              <span class="guide-icon static">L</span>
              <h3>Lists — Static</h3>
            </div>
            <p>Manual collections of email subscribers. Contacts stay until you remove them via import, sign-up forms, or manual edit.</p>
            <ul>
              <li>Organize by signup source or interest</li>
              <li>Assign subscribers when importing or via forms</li>
              <li>Best for newsletters and long-term groups</li>
            </ul>
          </div>
          <div class="guide-col">
            <div class="guide-head">
              <span class="guide-icon dynamic">S</span>
              <h3>Segments — Dynamic</h3>
            </div>
            <p>Rule-based groups that update automatically based on email behavior — opens, bounces, subscription status, and list membership.</p>
            <ul>
              <li>Target engaged or inactive readers</li>
              <li>Always reflects current email activity</li>
              <li>Best for re-engagement and personalization</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tabs">
        <button class="tab" [class.active]="activeTab === 'lists'" (click)="activeTab='lists'">
          Lists <span class="tab-count">{{ lists().length }}</span>
        </button>
        <button class="tab" [class.active]="activeTab === 'segments'" (click)="activeTab='segments'">
          Segments <span class="tab-count">{{ segments().length }}</span>
        </button>
      </div>

      <!-- Toolbar -->
      <div class="toolbar">
        <select class="filter-select" [(ngModel)]="folderFilter">
          <option value="">All folders</option>
          <option *ngFor="let f of currentFolders" [value]="f.id">{{ f.name }} ({{ f.itemCount }})</option>
        </select>
        <div class="search-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input class="search-input" type="text" [placeholder]="activeTab === 'lists' ? 'Search lists...' : 'Search segments...'" [(ngModel)]="searchQuery" />
        </div>
      </div>

      <!-- LISTS TAB -->
      <div *ngIf="activeTab === 'lists'">
        <div class="info-banner">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          Lists are static. Subscribers are added through sign-up forms, imports, or manual entry and remain until removed.
        </div>
        <div class="glass-card table-card">
          <table class="data-table">
            <thead>
              <tr>
                <th>List name</th>
                <th>Folder</th>
                <th>Contacts</th>
                <th>Opt-in</th>
                <th>Created</th>
                <th>Last updated</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr *ngIf="filteredLists.length === 0">
                <td colspan="7" class="empty-row">No lists yet. Create a list to organize your email subscribers.</td>
              </tr>
              <ng-container *ngFor="let group of groupedLists">
                <tr class="folder-section-row">
                  <td colspan="7">
                    <div class="folder-section-head">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="14" height="14"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                      <span class="folder-section-name">{{ group.folderName }}</span>
                      <span class="folder-section-count">{{ group.items.length }} list{{ group.items.length === 1 ? '' : 's' }}</span>
                    </div>
                  </td>
                </tr>
                <tr *ngFor="let list of group.items" class="data-row">
                  <td>
                    <div class="list-name-cell">
                      <div class="list-color" [style.background]="list.color"></div>
                      <div>
                        <a class="ln-name ln-link" [routerLink]="['/audience/profiles']" [queryParams]="{ listId: list.id, audienceName: list.name }">{{ list.name }}</a>
                        <p class="ln-desc">{{ list.description || 'No description' }}</p>
                      </div>
                    </div>
                  </td>
                  <td><span class="folder-tag">{{ list.folderName || 'Uncategorized' }}</span></td>
                  <td class="num-cell">{{ list.count | number }}</td>
                  <td><span class="type-badge">{{ list.optIn }}</span></td>
                  <td class="muted">{{ list.created }}</td>
                  <td class="muted">{{ list.updated }}</td>
                  <td>
                    <div class="row-actions">
                      <a class="btn-ghost btn-sm action-link" [routerLink]="['/campaigns']" [queryParams]="{ create: '1', listId: list.id, audienceName: list.name }">Send email</a>
                      <a class="btn-ghost btn-sm action-link" [routerLink]="['/audience/profiles']" [queryParams]="{ listId: list.id, audienceName: list.name }">View contacts</a>
                    </div>
                  </td>
                </tr>
              </ng-container>
            </tbody>
          </table>
        </div>
      </div>

      <!-- SEGMENTS TAB -->
      <div *ngIf="activeTab === 'segments'">
        <div class="info-banner dynamic">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          Segments update automatically based on email conditions. Use them for targeted email campaigns and re-engagement.
        </div>

        <!-- Pre-built email segment templates -->
        <div class="templates-section" *ngIf="segmentTemplates().length > 0">
          <h3 class="section-title">Email segment templates</h3>
          <p class="section-sub">Quick-start segments based on common email campaign scenarios</p>
          <div class="templates-grid">
            <button class="glass-card template-card" *ngFor="let t of segmentTemplates()" (click)="createFromTemplate(t)">
              <span class="tpl-cat">{{ t.category }}</span>
              <span class="tpl-name">{{ t.name }}</span>
              <span class="tpl-desc">{{ t.description }}</span>
            </button>
          </div>
        </div>

        <div class="glass-card table-card">
          <table class="data-table">
            <thead>
              <tr>
                <th>Segment name</th>
                <th>Folder</th>
                <th>Email conditions</th>
                <th>Contacts</th>
                <th>Last updated</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr *ngIf="filteredSegments.length === 0">
                <td colspan="6" class="empty-row">No segments yet. Use a template above or create a custom email segment.</td>
              </tr>
              <ng-container *ngFor="let group of groupedSegments">
                <tr class="folder-section-row">
                  <td colspan="6">
                    <div class="folder-section-head">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="14" height="14"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                      <span class="folder-section-name">{{ group.folderName }}</span>
                      <span class="folder-section-count">{{ group.items.length }} segment{{ group.items.length === 1 ? '' : 's' }}</span>
                    </div>
                  </td>
                </tr>
                <tr *ngFor="let seg of group.items" class="data-row">
                  <td>
                    <div class="list-name-cell">
                      <div class="list-color" [style.background]="seg.color"></div>
                      <div>
                        <a class="ln-name ln-link" [routerLink]="['/audience/profiles']" [queryParams]="{ segmentId: seg.id, audienceName: seg.name }">{{ seg.name }}</a>
                        <p class="ln-desc">{{ seg.description || 'No description' }}</p>
                      </div>
                    </div>
                  </td>
                  <td><span class="folder-tag">{{ seg.folderName || 'Uncategorized' }}</span></td>
                  <td>
                    <div class="condition-cell">
                      <span class="dynamic-badge">Dynamic</span>
                      <span class="rule-text">{{ seg.ruleLabel }}</span>
                    </div>
                  </td>
                  <td class="num-cell">{{ seg.count | number }}</td>
                  <td class="muted">{{ seg.updated }}</td>
                  <td>
                    <div class="row-actions">
                      <a class="btn-ghost btn-sm action-link" [routerLink]="['/campaigns']" [queryParams]="{ create: '1', segmentId: seg.id, audienceName: seg.name }">Send email</a>
                      <a class="btn-ghost btn-sm action-link" [routerLink]="['/audience/profiles']" [queryParams]="{ segmentId: seg.id, audienceName: seg.name }">View contacts</a>
                    </div>
                  </td>
                </tr>
              </ng-container>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Create Folder Modal -->
      <div class="modal-backdrop" *ngIf="showFolderModal" (click)="closeModals()">
        <div class="modal-card" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3 class="modal-title">Create {{ folderModalKind === 'list' ? 'List' : 'Segment' }} Folder</h3>
            <button class="close-btn" (click)="closeModals()">×</button>
          </div>
          <div class="modal-body">
            <div class="setup-field">
              <label>Folder name</label>
              <input type="text" [(ngModel)]="newFolderName" placeholder="e.g. Newsletter" class="text-input">
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-secondary" (click)="closeModals()">Cancel</button>
            <button class="btn-primary" (click)="createFolder()" [disabled]="!newFolderName.trim()">Create folder</button>
          </div>
        </div>
      </div>

      <!-- Create List Modal -->
      <div class="modal-backdrop" *ngIf="showCreateListModal" (click)="closeModals()">
        <div class="modal-card" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3 class="modal-title">Create List</h3>
            <button class="close-btn" (click)="closeModals()">×</button>
          </div>
          <div class="modal-body">
            <div class="setup-field">
              <label>List name</label>
              <input type="text" [(ngModel)]="newList.name" placeholder="e.g. Fantasy Readers" class="text-input">
            </div>
            <div class="setup-field">
              <label>Description</label>
              <input type="text" [(ngModel)]="newList.description" placeholder="Optional description" class="text-input">
            </div>
            <div class="setup-field">
              <label>Folder</label>
              <select [(ngModel)]="newList.folderId" class="select-input">
                <option value="">Uncategorized</option>
                <option *ngFor="let f of listFolders()" [value]="f.id">{{ f.name }}</option>
              </select>
            </div>
            <div class="setup-field">
              <label>Email opt-in method</label>
              <select [(ngModel)]="newList.optIn" class="select-input">
                <option value="Single">Single opt-in</option>
                <option value="Double">Double opt-in (confirmed email)</option>
              </select>
            </div>
            <div class="setup-field">
              <label>Color tag</label>
              <input type="color" [(ngModel)]="newList.color" class="color-picker">
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-secondary" (click)="closeModals()">Cancel</button>
            <button class="btn-primary" (click)="createList()" [disabled]="!newList.name">Create list</button>
          </div>
        </div>
      </div>

      <!-- Create Segment Modal -->
      <div class="modal-backdrop" *ngIf="showCreateSegmentModal" (click)="closeModals()">
        <div class="modal-card modal-wide" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3 class="modal-title">Create Email Segment</h3>
            <button class="close-btn" (click)="closeModals()">×</button>
          </div>
          <div class="modal-body">
            <div class="setup-field">
              <label>Segment name</label>
              <input type="text" [(ngModel)]="newSegment.name" placeholder="e.g. Engaged readers" class="text-input">
            </div>
            <div class="setup-field">
              <label>Description</label>
              <input type="text" [(ngModel)]="newSegment.description" placeholder="Optional description" class="text-input">
            </div>
            <div class="setup-field">
              <label>Folder</label>
              <select [(ngModel)]="newSegment.folderId" class="select-input">
                <option value="">Uncategorized</option>
                <option *ngFor="let f of segmentFolders()" [value]="f.id">{{ f.name }}</option>
              </select>
            </div>
            <div class="setup-field">
              <label>Email condition</label>
              <select [(ngModel)]="newSegment.ruleType" class="select-input">
                <optgroup label="Subscription">
                  <option value="active">Subscribed to email campaigns</option>
                  <option value="unsubscribed">Unsubscribed from email</option>
                  <option value="new_30d">Subscribed in last 30 days</option>
                </optgroup>
                <optgroup label="Engagement">
                  <option value="open_rate_gt_50">Email open rate above 50%</option>
                  <option value="open_rate_lt_10">Email open rate below 10%</option>
                  <option value="never_opened">Never opened an email</option>
                  <option value="inactive_90d">Inactive 90+ days</option>
                </optgroup>
                <optgroup label="Deliverability">
                  <option value="bounced">Bounced email address</option>
                </optgroup>
                <optgroup label="List membership">
                  <option value="member_of_list">Member of a specific list</option>
                </optgroup>
              </select>
            </div>
            <div class="setup-field" *ngIf="newSegment.ruleType === 'member_of_list'">
              <label>List</label>
              <select [(ngModel)]="newSegment.memberListId" class="select-input">
                <option value="">Select a list...</option>
                <option *ngFor="let l of lists()" [value]="l.id">{{ l.name }}</option>
              </select>
            </div>
            <div class="setup-field">
              <label>Color tag</label>
              <input type="color" [(ngModel)]="newSegment.color" class="color-picker">
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-secondary" (click)="closeModals()">Cancel</button>
            <button class="btn-primary" (click)="createSegment()" [disabled]="!newSegment.name">Create segment</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .title-row { display:flex; align-items:center; gap:.75rem; flex-wrap:wrap; }
    .channel-badge { display:inline-flex; align-items:center; gap:.35rem; padding:.25rem .65rem; background:rgba(59,130,246,0.08); border:1px solid rgba(59,130,246,0.2); border-radius:100px; font-size:.7rem; font-weight:600; color:#3b82f6; }
    .header-actions { display:flex; gap:.5rem; flex-wrap:wrap; align-items:center; }
    .overview-row { display:grid; grid-template-columns:repeat(4,1fr); gap:1rem; margin-bottom:1.25rem; }
    .stat-card { padding:1rem 1.25rem; display:flex; flex-direction:column; gap:.15rem; }
    .stat-val { font-size:1.375rem; font-weight:800; color:#0f172a; letter-spacing:-.02em; }
    .stat-label { font-size:.7rem; font-weight:600; color:#94a3b8; text-transform:uppercase; letter-spacing:.05em; }
    .guide-card { padding:1.25rem 1.5rem; margin-bottom:1.25rem; background:linear-gradient(135deg,rgba(59,130,246,0.04),rgba(99,102,241,0.04)); border:1.5px solid rgba(59,130,246,0.12); }
    .guide-grid { display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; }
    .guide-head { display:flex; align-items:center; gap:.625rem; margin-bottom:.5rem; }
    .guide-head h3 { margin:0; font-size:.9375rem; font-weight:700; color:#0f172a; }
    .guide-icon { width:28px; height:28px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:.75rem; font-weight:800; }
    .guide-icon.static { background:rgba(59,130,246,0.12); color:#3b82f6; }
    .guide-icon.dynamic { background:rgba(16,185,129,0.12); color:#059669; }
    .guide-col p { font-size:.8125rem; color:#64748b; margin:0 0 .625rem; line-height:1.5; }
    .guide-col ul { margin:0; padding-left:1.125rem; font-size:.78rem; color:#64748b; line-height:1.6; }
    .tabs { display:flex; gap:.25rem; margin-bottom:1rem; background:#f1f5f9; border-radius:12px; padding:.25rem; width:fit-content; }
    .tab { padding:.55rem 1.1rem; border-radius:9px; border:none; background:transparent; color:#64748b; font-size:.875rem; font-weight:500; font-family:inherit; cursor:pointer; display:flex; align-items:center; gap:.5rem; }
    .tab.active { background:#fff; color:#0f172a; font-weight:600; box-shadow:0 1px 3px rgba(0,0,0,0.08); }
    .tab-count { background:rgba(59,130,246,0.12); color:#3b82f6; font-size:.7rem; font-weight:700; padding:.15rem .45rem; border-radius:100px; }
    .toolbar { display:flex; align-items:center; gap:.75rem; margin-bottom:1rem; flex-wrap:wrap; }
    .filter-select { padding:.55rem .875rem; background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:10px; font-size:.8125rem; font-family:inherit; cursor:pointer; min-width:160px; }
    .info-banner { display:flex; align-items:center; gap:.625rem; padding:.75rem 1rem; background:#f8fafc; border:1.5px solid #f1f5f9; border-radius:10px; font-size:.8125rem; color:#64748b; margin-bottom:1rem; }
    .info-banner.dynamic { background:rgba(16,185,129,0.04); border-color:rgba(16,185,129,0.15); color:#047857; }
    .table-card { overflow:hidden; margin-bottom:1.5rem; }
    .list-name-cell { display:flex; align-items:center; gap:.875rem; }
    .list-color { width:4px; height:36px; border-radius:2px; flex-shrink:0; }
    .ln-name { font-size:.875rem; font-weight:600; color:#0f172a; margin:0 0 .1rem; }
    .ln-link { text-decoration:none; color:#0f172a; }
    .ln-link:hover { color:#3b82f6; text-decoration:underline; }
    .folder-section-row td { background:#f8fafc; border-bottom:1px solid #e2e8f0; padding:.5rem 1rem !important; }
    .folder-section-head { display:flex; align-items:center; gap:.5rem; font-size:.8125rem; font-weight:600; color:#475569; }
    .folder-section-head svg { color:#94a3b8; flex-shrink:0; }
    .folder-section-name { color:#0f172a; }
    .folder-section-count { margin-left:auto; font-size:.75rem; font-weight:500; color:#94a3b8; }
    .data-row:hover { background:#fafbfc; }
    .action-link { text-decoration:none; display:inline-flex; align-items:center; }
    .ln-desc { font-size:.72rem; color:#94a3b8; margin:0; }
    .folder-tag { font-size:.75rem; color:#64748b; background:#f1f5f9; padding:.2rem .5rem; border-radius:6px; }
    .num-cell { font-size:.875rem; font-weight:700; color:#0f172a; }
    .type-badge { padding:.2rem .55rem; background:rgba(99,102,241,0.08); border-radius:6px; font-size:.7rem; font-weight:600; color:#6366f1; }
    .condition-cell { display:flex; flex-direction:column; gap:.25rem; }
    .dynamic-badge { display:inline-block; width:fit-content; padding:.15rem .45rem; background:rgba(16,185,129,0.1); color:#059669; border-radius:5px; font-size:.65rem; font-weight:700; text-transform:uppercase; }
    .rule-text { font-size:.78rem; color:#64748b; }
    .muted { color:#94a3b8; font-size:.8125rem; }
    .row-actions { display:flex; gap:.25rem; }
    .empty-row { text-align:center; color:#94a3b8; padding:2rem !important; }
    .templates-section { margin-bottom:1.25rem; }
    .section-title { font-size:.9375rem; font-weight:700; color:#0f172a; margin:0 0 .25rem; }
    .section-sub { font-size:.8125rem; color:#94a3b8; margin:0 0 .875rem; }
    .templates-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:.75rem; }
    .template-card { padding:.875rem 1rem; text-align:left; cursor:pointer; border:1.5px solid #f1f5f9; transition:all .15s; }
    .template-card:hover { border-color:#93c5fd; background:#eff6ff; }
    .tpl-cat { display:block; font-size:.65rem; font-weight:700; color:#6366f1; text-transform:uppercase; letter-spacing:.04em; margin-bottom:.25rem; }
    .tpl-name { display:block; font-size:.8125rem; font-weight:600; color:#0f172a; margin-bottom:.2rem; }
    .tpl-desc { display:block; font-size:.72rem; color:#94a3b8; line-height:1.4; }
    .modal-backdrop { position:fixed; inset:0; background:rgba(15,23,42,0.4); backdrop-filter:blur(8px); display:flex; align-items:center; justify-content:center; z-index:1000; }
    .modal-card { background:#fff; border-radius:20px; width:100%; max-width:480px; display:flex; flex-direction:column; overflow:hidden; box-shadow:0 20px 25px -5px rgba(0,0,0,0.1); }
    .modal-wide { max-width:520px; }
    .modal-header { padding:1.25rem 1.5rem; border-bottom:1px solid #f1f5f9; display:flex; align-items:center; justify-content:space-between; }
    .modal-title { font-size:1rem; font-weight:700; margin:0; }
    .close-btn { background:transparent; border:none; font-size:1.25rem; color:#94a3b8; cursor:pointer; line-height:1; }
    .modal-body { padding:1.5rem; display:flex; flex-direction:column; gap:1rem; }
    .modal-footer { padding:1rem 1.5rem; border-top:1px solid #f1f5f9; display:flex; justify-content:flex-end; gap:.75rem; background:#f8fafc; }
    .setup-field { display:flex; flex-direction:column; gap:6px; }
    .setup-field label { font-size:.8125rem; font-weight:600; color:#334155; }
    .text-input, .select-input { padding:.625rem .875rem; border:1.5px solid #e2e8f0; border-radius:8px; font-size:.875rem; font-family:inherit; width:100%; box-sizing:border-box; }
    .color-picker { border:1.5px solid #e2e8f0; border-radius:8px; width:60px; height:36px; padding:2px; cursor:pointer; }
    @media(max-width:1100px) { .overview-row { grid-template-columns:repeat(2,1fr); } .templates-grid { grid-template-columns:repeat(2,1fr); } .guide-grid { grid-template-columns:1fr; } }
    @media(max-width:600px) { .overview-row, .templates-grid { grid-template-columns:1fr; } }
  `]
})
export class ListsSegmentsComponent implements OnInit {
  private audienceApi = inject(AudienceApiService);

  activeTab: 'lists' | 'segments' = 'lists';
  showGuide = true;
  searchQuery = '';
  folderFilter = '';

  overview = signal<ListsSegmentsOverview | null>(null);
  listFolders = signal<AudienceFolder[]>([]);
  segmentFolders = signal<AudienceFolder[]>([]);
  lists = signal<AudienceList[]>([]);
  segments = signal<AudienceSegmentCard[]>([]);
  segmentTemplates = signal<SegmentTemplate[]>([]);

  showCreateListModal = false;
  showCreateSegmentModal = false;
  showFolderModal = false;
  folderModalKind: 'list' | 'segment' = 'list';
  newFolderName = '';

  newList = { name: '', description: '', color: '#3b82f6', optIn: 'Double', folderId: '' };
  newSegment = { name: '', description: '', color: '#10b981', ruleType: 'active', folderId: '', memberListId: '' };

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.audienceApi.getListsSegments().subscribe(bundle => {
      this.overview.set(bundle.overview);
      this.listFolders.set(bundle.listFolders);
      this.segmentFolders.set(bundle.segmentFolders);
      this.lists.set(bundle.lists);
      this.segments.set(bundle.segments);
      this.segmentTemplates.set(bundle.segmentTemplates);
    });
  }

  get currentFolders(): AudienceFolder[] {
    return this.activeTab === 'lists' ? this.listFolders() : this.segmentFolders();
  }

  get filteredLists(): AudienceList[] {
    return this.lists().filter(l => this.matchesSearch(l.name, l.description) && this.matchesFolder(l.folderId));
  }

  get filteredSegments(): AudienceSegmentCard[] {
    return this.segments().filter(s => this.matchesSearch(s.name, s.description) && this.matchesFolder(s.folderId));
  }

  get groupedLists(): AudienceFolderGroup<AudienceList>[] {
    return groupByFolder(this.filteredLists);
  }

  get groupedSegments(): AudienceFolderGroup<AudienceSegmentCard>[] {
    return groupByFolder(this.filteredSegments);
  }

  private matchesSearch(name: string, desc: string): boolean {
    const q = this.searchQuery.toLowerCase();
    return !q || name.toLowerCase().includes(q) || desc.toLowerCase().includes(q);
  }

  private matchesFolder(folderId?: string): boolean {
    if (!this.folderFilter) return true;
    return folderId === this.folderFilter;
  }

  openCreateFolderModal(kind: 'list' | 'segment') {
    this.folderModalKind = kind;
    this.newFolderName = '';
    this.showFolderModal = true;
  }

  openCreateListModal() {
    this.newList = { name: '', description: '', color: '#3b82f6', optIn: 'Double', folderId: '' };
    this.showCreateListModal = true;
  }

  openCreateSegmentModal() {
    this.newSegment = { name: '', description: '', color: '#10b981', ruleType: 'active', folderId: '', memberListId: '' };
    this.showCreateSegmentModal = true;
  }

  closeModals() {
    this.showCreateListModal = false;
    this.showCreateSegmentModal = false;
    this.showFolderModal = false;
  }

  createFolder() {
    if (!this.newFolderName.trim()) return;
    this.audienceApi.createFolder({ name: this.newFolderName.trim(), kind: this.folderModalKind })
      .subscribe(() => { this.loadData(); this.closeModals(); });
  }

  createList() {
    if (!this.newList.name) return;
    this.audienceApi.createList({
      name: this.newList.name,
      description: this.newList.description,
      color: this.newList.color,
      optInMethod: this.newList.optIn,
      folderId: this.newList.folderId || undefined,
    }).subscribe(() => { this.loadData(); this.closeModals(); });
  }

  createSegment() {
    if (!this.newSegment.name) return;
    let ruleConfigJson: string | undefined;
    if (this.newSegment.ruleType === 'member_of_list' && this.newSegment.memberListId) {
      ruleConfigJson = JSON.stringify({ listId: this.newSegment.memberListId });
    }
    this.audienceApi.createSegment({
      name: this.newSegment.name,
      description: this.newSegment.description,
      color: this.newSegment.color,
      ruleType: this.newSegment.ruleType,
      folderId: this.newSegment.folderId || undefined,
      ruleConfigJson,
    }).subscribe(() => { this.loadData(); this.closeModals(); });
  }

  createFromTemplate(t: SegmentTemplate) {
    this.newSegment = {
      name: t.name,
      description: t.description,
      color: '#10b981',
      ruleType: t.ruleType,
      folderId: '',
      memberListId: '',
    };
    this.showCreateSegmentModal = true;
  }
}
