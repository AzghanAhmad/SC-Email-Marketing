import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface IntegrationGuideStep {
  title: string;
  desc: string;
  tip?: string;
}

export interface IntegrationGuidePart {
  title: string;
  subtitle?: string;
  steps: IntegrationGuideStep[];
}

export interface IntegrationGuideChecklistItem {
  label: string;
  desc?: string;
}

export interface IntegrationTroubleshootItem {
  title: string;
  desc: string;
}

@Component({
  selector: 'app-integration-setup-guide',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="guide-block" *ngIf="checklist?.length">
      <h3 class="guide-block-title">Before You Begin</h3>
      <p class="guide-block-sub" *ngIf="checklistIntro">{{ checklistIntro }}</p>
      <ul class="checklist">
        <li *ngFor="let item of checklist">
          <svg viewBox="0 0 20 20" fill="#059669" width="16" height="16"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
          <div>
            <strong>{{ item.label }}</strong>
            <span *ngIf="item.desc"> — {{ item.desc }}</span>
          </div>
        </li>
      </ul>
      <div class="warn-note" *ngIf="checklistWarning">
        <svg viewBox="0 0 20 20" fill="#d97706" width="16" height="16"><path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/></svg>
        {{ checklistWarning }}
      </div>
    </div>

    <div class="guide-parts">
      <div class="guide-part" *ngFor="let part of parts; let pi = index">
        <button type="button" class="part-header" (click)="togglePart(pi)" [attr.aria-expanded]="isExpanded(pi)">
          <span class="part-num">{{ pi + 1 }}</span>
          <span class="part-titles">
            <span class="part-title">{{ part.title }}</span>
            <span class="part-sub" *ngIf="part.subtitle">{{ part.subtitle }}</span>
          </span>
          <svg class="part-chevron" [class.open]="isExpanded(pi)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="part-body" *ngIf="isExpanded(pi)">
          <div class="setup-step" *ngFor="let step of part.steps; let si = index">
            <div class="ss-num">{{ globalStep(pi, si) }}</div>
            <div class="ss-body">
              <div class="ss-title">{{ step.title }}</div>
              <div class="ss-desc">{{ step.desc }}</div>
              <div class="step-tip" *ngIf="step.tip">
                <svg viewBox="0 0 20 20" fill="#3b82f6" width="14" height="14"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd"/></svg>
                {{ step.tip }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="guide-block" *ngIf="troubleshooting?.length">
      <h3 class="guide-block-title">Troubleshooting</h3>
      <div class="ts-grid">
        <div class="ts-item" *ngFor="let t of troubleshooting">
          <div class="ts-title">{{ t.title }}</div>
          <div class="ts-desc">{{ t.desc }}</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .guide-block { margin-bottom: 1.25rem; }
    .guide-block-title { font-size: 1rem; font-weight: 700; color: #0f172a; margin: 0 0 .35rem; }
    .guide-block-sub { font-size: .875rem; color: #64748b; margin: 0 0 1rem; line-height: 1.5; }
    .checklist { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: .625rem; }
    .checklist li { display: flex; align-items: flex-start; gap: .625rem; font-size: .8125rem; color: #374151; line-height: 1.5; }
    .checklist strong { color: #0f172a; }
    .warn-note {
      display: flex; align-items: flex-start; gap: .625rem; margin-top: 1rem;
      padding: .875rem 1rem; background: rgba(245,158,11,0.06); border: 1px solid rgba(245,158,11,0.2);
      border-radius: 10px; font-size: .8125rem; color: #374151; line-height: 1.5;
    }
    .guide-parts { display: flex; flex-direction: column; gap: .625rem; margin-bottom: 1.25rem; }
    .guide-part { border: 1.5px solid #e2e8f0; border-radius: 12px; overflow: hidden; background: #fff; }
    .part-header {
      width: 100%; display: flex; align-items: center; gap: .875rem; padding: 1rem 1.125rem;
      background: #f8fafc; border: none; cursor: pointer; font-family: inherit; text-align: left;
      transition: background .15s;
    }
    .part-header:hover { background: #f1f5f9; }
    .part-num {
      width: 28px; height: 28px; border-radius: 8px; background: #3b82f6; color: #fff;
      display: flex; align-items: center; justify-content: center; font-size: .75rem; font-weight: 700; flex-shrink: 0;
    }
    .part-titles { flex: 1; min-width: 0; }
    .part-title { display: block; font-size: .875rem; font-weight: 700; color: #0f172a; }
    .part-sub { display: block; font-size: .75rem; color: #94a3b8; margin-top: .15rem; }
    .part-chevron { flex-shrink: 0; color: #94a3b8; transition: transform .2s; }
    .part-chevron.open { transform: rotate(180deg); }
    .part-body { padding: .5rem 1.125rem 1.125rem; border-top: 1px solid #f1f5f9; }
    .setup-step { display: flex; align-items: flex-start; gap: .875rem; padding: .875rem 0; border-bottom: 1px solid #f8fafc; }
    .setup-step:last-child { border-bottom: none; }
    .ss-num {
      width: 26px; height: 26px; border-radius: 50%; background: #e2e8f0; color: #475569;
      display: flex; align-items: center; justify-content: center; font-size: .7rem; font-weight: 700; flex-shrink: 0;
    }
    .ss-body { flex: 1; }
    .ss-title { font-size: .875rem; font-weight: 600; color: #0f172a; margin-bottom: .25rem; }
    .ss-desc { font-size: .8125rem; color: #64748b; line-height: 1.55; }
    .step-tip {
      display: flex; align-items: flex-start; gap: .5rem; margin-top: .5rem; padding: .625rem .75rem;
      background: rgba(59,130,246,0.06); border-radius: 8px; font-size: .78rem; color: #334155; line-height: 1.45;
    }
    .ts-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: .75rem; }
    .ts-item { padding: .875rem 1rem; background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 10px; }
    .ts-title { font-size: .8125rem; font-weight: 700; color: #0f172a; margin-bottom: .35rem; }
    .ts-desc { font-size: .78rem; color: #64748b; line-height: 1.45; }
    @media (max-width: 700px) { .ts-grid { grid-template-columns: 1fr; } }
  `]
})
export class IntegrationSetupGuideComponent implements OnInit {
  @Input() parts: IntegrationGuidePart[] = [];
  @Input() checklist: IntegrationGuideChecklistItem[] = [];
  @Input() checklistIntro = '';
  @Input() checklistWarning = '';
  @Input() troubleshooting: IntegrationTroubleshootItem[] = [];

  expanded: boolean[] = [];

  ngOnInit() {
    this.expanded = this.parts.map((_, i) => i === 0);
  }

  isExpanded(index: number): boolean {
    if (this.expanded.length !== this.parts.length) {
      this.expanded = this.parts.map((_, i) => i === 0);
    }
    return this.expanded[index] ?? false;
  }

  togglePart(index: number) {
    if (this.expanded.length !== this.parts.length) {
      this.expanded = this.parts.map((_, i) => i === 0);
    }
    this.expanded[index] = !this.expanded[index];
  }

  globalStep(partIndex: number, stepIndex: number): number {
    let n = 0;
    for (let p = 0; p < partIndex; p++) n += this.parts[p]?.steps.length ?? 0;
    return n + stepIndex + 1;
  }
}
