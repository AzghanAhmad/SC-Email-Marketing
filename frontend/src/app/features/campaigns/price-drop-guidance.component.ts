import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-price-drop-guidance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="pd-guidance">

      <!-- What it is -->
      <div class="pd-callout">
        <div class="pd-callout-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
            <line x1="12" y1="1" x2="12" y2="23"/>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
        </div>
        <div>
          <h4 class="pd-callout-title">What a price drop notification is designed to do</h4>
          <p class="pd-callout-desc">Not every reader who hasn't bought your book is uninterested in it. Some of them read the description, looked at the reviews, and genuinely wanted to read it — they just didn't buy it at the price it was listed that day. The price drop notification tells a reader who was already warm to your work that the thing that was in the way is no longer there, and here is the path to the book they've been meaning to read.</p>
        </div>
      </div>

      <!-- Flash sale vs price drop distinction -->
      <div class="pd-distinction">
        <h4 class="pd-section-title">Price Drop Notification vs. Flash Sale — Understanding the Distinction</h4>
        <div class="pd-distinction-grid">
          <div class="pd-dist-card flash">
            <div class="pd-dist-label flash">Flash Sale</div>
            <div class="pd-dist-mechanism">Conversion mechanism: <strong>Time pressure</strong></div>
            <p class="pd-dist-desc">Creates urgency. The price is temporary, the window is short, and the email leads with both facts prominently. Act now or lose the deal.</p>
            <div class="pd-dist-tone">Tone: High energy, deadline-forward</div>
          </div>
          <div class="pd-dist-vs">≠</div>
          <div class="pd-dist-card drop">
            <div class="pd-dist-label drop">Price Drop Notification</div>
            <div class="pd-dist-mechanism">Conversion mechanism: <strong>Barrier removal</strong></div>
            <p class="pd-dist-desc">Informs. The price has changed — possibly permanently — and readers who were previously deterred now have a reason to reconsider. Calmer, gentler, more like a helpful update.</p>
            <div class="pd-dist-tone">Tone: Calm, warm, informative</div>
          </div>
        </div>
        <div class="pd-distinction-warning">
          <svg viewBox="0 0 20 20" fill="#d97706" width="14" height="14"><path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/></svg>
          <span>The mistake authors make is writing a price drop notification like a flash sale — manufacturing urgency around a permanent pricing decision, adding fake countdown timers, or implying the price will go back up when it won't. This confuses readers and undermines the trust that makes future promotional emails credible.</span>
        </div>
      </div>

      <!-- Use cases -->
      <div class="pd-section">
        <h4 class="pd-section-title">The Best Use Cases for a Price Drop Notification</h4>
        <div class="pd-use-cases">
          <div class="pd-use-case" *ngFor="let u of useCases">
            <div class="pd-use-icon" [style.background]="u.bg" [style.color]="u.color" [innerHTML]="u.icon"></div>
            <div>
              <span class="pd-use-title">{{ u.title }}</span>
              <span class="pd-use-desc">{{ u.desc }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Email structure -->
      <div class="pd-section">
        <h4 class="pd-section-title">How to Write the Price Drop Notification</h4>
        <p class="pd-section-intro">The tonal target is calm, warm, and informative. You're not creating excitement; you're delivering useful information to readers who are already predisposed to be interested in your books.</p>
        <div class="pd-struct-steps">
          <div class="pd-struct-step" *ngFor="let s of emailStructure">
            <div class="pd-struct-num">{{ s.num }}</div>
            <div>
              <span class="pd-struct-title">{{ s.title }}</span>
              <span class="pd-struct-desc">{{ s.desc }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Subject lines -->
      <div class="pd-section">
        <h4 class="pd-section-title">Subject Lines — Clear and Informative, Not Urgent</h4>
        <p class="pd-section-intro">Your subject line communicates the pricing change without manufactured urgency. The word "permanently" does important work — it signals this isn't a limited promotion, giving fence-sitters all the time they need to act.</p>
        <div class="pd-subject-list">
          <div class="pd-subject-item" *ngFor="let s of subjectExamples" (click)="selectSubject(s.line)">
            <div class="pd-subject-line">"{{ s.line }}"</div>
            <div class="pd-subject-why">{{ s.why }}</div>
            <button class="pd-use-btn" (click)="$event.stopPropagation(); selectSubject(s.line)">Use this</button>
          </div>
        </div>
      </div>

      <!-- Suppression -->
      <div class="pd-section">
        <h4 class="pd-section-title">Audience Targeting — Suppression Is Everything</h4>
        <div class="pd-suppression-callout">
          <div class="pd-supp-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
          </div>
          <div>
            <span class="pd-supp-title">Suppress existing buyers automatically</span>
            <p class="pd-supp-desc">A reader who paid $4.99 for your book last year doesn't need to know it's now $2.99. That information is not useful to them — it's potentially irritating, and it's the kind of thing that generates unsubscribes not because readers are angry about the price change but because being told about a price change on something they already bought at a higher price feels like a bad customer experience.</p>
            <p class="pd-supp-desc" style="margin-top:.5rem">ScribeCount suppresses existing buyers automatically from price drop notification campaigns based on your direct store's purchase history — no manual list management, no spreadsheet cross-referencing.</p>
          </div>
        </div>
        <div class="pd-supp-tip">
          <svg viewBox="0 0 20 20" fill="#3b82f6" width="13" height="13"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd"/></svg>
          <span>For titles distributed through retail platforms where purchase history isn't directly available, consider adding a brief note in the email that acknowledges existing buyers and thanks them for their support — which addresses the awkwardness directly rather than pretending it doesn't exist.</span>
        </div>
      </div>

      <!-- BookBub / retailer promo combination -->
      <div class="pd-section">
        <h4 class="pd-section-title">Combining with Retailer Promotional Events</h4>
        <p class="pd-section-intro">Some of the most effective price drop notifications go out in conjunction with a BookBub Featured Deal or a retailer-curated promotional placement. In this scenario, the email does have a time element — acknowledge it briefly without manufacturing false urgency.</p>
        <div class="pd-bookbub-example">
          <div class="pd-bb-label">Example framing for a timed promotional event:</div>
          <div class="pd-bb-quote">"In conjunction with a BookBub promotion this week, [Title] is available for 99 cents through Sunday."</div>
          <p class="pd-bb-note">Accurate, transparent, and appropriately timed without being manipulative. ScribeCount's smart link tracking attributes clicks from your email separately from organic traffic through the retailer's promotion — giving you a clear picture of how much revenue was driven by your own list vs. the platform's promotional machinery.</p>
        </div>
      </div>

      <!-- Backlist reactivation -->
      <div class="pd-backlist-note">
        <div class="pd-bl-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>
        <div>
          <span class="pd-bl-title">Price Drop as a Backlist Reactivation Tool</span>
          <p class="pd-bl-desc">Authors who periodically cycle through their catalog — reducing the price of specific titles in rotation — and notify their list when each change happens create a natural, non-repetitive reason to mention older titles to subscribers who joined after those books were released. A reader who joined your list six months ago through a reader magnet may have never heard of a backlist title you published three years before they found you. A price drop notification on that title introduces the book to a subscriber for whom it genuinely is new, at a price point that makes the trial low-risk.</p>
        </div>
      </div>

      <!-- Price drop details form -->
      <div class="pd-section">
        <h4 class="pd-section-title">Price Drop Details</h4>
        <div class="pd-form-grid">
          <div class="form-group">
            <label class="form-label">Title</label>
            <input type="text" class="form-input" [(ngModel)]="dropDetails.title" placeholder="e.g. The Ember Crown" />
          </div>
          <div class="form-group">
            <label class="form-label">Price Drop Type</label>
            <select class="form-input" [(ngModel)]="dropDetails.dropType">
              <option value="permanent">Permanent price reduction</option>
              <option value="perma-free">Perma-free (Book 1 of series)</option>
              <option value="extended">Extended promotional period</option>
              <option value="bookbub">BookBub / retailer promo event</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Previous Price</label>
            <input type="text" class="form-input" [(ngModel)]="dropDetails.oldPrice" placeholder="e.g. $4.99" />
          </div>
          <div class="form-group">
            <label class="form-label">New Price</label>
            <input type="text" class="form-input" [(ngModel)]="dropDetails.newPrice" placeholder="e.g. $2.99 or Free" />
          </div>
          <div class="form-group">
            <label class="form-label">Buy / Download Link</label>
            <input type="url" class="form-input" [(ngModel)]="dropDetails.link" placeholder="https://..." />
          </div>
          <div class="form-group" *ngIf="dropDetails.dropType === 'perma-free' || dropDetails.dropType === 'bookbub'">
            <label class="form-label">Series Reading Order Link <span class="form-label-hint">(optional)</span></label>
            <input type="url" class="form-input" [(ngModel)]="dropDetails.seriesLink" placeholder="https://..." />
          </div>
        </div>
        <div class="pd-type-note" *ngIf="dropDetails.dropType">
          <svg viewBox="0 0 20 20" fill="#d97706" width="13" height="13"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd"/></svg>
          <span>{{ getTypeNote(dropDetails.dropType) }}</span>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .pd-guidance { display:flex; flex-direction:column; gap:1rem; }
    .pd-callout { display:flex; align-items:flex-start; gap:.875rem; padding:.875rem 1rem; background:rgba(217,119,6,0.06); border-left:3px solid #d97706; border-radius:0 10px 10px 0; }
    .pd-callout-icon { width:32px; height:32px; border-radius:8px; background:rgba(217,119,6,0.1); color:#d97706; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .pd-callout-title { display:block; font-size:.875rem; font-weight:700; color:#0f172a; margin-bottom:.3rem; }
    .pd-callout-desc { font-size:.8rem; color:#374151; margin:0; line-height:1.6; }
    .pd-section { background:#f8fafc; border:1.5px solid #f1f5f9; border-radius:12px; padding:1.125rem; }
    .pd-section-title { display:block; font-size:.75rem; font-weight:700; text-transform:uppercase; letter-spacing:.07em; color:#94a3b8; margin:0 0 .75rem; }
    .pd-section-intro { display:block; font-size:.8125rem; color:#64748b; margin:0 0 .875rem; line-height:1.5; }
    .pd-distinction { background:#f8fafc; border:1.5px solid #f1f5f9; border-radius:12px; padding:1.125rem; }
    .pd-distinction-grid { display:grid; grid-template-columns:1fr auto 1fr; gap:.75rem; align-items:center; margin-bottom:.875rem; }
    .pd-dist-card { padding:.875rem; border-radius:10px; }
    .pd-dist-card.flash { background:rgba(220,38,38,0.05); border:1.5px solid rgba(220,38,38,0.2); }
    .pd-dist-card.drop { background:rgba(217,119,6,0.05); border:1.5px solid rgba(217,119,6,0.2); }
    .pd-dist-label { font-size:.75rem; font-weight:700; padding:.2rem .6rem; border-radius:6px; width:fit-content; margin-bottom:.5rem; }
    .pd-dist-label.flash { background:rgba(220,38,38,0.1); color:#dc2626; }
    .pd-dist-label.drop { background:rgba(217,119,6,0.1); color:#d97706; }
    .pd-dist-mechanism { font-size:.75rem; color:#374151; margin-bottom:.375rem; }
    .pd-dist-desc { font-size:.75rem; color:#64748b; margin:0 0 .5rem; line-height:1.5; }
    .pd-dist-tone { font-size:.7rem; font-weight:600; color:#94a3b8; font-style:italic; }
    .pd-dist-vs { font-size:1.25rem; font-weight:800; color:#94a3b8; text-align:center; }
    .pd-distinction-warning { display:flex; align-items:flex-start; gap:.5rem; padding:.75rem 1rem; background:rgba(217,119,6,0.06); border:1px solid rgba(217,119,6,0.15); border-radius:8px; font-size:.8rem; color:#78350f; line-height:1.5; }
    .pd-use-cases { display:flex; flex-direction:column; gap:.625rem; }
    .pd-use-case { display:flex; align-items:flex-start; gap:.75rem; padding:.75rem; background:#fff; border:1px solid #f1f5f9; border-radius:8px; }
    .pd-use-icon { width:28px; height:28px; border-radius:7px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .pd-use-title { display:block; font-size:.8125rem; font-weight:600; color:#0f172a; margin-bottom:.2rem; }
    .pd-use-desc { display:block; font-size:.75rem; color:#64748b; line-height:1.5; }
    .pd-struct-steps { display:flex; flex-direction:column; gap:.625rem; }
    .pd-struct-step { display:flex; align-items:flex-start; gap:.75rem; }
    .pd-struct-num { width:22px; height:22px; border-radius:50%; background:#d97706; color:#fff; font-size:.7rem; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:.1rem; }
    .pd-struct-title { display:block; font-size:.8125rem; font-weight:600; color:#0f172a; margin-bottom:.2rem; }
    .pd-struct-desc { display:block; font-size:.75rem; color:#64748b; line-height:1.5; }
    .pd-subject-list { display:flex; flex-direction:column; gap:.5rem; }
    .pd-subject-item { display:flex; align-items:center; gap:.875rem; padding:.75rem 1rem; background:#fff; border:1.5px solid #e2e8f0; border-radius:10px; cursor:pointer; transition:border-color .15s; }
    .pd-subject-item:hover { border-color:#d97706; }
    .pd-subject-line { font-size:.875rem; font-weight:600; color:#0f172a; font-style:italic; flex:1; }
    .pd-subject-why { font-size:.75rem; color:#94a3b8; flex:1; }
    .pd-use-btn { padding:.25rem .625rem; border:1.5px solid rgba(217,119,6,0.25); border-radius:6px; background:rgba(217,119,6,0.06); color:#d97706; font-size:.75rem; font-weight:600; font-family:inherit; cursor:pointer; white-space:nowrap; transition:all .15s; }
    .pd-use-btn:hover { background:rgba(217,119,6,0.12); border-color:#d97706; }
    .pd-suppression-callout { display:flex; align-items:flex-start; gap:.875rem; padding:.875rem 1rem; background:rgba(220,38,38,0.04); border:1.5px solid rgba(220,38,38,0.12); border-radius:10px; margin-bottom:.75rem; }
    .pd-supp-icon { width:32px; height:32px; border-radius:8px; background:rgba(220,38,38,0.1); color:#dc2626; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .pd-supp-title { display:block; font-size:.875rem; font-weight:700; color:#0f172a; margin-bottom:.3rem; }
    .pd-supp-desc { font-size:.8rem; color:#374151; margin:0; line-height:1.6; }
    .pd-supp-tip { display:flex; align-items:flex-start; gap:.5rem; padding:.625rem .875rem; background:rgba(59,130,246,0.06); border-radius:8px; font-size:.8rem; color:#374151; line-height:1.5; }
    .pd-bookbub-example { background:#fff; border:1.5px solid #e2e8f0; border-radius:10px; padding:.875rem; }
    .pd-bb-label { font-size:.75rem; font-weight:700; color:#94a3b8; text-transform:uppercase; letter-spacing:.05em; margin-bottom:.5rem; }
    .pd-bb-quote { font-size:.875rem; font-style:italic; color:#0f172a; border-left:3px solid #d97706; padding-left:.75rem; margin-bottom:.625rem; line-height:1.5; }
    .pd-bb-note { font-size:.75rem; color:#64748b; margin:0; line-height:1.5; }
    .pd-backlist-note { display:flex; align-items:flex-start; gap:.875rem; padding:.875rem 1rem; background:rgba(100,116,139,0.05); border:1.5px solid rgba(100,116,139,0.15); border-radius:10px; }
    .pd-bl-icon { width:32px; height:32px; border-radius:8px; background:rgba(100,116,139,0.1); color:#64748b; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .pd-bl-title { display:block; font-size:.875rem; font-weight:700; color:#0f172a; margin-bottom:.3rem; }
    .pd-bl-desc { font-size:.8rem; color:#374151; margin:0; line-height:1.6; }
    .pd-form-grid { display:grid; grid-template-columns:1fr 1fr; gap:.875rem; margin-bottom:.875rem; }
    .form-group { display:flex; flex-direction:column; }
    .form-label { font-size:.8125rem; font-weight:600; color:#374151; margin-bottom:.4rem; display:flex; align-items:center; gap:.375rem; }
    .form-label-hint { font-size:.75rem; font-weight:400; color:#94a3b8; }
    .form-input { padding:.625rem .875rem; background:#fff; border:1.5px solid #e2e8f0; border-radius:10px; color:#0f172a; font-size:.875rem; font-family:inherit; outline:none; transition:border-color .15s; }
    .form-input:focus { border-color:#d97706; }
    .pd-type-note { display:flex; align-items:flex-start; gap:.5rem; padding:.625rem .875rem; background:rgba(217,119,6,0.06); border-radius:8px; font-size:.8rem; color:#374151; line-height:1.5; }
    @media(max-width:700px) { .pd-distinction-grid { grid-template-columns:1fr; } .pd-dist-vs { display:none; } .pd-form-grid { grid-template-columns:1fr; } .pd-subject-item { flex-direction:column; align-items:flex-start; } }
  `]
})
export class PriceDropGuidanceComponent {
  @Output() onSubjectSuggestion = new EventEmitter<string>();

  dropDetails = { title: '', dropType: 'permanent', oldPrice: '', newPrice: '', link: '', seriesLink: '' };

  readonly useCases = [
    {
      title: 'Permanently Reducing Book One of a Series',
      desc: 'Reducing the entry point price for a series is a deliberate decision to trade revenue on the first book for improved read-through into the rest. The readers most likely to benefit from knowing about it are the people on your list who haven\'t bought Book One yet. ScribeCount identifies this segment automatically from your purchase history.',
      bg: 'rgba(99,102,241,0.1)', color: '#6366f1',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>'
    },
    {
      title: 'Making a Title Perma-Free for List Growth',
      desc: 'Authors who use a permanently free first-in-series title as a reader magnet often send a price drop notification when they first make the title free — both to inform their existing list and to invite subscribers who joined through other means to pick up the free book. This begins the read-through funnel for readers already on your list who haven\'t started the series.',
      bg: 'rgba(16,185,129,0.1)', color: '#059669',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'
    },
    {
      title: 'Announcing a New Evergreen Price for a Backlist Title',
      desc: 'A backlist title repriced from $4.99 to $2.99 as part of a broader catalog strategy. A price drop notification to non-buyers of that title is appropriate and useful — short and informational: the book is available, it\'s now at a price that might make it easier to pick up, and here\'s the link.',
      bg: 'rgba(217,119,6,0.1)', color: '#d97706',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>'
    },
    {
      title: 'Following a Major Promotional Event',
      desc: 'If your book has been featured in a BookBub promotion or Kindle Countdown Deal and you\'ve decided to keep the price at that level afterward, a price drop notification to subscribers who didn\'t buy during the promotion is a natural follow-up. These readers may not have seen the promotional price on the retailer pages during the event.',
      bg: 'rgba(59,130,246,0.1)', color: '#3b82f6',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>'
    },
  ];

  readonly emailStructure = [
    { num: '1', title: 'Subject Line — clear and informative, not urgent', desc: 'Communicate the pricing change without manufactured urgency. No countdown, no "last chance," no pressure. The word "permanently" does important work — it signals this isn\'t a limited promotion.' },
    { num: '2', title: 'Opening — acknowledge the change, then the book', desc: 'Open with the pricing update in one clear sentence, then transition immediately to the book itself. State the change, then give them a brief, compelling reminder of why the book was worth their interest in the first place.' },
    { num: '3', title: 'Re-introduce the book with fresh eyes', desc: 'A brief re-introduction — your hook, a line or two of current reader praise, and the cover image — refreshes interest without requiring readers to remember details from when they first encountered the book. Two or three sentences and the cover are enough.' },
    { num: '4', title: 'Call to action — frictionless and clear', desc: 'One button. One link. No urgency language unless the pricing is genuinely time-limited. For a permanent price change: "Get your copy at the new price" or "Start the series here." For series entry-point notifications, a reading order link below the primary CTA is a helpful addition.' },
    { num: '5', title: 'Close without pressure', desc: 'No countdown, no "don\'t miss out," no artificially created time pressure. A brief, warm close in your own voice — genuine pleasure that the price barrier is gone. Then your signature. Let the email end calmly.' },
  ];

  readonly subjectExamples = [
    { line: '[Title] is now available at a new lower price', why: 'Direct and factual — no drama, no deadline, no pressure' },
    { line: 'I\'ve permanently reduced the price of [Title]', why: '"Permanently" signals this isn\'t a limited promotion — gives fence-sitters all the time they need to act' },
    { line: '[Series Name] Book One is now free', why: 'For perma-free series starters — answers the most important question immediately' },
    { line: 'In case the price was holding you back', why: 'Acknowledges the reader\'s perspective directly and signals genuine awareness of what may have been in the way' },
  ];

  readonly typeNotes: Record<string, string> = {
    'permanent': 'Permanent reduction — do not use urgency language. The email should feel like a helpful update, not a promotion with a deadline.',
    'perma-free': 'Perma-free entry point — consider adding a series reading order link below the primary CTA so readers understand what they\'re getting into before they download.',
    'extended': 'Extended promotional period — if there is an end date, state it clearly and accurately. Do not imply permanence if the price will eventually return to normal.',
    'bookbub': 'BookBub / retailer promo — you can acknowledge the time element briefly without manufacturing urgency. ScribeCount smart links will attribute your email clicks separately from the retailer\'s organic traffic.',
  };

  selectSubject(line: string) { this.onSubjectSuggestion.emit(line); }
  getTypeNote(type: string): string { return this.typeNotes[type] || ''; }
}
