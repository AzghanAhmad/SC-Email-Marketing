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
        <button class="btn-primary" type="button" (click)="createABTest()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New A/B Test
        </button>
      </div>

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

        <div class="form-group" style="margin-top:1rem">
          <label class="form-label">Email body (optional)</label>
          <textarea class="form-input" rows="3" [(ngModel)]="abDraft.content" placeholder="HTML or plain text for test sends and the winner send"></textarea>
          <span class="field-help">When provided, each version emails your test group at launch; the winner sends to the rest when the test ends.</span>
        </div>

        <div class="form-row-2" style="margin-top:1.25rem">
          <div class="form-group">
            <label class="form-label">Test Group Size <span class="info-icon" data-tooltip="Each version sends to this % of your list. The winner sends to the remaining subscribers.">?</span></label>
            <select class="form-input" [(ngModel)]="abDraft.testSize">
              <option [ngValue]="10">10% each (80% gets winner)</option>
              <option [ngValue]="20">20% each (60% gets winner)</option>
              <option [ngValue]="25">25% each (50% gets winner)</option>
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

        <div class="form-row-2" style="margin-top:.75rem">
          <div class="form-group">
            <label class="form-label">Measurement window</label>
            <select class="form-input" [(ngModel)]="abDraft.waitHours" (ngModelChange)="syncEndsAtFromHours()">
              <option [ngValue]="2">2 hours</option>
              <option [ngValue]="4">4 hours</option>
              <option [ngValue]="8">8 hours (recommended)</option>
              <option [ngValue]="24">24 hours</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">End date &amp; time</label>
            <input type="datetime-local" class="form-input" [(ngModel)]="abDraft.endsAtLocal" (ngModelChange)="onEndsAtChanged()" />
            <span class="field-help">When the test closes and the winner is chosen.</span>
          </div>
        </div>

        <label class="ab-auto-send">
          <input type="checkbox" [(ngModel)]="abDraft.autoSendWinner" />
          <span>Winner sends automatically to the rest of the list when the test ends</span>
        </label>

        <div class="ab-form-actions">
          <button class="btn-primary" type="button" (click)="saveABTest()">Save A/B Test</button>
          <button class="btn-ghost" type="button" (click)="showABForm = false">Cancel</button>
        </div>
      </div>

      <div class="ab-tests-list" *ngIf="abTests.length > 0">
        <div class="ab-test-row" *ngFor="let test of abTests">
          <div class="ab-test-main">
            <div class="ab-test-info">
              <div class="ab-test-name">{{ test.name }}</div>
              <div class="ab-test-subjects">
                <span class="ab-pill a">A: {{ test.subjectA }}</span>
                <span class="ab-pill b">B: {{ test.subjectB }}</span>
              </div>
              <div class="ab-test-meta" *ngIf="test.endsAt">
                Ends {{ formatEndsAt(test.endsAt) }}
                <span *ngIf="test.winnerSentAt"> · Winner sent {{ formatEndsAt(test.winnerSentAt) }}</span>
              </div>
            </div>

            <div class="ab-vote-chart" *ngIf="test.status === 'complete' || test.status === 'running'">
              <div class="ab-vote-col" [class.ab-winner]="test.winner === 'A'">
                <div class="ab-vote-head">
                  <span class="ab-vote-letter a">A</span>
                  <span class="ab-vote-stat">{{ test.votesA ?? 0 }} {{ voteLabel(test.votesA ?? 0) }} · {{ votePct(test, 'A') }}%</span>
                </div>
                <div class="ab-vote-track"><div class="ab-vote-fill a" [style.width.%]="votePct(test, 'A')"></div></div>
                <span class="ab-winner-badge" *ngIf="test.winner === 'A'">Winner</span>
              </div>
              <div class="ab-vote-col" [class.ab-winner]="test.winner === 'B'">
                <div class="ab-vote-head">
                  <span class="ab-vote-letter b">B</span>
                  <span class="ab-vote-stat">{{ test.votesB ?? 0 }} {{ voteLabel(test.votesB ?? 0) }} · {{ votePct(test, 'B') }}%</span>
                </div>
                <div class="ab-vote-track"><div class="ab-vote-fill b" [style.width.%]="votePct(test, 'B')"></div></div>
                <span class="ab-winner-badge" *ngIf="test.winner === 'B'">Winner</span>
              </div>
              <div class="ab-tie-banner" *ngIf="test.status === 'complete' && isTie(test)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
                Tie — no winner
              </div>
            </div>
          </div>

          <div class="ab-test-side">
            <span class="badge" [ngClass]="'badge-' + (test.status === 'complete' ? 'sent' : test.status === 'running' ? 'active' : 'draft')">{{ test.status }}</span>
            <div class="ab-test-actions">
              <button type="button" class="btn-secondary btn-sm" *ngIf="test.status === 'draft'" (click)="onLaunchAbTest.emit(test.id)">Launch</button>
              <button type="button" class="btn-secondary btn-sm" *ngIf="test.status === 'running'" (click)="copyVoteLink(test)">Copy vote link</button>
              <button type="button" class="btn-secondary btn-sm" *ngIf="test.status === 'running'" (click)="onEndAbTest.emit(test.id)">End test</button>
              <button type="button" class="btn-ghost btn-sm ab-btn-danger" (click)="onDeleteAbTest.emit(test.id)">Delete</button>
            </div>
            <span class="ab-copy-hint" *ngIf="copiedTestId === test.id">Link copied to clipboard</span>
          </div>
        </div>
      </div>

      <div class="ab-empty" *ngIf="abTests.length === 0 && !showABForm">
        <svg viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="1.5" width="40" height="40"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"/></svg>
        <p>No A/B tests yet. Create your first test to find out which subject line style your readers prefer.</p>
      </div>
    </div>

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
    .ab-auto-send { display:flex; align-items:flex-start; gap:.5rem; margin-top:.875rem; font-size:.8125rem; color:#374151; line-height:1.5; cursor:pointer; }
    .ab-auto-send input { margin-top:.2rem; }
    .ab-tests-list { display:flex; flex-direction:column; gap:.75rem; margin-top:1rem; }
    .ab-test-row { display:flex; align-items:flex-start; justify-content:space-between; gap:1.25rem; padding:1rem 1.125rem; border:1.5px solid #e2e8f0; border-radius:12px; flex-wrap:wrap; background:#fff; }
    .ab-test-main { flex:1; min-width:260px; display:flex; flex-direction:column; gap:.875rem; }
    .ab-test-info { min-width:200px; }
    .ab-test-name { font-size:.9375rem; font-weight:600; color:#0f172a; margin-bottom:.375rem; }
    .ab-test-subjects { display:flex; gap:.5rem; flex-wrap:wrap; }
    .ab-test-meta { font-size:.75rem; color:#94a3b8; margin-top:.35rem; }
    .ab-pill { font-size:.75rem; padding:.2rem .6rem; border-radius:6px; }
    .ab-pill.a { background:rgba(59,130,246,0.08); color:#3b82f6; }
    .ab-pill.b { background:rgba(99,102,241,0.08); color:#6366f1; }
    .ab-vote-chart { display:grid; grid-template-columns:1fr 1fr; gap:.75rem; }
    .ab-vote-col { padding:.75rem; border-radius:10px; border:1.5px solid #e2e8f0; background:#f8fafc; position:relative; }
    .ab-vote-col.ab-winner { border-color:#10b981; background:rgba(16,185,129,0.06); }
    .ab-vote-head { display:flex; align-items:center; justify-content:space-between; gap:.5rem; margin-bottom:.5rem; }
    .ab-vote-letter { font-size:.8125rem; font-weight:800; width:1.5rem; height:1.5rem; border-radius:6px; display:inline-flex; align-items:center; justify-content:center; }
    .ab-vote-letter.a { background:rgba(59,130,246,0.15); color:#2563eb; }
    .ab-vote-letter.b { background:rgba(99,102,241,0.15); color:#6366f1; }
    .ab-vote-stat { font-size:.8125rem; font-weight:600; color:#334155; }
    .ab-vote-track { height:8px; border-radius:999px; background:#e2e8f0; overflow:hidden; }
    .ab-vote-fill { height:100%; border-radius:999px; transition:width .25s ease; min-width:0; }
    .ab-vote-fill.a { background:linear-gradient(90deg,#3b82f6,#60a5fa); }
    .ab-vote-fill.b { background:linear-gradient(90deg,#6366f1,#818cf8); }
    .ab-winner-badge { display:inline-block; margin-top:.5rem; font-size:.7rem; font-weight:700; padding:.15rem .45rem; background:#10b981; color:#fff; border-radius:100px; }
    .ab-tie-banner { grid-column:1 / -1; display:flex; align-items:center; gap:.4rem; padding:.5rem .75rem; border-radius:8px; background:rgba(245,158,11,0.1); color:#b45309; font-size:.8125rem; font-weight:600; }
    .ab-test-side { flex-shrink:0; display:flex; flex-direction:column; align-items:flex-end; gap:.625rem; min-width:180px; }
    .ab-test-actions { display:flex; flex-wrap:wrap; justify-content:flex-end; gap:.5rem; }
    .ab-btn-danger { color:#dc2626 !important; }
    .ab-btn-danger:hover { background:rgba(220,38,38,0.06) !important; }
    .ab-copy-hint { font-size:.75rem; color:#059669; font-weight:600; }
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
    textarea.form-input { resize:vertical; min-height:72px; }
    .field-help { font-size:.75rem; color:#94a3b8; margin-top:.3rem; display:block; line-height:1.5; }
    .info-icon { display:inline-flex; align-items:center; justify-content:center; width:16px; height:16px; border-radius:50%; background:#e2e8f0; color:#64748b; font-size:.65rem; font-weight:700; cursor:help; }
    @media(max-width:700px) { .ab-variants { grid-template-columns:1fr; } .ab-vs { display:none; } .form-row-2, .ab-vote-chart { grid-template-columns:1fr; } .ab-test-side { align-items:stretch; width:100%; } .ab-test-actions { justify-content:flex-start; } }
  `]
})
export class CampaignAbTestComponent implements OnChanges {
  @Input() abTests: AbTest[] = [];
  @Output() onToast = new EventEmitter<{message: string; type: 'success'|'warn'}>();
  @Output() onCreateAbTest = new EventEmitter<{
    subjectA: string; subjectB: string; testSize: number; winnerMetric: string; waitHours: number;
    endsAt?: string | null; content?: string; autoSendWinner?: boolean;
  }>();
  @Output() onLaunchAbTest = new EventEmitter<string>();
  @Output() onEndAbTest = new EventEmitter<string>();
  @Output() onDeleteAbTest = new EventEmitter<string>();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['abTests'] && changes['abTests'].currentValue) {
      this.abTests = [...changes['abTests'].currentValue];
    }
  }

  showABForm = false;
  copiedTestId: string | null = null;
  private copyHintTimer: ReturnType<typeof setTimeout> | null = null;

  abDraft = {
    subjectA: '',
    subjectB: '',
    content: '',
    testSize: 20,
    winnerMetric: 'opens' as 'opens' | 'clicks',
    waitHours: 8,
    endsAtLocal: '',
    autoSendWinner: true,
  };

  readonly howItWorks = [
    { num: '1', title: 'Write two subject lines', desc: 'Try a curiosity-driven version vs. a direct one, or test whether first-name personalization improves opens' },
    { num: '2', title: 'Define your test group', desc: 'Each version sends to a portion of your list (e.g. 20% each). The remaining 60% waits for the winner' },
    { num: '3', title: 'Winner sends automatically', desc: 'After your measurement window, the version with the higher open (or click) rate sends to the rest of your list — no manual action needed' },
  ];

  createABTest() {
    this.showABForm = true;
    this.abDraft = {
      subjectA: '',
      subjectB: '',
      content: '',
      testSize: 20,
      winnerMetric: 'opens',
      waitHours: 8,
      endsAtLocal: this.defaultEndsAtLocal(8),
      autoSendWinner: true,
    };
  }

  saveABTest() {
    if (!this.abDraft.subjectA || !this.abDraft.subjectB) {
      this.onToast.emit({ message: 'Enter both subject lines', type: 'warn' });
      return;
    }
    this.onCreateAbTest.emit({
      subjectA: this.abDraft.subjectA,
      subjectB: this.abDraft.subjectB,
      testSize: this.abDraft.testSize,
      winnerMetric: this.abDraft.winnerMetric,
      waitHours: this.abDraft.waitHours,
      endsAt: this.endsAtLocalToIso(this.abDraft.endsAtLocal),
      content: this.abDraft.content.trim() || undefined,
      autoSendWinner: this.abDraft.autoSendWinner,
    });
    this.showABForm = false;
  }

  copyVoteLink(test: AbTest) {
    const path = test.publicUrl || `/ab-test/${test.id}`;
    const url = `${window.location.origin}${path.startsWith('/') ? path : `/${path}`}`;
    navigator.clipboard.writeText(url).then(
      () => {
        this.copiedTestId = test.id;
        if (this.copyHintTimer) clearTimeout(this.copyHintTimer);
        this.copyHintTimer = setTimeout(() => { this.copiedTestId = null; }, 2500);
        this.onToast.emit({ message: 'Vote link copied to clipboard', type: 'success' });
      },
      () => this.onToast.emit({ message: url, type: 'success' }),
    );
  }

  voteLabel(count: number): string {
    return count === 1 ? 'vote' : 'votes';
  }

  votePct(test: AbTest, variant: 'A' | 'B'): number {
    const a = test.votesA ?? 0;
    const b = test.votesB ?? 0;
    const total = a + b;
    if (total === 0) return 0;
    return Math.round(((variant === 'A' ? a : b) / total) * 100);
  }

  isTie(test: AbTest): boolean {
    return test.winner === 'tie' || (test.status === 'complete' && (test.votesA ?? 0) === (test.votesB ?? 0) && (test.votesA ?? 0) > 0);
  }

  formatEndsAt(value: string): string {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? value : d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
  }

  syncEndsAtFromHours() {
    this.abDraft.endsAtLocal = this.defaultEndsAtLocal(this.abDraft.waitHours);
  }

  onEndsAtChanged() {
    // User picked a custom end time — keep it.
  }

  private defaultEndsAtLocal(hours: number): string {
    const d = new Date(Date.now() + hours * 60 * 60 * 1000);
    return this.toDatetimeLocalValue(d);
  }

  private endsAtLocalToIso(local: string): string | null {
    if (!local) return null;
    const d = new Date(local);
    return Number.isNaN(d.getTime()) ? null : d.toISOString();
  }

  private toDatetimeLocalValue(d: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }
}
