import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

interface SetupStep {
  number: number;
  title: string;
  intro?: string;
  bullets?: string[];
  ordered?: string[];
  note?: string;
  warning?: string;
  code?: string;
  table?: { label: string; value: string }[];
  links?: { label: string; href?: string; route?: string }[];
}

@Component({
  selector: 'app-ses-sns-setup-guide',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page-wrapper">
      <div class="page-header">
        <button type="button" class="back-link" (click)="goToDomainSetup()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="15 18 9 12 15 6"/></svg>
          Back to Domain Setup
        </button>
        <div class="hero-badge">Setup guide</div>
        <h1 class="page-title">Amazon SES + SNS setup</h1>
        <p class="page-subtitle">
          Follow these steps in your AWS account to send campaigns, flows, and signup emails through Amazon SES
          and receive bounce, delivery, and complaint events via SNS.
        </p>
      </div>

      <div class="tip-card glass-card">
        <strong>Before you start:</strong> use region <code>us-east-1</code> (recommended), have DNS access for your domain,
        and a public HTTPS URL for your API webhook (use ngrok when developing locally).
      </div>

      <div class="steps">
        <article class="glass-card step-card" *ngFor="let step of steps" [id]="'step-' + step.number">
          <div class="step-head">
            <span class="step-num">{{ step.number }}</span>
            <h2 class="step-title">{{ step.title }}</h2>
          </div>

          <p class="step-intro" *ngIf="step.intro">{{ step.intro }}</p>

          <ul class="step-list" *ngIf="step.bullets?.length">
            <li *ngFor="let b of step.bullets">{{ b }}</li>
          </ul>

          <ol class="step-ordered" *ngIf="step.ordered?.length">
            <li *ngFor="let o of step.ordered">{{ o }}</li>
          </ol>

          <div class="step-table" *ngIf="step.table?.length">
            <div class="step-table-row" *ngFor="let row of step.table">
              <span class="step-table-label">{{ row.label }}</span>
              <span class="step-table-value">{{ row.value }}</span>
            </div>
          </div>

          <p class="step-note" *ngIf="step.note">{{ step.note }}</p>
          <p class="step-warning" *ngIf="step.warning">{{ step.warning }}</p>

          <pre class="code-block" *ngIf="step.code"><code>{{ step.code }}</code></pre>

          <div class="step-links" *ngIf="step.links?.length">
            <a *ngFor="let link of step.links"
               [routerLink]="link.route || null"
               [href]="link.href || null"
               [attr.target]="link.href ? '_blank' : null"
               [attr.rel]="link.href ? 'noopener noreferrer' : null"
               (click)="link.route ? goToDomainSetup($event) : null">{{ link.label }}</a>
          </div>
        </article>
      </div>

      <div class="footer-actions glass-card">
        <h3>Done?</h3>
        <p>Return to Domain Setup to confirm SES is configured and send a test email.</p>
        <button type="button" class="btn-primary" (click)="goToDomainSetup()">Open Domain Setup</button>
      </div>
    </div>
  `,
  styles: [`
    .page-wrapper { padding: 2rem; max-width: 820px; margin: 0 auto; }
    .back-link {
      display: inline-flex; align-items: center; gap: .35rem; font-size: .8125rem; font-weight: 600;
      color: #64748b; text-decoration: none; margin-bottom: 1rem; background: none; border: none;
      padding: 0; cursor: pointer; font-family: inherit;
    }
    .back-link:hover { color: #2563eb; }
    .hero-badge {
      display: inline-block; padding: .35rem .75rem; border-radius: 100px;
      background: rgba(59,130,246,0.1); color: #2563eb; font-size: .75rem; font-weight: 700; margin-bottom: .75rem;
    }
    .page-title { font-size: 1.75rem; font-weight: 800; color: #0f172a; margin: 0 0 .5rem; letter-spacing: -.02em; }
    .page-subtitle { font-size: 1rem; color: #64748b; line-height: 1.6; margin: 0 0 1.5rem; }
    .tip-card { padding: 1rem 1.25rem; margin-bottom: 1.5rem; font-size: .875rem; color: #334155; line-height: 1.6; }
    .tip-card code { background: #f1f5f9; padding: .1rem .35rem; border-radius: 4px; font-size: .8rem; }
    .steps { display: flex; flex-direction: column; gap: 1rem; }
    .step-card { padding: 1.35rem 1.5rem; }
    .step-head { display: flex; align-items: center; gap: .875rem; margin-bottom: .75rem; }
    .step-num {
      width: 36px; height: 36px; border-radius: 10px; background: linear-gradient(135deg, #3b82f6, #6366f1);
      color: #fff; font-size: .875rem; font-weight: 800; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .step-title { margin: 0; font-size: 1.0625rem; font-weight: 700; color: #0f172a; }
    .step-intro, .step-note { font-size: .875rem; color: #475569; line-height: 1.65; margin: 0 0 .75rem; }
    .step-warning {
      font-size: .8125rem; color: #92400e; background: #fffbeb; border: 1px solid #fde68a;
      border-radius: 8px; padding: .75rem 1rem; margin: 0 0 .75rem; line-height: 1.5;
    }
    .step-list, .step-ordered { margin: 0 0 .75rem; padding-left: 1.25rem; font-size: .875rem; color: #475569; line-height: 1.65; }
    .step-list li, .step-ordered li { margin-bottom: .35rem; }
    .step-table { border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; margin-bottom: .75rem; }
    .step-table-row { display: grid; grid-template-columns: 140px 1fr; gap: .75rem; padding: .625rem 1rem; font-size: .8125rem; border-bottom: 1px solid #f1f5f9; }
    .step-table-row:last-child { border-bottom: none; }
    .step-table-label { font-weight: 600; color: #64748b; }
    .step-table-value { color: #0f172a; }
    .code-block {
      background: #0f172a; color: #e2e8f0; border-radius: 10px; padding: 1rem 1.25rem;
      font-size: .75rem; line-height: 1.55; overflow-x: auto; margin: 0 0 .75rem; white-space: pre-wrap;
    }
    .step-links { display: flex; flex-wrap: wrap; gap: .75rem; }
    .step-links a { font-size: .8125rem; font-weight: 600; color: #2563eb; text-decoration: none; }
    .step-links a:hover { text-decoration: underline; }
    .footer-actions { padding: 1.5rem; text-align: center; margin-top: 1.5rem; }
    .footer-actions h3 { margin: 0 0 .35rem; font-size: 1.0625rem; color: #0f172a; }
    .footer-actions p { margin: 0 0 1rem; font-size: .875rem; color: #64748b; }
    .btn-primary {
      display: inline-flex; align-items: center; justify-content: center; padding: .625rem 1.25rem;
      background: #2563eb; color: #fff; border-radius: 10px; font-size: .875rem; font-weight: 600; text-decoration: none;
      border: none; cursor: pointer; font-family: inherit;
    }
    .btn-primary:hover { background: #1d4ed8; }
  `],
})
export class SesSnsSetupGuideComponent {
  constructor(private router: Router) {}

  goToDomainSetup(event?: Event) {
    event?.preventDefault();
    void this.router.navigate(['/settings/domain']);
  }

  readonly steps: SetupStep[] = [
    {
      number: 1,
      title: 'Log in to AWS',
      ordered: [
        'Go to the AWS Management Console.',
        'Log in to your AWS account.',
      ],
      links: [{ label: 'Open AWS Console', href: 'https://console.aws.amazon.com/' }],
    },
    {
      number: 2,
      title: 'Open Amazon SES',
      ordered: [
        'In the top search bar, search for Amazon SES and open it.',
        'Check the region in the top-right corner.',
      ],
      note: 'Recommendation: US East (N. Virginia) — us-east-1. Your backend must use this same region in Step 14.',
    },
    {
      number: 3,
      title: 'Verify your domain',
      intro: 'Verify your entire domain (e.g. yourdomain.com), not just a single email address.',
      ordered: [
        'In SES, click Identities → Create identity.',
        'Choose Domain.',
        'Enter yourdomain.com.',
        'Enable Easy DKIM.',
        'Click Create identity.',
      ],
    },
    {
      number: 4,
      title: 'Add DNS records',
      intro: 'SES shows about 3–6 records (CNAME, TXT, MX, etc.). Add them at your DNS provider.',
      bullets: [
        'Open DNS management at Cloudflare, GoDaddy, Namecheap, Squarespace, Hostinger, or your host.',
        'Copy every record exactly from AWS into your DNS.',
        'Do not change names or values.',
      ],
    },
    {
      number: 5,
      title: 'Wait for verification',
      ordered: [
        'Return to SES → Identities.',
        'Refresh every few minutes.',
        'Wait until Verified appears beside your domain.',
      ],
      note: 'Usually 5–30 minutes; sometimes up to 1 hour.',
    },
    {
      number: 6,
      title: 'Request production access',
      intro: 'New SES accounts are in Sandbox mode: you can send, but only to verified email addresses.',
      ordered: [
        'In SES, open Account dashboard.',
        'Click Request production access.',
        'Fill the form and submit.',
      ],
      table: [
        { label: 'Purpose', value: 'Transactional and marketing emails for our SaaS application.' },
        { label: 'Website', value: 'https://yourwebsite.com' },
        { label: 'Mail type', value: 'Transactional, or Transactional + Marketing' },
      ],
      note: 'Approval usually takes a few hours, up to 24 hours.',
    },
    {
      number: 7,
      title: 'Create IAM user',
      ordered: [
        'Search IAM in AWS and open it.',
        'Users → Create user.',
        'Example name: scribecount-ses.',
      ],
    },
    {
      number: 8,
      title: 'Give permissions',
      ordered: [
        'Choose Attach policies directly.',
        'Attach AmazonSESFullAccess (simplest for setup).',
        'Finish creating the user.',
      ],
      note: 'You can switch to a tighter custom policy later in production.',
    },
    {
      number: 9,
      title: 'Create access keys',
      ordered: [
        'Open the new IAM user → Security credentials.',
        'Under Access keys, click Create access key.',
        'Choose Application running outside AWS → Continue.',
        'Save Access Key ID and Secret Access Key immediately — you cannot view the secret again.',
      ],
      warning: 'Never commit keys to git. Use User Secrets or environment variables in production.',
    },
    {
      number: 10,
      title: 'Create SNS topic',
      ordered: [
        'Search SNS and open it.',
        'Topics → Create topic.',
        'Type: Standard.',
        'Topic name: scribecount-ses-events.',
        'Create.',
      ],
    },
    {
      number: 11,
      title: 'Create HTTPS subscription',
      ordered: [
        'Open the topic → Create subscription.',
        'Protocol: HTTPS.',
        'Endpoint: your API URL + /api/v1/webhooks/sns (see examples below).',
        'Create subscription.',
      ],
      code: `Production:\nhttps://your-api-domain.com/api/v1/webhooks/sns\n\nLocal testing (ngrok to port 5065):\nhttps://xxxxx.ngrok.io/api/v1/webhooks/sns`,
      warning: 'SNS cannot reach http://localhost. Use ngrok or Cloudflare Tunnel for local development.',
    },
    {
      number: 12,
      title: 'Create configuration set',
      ordered: [
        'Back in SES → Configuration sets → Create.',
        'Example name: scribecount-default (must match backend config in Step 14).',
      ],
    },
    {
      number: 13,
      title: 'Add event destination',
      ordered: [
        'Inside the configuration set, click Add event destination.',
        'Destination: SNS — select your scribecount-ses-events topic.',
        'Enable: Send, Delivery, Bounce, Complaint.',
        'Save.',
      ],
    },
    {
      number: 14,
      title: 'Update your backend',
      intro: 'Edit backend/appsettings.json (or use environment variables / User Secrets).',
      code: `"AmazonSes": {
  "Enabled": true,
  "Region": "us-east-1",
  "AccessKeyId": "YOUR_ACCESS_KEY",
  "SecretAccessKey": "YOUR_SECRET_KEY",
  "FromEmail": "noreply@yourdomain.com",
  "FromName": "ScribeCount Email",
  "ConfigurationSetName": "scribecount-default",
  "VerifySnsSignatures": true
}`,
      note: 'Replace YOUR_ACCESS_KEY, YOUR_SECRET_KEY, and use an address on your verified domain for FromEmail.',
    },
    {
      number: 15,
      title: 'Restart backend',
      intro: 'Stop the API process and start it again so the new AmazonSes settings load.',
    },
    {
      number: 16,
      title: 'Test SES status in the app',
      ordered: [
        'Start backend and frontend.',
        'Open Settings → Domain Setup (use the button below).',
        'Confirm the badge shows SES configured.',
      ],
      links: [{ label: 'Go to Domain Setup', route: '/settings/domain' }],
    },
    {
      number: 17,
      title: 'Send test email',
      intro: 'In Settings → Domain Setup, use Send test email.',
      bullets: [
        'Sandbox: send only to verified email addresses in SES.',
        'Production: send to any valid email address.',
      ],
    },
    {
      number: 18,
      title: 'Verify SNS events',
      ordered: [
        'Confirm the SNS subscription status is Confirmed.',
        'Send a test email.',
        'Check backend logs for Delivery, Bounce, or Complaint events.',
      ],
      table: [
        { label: 'Delivery', value: 'Recipient provider accepted the message.' },
        { label: 'Bounce', value: 'Message could not be delivered.' },
        { label: 'Complaint', value: 'Recipient marked it as spam.' },
      ],
    },
  ];
}
