import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MockDataService, Subscriber, Segment } from '../../core/services/mock-data.service';

type AudienceTab = 'subscribers' | 'segments' | 'add';

@Component({
  selector: 'app-audience',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="page-wrapper">
      <div class="page-header">
        <div>
          <h1 class="page-title">Audience</h1>
          <p class="page-subtitle">Manage your subscribers, lists, and segments</p>
        </div>
        <button class="btn-primary" (click)="activeTab.set('add')" data-tooltip="Add a new subscriber manually">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Subscriber
        </button>
      </div>

      <!-- Tabs -->
      <div class="tabs">
        <button class="tab" [class.active]="activeTab() === 'subscribers'" (click)="activeTab.set('subscribers')">
          Subscribers <span class="tab-count">{{ subscribers.length }}</span>
        </button>
        <button class="tab" [class.active]="activeTab() === 'segments'" (click)="activeTab.set('segments')">
          Lists & Segments <span class="tab-count">{{ segments.length }}</span>
        </button>
        <button class="tab" [class.active]="activeTab() === 'add'" (click)="activeTab.set('add')">
          Add Subscriber
        </button>
      </div>

      <!-- Subscribers Tab -->
      <div *ngIf="activeTab() === 'subscribers'">
        <div class="glass-card table-card">
          <div class="table-toolbar">
            <div class="search-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input class="search-input" type="text" placeholder="Search subscribers..." [(ngModel)]="searchQuery" (ngModelChange)="filterSubscribers()" />
            </div>
            <div class="filter-row">
              <select class="filter-select" [(ngModel)]="statusFilter" (ngModelChange)="filterSubscribers()">
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="unsubscribed">Unsubscribed</option>
                <option value="bounced">Bounced</option>
              </select>
              <span class="result-count">{{ filtered.length }} results</span>
            </div>
          </div>

          <div class="table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Tags</th>
                  <th>Open Rate</th>
                  <th>Joined</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let sub of filtered">
                  <td>
                    <div class="sub-name-cell">
                      <div class="sub-avatar">{{ sub.name[0] }}</div>
                      {{ sub.name }}
                    </div>
                  </td>
                  <td class="email-cell">{{ sub.email }}</td>
                  <td>
                    <span class="badge" [ngClass]="'badge-' + sub.status">{{ sub.status }}</span>
                  </td>
                  <td>
                    <div class="tags-cell">
                      <span class="tag" *ngFor="let tag of sub.tags">{{ tag }}</span>
                    </div>
                  </td>
                  <td>
                    <div class="open-rate-cell">
                      <div class="mini-bar">
                        <div class="mini-bar-fill" [style.width]="sub.openRate + '%'" [style.background]="sub.openRate > 60 ? '#34d399' : sub.openRate > 30 ? '#fbbf24' : '#f87171'"></div>
                      </div>
                      <span>{{ sub.openRate }}%</span>
                    </div>
                  </td>
                  <td class="muted-cell">{{ sub.joinedAt }}</td>
                  <td>
                    <button class="btn-ghost btn-sm btn-icon" data-tooltip="More options">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="empty-state" *ngIf="filtered.length === 0">
              <div class="empty-state-icon">🔍</div>
              <h3>No subscribers found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Segments Tab -->
      <div *ngIf="activeTab() === 'segments'">
        <div class="segments-grid">
          <div class="glass-card segment-card" *ngFor="let seg of segments">
            <div class="seg-color-bar" [style.background]="seg.color"></div>
            <div class="seg-body">
              <div class="seg-header">
                <h3 class="seg-name">{{ seg.name }}</h3>
                <span class="seg-count" [style.color]="seg.color">{{ seg.count | number }}</span>
              </div>
              <p class="seg-desc">{{ seg.description }}</p>
              <div class="seg-actions">
                <button class="btn-ghost btn-sm" data-tooltip="Send a campaign to this segment">Send Campaign</button>
                <button class="btn-ghost btn-sm" data-tooltip="View subscribers in this segment">View List</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Add Subscriber Tab -->
      <div *ngIf="activeTab() === 'add'">
        <div class="glass-card add-form-card">
          <h2 class="form-section-title">Add New Subscriber</h2>
          <p class="form-section-sub">Manually add a subscriber to your list</p>

          <div class="success-banner" *ngIf="addSuccess">
            <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
            Subscriber added successfully!
          </div>

          <form class="add-form" (ngSubmit)="addSubscriber()">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">First Name <span class="required">*</span></label>
                <input type="text" class="form-input" [(ngModel)]="newSub.firstName" name="firstName" placeholder="Jane" />
              </div>
              <div class="form-group">
                <label class="form-label">Last Name</label>
                <input type="text" class="form-input" [(ngModel)]="newSub.lastName" name="lastName" placeholder="Austen" />
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Email Address <span class="required">*</span></label>
              <input type="email" class="form-input" [(ngModel)]="newSub.email" name="email" placeholder="jane@example.com" />
            </div>
            <div class="form-group">
              <label class="form-label">Tags <span class="info-icon" data-tooltip="Comma-separated tags to categorize this subscriber">?</span></label>
              <input type="text" class="form-input" [(ngModel)]="newSub.tags" name="tags" placeholder="newsletter, vip, fantasy" />
            </div>
            <div class="form-group">
              <label class="form-label">List / Segment</label>
              <select class="form-input" [(ngModel)]="newSub.segment" name="segment">
                <option value="">Select a segment...</option>
                <option *ngFor="let seg of segments" [value]="seg.id">{{ seg.name }}</option>
              </select>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn-primary" data-tooltip="Add this subscriber to your list">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Add Subscriber
              </button>
              <button type="button" class="btn-secondary" (click)="resetForm()">Clear</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tabs { display:flex; gap:.25rem; margin-bottom:1.5rem; background:#f1f5f9; border-radius:12px; padding:.25rem; width:fit-content; }
    .tab { padding:.55rem 1.1rem; border-radius:9px; border:none; background:transparent; color:#64748b; font-size:.875rem; font-weight:500; font-family:inherit; cursor:pointer; transition:all .2s; display:flex; align-items:center; gap:.5rem; }
    .tab:hover { color:#0f172a; }
    .tab.active { background:#ffffff; color:#0f172a; font-weight:600; box-shadow:0 1px 3px rgba(0,0,0,0.08); }
    .tab-count { background:rgba(59,130,246,0.12); color:#3b82f6; font-size:.7rem; font-weight:700; padding:.15rem .45rem; border-radius:100px; }

    .table-card { overflow:hidden; }
    .table-toolbar { display:flex; align-items:center; justify-content:space-between; padding:1.25rem 1.5rem; border-bottom:1px solid #f1f5f9; flex-wrap:wrap; gap:.75rem; }
    .filter-row { display:flex; align-items:center; gap:.75rem; }
    .filter-select { padding:.55rem .875rem; background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:10px; color:#334155; font-size:.8125rem; font-family:inherit; outline:none; cursor:pointer; }
    .filter-select option { background:white; }
    .result-count { font-size:.8rem; color:#94a3b8; }
    .table-wrap { overflow-x:auto; }

    .sub-name-cell { display:flex; align-items:center; gap:.75rem; }
    .sub-avatar { width:30px; height:30px; border-radius:8px; background:linear-gradient(135deg,#3b82f6,#8b5cf6); display:flex; align-items:center; justify-content:center; font-size:.75rem; font-weight:700; color:white; flex-shrink:0; }
    .email-cell { color:#64748b; font-size:.8125rem; }
    .muted-cell { color:#94a3b8; font-size:.8rem; }
    .tags-cell { display:flex; gap:.3rem; flex-wrap:wrap; }
    .tag { padding:.2rem .55rem; background:rgba(99,102,241,0.08); border:1px solid rgba(99,102,241,0.15); border-radius:6px; font-size:.7rem; font-weight:600; color:#6366f1; }
    .open-rate-cell { display:flex; align-items:center; gap:.5rem; }
    .mini-bar { width:50px; height:5px; background:#f1f5f9; border-radius:100px; overflow:hidden; }
    .mini-bar-fill { height:100%; border-radius:100px; transition:width .6s; }

    .badge-active { background:rgba(16,185,129,0.1); color:#059669; }
    .badge-unsubscribed { background:#f1f5f9; color:#64748b; }
    .badge-bounced { background:rgba(239,68,68,0.1); color:#dc2626; }

    .segments-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1.25rem; }
    .segment-card { overflow:hidden; display:flex; flex-direction:column; }
    .seg-color-bar { height:4px; }
    .seg-body { padding:1.375rem; flex:1; display:flex; flex-direction:column; }
    .seg-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:.5rem; }
    .seg-name { font-size:1rem; font-weight:700; color:#0f172a; margin:0; }
    .seg-count { font-size:1.375rem; font-weight:800; letter-spacing:-.02em; }
    .seg-desc { font-size:.8125rem; color:#94a3b8; margin:0 0 1rem; flex:1; }
    .seg-actions { display:flex; gap:.5rem; }

    .add-form-card { max-width:640px; padding:2rem; }
    .form-section-title { font-size:1.25rem; font-weight:700; color:#0f172a; margin:0 0 .35rem; }
    .form-section-sub { font-size:.875rem; color:#94a3b8; margin:0 0 1.75rem; }
    .add-form { display:flex; flex-direction:column; gap:1.125rem; }
    .form-row { display:grid; grid-template-columns:1fr 1fr; gap:1rem; }
    .form-group { display:flex; flex-direction:column; }
    .required { color:#ef4444; }
    .form-actions { display:flex; gap:.75rem; margin-top:.5rem; }
    .success-banner { display:flex; align-items:center; gap:.625rem; padding:.875rem 1rem; background:rgba(16,185,129,0.08); border:1px solid rgba(16,185,129,0.2); border-radius:10px; color:#059669; font-size:.875rem; font-weight:500; margin-bottom:1.5rem; }

    @media(max-width:900px) { .segments-grid { grid-template-columns:repeat(2,1fr); } }
    @media(max-width:600px) { .segments-grid { grid-template-columns:1fr; } .form-row { grid-template-columns:1fr; } }
  `]
})
export class AudienceComponent implements OnInit {
  activeTab = signal<AudienceTab>('subscribers');
  subscribers: Subscriber[] = [];
  segments: Segment[] = [];
  filtered: Subscriber[] = [];
  searchQuery = '';
  statusFilter = '';
  addSuccess = false;
  newSub = { firstName: '', lastName: '', email: '', tags: '', segment: '' };

  constructor(private mockData: MockDataService) {}

  ngOnInit() {
    this.subscribers = this.mockData.getSubscribers();
    this.segments = this.mockData.getSegments();
    this.filtered = [...this.subscribers];
  }

  filterSubscribers() {
    this.filtered = this.subscribers.filter(s => {
      const q = this.searchQuery.toLowerCase();
      const matchQ = !q || s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
      const matchS = !this.statusFilter || s.status === this.statusFilter;
      return matchQ && matchS;
    });
  }

  addSubscriber() {
    if (!this.newSub.firstName || !this.newSub.email) return;
    this.addSuccess = true;
    setTimeout(() => { this.addSuccess = false; this.resetForm(); }, 2500);
  }

  resetForm() {
    this.newSub = { firstName: '', lastName: '', email: '', tags: '', segment: '' };
  }
}
