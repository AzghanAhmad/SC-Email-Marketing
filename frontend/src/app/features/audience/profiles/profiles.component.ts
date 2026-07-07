import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AudienceApiService, AudienceList, SubscriberProfile } from '../../../core/services/audience-api.service';
import { campaignUrlForList, campaignUrlForSegment } from '../audience-campaign-links';

@Component({
  selector: 'app-profiles',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-wrapper">
      <div class="page-header">
        <div>
          <h1 class="page-title">Profiles</h1>
          <p class="page-subtitle">View and manage individual subscriber profiles</p>
        </div>
        <div class="header-actions">
          <a class="btn-secondary" routerLink="/audience/import">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Import
          </a>
          <button class="btn-primary" data-tooltip="Add a new subscriber profile" (click)="openAddProfileModal()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Profile
          </button>
        </div>
      </div>

      <div class="audience-banner glass-card" *ngIf="audienceContext">
        <div class="banner-main">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="18" height="18"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          <div>
            <span class="banner-label">Filtered by {{ audienceContext.type === 'list' ? 'list' : 'segment' }}</span>
            <strong class="banner-name">{{ audienceContext.name }}</strong>
          </div>
        </div>
        <div class="banner-actions">
          <a class="btn-ghost btn-sm" routerLink="/audience/lists-segments">Lists & Segments</a>
          <a class="btn-primary btn-sm" [routerLink]="audienceContext.campaignUrl">Send email</a>
          <button type="button" class="btn-ghost btn-sm" (click)="clearAudienceFilter()">Clear filter</button>
        </div>
      </div>

      <div class="glass-card table-card">
        <div class="table-toolbar">
          <div class="search-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input class="search-input" type="text" placeholder="Search profiles..." [(ngModel)]="searchQuery" (ngModelChange)="filter()" />
          </div>
          <div class="filter-row">
            <select class="filter-select" [(ngModel)]="statusFilter" (ngModelChange)="filter()">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="unsubscribed">Unsubscribed</option>
              <option value="bounced">Bounced</option>
            </select>
            <span class="result-count">{{ filtered().length }} profiles</span>
          </div>
        </div>
        <table class="data-table">
          <thead>
            <tr><th>Profile</th><th>Email</th><th>Status</th><th>Tags</th><th>Engagement</th><th>Joined</th><th></th></tr>
          </thead>
          <tbody>
            <tr *ngIf="filtered().length === 0">
              <td colspan="7" class="empty-row">No subscriber profiles yet.</td>
            </tr>
            <tr *ngFor="let p of filtered()" class="clickable-row" (click)="viewProfile(p.id)">
              <td>
                <div class="profile-cell">
                  <div class="profile-avatar" [style.background]="getAvatarColor(p.name)">{{ p.name[0] }}</div>
                  <span class="profile-name">{{ p.name }}</span>
                </div>
              </td>
              <td class="email-cell">{{ p.email }}</td>
              <td><span class="badge" [ngClass]="'badge-' + p.status">{{ p.status }}</span></td>
              <td>
                <div class="tags-cell">
                  <span class="tag" *ngFor="let t of p.tags">{{ t }}</span>
                </div>
              </td>
              <td>
                <div class="eng-cell">
                  <div class="eng-bar"><div class="eng-fill" [style.width]="p.openRate + '%'" [style.background]="p.openRate > 60 ? '#34d399' : p.openRate > 30 ? '#fbbf24' : '#f87171'"></div></div>
                  <span class="eng-val">{{ p.openRate }}%</span>
                </div>
              </td>
              <td class="muted">{{ p.joinedAt }}</td>
              <td>
                <div class="row-actions">
                  <button type="button" class="btn-ghost btn-sm" (click)="viewProfile(p.id); $event.stopPropagation()">View</button>
                  <button type="button" class="btn-ghost btn-sm btn-delete" (click)="confirmDelete(p, $event)">Delete</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Add Profile Modal -->
      <div class="modal-backdrop" *ngIf="showAddProfileModal" (click)="closeAddProfileModal()">
        <div class="modal-card" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3 class="modal-title">Add Subscriber Profile</h3>
            <button class="close-btn" (click)="closeAddProfileModal()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <div class="setup-field">
              <label>Name</label>
              <input type="text" [(ngModel)]="newProfile.name" placeholder="John Doe" class="text-input">
            </div>
            <div class="setup-field">
              <label>Email Address</label>
              <input type="email" [(ngModel)]="newProfile.email" placeholder="john.doe@example.com" class="text-input">
            </div>
            <div class="setup-field">
              <label>Add to list (optional)</label>
              <select [(ngModel)]="newProfile.listId" class="select-input">
                <option value="">No list</option>
                <option *ngFor="let l of availableLists()" [value]="l.id">{{ l.name }}</option>
              </select>
            </div>
            <div class="setup-field">
              <label>Status</label>
              <select [(ngModel)]="newProfile.status" class="select-input">
                <option value="active">Active</option>
                <option value="unsubscribed">Unsubscribed</option>
                <option value="bounced">Bounced</option>
              </select>
            </div>
            <div class="setup-field">
              <label>Tags (comma separated)</label>
              <input type="text" [(ngModel)]="newProfile.tagsString" placeholder="fantasy, launch-list, vip" class="text-input">
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-secondary" (click)="closeAddProfileModal()">Cancel</button>
            <button class="btn-primary" (click)="addProfile()" [disabled]="!newProfile.name || !newProfile.email">Add Profile</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .table-card { overflow:hidden; }
    .table-toolbar { display:flex; align-items:center; justify-content:space-between; padding:1.25rem 1.5rem; border-bottom:1px solid #f1f5f9; flex-wrap:wrap; gap:.75rem; }
    .filter-row { display:flex; align-items:center; gap:.75rem; }
    .filter-select { padding:.55rem .875rem; background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:10px; color:#334155; font-size:.8125rem; font-family:inherit; outline:none; cursor:pointer; }
    .result-count { font-size:.8rem; color:#94a3b8; }

    .profile-cell { display:flex; align-items:center; gap:.75rem; }
    .profile-avatar { width:32px; height:32px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:.75rem; font-weight:700; color:white; flex-shrink:0; }
    .profile-name { font-size:.875rem; font-weight:600; color:#0f172a; margin:0; }
    .email-cell { color:#64748b; font-size:.8125rem; }
    .muted { color:#94a3b8; font-size:.8rem; }
    .tags-cell { display:flex; gap:.3rem; flex-wrap:wrap; }
    .tag { padding:.2rem .55rem; background:rgba(99,102,241,0.08); border:1px solid rgba(99,102,241,0.15); border-radius:6px; font-size:.7rem; font-weight:600; color:#6366f1; }
    .eng-cell { display:flex; align-items:center; gap:.5rem; }
    .eng-bar { width:50px; height:5px; background:#f1f5f9; border-radius:100px; overflow:hidden; }
    .eng-fill { height:100%; border-radius:100px; }
    .eng-val { font-size:.8rem; font-weight:600; color:#334155; }

    .badge-active { background:rgba(16,185,129,0.1); color:#059669; }
    .badge-unsubscribed { background:#f1f5f9; color:#64748b; }
    .badge-bounced { background:rgba(239,68,68,0.1); color:#dc2626; }

    /* Modal styles */
    .modal-backdrop {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(15, 23, 42, 0.4);
      backdrop-filter: blur(8px);
      display: flex; align-items: center; justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.25s ease-out;
    }
    .modal-card {
      background: #ffffff;
      border: 1px solid rgba(226, 232, 240, 0.8);
      border-radius: 20px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      width: 100%; max-width: 480px;
      display: flex; flex-direction: column;
      animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      overflow: hidden;
    }
    .modal-header {
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid #f1f5f9;
      display: flex; align-items: center; justify-content: space-between;
      position: relative;
    }
    .modal-title { font-size: 1rem; font-weight: 700; color: #0f172a; margin: 0; }
    .close-btn {
      background: transparent; border: none; color: #94a3b8; cursor: pointer;
      padding: 4px; border-radius: 6px; display: flex; align-items: center; justify-content: center;
      transition: all 0.15s;
    }
    .close-btn:hover { background: #f1f5f9; color: #475569; }
    
    .modal-body { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem; }
    .modal-footer {
      padding: 1rem 1.5rem; border-top: 1px solid #f1f5f9;
      display: flex; justify-content: flex-end; gap: 0.75rem; background: #f8fafc;
    }
    
    /* Input styles */
    .setup-field { display: flex; flex-direction: column; gap: 6px; }
    .setup-field label { font-size: 0.8125rem; font-weight: 600; color: #334155; }
    .text-input, .select-input {
      padding: 0.625rem 0.875rem; border: 1.5px solid #e2e8f0; border-radius: 8px;
      font-size: 0.875rem; font-family: inherit; color: #0f172a; outline: none;
      transition: all 0.15s; width: 100%; box-sizing: border-box;
    }
    .text-input:focus, .select-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes scaleUp { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    .empty-row { text-align:center; color:#94a3b8; padding:1.5rem !important; }
    .clickable-row { cursor:pointer; }
    .clickable-row:hover { background:#f8fafc; }
    .row-actions { display:flex; gap:.35rem; justify-content:flex-end; }
    .btn-delete { color:#dc2626 !important; }
    .btn-delete:hover { background:rgba(239,68,68,0.08) !important; }

    .audience-banner {
      display:flex; align-items:center; justify-content:space-between; gap:1rem;
      padding:1rem 1.25rem; margin-bottom:1rem; flex-wrap:wrap;
      border:1.5px solid rgba(59,130,246,0.2); background:linear-gradient(135deg,rgba(59,130,246,0.06),rgba(99,102,241,0.04));
    }
    .banner-main { display:flex; align-items:center; gap:.75rem; color:#334155; }
    .banner-label { display:block; font-size:.72rem; text-transform:uppercase; letter-spacing:.04em; color:#64748b; font-weight:600; }
    .banner-name { font-size:.9375rem; color:#0f172a; }
    .banner-actions { display:flex; align-items:center; gap:.5rem; flex-wrap:wrap; }
  `]
})
export class ProfilesComponent implements OnInit {
  private audienceApi = inject(AudienceApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  filtered = signal<SubscriberProfile[]>([]);
  availableLists = signal<AudienceList[]>([]);
  searchQuery = '';
  statusFilter = '';
  filterListId = '';
  filterSegmentId = '';
  audienceContext: { name: string; type: 'list' | 'segment'; campaignUrl: string } | null = null;

  showAddProfileModal = false;
  newProfile = {
    name: '',
    email: '',
    status: 'active' as 'active' | 'unsubscribed' | 'bounced',
    tagsString: '',
    listId: '',
  };

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.filterListId = (params['listId'] as string) || '';
      this.filterSegmentId = (params['segmentId'] as string) || '';
      const audienceName = (params['audienceName'] as string) || '';
      if (this.filterListId) {
        this.audienceContext = {
          name: audienceName || 'List',
          type: 'list',
          campaignUrl: campaignUrlForList(this.filterListId, audienceName),
        };
      } else if (this.filterSegmentId) {
        this.audienceContext = {
          name: audienceName || 'Segment',
          type: 'segment',
          campaignUrl: campaignUrlForSegment(this.filterSegmentId, audienceName),
        };
      } else {
        this.audienceContext = null;
      }
      this.loadProfiles();
    });
    this.audienceApi.getListsSegments().subscribe(b => this.availableLists.set(b.lists));
  }

  loadProfiles() {
    this.audienceApi.getProfiles(
      this.searchQuery || undefined,
      this.statusFilter || undefined,
      this.filterListId || undefined,
      this.filterSegmentId || undefined,
    ).subscribe(rows => {
      this.filtered.set([...rows]);
    });
  }

  filter() {
    this.audienceApi.getProfiles(
      this.searchQuery || undefined,
      this.statusFilter || undefined,
      this.filterListId || undefined,
      this.filterSegmentId || undefined,
    ).subscribe(rows => {
      this.filtered.set(rows);
    });
  }

  clearAudienceFilter() {
    void this.router.navigate(['/audience/profiles']);
  }

  getAvatarColor(name: string): string {
    if (!name) return 'linear-gradient(135deg,#3b82f6,#8b5cf6)';
    const colors = ['linear-gradient(135deg,#3b82f6,#8b5cf6)', 'linear-gradient(135deg,#059669,#10b981)', 'linear-gradient(135deg,#d97706,#f59e0b)', 'linear-gradient(135deg,#dc2626,#ef4444)'];
    return colors[name.charCodeAt(0) % colors.length];
  }

  openAddProfileModal() {
    this.newProfile = {
      name: '',
      email: '',
      status: 'active',
      tagsString: '',
      listId: '',
    };
    this.showAddProfileModal = true;
  }

  viewProfile(id: string) {
    if (!id) return;
    void this.router.navigate(['/audience/profiles', id]);
  }

  confirmDelete(profile: SubscriberProfile, event: MouseEvent) {
    event.stopPropagation();
    const label = profile.name || profile.email;
    if (!confirm(`Delete profile "${label}"? This cannot be undone.`)) return;
    this.audienceApi.deleteProfile(profile.id).subscribe(() => this.filter());
  }

  closeAddProfileModal() {
    this.showAddProfileModal = false;
  }

  addProfile() {
    if (!this.newProfile.name || !this.newProfile.email) return;

    const parsedTags = this.newProfile.tagsString
      ? this.newProfile.tagsString.split(',').map(t => t.trim()).filter(t => t.length > 0)
      : [];

    this.audienceApi.createProfile({
      name: this.newProfile.name,
      email: this.newProfile.email,
      status: this.newProfile.status,
      tags: parsedTags,
      listIds: this.newProfile.listId ? [this.newProfile.listId] : undefined,
    }).subscribe(created => {
      this.filter();
      this.closeAddProfileModal();
    });
  }
}
