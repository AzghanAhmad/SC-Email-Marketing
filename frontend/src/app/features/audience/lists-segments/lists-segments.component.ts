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
          <button class="btn-secondary" data-tooltip="Create a new subscriber list">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New List
          </button>
          <button class="btn-primary" data-tooltip="Create a dynamic segment based on rules">
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

  constructor(private mockData: MockDataService) {}

  ngOnInit() {
    this.segments = this.mockData.getSegments();
  }
}
