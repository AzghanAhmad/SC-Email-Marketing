import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AbTest } from '../../core/models/campaign.models';

@Component({
  selector: 'app-campaign-ab-test',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="glass-card step-card">
      <div class="ab-header-row">
        <div>
          <h2 class="step-title">A/B Subject Line Testing</h2>
          <p class="step-sub">Test two subject lines on a portion of your list — the winner sends automatically to the rest</p>
        </div>
        <button class="btn-primary" (click)="createABTest()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New A/B Test
        </button>
      </div>

      <!-- Create form -->
      <div class="ab-create-form" *ngIf="showABForm">
        <div class="ab-variants">
          <div class="ab-variant">
            <div class="ab-variant-label variant-a">Version A</div>
            <input type="text" class="form-input" [(ngModel)]="abDraft.subjectA" placeholder="e.g. The research that changed my book" />
            <span class="ab-variant-hint">Curiosity-driven or specific</span>
          </div>
          <div class="ab-vs">VS</div>
          <div class="ab-variant">
            <div class="ab-variant-label variant-b">Version B</div>
            <input type="text" class="form-input" [(ngModel)]="abDraft.subjectB" placeholder="e.g. May Newsletter — reading picks + WIP update" />
            <span class="ab-variant-hint">Direct or descriptive</span>
          </div>
        </div>
        <div class="form-row-2" style="margin-top:1.25rem">
          <div class="form-group">
            <label class="form-label">Test Group Size <span class="info-icon" data-tooltip="Each version sends to this % of your list. The winner sends to the remaining subscribers.">?</span></label>
            <select class="form-input" [(ngModel)]="abDraft.testSize">
              <option [value]="10">10% each (80% gets winner)</option>
              <option [value]="20">20% each (60% gets winner)</option>
              <option [value]="25">25% each (50% gets winner)</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Winner Metric</label>
            <select class="form-input" [(ngModel)]="abDraft.winnerMetric">
              <option value="opens">Open Rate (recommended)</option>
              <option value="clicks">Click Rate</option>
            </select>
          </div>
        </div>
        <div class="form-group" style="margin-top:.75rem">
          <label class="form-label">Measurement Window</label>
          <select class="form-input" [(ngModel)]="abDraft.waitHours" style="max-width:280px">
            <option [value]="2">2 hours</option><option [value]="4">4 hours</option>
            <option [value]="8">8 hours (recommended)</option><option [value]="24">24 hours</option>
          </select>
          <span class="field-help">After this window, the winning version sends automatically to the rest of your list.</span>
        </div>
        <div class="ab-form-actions">
          <button class="btn-primary" (click)="saveABTest()">Save A/B Test</button>
          <button class="btn-ghost" (click)="showABForm = false">Cancel</button>
        </div>
      </div>

      <!-- Existing tests -->
      <div class="ab-tests-list" *ngIf="abTests.length > 0">
        <div class="ab-test-row" *ngFor="let test of abTests">
          <div class="ab-test-info">
            <div class="ab-test-name">{{ test.name }}</div>
            <div class="ab-test-subjects">
              <span class="ab-pill a">A: {{ test.subjectA }}</span>
              <span class="ab-pill b">B: {{ test.subjectB }}</span>
            </div>
          </div>
          <div class="ab-test-results" *ngIf="test.status === 'complete'">
            <div class="ab-result" [class.ab-winner]="test.winner === 'A'">
              <span class="ab-result-label">A</span>
              <span class="ab-result-rate">{{ test.openRateA }}%</span>
              <span class="ab-winner-badge" *ngIf="test.winner === 'A'">Winner</span>
            </div>
            <div class="ab-result" [class.ab-winner]="test.winner === 'B'">
              <span class="ab-result-label">B</span>
              <span class="ab-result-rate">{{ test.openRateB }}%</span>
              <span class="ab-winner-badge" *ngIf="test.winner === 'B'">Winner</span>
            </div>
          </div>
          <div class="ab-test-status">
            <span class="badge" [ngClass]="'badge-' + (test.status === 'complete' ? 'sent' : test.status === 'running' ? 'active' : 'draft')">{{ test.status }}</span>
            <button type="button" class="ab-delete-btn" (click)="onDeleteAbTest.emit(test.id)">Delete</button>
          </div>
        </div>
      </div>

      <div class="ab-empty" *ngIf="abTests.length === 0 && !showABForm">
        <svg viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="1.5" width="40" height="40"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"/></svg>
        <p>No A/B tests yet. Create your first test to find out which subject line style your readers prefer.</p>
      </div>
    </div>

    <!-- How it works -->
    <div class="glass-card step-card ab-how-it-works">
      <h3 class="step-title" style="font-size:1rem">How A/B Testing Works</h3>
      <div class="ab-steps">
        <div class="ab-step" *ngFor="let s of howItWorks">
          <div class="ab-step-num">{{ s.num }}</div>
          <div class="ab-step-body">
            <div class="ab-step-title">{{ s.title }}</div>
            <div class="ab-step-desc">{{ s.desc }}</div>
          </div>
        </div>
      </div>
      <div class="ab-insight">
        <svg viewBox="0 0 20 20" fill="#3b82f6" width="14" height="14"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd"/></svg>
        Over time, consistent testing builds a clear picture of what your readers specifically respond to — which is more valuable than any industry benchmark.
      </div>
    </div>
  `,
  styles: [`
    .step-card { padding:2rem; margin-bottom:1.25rem; }
    .step-title { font-size:1.25rem; font-weight:700; color:#0f172a; margin:0 0 .35rem; }
    .step-sub { font-size:.875rem; color:#94a3b8; margin:0 0 1.75rem; }
    .ab-header-row { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:1.5rem; flex-wrap:wrap; gap:.75rem; }
    .ab-create-form { border:1.5px solid #e2e8f0; border-radius:12px; padding:1.25rem; margin-bottom:1.5rem; background:#f8fafc; }
    .ab-variants { display:grid; grid-template-columns:1fr auto 1fr; gap:1rem; align-items:center; }
    .ab-variant { display:flex; flex-direction:column; gap:.5rem; }
    .ab-variant-label { font-size:.75rem; font-weight:700; padding:.2rem .6rem; border-radius:6px; width:fit-content; }
    .variant-a { background:rgba(59,130,246,0.1); color:#3b82f6; }
    .variant-b { background:rgba(99,102,241,0.1); color:#6366f1; }
    .ab-variant-hint { font-size:.75rem; color:#94a3b8; }
    .ab-vs { font-size:.875rem; font-weight:800; color:#94a3b8; text-align:center; }
    .ab-form-actions { display:flex; gap:.75rem; margin-top:1.25rem; }
    .ab-tests-list { display:flex; flex-direction:column; gap:.75rem; margin-top:1rem; }
    .ab-test-row { display:flex; align-items:center; gap:1rem; padding:.875rem 1rem; border:1.5px solid #e2e8f0; border-radius:10px; flex-wrap:wrap; }
    .ab-test-info { flex:1; min-width:200px; }
    .ab-test-name { font-size:.875rem; font-weight:600; color:#0f172a; margin-bottom:.375rem; }
    .ab-test-subjects { display:flex; gap:.5rem; flex-wrap:wrap; }
    .ab-pill { font-size:.75rem; padding:.2rem .6rem; border-radius:6px; }
    .ab-pill.a { background:rgba(59,130,246,0.08); color:#3b82f6; }
    .ab-pill.b { background:rgba(99,102,241,0.08); color:#6366f1; }
    .ab-test-results { display:flex; gap:.75rem; }
    .ab-result { display:flex; align-items:center; gap:.375rem; padding:.375rem .75rem; border-radius:8px; border:1.5px solid #e2e8f0; }
    .ab-result.ab-winner { border-color:#10b981; background:rgba(16,185,129,0.06); }
    .ab-result-label { font-size:.75rem; font-weight:700; color:#64748b; }
    .ab-result-rate { font-size:.875rem; font-weight:700; color:#0f172a; }
    .ab-winner-badge { font-size:.7rem; font-weight:700; padding:.15rem .45rem; background:#10b981; color:#fff; border-radius:100px; }
    .ab-test-status { flex-shrink:0; display:flex; flex-direction:column; align-items:flex-end; gap:.5rem; }
    .ab-delete-btn { background:none; border:none; color:#dc2626; font-size:.75rem; font-weight:600; cursor:pointer; padding:0; }
    .ab-delete-btn:hover { text-decoration:underline; }
    .ab-empty { display:flex; flex-direction:column; align-items:center; gap:.75rem; padding:2rem; color:#94a3b8; font-size:.875rem; text-align:center; }
    .ab-how-it-works { margin-top:1.25rem; }
    .ab-steps { display:flex; flex-direction:column; gap:.875rem; margin:1rem 0; }
    .ab-step { display:flex; align-items:flex-start; gap:.875rem; }
    .ab-step-num { width:28px; height:28px; border-radius:50%; background:rgba(59,130,246,0.1); color:#3b82f6; font-size:.8125rem; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .ab-step-title { font-size:.875rem; font-weight:600; color:#0f172a; margin-bottom:.2rem; }
    .ab-step-desc { font-size:.8rem; color:#64748b; line-height:1.5; }
    .ab-insight { display:flex; align-items:flex-start; gap:.5rem; padding:.75rem 1rem; background:rgba(59,130,246,0.06); border-radius:8px; font-size:.8125rem; color:#374151; line-height:1.5; }
    .form-row-2 { display:grid; grid-template-columns:1fr 1fr; gap:1rem; }
    .form-group { display:flex; flex-direction:column; }
    .form-label { font-size:.8125rem; font-weight:600; color:#374151; margin-bottom:.4rem; display:flex; align-items:center; gap:.375rem; }
    .form-input { padding:.625rem .875rem; background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:10px; color:#0f172a; font-size:.875rem; font-family:inherit; outline:none; transition:border-color .15s; }
    .form-input:focus { border-color:#3b82f6; background:#fff; }
    .field-help { font-size:.75rem; color:#94a3b8; margin-top:.3rem; display:block; line-height:1.5; }
    .info-icon { display:inline-flex; align-items:center; justify-content:center; width:16px; height:16px; border-radius:50%; background:#e2e8f0; color:#64748b; font-size:.65rem; font-weight:700; cursor:help; }
    @media(max-width:700px) { .ab-variants { grid-template-columns:1fr; } .ab-vs { display:none; } .form-row-2 { grid-template-columns:1fr; } }
  `]
})
export class CampaignAbTestComponent implements OnChanges {
  @Input() abTests: AbTest[] = [];
  @Output() onToast = new EventEmitter<{message: string; type: 'success'|'warn'}>();
  @Output() onCreateAbTest = new EventEmitter<{
    subjectA: string; subjectB: string; testSize: number; winnerMetric: string; waitHours: number;
  }>();
  @Output() onDeleteAbTest = new EventEmitter<string>();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['abTests'] && changes['abTests'].currentValue) {
      this.abTests = [...changes['abTests'].currentValue];
    }
  }

  showABForm = false;
  abDraft = { subjectA: '', subjectB: '', testSize: 20, winnerMetric: 'opens' as 'opens'|'clicks', waitHours: 8 };

  readonly howItWorks = [
    { num: '1', title: 'Write two subject lines', desc: 'Try a curiosity-driven version vs. a direct one, or test whether first-name personalization improves opens' },
    { num: '2', title: 'Define your test group', desc: 'Each version sends to a portion of your list (e.g. 20% each). The remaining 60% waits for the winner' },
    { num: '3', title: 'Winner sends automatically', desc: 'After your measurement window, the version with the higher open (or click) rate sends to the rest of your list — no manual action needed' },
  ];

  createABTest() {
    this.showABForm = true;
    this.abDraft = { subjectA: '', subjectB: '', testSize: 20, winnerMetric: 'opens', waitHours: 8 };
  }

  saveABTest() {
    if (!this.abDraft.subjectA || !this.abDraft.subjectB) {
      this.onToast.emit({ message: 'Enter both subject lines', type: 'warn' }); return;
    }
    this.onCreateAbTest.emit({
      subjectA: this.abDraft.subjectA,
      subjectB: this.abDraft.subjectB,
      testSize: this.abDraft.testSize,
      winnerMetric: this.abDraft.winnerMetric,
      waitHours: this.abDraft.waitHours,
    });
    this.showABForm = false;
  }
}
