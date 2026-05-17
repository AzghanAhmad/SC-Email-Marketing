import { FlowTemplate } from './mock-data.service';

export const LAUNCH_TEMPLATES: FlowTemplate[] = [
  {
    id: 't6', name: 'Preorder Confirmation & Nurture', family: 'launch', priority: 'pre-launch',
    description: 'Three-phase flow anchored to release date. Confirmation honors commitment immediately. Nurture sequence (4 emails) keeps enthusiasm alive. Fulfillment delivers the payoff. Preorder readers suppressed from launch broadcast.',
    goalExit: 'Fulfillment email opened and download link clicked',
    estimatedSetupMinutes: 45,
    steps: [
      { id: 's1', type: 'trigger', label: 'Trigger', detail: 'Preorder completed — reader tagged as preorder-reader immediately' },
      { id: 's2', type: 'email', label: 'Preorder Confirmation', detail: 'Confirm transaction and release date. Clarify billing timing. Acknowledge early commitment. Brief tease. "Preorder readers hear from me first."' },
      { id: 's3', type: 'wait', label: 'Release-Date Anchor', detail: 'All nurture emails scheduled relative to release date. Updating release date reschedules everything automatically.' },
      { id: 's4', type: 'email', label: 'Behind the Scenes (7 weeks before)', detail: 'Exclusive personal note about writing the book. The anecdote you haven\'t shared anywhere else.' },
      { id: 's5', type: 'email', label: 'Excerpt (4 weeks before)', detail: 'First chapter or compelling excerpt. Reward and commitment-reinforcement.' },
      { id: 's6', type: 'email', label: 'Cover Story (2 weeks before)', detail: 'The story behind the cover — design process, the detail most readers won\'t notice.' },
      { id: 's7', type: 'email', label: 'Countdown (1 week before)', detail: 'Brief and energetic. Release date now imminent. The drumroll before the payoff.' },
      { id: 's8', type: 'email', label: 'Preorder Fulfillment (release day)', detail: 'Celebration first. Download link prominently placed. Acknowledge reader\'s role. Plant review seed.' },
      { id: 's9', type: 'goal-exit', label: 'Goal Exit', detail: 'Download link clicked — reader transitions to post-purchase flow' },
    ]
  },
  {
    id: 't7', name: 'Series Completion', family: 'launch', priority: 'pre-launch',
    description: 'Four routing scenarios based on catalog position and purchase history. Catches readers at the moment of highest emotional readiness. One of the most reliably profitable automations in the flow library.',
    goalExit: 'Reader purchases the recommended next title',
    estimatedSetupMinutes: 35,
    steps: [
      { id: 's1', type: 'trigger', label: 'Trigger', detail: 'Reader purchases final book in a series — identified via AuthorVault catalog metadata' },
      { id: 's2', type: 'wait', label: 'Wait 3–5 Days', detail: 'Configurable. Long enough to finish reading, short enough to catch emotional momentum.' },
      { id: 's3', type: 'condition', label: 'Catalog Position Check', detail: 'Routes to one of four scenarios based on purchase history and AuthorVault catalog structure' },
      { id: 's4', type: 'email', label: 'Scenario 1 — Next Series', detail: 'Acknowledge milestone. Single targeted recommendation with connection explanation. One CTA.' },
      { id: 's5', type: 'email', label: 'Scenario 2 — Standalone', detail: 'Lead with what\'s most similar. Position as different kind of excellence, not lesser commitment.' },
      { id: 's6', type: 'email', label: 'Scenario 3 — Mid-Series', detail: 'Warm direct recommendation for next book in sequence. Brief hook without spoilers.' },
      { id: 's7', type: 'email', label: 'Scenario 4 — Catalog Complete', detail: 'Relationship deepening. What\'s coming, community invite, exclusive content.' },
      { id: 's8', type: 'goal-exit', label: 'Goal Exit', detail: 'Reader purchases recommended next title' },
    ]
  },
  {
    id: 't8', name: 'Review Request', family: 'launch', priority: 'pre-launch',
    description: 'Asks for social proof at the right moment — when reading experience is fresh, not immediately upon purchase.',
    goalExit: 'Reader clicks a review platform link',
    estimatedSetupMinutes: 20,
    steps: [
      { id: 's1', type: 'trigger', label: 'Trigger', detail: '5 days after digital delivery confirmed opened' },
      { id: 's2', type: 'email', label: 'Review Ask', detail: 'Invite honest review while enthusiasm is at its peak.' },
      { id: 's3', type: 'goal-exit', label: 'Goal Exit', detail: 'Reader clicks a review platform link' },
    ]
  },
  {
    id: 't8b', name: 'ARC Invitation', family: 'launch',
    description: 'Invites most engaged readers to receive a free early copy in exchange for an honest review at launch. Builds launch-day review base before book goes live.',
    goalExit: 'Reader accepts ARC invitation and is tagged arc-reader',
    estimatedSetupMinutes: 25,
    steps: [
      { id: 's1', type: 'trigger', label: 'Trigger', detail: 'Sent to most engaged subscribers segment' },
      { id: 's2', type: 'email', label: 'ARC Invitation', detail: 'Explain what an ARC is. Outline simple expectations: timing and where to post review. Convey exclusive insider nature so readers feel genuinely selected, not mass-solicited.' },
      { id: 's3', type: 'condition', label: 'Accepted?', detail: 'If clicked accept — tag as arc-reader; else — no action' },
      { id: 's4', type: 'goal-exit', label: 'Goal Exit', detail: 'Reader tagged as arc-reader' },
    ]
  },
  {
    id: 't8c', name: 'ARC Confirmation & Follow-up', family: 'launch',
    description: 'Delivers ARC copy, checks in during reading, then follows up near release to maximize review conversion. Goal: maximize review conversion, ensure advance reader program translates into launch-day impact.',
    goalExit: 'Reader posts review on launch day',
    estimatedSetupMinutes: 30,
    steps: [
      { id: 's1', type: 'trigger', label: 'Trigger', detail: 'Tag added: arc-reader' },
      { id: 's2', type: 'email', label: 'ARC Delivery', detail: 'Deliver ARC immediately and reliably.' },
      { id: 's3', type: 'wait', label: 'Wait 3 Days', detail: 'Delay: 3 days' },
      { id: 's4', type: 'email', label: 'Check-In Email', detail: 'Warm check-in, no pressure.' },
      { id: 's5', type: 'wait', label: 'Wait Until Near Release', detail: 'Wait until 3–5 days before release date' },
      { id: 's6', type: 'email', label: 'ARC Follow-up', detail: 'Gentle reminder to post review. Warm and appreciative, not pressuring. Include direct links to review pages on key platforms.' },
      { id: 's7', type: 'goal-exit', label: 'Goal Exit', detail: 'Reader posts review — launch-day social proof secured' },
    ]
  },
  {
    id: 't8d', name: 'Book Launch', family: 'launch',
    description: 'High-energy broadcast on or just before release day. Creates urgency and excitement. Generates concentrated burst of sales in the critical launch window to signal momentum to retail algorithms.',
    goalExit: 'Reader purchases or pre-orders on launch day',
    estimatedSetupMinutes: 20,
    steps: [
      { id: 's1', type: 'trigger', label: 'Trigger', detail: 'Scheduled broadcast — sent on or just before release day' },
      { id: 's2', type: 'email', label: 'Launch Announcement', detail: 'Share cover, compelling hook from blurb, early reader praise, clear CTA to purchase or pre-order link. Deliberate high-energy moment designed to create urgency and excitement.' },
      { id: 's3', type: 'goal-exit', label: 'Goal Exit', detail: 'Reader purchases or pre-orders' },
    ]
  },
  {
    id: 't8e', name: 'New Release Notification', family: 'launch',
    description: 'Targets existing readers who already know and trust your work — warmer and more direct than a launch email. Connects new release to titles they have already enjoyed.',
    goalExit: 'Reader purchases the new title',
    estimatedSetupMinutes: 20,
    steps: [
      { id: 's1', type: 'trigger', label: 'Trigger', detail: 'New title published — sent to backlist readers and engaged subscribers segment' },
      { id: 's2', type: 'email', label: 'New Release Notification', detail: 'Connect new release to titles they have already enjoyed. Highlight what makes this book fresh while feeling familiar. Clear immediate path to purchase.' },
      { id: 's3', type: 'goal-exit', label: 'Goal Exit', detail: 'Reader purchases new title' },
    ]
  },
];
