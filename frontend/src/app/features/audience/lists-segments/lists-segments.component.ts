import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService, Segment } from '../../../core/services/mock-data.service';

@Component({
  selector: 'app-lists-segments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-wrapper">
      <div class="page-header">
        <div>
          <h1 class="page-title">Lists & Segments</h1>
          <p class="page-subtitle">Organize your audience into lists and smart segments</p>
        </div>
        <div class="header-actions">
          <button class="btn-secondary" data-tooltip="Create a new subscriber list" (click)="openCreateListModal()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New List
          </button>
          <button class="btn-primary" data-tooltip="Create a dynamic segment based on rules" (click)="openCreateSegmentModal()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Segment
          </button>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tabs">
        <button class="tab" [class.active]="activeTab === 'lists'" (click)="activeTab='lists'">
          Lists <span class="tab-count">{{ lists.length }}</span>
        </button>
        <button class="tab" [class.active]="activeTab === 'segments'" (click)="activeTab='segments'">
          Segments <span class="tab-count">{{ segments.length }}</span>
        </button>
      </div>

      <!-- Lists -->
      <div *ngIf="activeTab === 'lists'" class="glass-card table-card">
        <table class="data-table">
          <thead>
            <tr><th>List Name</th><th>Subscribers</th><th>Opt-in Method</th><th>Created</th><th></th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let list of lists">
              <td>
                <div class="list-name-cell">
                  <div class="list-color" [style.background]="list.color"></div>
                  <div>
                    <p class="ln-name">{{ list.name }}</p>
                    <p class="ln-desc">{{ list.description }}</p>
                  </div>
                </div>
              </td>
              <td class="num-cell">{{ list.count | number }}</td>
              <td><span class="type-badge">{{ list.optIn }}</span></td>
              <td class="muted">{{ list.created }}</td>
              <td>
                <div class="row-actions">
                  <button class="btn-ghost btn-sm" data-tooltip="Send a campaign to this list">Send</button>
                  <button class="btn-ghost btn-sm btn-icon" data-tooltip="More options">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Segments -->
      <div *ngIf="activeTab === 'segments'">
        <div class="segments-grid">
          <div class="glass-card segment-card" *ngFor="let seg of segments">
            <div class="seg-color-bar" [style.background]="seg.color"></div>
            <div class="seg-body">
              <div class="seg-header">
                <h3 class="seg-name">{{ seg.name }}</h3>
                <span class="seg-count" [style.color]="seg.color">{{ seg.count | number }}</span>
              </div>
              <p class="seg-desc">{{ seg.description }}</p>
              <div class="seg-rule">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                <span>Dynamic · Auto-updated</span>
              </div>
              <div class="seg-actions">
                <button class="btn-ghost btn-sm" data-tooltip="Send a campaign to this segment">Send Campaign</button>
                <button class="btn-ghost btn-sm" data-tooltip="View subscribers in this segment">View</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Create List Modal -->
      <div class="modal-backdrop" *ngIf="showCreateListModal" (click)="closeModals()">
        <div class="modal-card" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3 class="modal-title">Create New List</h3>
            <button class="close-btn" (click)="closeModals()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <div class="setup-field">
              <label>List Name</label>
              <input type="text" [(ngModel)]="newList.name" placeholder="e.g. Science Fiction VIPs" class="text-input">
            </div>
            <div class="setup-field">
              <label>Description</label>
              <input type="text" [(ngModel)]="newList.description" placeholder="VIP readers interested in Sci-Fi releases" class="text-input">
            </div>
            <div class="setup-field">
              <label>Color Tag</label>
              <input type="color" [(ngModel)]="newList.color" class="color-picker">
            </div>
            <div class="setup-field">
              <label>Opt-in Method</label>
              <select [(ngModel)]="newList.optIn" class="select-input">
                <option value="Single">Single Opt-in</option>
                <option value="Double">Double Opt-in</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-secondary" (click)="closeModals()">Cancel</button>
            <button class="btn-primary" (click)="createList()" [disabled]="!newList.name">Create List</button>
          </div>
        </div>
      </div>

      <!-- Create Segment Modal -->
      <div class="modal-backdrop" *ngIf="showCreateSegmentModal" (click)="closeModals()">
        <div class="modal-card" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3 class="modal-title">Create New Segment</h3>
            <button class="close-btn" (click)="closeModals()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <div class="setup-field">
              <label>Segment Name</label>
              <input type="text" [(ngModel)]="newSegment.name" placeholder="e.g. Active Purchasers" class="text-input">
            </div>
            <div class="setup-field">
              <label>Description</label>
              <input type="text" [(ngModel)]="newSegment.description" placeholder="Subscribers who purchased in the last 30 days" class="text-input">
            </div>
            <div class="setup-field">
              <label>Color Tag</label>
              <input type="color" [(ngModel)]="newSegment.color" class="color-picker">
            </div>
            <div class="setup-field">
              <label>Trigger Rule</label>
              <select class="select-input">
                <option>Subscribers with Open Rate > 50%</option>
                <option>Subscribers with Purchased Tag</option>
                <option>Subscribers Active in Last 30 Days</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-secondary" (click)="closeModals()">Cancel</button>
            <button class="btn-primary" (click)="createSegment()" [disabled]="!newSegment.name">Create Segment</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .header-actions { display:flex; gap:.75rem; }
    .tabs { display:flex; gap:.25rem; margin-bottom:1.5rem; background:#f1f5f9; border-radius:12px; padding:.25rem; width:fit-content; }
    .tab { padding:.55rem 1.1rem; border-radius:9px; border:none; background:transparent; color:#64748b; font-size:.875rem; font-weight:500; font-family:inherit; cursor:pointer; transition:all .2s; display:flex; align-items:center; gap:.5rem; }
    .tab:hover { color:#0f172a; }
    .tab.active { background:#ffffff; color:#0f172a; font-weight:600; box-shadow:0 1px 3px rgba(0,0,0,0.08); }
    .tab-count { background:rgba(59,130,246,0.12); color:#3b82f6; font-size:.7rem; font-weight:700; padding:.15rem .45rem; border-radius:100px; }

    .table-card { overflow:hidden; }
    .list-name-cell { display:flex; align-items:center; gap:.875rem; }
    .list-color { width:4px; height:36px; border-radius:2px; flex-shrink:0; }
    .ln-name { font-size:.875rem; font-weight:600; color:#0f172a; margin:0 0 .1rem; }
    .ln-desc { font-size:.72rem; color:#94a3b8; margin:0; }
    .num-cell { font-size:.875rem; font-weight:700; color:#0f172a; }
    .type-badge { padding:.2rem .55rem; background:rgba(99,102,241,0.08); border:1px solid rgba(99,102,241,0.15); border-radius:6px; font-size:.7rem; font-weight:600; color:#6366f1; }
    .muted { color:#94a3b8; font-size:.8125rem; }
    .row-actions { display:flex; align-items:center; gap:.25rem; }

    .segments-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1.25rem; }
    .segment-card { overflow:hidden; display:flex; flex-direction:column; }
    .seg-color-bar { height:4px; }
    .seg-body { padding:1.375rem; flex:1; display:flex; flex-direction:column; }
    .seg-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:.5rem; }
    .seg-name { font-size:1rem; font-weight:700; color:#0f172a; margin:0; }
    .seg-count { font-size:1.375rem; font-weight:800; letter-spacing:-.02em; }
    .seg-desc { font-size:.8125rem; color:#94a3b8; margin:0 0 .75rem; flex:1; }
    .seg-rule { display:flex; align-items:center; gap:.375rem; font-size:.72rem; color:#64748b; margin-bottom:1rem; }
    .seg-actions { display:flex; gap:.5rem; }

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
    .color-picker {
      border: 1.5px solid #e2e8f0; border-radius: 8px; width: 60px; height: 36px; padding: 2px; cursor: pointer;
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes scaleUp { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }

    @media(max-width:900px) { .segments-grid { grid-template-columns:repeat(2,1fr); } }
    @media(max-width:600px) { .segments-grid { grid-template-columns:1fr; } }
  `]
})
export class ListsSegmentsComponent implements OnInit {
  activeTab = 'lists';
  segments: Segment[] = [];

  lists = [
    { name: 'Newsletter', description: 'Main newsletter subscribers', count: 4821, color: '#3b82f6', optIn: 'Double', created: 'Jan 1, 2025' },
    { name: 'Fantasy Fans', description: 'Readers interested in fantasy', count: 1204, color: '#8b5cf6', optIn: 'Single', created: 'Mar 15, 2025' },
    { name: 'Launch List', description: 'Book launch notification list', count: 876, color: '#10b981', optIn: 'Double', created: 'Jun 2, 2025' },
    { name: 'VIP Readers', description: 'High-engagement subscribers', count: 342, color: '#f59e0b', optIn: 'Single', created: 'Sep 10, 2025' },
    { name: 'ARC Team', description: 'Advanced review copy team', count: 89, color: '#ef4444', optIn: 'Double', created: 'Nov 1, 2025' },
  ];

  showCreateListModal = false;
  showCreateSegmentModal = false;

  newList = {
    name: '',
    description: '',
    color: '#3b82f6',
    optIn: 'Double'
  };

  newSegment = {
    name: '',
    description: '',
    color: '#10b981'
  };

  constructor(private mockData: MockDataService) {}

  ngOnInit() {
    this.segments = this.mockData.getSegments();
  }

  openCreateListModal() {
    this.newList = {
      name: '',
      description: '',
      color: '#3b82f6',
      optIn: 'Double'
    };
    this.showCreateListModal = true;
  }

  openCreateSegmentModal() {
    this.newSegment = {
      name: '',
      description: '',
      color: '#10b981'
    };
    this.showCreateSegmentModal = true;
  }

  closeModals() {
    this.showCreateListModal = false;
    this.showCreateSegmentModal = false;
  }

  createList() {
    if (!this.newList.name) return;
    this.lists.unshift({
      name: this.newList.name,
      description: this.newList.description,
      count: 0,
      color: this.newList.color,
      optIn: this.newList.optIn,
      created: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    });
    this.closeModals();
  }

  createSegment() {
    if (!this.newSegment.name) return;
    this.segments.unshift({
      id: `${Date.now()}`,
      name: this.newSegment.name,
      description: this.newSegment.description,
      count: 0,
      color: this.newSegment.color
    });
    this.closeModals();
  }
}
