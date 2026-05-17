import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-re-overview-intro',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="re-intro">
      <h4 class="rei-title">Winning back quiet readers — and letting go of the ones who are gone</h4>
      <p class="rei-lead">
        Every email list has a ghost problem. Readers who joined with genuine enthusiasm, opened your
        early emails with interest, and then gradually stopped engaging without ever unsubscribing.
        They are still on your list. They still count toward your subscriber total. And they have not
        opened an email from you in six months.
      </p>
      <div class="rei-callout">
        <p>
          Inactive subscribers are not neutral. They actively work against the health of your email
          program in ways that compound quietly over time.
        </p>
      </div>
      <p class="rei-body">
        The re-engagement flow gives disengaged readers every reasonable opportunity to reconnect.
        It acknowledges that life gets busy and inboxes get overwhelming. And when reconnection is
        not possible, it removes them cleanly and respectfully rather than letting them drag on your
        deliverability indefinitely.
      </p>
    </div>
  `,
  styles: [`
    .re-intro { margin-bottom: 1.25rem; }
    .rei-title { font-size: .875rem; font-weight: 700; color: #0f172a; margin: 0 0 .5rem; line-height: 1.35; }
    .rei-lead { font-size: .78rem; color: #374151; margin: 0 0 .75rem; line-height: 1.65; }
    .rei-callout {
      padding: .875rem 1rem; margin-bottom: .75rem;
      background: rgba(219,39,119,0.06); border-left: 3px solid #db2777;
      border-radius: 0 10px 10px 0;
    }
    .rei-callout p { font-size: .78rem; color: #9d174d; margin: 0; line-height: 1.6; font-weight: 500; }
    .rei-body { font-size: .75rem; color: #64748b; margin: 0; line-height: 1.6; }
  `]
})
export class ReOverviewIntroComponent {}
