import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-flash-sale-guidance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fs-guidance">

      <!-- What it is -->
      <div class="fs-callout">
        <div class="fs-callout-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>
        </div>
        <div>
          <h4 class="fs-callout-title">What a flash sale email is designed to do</h4>
          <p class="fs-callout-desc">A broadcast campaign announcing a short-window price reduction — typically 24 hours to a few days. The goal is a concentrated spike in sales activity that moves price-sensitive readers who have been on the fence, re-activates readers who know your work but haven't bought recently, and rewards your most engaged subscribers with the best pricing you offer before it returns to normal.</p>
        </div>
      </div>

      <!-- Urgency psychology -->
      <div class="fs-section">
        <h4 class="fs-section-title">The Psychology of Urgency — Why Real Deadlines Are Non-Negotiable</h4>
        <div class="fs-urgency-grid">
          <div class="fs-urgency-card real">
            <div class="fs-urgency-label real">✓ Real urgency</div>
            <p class="fs-urgency-desc">Creates decisions. A genuine deadline transforms a reader's passive wait into a choice with a cost — either buy now, or miss the price. This is the primary conversion mechanism of the flash sale email.</p>
          </div>
          <div class="fs-urgency-card fake">
            <div class="fs-urgency-label fake">✗ Fake urgency</div>
            <p class="fs-urgency-desc">Creates distrust. Every manufactured deadline your readers see through teaches them that your urgency language means nothing — and that lesson carries forward into every future email you send.</p>
          </div>
        </div>
        <div class="fs-urgency-warning">
          <svg viewBox="0 0 20 20" fill="#dc2626" width="14" height="14"><path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/></svg>
          <span>Set every deadline in advance, honor it without exception, and do not extend. The short-term revenue you might gain by extending a sale is not worth the long-term erosion of trust with your audience.</span>
        </div>
      </div>

      <!-- Email structure -->
      <div class="fs-section">
        <h4 class="fs-section-title">How to Structure a Flash Sale Email</h4>
        <p class="fs-section-intro">A flash sale email leads with the offer — not with relationship-building. The offer is time-sensitive, and burying it below introductory paragraphs costs you conversions from readers who scan rather than read.</p>
        <div class="fs-struct-steps">
          <div class="fs-struct-step" *ngFor="let s of emailStructure">
            <div class="fs-struct-icon" [innerHTML]="s.icon"></div>
            <div>
              <span class="fs-struct-title">{{ s.title }}</span>
              <span class="fs-struct-desc">{{ s.desc }}</span>
              <div class="fs-struct-example" *ngIf="s.example">
                <span class="fs-example-label">Example:</span>
                <span class="fs-example-text">{{ s.example }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Subject line guidance -->
      <div class="fs-section">
        <h4 class="fs-section-title">Subject Lines — Lead with the Deal</h4>
        <p class="fs-section-intro">Your flash sale subject line has one job: communicate the offer and the urgency in as few words as possible. Generic subject lines kill flash sales before they start — "Something exciting!" makes the reader do work to figure out whether this email matters to them. In a crowded inbox, that work rarely gets done.</p>
        <div class="fs-subject-list">
          <div class="fs-subject-item" *ngFor="let s of subjectExamples" (click)="selectSubject(s.line)">
            <div class="fs-subject-line">"{{ s.line }}"</div>
            <div class="fs-subject-why">{{ s.why }}</div>
            <button class="fs-use-btn" (click)="$event.stopPropagation(); selectSubject(s.line)">Use this</button>
          </div>
        </div>
      </div>

      <!-- Two-email structure -->
      <div class="fs-section">
        <h4 class="fs-section-title">How Many Emails to Send</h4>
        <p class="fs-section-intro">A two-email structure is the right framework for most flash sales. More than two crosses into territory where readers feel pestered; fewer than two leaves money on the table from readers who intended to buy and got distracted.</p>
        <div class="fs-email-sequence">
          <div class="fs-seq-item" *ngFor="let e of emailSequence">
            <div class="fs-seq-num" [style.background]="e.color">{{ e.num }}</div>
            <div>
              <span class="fs-seq-title">{{ e.title }}</span>
              <span class="fs-seq-timing">{{ e.timing }}</span>
              <span class="fs-seq-desc">{{ e.desc }}</span>
            </div>
          </div>
        </div>
        <div class="fs-seq-note">
          <svg viewBox="0 0 20 20" fill="#3b82f6" width="13" height="13"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd"/></svg>
          <span>If the flash sale runs for more than three days, a mid-sale "in case you missed it" reminder is reasonable as a third email. For shorter sales, stick to two.</span>
        </div>
      </div>

      <!-- Targeting & suppression -->
      <div class="fs-section">
        <h4 class="fs-section-title">Who Gets the Flash Sale Email</h4>
        <div class="fs-suppression-callout">
          <div class="fs-supp-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
          </div>
          <div>
            <span class="fs-supp-title">Suppress existing buyers — automatically</span>
            <p class="fs-supp-desc">A reader who bought your book at full price two months ago doesn't need — and shouldn't receive — a sale announcement for the same book at a lower price. They already made a purchasing decision in good faith. Seeing that the book is now available for a fraction of what they paid erodes trust and can generate genuine resentment.</p>
            <p class="fs-supp-desc" style="margin-top:.5rem">ScribeCount connects your email audience to your direct store's purchase history. Buyer suppression for a flash sale campaign is applied automatically based on real transaction data — no manual list management, no spreadsheet cross-referencing.</p>
          </div>
        </div>
        <div class="fs-targeting-tip">
          <svg viewBox="0 0 20 20" fill="#059669" width="13" height="13"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
          <span>Consider sending your announcement first to your most engaged subscribers — consistent openers and clickers. Reaching them first improves early sales velocity without increasing total email volume.</span>
        </div>
      </div>

      <!-- Pre-send checklist -->
      <div class="fs-section">
        <h4 class="fs-section-title">Pre-Send Checklist — Verify Pricing Is Live</h4>
        <p class="fs-section-intro">Your promotional pricing must be live on every platform you're linking to before the announcement email goes out. A reader who clicks through expecting 99¢ and finds the full price on the product page will close the tab — and you've damaged the experience regardless of whether you send a correction email later.</p>
        <div class="fs-checklist">
          <div class="fs-check-item" *ngFor="let c of preflightItems">
            <div class="fs-check-box" [class.checked]="c.checked" (click)="c.checked = !c.checked">
              <svg *ngIf="c.checked" viewBox="0 0 20 20" fill="#059669" width="14" height="14"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
            </div>
            <span [class.checked-text]="c.checked">{{ c.label }}</span>
          </div>
        </div>
      </div>

      <!-- Sale details form -->
      <div class="fs-section">
        <h4 class="fs-section-title">Flash Sale Details</h4>
        <div class="fs-form-grid">
          <div class="form-group">
            <label class="form-label">Title on Sale</label>
            <input type="text" class="form-input" [(ngModel)]="saleDetails.title" placeholder="e.g. The Ember Crown" />
          </div>
          <div class="form-group">
            <label class="form-label">Sale Price</label>
            <input type="text" class="form-input" [(ngModel)]="saleDetails.price" placeholder="e.g. 99¢ / $0.99" />
          </div>
          <div class="form-group">
            <label class="form-label">Sale Start Date &amp; Time</label>
            <input type="datetime-local" class="form-input" [(ngModel)]="saleDetails.startDate" />
          </div>
          <div class="form-group">
            <label class="form-label">Sale End Date &amp; Time</label>
            <input type="datetime-local" class="form-input" [(ngModel)]="saleDetails.endDate" />
          </div>
          <div class="form-group">
            <label class="form-label">Amazon Sale Link</label>
            <input type="url" class="form-input" [(ngModel)]="saleDetails.amazonLink" placeholder="https://..." />
          </div>
          <div class="form-group">
            <label class="form-label">Direct Store Sale Link</label>
            <input type="url" class="form-input" [(ngModel)]="saleDetails.directLink" placeholder="https://..." />
          </div>
        </div>
        <div class="fs-deadline-preview" *ngIf="saleDetails.endDate">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <span>Deadline to display in email: <strong>{{ formatDeadline(saleDetails.endDate) }}</strong></span>
        </div>
      </div>

      <!-- Revenue tracking -->
      <div class="fs-revenue-note">
        <div class="fs-rev-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
        </div>
        <div>
          <span class="fs-rev-title">Flash Sale Performance in ScribeCount</span>
          <p class="fs-rev-desc">Smart links from your campaign are attributed to that campaign in ScribeCount's reporting. When a reader clicks your sale link and completes a purchase, that purchase event connects to the originating campaign. After the sale ends, your reporting shows not just click rates but revenue generated — per email, per send, across the full campaign window. Over multiple flash sales, that data tells you which titles respond best to promotional pricing and what the revenue-per-subscriber impact is compared to a standard launch email.</p>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .fs-guidance { display:flex; flex-direction:column; gap:1rem; }
    .fs-callout { display:flex; align-items:flex-start; gap:.875rem; padding:.875rem 1rem; background:rgba(220,38,38,0.06); border-left:3px solid #dc2626; border-radius:0 10px 10px 0; }
    .fs-callout-icon { width:32px; height:32px; border-radius:8px; background:rgba(220,38,38,0.1); color:#dc2626; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .fs-callout-title { display:block; font-size:.875rem; font-weight:700; color:#0f172a; margin-bottom:.3rem; }
    .fs-callout-desc { font-size:.8rem; color:#374151; margin:0; line-height:1.6; }
    .fs-section { background:#f8fafc; border:1.5px solid #f1f5f9; border-radius:12px; padding:1.125rem; }
    .fs-section-title { display:block; font-size:.75rem; font-weight:700; text-transform:uppercase; letter-spacing:.07em; color:#94a3b8; margin:0 0 .75rem; }
    .fs-section-intro { display:block; font-size:.8125rem; color:#64748b; margin:0 0 .875rem; line-height:1.5; }
    .fs-urgency-grid { display:grid; grid-template-columns:1fr 1fr; gap:.75rem; margin-bottom:.875rem; }
    .fs-urgency-card { padding:.875rem; border-radius:10px; }
    .fs-urgency-card.real { background:rgba(16,185,129,0.05); border:1.5px solid rgba(16,185,129,0.2); }
    .fs-urgency-card.fake { background:rgba(220,38,38,0.05); border:1.5px solid rgba(220,38,38,0.2); }
    .fs-urgency-label { font-size:.75rem; font-weight:700; margin-bottom:.375rem; }
    .fs-urgency-label.real { color:#059669; }
    .fs-urgency-label.fake { color:#dc2626; }
    .fs-urgency-desc { font-size:.8rem; color:#374151; margin:0; line-height:1.5; }
    .fs-urgency-warning { display:flex; align-items:flex-start; gap:.5rem; padding:.75rem 1rem; background:rgba(220,38,38,0.06); border:1px solid rgba(220,38,38,0.15); border-radius:8px; font-size:.8rem; color:#7f1d1d; line-height:1.5; }
    .fs-struct-steps { display:flex; flex-direction:column; gap:.75rem; }
    .fs-struct-step { display:flex; align-items:flex-start; gap:.75rem; padding:.75rem; background:#fff; border:1px solid #f1f5f9; border-radius:8px; }
    .fs-struct-icon { width:28px; height:28px; border-radius:7px; background:rgba(220,38,38,0.08); color:#dc2626; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .fs-struct-title { display:block; font-size:.8125rem; font-weight:600; color:#0f172a; margin-bottom:.2rem; }
    .fs-struct-desc { display:block; font-size:.75rem; color:#64748b; line-height:1.5; }
    .fs-struct-example { display:flex; align-items:flex-start; gap:.375rem; margin-top:.5rem; padding:.5rem .75rem; background:rgba(220,38,38,0.04); border-radius:6px; }
    .fs-example-label { font-size:.7rem; font-weight:700; color:#dc2626; white-space:nowrap; }
    .fs-example-text { font-size:.75rem; color:#374151; font-style:italic; line-height:1.4; }
    .fs-subject-list { display:flex; flex-direction:column; gap:.5rem; }
    .fs-subject-item { display:flex; align-items:center; gap:.875rem; padding:.75rem 1rem; background:#fff; border:1.5px solid #e2e8f0; border-radius:10px; cursor:pointer; transition:border-color .15s; }
    .fs-subject-item:hover { border-color:#dc2626; }
    .fs-subject-line { font-size:.875rem; font-weight:600; color:#0f172a; font-style:italic; flex:1; }
    .fs-subject-why { font-size:.75rem; color:#94a3b8; flex:1; }
    .fs-use-btn { padding:.25rem .625rem; border:1.5px solid rgba(220,38,38,0.25); border-radius:6px; background:rgba(220,38,38,0.06); color:#dc2626; font-size:.75rem; font-weight:600; font-family:inherit; cursor:pointer; white-space:nowrap; transition:all .15s; }
    .fs-use-btn:hover { background:rgba(220,38,38,0.12); border-color:#dc2626; }
    .fs-email-sequence { display:flex; flex-direction:column; gap:.625rem; margin-bottom:.875rem; }
    .fs-seq-item { display:flex; align-items:flex-start; gap:.875rem; padding:.875rem; background:#fff; border:1.5px solid #e2e8f0; border-radius:10px; }
    .fs-seq-num { width:28px; height:28px; border-radius:50%; color:#fff; font-size:.8125rem; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .fs-seq-title { display:block; font-size:.875rem; font-weight:600; color:#0f172a; margin-bottom:.15rem; }
    .fs-seq-timing { display:block; font-size:.75rem; font-weight:600; color:#dc2626; margin-bottom:.25rem; }
    .fs-seq-desc { display:block; font-size:.75rem; color:#64748b; line-height:1.5; }
    .fs-seq-note { display:flex; align-items:flex-start; gap:.5rem; padding:.625rem .875rem; background:rgba(59,130,246,0.06); border-radius:8px; font-size:.8rem; color:#374151; line-height:1.5; }
    .fs-suppression-callout { display:flex; align-items:flex-start; gap:.875rem; padding:.875rem 1rem; background:rgba(220,38,38,0.04); border:1.5px solid rgba(220,38,38,0.12); border-radius:10px; margin-bottom:.75rem; }
    .fs-supp-icon { width:32px; height:32px; border-radius:8px; background:rgba(220,38,38,0.1); color:#dc2626; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .fs-supp-title { display:block; font-size:.875rem; font-weight:700; color:#0f172a; margin-bottom:.3rem; }
    .fs-supp-desc { font-size:.8rem; color:#374151; margin:0; line-height:1.6; }
    .fs-targeting-tip { display:flex; align-items:flex-start; gap:.5rem; padding:.625rem .875rem; background:rgba(16,185,129,0.06); border-radius:8px; font-size:.8rem; color:#374151; line-height:1.5; }
    .fs-checklist { display:flex; flex-direction:column; gap:.5rem; }
    .fs-check-item { display:flex; align-items:center; gap:.75rem; padding:.5rem .75rem; background:#fff; border:1px solid #f1f5f9; border-radius:8px; cursor:pointer; }
    .fs-check-item:hover { background:#f8fafc; }
    .fs-check-box { width:20px; height:20px; border-radius:5px; border:2px solid #e2e8f0; display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:all .15s; }
    .fs-check-box.checked { border-color:#059669; background:rgba(16,185,129,0.08); }
    .fs-check-item span { font-size:.8125rem; color:#374151; line-height:1.4; }
    .fs-check-item span.checked-text { color:#94a3b8; text-decoration:line-through; }
    .fs-form-grid { display:grid; grid-template-columns:1fr 1fr; gap:.875rem; margin-bottom:.875rem; }
    .form-group { display:flex; flex-direction:column; }
    .form-label { font-size:.8125rem; font-weight:600; color:#374151; margin-bottom:.4rem; }
    .form-input { padding:.625rem .875rem; background:#fff; border:1.5px solid #e2e8f0; border-radius:10px; color:#0f172a; font-size:.875rem; font-family:inherit; outline:none; transition:border-color .15s; }
    .form-input:focus { border-color:#dc2626; }
    .fs-deadline-preview { display:flex; align-items:center; gap:.5rem; padding:.625rem .875rem; background:rgba(220,38,38,0.06); border-radius:8px; font-size:.8125rem; color:#374151; }
    .fs-revenue-note { display:flex; align-items:flex-start; gap:.875rem; padding:.875rem 1rem; background:rgba(59,130,246,0.04); border:1.5px solid rgba(59,130,246,0.12); border-radius:10px; }
    .fs-rev-icon { width:32px; height:32px; border-radius:8px; background:rgba(59,130,246,0.1); color:#3b82f6; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .fs-rev-title { display:block; font-size:.875rem; font-weight:700; color:#0f172a; margin-bottom:.3rem; }
    .fs-rev-desc { font-size:.8rem; color:#374151; margin:0; line-height:1.6; }
    @media(max-width:700px) { .fs-urgency-grid,.fs-form-grid { grid-template-columns:1fr; } .fs-subject-item { flex-direction:column; align-items:flex-start; } }
  `]
})
export class FlashSaleGuidanceComponent {
  @Output() onSubjectSuggestion = new EventEmitter<string>();

  saleDetails = { title: '', price: '', startDate: '', endDate: '', amazonLink: '', directLink: '' };

  preflightItems = [
    { label: 'Promotional price is live on Amazon', checked: false },
    { label: 'Promotional price is live on direct store', checked: false },
    { label: 'Promotional price is live on Apple Books / Kobo / B&N (if wide)', checked: false },
    { label: 'All sale links tested and resolving correctly', checked: false },
    { label: 'Sale end date and time confirmed and set in email', checked: false },
    { label: 'Buyer suppression rule enabled in Audience step', checked: false },
    { label: 'Final reminder email scheduled for last day of sale', checked: false },
  ];

  readonly emailStructure = [
    {
      title: 'Subject Line — offer and deadline up front',
      desc: 'Communicate the deal and the time limit in as few words as possible. Lead with the deal every time — generic subject lines kill flash sales before they start.',
      example: '"[Title] is 99¢ through Friday" or "24 hours: [Title] at half price"',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>'
    },
    {
      title: 'Opening — offer first, context second',
      desc: 'Restate the offer and the deadline in clear, direct terms. Then two or three sentences of context: why you\'re running the sale, what makes this a good moment to pick up the book. Keep this section short.',
      example: '"For the next 48 hours, [Title] is available for 99 cents — the lowest price I\'ve ever offered it."',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><line x1="21" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>'
    },
    {
      title: 'The Book — a quick re-introduction',
      desc: 'A two-to-three sentence hook giving new readers the minimum information they need to decide whether this is for them. Include your cover image. If you have strong reviews, one or two short lines of reader praise go here — social proof matters particularly for fence-sitters.',
      example: null,
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>'
    },
    {
      title: 'Call to Action — one link, deadline visible',
      desc: 'One button. One link. The deadline stated clearly at the CTA point — not only in the opening — because some readers skim to the button without reading the body copy.',
      example: '"Get it for 99¢ — offer ends Friday" in the button, or "Offer ends Friday at midnight" directly beneath it.',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><rect x="3" y="8" width="18" height="8" rx="4"/></svg>'
    },
    {
      title: 'Close — brief reinforcement',
      desc: 'A single closing sentence that reinforces the end of the offer and primes readers for your follow-up email. Then your signature. Done.',
      example: '"I\'ll send one more reminder before the price goes back up on Saturday."',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>'
    },
  ];

  readonly subjectExamples = [
    { line: '[Title] is 99¢ through Friday', why: 'States the deal and the deadline — reader knows immediately whether this is relevant' },
    { line: '24 hours: [Title] at half price', why: 'Leads with the time window, creates immediate urgency before the reader even opens' },
    { line: 'Weekend sale: the complete [Series Name] trilogy', why: 'Works for bundle promotions — names the product and signals the window' },
    { line: 'Last chance: [Title] returns to full price tonight', why: 'For the final reminder email — makes the ending explicit and unavoidable' },
  ];

  readonly emailSequence = [
    {
      num: '1', color: '#dc2626',
      title: 'Email 1 — The Announcement',
      timing: 'When the sale begins',
      desc: 'Subject line leads with the offer and the deadline. Full structure: offer, context, book hook, cover image, social proof, one CTA with deadline visible, brief close.'
    },
    {
      num: '2', color: '#b91c1c',
      title: 'Email 2 — The Final Reminder',
      timing: 'Final hours of the sale — morning of last day, or 4–6 hours before midnight',
      desc: 'Shorter than the announcement. A quick reminder of the offer, a restated deadline, and the link. Exists to capture readers who saw the first email, meant to act, and needed one more nudge.'
    },
  ];

  selectSubject(line: string) {
    this.onSubjectSuggestion.emit(line);
  }

  formatDeadline(dateStr: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) +
      ' at ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }
}
