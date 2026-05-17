import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ac-requirements',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ac-reqs">
      <h4 class="acr-title">What These Flows Require to Work</h4>
      <p class="acr-sub">
        Abandoned cart and checkout flows are not available to every author email program.
        Three things must be in place.
      </p>

      <div class="acr-list">

        <div class="acr-item">
          <div class="acr-item-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
          </div>
          <div class="acr-item-body">
            <div class="acr-item-title">A direct store</div>
            <p class="acr-item-desc">
              These flows work on your direct sales store — a store you own and operate on your own
              domain or platform. They cannot reach readers who abandon carts on Amazon, Kobo, Apple
              Books, or any other retail platform, because those platforms don't share customer or
              behavioral data with author email systems.
            </p>
            <div class="acr-item-note">
              ScribeCount's real-time event connection means cart and checkout abandonment events are
              transmitted to your email system the moment they're detected — not on a scheduled sync.
              This is what makes the tight timing windows achievable.
            </div>
          </div>
        </div>

        <div class="acr-item">
          <div class="acr-item-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>
          <div class="acr-item-body">
            <div class="acr-item-title">Subscriber email addresses</div>
            <p class="acr-item-desc">
              These flows can only reach readers who are already subscribers on your email list, or
              who entered their email address during the checkout process before abandoning. A reader
              who browsed your store and left without providing any contact information cannot be reached.
            </p>
            <div class="acr-item-note">
              This is why building your subscriber list and encouraging readers to create accounts or
              check out as subscribers — rather than as guests with no email capture — directly increases
              the percentage of abandoned carts and checkouts you can recover.
            </div>
          </div>
        </div>

        <div class="acr-item">
          <div class="acr-item-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
          </div>
          <div class="acr-item-body">
            <div class="acr-item-title">Store platform compatibility</div>
            <p class="acr-item-desc">
              ScribeCount Email connects to direct store platforms through the same real-time webhook
              system that powers the post-purchase flows. Your store platform needs to support the
              abandonment event webhooks that trigger these flows.
            </p>
            <div class="acr-item-note">
              If you're choosing a direct store platform and recovery flows are a priority, confirm
              webhook compatibility before you build your store. ScribeCount's setup documentation
              covers which platforms are supported.
            </div>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .ac-reqs { margin-bottom: 1.25rem; }
    .acr-title { font-size: .8125rem; font-weight: 700; color: #0f172a; margin: 0 0 .25rem; }
    .acr-sub { font-size: .75rem; color: #64748b; margin: 0 0 .875rem; line-height: 1.5; }

    .acr-list { display: flex; flex-direction: column; gap: .75rem; }
    .acr-item {
      display: flex; align-items: flex-start; gap: .875rem;
      padding: .875rem 1rem; background: #f8fafc;
      border: 1.5px solid #f1f5f9; border-radius: 12px;
    }
    .acr-item-icon {
      width: 34px; height: 34px; border-radius: 9px; flex-shrink: 0;
      background: rgba(59,130,246,0.1); color: #3b82f6;
      display: flex; align-items: center; justify-content: center;
    }
    .acr-item-title { font-size: .8125rem; font-weight: 700; color: #0f172a; margin-bottom: .35rem; }
    .acr-item-desc { font-size: .78rem; color: #374151; margin: 0 0 .5rem; line-height: 1.55; }
    .acr-item-note {
      font-size: .72rem; color: #64748b; line-height: 1.5;
      padding: .45rem .625rem; background: #fff;
      border-radius: 7px; border: 1px solid #e2e8f0;
    }
  `]
})
export class AcRequirementsComponent {}
