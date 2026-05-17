import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sc-four-scenarios',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sc-scenarios">
      <h4 class="scs-title">Four Scenarios — Conditional Routing</h4>
      <p class="scs-sub">
        The right email depends on what the reader just finished and what you have available to
        recommend. ScribeCount routes automatically based on purchase history and AuthorVault
        catalog position.
      </p>

      <div class="scs-list">
        <div class="scs-item" *ngFor="let s of scenarios" [class.open]="openId() === s.id">
          <button class="scs-header" (click)="toggle(s.id)">
            <div class="scs-header-left">
              <div class="scs-num" [style.background]="s.color">{{ s.num }}</div>
              <div class="scs-header-info">
                <span class="scs-name">{{ s.name }}</span>
                <span class="scs-trigger">{{ s.trigger }}</span>
              </div>
            </div>
            <svg class="scs-chevron" [class.rotated]="openId() === s.id"
                 viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>

          <div class="scs-body" [class.open]="openId() === s.id">
            <div class="scs-subject">
              <span class="scs-subject-label">Subject line options</span>
              <div class="scs-subject-item" *ngFor="let subj of s.subjects">
                <span class="scs-subject-text">"{{ subj.line }}"</span>
                <span class="scs-subject-why">{{ subj.why }}</span>
              </div>
            </div>
            <div class="scs-approach">
              <span class="scs-approach-label">How to write it</span>
              <p class="scs-approach-body">{{ s.approach }}</p>
            </div>
            <div class="scs-example" *ngIf="s.example">
              <span class="scs-example-label">Example framing</span>
              <span class="scs-example-text">"{{ s.example }}"</span>
            </div>
            <div class="scs-cta-note">
              <svg viewBox="0 0 20 20" fill="#059669" width="11" height="11">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/>
              </svg>
              <span>{{ s.ctaNote }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="scs-routing-note">
        <div class="scs-rn-header">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
          <span>Routing is automatic — based on purchase history + AuthorVault catalog structure</span>
        </div>
        <p>
          A reader who owns all but the final book in a series is identified as a near-completer
          when they make that final purchase. A reader who has never bought any book in a series
          sees the same purchase event but gets routed differently based on their purchase history
          context. The flow responds to what the specific reader has actually read.
        </p>
      </div>
    </div>
  `,
  styles: [`
    .sc-scenarios { margin-bottom: 1.25rem; }
    .scs-title { font-size: .8125rem; font-weight: 700; color: #0f172a; margin: 0 0 .25rem; }
    .scs-sub { font-size: .75rem; color: #64748b; margin: 0 0 .875rem; line-height: 1.5; }

    .scs-list { display: flex; flex-direction: column; gap: .375rem; margin-bottom: .875rem; }
    .scs-item { border: 1.5px solid #e2e8f0; border-radius: 10px; overflow: hidden; }
    .scs-item.open { border-color: #bfdbfe; }

    .scs-header {
      width: 100%; display: flex; align-items: center; justify-content: space-between;
      padding: .75rem .875rem; background: #f8fafc;
      border: none; cursor: pointer; font-family: inherit; transition: background .15s;
    }
    .scs-header:hover { background: #f0f7ff; }
    .scs-item.open .scs-header { background: #eff6ff; border-bottom: 1px solid #e2e8f0; }

    .scs-header-left { display: flex; align-items: center; gap: .625rem; }
    .scs-num {
      width: 22px; height: 22px; border-radius: 50%; flex-shrink: 0;
      color: #fff; font-size: .68rem; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
    }
    .scs-header-info { display: flex; flex-direction: column; gap: .05rem; text-align: left; }
    .scs-name { font-size: .8125rem; font-weight: 600; color: #0f172a; }
    .scs-trigger { font-size: .7rem; color: #94a3b8; }

    .scs-chevron { color: #94a3b8; transition: transform .2s; flex-shrink: 0; }
    .scs-chevron.rotated { transform: rotate(180deg); }

    .scs-body {
      max-height: 0; overflow: hidden;
      transition: max-height .3s cubic-bezier(.4,0,.2,1);
      padding: 0 .875rem;
    }
    .scs-body.open { max-height: 500px; padding: .875rem; }

    .scs-subject { margin-bottom: .75rem; }
    .scs-subject-label { font-size: .65rem; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #3b82f6; display: block; margin-bottom: .375rem; }
    .scs-subject-item { margin-bottom: .375rem; }
    .scs-subject-text { display: block; font-size: .78rem; font-weight: 600; color: #0f172a; font-style: italic; }
    .scs-subject-why { display: block; font-size: .7rem; color: #64748b; margin-top: .1rem; }

    .scs-approach { margin-bottom: .625rem; }
    .scs-approach-label { font-size: .65rem; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #94a3b8; display: block; margin-bottom: .25rem; }
    .scs-approach-body { font-size: .78rem; color: #374151; margin: 0; line-height: 1.55; }

    .scs-example {
      display: flex; flex-direction: column; gap: .15rem;
      padding: .5rem .625rem; background: rgba(99,102,241,0.05);
      border: 1px solid rgba(99,102,241,0.15); border-radius: 7px; margin-bottom: .625rem;
    }
    .scs-example-label { font-size: .62rem; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: #6366f1; }
    .scs-example-text { font-size: .78rem; color: #0f172a; font-style: italic; line-height: 1.5; }

    .scs-cta-note {
      display: flex; align-items: flex-start; gap: .35rem;
      font-size: .72rem; color: #374151; line-height: 1.4;
    }

    .scs-routing-note {
      background: rgba(59,130,246,0.04); border: 1.5px solid rgba(59,130,246,0.15);
      border-radius: 10px; padding: .875rem 1rem;
    }
    .scs-rn-header {
      display: flex; align-items: center; gap: .4rem;
      font-size: .75rem; font-weight: 700; color: #0f172a; margin-bottom: .375rem;
      color: #3b82f6;
    }
    .scs-routing-note p { font-size: .75rem; color: #374151; margin: 0; line-height: 1.55; }
  `]
})
export class ScFourScenariosComponent {
  openId = signal<string | null>('s1');

  toggle(id: string) {
    this.openId.set(this.openId() === id ? null : id);
  }

  scenarios = [
    {
      id: 's1', num: 1, color: '#6366f1',
      name: 'Completed series — more series available',
      trigger: 'Purchased final book + untouched series in catalog',
      subjects: [
        { line: 'So you finished [Series Name]…', why: 'Ellipsis signals continuation. Specific series name tells the reader this email knows something about them.' },
        { line: 'The next chapter in [World Name]', why: 'For world-building-forward fantasy and sci-fi where the world itself is part of the appeal.' },
        { line: '[Character Name] isn\'t quite done with you yet', why: 'For series with a shared character who appears in subsequent books — uses existing attachment as the hook.' },
      ],
      approach: 'Write with maximum specificity to the connection between the two series. If they share a world, name the world and how the new series extends it. If they share a tonal register, name that register. If a character from the completed series makes an appearance in the new one — even briefly — mention it. That connection is your strongest sales argument and belongs in the first paragraph.',
      example: 'If you loved [Series Name] for its [specific quality], [Next Title] is the book I\'d put in your hands next. It has [related quality] and readers who loved [Series] have consistently told me it\'s the one that felt most like coming home.',
      ctaNote: 'One CTA, one link. A first-chapter preview if available. One line of reader praise from someone who made exactly this transition.'
    },
    {
      id: 's2', num: 2, color: '#3b82f6',
      name: 'Completed series — only standalones to offer',
      trigger: 'Purchased final book + only standalones remain in catalog',
      subjects: [
        { line: 'What to read after [Final Title]', why: 'Direct and helpful — positions the email as a service to the reader. High open rates because it answers a question the reader may actually be asking.' },
        { line: 'You finished the series. What now?', why: 'Conversational and slightly conspiratorial — works well for authors with a warm, direct newsletter voice.' },
      ],
      approach: 'Position the standalone as a different kind of excellence — a complete story in one volume, with all the craft they\'ve seen in your series work applied to a different narrative structure. Lead with what\'s most similar: the emotional register, the character complexity, the prose style. The reader who loved your series loved something specific about your writing. Your standalone offers the same thing in a different format.',
      example: 'If what you loved about [Series] was [specific quality], [Standalone Title] delivers that same [quality] in a single complete story — no waiting for the next book.',
      ctaNote: 'One recommendation, one CTA. Don\'t present multiple standalones — choose the best one for this reader and recommend it with conviction.'
    },
    {
      id: 's3', num: 3, color: '#059669',
      name: 'Mid-series book — next book available',
      trigger: 'Purchased non-final book in a series',
      subjects: [
        { line: '[Character Name] isn\'t quite done with you yet', why: 'Uses the reader\'s existing attachment to the character as the hook.' },
        { line: 'Book Three picks up right where that ending left you', why: 'Direct and specific — answers the question the reader is already asking.' },
      ],
      approach: 'Simpler than the series-end variation. A warm, direct recommendation for the next book in the sequence with a brief hook that references where the story left off without spoiling anything for readers who haven\'t finished yet. Timing matters more here — ScribeCount triggers this email a few days after purchase rather than immediately, giving the reader time to actually finish the book before the recommendation arrives.',
      example: 'If you\'ve just finished Book Two — Book Three picks up right where that ending left you.',
      ctaNote: 'Shorter wait period than the series-end scenario. An email suggesting Book Three that lands before the reader has finished Book Two is a spoiler risk and an irrelevant ask.'
    },
    {
      id: 's4', num: 4, color: '#d97706',
      name: 'Final book — catalog exhausted',
      trigger: 'Purchased final book + reader has read everything in catalog',
      subjects: [
        { line: 'You finished the series. What now?', why: 'Honest and direct — sets up the relationship-deepening content that follows.' },
        { line: 'You\'ve read everything. Here\'s what\'s coming next.', why: 'Rewards the reader\'s investment with insider access to what\'s ahead.' },
      ],
      approach: 'No purchase recommendation — relationship deepening instead. Tell the reader what\'s coming (even without a release date). Invite them into your community where you share updates as they happen. Offer something exclusive: a deleted scene from the completed series, a character Q&A, a world-building document that didn\'t make it into the books. Give them a reason to stay engaged and a sense that their patience is being rewarded with access rather than silence.',
      example: 'You\'ve read everything I\'ve published, and I don\'t take that lightly. Here\'s what I\'m working on — and here\'s something I\'ve never shared publicly, just for readers who\'ve been with me from the beginning.',
      ctaNote: 'This is a relationship maintenance email, not a commercial email. The reader who feels connected and informed is significantly more likely to preorder your next book than one who finished your catalog and heard nothing for six months.'
    },
  ];
}
