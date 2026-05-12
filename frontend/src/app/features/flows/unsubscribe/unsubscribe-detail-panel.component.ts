import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Flow } from '../../../core/services/mock-data.service';
import { UnsubscribePreferenceCenterComponent } from './unsubscribe-preference-center.component';
import { UnsubscribeDeliverabilityComponent } from './unsubscribe-deliverability.component';
import { UnsubscribeWhatNotToDoComponent } from './unsubscribe-what-not-to-do.component';

type UnsubTab = 'overview' | 'preference' | 'deliverability' | 'dont';

@Component({
  selector: 'app-unsubscribe-detail-panel',
  standalone: true,
  imports: [
    CommonModule,
    UnsubscribePreferenceCenterComponent,
    UnsubscribeDeliverabilityComponent,
    UnsubscribeWhatNotToDoComponent,
  ],
  template: `
    <div class="unsub-panel">

      <!-- Header -->
      <div class="unsub-panel-header">
        <div class="unsub-panel-icon" [ngClass]="isReadersChoice ? 'readers' : 'authors'">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
          </svg>
        </div>
        <div>
          <p class="unsub-panel-title">{{ isReadersChoice ? "Reader's Choice" : "Author's Choice" }}</p>
          <p class="unsub-panel-sub">{{ isReadersChoice ? 'Reader opted out' : 'Author removed subscriber' }}</p>
        </div>
      </div>

      <!-- Stats -->
      <div class="unsub-stats">
        <div class="unsub-stat">
          <span class="unsub-stat-val">{{ flow.triggers | number }}</span>
          <span class="unsub-stat-label">Total sent</span>
        </div>
        <div class="unsub-stat" *ngIf="flow.subscriptionMetrics?.resubscriptionRate !== undefined">
          <span class="unsub-stat-val">{{ flow.subscriptionMetrics!.resubscriptionRate }}%</span>
          <span class="unsub-stat-label">Re-subscribe rate</span>
        </div>
        <div class="unsub-stat">
          <span class="unsub-stat-val">{{ flow.steps.length }}</span>
          <span class="unsub-stat-label">Steps</span>
        </div>
      </div>

      <!-- Philosophy callout -->
      <div class="unsub-philosophy">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
        <p *ngIf="isReadersChoice">
          An unsubscribe is information — a reader telling you something about this communication
          relationship is not working for them right now. This flow is your response: clear,
          graceful, and designed to preserve the possibility of a different relationship in the future.
        </p>
        <p *ngIf="!isReadersChoice">
          Unlike the Reader's Choice email, this communicates a decision the author made. The
          reader did not choose to leave. Transparency is non-negotiable: state what happened,
          why it happened, and how the reader can return — without making removal feel like a punishment.
        </p>
      </div>

      <!-- Tab nav -->
      <div class="unsub-tabs">
        <button *ngFor="let t of tabs"
                class="unsub-tab"
                [class.active]="activeTab === t.id"
                (click)="activeTab = t.id">
          {{ t.label }}
        </button>
      </div>

      <!-- Tab content -->
      <div class="unsub-tab-content">
        <div *ngIf="activeTab === 'overview'">
          <div class="unsub-overview-items">
            <div class="unsub-overview-item" *ngFor="let item of overviewItems">
              <div class="unsub-overview-num">{{ item.num }}</div>
              <div>
                <p class="unsub-overview-title">{{ item.title }}</p>
                <p class="unsub-overview-desc">{{ item.desc }}</p>
              </div>
            </div>
          </div>
        </div>
        <app-unsubscribe-preference-center *ngIf="activeTab === 'preference'"></app-unsubscribe-preference-center>
        <app-unsubscribe-deliverability *ngIf="activeTab === 'deliverability'"></app-unsubscribe-deliverability>
        <app-unsubscribe-what-not-to-do *ngIf="activeTab === 'dont' && isReadersChoice"></app-unsubscribe-what-not-to-do>
        <div *ngIf="activeTab === 'dont' && !isReadersChoice" class="unsub-authors-guidance">
          <div class="unsub-three-elements">
            <p class="unsub-three-label">Three required elements, in this order:</p>
            <div class="unsub-element" *ngFor="let el of authorsChoiceElements">
              <div class="unsub-element-num">{{ el.num }}</div>
              <div>
                <p class="unsub-element-title">{{ el.title }}</p>
                <p class="unsub-element-desc">{{ el.desc }}</p>
              </div>
            </div>
          </div>
          <div class="unsub-tone-note">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <p>
              <strong>Tone: Respectful, not apologetic.</strong> List maintenance is a legitimate,
              professional practice. Framing it as something you are sorry about undermines the
              principled rationale for doing it. What the email needs is genuine warmth in its
              acknowledgment and genuine openness in the re-subscribe invitation.
            </p>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .unsub-panel {
      background: #fff; border: 1.5px solid #e2e8f0; border-radius: 16px;
      padding: 1.25rem; display: flex; flex-direction: column; gap: 1rem;
      position: sticky; top: 80px;
    }

    /* Header */
    .unsub-panel-header { display: flex; align-items: center; gap: .625rem; }
    .unsub-panel-icon {
      width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
    }
    .unsub-panel-icon.readers { background: rgba(99,102,241,.1); color: #6366f1; }
    .unsub-panel-icon.authors { background: rgba(245,158,11,.1); color: #d97706; }
    .unsub-panel-title { font-size: .875rem; font-weight: 700; color: #0f172a; margin: 0 0 .1rem; }
    .unsub-panel-sub { font-size: .72rem; color: #94a3b8; margin: 0; }

    /* Stats */
    .unsub-stats { display: flex; gap: 1.25rem; }
    .unsub-stat { display: flex; flex-direction: column; }
    .unsub-stat-val { font-size: 1.375rem; font-weight: 800; color: #0f172a; letter-spacing: -.02em; }
    .unsub-stat-label { font-size: .68rem; color: #94a3b8; text-transform: uppercase; letter-spacing: .05em; }

    /* Philosophy */
    .unsub-philosophy {
      display: flex; align-items: flex-start; gap: .5rem;
      padding: .75rem .875rem; background: #f0f7ff;
      border-left: 3px solid #3b82f6; border-radius: 0 10px 10px 0;
      font-size: .78rem; color: #1e40af; line-height: 1.55;
    }
    .unsub-philosophy svg { flex-shrink: 0; margin-top: 2px; color: #3b82f6; }
    .unsub-philosophy p { margin: 0; }

    /* Tabs */
    .unsub-tabs {
      display: flex; gap: .25rem; border-bottom: 1.5px solid #f1f5f9;
      overflow-x: auto; scrollbar-width: none;
    }
    .unsub-tabs::-webkit-scrollbar { display: none; }
    .unsub-tab {
      padding: .4rem .75rem; background: none; border: none;
      font-size: .75rem; font-weight: 500; color: #94a3b8;
      font-family: inherit; cursor: pointer; border-bottom: 2px solid transparent;
      margin-bottom: -1.5px; transition: color .15s, border-color .15s; white-space: nowrap;
    }
    .unsub-tab:hover { color: #334155; }
    .unsub-tab.active { color: #3b82f6; border-bottom-color: #3b82f6; font-weight: 600; }

    /* Tab content */
    .unsub-tab-content { min-height: 120px; }

    /* Overview items */
    .unsub-overview-items { display: flex; flex-direction: column; gap: .625rem; }
    .unsub-overview-item { display: flex; align-items: flex-start; gap: .625rem; }
    .unsub-overview-num {
      width: 22px; height: 22px; border-radius: 50%; background: #3b82f6; color: #fff;
      display: flex; align-items: center; justify-content: center;
      font-size: .7rem; font-weight: 800; flex-shrink: 0; margin-top: 1px;
    }
    .unsub-overview-title { font-size: .8125rem; font-weight: 600; color: #0f172a; margin: 0 0 .15rem; }
    .unsub-overview-desc { font-size: .75rem; color: #64748b; line-height: 1.45; margin: 0; }

    /* Author's choice guidance */
    .unsub-authors-guidance { display: flex; flex-direction: column; gap: .875rem; }
    .unsub-three-elements { display: flex; flex-direction: column; gap: .625rem; }
    .unsub-three-label { font-size: .75rem; font-weight: 600; color: #334155; margin: 0 0 .375rem; }
    .unsub-element { display: flex; align-items: flex-start; gap: .625rem; }
    .unsub-element-num {
      width: 22px; height: 22px; border-radius: 50%; background: #d97706; color: #fff;
      display: flex; align-items: center; justify-content: center;
      font-size: .7rem; font-weight: 800; flex-shrink: 0; margin-top: 1px;
    }
    .unsub-element-title { font-size: .8rem; font-weight: 700; color: #0f172a; margin: 0 0 .1rem; }
    .unsub-element-desc { font-size: .75rem; color: #64748b; line-height: 1.45; margin: 0; }
    .unsub-tone-note {
      display: flex; align-items: flex-start; gap: .5rem;
      padding: .75rem; background: #fffbeb; border-radius: 10px;
      border: 1px solid #fde68a; font-size: .75rem; color: #92400e; line-height: 1.5;
    }
    .unsub-tone-note svg { flex-shrink: 0; margin-top: 1px; color: #d97706; }
    .unsub-tone-note p { margin: 0; }
    .unsub-tone-note strong { font-weight: 700; }
  `]
})
export class UnsubscribeDetailPanelComponent {
  @Input() flow!: Flow;

  activeTab: UnsubTab = 'overview';

  get isReadersChoice(): boolean {
    return this.flow?.id === '13a';
  }

  get tabs(): { id: UnsubTab; label: string }[] {
    return [
      { id: 'overview', label: 'Overview' },
      { id: 'preference', label: 'Preference Center' },
      { id: 'deliverability', label: 'Deliverability' },
      { id: 'dont', label: this.isReadersChoice ? "What Not to Do" : "3 Elements" },
    ];
  }

  get overviewItems() {
    if (this.isReadersChoice) {
      return [
        {
          num: '1',
          title: 'Confirm immediately and unambiguously',
          desc: '"You have been removed from my mailing list and will receive no further emails from me." One sentence. No qualifications.'
        },
        {
          num: '2',
          title: 'Offer a preference alternative (optional)',
          desc: 'Not a retention pitch. A genuine low-pressure offer: lower frequency, or new release announcements only. The unsubscribe stands regardless.'
        },
        {
          num: '3',
          title: 'Acknowledge the relationship gracefully',
          desc: '"Thank you for the time you spent on my list. I hope my books find their way to you again someday, even if my emails do not."'
        },
        {
          num: '4',
          title: 'Provide a clear re-subscribe path',
          desc: 'Single link labeled "Re-subscribe here" or "Join the list again." No elaborate explanation. Just the path, clearly marked.'
        },
      ];
    }
    return [
      {
        num: '1',
        title: 'Clear statement of what happened',
        desc: '"I have removed your address from my mailing list due to inactivity." One sentence. No softening language that obscures the fact of removal.'
      },
      {
        num: '2',
        title: 'Brief, non-blaming explanation of why',
        desc: '"I maintain my list carefully to make sure I am only sending emails to readers who are genuinely interested. Since your address has not been active for [X] months, I have removed it."'
      },
      {
        num: '3',
        title: 'Clear, simple path to re-subscribe',
        desc: '"If you would like to stay connected, you can re-subscribe using the link below. I would genuinely be glad to have you back." Not a retention pitch — a factual statement of the reader\'s option.'
      },
    ];
  }

  authorsChoiceElements = [
    {
      num: '1',
      title: 'Clear statement of what happened',
      desc: '"I have removed your address from my mailing list due to inactivity." One sentence. No softening language.'
    },
    {
      num: '2',
      title: 'Brief, non-blaming explanation of why',
      desc: 'Context shows the removal was principled, not arbitrary. Positions list maintenance as something done for readers as much as for metrics.'
    },
    {
      num: '3',
      title: 'Clear, simple path to re-subscribe',
      desc: '"If you would like to stay connected, you can re-subscribe using the link below. I would genuinely be glad to have you back." Factual, without pressure.'
    },
  ];
}
