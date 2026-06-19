import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page-wrapper">
      <div class="hero">
        <div class="hero-badge">About</div>
        <h1 class="page-title">ScribeCount Email</h1>
        <p class="page-subtitle">
          The email marketing platform built for authors — manage your list, automate reader journeys,
          and grow your book business from one place.
        </p>
      </div>

      <div class="grid">
        <section class="glass-card card">
          <h2>What we do</h2>
          <p>
            ScribeCount Email helps authors and publishers turn readers into loyal fans. You can run
            newsletters and launch campaigns, build automated flows (welcome sequences, post-purchase
            thank-yous, re-engagement, and more), and manage your inbox — all connected to your
            subscriber list and store.
          </p>
        </section>

        <section class="glass-card card">
          <h2>Key features</h2>
          <ul>
            <li><strong>Email inbox</strong> — Connect Gmail, Outlook, or other mailboxes to read and send from the app.</li>
            <li><strong>Flows</strong> — Install proven automation templates for onboarding, transactions, launches, and retention.</li>
            <li><strong>Campaigns</strong> — Send newsletters, launch announcements, and event emails to your list.</li>
            <li><strong>Audience</strong> — Segments, profiles, and growth tools to understand who your readers are.</li>
            <li><strong>Analytics</strong> — Track opens, clicks, list health, and deliverability.</li>
            <li><strong>Integrations</strong> — Connect Shopify, BookFunnel, and other tools your author business already uses.</li>
          </ul>
        </section>

        <section class="glass-card card">
          <h2>Who it's for</h2>
          <p>
            Whether you publish independently or with a small team, ScribeCount Email is designed around
            how authors actually market books: series launches, reader magnets, backlist spotlights,
            signing events, and long-term reader relationships — not generic e-commerce blasts.
          </p>
        </section>

        <section class="glass-card card">
          <h2>Get started</h2>
          <ol>
            <li>Connect your email inbox under <a routerLink="/settings" [queryParams]="{ tab: 'inbox' }">Settings → Inbox Connection</a>.</li>
            <li>Browse the <a routerLink="/flows">Flow Library</a> and install templates that match your goals.</li>
            <li>Import or grow your audience, then send your first <a routerLink="/campaigns">campaign</a>.</li>
          </ol>
          <a routerLink="/dashboard" class="btn-primary">Go to Dashboard</a>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .page-wrapper { padding: 2rem; max-width: 960px; margin: 0 auto; }
    .hero { margin-bottom: 2rem; }
    .hero-badge {
      display: inline-block; padding: .35rem .75rem; border-radius: 100px;
      background: rgba(59,130,246,0.1); color: #3b82f6; font-size: .75rem; font-weight: 700;
      margin-bottom: .75rem;
    }
    .page-title { font-size: 2rem; font-weight: 800; color: #0f172a; margin: 0 0 .5rem; }
    .page-subtitle { font-size: 1.05rem; color: #64748b; line-height: 1.6; margin: 0; max-width: 640px; }
    .grid { display: grid; gap: 1.25rem; }
    .card { padding: 1.5rem; }
    .card h2 { font-size: 1.1rem; font-weight: 700; color: #0f172a; margin: 0 0 .75rem; }
    .card p, .card li { font-size: .9rem; color: #475569; line-height: 1.65; }
    .card ul, .card ol { margin: 0; padding-left: 1.25rem; }
    .card li { margin-bottom: .5rem; }
    .card a:not(.btn-primary) { color: #3b82f6; text-decoration: none; font-weight: 600; }
    .card a:not(.btn-primary):hover { text-decoration: underline; }
    .btn-primary {
      display: inline-block; margin-top: 1rem; padding: .625rem 1.25rem;
      background: #3b82f6; color: #fff; border-radius: 10px; text-decoration: none;
      font-size: .875rem; font-weight: 600;
    }
    .btn-primary:hover { background: #2563eb; color: #fff; text-decoration: none; }
  `]
})
export class AboutComponent {}
