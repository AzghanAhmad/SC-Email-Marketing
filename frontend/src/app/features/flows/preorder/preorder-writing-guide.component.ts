import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

type WriteTab = 'confirmation' | 'nurture' | 'fulfillment';

@Component({
  selector: 'app-preorder-writing-guide',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="po-write">
      <h4 class="pw-title">Writing Guide — All Three Phases</h4>

      <div class="pw-tabs">
        <button class="pw-tab" [class.active]="tab() === 'confirmation'" (click)="tab.set('confirmation')">Confirmation</button>
        <button class="pw-tab" [class.active]="tab() === 'nurture'" (click)="tab.set('nurture')">Nurture Sequence</button>
        <button class="pw-tab" [class.active]="tab() === 'fulfillment'" (click)="tab.set('fulfillment')">Fulfillment</button>
      </div>

      <!-- CONFIRMATION -->
      <div *ngIf="tab() === 'confirmation'">
        <div class="pw-email-block">
          <div class="pw-email-header">
            <span class="pw-email-badge">Phase 1</span>
            <span class="pw-email-timing">Fires within seconds of preorder</span>
          </div>

          <div class="pw-subject-row">
            <span class="pw-subject-label">Subject options</span>
            <div class="pw-subject-item">"Your preorder for [Title] is confirmed"
              <span class="pw-subject-note">Clear and specific — leads with the book title</span>
            </div>
            <div class="pw-subject-item">"[Title] is reserved for you — here's what to expect"
              <span class="pw-subject-note">Forward-looking — signals there's more than just a receipt inside</span>
            </div>
          </div>

          <div class="pw-checklist">
            <div class="pw-check-item">
              <svg viewBox="0 0 20 20" fill="#059669" width="12" height="12"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
              <div>
                <span class="pw-check-title">Confirm transaction details and release date</span>
                <span class="pw-check-desc">Title, format, release date — the functional receipt job done cleanly</span>
              </div>
            </div>
            <div class="pw-check-item">
              <svg viewBox="0 0 20 20" fill="#059669" width="12" height="12"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
              <div>
                <span class="pw-check-title">Clarify billing timing explicitly</span>
                <span class="pw-check-desc">"Your card will be charged on [release date], when the book is delivered to you." One clear sentence eliminates the uncertainty many readers have about preorder billing.</span>
              </div>
            </div>
            <div class="pw-check-item">
              <svg viewBox="0 0 20 20" fill="#059669" width="12" height="12"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
              <div>
                <span class="pw-check-title">Acknowledge what the reader did</span>
                <span class="pw-check-desc">"You preordered before anyone else has had a chance to read this, and that genuinely means something to me." Names the advance commitment — transforms the receipt into the opening of a personal correspondence.</span>
              </div>
            </div>
            <div class="pw-check-item">
              <svg viewBox="0 0 20 20" fill="#059669" width="12" height="12"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
              <div>
                <span class="pw-check-title">Brief specific tease of what's coming</span>
                <span class="pw-check-desc">Something not in the official blurb — a detail about the story you're particularly excited about. Begins building anticipation from the first email.</span>
              </div>
            </div>
            <div class="pw-check-item">
              <svg viewBox="0 0 20 20" fill="#059669" width="12" height="12"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
              <div>
                <span class="pw-check-title">Set expectations for what comes next</span>
                <span class="pw-check-desc">"I'll be in touch as we get closer to the release — preorder readers hear from me before anyone else does." Creates a sense of insider access that makes nurture emails feel like a privilege, not a marketing sequence.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- NURTURE -->
      <div *ngIf="tab() === 'nurture'">
        <div class="pw-nurture-intro">
          <p>
            Most authors send a preorder confirmation and then nothing until launch day. That silence
            is a missed opportunity. Preorder readers are your most receptive audience during the
            entire preorder window — they've committed, they're interested, they want to be excited.
          </p>
          <p>
            The right number of nurture emails depends on your preorder window length. Preorder readers
            should hear from you at least once a month during the window, and more frequently in the
            final weeks as excitement builds.
          </p>
        </div>

        <div class="pw-nurture-emails">
          <div class="pw-nurture-email" *ngFor="let email of nurtureEmails">
            <div class="pw-ne-header">
              <div class="pw-ne-dot" [style.background]="email.color"></div>
              <div class="pw-ne-info">
                <span class="pw-ne-name">{{ email.name }}</span>
                <span class="pw-ne-timing">{{ email.timing }}</span>
              </div>
            </div>
            <p class="pw-ne-desc">{{ email.desc }}</p>
            <div class="pw-ne-subject">
              <span class="pw-ne-subject-label">Subject example</span>
              <span class="pw-ne-subject-text">"{{ email.subject }}"</span>
            </div>
            <div class="pw-ne-tip" *ngIf="email.tip">
              <svg viewBox="0 0 20 20" fill="#3b82f6" width="11" height="11"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd"/></svg>
              <span>{{ email.tip }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- FULFILLMENT -->
      <div *ngIf="tab() === 'fulfillment'">
        <div class="pw-email-block">
          <div class="pw-email-header">
            <span class="pw-email-badge fulfillment">Phase 3</span>
            <span class="pw-email-timing">Release day — before general public</span>
          </div>

          <div class="pw-fulfillment-tone">
            <div class="pw-ft-header">
              <svg viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2" width="13" height="13">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              <span class="pw-ft-title">Celebration first — not transaction</span>
            </div>
            <div class="pw-ft-compare">
              <div class="pw-ft-bad">
                <div class="pw-ft-bad-label">❌ Technically functional</div>
                <p>"Your download link is below."</p>
              </div>
              <div class="pw-ft-good">
                <div class="pw-ft-good-label">✓ An experience</div>
                <p>"It's here. After everything we've been building toward, [Title] is finally in your hands."</p>
              </div>
            </div>
            <p class="pw-ft-note">The download link is in both emails. The emotional difference between the two is significant.</p>
          </div>

          <div class="pw-checklist">
            <div class="pw-check-item">
              <svg viewBox="0 0 20 20" fill="#059669" width="12" height="12"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
              <div>
                <span class="pw-check-title">Download link — clearly labeled, prominently placed</span>
                <span class="pw-check-desc">After the celebratory opening. For BookFunnel authors: the BookFunnel download link as primary CTA. For direct delivery: generated automatically by ScribeCount.</span>
              </div>
            </div>
            <div class="pw-check-item">
              <svg viewBox="0 0 20 20" fill="#059669" width="12" height="12"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
              <div>
                <span class="pw-check-title">Acknowledge the reader's role in the launch</span>
                <span class="pw-check-desc">"You preordered this book before the reviews were in, before the launch buzz built up, on the basis of trust alone. That matters more than you probably know. You're part of how this book lands in the world."</span>
              </div>
            </div>
            <div class="pw-check-item">
              <svg viewBox="0 0 20 20" fill="#059669" width="12" height="12"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
              <div>
                <span class="pw-check-title">Plant the review seed — gently</span>
                <span class="pw-check-desc">"If you love it, I'd be so grateful for a review when you're done — I'll follow up with a link in a few days." Primes the reader for the review request that follows and frames it as a natural part of the relationship.</span>
              </div>
            </div>
          </div>

          <div class="pw-suppression-note">
            <div class="pw-sn-header">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13">
                <circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
              </svg>
              <span class="pw-sn-title">Suppression from launch broadcast — automatic</span>
            </div>
            <p class="pw-sn-desc">
              Preorder readers are tagged at the confirmation stage. ScribeCount applies suppression
              to the launch day campaign automatically when the campaign is configured correctly.
              Sending them the general launch announcement as if they're discovering the book for the
              first time creates a disconnect between the personal insider relationship your preorder
              flow has been building and the broad-audience energy of the launch broadcast.
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .po-write { margin-bottom: 1.25rem; }
    .pw-title { font-size: .8125rem; font-weight: 700; color: #0f172a; margin: 0 0 .75rem; }

    .pw-tabs {
      display: flex; gap: .25rem; background: #f1f5f9;
      border-radius: 10px; padding: .2rem; margin-bottom: .875rem;
    }
    .pw-tab {
      flex: 1; padding: .4rem .5rem; border-radius: 8px; border: none;
      background: transparent; color: #64748b; font-size: .72rem; font-weight: 500;
      font-family: inherit; cursor: pointer; transition: all .15s; white-space: nowrap;
    }
    .pw-tab:hover { color: #0f172a; }
    .pw-tab.active { background: #fff; color: #0f172a; font-weight: 600; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }

    .pw-email-block { border: 1.5px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
    .pw-email-header {
      display: flex; align-items: center; gap: .75rem;
      padding: .625rem .875rem; background: #f8fafc; border-bottom: 1px solid #f1f5f9;
    }
    .pw-email-badge {
      font-size: .68rem; font-weight: 700; padding: .15rem .5rem;
      background: #6366f1; color: #fff; border-radius: 100px;
    }
    .pw-email-badge.fulfillment { background: #059669; }
    .pw-email-timing { font-size: .72rem; color: #64748b; font-style: italic; }

    .pw-subject-row { padding: .75rem .875rem; border-bottom: 1px solid #f1f5f9; }
    .pw-subject-label { font-size: .65rem; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #3b82f6; display: block; margin-bottom: .375rem; }
    .pw-subject-item { font-size: .78rem; color: #0f172a; font-style: italic; font-weight: 600; margin-bottom: .375rem; }
    .pw-subject-note { display: block; font-size: .7rem; color: #64748b; font-style: normal; font-weight: 400; margin-top: .1rem; }

    .pw-checklist { padding: .75rem .875rem; display: flex; flex-direction: column; gap: .625rem; }
    .pw-check-item { display: flex; align-items: flex-start; gap: .5rem; }
    .pw-check-title { display: block; font-size: .78rem; font-weight: 600; color: #0f172a; margin-bottom: .15rem; }
    .pw-check-desc { display: block; font-size: .72rem; color: #64748b; line-height: 1.45; }

    /* Nurture */
    .pw-nurture-intro { margin-bottom: .875rem; }
    .pw-nurture-intro p { font-size: .78rem; color: #374151; margin: 0 0 .5rem; line-height: 1.55; }
    .pw-nurture-intro p:last-child { margin-bottom: 0; }

    .pw-nurture-emails { display: flex; flex-direction: column; gap: .625rem; }
    .pw-nurture-email {
      border: 1.5px solid #e2e8f0; border-radius: 10px; padding: .75rem .875rem;
    }
    .pw-ne-header { display: flex; align-items: center; gap: .625rem; margin-bottom: .375rem; }
    .pw-ne-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
    .pw-ne-info { display: flex; flex-direction: column; gap: .05rem; }
    .pw-ne-name { font-size: .8125rem; font-weight: 700; color: #0f172a; }
    .pw-ne-timing { font-size: .7rem; color: #94a3b8; font-style: italic; }
    .pw-ne-desc { font-size: .75rem; color: #374151; margin: 0 0 .5rem; line-height: 1.5; }
    .pw-ne-subject {
      display: flex; flex-direction: column; gap: .15rem;
      padding: .4rem .625rem; background: rgba(59,130,246,0.04);
      border-radius: 7px; margin-bottom: .375rem;
    }
    .pw-ne-subject-label { font-size: .62rem; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: #3b82f6; }
    .pw-ne-subject-text { font-size: .75rem; color: #0f172a; font-style: italic; }
    .pw-ne-tip {
      display: flex; align-items: flex-start; gap: .35rem;
      font-size: .72rem; color: #374151; line-height: 1.4;
    }

    /* Fulfillment */
    .pw-fulfillment-tone {
      padding: .75rem .875rem; border-bottom: 1px solid #f1f5f9;
    }
    .pw-ft-header { display: flex; align-items: center; gap: .4rem; margin-bottom: .5rem; }
    .pw-ft-title { font-size: .78rem; font-weight: 700; color: #0f172a; }
    .pw-ft-compare { display: grid; grid-template-columns: 1fr 1fr; gap: .5rem; margin-bottom: .5rem; }
    .pw-ft-bad, .pw-ft-good { padding: .625rem .75rem; border-radius: 8px; font-size: .75rem; color: #374151; }
    .pw-ft-bad { background: rgba(239,68,68,0.05); border: 1px solid rgba(239,68,68,0.15); }
    .pw-ft-good { background: rgba(16,185,129,0.05); border: 1px solid rgba(16,185,129,0.15); }
    .pw-ft-bad p, .pw-ft-good p { margin: 0; font-style: italic; }
    .pw-ft-bad-label { font-size: .68rem; font-weight: 700; color: #dc2626; margin-bottom: .25rem; }
    .pw-ft-good-label { font-size: .68rem; font-weight: 700; color: #059669; margin-bottom: .25rem; }
    .pw-ft-note { font-size: .72rem; color: #64748b; margin: 0; }

    .pw-suppression-note {
      padding: .75rem .875rem; background: rgba(239,68,68,0.03);
      border-top: 1px solid rgba(239,68,68,0.1);
    }
    .pw-sn-header { display: flex; align-items: center; gap: .4rem; margin-bottom: .375rem; color: #dc2626; }
    .pw-sn-title { font-size: .75rem; font-weight: 700; color: #0f172a; }
    .pw-sn-desc { font-size: .72rem; color: #374151; margin: 0; line-height: 1.55; }

    @media (max-width: 500px) { .pw-ft-compare { grid-template-columns: 1fr; } }
  `]
})
export class PreorderWritingGuideComponent {
  tab = signal<WriteTab>('confirmation');

  nurtureEmails = [
    {
      name: 'Behind the Scenes',
      timing: '~7 weeks before release',
      color: '#6366f1',
      desc: 'Exclusive to preorder readers — exists nowhere else in your marketing. Personal note about writing the book: what surprised you, what challenged you, what you\'re most proud of. The anecdote you haven\'t shared anywhere else. The character decision that changed everything. Write it like a letter to a reader friend who asked what it was really like.',
      subject: 'What it was really like to write [Title]',
      tip: 'Its exclusivity is part of its value. A reader who knows they\'re receiving something the general public isn\'t seeing feels rewarded for their advance commitment in a way that a purely informational email never could accomplish.'
    },
    {
      name: 'First Chapter or Excerpt',
      timing: '~4 weeks before release',
      color: '#3b82f6',
      desc: 'A reward and a commitment-reinforcement device. A reader who reads your first chapter and finds it as good as they hoped will be more impatient for release day, not less. Their anticipation intensifies. Their confidence in the purchase strengthens.',
      subject: 'An early chapter, just for you',
      tip: 'Not comfortable sharing chapters before the book is finalized? Share a scene from a previous book with thematic or emotional resonance — something that gets the reader into the right emotional register for what\'s coming.'
    },
    {
      name: 'Cover Story',
      timing: '~2 weeks before release',
      color: '#8b5cf6',
      desc: 'The story behind the cover — the brief, the design process, the element that nearly didn\'t make it in, the detail you love that most readers won\'t notice on first look. Transforms a cover image from a design asset into a shared experience.',
      subject: 'The story behind the cover of [Title]',
      tip: 'Works particularly well midway through the preorder window, when the initial excitement of the confirmation has settled and the release day is still a distance away.'
    },
    {
      name: 'Countdown',
      timing: '1 week before release',
      color: '#059669',
      desc: 'Brief and energetic. Release date now presented as imminent rather than distant. One or two lines capturing your excitement about readers finally getting to read the book. Note that the fulfillment email is coming soon.',
      subject: 'One week away — [Title] is almost here',
      tip: 'Think of this as the drumroll before the payoff. Its job is to make the fulfillment email land with the most emotional impact possible.'
    },
  ];
}
