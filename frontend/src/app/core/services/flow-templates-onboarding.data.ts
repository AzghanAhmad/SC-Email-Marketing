import { FlowTemplate } from './mock-data.service';

export const ONBOARDING_TEMPLATES: FlowTemplate[] = [
  {
    id: 't1', name: 'Welcome Sequence (4-Part)', family: 'onboarding', priority: 'day-one',
    description: 'Four-email onboarding series: Welcome, Story Behind the Author, World of Your Books, and The Invitation. Open rates exceed 50%. The cornerstone of every author email program.',
    goalExit: 'Reader clicks a book link or makes a first purchase',
    estimatedSetupMinutes: 45,
    steps: [
      { id: 's1', type: 'trigger', label: 'Trigger', detail: 'New subscriber joins list' },
      { id: 's2', type: 'email', label: 'Email 1 — Welcome', detail: 'Introduce yourself, set expectations, deliver lead magnet if promised. Goal: strong first impression, establish author brand.' },
      { id: 's3', type: 'wait', label: 'Wait 1–2 Days', detail: 'Delay: 1–2 days' },
      { id: 's4', type: 'email', label: 'Email 2 — Story Behind the Author', detail: 'Your background, writing journey, and passion. Personal and memorable. Goal: emotional connection beyond the books.' },
      { id: 's5', type: 'wait', label: 'Wait 2–3 Days', detail: 'Delay: 2–3 days' },
      { id: 's6', type: 'email', label: 'Email 3 — World of Your Books', detail: 'Introduce catalog, highlight best entry-point title. Soft sales moment, not a hard pitch. Goal: guide toward first purchase.' },
      { id: 's7', type: 'wait', label: 'Wait 3–5 Days', detail: 'Delay: 3–5 days' },
      { id: 's8', type: 'email', label: 'Email 4 — The Invitation', detail: 'Reader group, key platform, or what to expect. Direct CTA toward most important title. Goal: complete onboarding, convert warm subscribers.' },
      { id: 's9', type: 'goal-exit', label: 'Goal Exit', detail: 'Reader clicks a book link' },
    ]
  },
  {
    id: 't2', name: 'Reader Magnet Delivery', family: 'onboarding', priority: 'day-one',
    description: 'Delivers promised free content instantly on sign-up. Two emails + conditional branch: delivery email fires in seconds, 24–48hr check detects non-downloaders, follow-up removes barriers. Connects to Welcome Sequence on completion.',
    goalExit: 'Free content delivered and reader clicks the download link',
    estimatedSetupMinutes: 20,
    steps: [
      { id: 's1', type: 'trigger', label: 'Trigger', detail: 'New subscriber opts in via reader magnet form — fires within seconds of form submission' },
      { id: 's2', type: 'email', label: 'Delivery Email', detail: 'Lead with download link first. Brief warm introduction (2–3 sentences). Forward frame toward welcome sequence. Subject: "Your copy of [Title] is here"' },
      { id: 's3', type: 'wait', label: 'Wait 24–48 Hours', detail: 'ScribeCount checks whether reader clicked the download link during this window' },
      { id: 's4', type: 'condition', label: 'Downloaded?', detail: 'YES → tag confirmed-download, move to Welcome Sequence. NO → send follow-up email.' },
      { id: 's5', type: 'email', label: 'Delivery Follow-Up', detail: 'Warm, helpful tone. Resend link prominently. Acknowledge possible spam filter. Invite reply for support. Subject: "Did your copy of [Title] arrive okay?"' },
      { id: 's6', type: 'wait', label: 'Wait 1–2 Days', detail: 'Move to Welcome Sequence regardless of download status' },
      { id: 's7', type: 'goal-exit', label: 'Goal Exit', detail: 'Reader clicks download link — tagged confirmed-download, transitions to Welcome Sequence' },
    ]
  },
];
