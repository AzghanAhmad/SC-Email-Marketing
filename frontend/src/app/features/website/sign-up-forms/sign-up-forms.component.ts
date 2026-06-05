import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-sign-up-forms',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-wrapper">
      <div class="page-header">
        <div>
          <h1 class="page-title">Sign-up Forms</h1>
          <p class="page-subtitle">Collect subscribers with customizable web experiences</p>
        </div>
        <button class="btn-primary" data-tooltip="Create a new sign-up form" (click)="openCreateFormModal()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Create Form
        </button>
      </div>

      <!-- Stats -->
      <div class="mini-stats">
        <div class="glass-card mini-stat" *ngFor="let s of stats">
          <span class="ms-val">{{ s.value }}</span>
          <span class="ms-label">{{ s.label }}</span>
          <span class="ms-change up" *ngIf="s.change > 0">+{{ s.change }}%</span>
        </div>
      </div>

      <!-- Forms List -->
      <div class="glass-card table-card">
        <div class="table-toolbar">
          <div class="search-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input class="search-input" type="text" placeholder="Search forms..." [(ngModel)]="searchQuery" />
          </div>
          <div class="filter-row">
            <select class="filter-select" [(ngModel)]="statusFilter">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="paused">Paused</option>
            </select>
          </div>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Form Name</th>
              <th>Type</th>
              <th>Status</th>
              <th>Submissions</th>
              <th>Conversion Rate</th>
              <th>Last Modified</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let form of filteredForms">
              <td>
                <div class="form-name-cell">
                  <div class="form-type-icon" [style.background]="form.iconBg">
                    <span [innerHTML]="form.safeIcon"></span>
                  </div>
                  <div>
                    <p class="fn-name">{{ form.name }}</p>
                    <p class="fn-target">{{ form.targetList }}</p>
                  </div>
                </div>
              </td>
              <td><span class="type-badge">{{ form.type }}</span></td>
              <td><span class="badge" [ngClass]="'badge-' + form.status">{{ form.status }}</span></td>
              <td class="num-cell">{{ form.submissions | number }}</td>
              <td>
                <div class="rate-cell">
                  <div class="mini-bar"><div class="mini-bar-fill" [style.width]="form.conversionRate + '%'" style="background:#34d399"></div></div>
                  <span>{{ form.conversionRate }}%</span>
                </div>
              </td>
              <td class="muted">{{ form.lastModified }}</td>
              <td>
                <button class="btn-ghost btn-sm btn-icon" data-tooltip="More options">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Create Form Modal -->
      <div class="modal-backdrop" *ngIf="showCreateFormModal" (click)="closeCreateFormModal()">
        <div class="modal-card" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3 class="modal-title">Create New Sign-up Form</h3>
            <button class="close-btn" (click)="closeCreateFormModal()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <div class="setup-field">
              <label>Form Name</label>
              <input type="text" [(ngModel)]="newForm.name" placeholder="e.g. Science Fiction VIPs Popup" class="text-input">
            </div>
            <div class="setup-field">
              <label>Form Type</label>
              <select [(ngModel)]="newForm.type" class="select-input">
                <option value="Popup">Popup Modal</option>
                <option value="Embedded">Embedded Section</option>
                <option value="Flyout">Flyout Banner</option>
                <option value="Full Page">Full Page Signup</option>
              </select>
            </div>
            <div class="setup-field">
              <label>Target List</label>
              <select [(ngModel)]="newForm.targetList" class="select-input">
                <option value="Newsletter List">Newsletter List</option>
                <option value="Fantasy Fans">Fantasy Fans</option>
                <option value="Launch List">Launch List</option>
                <option value="VIP Readers">VIP Readers</option>
                <option value="ARC Team">ARC Team</option>
              </select>
            </div>
            <div class="setup-field">
              <label>Initial Status</label>
              <select [(ngModel)]="newForm.status" class="select-input">
                <option value="draft">Draft (Not active)</option>
                <option value="active">Active (Live immediately)</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-secondary" (click)="closeCreateFormModal()">Cancel</button>
            <button class="btn-primary" (click)="createForm()" [disabled]="!newForm.name">Create Form</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .mini-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:1rem; margin-bottom:1.5rem; }
    .mini-stat { padding:1.125rem 1.25rem; display:flex; flex-direction:column; gap:.2rem; position:relative; }
    .ms-val { font-size:1.5rem; font-weight:800; color:#0f172a; letter-spacing:-.03em; }
    .ms-label { font-size:.7rem; font-weight:600; color:#94a3b8; text-transform:uppercase; letter-spacing:.06em; }
    .ms-change { position:absolute; top:.875rem; right:.875rem; font-size:.7rem; font-weight:700; padding:.15rem .4rem; border-radius:5px; }
    .ms-change.up { color:#059669; background:rgba(16,185,129,0.1); }

    .table-card { overflow:hidden; }
    .table-toolbar { display:flex; align-items:center; justify-content:space-between; padding:1.25rem 1.5rem; border-bottom:1px solid #f1f5f9; flex-wrap:wrap; gap:.75rem; }
    .filter-row { display:flex; align-items:center; gap:.75rem; }
    .filter-select { padding:.55rem .875rem; background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:10px; color:#334155; font-size:.8125rem; font-family:inherit; outline:none; cursor:pointer; }

    .form-name-cell { display:flex; align-items:center; gap:.875rem; }
    .form-type-icon { width:36px; height:36px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .form-type-icon svg { width:16px; height:16px; display: block; }
    .fn-name { font-size:.875rem; font-weight:600; color:#0f172a; margin:0 0 .1rem; }
    .fn-target { font-size:.72rem; color:#94a3b8; margin:0; }
    .type-badge { padding:.2rem .55rem; background:rgba(99,102,241,0.08); border:1px solid rgba(99,102,241,0.15); border-radius:6px; font-size:.7rem; font-weight:600; color:#6366f1; text-transform:capitalize; }
    .num-cell { font-size:.875rem; font-weight:600; color:#334155; }
    .rate-cell { display:flex; align-items:center; gap:.5rem; font-size:.8125rem; font-weight:600; color:#334155; }
    .mini-bar { width:50px; height:5px; background:#f1f5f9; border-radius:100px; overflow:hidden; }
    .mini-bar-fill { height:100%; border-radius:100px; }
    .muted { color:#94a3b8; font-size:.8125rem; }

    .badge-active { background:rgba(16,185,129,0.1); color:#059669; }
    .badge-draft { background:#f1f5f9; color:#64748b; }
    .badge-paused { background:rgba(245,158,11,0.1); color:#d97706; }

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

    @media(max-width:1000px) { .mini-stats { grid-template-columns:repeat(2,1fr); } }
    @media(max-width:600px) { .mini-stats { grid-template-columns:1fr; } }
  `]
})
export class SignUpFormsComponent {
  private sanitizer = inject(DomSanitizer);

  searchQuery = '';
  statusFilter = '';

  stats = [
    { label: 'Total Forms', value: '12', change: 0 },
    { label: 'Total Submissions', value: '3,842', change: 14.2 },
    { label: 'Avg Conversion', value: '8.7%', change: 2.1 },
    { label: 'Active Forms', value: '8', change: 0 },
  ];

  forms: any[] = [
    { name: 'Homepage Pop-up', type: 'Popup', status: 'active', submissions: 1284, conversionRate: 12.4, targetList: 'Newsletter List', lastModified: 'Apr 2, 2026', iconBg: 'rgba(59,130,246,0.1)', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/></svg>' },
    { name: 'Footer Signup', type: 'Embedded', status: 'active', submissions: 843, conversionRate: 6.2, targetList: 'Newsletter List', lastModified: 'Mar 28, 2026', iconBg: 'rgba(16,185,129,0.1)', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>' },
    { name: 'Reader Magnet Form', type: 'Flyout', status: 'active', submissions: 621, conversionRate: 18.9, targetList: 'Fantasy Fans', lastModified: 'Mar 22, 2026', iconBg: 'rgba(139,92,246,0.1)', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>' },
    { name: 'Book Launch Preview', type: 'Full Page', status: 'draft', submissions: 0, conversionRate: 0, targetList: 'Launch List', lastModified: 'Apr 5, 2026', iconBg: 'rgba(245,158,11,0.1)', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>' },
    { name: 'Exit Intent Offer', type: 'Popup', status: 'paused', submissions: 312, conversionRate: 4.8, targetList: 'VIP Readers', lastModified: 'Mar 15, 2026', iconBg: 'rgba(239,68,68,0.1)', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>' },
  ];

  showCreateFormModal = false;
  newForm = {
    name: '',
    type: 'Popup',
    targetList: 'Newsletter List',
    status: 'draft' as 'active' | 'draft' | 'paused'
  };

  constructor() {
    this.forms.forEach(f => {
      f.safeIcon = this.sanitizer.bypassSecurityTrustHtml(f.icon);
    });
  }

  get filteredForms() {
    return this.forms.filter(f => {
      const q = this.searchQuery.toLowerCase();
      const matchQ = !q || f.name.toLowerCase().includes(q);
      const matchS = !this.statusFilter || f.status === this.statusFilter;
      return matchQ && matchS;
    });
  }

  openCreateFormModal() {
    this.newForm = {
      name: '',
      type: 'Popup',
      targetList: 'Newsletter List',
      status: 'draft'
    };
    this.showCreateFormModal = true;
  }

  closeCreateFormModal() {
    this.showCreateFormModal = false;
  }

  createForm() {
    if (!this.newForm.name) return;

    const iconsMap: Record<string, { icon: string, iconBg: string }> = {
      'Popup': {
        iconBg: 'rgba(59,130,246,0.1)',
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/></svg>'
      },
      'Embedded': {
        iconBg: 'rgba(16,185,129,0.1)',
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>'
      },
      'Flyout': {
        iconBg: 'rgba(139,92,246,0.1)',
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>'
      },
      'Full Page': {
        iconBg: 'rgba(245,158,11,0.1)',
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>'
      }
    };

    const iconData = iconsMap[this.newForm.type] || iconsMap['Popup'];

    const newFormItem = {
      name: this.newForm.name,
      type: this.newForm.type,
      status: this.newForm.status,
      submissions: 0,
      conversionRate: 0,
      targetList: this.newForm.targetList,
      lastModified: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      iconBg: iconData.iconBg,
      icon: iconData.icon,
      safeIcon: this.sanitizer.bypassSecurityTrustHtml(iconData.icon)
    };

    this.forms.unshift(newFormItem);
    this.closeCreateFormModal();
  }
}
