import { FlowTemplate } from './mock-data.service';

export const LAUNCH_TEMPLATES: FlowTemplate[] = [
  {
    id: 't6', name: 'Preorder Confirmation & Nurture', family: 'launch', priority: 'pre-launch',
    description: 'Confirms preorder, builds anticipation, delivers payoff on release day. Locks in sale early and activates earliest buyers as launch-day advocates.',
    goalExit: 'Release date arrives and book is delivered',
    estimatedSetupMinutes: 40,
    steps: [
      { id: 's1', type: 'trigger', label: 'Trigger', detail: 'Preorder completed' },
      { id: 's2', type: 'email', label: 'Preorder Confirmation', detail: 'Confirm order, communicate release date, reassure payment not processed until delivery. Share brief teaser.' },
      { id: 's3', type: 'wait', label: 'Wait Until Release', detail: 'Wait until release date' },
      { id: 's4', type: 'email', label: 'Preorder Fulfillment', detail: 'Celebrate release with energy. Include download link. Invite sharing or review once read.' },
      { id: 's5', type: 'goal-exit', label: 'Goal Exit', detail: 'Release date arrives' },
    ]
  },
  {
    id: 't7', name: 'Series Completion', family: 'launch', priority: 'pre-launch',
    description: 'One of the most reliably profitable automations. Catches readers at the emotionally loaded moment when they finish a series — emotions high, investment deep.',
    goalExit: 'Reader purchases the recommended next title',
    estimatedSetupMinutes: 30,
    steps: [
      { id: 's1', type: 'trigger', label: 'Trigger', detail: 'Reader purchases final book in a series' },
      { id: 's2', type: 'wait', label: 'Wait 5 Days', detail: 'Delay: 5 days' },
      { id: 's3', type: 'email', label: 'Series Wrap Email', detail: 'Acknowledge milestone warmly. Present next recommended read with compelling hook that makes starting feel irresistible.' },
      { id: 's4', type: 'goal-exit', label: 'Goal Exit', detail: 'Reader purchases recommended next title' },
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
