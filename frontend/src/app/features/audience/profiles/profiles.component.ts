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
        <button class="btn-primary" data-tooltip="Add a new subscriber profile" (click)="openAddProfileModal()">
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
            <div class="setup-field">
              <label>Open Rate (Engagement %)</label>
              <div style="display: flex; align-items: center; gap: 12px;">
                <input type="range" min="0" max="100" [(ngModel)]="newProfile.openRate" style="flex: 1; cursor: pointer;">
                <span style="font-size: 0.875rem; font-weight: 600; min-width: 36px; text-align: right;">{{ newProfile.openRate }}%</span>
              </div>
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
  `]
})
export class ProfilesComponent implements OnInit {
  subscribers: Subscriber[] = [];
  filtered: Subscriber[] = [];
  searchQuery = '';
  statusFilter = '';

  showAddProfileModal = false;
  newProfile = {
    name: '',
    email: '',
    status: 'active' as 'active' | 'unsubscribed' | 'bounced',
    tagsString: '',
    openRate: 50
  };

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
      openRate: 50
    };
    this.showAddProfileModal = true;
  }

  closeAddProfileModal() {
    this.showAddProfileModal = false;
  }

  addProfile() {
    if (!this.newProfile.name || !this.newProfile.email) return;

    const parsedTags = this.newProfile.tagsString
      ? this.newProfile.tagsString.split(',').map(t => t.trim()).filter(t => t.length > 0)
      : [];

    const newSub: Subscriber = {
      id: `${Date.now()}`,
      name: this.newProfile.name,
      email: this.newProfile.email,
      status: this.newProfile.status,
      tags: parsedTags,
      openRate: this.newProfile.openRate,
      joinedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    this.subscribers.unshift(newSub);
    this.filter();
    this.closeAddProfileModal();
  }
}
