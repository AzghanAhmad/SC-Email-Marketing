import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-walkthrough-tags-segments',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="wt-section">

      <h3 class="wt-subheading">Tags and segments</h3>

      <p class="wt-body">
        Tags and segments are how your email system remembers what it has learned about each
        reader so that future flows can use that knowledge.
      </p>

      <!-- Tags -->
      <div class="wt-concept-card">
        <div class="wt-concept-header">
          <div class="wt-concept-icon tag">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
              <line x1="7" y1="7" x2="7.01" y2="7"/>
            </svg>
          </div>
          <div>
            <p class="wt-concept-name">Tags</p>
            <p class="wt-concept-tagline">Labels applied to a reader's profile</p>
          </div>
        </div>
        <p class="wt-concept-desc">
          A tag is a label applied to a reader's profile when they meet a specific condition or
          complete a specific action. Tags accumulate over time and build a picture of who each
          reader is and what they care about.
        </p>
        <div class="wt-tag-example">
          <p class="wt-tag-example-label">Example: A reader who completes your welcome sequence and clicks the call-to-action might receive:</p>
          <div class="wt-tags-row">
            <span class="wt-tag" *ngFor="let tag of exampleTags">{{ tag }}</span>
          </div>
          <p class="wt-tag-example-result">
            Those tags can then be used as conditions in future flows — so the next time you launch
            a new book, you can send a warmer, more personalized message specifically to readers
            tagged as engaged rather than sending the same message to everyone.
          </p>
        </div>
      </div>

      <!-- Segments -->
      <div class="wt-concept-card">
        <div class="wt-concept-header">
          <div class="wt-concept-icon segment">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div>
            <p class="wt-concept-name">Segments</p>
            <p class="wt-concept-tagline">Groups of readers who share tags or behaviors</p>
          </div>
        </div>
        <p class="wt-concept-desc">
          A segment is a group of readers who share one or more tags or behaviors. Segments let
          you treat different groups of readers differently — which is the difference between email
          marketing that feels personal and email marketing that feels like a mass mailing.
        </p>
        <div class="wt-segments-list">
          <div class="wt-segment-item" *ngFor="let seg of exampleSegments">
            <div class="wt-segment-dot" [style.background]="seg.color"></div>
            <div>
              <span class="wt-segment-name">{{ seg.name }}</span>
              <span class="wt-segment-desc">{{ seg.desc }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- How tags are applied -->
      <div class="wt-callout green">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        <p>
          In the ScribeCount system, tags are applied automatically at key decision points
          throughout your flows. Every YES and NO branch can be configured to apply or remove
          tags, ensuring your reader profiles stay current as behavior evolves.
        </p>
      </div>

    </div>
  `,
  styles: [`
    .wt-section { display: flex; flex-direction: column; gap: 1.25rem; }
    .wt-body { font-size: .875rem; color: #334155; line-height: 1.65; margin: 0; }
    .wt-subheading {
      font-size: .8rem; font-weight: 700; color: #94a3b8;
      text-transform: uppercase; letter-spacing: .07em; margin: 0;
    }

    /* Concept cards */
    .wt-concept-card {
      background: #fff; border: 1.5px solid #e2e8f0; border-radius: 14px;
      padding: 1.125rem; display: flex; flex-direction: column; gap: .875rem;
    }
    .wt-concept-header { display: flex; align-items: flex-start; gap: .75rem; }
    .wt-concept-icon {
      width: 38px; height: 38px; border-radius: 10px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
    }
    .wt-concept-icon.tag { background: rgba(99,102,241,.1); color: #6366f1; }
    .wt-concept-icon.segment { background: rgba(59,130,246,.1); color: #3b82f6; }
    .wt-concept-name { font-size: .9375rem; font-weight: 700; color: #0f172a; margin: 0 0 .1rem; }
    .wt-concept-tagline { font-size: .75rem; color: #94a3b8; margin: 0; }
    .wt-concept-desc { font-size: .8125rem; color: #334155; line-height: 1.55; margin: 0; }

    /* Tag example */
    .wt-tag-example {
      background: #f8fafc; border-radius: 10px; padding: .875rem;
      border: 1px solid #f1f5f9; display: flex; flex-direction: column; gap: .625rem;
    }
    .wt-tag-example-label { font-size: .78rem; color: #64748b; margin: 0; }
    .wt-tags-row { display: flex; flex-wrap: wrap; gap: .375rem; }
    .wt-tag {
      padding: .25rem .65rem; background: #ede9fe; color: #6d28d9;
      border-radius: 20px; font-size: .75rem; font-weight: 600;
    }
    .wt-tag-example-result { font-size: .78rem; color: #334155; line-height: 1.5; margin: 0; }

    /* Segments list */
    .wt-segments-list { display: flex; flex-direction: column; gap: .5rem; }
    .wt-segment-item {
      display: flex; align-items: flex-start; gap: .625rem;
      padding: .5rem .75rem; background: #f8fafc; border-radius: 8px;
      border: 1px solid #f1f5f9;
    }
    .wt-segment-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; margin-top: 3px; }
    .wt-segment-name { font-size: .8125rem; font-weight: 700; color: #0f172a; margin-right: .375rem; }
    .wt-segment-desc { font-size: .8rem; color: #64748b; }

    /* Callout */
    .wt-callout {
      display: flex; align-items: flex-start; gap: .75rem;
      padding: 1rem 1.125rem; border-radius: 0 12px 12px 0;
      font-size: .875rem; line-height: 1.6;
    }
    .wt-callout p { margin: 0; }
    .wt-callout svg { flex-shrink: 0; margin-top: 2px; }
    .wt-callout.green {
      background: #f0fdf4; border-left: 3px solid #22c55e; color: #166534;
    }
    .wt-callout.green svg { color: #16a34a; }
  `]
})
export class WalkthroughTagsSegmentsComponent {
  exampleTags = ['engaged', 'series-reader', 'community-interested', 'first-purchase'];

  exampleSegments = [
    { name: 'Superfans', desc: 'Everyone who has made three or more purchases', color: '#f59e0b' },
    { name: 'Lapsed Readers', desc: "Everyone who hasn't opened an email in 90 days", color: '#f87171' },
    { name: 'Series Readers', desc: 'Purchased 2+ books in the same series', color: '#6366f1' },
    { name: 'New This Month', desc: 'Joined in the last 30 days', color: '#34d399' },
  ];
}
