import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService, Subscriber } from '../../../core/services/mock-data.service';

@Component({
  selector: 'app-profiles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-wrapper">
      <div class="page-header">
        <div>
          <h1 class="page-title">Profiles</h1>
          <p class="page-subtitle">View and manage individual subscriber profiles</p>
        </div>
        <button class="btn-primary" data-tooltip="Add a new subscriber profile">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Profile
        </button>
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
            <span class="result-count">{{ filtered.length }} profiles</span>
          </div>
        </div>
        <table class="data-table">
          <thead>
            <tr><th>Profile</th><th>Email</th><th>Status</th><th>Tags</th><th>Engagement</th><th>Joined</th><th></th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let p of filtered">
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
                <button class="btn-ghost btn-sm" data-tooltip="View full profile details">View</button>
              </td>
            </tr>
          </tbody>
        </table>
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
    .profile-name { font-size:.875rem; font-weight:600; color:#0f172a; }
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
  `]
})
export class ProfilesComponent implements OnInit {
  subscribers: Subscriber[] = [];
  filtered: Subscriber[] = [];
  searchQuery = '';
  statusFilter = '';

  constructor(private mockData: MockDataService) {}

  ngOnInit() {
    this.subscribers = this.mockData.getSubscribers();
    this.filtered = [...this.subscribers];
  }

  filter() {
    this.filtered = this.subscribers.filter(s => {
      const q = this.searchQuery.toLowerCase();
      const matchQ = !q || s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
      const matchS = !this.statusFilter || s.status === this.statusFilter;
      return matchQ && matchS;
    });
  }

  getAvatarColor(name: string): string {
    const colors = ['linear-gradient(135deg,#3b82f6,#8b5cf6)', 'linear-gradient(135deg,#059669,#10b981)', 'linear-gradient(135deg,#d97706,#f59e0b)', 'linear-gradient(135deg,#dc2626,#ef4444)'];
    return colors[name.charCodeAt(0) % colors.length];
  }
}
