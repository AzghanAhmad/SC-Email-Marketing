import { Flow } from './mock-data.service';

export const ONBOARDING_FLOWS: Flow[] = [
  {
    id: '1', name: 'Welcome Sequence', family: 'onboarding', priority: 'day-one',
    description: 'Four-email onboarding series: introduces you, your story, your catalog, and invites readers into your world. Open rates exceed 50% — your highest-read emails.',
    status: 'active', triggers: 1842,
    goalExit: 'Reader clicks a book link or makes a first purchase',
    steps: [
      { id: 's1', type: 'trigger', label: 'Trigger', detail: 'New subscriber joins list' },
      { id: 's2', type: 'email', label: 'Email 1 — Welcome', detail: 'Subject: Welcome to my reader community! — Introduce yourself, set expectations, deliver any promised lead magnet. Goal: strong first impression, establish author brand.' },
      { id: 's3', type: 'wait', label: 'Wait 1–2 Days', detail: 'Delay: 1–2 days (quiet hours applied)' },
      { id: 's4', type: 'email', label: 'Email 2 — The Story Behind the Author', detail: 'Subject: The story behind the books — Your background, writing journey, and passion. Personal and memorable. Goal: emotional connection beyond the books.' },
      { id: 's5', type: 'wait', label: 'Wait 2–3 Days', detail: 'Delay: 2–3 days' },
      { id: 's6', type: 'email', label: 'Email 3 — The World of Your Books', detail: 'Subject: The books, the world, and what is coming next — Introduce catalog, highlight best entry-point title. Soft sales moment, not a hard pitch. Goal: guide toward first purchase.' },
      { id: 's7', type: 'wait', label: 'Wait 3–5 Days', detail: 'Delay: 3–5 days' },
      { id: 's8', type: 'email', label: 'Email 4 — The Invitation', detail: 'Subject: One more thing before we get started — Extend a meaningful invitation: reader group, key platform, or what to expect going forward. Direct CTA toward most important title. Goal: complete onboarding, convert warm subscribers.' },
      { id: 's9', type: 'condition', label: 'Clicked Book Link?', detail: 'If clicked — goal exit; else — continue to ongoing list' },
      { id: 's10', type: 'goal-exit', label: 'Goal Exit', detail: 'Reader clicks a book link — moves to post-purchase journey' },
    ]
  },
  {
    id: '2', name: 'Reader Magnet Delivery', family: 'onboarding', priority: 'day-one',
    description: 'Delivers the promised free content instantly on sign-up, frames it as the beginning of a relationship, and sets expectations for future emails.',
    status: 'active', triggers: 934,
    goalExit: 'Free content delivered and reader opens the download link',
    steps: [
      { id: 's1', type: 'trigger', label: 'Trigger', detail: 'New subscriber opts in via reader magnet form — fires within seconds of form submission confirmation' },
      { id: 's2', type: 'email', label: 'Delivery Email', detail: 'Subject: Your copy of [Title] is here — Lead with download link first, above everything else. Brief warm introduction (2–3 sentences). Forward frame: "I\'ll be in touch soon with a bit more about who I am." Goal: fulfill promise instantly, establish credibility, create strongest possible first impression.' },
      { id: 's3', type: 'wait', label: 'Wait 24–48 Hours', detail: 'Delay: 24–48 hours — ScribeCount checks whether the reader clicked the download link during this window' },
      { id: 's4', type: 'condition', label: 'Downloaded? (Link Clicked?)', detail: 'YES: tag as confirmed-download, move to Welcome Sequence. NO: send delivery follow-up email before proceeding to Welcome Sequence.' },
      { id: 's5', type: 'email', label: 'Delivery Follow-Up (Non-Downloaders)', detail: 'Subject: Did your copy of [Title] arrive okay? — Warm, helpful tone. Resend download link prominently. Acknowledge email may have gone to spam. Invite reply for direct support. No pressure, no urgency. Goal: remove whatever barrier prevented the first download.' },
      { id: 's6', type: 'wait', label: 'Wait 1–2 Days', detail: 'Delay: 1–2 days — then move to Welcome Sequence regardless of download status' },
      { id: 's7', type: 'goal-exit', label: 'Goal Exit', detail: 'Reader clicks download link (either delivery email or follow-up) — tagged as confirmed-download, transitions to Welcome Sequence' },
    ]
  },
];
