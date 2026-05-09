import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Tip {
  title: string;
  summary: string;
  expanded: boolean;
}

interface TipCategory {
  label: string;
  icon: string;
  expanded: boolean;
  tips: Tip[];
}

@Component({
  selector: 'app-email-tips',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tips-overlay" (click)="onClose.emit()"></div>
    <div class="tips-panel">
      <div class="tips-header">
        <div class="tips-title-row">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
            <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <h2>Email Best Practices</h2>
        </div>
        <button class="tips-close" (click)="onClose.emit()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <div class="tips-body">
        <p class="tips-intro">Actionable guidance from the ScribeCount walkthrough to help you write better emails, improve deliverability, and grow your audience.</p>

        <div class="tip-category" *ngFor="let cat of categories">
          <button class="cat-header" (click)="cat.expanded = !cat.expanded" [class.open]="cat.expanded">
            <span class="cat-icon" [innerHTML]="cat.icon"></span>
            <span class="cat-label">{{ cat.label }}</span>
            <span class="cat-count">{{ cat.tips.length }}</span>
            <svg class="cat-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" [class.rotated]="cat.expanded">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>

          <div class="cat-tips" [class.open]="cat.expanded">
            <div class="tip-item" *ngFor="let tip of cat.tips">
              <button class="tip-header" (click)="tip.expanded = !tip.expanded" [class.open]="tip.expanded">
                <svg class="tip-bullet" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                  <path *ngIf="!tip.expanded" d="M9 18l6-6-6-6"/>
                  <path *ngIf="tip.expanded" d="M18 15l-6-6-6 6"/>
                </svg>
                <span>{{ tip.title }}</span>
              </button>
              <div class="tip-body" *ngIf="tip.expanded">
                <p>{{ tip.summary }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tips-overlay {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.25);
      backdrop-filter: blur(2px);
      z-index: 150;
      animation: fadeIn .2s ease-out;
    }
    .tips-panel {
      position: fixed;
      top: 0;
      right: 0;
      width: 420px;
      max-width: 100vw;
      height: 100vh;
      background: var(--surface);
      border-left: 1px solid var(--border-light);
      box-shadow: -8px 0 40px rgba(0,0,0,0.08);
      z-index: 151;
      display: flex;
      flex-direction: column;
      animation: slideInRight .3s cubic-bezier(.4,0,.2,1);
    }
    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }

    .tips-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid var(--border-light);
    }
    .tips-title-row {
      display: flex;
      align-items: center;
      gap: .625rem;
    }
    .tips-title-row svg { color: #818cf8; }
    .tips-title-row h2 {
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0;
    }
    .tips-close {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--text-muted);
      padding: .35rem;
      border-radius: 8px;
      transition: all .2s;
    }
    .tips-close:hover { background: var(--bg-subtle); color: var(--text-primary); }

    .tips-body {
      flex: 1;
      overflow-y: auto;
      padding: 1.25rem 1.5rem;
    }
    .tips-body::-webkit-scrollbar { width: 4px; }
    .tips-body::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.08); border-radius: 100px; }

    .tips-intro {
      font-size: .8rem;
      color: var(--text-secondary);
      line-height: 1.6;
      margin-bottom: 1.25rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--border-light);
    }

    .tip-category { margin-bottom: .75rem; }
    .cat-header {
      display: flex;
      align-items: center;
      gap: .625rem;
      width: 100%;
      padding: .7rem .875rem;
      background: var(--bg);
      border: 1px solid var(--border-light);
      border-radius: 10px;
      cursor: pointer;
      font-family: inherit;
      font-size: .825rem;
      font-weight: 600;
      color: var(--text-primary);
      transition: all .2s;
    }
    .cat-header:hover { border-color: var(--border); }
    .cat-header.open {
      border-radius: 10px 10px 0 0;
      border-bottom-color: transparent;
      background: var(--bg-subtle);
    }
    .cat-icon { display: flex; width: 18px; height: 18px; flex-shrink: 0; color: #818cf8; }
    .cat-icon svg, .cat-icon :global(svg) { width: 18px; height: 18px; }
    .cat-count {
      margin-left: auto;
      font-size: .68rem;
      font-weight: 600;
      color: var(--text-muted);
      background: var(--border-light);
      padding: .1rem .45rem;
      border-radius: 100px;
    }
    .cat-chevron {
      width: 16px;
      height: 16px;
      color: var(--text-muted);
      transition: transform .25s;
      flex-shrink: 0;
    }
    .cat-chevron.rotated { transform: rotate(180deg); }

    .cat-tips {
      max-height: 0;
      overflow: hidden;
      transition: max-height .35s cubic-bezier(.4,0,.2,1);
      border: 1px solid var(--border-light);
      border-top: none;
      border-radius: 0 0 10px 10px;
    }
    .cat-tips.open { max-height: 2000px; }

    .tip-item {
      border-bottom: 1px solid var(--border-light);
    }
    .tip-item:last-child { border-bottom: none; }
    .tip-header {
      display: flex;
      align-items: center;
      gap: .5rem;
      width: 100%;
      padding: .6rem .875rem;
      background: transparent;
      border: none;
      cursor: pointer;
      font-family: inherit;
      font-size: .78rem;
      font-weight: 500;
      color: var(--text-secondary);
      text-align: left;
      transition: all .15s;
    }
    .tip-header:hover { background: var(--bg); color: var(--text-primary); }
    .tip-header.open { color: var(--text-primary); font-weight: 600; }
    .tip-bullet { flex-shrink: 0; color: var(--text-muted); }

    .tip-body {
      padding: 0 .875rem .75rem 2.25rem;
      animation: fadeIn .2s ease-out;
    }
    .tip-body p {
      font-size: .75rem;
      line-height: 1.65;
      color: var(--text-secondary);
      margin: 0;
    }
  `]
})
export class EmailTipsComponent {
  @Output() onClose = new EventEmitter<void>();

  categories: TipCategory[] = [
    {
      label: 'Composition & Content',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
      expanded: true,
      tips: [
        { title: 'Write Compelling Subject Lines', summary: 'Keep subject lines under 60 characters — mobile clients like Gmail show only ~30 characters. Front-load your most compelling words. Use A/B testing to let your audience tell you what works: provide two subject lines, set a test window (2–4 hours), and ScribeCount deploys the winner automatically.', expanded: false },
        { title: 'Keep Your Preview Text Working', summary: 'Preview text appears after your subject line in every inbox. Use the dedicated Preview Text field in the compose modal — don\'t let it default to a web version link or disclaimer. Write it after finalizing your subject so both lines work together as a unit.', expanded: false },
        { title: 'Use a Single Call to Action', summary: 'Emails with one focused CTA generate significantly higher click rates. Multiple links create a micro-decision that leads to deferral. Identify the single most important action before you write, and let every element serve that one action.', expanded: false },
        { title: 'Tell a Story', summary: 'Fiction readers respond to narrative. Lead with a specific moment — a scene that didn\'t make the cut, a research rabbit hole, a conversation that gave you a character\'s voice. Narrative-driven emails give value before asking anything, creating the ideal emotional state for a click.', expanded: false },
        { title: 'Write Like a Human, Not a Marketer', summary: 'Your author voice is your competitive advantage. Write emails like a letter to a reader you know personally. If any sentence sounds like an advertisement, rewrite it. Read your draft aloud before sending — your readers subscribed to hear from you, not a marketing department.', expanded: false },
        { title: 'Personalize Your Emails', summary: 'Use first names in subject lines and openings. Leverage purchase history, engagement data, and list tenure to shape content. A reader who bought Book 2 but not Book 1 should get a different recommendation than a new subscriber. Set up the logic once and let the system apply it at scale.', expanded: false },
      ]
    },
    {
      label: 'Deliverability & Technical',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
      expanded: false,
      tips: [
        { title: 'Authenticate Your Sending Domain', summary: 'Set up SPF, DKIM, and DMARC records for your domain. Without them, inbox providers may flag your emails as suspicious regardless of content quality. ScribeCount walks you through setup during onboarding and monitors authentication status continuously.', expanded: false },
        { title: 'Avoid Spam Trigger Words', summary: 'Words like "free," "guaranteed," "act now," and "limited time" can trigger spam filters. Excessive capitals, multiple exclamation marks, and aggressive formatting also raise flags. Use the Pre-Send Score Check to catch issues before sending.', expanded: false },
        { title: 'Monitor Your Bounce Rate', summary: 'Hard bounces (permanent delivery failures) damage your sender reputation. ScribeCount automatically suppresses hard-bounced addresses immediately. Keep your bounce rate below 2% — above that threshold, inbox providers start scrutinizing all your sends.', expanded: false },
        { title: 'Use a Custom Sending Domain', summary: 'Emails from your own domain (you@yourdomain.com) build brand recognition and improve deliverability compared to a shared sending domain. Setup requires adding DNS records — ScribeCount supports custom domains on all plans above entry tier.', expanded: false },
        { title: 'Check Emails on Mobile Before Sending', summary: 'Over 60% of emails are opened on mobile. An email that looks clean on desktop may be unreadable on a phone. Use ScribeCount\'s mobile preview mode to check rendering across Gmail, Apple Mail, and Outlook before every send.', expanded: false },
        { title: 'Pre-Send Score Check', summary: 'Before sending, ScribeCount scans your subject line, preview text, body, links, and headers across four categories: Content, Technical, Links, and Compliance. Each flagged item includes a plain-language explanation and fix suggestion. A score below 80 deserves attention before sending to your full list.', expanded: false },
      ]
    },
    {
      label: 'Engagement & Strategy',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
      expanded: false,
      tips: [
        { title: 'Track the Right Metrics', summary: 'Open rate is the least reliable signal — focus on click rate (intent to act), unsubscribe rate (content mismatch), and revenue per email (actual business impact). ScribeCount surfaces all metrics with trend lines showing how your performance changes over time.', expanded: false },
        { title: 'Optimize Send Times', summary: 'Tuesday–Thursday between 9–11am produces the highest open rates. Monday inboxes are crowded; Friday attention is divided. ScribeCount\'s timezone optimization sends each subscriber at their local equivalent time — 9am means 9am everywhere.', expanded: false },
        { title: 'Match Email Frequency to Expectations', summary: 'State your frequency at sign-up and stick to it. If frequency changes — ramping up for a launch or scaling back during a break — tell your readers in advance. Surprise frequency is the #1 cause of unsubscribes and spam complaints.', expanded: false },
        { title: 'Segment Your Audience', summary: 'Divide your list into meaningful groups: first-time buyers, series completers, superfans (3+ purchases), lapsed subscribers (90+ days inactive). Each group needs different messaging. Segmented emails feel like personal recommendations; unsegmented emails feel like mass mailings.', expanded: false },
        { title: 'Let Readers Choose Their Preferences', summary: 'Offer a preference center where subscribers control what they receive — new releases, sales only, newsletter, or genre-specific updates. Readers who can adjust their preferences are far less likely to unsubscribe entirely. Link it from every email.', expanded: false },
        { title: 'Clean Your List Regularly', summary: 'Inactive subscribers drag down your deliverability and skew your metrics. ScribeCount flags subscribers inactive after 90–180 days of no engagement. Run a re-engagement flow first, then remove those who remain unresponsive. A smaller, engaged list outperforms a large, disengaged one.', expanded: false },
      ]
    },
    {
      label: 'List Building & Automation',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
      expanded: false,
      tips: [
        { title: 'Offer a Reader Magnet Worth Having', summary: 'Your reader magnet determines list quality more than quantity. Make it as close to publication quality as possible — professionally edited, with a proper cover. A weak magnet attracts subscribers who never engage; a strong one attracts genuine readers.', expanded: false },
        { title: 'Never Buy an Email List', summary: 'Purchased lists are liabilities, not shortcuts. Recipients didn\'t consent, leading to spam complaints, bounce damage, and potential violations of GDPR, CASL, and CAN-SPAM. The deliverability damage from one purchased list send can take months to repair.', expanded: false },
        { title: 'Use Double Opt-In', summary: 'Double opt-in asks new subscribers to confirm via email after signing up. It verifies addresses are real, filters out bots, and creates a documented record of consent. The modest drop in raw sign-ups is offset by dramatically higher list quality and engagement.', expanded: false },
        { title: 'Let Your Flows Do the Heavy Lifting', summary: 'Build flows before campaigns. The five core flows every author needs: welcome sequence, post-purchase thank you, abandoned cart recovery, re-engagement for inactive subscribers, and digital delivery. Flows run 24/7 and handle the most commercially valuable moments automatically.', expanded: false },
        { title: 'Review Your Flows Quarterly', summary: 'Check every link, update pricing and book references, verify merge tags populate correctly, and review performance metrics. A flow built six months ago may reference outdated information. Set a recurring calendar reminder every three months.', expanded: false },
        { title: 'Suppress Buyers from Promotional Sends', summary: 'Exclude existing buyers from sale announcements for titles they already purchased at full price. ScribeCount applies suppression rules at the campaign level using purchase history data — set up once, runs automatically for every applicable send.', expanded: false },
        { title: 'Test Your Flows Before Activating', summary: 'Test every path: the primary sequence and every branch (no click, no purchase, no download). Verify links, merge tags, timing, and conditional routing. ScribeCount\'s flow testing mode simulates reader behavior without sending to your live list.', expanded: false },
        { title: 'Connect Your Store First', summary: 'Purchase-dependent flows (post-purchase, cart recovery, digital delivery) cannot function without a live store connection. Connect your store before building these flows — it takes ~15 minutes and is the most commercially valuable step in your setup.', expanded: false },
      ]
    },
  ];
}
