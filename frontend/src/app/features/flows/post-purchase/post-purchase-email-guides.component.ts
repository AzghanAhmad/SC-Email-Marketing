import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface EmailGuide {
  id: string;
  num: number;
  name: string;
  timing: string;
  subjectExample: string;
  mustInclude: string[];
  tone: string;
  watchOut: string;
}

@Component({
  selector: 'app-post-purchase-email-guides',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="email-guides">
      <h4 class="eg-title">Email-by-Email Writing Guide</h4>
      <p class="eg-sub">Click any email to expand its guidance.</p>

      <div class="eg-accordion">
        <div class="eg-item" *ngFor="let guide of guides">
          <button class="eg-header" (click)="toggle(guide.id)" [class.open]="openId() === guide.id">
            <div class="eg-header-left">
              <span class="eg-num">{{ guide.num }}</span>
              <div class="eg-header-info">
                <span class="eg-name">{{ guide.name }}</span>
                <span class="eg-timing">{{ guide.timing }}</span>
              </div>
            </div>
            <svg class="eg-chevron" [class.rotated]="openId() === guide.id"
                 viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>

          <div class="eg-body" [class.open]="openId() === guide.id">
            <!-- Subject example -->
            <div class="eg-subject">
              <span class="eg-subject-label">Subject example</span>
              <span class="eg-subject-text">"{{ guide.subjectExample }}"</span>
            </div>

            <!-- Must include -->
            <div class="eg-section">
              <span class="eg-section-label">Must include</span>
              <div class="eg-checklist">
                <div class="eg-check-item" *ngFor="let item of guide.mustInclude">
                  <svg viewBox="0 0 20 20" fill="#059669" width="13" height="13">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/>
                  </svg>
                  <span>{{ item }}</span>
                </div>
              </div>
            </div>

            <!-- Tone -->
            <div class="eg-tone">
              <svg viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" width="13" height="13">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              <span class="eg-tone-label">Tone:</span>
              <span class="eg-tone-text">{{ guide.tone }}</span>
            </div>

            <!-- Watch out -->
            <div class="eg-watchout">
              <svg viewBox="0 0 20 20" fill="#d97706" width="13" height="13">
                <path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/>
              </svg>
              <span class="eg-watchout-text">{{ guide.watchOut }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .email-guides { margin-bottom: 1.25rem; }
    .eg-title { font-size: .8125rem; font-weight: 700; color: #0f172a; margin: 0 0 .25rem; }
    .eg-sub { font-size: .75rem; color: #94a3b8; margin: 0 0 .875rem; }

    .eg-accordion { display: flex; flex-direction: column; gap: .375rem; }
    .eg-item { border: 1.5px solid #e2e8f0; border-radius: 10px; overflow: hidden; }

    .eg-header {
      width: 100%; display: flex; align-items: center; justify-content: space-between;
      padding: .75rem .875rem; background: #f8fafc;
      border: none; cursor: pointer; font-family: inherit;
      transition: background .15s;
    }
    .eg-header:hover { background: #f0f7ff; }
    .eg-header.open { background: #eff6ff; border-bottom: 1px solid #e2e8f0; }

    .eg-header-left { display: flex; align-items: center; gap: .625rem; }
    .eg-num {
      width: 20px; height: 20px; border-radius: 50%;
      background: #1e3a5f; color: #fff;
      font-size: .65rem; font-weight: 700;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .eg-header-info { display: flex; flex-direction: column; gap: .1rem; text-align: left; }
    .eg-name { font-size: .8125rem; font-weight: 600; color: #0f172a; }
    .eg-timing { font-size: .7rem; color: #94a3b8; }

    .eg-chevron { color: #94a3b8; transition: transform .2s; flex-shrink: 0; }
    .eg-chevron.rotated { transform: rotate(180deg); }

    .eg-body {
      max-height: 0; overflow: hidden;
      transition: max-height .3s cubic-bezier(.4,0,.2,1);
      padding: 0 .875rem;
    }
    .eg-body.open { max-height: 600px; padding: .875rem; }

    .eg-subject {
      display: flex; flex-direction: column; gap: .2rem;
      padding: .625rem .75rem; background: rgba(59,130,246,0.06);
      border: 1px solid rgba(59,130,246,0.15); border-radius: 8px;
      margin-bottom: .75rem;
    }
    .eg-subject-label { font-size: .65rem; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #3b82f6; }
    .eg-subject-text { font-size: .8125rem; color: #0f172a; font-style: italic; }

    .eg-section { margin-bottom: .75rem; }
    .eg-section-label { font-size: .7rem; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #94a3b8; display: block; margin-bottom: .4rem; }
    .eg-checklist { display: flex; flex-direction: column; gap: .35rem; }
    .eg-check-item { display: flex; align-items: flex-start; gap: .4rem; font-size: .78rem; color: #374151; line-height: 1.45; }

    .eg-tone {
      display: flex; align-items: flex-start; gap: .4rem;
      font-size: .78rem; color: #374151; margin-bottom: .625rem;
      padding: .5rem .625rem; background: rgba(99,102,241,0.06);
      border-radius: 7px; line-height: 1.45;
    }
    .eg-tone-label { font-weight: 700; color: #6366f1; flex-shrink: 0; }
    .eg-tone-text { color: #374151; }

    .eg-watchout {
      display: flex; align-items: flex-start; gap: .4rem;
      font-size: .75rem; color: #78350f; line-height: 1.45;
      padding: .5rem .625rem; background: rgba(245,158,11,0.06);
      border-radius: 7px;
    }
    .eg-watchout-text { flex: 1; }
  `]
})
export class PostPurchaseEmailGuidesComponent {
  openId = signal<string | null>(null);

  toggle(id: string) {
    this.openId.set(this.openId() === id ? null : id);
  }

  guides: EmailGuide[] = [
    {
      id: 'order-confirmation',
      num: 1,
      name: 'Order Confirmation',
      timing: 'Within seconds of purchase',
      subjectExample: 'Your order is confirmed',
      mustInclude: [
        'Clear summary: title, format, and price paid',
        'Confirmation that the transaction was successful',
        'What happens next — reference to the delivery email arriving',
        'One or two sentences in your authentic voice',
      ],
      tone: 'Professional but warm. Most formal email in the sequence — but "formal" means clear and reliable, not cold or corporate. Your brand voice should be present from the first sentence.',
      watchOut: 'Don\'t use a cold e-commerce receipt template. A reader who just bought a cozy mystery doesn\'t need a standard receipt — they need a confirmation that feels like it came from the author who wrote the book.',
    },
    {
      id: 'digital-delivery',
      num: 2,
      name: 'Digital Delivery',
      timing: 'Alongside or immediately after confirmation',
      subjectExample: 'Your book is ready to read',
      mustInclude: [
        'Download link or access button — goes FIRST, before anything else',
        'Brief instructions for different reading devices (Kindle, Kobo, phone)',
        'Link to a help page or BookFunnel landing page if using BookFunnel',
        'Offer to help with technical issues via reply',
      ],
      tone: 'Functional first, then warm. The reader bought a book — give them the book. Everything else comes after the download link.',
      watchOut: 'Don\'t bury the download link. A reader who paid for a book and can\'t figure out how to open it will ask for a refund or leave a frustrated review. The offer to help via reply prevents both.',
    },
    {
      id: 'thank-you',
      num: 3,
      name: 'Post-Purchase Thank You',
      timing: 'Immediately after confirmation (first-time buyers only)',
      subjectExample: 'Thank you — and a little something extra',
      mustInclude: [
        'Genuine appreciation in your own voice — not boilerplate',
        'A personal angle on the book only the author could offer',
        'One soft next step: reader group invite, follow suggestion, or series mention',
        'For series books: acknowledge which book they bought and what they\'ve read to get there',
      ],
      tone: 'Warm, specific, personal. This email reveals whether you treat readers as individuals or as revenue events. Write like a human to a human.',
      watchOut: '"Thank you for your recent purchase" is the opening of an automated receipt, not a letter from an author. Don\'t immediately show more things to buy — the reader just bought something. One soft invitation, not a pitch.',
    },
    {
      id: 'follow-up',
      num: 4,
      name: 'Post-Purchase Follow-Up',
      timing: '3–5 days after purchase',
      subjectExample: 'How are you getting on with [Title]?',
      mustInclude: [
        'Open with curiosity — a question or personal note about the book before the ask',
        'Review invitation: honest, personal framing — not a demand or guilt trip',
        'Direct link to the review submission page (not the product page)',
        'Brief next-book suggestion as a secondary element — clearly lower in visual hierarchy',
      ],
      tone: 'Interested, not transactional. Lead with genuine curiosity about how the reader is experiencing the book. The warm-up is not manipulation — it\'s the natural structure of human communication.',
      watchOut: 'Don\'t ask for a review the same day as the purchase. Don\'t wait two weeks — the emotional peak fades. 3–5 days is the window where most readers have made enough progress to form a genuine opinion.',
    },
    {
      id: 'review-request',
      num: 5,
      name: 'Review Request',
      timing: '4–7 days after purchase (shorter reads: 4 days; novels: 6–7)',
      subjectExample: 'One quick thing, if you\'ve had a chance to read [Title]',
      mustInclude: [
        'Single focused ask — this email has one job',
        'Personal, genuine framing: honest curiosity about the reader\'s experience',
        'Direct links to review submission pages on each platform — labeled by platform name',
        'No ask for a five-star review — explicit or implicit',
      ],
      tone: 'Personal and effortless. A reader who opens an email and immediately understands its one job can make a fast, clear decision. Readers who finished and want to leave a review open immediately.',
      watchOut: 'Do not send more than one review request per title. Do not ask for a five-star review — retail platforms prohibit it and readers can tell when they\'re being steered. The goal exit fires when a reader clicks the review link.',
    },
    {
      id: 'repeat-thank-you',
      num: 6,
      name: 'Repeat Purchase Thank You',
      timing: 'Fires instead of standard thank you for returning buyers',
      subjectExample: 'You came back. That genuinely means a lot.',
      mustInclude: [
        'Acknowledge the return directly — in a genuine, personal way, not a loyalty program announcement',
        'Something that rewards the loyalty: early access, community invite, or what\'s coming next',
        'Deeper introduction to your author world — a first-time buyer wasn\'t ready for this',
        'For multi-series catalogs: different message for same-series vs. new-series return',
      ],
      tone: 'Warmer, more personal, and more explicitly grateful than the first-time thank you. This reader has moved past the try-it stage. They know what they\'re getting from you and chose to get more of it.',
      watchOut: '"You\'re a valued returning customer!" is the wrong tone entirely. Write it the way an author would acknowledge a reader who showed up again — genuine, specific, not a customer loyalty program announcement.',
    },
  ];
}
