import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-flow-connected-business',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="connected-panel">
      <div class="connected-header">
        <div class="connected-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
          </svg>
        </div>
        <div>
          <p class="connected-title">Connected to Your Whole Business</p>
          <p class="connected-sub">Flows have access to data external tools can never reach</p>
        </div>
      </div>

      <div class="connected-items">
        <div class="connected-item" *ngFor="let item of connections">
          <div class="connected-item-icon" [ngClass]="item.color">
            <svg [attr.viewBox]="item.icon.viewBox" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13">
              <ng-container *ngIf="item.icon.id === 'store'">
                <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
              </ng-container>
              <ng-container *ngIf="item.icon.id === 'catalog'">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </ng-container>
              <ng-container *ngIf="item.icon.id === 'reporting'">
                <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
                <line x1="6" y1="20" x2="6" y2="14"/>
              </ng-container>
            </svg>
          </div>
          <div>
            <p class="connected-item-title">{{ item.title }}</p>
            <p class="connected-item-desc">{{ item.desc }}</p>
          </div>
        </div>
      </div>

      <div class="connected-note">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <span>The flows are connected to the rest of your business rather than running in isolation — which means the data they generate is useful rather than decorative.</span>
      </div>
    </div>
  `,
  styles: [`
    .connected-panel {
      background: #fff; border: 1.5px solid #e2e8f0; border-radius: 16px;
      padding: 1.375rem; display: flex; flex-direction: column; gap: .875rem;
    }
    .connected-header { display: flex; align-items: flex-start; gap: .625rem; }
    .connected-icon {
      width: 34px; height: 34px; border-radius: 10px; flex-shrink: 0;
      background: rgba(99,102,241,.1); color: #6366f1;
      display: flex; align-items: center; justify-content: center;
    }
    .connected-title { font-size: .8125rem; font-weight: 700; color: #0f172a; margin: 0 0 .1rem; }
    .connected-sub { font-size: .72rem; color: #94a3b8; margin: 0; }

    .connected-items { display: flex; flex-direction: column; gap: .5rem; }
    .connected-item {
      display: flex; align-items: flex-start; gap: .625rem;
      padding: .625rem; background: #f8fafc; border-radius: 10px;
      border: 1px solid #f1f5f9;
    }
    .connected-item-icon {
      width: 28px; height: 28px; border-radius: 8px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
    }
    .connected-item-icon.green { background: rgba(16,185,129,.1); color: #059669; }
    .connected-item-icon.amber { background: rgba(245,158,11,.1); color: #d97706; }
    .connected-item-icon.blue { background: rgba(59,130,246,.1); color: #3b82f6; }
    .connected-item-title { font-size: .78rem; font-weight: 600; color: #0f172a; margin: 0 0 .1rem; }
    .connected-item-desc { font-size: .72rem; color: #64748b; margin: 0; line-height: 1.4; }

    .connected-note {
      display: flex; align-items: flex-start; gap: .4rem;
      font-size: .72rem; color: #64748b; line-height: 1.45;
      padding: .5rem .625rem; background: #f8fafc; border-radius: 8px;
      border: 1px solid #f1f5f9;
    }
    .connected-note svg { flex-shrink: 0; margin-top: 1px; color: #94a3b8; }
  `]
})
export class FlowConnectedBusinessComponent {
  connections = [
    {
      title: 'Direct Store Purchase Events',
      desc: 'Your store triggers flows in real time — abandoned cart, order confirmation, post-purchase — without any manual handoff.',
      color: 'green',
      icon: { id: 'store', viewBox: '0 0 24 24' }
    },
    {
      title: 'AuthorVault Book Catalog',
      desc: 'Covers, links, and series order feed directly into flow content without re-entry. Your catalog is always current in every flow.',
      color: 'amber',
      icon: { id: 'catalog', viewBox: '0 0 24 24' }
    },
    {
      title: 'ScribeCount Reporting Dashboard',
      desc: 'Flow performance data sits alongside your royalties, link attribution, and campaign results — one unified view of your author business.',
      color: 'blue',
      icon: { id: 'reporting', viewBox: '0 0 24 24' }
    },
  ];
}
