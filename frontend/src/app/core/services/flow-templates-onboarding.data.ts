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
    description: 'Delivers promised free content instantly on sign-up. Frames gift as beginning of a relationship. Sets expectations for future emails. Goal: fulfill promise instantly, establish credibility and trust.',
    goalExit: 'Free content delivered and reader opens the download link',
    estimatedSetupMinutes: 20,
    steps: [
      { id: 's1', type: 'trigger', label: 'Trigger', detail: 'New subscriber opts in via reader magnet form' },
      { id: 's2', type: 'email', label: 'Delivery Email', detail: 'Lead with download link prominently. Warm note framing gift as beginning of relationship, not standalone transaction. Invite reply or connection.' },
      { id: 's3', type: 'wait', label: 'Wait 1 Day', detail: 'Delay: 1 day' },
      { id: 's4', type: 'condition', label: 'Downloaded?', detail: 'If clicked download — tag as engaged; else — resend nudge' },
      { id: 's5', type: 'goal-exit', label: 'Goal Exit', detail: 'Reader opens download link' },
    ]
  },
];
