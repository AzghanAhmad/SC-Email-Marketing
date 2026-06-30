import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  AudienceApiService,
  AudienceList,
  SubscriberProfileDetail,
  ProfileActivity,
} from '../../../core/services/audience-api.service';

type DetailTab = 'overview' | 'history';

@Component({
  selector: 'app-profile-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-wrapper" *ngIf="profile() as p">
      <div class="detail-top">
        <a routerLink="/audience/profiles" class="back-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="15 18 9 12 15 6"/></svg>
          Profiles
        </a>
        <div class="detail-top-row">
          <div>
            <h1 class="profile-title">{{ p.firstName }} {{ p.lastName }}</h1>
            <p class="profile-email">{{ p.email }}</p>
          </div>
          <div class="detail-actions">
            <button type="button" class="btn-secondary" (click)="saveProfile()" [disabled]="saving()">Save</button>
            <button type="button" class="btn-danger" (click)="showDeleteConfirm.set(true)">Delete</button>
          </div>
        </div>
      </div>

      <div class="glass-card email-campaigns-hero">
        <div class="hero-head">
          <div>
            <h2 class="hero-title">Email campaigns</h2>
            <p class="hero-sub">Campaign engagement for this contact</p>
          </div>
          <div class="hero-channel">
            <span class="channel-pill"
              [class.subscribed]="p.channels.emailCampaignsSubscribed && !p.channels.emailCampaignsBlocklisted"
              [class.blocklisted]="p.channels.emailCampaignsBlocklisted"
              [class.unsubscribed]="!p.channels.emailCampaignsSubscribed && !p.channels.emailCampaignsBlocklisted">
              {{ p.channels.emailCampaignsBlocklisted ? 'Blocklisted' : (p.channels.emailCampaignsSubscribed ? 'Subscribed' : 'Unsubscribed') }}
            </span>
            <span class="channel-pill transactional" *ngIf="p.channels.transactionalSubscribed">Transactional · Subscribed</span>
          </div>
        </div>
        <div class="stats-grid hero-stats">
          <div class="stat-box">
            <div class="stat-label">Sent</div>
            <div class="stat-num">{{ p.campaignStats.sent }}</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Delivered</div>
            <div class="stat-num">{{ p.campaignStats.deliveredPercent }}% <span class="stat-sub">({{ p.campaignStats.delivered }})</span></div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Unique opening</div>
            <div class="stat-num">{{ p.campaignStats.uniqueOpenPercent }}% <span class="stat-sub">({{ p.campaignStats.uniqueOpens }})</span></div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Unique clicks</div>
            <div class="stat-num">{{ p.campaignStats.uniqueClickPercent }}% <span class="stat-sub">({{ p.campaignStats.uniqueClicks }})</span></div>
          </div>
          <div class="stat-box">
            <div class="stat-label">OPEN RATE</div>
            <div class="stat-num">{{ p.openRate }}%</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">CLICK RATE</div>
            <div class="stat-num">{{ p.clickRate }}%</div>
          </div>
        </div>
        <p class="hero-footnote" *ngIf="p.campaignStats.sent === 0">No campaign emails sent to this contact yet. Stats update when you send a campaign they receive.</p>
      </div>

      <div class="detail-tabs">
        <button class="detail-tab" [class.active]="tab() === 'overview'" (click)="tab.set('overview')">Overview</button>
        <button class="detail-tab" [class.active]="tab() === 'history'" (click)="tab.set('history')">History</button>
      </div>

      <div class="detail-layout" *ngIf="tab() === 'overview'">
        <div class="detail-main">
          <div class="overview-cards">
            <div class="overview-card">
              <div class="oc-head">
                <span class="oc-label">Lists</span>
                <button type="button" class="btn-ghost btn-sm" (click)="showListModal.set(true)">Manage</button>
              </div>
              <div class="oc-value">{{ p.lists.length }} of {{ p.totalLists }}</div>
              <div class="list-chips">
                <span class="list-chip" *ngFor="let l of p.lists" [style.borderColor]="l.color" [style.color]="l.color">{{ l.name }}</span>
                <span class="oc-muted" *ngIf="p.lists.length === 0">Not in any list yet</span>
              </div>
            </div>

            <div class="overview-card">
              <div class="oc-head"><span class="oc-label">Note</span></div>
              <textarea class="note-input" [(ngModel)]="editNote" (blur)="saveNote()" placeholder="Add a note about this contact…" rows="3"></textarea>
            </div>

            <div class="overview-card">
              <div class="oc-head"><span class="oc-label">Email</span></div>
              <div class="oc-email">{{ p.email }}</div>
              <span class="badge" [ngClass]="'badge-' + p.status">{{ p.status }}</span>
            </div>
          </div>

          <div class="glass-card info-card">
            <h3 class="section-title">Information</h3>
            <div class="edit-form">
              <div class="form-row">
                <div class="form-field">
                  <label>First name</label>
                  <input type="text" class="text-input" [(ngModel)]="editFirstName" placeholder="First name" />
                </div>
                <div class="form-field">
                  <label>Last name</label>
                  <input type="text" class="text-input" [(ngModel)]="editLastName" placeholder="Last name" />
                </div>
              </div>
              <div class="form-field">
                <label>Email</label>
                <input type="email" class="text-input" [(ngModel)]="editEmail" placeholder="email@example.com" />
              </div>
              <div class="form-row">
                <div class="form-field">
                  <label>Status</label>
                  <select class="text-input" [(ngModel)]="editStatus">
                    <option value="active">Active</option>
                    <option value="unsubscribed">Unsubscribed</option>
                    <option value="bounced">Bounced</option>
                  </select>
                </div>
                <div class="form-field">
                  <label>Joined</label>
                  <input type="text" class="text-input" [value]="p.joinedAt" disabled />
                </div>
              </div>
              <div class="form-field">
                <label>Tags (comma separated)</label>
                <input type="text" class="text-input" [(ngModel)]="editTagsString" placeholder="vip, newsletter" />
              </div>
            </div>
            <div class="form-actions">
              <button type="button" class="btn-danger" (click)="showDeleteConfirm.set(true)">Delete profile</button>
              <button type="button" class="btn-primary" (click)="saveProfile()" [disabled]="saving()">{{ saving() ? 'Saving…' : 'Save changes' }}</button>
            </div>
          </div>

          <div class="glass-card segments-card" *ngIf="p.segments.length">
            <h3 class="section-title">Matching segments</h3>
            <p class="section-sub">This contact is included in these dynamic segments based on rules</p>
            <div class="segment-list">
              <div class="segment-item" *ngFor="let s of p.segments">
                <span class="segment-name">{{ s.name }}</span>
                <span class="segment-rule">{{ s.ruleLabel }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="detail-side">
          <div class="glass-card history-card">
            <h3 class="section-title">Recent history</h3>
            <div class="timeline">
              <div class="timeline-item" *ngFor="let a of p.activities.slice(0, 5)">
                <ng-container *ngTemplateOutlet="activityBlock; context: { $implicit: a }"></ng-container>
              </div>
              <p class="oc-muted" *ngIf="!p.activities.length">No activity yet</p>
            </div>
            <button type="button" class="btn-ghost btn-sm" *ngIf="p.activities.length > 5" (click)="tab.set('history')">View all history</button>
          </div>
        </div>
      </div>

      <div class="history-panel glass-card" *ngIf="tab() === 'history'">
        <div class="history-toolbar">
          <h3 class="section-title">History</h3>
          <input class="search-input" type="text" placeholder="Search by activity name" [(ngModel)]="historySearch" />
        </div>
        <div class="timeline history-timeline">
          <div class="timeline-item" *ngFor="let a of filteredActivities()">
            <ng-container *ngTemplateOutlet="activityBlock; context: { $implicit: a }"></ng-container>
          </div>
          <p class="oc-muted" *ngIf="filteredActivities().length === 0">No matching activities</p>
        </div>
      </div>
    </div>

    <div class="loading-state" *ngIf="loading()">Loading profile…</div>
    <div class="loading-state" *ngIf="!loading() && !profile()">Profile not found.</div>

    <ng-template #activityBlock let-a>
      <div class="tl-dot" [class.tl-unsub]="a.activityType === 'unsubscribed'" [class.tl-click]="a.activityType === 'campaign_clicked'"></div>
      <div class="tl-body">
        <div class="tl-top">
          <span class="tl-title">{{ a.title }}</span>
          <span class="tl-time">{{ a.relativeTime }}</span>
        </div>
        <p class="tl-desc">{{ a.description }}</p>
        <div class="tl-campaign" *ngIf="a.campaignSubject">
          <div class="tl-campaign-row"><span class="tl-key">Subject</span><span>{{ a.campaignSubject }}</span></div>
          <div class="tl-campaign-row" *ngIf="a.campaignFrom"><span class="tl-key">From</span><span>{{ a.campaignFrom }}</span></div>
          <span class="tl-status" *ngIf="a.status">{{ a.status }}</span>
        </div>
        <span class="tl-date">{{ a.occurredAt }}</span>
      </div>
    </ng-template>

    <div class="modal-backdrop" *ngIf="showDeleteConfirm()" (click)="showDeleteConfirm.set(false)">
      <div class="modal-card delete-modal" (click)="$event.stopPropagation()">
        <h3 class="modal-title">Delete profile?</h3>
        <p class="modal-sub">This will permanently remove this contact and their campaign history. This action cannot be undone.</p>
        <div class="modal-footer">
          <button type="button" class="btn-secondary" (click)="showDeleteConfirm.set(false)">Cancel</button>
          <button type="button" class="btn-danger" (click)="deleteProfile()" [disabled]="deleting()">{{ deleting() ? 'Deleting…' : 'Delete' }}</button>
        </div>
      </div>
    </div>

    <div class="modal-backdrop" *ngIf="showListModal()" (click)="showListModal.set(false)">
      <div class="modal-card" (click)="$event.stopPropagation()">
        <h3 class="modal-title">Add to lists</h3>
        <p class="modal-sub">Select which lists this contact belongs to. Segments update automatically from list membership rules.</p>
        <div class="list-picker">
          <label class="list-pick-item" *ngFor="let l of allLists()">
            <input type="checkbox" [checked]="selectedListIds().includes(l.id)" (change)="toggleList(l.id)" />
            <span class="list-dot" [style.background]="l.color"></span>
            <span>{{ l.name }}</span>
            <span class="list-count">{{ l.count }} contacts</span>
          </label>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn-secondary" (click)="showListModal.set(false)">Cancel</button>
          <button type="button" class="btn-primary" (click)="saveLists()">Save</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .detail-top { margin-bottom:1rem; }
    .detail-top-row { display:flex; align-items:flex-start; justify-content:space-between; gap:1rem; flex-wrap:wrap; }
    .detail-actions { display:flex; gap:.5rem; flex-shrink:0; }
    .btn-danger {
      padding:.55rem 1rem; border-radius:10px; border:1.5px solid rgba(239,68,68,0.35);
      background:rgba(239,68,68,0.08); color:#dc2626; font-size:.8125rem; font-weight:600;
      font-family:inherit; cursor:pointer; transition:all .15s;
    }
    .btn-danger:hover:not(:disabled) { background:rgba(239,68,68,0.15); border-color:rgba(239,68,68,0.5); }
    .btn-danger:disabled { opacity:.6; cursor:not-allowed; }
    .delete-modal { max-width:400px; }
    .back-link { display:inline-flex; align-items:center; gap:.35rem; font-size:.8125rem; color:#64748b; text-decoration:none; margin-bottom:.5rem; }
    .back-link:hover { color:#3b82f6; }
    .profile-title { font-size:1.75rem; font-weight:700; color:#0f172a; margin:0; }
    .profile-email { font-size:.875rem; color:#64748b; margin:.35rem 0 0; }
    .email-campaigns-hero { padding:1.5rem 1.75rem; margin-bottom:1.25rem; border:1.5px solid #e2e8f0; background:linear-gradient(180deg,#fff 0%,#f8fafc 100%); }
    .hero-head { display:flex; align-items:flex-start; justify-content:space-between; gap:1rem; margin-bottom:1.25rem; flex-wrap:wrap; }
    .hero-title { font-size:1.125rem; font-weight:700; color:#0f172a; margin:0 0 .25rem; }
    .hero-sub { font-size:.8125rem; color:#64748b; margin:0; }
    .hero-channel { display:flex; flex-wrap:wrap; gap:.5rem; align-items:center; }
    .channel-pill { font-size:.75rem; font-weight:700; padding:.35rem .75rem; border-radius:100px; background:#f1f5f9; color:#64748b; }
    .channel-pill.subscribed { background:rgba(16,185,129,0.1); color:#059669; }
    .channel-pill.blocklisted { background:rgba(239,68,68,0.1); color:#dc2626; }
    .channel-pill.unsubscribed { background:#f1f5f9; color:#64748b; }
    .channel-pill.transactional { background:rgba(59,130,246,0.1); color:#2563eb; }
    .hero-stats { margin-bottom:0; }
    .hero-footnote { font-size:.8125rem; color:#94a3b8; margin:1rem 0 0; }
    .detail-tabs { display:flex; gap:.25rem; margin-bottom:1.25rem; border-bottom:1px solid #e2e8f0; }
    .detail-tab { padding:.625rem 1rem; border:none; background:transparent; font-size:.875rem; font-weight:500; color:#64748b; cursor:pointer; font-family:inherit; border-bottom:2px solid transparent; margin-bottom:-1px; }
    .detail-tab.active { color:#3b82f6; font-weight:600; border-bottom-color:#3b82f6; }
    .detail-layout { display:grid; grid-template-columns:1fr 340px; gap:1.25rem; align-items:start; }
    .overview-cards { display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1.25rem; }
    .overview-card { background:#fff; border:1.5px solid #e2e8f0; border-radius:12px; padding:1rem 1.125rem; }
    .oc-head { display:flex; align-items:center; justify-content:space-between; margin-bottom:.5rem; }
    .oc-label { font-size:.7rem; font-weight:700; color:#94a3b8; text-transform:uppercase; letter-spacing:.04em; }
    .oc-value { font-size:1.125rem; font-weight:700; color:#0f172a; margin-bottom:.5rem; }
    .oc-email { font-size:.875rem; color:#334155; margin-bottom:.5rem; word-break:break-all; }
    .oc-muted { font-size:.8125rem; color:#94a3b8; }
    .list-chips { display:flex; flex-wrap:wrap; gap:.35rem; }
    .list-chip { font-size:.75rem; font-weight:600; padding:.2rem .55rem; border-radius:6px; border:1.5px solid; background:#fff; }
    .note-input { width:100%; border:1px solid #e2e8f0; border-radius:8px; padding:.5rem .625rem; font-size:.8125rem; font-family:inherit; resize:vertical; box-sizing:border-box; }
    .note-input:focus { outline:none; border-color:#93c5fd; }
    .channel-row { display:flex; justify-content:space-between; align-items:center; padding:.35rem 0; font-size:.8125rem; }
    .channel-name { color:#334155; }
    .channel-status { font-size:.75rem; font-weight:600; }
    .channel-status.subscribed { color:#059669; }
    .channel-status.blocklisted { color:#dc2626; }
    .section-title { font-size:.9375rem; font-weight:700; color:#0f172a; margin:0 0 1rem; }
    .section-sub { font-size:.8125rem; color:#94a3b8; margin:-.75rem 0 1rem; }
    .info-card, .segments-card, .history-card, .history-panel { padding:1.25rem 1.5rem; margin-bottom:1.25rem; }
    .edit-form { display:flex; flex-direction:column; gap:1rem; margin-bottom:1.25rem; }
    .form-row { display:grid; grid-template-columns:1fr 1fr; gap:1rem; }
    .form-field { display:flex; flex-direction:column; gap:.35rem; }
    .form-field label { font-size:.75rem; font-weight:600; color:#64748b; text-transform:uppercase; letter-spacing:.03em; }
    .text-input {
      padding:.55rem .75rem; border:1.5px solid #e2e8f0; border-radius:8px;
      font-size:.875rem; font-family:inherit; color:#0f172a; outline:none; width:100%; box-sizing:border-box;
    }
    .text-input:focus { border-color:#3b82f6; box-shadow:0 0 0 3px rgba(59,130,246,0.1); }
    .text-input:disabled { background:#f8fafc; color:#94a3b8; }
    .form-actions { display:flex; justify-content:space-between; align-items:center; gap:.75rem; padding-top:.25rem; border-top:1px solid #f1f5f9; }
    .tag { display:inline-block; padding:.15rem .45rem; margin-right:.25rem; background:rgba(99,102,241,0.08); color:#6366f1; border-radius:5px; font-size:.7rem; font-weight:600; }
    .stats-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1rem; }
    .stat-box { text-align:center; padding:.75rem; background:#f8fafc; border-radius:10px; }
    .stat-label { font-size:.7rem; color:#94a3b8; margin-bottom:.25rem; }
    .stat-num { font-size:1.125rem; font-weight:700; color:#0f172a; }
    .stat-sub { font-size:.75rem; font-weight:500; color:#64748b; }
    .segment-list { display:flex; flex-direction:column; gap:.5rem; }
    .segment-item { display:flex; justify-content:space-between; align-items:center; padding:.625rem .75rem; background:#f8fafc; border-radius:8px; font-size:.8125rem; }
    .segment-name { font-weight:600; color:#0f172a; }
    .segment-rule { color:#94a3b8; font-size:.75rem; }
    .timeline { display:flex; flex-direction:column; gap:1rem; }
    .timeline-item { display:flex; gap:.75rem; }
    .tl-dot { width:10px; height:10px; border-radius:50%; background:#3b82f6; margin-top:.35rem; flex-shrink:0; }
    .tl-dot.tl-unsub { background:#dc2626; }
    .tl-dot.tl-click { background:#059669; }
    .tl-body { flex:1; min-width:0; }
    .tl-top { display:flex; justify-content:space-between; gap:.5rem; margin-bottom:.2rem; }
    .tl-title { font-size:.8125rem; font-weight:700; color:#0f172a; }
    .tl-time { font-size:.7rem; color:#94a3b8; flex-shrink:0; }
    .tl-desc { font-size:.75rem; color:#64748b; margin:0 0 .35rem; }
    .tl-campaign { background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:.625rem .75rem; margin-bottom:.35rem; font-size:.75rem; }
    .tl-campaign-row { display:flex; gap:.5rem; margin-bottom:.2rem; }
    .tl-key { color:#94a3b8; min-width:48px; font-weight:600; }
    .tl-status { font-size:.7rem; font-weight:600; color:#dc2626; text-transform:capitalize; }
    .tl-date { font-size:.7rem; color:#cbd5e1; }
    .history-toolbar { display:flex; align-items:center; justify-content:space-between; gap:1rem; margin-bottom:1rem; flex-wrap:wrap; }
    .history-toolbar .section-title { margin:0; }
    .search-input { padding:.5rem .75rem; border:1.5px solid #e2e8f0; border-radius:8px; font-size:.8125rem; min-width:220px; font-family:inherit; }
    .history-timeline { max-width:720px; }
    .loading-state { text-align:center; padding:3rem; color:#94a3b8; }
    .badge { display:inline-block; padding:.2rem .55rem; border-radius:6px; font-size:.7rem; font-weight:700; text-transform:capitalize; }
    .badge-active { background:rgba(16,185,129,0.1); color:#059669; }
    .badge-unsubscribed { background:#f1f5f9; color:#64748b; }
    .badge-bounced { background:rgba(239,68,68,0.1); color:#dc2626; }
    .modal-backdrop { position:fixed; inset:0; background:rgba(15,23,42,0.45); backdrop-filter:blur(4px); z-index:200; display:flex; align-items:center; justify-content:center; padding:1.5rem; }
    .modal-card { background:#fff; border-radius:16px; padding:1.5rem; max-width:440px; width:100%; max-height:80vh; overflow-y:auto; box-shadow:0 24px 64px rgba(0,0,0,0.12); }
    .modal-title { font-size:1rem; font-weight:700; margin:0 0 .35rem; }
    .modal-sub { font-size:.8125rem; color:#64748b; margin:0 0 1rem; line-height:1.5; }
    .list-picker { display:flex; flex-direction:column; gap:.35rem; margin-bottom:1rem; max-height:280px; overflow-y:auto; }
    .list-pick-item { display:flex; align-items:center; gap:.625rem; padding:.5rem .25rem; font-size:.875rem; cursor:pointer; }
    .list-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
    .list-count { margin-left:auto; font-size:.75rem; color:#94a3b8; }
    .modal-footer { display:flex; justify-content:flex-end; gap:.75rem; }
    @media(max-width:1000px) { .detail-layout { grid-template-columns:1fr; } .stats-grid { grid-template-columns:repeat(2,1fr); } .overview-cards { grid-template-columns:1fr; } .form-row { grid-template-columns:1fr; } }
  `]
})
export class ProfileDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private audienceApi = inject(AudienceApiService);
  private paramSub?: Subscription;

  profile = signal<SubscriberProfileDetail | null>(null);
  loading = signal(true);
  saving = signal(false);
  deleting = signal(false);
  tab = signal<DetailTab>('overview');
  showListModal = signal(false);
  showDeleteConfirm = signal(false);
  allLists = signal<AudienceList[]>([]);
  selectedListIds = signal<string[]>([]);
  editNote = '';
  editFirstName = '';
  editLastName = '';
  editEmail = '';
  editStatus = 'active';
  editTagsString = '';
  historySearch = '';

  ngOnInit() {
    this.paramSub = this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (!id) {
        this.loading.set(false);
        this.profile.set(null);
        return;
      }
      this.loadProfile(id);
    });
    this.audienceApi.getListsSegments().subscribe(b => this.allLists.set(b.lists));
  }

  ngOnDestroy() {
    this.paramSub?.unsubscribe();
  }

  loadProfile(id: string) {
    this.loading.set(true);
    this.audienceApi.getProfile(id).subscribe({
      next: p => {
        this.profile.set(p);
        this.populateForm(p);
        this.loading.set(false);
      },
      error: () => { this.loading.set(false); this.profile.set(null); },
    });
  }

  populateForm(p: SubscriberProfileDetail) {
    this.editNote = p.note;
    this.editFirstName = p.firstName;
    this.editLastName = p.lastName;
    this.editEmail = p.email;
    this.editStatus = p.status;
    this.editTagsString = p.tags.join(', ');
    this.selectedListIds.set(p.lists.map(l => l.id));
  }

  filteredActivities(): ProfileActivity[] {
    const p = this.profile();
    if (!p) return [];
    const q = this.historySearch.toLowerCase();
    if (!q) return p.activities;
    return p.activities.filter(a =>
      a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q)
      || (a.campaignSubject?.toLowerCase().includes(q)));
  }

  saveNote() {
    const p = this.profile();
    if (!p || this.editNote === p.note) return;
    this.audienceApi.updateProfile(p.id, { note: this.editNote }).subscribe(updated => {
      this.profile.set(updated);
      this.populateForm(updated);
    });
  }

  saveProfile() {
    const p = this.profile();
    if (!p || this.saving()) return;

    const name = [this.editFirstName, this.editLastName].filter(Boolean).join(' ').trim();
    if (!name || !this.editEmail.trim()) return;

    const tags = this.editTagsString
      ? this.editTagsString.split(',').map(t => t.trim()).filter(Boolean)
      : [];

    this.saving.set(true);
    this.audienceApi.updateProfile(p.id, {
      name,
      email: this.editEmail.trim(),
      status: this.editStatus,
      tags,
      note: this.editNote,
      listIds: this.selectedListIds(),
    }).subscribe({
      next: updated => {
        this.profile.set(updated);
        this.populateForm(updated);
        this.saving.set(false);
      },
      error: () => this.saving.set(false),
    });
  }

  deleteProfile() {
    const p = this.profile();
    if (!p || this.deleting()) return;

    this.deleting.set(true);
    this.audienceApi.deleteProfile(p.id).subscribe({
      next: () => void this.router.navigate(['/audience/profiles']),
      error: () => {
        this.deleting.set(false);
        this.showDeleteConfirm.set(false);
      },
    });
  }

  toggleList(id: string) {
    const current = this.selectedListIds();
    this.selectedListIds.set(
      current.includes(id) ? current.filter(x => x !== id) : [...current, id]
    );
  }

  saveLists() {
    const p = this.profile();
    if (!p) return;
    this.audienceApi.updateProfile(p.id, { listIds: this.selectedListIds() }).subscribe(updated => {
      this.profile.set(updated);
      this.populateForm(updated);
      this.showListModal.set(false);
    });
  }
}
