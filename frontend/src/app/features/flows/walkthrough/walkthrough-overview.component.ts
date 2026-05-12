import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-walkthrough-overview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="wt-section">

      <!-- Hero intro -->
      <div class="wt-hero">
        <div class="wt-hero-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="28" height="28">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
        </div>
        <div>
          <h2 class="wt-hero-title">Email Flows — Overview &amp; Orientation</h2>
          <p class="wt-hero-sub">The backbone of every successful author marketing system</p>
        </div>
      </div>

      <p class="wt-body">
        Email flows are the backbone of every successful author marketing system. Unlike a one-time
        broadcast email that you write and send manually to your entire list, an email flow is a
        pre-built sequence of automated messages that fires on its own — triggered by something a
        reader does, or doesn't do, at a specific moment in their journey with you. Set them up once,
        and they work for you around the clock, whether you're writing, traveling, or asleep.
      </p>

      <div class="wt-callout">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
        <p>
          Think of an email flow the way you'd think of a well-trained staff member who never takes
          a day off. The moment a reader signs up for your list, buys a book, abandons a cart, or
          goes quiet for three months, the right message goes out automatically — personalized,
          timely, and on-brand — without you lifting a finger.
        </p>
      </div>

      <!-- What flows do -->
      <h3 class="wt-subheading">What email flows do for authors</h3>

      <p class="wt-body">
        Most authors treat email as a broadcast tool — they send a newsletter when they have
        something to say and go quiet in between. Email flows change that entirely. They turn your
        list from a passive audience into an active, always-engaged reader community by ensuring
        that every reader gets the right message at the right moment, regardless of where they are
        in their relationship with your books.
      </p>

      <div class="wt-examples-grid">
        <div class="wt-example">
          <div class="wt-example-icon onboarding">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
            </svg>
          </div>
          <p>A new subscriber gets a warm, welcoming introduction to you and your catalog.</p>
        </div>
        <div class="wt-example">
          <div class="wt-example-icon transaction">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15">
              <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
          </div>
          <p>A first-time buyer gets a thank you that makes them feel like a person, not a transaction.</p>
        </div>
        <div class="wt-example">
          <div class="wt-example-icon launch">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
          </div>
          <p>A reader who just finished your series gets a gentle nudge toward your next book before the emotional high wears off.</p>
        </div>
        <div class="wt-example">
          <div class="wt-example-icon retention">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>
          <p>A lapsed subscriber gets a re-engagement offer before they drift away permanently.</p>
        </div>
      </div>

      <p class="wt-body">None of these things require you to monitor your list daily and manually respond. The flow handles it.</p>

      <!-- Five things callout -->
      <div class="wt-five-things">
        <div class="wt-five-label">Done well, email flows accomplish five things simultaneously:</div>
        <div class="wt-five-grid">
          <div class="wt-five-item">
            <span class="wt-five-num">1</span>
            <span>Build reader loyalty</span>
          </div>
          <div class="wt-five-item">
            <span class="wt-five-num">2</span>
            <span>Drive repeat sales</span>
          </div>
          <div class="wt-five-item">
            <span class="wt-five-num">3</span>
            <span>Recover lost revenue</span>
          </div>
          <div class="wt-five-item">
            <span class="wt-five-num">4</span>
            <span>Maintain list hygiene</span>
          </div>
          <div class="wt-five-item">
            <span class="wt-five-num">5</span>
            <span>Free you to focus on writing</span>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .wt-section { display: flex; flex-direction: column; gap: 1.25rem; }

    .wt-hero {
      display: flex; align-items: center; gap: 1rem;
      padding: 1.25rem; background: linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%);
      border-radius: 14px; border: 1.5px solid #bfdbfe;
    }
    .wt-hero-icon {
      width: 52px; height: 52px; border-radius: 14px; flex-shrink: 0;
      background: #3b82f6; color: #fff;
      display: flex; align-items: center; justify-content: center;
    }
    .wt-hero-title { font-size: 1.0625rem; font-weight: 800; color: #0f172a; margin: 0 0 .2rem; }
    .wt-hero-sub { font-size: .8rem; color: #64748b; margin: 0; }

    .wt-body { font-size: .875rem; color: #334155; line-height: 1.65; margin: 0; }

    .wt-callout {
      display: flex; align-items: flex-start; gap: .75rem;
      padding: 1rem 1.125rem; background: #f0f7ff;
      border-left: 3px solid #3b82f6; border-radius: 0 12px 12px 0;
      font-size: .875rem; color: #1e40af; line-height: 1.6;
    }
    .wt-callout svg { flex-shrink: 0; margin-top: 2px; color: #3b82f6; }
    .wt-callout p { margin: 0; }

    .wt-subheading {
      font-size: .8rem; font-weight: 700; color: #94a3b8;
      text-transform: uppercase; letter-spacing: .07em; margin: 0;
    }

    .wt-examples-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: .75rem;
    }
    @media (max-width: 600px) { .wt-examples-grid { grid-template-columns: 1fr; } }

    .wt-example {
      display: flex; align-items: flex-start; gap: .625rem;
      padding: .75rem; background: #f8fafc; border-radius: 10px;
      border: 1px solid #f1f5f9; font-size: .8125rem; color: #334155; line-height: 1.5;
    }
    .wt-example p { margin: 0; }
    .wt-example-icon {
      width: 30px; height: 30px; border-radius: 8px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
    }
    .wt-example-icon.onboarding { background: rgba(99,102,241,.1); color: #6366f1; }
    .wt-example-icon.transaction { background: rgba(16,185,129,.1); color: #059669; }
    .wt-example-icon.launch { background: rgba(245,158,11,.1); color: #d97706; }
    .wt-example-icon.retention { background: rgba(236,72,153,.1); color: #db2777; }

    .wt-five-things {
      background: #fafafa; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 1rem 1.125rem;
    }
    .wt-five-label {
      font-size: .8125rem; font-weight: 600; color: #334155; margin-bottom: .75rem;
    }
    .wt-five-grid { display: flex; flex-direction: column; gap: .4rem; }
    .wt-five-item {
      display: flex; align-items: center; gap: .625rem;
      font-size: .8125rem; color: #334155;
    }
    .wt-five-num {
      width: 22px; height: 22px; border-radius: 50%; background: #3b82f6; color: #fff;
      display: flex; align-items: center; justify-content: center;
      font-size: .7rem; font-weight: 800; flex-shrink: 0;
    }
  `]
})
export class WalkthroughOverviewComponent {}
