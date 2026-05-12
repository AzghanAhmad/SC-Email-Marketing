import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalkthroughOverviewComponent } from './walkthrough/walkthrough-overview.component';
import { WalkthroughTriggersComponent } from './walkthrough/walkthrough-triggers.component';
import { WalkthroughFlowLogicComponent } from './walkthrough/walkthrough-flow-logic.component';
import { WalkthroughTagsSegmentsComponent } from './walkthrough/walkthrough-tags-segments.component';
import { WalkthroughJourneyComponent } from './walkthrough/walkthrough-journey.component';

type WTSection = 'overview' | 'triggers' | 'logic' | 'tags' | 'journey';

@Component({
  selector: 'app-flow-walkthrough-modal',
  standalone: true,
  imports: [
    CommonModule,
    WalkthroughOverviewComponent,
    WalkthroughTriggersComponent,
    WalkthroughFlowLogicComponent,
    WalkthroughTagsSegmentsComponent,
    WalkthroughJourneyComponent,
  ],
  template: `
    <!-- Backdrop -->
    <div class="wt-backdrop" (click)="onClose.emit()"></div>

    <!-- Modal -->
    <div class="wt-modal" role="dialog" aria-modal="true" aria-label="Email Flows Overview">

      <!-- Modal header -->
      <div class="wt-modal-header">
        <div class="wt-modal-title-row">
          <div class="wt-modal-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
          </div>
          <div>
            <h2 class="wt-modal-title">How Email Flows Work</h2>
            <p class="wt-modal-sub">Overview &amp; Orientation — read once, understand everything</p>
          </div>
        </div>
        <button class="wt-close-btn" (click)="onClose.emit()" aria-label="Close walkthrough">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <!-- Section nav -->
      <div class="wt-nav">
        <button *ngFor="let s of sections"
                class="wt-nav-btn"
                [class.active]="activeSection === s.id"
                (click)="activeSection = s.id">
          <svg [attr.viewBox]="s.icon.viewBox" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13">
            <ng-container *ngIf="s.icon.id === 'overview'">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </ng-container>
            <ng-container *ngIf="s.icon.id === 'triggers'">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </ng-container>
            <ng-container *ngIf="s.icon.id === 'logic'">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </ng-container>
            <ng-container *ngIf="s.icon.id === 'tags'">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
              <line x1="7" y1="7" x2="7.01" y2="7"/>
            </ng-container>
            <ng-container *ngIf="s.icon.id === 'journey'">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
            </ng-container>
          </svg>
          {{ s.label }}
        </button>
      </div>

      <!-- Modal body — scrollable -->
      <div class="wt-modal-body">
        <app-walkthrough-overview *ngIf="activeSection === 'overview'"></app-walkthrough-overview>
        <app-walkthrough-triggers *ngIf="activeSection === 'triggers'"></app-walkthrough-triggers>
        <app-walkthrough-flow-logic *ngIf="activeSection === 'logic'"></app-walkthrough-flow-logic>
        <app-walkthrough-tags-segments *ngIf="activeSection === 'tags'"></app-walkthrough-tags-segments>
        <app-walkthrough-journey *ngIf="activeSection === 'journey'"></app-walkthrough-journey>
      </div>

      <!-- Modal footer nav -->
      <div class="wt-modal-footer">
        <button class="wt-footer-btn secondary"
                [disabled]="activeSection === sections[0].id"
                (click)="prevSection()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          Previous
        </button>
        <div class="wt-footer-dots">
          <div class="wt-footer-dot"
               *ngFor="let s of sections"
               [class.active]="activeSection === s.id"
               (click)="activeSection = s.id">
          </div>
        </div>
        <button class="wt-footer-btn primary"
                *ngIf="activeSection !== sections[sections.length - 1].id"
                (click)="nextSection()">
          Next
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </button>
        <button class="wt-footer-btn done"
                *ngIf="activeSection === sections[sections.length - 1].id"
                (click)="onClose.emit()">
          Got it — let's build
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </button>
      </div>

    </div>
  `,
  styles: [`
    /* Backdrop */
    .wt-backdrop {
      position: fixed; inset: 0; background: rgba(15,23,42,.45);
      backdrop-filter: blur(3px); z-index: 1000;
      animation: fadeIn .2s ease;
    }

    /* Modal */
    .wt-modal {
      position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
      z-index: 1001; width: min(720px, calc(100vw - 2rem));
      max-height: calc(100vh - 4rem);
      background: #fff; border-radius: 20px;
      box-shadow: 0 24px 64px rgba(0,0,0,.18), 0 4px 16px rgba(0,0,0,.08);
      display: flex; flex-direction: column;
      animation: slideUp .25s ease;
    }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { opacity: 0; transform: translate(-50%, calc(-50% + 16px)); } to { opacity: 1; transform: translate(-50%, -50%); } }

    /* Header */
    .wt-modal-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 1.25rem 1.5rem; border-bottom: 1.5px solid #f1f5f9; flex-shrink: 0;
    }
    .wt-modal-title-row { display: flex; align-items: center; gap: .875rem; }
    .wt-modal-icon {
      width: 42px; height: 42px; border-radius: 12px; flex-shrink: 0;
      background: #3b82f6; color: #fff;
      display: flex; align-items: center; justify-content: center;
    }
    .wt-modal-title { font-size: 1.0625rem; font-weight: 800; color: #0f172a; margin: 0 0 .15rem; }
    .wt-modal-sub { font-size: .78rem; color: #94a3b8; margin: 0; }
    .wt-close-btn {
      width: 36px; height: 36px; border-radius: 10px; border: 1.5px solid #e2e8f0;
      background: #f8fafc; color: #64748b; display: flex; align-items: center;
      justify-content: center; cursor: pointer; transition: all .15s; flex-shrink: 0;
    }
    .wt-close-btn:hover { background: #fee2e2; border-color: #fca5a5; color: #dc2626; }

    /* Section nav */
    .wt-nav {
      display: flex; gap: .25rem; padding: .75rem 1.5rem;
      border-bottom: 1.5px solid #f1f5f9; flex-shrink: 0;
      overflow-x: auto; scrollbar-width: none;
    }
    .wt-nav::-webkit-scrollbar { display: none; }
    .wt-nav-btn {
      display: flex; align-items: center; gap: .375rem;
      padding: .4rem .875rem; border-radius: 20px;
      background: #f8fafc; border: 1.5px solid #e2e8f0;
      font-size: .78rem; font-weight: 500; color: #64748b;
      font-family: inherit; cursor: pointer; transition: all .15s; white-space: nowrap;
    }
    .wt-nav-btn:hover { border-color: #bfdbfe; color: #3b82f6; background: #eff6ff; }
    .wt-nav-btn.active { background: #3b82f6; border-color: #3b82f6; color: #fff; font-weight: 600; }

    /* Body */
    .wt-modal-body {
      flex: 1; overflow-y: auto; padding: 1.5rem;
      scrollbar-width: thin; scrollbar-color: #e2e8f0 transparent;
    }
    .wt-modal-body::-webkit-scrollbar { width: 5px; }
    .wt-modal-body::-webkit-scrollbar-track { background: transparent; }
    .wt-modal-body::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }

    /* Footer */
    .wt-modal-footer {
      display: flex; align-items: center; justify-content: space-between;
      padding: 1rem 1.5rem; border-top: 1.5px solid #f1f5f9; flex-shrink: 0;
    }
    .wt-footer-dots { display: flex; gap: .375rem; }
    .wt-footer-dot {
      width: 7px; height: 7px; border-radius: 50%; background: #e2e8f0;
      cursor: pointer; transition: background .15s;
    }
    .wt-footer-dot.active { background: #3b82f6; }

    .wt-footer-btn {
      display: flex; align-items: center; gap: .4rem;
      padding: .55rem 1.125rem; border-radius: 10px;
      font-size: .8125rem; font-weight: 600; font-family: inherit;
      cursor: pointer; transition: all .15s; border: none;
    }
    .wt-footer-btn:disabled { opacity: .35; cursor: not-allowed; }
    .wt-footer-btn.secondary {
      background: #f8fafc; border: 1.5px solid #e2e8f0; color: #64748b;
    }
    .wt-footer-btn.secondary:not(:disabled):hover { border-color: #bfdbfe; color: #3b82f6; }
    .wt-footer-btn.primary { background: #3b82f6; color: #fff; }
    .wt-footer-btn.primary:hover { background: #2563eb; }
    .wt-footer-btn.done { background: #059669; color: #fff; }
    .wt-footer-btn.done:hover { background: #047857; }
  `]
})
export class FlowWalkthroughModalComponent {
  @Output() onClose = new EventEmitter<void>();

  activeSection: WTSection = 'overview';

  sections: { id: WTSection; label: string; icon: { id: string; viewBox: string } }[] = [
    { id: 'overview', label: 'Overview', icon: { id: 'overview', viewBox: '0 0 24 24' } },
    { id: 'triggers', label: 'Triggers', icon: { id: 'triggers', viewBox: '0 0 24 24' } },
    { id: 'logic', label: 'Wait & Conditions', icon: { id: 'logic', viewBox: '0 0 24 24' } },
    { id: 'tags', label: 'Tags & Segments', icon: { id: 'tags', viewBox: '0 0 24 24' } },
    { id: 'journey', label: 'Reader Journey', icon: { id: 'journey', viewBox: '0 0 24 24' } },
  ];

  nextSection() {
    const idx = this.sections.findIndex(s => s.id === this.activeSection);
    if (idx < this.sections.length - 1) {
      this.activeSection = this.sections[idx + 1].id;
    }
  }

  prevSection() {
    const idx = this.sections.findIndex(s => s.id === this.activeSection);
    if (idx > 0) {
      this.activeSection = this.sections[idx - 1].id;
    }
  }
}
