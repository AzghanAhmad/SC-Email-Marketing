import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sc-store-events',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sc-events">
      <h4 class="sse-title">What the store sends — and what ScribeCount does with it</h4>
      <p class="sse-body">
        Every meaningful action a reader takes in your store generates an event. Your store captures
        that event and sends a small packet of information — called a webhook — to ScribeCount Email
        in real time. A webhook is simply a notification: "This just happened. Here are the details."
      </p>
      <p class="sse-body">
        ScribeCount receives the webhook, reads it, and matches it to the rules you have set up in
        your flows and campaigns. If there is a matching rule, the appropriate action fires. If there
        is no matching rule, the event is logged and nothing happens.
      </p>
    </div>
  `,
  styles: [`
    .sc-events { margin-bottom: 1rem; }
    .sse-title { font-size: .9375rem; font-weight: 700; color: #0f172a; margin: 0 0 .5rem; }
    .sse-body { font-size: .8125rem; color: #374151; margin: 0 0 .625rem; line-height: 1.6; }
    .sse-body:last-child { margin-bottom: 0; }
  `]
})
export class ScStoreEventsComponent {}
