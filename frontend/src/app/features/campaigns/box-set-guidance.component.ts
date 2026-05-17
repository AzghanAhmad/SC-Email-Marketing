import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-box-set-guidance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bs-guidance">

      <!-- What it does -->
      <div class="bs-callout">
        <div class="bs-callout-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
            <line x1="12" y1="22.08" x2="12" y2="12"/>
          </svg>
        </div>
        <div>
          <h4 class="bs-callout-title">What a box set announcement is designed to accomplish</h4>
          <p class="bs-callout-desc">The individual book model asks readers to make a purchase decision repeatedly — book by book, each one a small friction point between them and the next part of the story. The bundle removes that friction entirely. One decision, one purchase, and they have everything. The box set email is the campaign that tells the right reader that this option exists at exactly the right moment.</p>
        </div>
      </div>

      <!-- Strategic logic -->
      <div class="bs-strategy">
        <div class="bs-strategy-icon">
          <svg viewBox="0 0 20 20" fill="#7c3aed" width="14" height="14"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd"/></svg>
          <p>A reader who buys three books as a bundle has spent more per transaction than they might have otherwise, and they've committed to your series in a way that a single-book buyer hasn't. Once they own the full series, the next-in-catalog recommendation becomes a recommendation for a new series — a more natural and more welcome conversation.</p>
        </div>
      </div>

      <!-- Three scenarios -->
      <div class="bs-section">
        <h4 class="bs-section-title">The Three Bundle Scenarios — Choose Your Audience</h4>
        <div class="bs-scenarios">
          <div class="bs-scenario" *ngFor="let s of scenarios" [class.selected]="bundleDetails.scenario === s.id" (click)="bundleDetails.scenario = s.id">
            <div class="bs-scenario-header">
              <div class="bs-scenario-icon" [style.background]="s.bg" [style.color]="s.color" [innerHTML]="s.icon"></div>
              <div>
                <span class="bs-scenario-title">{{ s.title }}</span>
                <span class="bs-scenario-audience">Audience: {{ s.audience }}</span>
              </div>
              <div class="bs-scenario-check" *ngIf="bundleDetails.scenario === s.id">
                <svg viewBox="0 0 20 20" fill="#7c3aed" width="16" height="16"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
              </div>
            </div>
            <p class="bs-scenario-desc">{{ s.desc }}</p>
            <div class="bs-scenario-tip" *ngIf="bundleDetails.scenario === s.id">
              <svg viewBox="0 0 20 20" fill="#7c3aed" width="12" height="12"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd"/></svg>
              <span>{{ s.writingTip }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Audience targeting -->
      <div class="bs-section">
        <h4 class="bs-section-title">Audience Targeting — Suppression and Segmentation</h4>
        <div class="bs-targeting-grid">
          <div class="bs-target-card priority">
            <div class="bs-target-badge priority">Highest converting</div>
            <span class="bs-target-title">Partial-series readers</span>
            <p class="bs-target-desc">Readers who own one or two books and haven't completed the series. They've already demonstrated interest in the story — the bundle is the natural next step in their journey. Prioritize this segment and write to them specifically; the email will outperform a generic bundle announcement to your full list every time.</p>
            <div class="bs-target-tag">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
              Segment: Series Readers — built automatically from purchase history
            </div>
          </div>
          <div class="bs-target-card">
            <div class="bs-target-badge">Non-buyers</div>
            <span class="bs-target-title">Readers who own none of the titles</span>
            <p class="bs-target-desc">New subscribers or readers who haven't purchased yet. The bundle is a value-forward entry point. Lead with the deal and social proof — these readers don't have existing loyalty to draw on, so the persuasion work falls to the value proposition and reader praise.</p>
          </div>
        </div>
        <div class="bs-suppression-note">
          <div class="bs-supp-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
          </div>
          <div>
            <span class="bs-supp-title">Suppress complete owners automatically</span>
            <p class="bs-supp-desc">Announcing a complete series collection to a reader who already owns every book in the series is not useful to them and creates a mildly awkward impression that your email program doesn't know who they are. ScribeCount's purchase history integration identifies readers who own all titles in the bundle and suppresses them automatically.</p>
          </div>
        </div>
      </div>

      <!-- Email structure -->
      <div class="bs-section">
        <h4 class="bs-section-title">Writing the Bundle Email — Lead With Value, Close With Story</h4>
        <p class="bs-section-intro">The structural logic: lead with the value proposition, reinforce with story, close with a clear call to action. Make the math visible — readers evaluating a bundle purchase want to know the deal is genuine without having to calculate it themselves.</p>
        <div class="bs-struct-steps">
          <div class="bs-struct-step" *ngFor="let s of emailStructure">
            <div class="bs-struct-num">{{ s.num }}</div>
            <div>
              <span class="bs-struct-title">{{ s.title }}</span>
              <span class="bs-struct-desc">{{ s.desc }}</span>
              <div class="bs-struct-example" *ngIf="s.example">
                <span class="bs-example-label">Example:</span>
                <span class="bs-example-text">{{ s.example }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Subject lines -->
      <div class="bs-section">
        <h4 class="bs-section-title">Subject Lines</h4>
        <div class="bs-subject-list">
          <div class="bs-subject-item" *ngFor="let s of subjectExamples" (click)="selectSubject(s.line)">
            <div class="bs-subject-line">"{{ s.line }}"</div>
            <div class="bs-subject-why">{{ s.why }}</div>
            <button class="bs-use-btn" (click)="$event.stopPropagation(); selectSubject(s.line)">Use this</button>
          </div>
        </div>
      </div>

      <!-- Promotional windows -->
      <div class="bs-promo-note">
        <div class="bs-promo-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        </div>
        <div>
          <span class="bs-promo-title">Positioning During Promotional Windows</span>
          <p class="bs-promo-desc">Box sets are particularly effective promotional products during BookBub Featured Deals and retailer-curated sales events, because the higher price point of a bundle still looks like a strong deal when compared against the sum of the individual parts. Send your bundle announcement email in coordination with the promotional window — readers who receive your email and then see the bundle featured on the retailer platform are receiving a consistent, reinforcing message from two directions simultaneously.</p>
        </div>
      </div>

      <!-- Bundle details form -->
      <div class="bs-section">
        <h4 class="bs-section-title">Bundle Details</h4>
        <div class="bs-form-grid">
          <div class="form-group">
            <label class="form-label">Bundle / Box Set Title</label>
            <input type="text" class="form-input" [(ngModel)]="bundleDetails.title" placeholder="e.g. The Ember Chronicles Complete Collection" />
          </div>
          <div class="form-group">
            <label class="form-label">Number of Books Included</label>
            <input type="number" class="form-input" [(ngModel)]="bundleDetails.bookCount" placeholder="e.g. 3" min="2" />
          </div>
          <div class="form-group">
            <label class="form-label">Individual Titles Total Price</label>
            <input type="text" class="form-input" [(ngModel)]="bundleDetails.individualTotal" placeholder="e.g. $14.97" />
          </div>
          <div class="form-group">
            <label class="form-label">Bundle Price</label>
            <input type="text" class="form-input" [(ngModel)]="bundleDetails.bundlePrice" placeholder="e.g. $9.99" />
          </div>
          <div class="form-group">
            <label class="form-label">Bundle Buy Link</label>
            <input type="url" class="form-input" [(ngModel)]="bundleDetails.link" placeholder="https://..." />
          </div>
          <div class="form-group">
            <label class="form-label">Series Reading Order Link <span class="form-label-hint">(optional)</span></label>
            <input type="url" class="form-input" [(ngModel)]="bundleDetails.seriesLink" placeholder="https://..." />
          </div>
        </div>
        <div class="bs-savings-preview" *ngIf="bundleDetails.individualTotal && bundleDetails.bundlePrice">
          <svg viewBox="0 0 20 20" fill="#7c3aed" width="13" height="13"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
          <span>Value proposition to state in email: <strong>{{ bundleDetails.bookCount || 'X' }} books</strong> — individual total {{ bundleDetails.individualTotal }}, bundle price {{ bundleDetails.bundlePrice }}. Make this math visible in the opening paragraph.</span>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .bs-guidance { display:flex; flex-direction:column; gap:1rem; }
    .bs-callout { display:flex; align-items:flex-start; gap:.875rem; padding:.875rem 1rem; background:rgba(124,58,237,0.06); border-left:3px solid #7c3aed; border-radius:0 10px 10px 0; }
    .bs-callout-icon { width:32px; height:32px; border-radius:8px; background:rgba(124,58,237,0.1); color:#7c3aed; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .bs-callout-title { display:block; font-size:.875rem; font-weight:700; color:#0f172a; margin-bottom:.3rem; }
    .bs-callout-desc { font-size:.8rem; color:#374151; margin:0; line-height:1.6; }
    .bs-strategy { display:flex; align-items:flex-start; gap:.5rem; padding:.75rem 1rem; background:rgba(124,58,237,0.06); border:1px solid rgba(124,58,237,0.15); border-radius:8px; font-size:.8125rem; color:#374151; line-height:1.6; }
    .bs-strategy-icon { flex-shrink:0; margin-top:.1rem; }
    .bs-section { background:#f8fafc; border:1.5px solid #f1f5f9; border-radius:12px; padding:1.125rem; }
    .bs-section-title { display:block; font-size:.75rem; font-weight:700; text-transform:uppercase; letter-spacing:.07em; color:#94a3b8; margin:0 0 .75rem; }
    .bs-section-intro { display:block; font-size:.8125rem; color:#64748b; margin:0 0 .875rem; line-height:1.5; }
    .bs-scenarios { display:flex; flex-direction:column; gap:.625rem; }
    .bs-scenario { padding:.875rem 1rem; background:#fff; border:1.5px solid #e2e8f0; border-radius:10px; cursor:pointer; transition:border-color .15s; }
    .bs-scenario:hover { border-color:#c4b5fd; }
    .bs-scenario.selected { border-color:#7c3aed; background:rgba(124,58,237,0.03); }
    .bs-scenario-header { display:flex; align-items:flex-start; gap:.75rem; margin-bottom:.5rem; }
    .bs-scenario-icon { width:28px; height:28px; border-radius:7px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .bs-scenario-title { display:block; font-size:.875rem; font-weight:600; color:#0f172a; margin-bottom:.15rem; }
    .bs-scenario-audience { display:block; font-size:.75rem; color:#94a3b8; }
    .bs-scenario-check { margin-left:auto; flex-shrink:0; }
    .bs-scenario-desc { font-size:.8rem; color:#64748b; margin:0 0 .5rem; line-height:1.5; }
    .bs-scenario-tip { display:flex; align-items:flex-start; gap:.375rem; padding:.5rem .75rem; background:rgba(124,58,237,0.06); border-radius:6px; font-size:.75rem; color:#4c1d95; line-height:1.5; }
    .bs-targeting-grid { display:grid; grid-template-columns:1fr 1fr; gap:.75rem; margin-bottom:.875rem; }
    .bs-target-card { padding:.875rem; border-radius:10px; border:1.5px solid #e2e8f0; background:#fff; }
    .bs-target-card.priority { border-color:rgba(124,58,237,0.25); background:rgba(124,58,237,0.03); }
    .bs-target-badge { display:inline-block; font-size:.7rem; font-weight:700; padding:.15rem .5rem; border-radius:100px; margin-bottom:.5rem; }
    .bs-target-badge.priority { background:rgba(124,58,237,0.1); color:#7c3aed; }
    .bs-target-badge:not(.priority) { background:rgba(100,116,139,0.1); color:#64748b; }
    .bs-target-title { display:block; font-size:.875rem; font-weight:600; color:#0f172a; margin-bottom:.375rem; }
    .bs-target-desc { font-size:.75rem; color:#64748b; margin:0 0 .5rem; line-height:1.5; }
    .bs-target-tag { display:flex; align-items:center; gap:.375rem; font-size:.75rem; color:#94a3b8; }
    .bs-suppression-note { display:flex; align-items:flex-start; gap:.875rem; padding:.875rem 1rem; background:rgba(220,38,38,0.04); border:1.5px solid rgba(220,38,38,0.12); border-radius:10px; }
    .bs-supp-icon { width:32px; height:32px; border-radius:8px; background:rgba(220,38,38,0.1); color:#dc2626; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .bs-supp-title { display:block; font-size:.875rem; font-weight:700; color:#0f172a; margin-bottom:.3rem; }
    .bs-supp-desc { font-size:.8rem; color:#374151; margin:0; line-height:1.6; }
    .bs-struct-steps { display:flex; flex-direction:column; gap:.625rem; }
    .bs-struct-step { display:flex; align-items:flex-start; gap:.75rem; }
    .bs-struct-num { width:22px; height:22px; border-radius:50%; background:#7c3aed; color:#fff; font-size:.7rem; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:.1rem; }
    .bs-struct-title { display:block; font-size:.8125rem; font-weight:600; color:#0f172a; margin-bottom:.2rem; }
    .bs-struct-desc { display:block; font-size:.75rem; color:#64748b; line-height:1.5; }
    .bs-struct-example { display:flex; align-items:flex-start; gap:.375rem; margin-top:.5rem; padding:.5rem .75rem; background:rgba(124,58,237,0.04); border-radius:6px; }
    .bs-example-label { font-size:.7rem; font-weight:700; color:#7c3aed; white-space:nowrap; }
    .bs-example-text { font-size:.75rem; color:#374151; font-style:italic; line-height:1.4; }
    .bs-subject-list { display:flex; flex-direction:column; gap:.5rem; }
    .bs-subject-item { display:flex; align-items:center; gap:.875rem; padding:.75rem 1rem; background:#fff; border:1.5px solid #e2e8f0; border-radius:10px; cursor:pointer; transition:border-color .15s; }
    .bs-subject-item:hover { border-color:#7c3aed; }
    .bs-subject-line { font-size:.875rem; font-weight:600; color:#0f172a; font-style:italic; flex:1; }
    .bs-subject-why { font-size:.75rem; color:#94a3b8; flex:1; }
    .bs-use-btn { padding:.25rem .625rem; border:1.5px solid rgba(124,58,237,0.25); border-radius:6px; background:rgba(124,58,237,0.06); color:#7c3aed; font-size:.75rem; font-weight:600; font-family:inherit; cursor:pointer; white-space:nowrap; transition:all .15s; }
    .bs-use-btn:hover { background:rgba(124,58,237,0.12); border-color:#7c3aed; }
    .bs-promo-note { display:flex; align-items:flex-start; gap:.875rem; padding:.875rem 1rem; background:rgba(245,158,11,0.04); border:1.5px solid rgba(245,158,11,0.15); border-radius:10px; }
    .bs-promo-icon { width:32px; height:32px; border-radius:8px; background:rgba(245,158,11,0.1); color:#d97706; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .bs-promo-title { display:block; font-size:.875rem; font-weight:700; color:#0f172a; margin-bottom:.3rem; }
    .bs-promo-desc { font-size:.8rem; color:#374151; margin:0; line-height:1.6; }
    .bs-form-grid { display:grid; grid-template-columns:1fr 1fr; gap:.875rem; margin-bottom:.875rem; }
    .form-group { display:flex; flex-direction:column; }
    .form-label { font-size:.8125rem; font-weight:600; color:#374151; margin-bottom:.4rem; display:flex; align-items:center; gap:.375rem; }
    .form-label-hint { font-size:.75rem; font-weight:400; color:#94a3b8; }
    .form-input { padding:.625rem .875rem; background:#fff; border:1.5px solid #e2e8f0; border-radius:10px; color:#0f172a; font-size:.875rem; font-family:inherit; outline:none; transition:border-color .15s; }
    .form-input:focus { border-color:#7c3aed; }
    .bs-savings-preview { display:flex; align-items:flex-start; gap:.5rem; padding:.625rem .875rem; background:rgba(124,58,237,0.06); border-radius:8px; font-size:.8rem; color:#374151; line-height:1.5; }
    @media(max-width:700px) { .bs-targeting-grid,.bs-form-grid { grid-template-columns:1fr; } .bs-subject-item { flex-direction:column; align-items:flex-start; } }
  `]
})
export class BoxSetGuidanceComponent {
  @Output() onSubjectSuggestion = new EventEmitter<string>();

  bundleDetails = { scenario: 'series', title: '', bookCount: null as number|null, individualTotal: '', bundlePrice: '', link: '', seriesLink: '' };

  readonly scenarios = [
    {
      id: 'series',
      title: 'Complete Series Collection',
      audience: 'Partial-series readers — own 1–2 books, haven\'t finished',
      bg: 'rgba(124,58,237,0.1)', color: '#7c3aed',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
      desc: 'All books in a completed series packaged together at a discount. The email\'s job is to make the bundle feel like the natural way to complete a journey they\'ve already started.',
      writingTip: 'Lead with continuity: "If you\'ve been reading [Series Name] and you\'re ready to finish the story, the complete collection is now available as a single bundle." ScribeCount can segment readers who own Book One but not Book Two or Three — write the email as if it knows who\'s receiving it, because it does.'
    },
    {
      id: 'themed',
      title: 'Themed Standalone Bundle',
      audience: 'Readers of one title who haven\'t tried the others',
      bg: 'rgba(59,130,246,0.1)', color: '#3b82f6',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
      desc: 'Multiple standalone titles that share a tonal quality, setting, theme, or character type. A collection of slow-burn historical romances. A set of standalone thrillers set in the same fictional city.',
      writingTip: 'This email needs to do more explanatory work — the connection between titles isn\'t automatically obvious. Lead with what unifies the bundle: the mood, the theme, the promise they share. The bundle should feel curated, not just convenient.'
    },
    {
      id: 'entry',
      title: 'New Reader Entry Bundle',
      audience: 'New subscribers who haven\'t purchased anything yet',
      bg: 'rgba(16,185,129,0.1)', color: '#059669',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
      desc: 'A value-forward bundle priced attractively enough that a reader who\'s just discovered the author feels like buying in bulk is the smart move.',
      writingTip: 'This email needs to do the most selling work — these readers don\'t have existing loyalty to draw on. Lead with the value: how many books, what genres, what kind of reading experience they can expect. Reader praise from your best reviews carries more weight here than in either of the other scenarios.'
    },
  ];

  readonly emailStructure = [
    { num: '1', title: 'Subject line — state the bundle and the savings', desc: 'Name the collection and signal the value in as few words as possible.', example: '"The complete [Series Name] trilogy is now available as a single collection" or "Save [X]% on the full [Series Name] bundle"' },
    { num: '2', title: 'Opening — present the math clearly', desc: 'Here are the books, here is what they would cost individually, here is what the bundle costs. Make the deal visible without requiring readers to calculate it themselves.', example: null },
    { num: '3', title: 'The reading experience — brief and engaging', desc: 'A description of what readers will get from the series or collection as a whole, not just individual title summaries. What does reading all three feel like? What\'s the emotional arc of the full series?', example: null },
    { num: '4', title: 'Cover images and reader praise', desc: 'Cover images if space allows. One or two lines of reader praise — social proof matters particularly for new readers and for themed bundles where the connection between titles needs reinforcing.', example: null },
    { num: '5', title: 'Single clear call-to-action button', desc: 'One button. One link. For series bundles, a secondary "Start from Book One" link below the primary CTA serves readers who want to begin individually before committing to the full set.', example: null },
  ];

  readonly subjectExamples = [
    { line: 'The complete [Series Name] trilogy — now in one collection', why: 'States the product clearly and signals completeness — ideal for series bundles' },
    { line: 'Save [X]% on the full [Series Name] bundle', why: 'Leads with the savings percentage — makes the value proposition the first thing readers see' },
    { line: 'All three [Series Name] books — one price, one click', why: 'Emphasises the friction-removal aspect — one decision instead of three' },
    { line: 'The [Theme] collection — three books, one reading experience', why: 'Works for themed standalone bundles — frames the collection as a curated experience, not just a discount' },
  ];

  selectSubject(line: string) { this.onSubjectSuggestion.emit(line); }
}
