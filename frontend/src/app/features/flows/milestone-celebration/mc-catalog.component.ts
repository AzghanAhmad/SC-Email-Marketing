import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mc-catalog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mc-catalog">
      <h4 class="mcc-title">Milestone 3: Catalog Reading Milestone</h4>
      <p class="mcc-sub">
        Purchase-triggered via direct store data connected to ScribeCount. Fires when a reader
        crosses a meaningful threshold in your catalog — not date-based.
      </p>

      <div class="mcc-thresholds">
        <h5 class="mcc-section-title">What to celebrate</h5>
        <div class="mcc-threshold" *ngFor="let t of thresholds">
          <span class="mcc-threshold-name">{{ t.name }}</span>
          <span class="mcc-threshold-note">{{ t.note }}</span>
        </div>
      </div>

      <div class="mcc-example">
        <span class="mcc-ex-label">Example opening</span>
        <span class="mcc-ex-text">"You've just picked up your fifth book from me, and I want to take a moment to acknowledge that."</span>
      </div>

      <div class="mcc-community">
        <h5 class="mcc-section-title">Deeper community invitation</h5>
        <p>A reader who has bought five of your books is a genuine fan — the right candidate for reader group invitation, early access to your next project, or a personal note acknowledging loyalty you genuinely depend on.</p>
      </div>

      <p class="mcc-series-note">
        Series completion is handled by the Series Completion flow (Article 14). A catalog milestone
        email can complement it a few days later with a different tone — focused on the reader's
        overall journey rather than what to read next.
      </p>
    </div>
  `,
  styles: [`
    .mc-catalog { margin-bottom: 1.25rem; }
    .mcc-title { font-size: .8125rem; font-weight: 700; color: #0f172a; margin: 0 0 .25rem; }
    .mcc-sub { font-size: .75rem; color: #64748b; margin: 0 0 .75rem; line-height: 1.55; }

    .mcc-thresholds { margin-bottom: .75rem; }
    .mcc-section-title { font-size: .72rem; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #94a3b8; margin: 0 0 .4rem; }
    .mcc-threshold {
      display: flex; flex-direction: column; gap: .1rem;
      padding: .5rem .625rem; margin-bottom: .35rem;
      background: #f8fafc; border-radius: 7px; border: 1px solid #f1f5f9;
    }
    .mcc-threshold-name { font-size: .75rem; font-weight: 600; color: #0f172a; }
    .mcc-threshold-note { font-size: .7rem; color: #64748b; line-height: 1.4; }

    .mcc-example {
      display: flex; flex-direction: column; gap: .15rem; margin-bottom: .75rem;
      padding: .5rem .625rem; background: rgba(217,119,6,0.05); border-radius: 7px;
    }
    .mcc-ex-label { font-size: .62rem; font-weight: 700; text-transform: uppercase; color: #d97706; }
    .mcc-ex-text { font-size: .75rem; color: #0f172a; font-style: italic; line-height: 1.5; }

    .mcc-community {
      padding: .75rem; background: #fffbeb; border: 1.5px solid #fde68a;
      border-radius: 9px; margin-bottom: .5rem;
    }
    .mcc-community p { font-size: .72rem; color: #374151; margin: .35rem 0 0; line-height: 1.55; }
    .mcc-series-note { font-size: .72rem; color: #64748b; margin: 0; line-height: 1.45; font-style: italic; }
  `]
})
export class McCatalogComponent {
  thresholds = [
    { name: 'First purchase', note: 'Handled by Post-Purchase Thank You flow — the entry milestone.' },
    { name: 'Third or fifth purchase', note: 'Transition from "tried your books" to "keeps coming back" — most worth celebrating specifically.' },
    { name: 'Series completion', note: 'Complement to Series Completion flow with journey-focused tone.' },
    { name: 'Catalog completion', note: 'Rare but significant — every available book purchased. Most personal acknowledgment you can write.' },
  ];
}
