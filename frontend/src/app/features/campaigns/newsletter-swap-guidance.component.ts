import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-newsletter-swap-guidance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="swap-guidance">

      <!-- What a swap is -->
      <div class="swap-callout">
        <div class="swap-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
            <polyline points="17 1 21 5 17 9"/>
            <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
            <polyline points="7 23 3 19 7 15"/>
            <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
          </svg>
        </div>
        <div>
          <h4 class="swap-callout-title">What a newsletter swap is</h4>
          <p class="swap-callout-desc">A mutual cross-promotion between two authors. You feature Author B's reader magnet or book in your newsletter — they do the same for you. Both authors reach a pre-qualified audience without paying for advertising. Both gain new subscribers who arrived via a trusted endorsement rather than a cold impression.</p>
        </div>
      </div>

      <!-- Pre-qualified reader advantage -->
      <div class="swap-advantage">
        <div class="swap-advantage-quote">
          <svg viewBox="0 0 20 20" fill="#0891b2" width="14" height="14"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd"/></svg>
          <p>Newsletter swap subscribers arrive pre-warmed by a recommendation from an author they already trust. That makes them some of the highest-quality subscribers you'll ever add — and tracking their source in ScribeCount tells you which partnerships deliver the best long-term readers.</p>
        </div>
        <div class="swap-why-grid">
          <div class="swap-why-item" *ngFor="let w of whyItWorks">
            <div class="swap-why-icon" [style.background]="w.bg" [style.color]="w.color" [innerHTML]="w.icon"></div>
            <div>
              <span class="swap-why-title">{{ w.title }}</span>
              <span class="swap-why-desc">{{ w.desc }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Finding the right partners -->
      <div class="swap-section">
        <h4 class="swap-section-title">Finding the Right Swap Partners</h4>
        <div class="swap-criteria">
          <div class="swap-criterion" *ngFor="let c of partnerCriteria">
            <div class="swap-crit-num">{{ c.num }}</div>
            <div>
              <span class="swap-crit-title">{{ c.title }}</span>
              <span class="swap-crit-desc">{{ c.desc }}</span>
            </div>
          </div>
        </div>
        <div class="swap-platforms">
          <div class="swap-platform">
            <span class="swap-platform-badge cyan">StoryOrigin</span>
            <p class="swap-platform-desc">The platform most indie authors use to organise newsletter swaps, group promotions, and reader magnet bundles. Handles matching, scheduling, and tracking. Subscribers acquired through StoryOrigin flow into ScribeCount tagged by source — no manual import, no spreadsheet reconciliation.</p>
          </div>
          <div class="swap-platform">
            <span class="swap-platform-badge green">Direct Partnerships</span>
            <p class="swap-platform-desc">Swaps arranged through personal outreach, author communities, or genre-specific Facebook groups. Often produce stronger results because the relationship between the two authors is more genuine. If you read and genuinely admire another author's work, a direct swap invitation is entirely appropriate and often welcomed.</p>
          </div>
        </div>
      </div>

      <!-- What you're promoting -->
      <div class="swap-promo-types">
        <div class="swap-promo-card">
          <span class="swap-promo-label indigo">Reader Magnet Swap</span>
          <p class="swap-promo-desc">Designed for list growth. Your email directs subscribers to your partner's opt-in page where they can claim a free story, novella, or resource in exchange for subscribing. The conversion ask is low — it's free, and the reader gets something immediately. The most common form of swap and the most effective for pure list-building.</p>
        </div>
        <div class="swap-promo-card">
          <span class="swap-promo-label amber">Book Recommendation Swap</span>
          <p class="swap-promo-desc">Drives book sales rather than subscriber growth. Better suited to authors who want to support each other's commercial launches. Know which goal you're serving when you set up the exchange.</p>
        </div>
      </div>

      <!-- The cardinal rule -->
      <div class="swap-cardinal">
        <div class="swap-cardinal-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </div>
        <div>
          <span class="swap-cardinal-title">The Cardinal Rule: It Must Feel Like a Recommendation</span>
          <p class="swap-cardinal-desc">Your readers gave you their email address because they trust your judgment. Write your swap email the same way you would write a recommendation to a friend. Only swap with authors whose work you have actually read. If you can't write a specific, authentic recommendation, the swap isn't right for you — forcing it will cost you more in reader trust than the new subscribers are worth.</p>
        </div>
      </div>

      <!-- Email structure -->
      <div class="swap-section">
        <h4 class="swap-section-title">Structure of the Swap Email</h4>
        <p class="swap-section-intro">A dedicated newsletter swap email is shorter than most of your campaigns — 300 to 400 words maximum. Its job is focused: introduce the author, make the case for why your readers will love their work, and give readers a clear way to click through.</p>
        <div class="swap-struct-steps">
          <div class="swap-struct-step" *ngFor="let s of emailStructure">
            <div class="swap-struct-num">{{ s.num }}</div>
            <div>
              <span class="swap-struct-title">{{ s.title }}</span>
              <span class="swap-struct-desc">{{ s.desc }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Subject lines -->
      <div class="swap-section">
        <h4 class="swap-section-title">Subject Lines for Swap Emails</h4>
        <p class="swap-section-intro">Your subject line needs to signal that this is a recommendation worth opening without sounding like advertising. Avoid "Special offer!" or "Free book inside!" — even if the email contains a free book.</p>
        <div class="swap-subjects">
          <div class="swap-subject-item" *ngFor="let s of subjectLines" (click)="selectSubject(s.line)">
            <div class="swap-subject-line">"{{ s.line }}"</div>
            <div class="swap-subject-why">{{ s.why }}</div>
            <button class="swap-use-btn" (click)="$event.stopPropagation(); selectSubject(s.line)">Use this</button>
          </div>
        </div>
      </div>

      <!-- Cadence -->
      <div class="swap-section">
        <h4 class="swap-section-title">How Often to Run Newsletter Swaps</h4>
        <div class="swap-cadence">
          <div class="swap-cadence-item" *ngFor="let c of cadenceRules">
            <svg viewBox="0 0 20 20" fill="#0891b2" width="13" height="13"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
            <span>{{ c }}</span>
          </div>
        </div>
      </div>

      <!-- Relationship note -->
      <div class="swap-relationship">
        <div class="swap-rel-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </div>
        <div>
          <span class="swap-rel-title">The Swap as Relationship, Not Transaction</span>
          <p class="swap-rel-desc">The most valuable newsletter swap partnerships aren't one-time exchanges. They're ongoing relationships between authors who genuinely like each other's work, trust each other's audiences, and benefit from recurring collaboration. Treating swaps transactionally produces short-term subscriber gains and long-term reader trust erosion.</p>
        </div>
      </div>

      <!-- Partner details form -->
      <div class="swap-section">
        <h4 class="swap-section-title">Swap Partner Details</h4>
        <div class="swap-form-grid">
          <div class="form-group">
            <label class="form-label">Partner Author Name</label>
            <input type="text" class="form-input" [(ngModel)]="partner.authorName" placeholder="e.g. Maya Chen" />
          </div>
          <div class="form-group">
            <label class="form-label">Partner's Genre / Subgenre</label>
            <input type="text" class="form-input" [(ngModel)]="partner.genre" placeholder="e.g. Paranormal Romance" />
          </div>
          <div class="form-group">
            <label class="form-label">Partner's Reader Magnet or Book Title</label>
            <input type="text" class="form-input" [(ngModel)]="partner.magnetTitle" placeholder="e.g. The Ember Witch (free novella)" />
          </div>
          <div class="form-group">
            <label class="form-label">Partner's Opt-in / Purchase Link</label>
            <input type="url" class="form-input" [(ngModel)]="partner.optinLink" placeholder="https://..." />
          </div>
          <div class="form-group">
            <label class="form-label">Your Reader Magnet (what they're promoting for you)</label>
            <input type="text" class="form-input" [(ngModel)]="partner.yourMagnet" placeholder="e.g. The Ashford Letters (free novella)" />
          </div>
          <div class="form-group">
            <label class="form-label">Swap Date</label>
            <input type="date" class="form-input" [(ngModel)]="partner.swapDate" />
          </div>
        </div>
        <div class="swap-source-note" *ngIf="partner.optinLink">
          <svg viewBox="0 0 20 20" fill="#059669" width="13" height="13"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
          <span>Subscribers who click through and opt in will be tagged with this swap as their acquisition source in ScribeCount — so you can track which partnerships deliver your best long-term readers.</span>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .swap-guidance { display:flex; flex-direction:column; gap:1rem; }
    .swap-callout { display:flex; align-items:flex-start; gap:.875rem; padding:.875rem 1rem; background:rgba(8,145,178,0.06); border-left:3px solid #0891b2; border-radius:0 10px 10px 0; }
    .swap-icon { width:32px; height:32px; border-radius:8px; background:rgba(8,145,178,0.1); color:#0891b2; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .swap-callout-title { display:block; font-size:.875rem; font-weight:700; color:#0f172a; margin-bottom:.3rem; }
    .swap-callout-desc { font-size:.8rem; color:#374151; margin:0; line-height:1.6; }
    .swap-advantage { background:#f8fafc; border:1.5px solid #f1f5f9; border-radius:12px; padding:1.125rem; }
    .swap-advantage-quote { display:flex; align-items:flex-start; gap:.5rem; padding:.75rem 1rem; background:rgba(8,145,178,0.06); border:1px solid rgba(8,145,178,0.15); border-radius:8px; font-size:.8125rem; color:#374151; line-height:1.6; margin-bottom:.875rem; }
    .swap-why-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:.625rem; }
    .swap-why-item { display:flex; align-items:flex-start; gap:.625rem; padding:.625rem; background:#fff; border-radius:8px; border:1px solid #f1f5f9; }
    .swap-why-icon { width:28px; height:28px; border-radius:7px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .swap-why-title { display:block; font-size:.8125rem; font-weight:600; color:#0f172a; margin-bottom:.15rem; }
    .swap-why-desc { display:block; font-size:.75rem; color:#94a3b8; line-height:1.4; }
    .swap-section { background:#f8fafc; border:1.5px solid #f1f5f9; border-radius:12px; padding:1.125rem; }
    .swap-section-title { display:block; font-size:.75rem; font-weight:700; text-transform:uppercase; letter-spacing:.07em; color:#94a3b8; margin:0 0 .75rem; }
    .swap-section-intro { display:block; font-size:.8125rem; color:#64748b; margin:0 0 .875rem; line-height:1.5; }
    .swap-criteria { display:flex; flex-direction:column; gap:.625rem; margin-bottom:.875rem; }
    .swap-criterion { display:flex; align-items:flex-start; gap:.75rem; }
    .swap-crit-num { width:22px; height:22px; border-radius:50%; background:#0891b2; color:#fff; font-size:.7rem; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:.1rem; }
    .swap-crit-title { display:block; font-size:.8125rem; font-weight:600; color:#0f172a; margin-bottom:.2rem; }
    .swap-crit-desc { display:block; font-size:.75rem; color:#64748b; line-height:1.5; }
    .swap-platforms { display:grid; grid-template-columns:1fr 1fr; gap:.75rem; }
    .swap-platform { padding:.875rem; background:#fff; border:1.5px solid #e2e8f0; border-radius:10px; }
    .swap-platform-badge { display:inline-block; font-size:.75rem; font-weight:700; padding:.2rem .6rem; border-radius:6px; margin-bottom:.5rem; }
    .cyan { background:rgba(8,145,178,0.1); color:#0891b2; }
    .green { background:rgba(16,185,129,0.1); color:#059669; }
    .swap-platform-desc { font-size:.75rem; color:#64748b; margin:0; line-height:1.5; }
    .swap-promo-types { display:grid; grid-template-columns:1fr 1fr; gap:.75rem; }
    .swap-promo-card { padding:.875rem; background:#f8fafc; border:1.5px solid #f1f5f9; border-radius:10px; }
    .swap-promo-label { display:inline-block; font-size:.75rem; font-weight:700; padding:.2rem .6rem; border-radius:6px; margin-bottom:.5rem; }
    .indigo { background:rgba(99,102,241,0.1); color:#6366f1; }
    .amber { background:rgba(245,158,11,0.1); color:#d97706; }
    .swap-promo-desc { font-size:.75rem; color:#64748b; margin:0; line-height:1.5; }
    .swap-cardinal { display:flex; align-items:flex-start; gap:.875rem; padding:.875rem 1rem; background:rgba(99,102,241,0.06); border:1.5px solid rgba(99,102,241,0.15); border-radius:10px; }
    .swap-cardinal-icon { width:32px; height:32px; border-radius:8px; background:rgba(99,102,241,0.1); color:#6366f1; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .swap-cardinal-title { display:block; font-size:.875rem; font-weight:700; color:#0f172a; margin-bottom:.3rem; }
    .swap-cardinal-desc { font-size:.8rem; color:#374151; margin:0; line-height:1.6; }
    .swap-struct-steps { display:flex; flex-direction:column; gap:.625rem; }
    .swap-struct-step { display:flex; align-items:flex-start; gap:.75rem; }
    .swap-struct-num { width:22px; height:22px; border-radius:50%; background:#0891b2; color:#fff; font-size:.7rem; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:.1rem; }
    .swap-struct-title { display:block; font-size:.8125rem; font-weight:600; color:#0f172a; margin-bottom:.2rem; }
    .swap-struct-desc { display:block; font-size:.75rem; color:#64748b; line-height:1.5; }
    .swap-subjects { display:flex; flex-direction:column; gap:.5rem; }
    .swap-subject-item { display:flex; align-items:center; gap:.875rem; padding:.75rem 1rem; background:#fff; border:1.5px solid #e2e8f0; border-radius:10px; cursor:pointer; transition:border-color .15s; }
    .swap-subject-item:hover { border-color:#0891b2; }
    .swap-subject-line { font-size:.875rem; font-weight:600; color:#0f172a; font-style:italic; flex:1; }
    .swap-subject-why { font-size:.75rem; color:#94a3b8; flex:1; }
    .swap-use-btn { padding:.25rem .625rem; border:1.5px solid rgba(8,145,178,0.25); border-radius:6px; background:rgba(8,145,178,0.06); color:#0891b2; font-size:.75rem; font-weight:600; font-family:inherit; cursor:pointer; white-space:nowrap; transition:all .15s; }
    .swap-use-btn:hover { background:rgba(8,145,178,0.12); border-color:#0891b2; }
    .swap-cadence { display:flex; flex-direction:column; gap:.5rem; }
    .swap-cadence-item { display:flex; align-items:flex-start; gap:.5rem; font-size:.8125rem; color:#374151; line-height:1.5; }
    .swap-relationship { display:flex; align-items:flex-start; gap:.875rem; padding:.875rem 1rem; background:rgba(16,185,129,0.04); border:1.5px solid rgba(16,185,129,0.15); border-radius:10px; }
    .swap-rel-icon { width:32px; height:32px; border-radius:8px; background:rgba(16,185,129,0.1); color:#059669; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .swap-rel-title { display:block; font-size:.875rem; font-weight:700; color:#0f172a; margin-bottom:.3rem; }
    .swap-rel-desc { font-size:.8rem; color:#374151; margin:0; line-height:1.6; }
    .swap-form-grid { display:grid; grid-template-columns:1fr 1fr; gap:.875rem; margin-bottom:.875rem; }
    .form-group { display:flex; flex-direction:column; }
    .form-label { font-size:.8125rem; font-weight:600; color:#374151; margin-bottom:.4rem; }
    .form-input { padding:.625rem .875rem; background:#fff; border:1.5px solid #e2e8f0; border-radius:10px; color:#0f172a; font-size:.875rem; font-family:inherit; outline:none; transition:border-color .15s; }
    .form-input:focus { border-color:#0891b2; }
    .swap-source-note { display:flex; align-items:flex-start; gap:.5rem; padding:.625rem .875rem; background:rgba(16,185,129,0.06); border-radius:8px; font-size:.75rem; color:#374151; line-height:1.5; }
    @media(max-width:900px) { .swap-why-grid,.swap-platforms,.swap-promo-types { grid-template-columns:1fr; } .swap-form-grid { grid-template-columns:1fr; } }
    @media(max-width:600px) { .swap-subject-item { flex-direction:column; align-items:flex-start; } }
  `]
})
export class NewsletterSwapGuidanceComponent {
  @Output() onSubjectSuggestion = new EventEmitter<string>();

  partner = { authorName: '', genre: '', magnetTitle: '', optinLink: '', yourMagnet: '', swapDate: '' };

  readonly whyItWorks = [
    { title: 'Pre-qualified readers', desc: 'They already subscribe to a genre newsletter — they read in your space', bg: 'rgba(8,145,178,0.1)', color: '#0891b2', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>' },
    { title: 'Higher engagement', desc: 'Swap subscribers open more, click more, and stay longer than ad-acquired subscribers', bg: 'rgba(16,185,129,0.1)', color: '#059669', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>' },
    { title: 'Zero ad spend', desc: 'No cost beyond the time it takes to write a genuine recommendation', bg: 'rgba(99,102,241,0.1)', color: '#6366f1', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>' },
  ];

  readonly partnerCriteria = [
    { num: '1', title: 'Genre and Subgenre Alignment', desc: 'The closer your partner\'s genre aligns with yours, the more relevant your readers are to each other. Paranormal romance swapping with paranormal romance outperforms paranormal romance swapping with contemporary romance. Start with genre alignment as your baseline.' },
    { num: '2', title: 'List Size Comparability', desc: 'Swaps work best when both authors deliver roughly comparable value. If your list has 500 subscribers and your partner\'s has 50,000, the exchange is heavily asymmetric. Start by swapping with authors in a similar range to yours.' },
    { num: '3', title: 'Engagement Over Size', desc: 'A well-engaged list of 2,000 subscribers outperforms a disengaged list of 20,000 every single time for swap purposes. An author whose readers open 40% of their emails will deliver you far more active new subscribers than one whose readers have largely tuned out.' },
  ];

  readonly emailStructure = [
    { num: '1', title: 'Open with a genuine, specific recommendation in your own voice', desc: 'Two to three sentences about why you\'re sharing this author and what you love about their work. This is the most important part of the email — it should read like you wrote it, not like it was supplied by your swap partner.' },
    { num: '2', title: 'Introduce the author and the reader magnet or book', desc: 'A sentence or two about who they are and what they write, followed by a brief description of the specific title or magnet you\'re recommending. Let the cover image carry visual weight if you include one.' },
    { num: '3', title: 'Explain the offer clearly', desc: 'If it\'s a reader magnet: "Click the link below to download [Title] for free — all you need to do is sign up for their newsletter." If it\'s a book: "Here\'s the link to grab your copy." Keep the mechanics simple and the friction low.' },
    { num: '4', title: 'Close briefly in your own voice', desc: 'A sentence acknowledging that you hope your readers enjoy the recommendation as much as you have. Then done. Short is better than long — a dedicated recommendation email that runs longer than 300–400 words starts to feel like a sales page for someone else\'s book.' },
  ];

  readonly subjectLines = [
    { line: 'A book I\'ve been recommending to everyone I know', why: 'Positions the recommendation as personal and already proven, not speculative' },
    { line: 'Meet [Author Name]', why: 'Direct and transparent about the intent — readers tend to respect this more than a disguised promotional subject line' },
    { line: 'For [genre] readers: you need to know about [Author Name]', why: 'Genre-specific targeting that signals relevance immediately' },
    { line: 'Something I wanted to share with you this week', why: 'Works for authors whose newsletter tone is already very personal and conversational' },
  ];

  readonly cadenceRules = [
    'Once per month is a reasonable ceiling for dedicated swap emails. More frequent than that and your readers start to feel like they\'re on a list that exists to promote other authors.',
    'Integrated mentions within your regular newsletter — a paragraph recommending a swap partner\'s book within your normal content — can run more frequently without the same erosion risk.',
    'Group promotions through StoryOrigin carry a different reader expectation than a solo swap email and can run somewhat more frequently.',
    'Seasonality matters. A swap that runs during a period when your partner has a promotional push behind them will outperform the same swap running during a quiet month.',
  ];

  selectSubject(line: string) {
    this.onSubjectSuggestion.emit(line);
  }
}
