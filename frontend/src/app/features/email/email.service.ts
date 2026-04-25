import { Injectable, signal, computed } from '@angular/core';

export interface EmailAttachment {
  name: string;
  size: string;
  type: string;
}

export interface Email {
  id: string;
  from: string;
  fromEmail: string;
  to: string;
  toEmail: string;
  subject: string;
  preview: string;
  body: string;
  timestamp: Date;
  read: boolean;
  starred: boolean;
  folder: 'inbox' | 'sent' | 'drafts' | 'scheduled' | 'spam' | 'trash';
  attachments: EmailAttachment[];
  labels?: string[];
}

@Injectable({ providedIn: 'root' })
export class EmailService {
  private _emails = signal<Email[]>(this.generateMockEmails());

  readonly emails = this._emails.asReadonly();

  readonly inboxEmails = computed(() =>
    this._emails().filter(e => e.folder === 'inbox')
  );

  readonly sentEmails = computed(() =>
    this._emails().filter(e => e.folder === 'sent')
  );

  readonly draftEmails = computed(() =>
    this._emails().filter(e => e.folder === 'drafts')
  );

  readonly scheduledEmails = computed(() =>
    this._emails().filter(e => e.folder === 'scheduled')
  );

  readonly spamEmails = computed(() =>
    this._emails().filter(e => e.folder === 'spam')
  );

  readonly trashEmails = computed(() =>
    this._emails().filter(e => e.folder === 'trash')
  );

  readonly unreadCount = computed(() =>
    this._emails().filter(e => e.folder === 'inbox' && !e.read).length
  );

  getEmailsByFolder(folder: string): Email[] {
    return this._emails().filter(e => e.folder === folder);
  }

  getEmailById(id: string): Email | undefined {
    return this._emails().find(e => e.id === id);
  }

  markAsRead(id: string): void {
    this._emails.update(emails =>
      emails.map(e => e.id === id ? { ...e, read: true } : e)
    );
  }

  markAsUnread(id: string): void {
    this._emails.update(emails =>
      emails.map(e => e.id === id ? { ...e, read: false } : e)
    );
  }

  toggleStar(id: string): void {
    this._emails.update(emails =>
      emails.map(e => e.id === id ? { ...e, starred: !e.starred } : e)
    );
  }

  deleteEmail(id: string): void {
    this._emails.update(emails =>
      emails.map(e => e.id === id ? { ...e, folder: 'trash' as const } : e)
    );
  }

  sendEmail(to: string, subject: string, body: string): void {
    const newEmail: Email = {
      id: 'e' + Date.now(),
      from: 'You',
      fromEmail: 'you@scribecount.com',
      to: to.split('@')[0] || to,
      toEmail: to,
      subject,
      preview: body.substring(0, 100),
      body,
      timestamp: new Date(),
      read: true,
      starred: false,
      folder: 'sent',
      attachments: [],
    };
    this._emails.update(emails => [newEmail, ...emails]);
  }

  saveDraft(to: string, subject: string, body: string): void {
    const draft: Email = {
      id: 'd' + Date.now(),
      from: 'You',
      fromEmail: 'you@scribecount.com',
      to: to || '(no recipient)',
      toEmail: to,
      subject: subject || '(no subject)',
      preview: body.substring(0, 100) || '(empty draft)',
      body,
      timestamp: new Date(),
      read: true,
      starred: false,
      folder: 'drafts',
      attachments: [],
    };
    this._emails.update(emails => [draft, ...emails]);
  }

  scheduleEmail(to: string, subject: string, body: string): void {
    const scheduled: Email = {
      id: 's' + Date.now(),
      from: 'You',
      fromEmail: 'you@scribecount.com',
      to: to.split('@')[0] || to,
      toEmail: to,
      subject,
      preview: body.substring(0, 100),
      body,
      timestamp: new Date(Date.now() + 3600000),
      read: true,
      starred: false,
      folder: 'scheduled',
      attachments: [],
    };
    this._emails.update(emails => [scheduled, ...emails]);
  }

  private generateMockEmails(): Email[] {
    const now = new Date();
    return [
      {
        id: 'e1', from: 'Sarah Mitchell', fromEmail: 'sarah@publisherhq.com',
        to: 'You', toEmail: 'you@scribecount.com',
        subject: 'Q2 Marketing Campaign Results',
        preview: 'Hi! I wanted to share the latest results from our Q2 email marketing campaign. The open rates exceeded our expectations...',
        body: `<p>Hi there,</p><p>I wanted to share the latest results from our Q2 email marketing campaign. The open rates exceeded our expectations by <strong>23%</strong>, and we saw a significant increase in click-through rates across all segments.</p><p>Key highlights:</p><ul><li>Open rate: 42.3% (up from 34.1%)</li><li>Click-through rate: 8.7%</li><li>Conversion rate: 3.2%</li><li>Revenue attributed: $12,450</li></ul><p>I'd love to schedule a call to discuss the strategy for Q3. Let me know your availability.</p><p>Best regards,<br>Sarah Mitchell<br>Marketing Director, PublisherHQ</p>`,
        timestamp: new Date(now.getTime() - 1800000), read: false, starred: true, folder: 'inbox',
        attachments: [{ name: 'Q2_Report.pdf', size: '2.4 MB', type: 'pdf' }, { name: 'Campaign_Data.xlsx', size: '890 KB', type: 'xlsx' }],
      },
      {
        id: 'e2', from: 'James Chen', fromEmail: 'james@bookmetrics.io',
        to: 'You', toEmail: 'you@scribecount.com',
        subject: 'Integration API Update - Action Required',
        preview: 'We have released a new version of our API (v3.2). Please review the breaking changes before the migration deadline...',
        body: `<p>Hello,</p><p>We have released a new version of our API (<strong>v3.2</strong>). There are some breaking changes that will affect your current integration.</p><p>Please review the migration guide and update your endpoints before <strong>May 15, 2026</strong>.</p><p>Key changes:</p><ul><li>Authentication endpoint moved to /auth/v3/</li><li>Rate limiting updated to 1000 req/min</li><li>New webhook format for real-time events</li></ul><p>Full documentation: <a href="#">docs.bookmetrics.io/v3</a></p><p>Thanks,<br>James Chen<br>Developer Relations</p>`,
        timestamp: new Date(now.getTime() - 3600000), read: false, starred: false, folder: 'inbox',
        attachments: [{ name: 'API_Migration_Guide.pdf', size: '1.8 MB', type: 'pdf' }],
      },
      {
        id: 'e3', from: 'Newsletter Bot', fromEmail: 'newsletter@scribecount.com',
        to: 'All Subscribers', toEmail: 'subscribers@scribecount.com',
        subject: 'Your Weekly Performance Digest',
        preview: 'Here is your weekly performance summary. Total emails sent: 15,420. Average open rate: 38.5%...',
        body: `<p>Hi there,</p><p>Here is your weekly performance summary for the past 7 days:</p><ul><li><strong>Emails Sent:</strong> 15,420</li><li><strong>Average Open Rate:</strong> 38.5%</li><li><strong>Click Rate:</strong> 6.2%</li><li><strong>New Subscribers:</strong> 234</li><li><strong>Unsubscribes:</strong> 12</li></ul><p>Your top-performing campaign was "Spring Sale Announcement" with a 52% open rate.</p><p>— ScribeCount Analytics</p>`,
        timestamp: new Date(now.getTime() - 7200000), read: true, starred: false, folder: 'inbox',
        attachments: [],
      },
      {
        id: 'e4', from: 'Emily Rodriguez', fromEmail: 'emily@creativelabs.co',
        to: 'You', toEmail: 'you@scribecount.com',
        subject: 'Design mockups for the new template builder',
        preview: 'I have completed the initial design mockups for the drag-and-drop template builder. Attached are the Figma files...',
        body: `<p>Hey!</p><p>I've completed the initial design mockups for the drag-and-drop template builder. I'm really excited about the direction we're taking with the glassmorphism design language.</p><p>Here's what's included:</p><ul><li>Main editor layout with sidebar panel</li><li>Block library with 24 pre-designed components</li><li>Mobile preview mode</li><li>Dark mode variant</li></ul><p>Let me know what you think! I can make revisions by end of week.</p><p>Cheers,<br>Emily</p>`,
        timestamp: new Date(now.getTime() - 14400000), read: false, starred: true, folder: 'inbox',
        attachments: [{ name: 'Template_Builder_Mockups.fig', size: '14.2 MB', type: 'fig' }, { name: 'Preview_Screenshots.zip', size: '8.6 MB', type: 'zip' }],
      },
      {
        id: 'e5', from: 'Alex Thompson', fromEmail: 'alex@growthstack.com',
        to: 'You', toEmail: 'you@scribecount.com',
        subject: 'Partnership Opportunity - Email Analytics',
        preview: 'We at GrowthStack would love to explore a partnership with ScribeCount. Our audience analytics tool could complement...',
        body: `<p>Hi,</p><p>We at GrowthStack would love to explore a partnership with ScribeCount. Our audience analytics tool could complement your email marketing platform beautifully.</p><p>Proposed collaboration:</p><ul><li>Shared analytics dashboard</li><li>Cross-platform audience insights</li><li>Joint webinar series</li><li>Co-branded content</li></ul><p>Would you be available for a 30-minute call next week?</p><p>Best,<br>Alex Thompson<br>Head of Partnerships, GrowthStack</p>`,
        timestamp: new Date(now.getTime() - 28800000), read: true, starred: false, folder: 'inbox',
        attachments: [],
      },
      {
        id: 'e6', from: 'DevOps Alert', fromEmail: 'alerts@scribecount.com',
        to: 'You', toEmail: 'you@scribecount.com',
        subject: 'Server Performance Alert - High CPU Usage',
        preview: 'CPU usage on email-worker-03 has exceeded 85% threshold for the past 15 minutes. Auto-scaling has been triggered...',
        body: `<p><strong>⚠️ Performance Alert</strong></p><p>CPU usage on <code>email-worker-03</code> has exceeded 85% threshold for the past 15 minutes.</p><p>Details:</p><ul><li>Server: email-worker-03 (us-east-1)</li><li>CPU: 87.3%</li><li>Memory: 72.1%</li><li>Active connections: 1,247</li></ul><p>Auto-scaling has been triggered. Two additional instances are spinning up.</p><p>— ScribeCount DevOps</p>`,
        timestamp: new Date(now.getTime() - 43200000), read: true, starred: false, folder: 'inbox',
        attachments: [],
      },
      {
        id: 'e7', from: 'Maria Santos', fromEmail: 'maria@contentforge.io',
        to: 'You', toEmail: 'you@scribecount.com',
        subject: 'Re: Content calendar for May',
        preview: 'Thanks for sending over the content calendar! I have a few suggestions for the blog post topics we discussed...',
        body: `<p>Thanks for sending over the content calendar!</p><p>I have a few suggestions for the blog post topics we discussed:</p><ol><li>"10 Email Marketing Trends for 2026" - Perfect for the launch week</li><li>"How to Build High-Converting Email Funnels" - Great evergreen content</li><li>"A/B Testing Best Practices" - Ties in nicely with the new feature</li></ol><p>I can start drafting the first article by Monday. Sound good?</p><p>— Maria</p>`,
        timestamp: new Date(now.getTime() - 57600000), read: false, starred: false, folder: 'inbox',
        attachments: [{ name: 'Content_Calendar_May.docx', size: '245 KB', type: 'docx' }],
      },
      {
        id: 'e8', from: 'You', fromEmail: 'you@scribecount.com',
        to: 'Sarah Mitchell', toEmail: 'sarah@publisherhq.com',
        subject: 'Re: Q2 Marketing Campaign Results',
        preview: 'Great news on the Q2 results! Let\'s schedule that call for Thursday at 2 PM EST. I have some ideas for the Q3 strategy...',
        body: `<p>Hi Sarah,</p><p>Great news on the Q2 results! I'm thrilled to see the improvements.</p><p>Let's schedule that call for Thursday at 2 PM EST. I have some ideas for the Q3 strategy that I think will push our numbers even higher.</p><p>Talk soon!</p>`,
        timestamp: new Date(now.getTime() - 900000), read: true, starred: false, folder: 'sent',
        attachments: [],
      },
      {
        id: 'e9', from: 'You', fromEmail: 'you@scribecount.com',
        to: 'Team', toEmail: 'team@scribecount.com',
        subject: 'New feature launch plan - Template Builder',
        preview: 'Team, here is the plan for the template builder launch next month. Please review and share your feedback...',
        body: `<p>Team,</p><p>Here's the plan for the template builder launch next month:</p><ul><li>Beta release: May 1st</li><li>Internal testing: May 1-7</li><li>Public launch: May 15th</li><li>Marketing campaign: May 15-30</li></ul><p>Please review and share your feedback by Friday.</p><p>Thanks!</p>`,
        timestamp: new Date(now.getTime() - 86400000), read: true, starred: false, folder: 'sent',
        attachments: [{ name: 'Launch_Plan.pdf', size: '1.2 MB', type: 'pdf' }],
      },
      {
        id: 'e10', from: 'You', fromEmail: 'you@scribecount.com',
        to: 'Alex Thompson', toEmail: 'alex@growthstack.com',
        subject: 'Re: Partnership Opportunity',
        preview: 'Thanks for reaching out. I am interested in exploring this partnership...',
        body: `<p>Hi Alex,</p><p>Thanks for reaching out. I'm interested in exploring this partnership. Let's set up a call next Wednesday at 10 AM.</p><p>Best,</p>`,
        timestamp: new Date(now.getTime() - 172800000), read: true, starred: false, folder: 'sent',
        attachments: [],
      },
      {
        id: 'e11', from: 'You', fromEmail: 'you@scribecount.com',
        to: 'Emily Rodriguez', toEmail: 'emily@creativelabs.co',
        subject: 'Brand guidelines update',
        preview: 'Working on updating our brand guidelines document. Here are the new color palette and typography choices...',
        body: `<p>Draft in progress...</p><p>New brand colors:</p><ul><li>Primary: #16263e</li><li>Accent: #3b82f6</li></ul>`,
        timestamp: new Date(now.getTime() - 3600000), read: true, starred: false, folder: 'drafts',
        attachments: [],
      },
      {
        id: 'e12', from: 'You', fromEmail: 'you@scribecount.com',
        to: 'All Subscribers', toEmail: 'subscribers@scribecount.com',
        subject: 'May Newsletter - Template Builder Launch',
        preview: 'Exciting news! We are launching our new drag-and-drop template builder this month...',
        body: `<p>Exciting news! We're launching our new drag-and-drop template builder this month. Stay tuned for early access.</p>`,
        timestamp: new Date(now.getTime() + 172800000), read: true, starred: false, folder: 'scheduled',
        attachments: [],
      },
      {
        id: 'e13', from: 'Win A Prize!', fromEmail: 'spam@phishing.xyz',
        to: 'You', toEmail: 'you@scribecount.com',
        subject: 'You have won a $1000 gift card!!! Click here NOW',
        preview: 'Congratulations! You have been selected as the winner. Click here to claim your prize immediately...',
        body: `<p>Congratulations! Click below to claim your prize!</p>`,
        timestamp: new Date(now.getTime() - 86400000), read: true, starred: false, folder: 'spam',
        attachments: [],
      },
      {
        id: 'e14', from: 'Old Newsletter', fromEmail: 'old@newsletter.com',
        to: 'You', toEmail: 'you@scribecount.com',
        subject: 'Archived: Old campaign data',
        preview: 'This email was moved to trash on April 20...',
        body: `<p>This is old archived content.</p>`,
        timestamp: new Date(now.getTime() - 432000000), read: true, starred: false, folder: 'trash',
        attachments: [],
      },
      {
        id: 'e15', from: 'Ryan Park', fromEmail: 'ryan@authortools.net',
        to: 'You', toEmail: 'you@scribecount.com',
        subject: 'Subscriber segmentation best practices',
        preview: 'I came across your recent blog post about segmentation and wanted to share some additional insights from our research...',
        body: `<p>Hi,</p><p>I came across your recent blog post about segmentation and wanted to share some additional insights from our research.</p><p>We found that behavioral segmentation based on purchase history yields <strong>3x higher engagement</strong> than demographic segmentation alone.</p><p>Happy to discuss further if you're interested.</p><p>— Ryan Park<br>Author Tools</p>`,
        timestamp: new Date(now.getTime() - 72000000), read: false, starred: false, folder: 'inbox',
        attachments: [],
      },
    ];
  }
}
