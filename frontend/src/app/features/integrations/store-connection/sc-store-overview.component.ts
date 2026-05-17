import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sc-store-overview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sc-store-overview">
      <p class="sso-lead">
        When you connect ScribeCount Email to your author website store, the two systems begin
        talking to each other behind the scenes — automatically, securely, and without ongoing
        effort on your part.
      </p>
      <p class="sso-body">
        Understanding how that conversation works helps you trust the system, troubleshoot the
        rare moments when something looks unexpected, and make smarter decisions about how you
        set up your flows and campaigns.
      </p>
    </div>
  `,
  styles: [`
    .sc-store-overview { margin-bottom: 1rem; }
    .sso-lead { font-size: .875rem; color: #374151; margin: 0 0 .625rem; line-height: 1.65; }
    .sso-body { font-size: .8125rem; color: #64748b; margin: 0; line-height: 1.6; }
  `]
})
export class ScStoreOverviewComponent {}
