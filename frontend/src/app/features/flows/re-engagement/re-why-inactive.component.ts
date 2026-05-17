import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-re-why-inactive',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="re-why">
      <h4 class="rew-title">Why inactive subscribers are not neutral</h4>
      <p class="rew-sub">
        Your list's value comes from engagement, not size. A list of five thousand engaged readers
        is worth dramatically more than twenty thousand where half have not opened anything in a year.
      </p>

      <div class="rew-cards">
        <div class="rew-card" *ngFor="let c of consequences">
          <div class="rew-card-icon" [style.background]="c.bg" [style.color]="c.color">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
              <path [attr.d]="c.icon"/>
            </svg>
          </div>
          <div class="rew-card-body">
            <h5 class="rew-card-title">{{ c.title }}</h5>
            <p class="rew-card-desc">{{ c.desc }}</p>
          </div>
        </div>
      </div>

      <div class="rew-callout">
        <p>
          Your email list is not an asset because of its size. It is an asset because of its
          engagement. A smaller, cleaner, more engaged list outperforms a larger, ghost-padded one
          in every metric that drives revenue: deliverability, open rate, click rate, and conversion.
        </p>
      </div>
    </div>
  `,
  styles: [`
    .re-why { margin-bottom: 1.25rem; }
    .rew-title { font-size: .8125rem; font-weight: 700; color: #0f172a; margin: 0 0 .25rem; }
    .rew-sub { font-size: .75rem; color: #64748b; margin: 0 0 .875rem; line-height: 1.5; }

    .rew-cards { display: flex; flex-direction: column; gap: .5rem; margin-bottom: .875rem; }
    .rew-card {
      display: flex; align-items: flex-start; gap: .75rem;
      padding: .75rem; background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 10px;
    }
    .rew-card-icon {
      width: 28px; height: 28px; border-radius: 8px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
    }
    .rew-card-title { font-size: .78rem; font-weight: 700; color: #0f172a; margin: 0 0 .25rem; }
    .rew-card-desc { font-size: .72rem; color: #374151; margin: 0; line-height: 1.55; }

    .rew-callout {
      padding: .875rem 1rem;
      background: rgba(219,39,119,0.05); border: 1.5px solid rgba(219,39,119,0.15);
      border-radius: 10px;
    }
    .rew-callout p { font-size: .75rem; color: #831843; margin: 0; line-height: 1.6; font-weight: 500; }
  `]
})
export class ReWhyInactiveComponent {
  consequences = [
    {
      title: 'The deliverability consequence',
      desc: 'When a large portion of your list fails to open, inbox providers register that your content may not be wanted. That signal affects inbox placement for everyone — including your most engaged readers. Ghost subscribers are not just a missed opportunity; they make it harder for wanted mail to arrive.',
      bg: 'rgba(239,68,68,0.1)', color: '#dc2626',
      icon: 'M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    },
    {
      title: 'The data consequence',
      desc: 'Inactive subscribers distort your metrics. If thirty percent of your list has not opened in six months, your reported open rate is thirty percent lower than your active audience alone. Decisions about what is working and how often to send are made on corrupted information until the list is cleaned.',
      bg: 'rgba(59,130,246,0.1)', color: '#3b82f6',
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    },
  ];
}
