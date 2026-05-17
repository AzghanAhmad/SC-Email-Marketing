import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post-purchase-review-request',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="rr-panel">
      <div class="rr-header">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
        <span class="rr-title">Review Request — Why a Dedicated Flow Works</span>
      </div>
      <p class="rr-desc">
        A review request email that exists only to ask for a review is paradoxically more effective
        than one that buries the ask inside a longer email with multiple purposes. A reader who opens
        an email and immediately understands its one job can make a fast, clear decision.
      </p>

      <div class="rr-comparison">
        <div class="rr-col bad">
          <div class="rr-col-label bad-label">
            <svg viewBox="0 0 20 20" fill="#dc2626" width="12" height="12">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd"/>
            </svg>
            Buried inside follow-up
          </div>
          <p>Reader has to mentally reprioritize to find the review ask inside an email about something else. Good intentions evaporate.</p>
        </div>
        <div class="rr-col good">
          <div class="rr-col-label good-label">
            <svg viewBox="0 0 20 20" fill="#059669" width="12" height="12">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/>
            </svg>
            Dedicated review request
          </div>
          <p>One job, one link. Readers who finished open immediately. Readers who haven't make a mental note. Neither group feels misled.</p>
        </div>
      </div>

      <div class="rr-rules">
        <h5 class="rr-rules-title">Rules for the Review Request</h5>
        <div class="rr-rule">
          <svg viewBox="0 0 20 20" fill="#059669" width="12" height="12">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/>
          </svg>
          <span>Link directly to the review submission page — not the product page. Every extra click is a review you lose.</span>
        </div>
        <div class="rr-rule">
          <svg viewBox="0 0 20 20" fill="#059669" width="12" height="12">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/>
          </svg>
          <span>Label each link clearly by platform name. Store review URLs in ScribeCount's link management for each title.</span>
        </div>
        <div class="rr-rule">
          <svg viewBox="0 0 20 20" fill="#dc2626" width="12" height="12">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd"/>
          </svg>
          <span>Do not ask for a five-star review — explicitly or implicitly. Retail platforms prohibit it and readers can tell when they're being steered.</span>
        </div>
        <div class="rr-rule">
          <svg viewBox="0 0 20 20" fill="#dc2626" width="12" height="12">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd"/>
          </svg>
          <span>Send only one review request per title. A second request is unlikely to change anything and is likely to irritate.</span>
        </div>
      </div>

      <div class="rr-subject-examples">
        <h5 class="rr-rules-title">Subject Lines That Work</h5>
        <div class="rr-subject-item">
          <span class="rr-subject-line">"One quick thing, if you've had a chance to read [Title]"</span>
          <span class="rr-subject-why">Sets clear expectations — readers who finished open immediately</span>
        </div>
        <div class="rr-subject-item">
          <span class="rr-subject-line">"Did you love [Title]? Here's where to say so"</span>
          <span class="rr-subject-why">Direct and honest — readers who haven't finished make a mental note</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .rr-panel {
      background: #f8fafc; border: 1.5px solid #f1f5f9;
      border-radius: 12px; padding: 1.125rem; margin-bottom: 1.25rem;
    }
    .rr-header {
      display: flex; align-items: center; gap: .5rem; margin-bottom: .5rem; color: #d97706;
    }
    .rr-title { font-size: .8125rem; font-weight: 700; color: #0f172a; }
    .rr-desc { font-size: .78rem; color: #64748b; margin: 0 0 .875rem; line-height: 1.55; }

    .rr-comparison {
      display: grid; grid-template-columns: 1fr 1fr; gap: .625rem; margin-bottom: .875rem;
    }
    .rr-col { padding: .75rem; border-radius: 8px; font-size: .75rem; color: #374151; line-height: 1.5; }
    .rr-col p { margin: 0; }
    .rr-col.bad { background: rgba(239,68,68,0.05); border: 1px solid rgba(239,68,68,0.15); }
    .rr-col.good { background: rgba(16,185,129,0.05); border: 1px solid rgba(16,185,129,0.15); }
    .rr-col-label {
      display: flex; align-items: center; gap: .35rem;
      font-size: .72rem; font-weight: 700; margin-bottom: .375rem;
    }
    .bad-label { color: #dc2626; }
    .good-label { color: #059669; }

    .rr-rules { margin-bottom: .875rem; }
    .rr-rules-title { font-size: .72rem; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #94a3b8; margin: 0 0 .5rem; }
    .rr-rule {
      display: flex; align-items: flex-start; gap: .4rem;
      font-size: .75rem; color: #374151; line-height: 1.45; margin-bottom: .35rem;
    }
    .rr-rule:last-child { margin-bottom: 0; }

    .rr-subject-examples { }
    .rr-subject-item {
      padding: .5rem .625rem; background: #fff;
      border: 1px solid #e2e8f0; border-radius: 7px; margin-bottom: .35rem;
    }
    .rr-subject-item:last-child { margin-bottom: 0; }
    .rr-subject-line { display: block; font-size: .78rem; font-weight: 600; color: #0f172a; font-style: italic; margin-bottom: .15rem; }
    .rr-subject-why { display: block; font-size: .72rem; color: #64748b; }
  `]
})
export class PostPurchaseReviewRequestComponent {}
