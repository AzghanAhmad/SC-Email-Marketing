import { Flow } from './mock-data.service';

export const LAUNCH_FLOWS: Flow[] = [
  {
    id: '8', name: 'Preorder Confirmation & Nurture', family: 'launch', priority: 'pre-launch',
    description: 'Confirms preorder, builds anticipation with behind-the-scenes content, then delivers the payoff on release day. Locks in sale early and builds launch momentum.',
    status: 'active', triggers: 312,
    goalExit: 'Release date arrives and book is delivered',
    steps: [
      { id: 's1', type: 'trigger', label: 'Trigger', detail: 'Preorder completed in direct store' },
      { id: 's2', type: 'email', label: 'Preorder Confirmation', detail: 'Subject: You are in — your preorder is confirmed! — Confirm order details, communicate expected release date, reassure payment not processed until delivery. Share brief teaser or note from author. Goal: lock in sale, reward early commitment, begin building momentum before launch window opens.' },
      { id: 's3', type: 'wait', label: 'Wait 3 Days', detail: 'Delay: 3 days' },
      { id: 's4', type: 'email', label: 'Behind the Scenes', detail: 'Subject: A sneak peek while you wait... — Keep anticipation alive during the wait. Share a teaser, countdown, or personal note.' },
      { id: 's5', type: 'wait', label: 'Wait Until Release', detail: 'Wait until release date' },
      { id: 's6', type: 'email', label: 'Preorder Fulfillment', detail: 'Subject: It is here — your book is ready! — One of the most anticipated emails in the funnel. Celebrate release with energy, include download link or delivery details. Invite sharing or review once read. Goal: deliver satisfying conclusion to pre-order experience, activate earliest buyers as launch-day advocates, generate immediate review and word-of-mouth momentum.' },
      { id: 's7', type: 'goal-exit', label: 'Goal Exit', detail: 'Release date arrives — reader moves to Post-Purchase flow' },
    ]
  },
  {
    id: '9', name: 'Series Completion', family: 'launch', priority: 'pre-launch',
    description: 'Catches readers at the emotionally loaded moment when they finish a series. Emotions high, investment deep — uniquely open to what comes next. One of the most reliably profitable automations.',
    status: 'active', triggers: 178,
    goalExit: 'Reader purchases the recommended next title',
    steps: [
      { id: 's1', type: 'trigger', label: 'Trigger', detail: 'Reader purchases final book in a series' },
      { id: 's2', type: 'wait', label: 'Wait 5 Days', detail: 'Delay: 5 days — give them time to finish reading' },
      { id: 's3', type: 'email', label: 'Series Wrap Email', detail: 'Subject: You finished the series — what is next? — Acknowledge milestone warmly, celebrate commitment to series. Present next recommended read with compelling hook that makes starting feel irresistible. Goal: eliminate gap between books, keep readers inside catalog ecosystem, maximize lifetime reading value of every fan earned.' },
      { id: 's4', type: 'condition', label: 'Clicked Next Title?', detail: 'If clicked — purchase flow; else — catalog nudge in 7 days' },
      { id: 's5', type: 'goal-exit', label: 'Goal Exit', detail: 'Reader purchases recommended next title' },
    ]
  },
  {
    id: '10', name: 'Review Request', family: 'launch', priority: 'pre-launch',
    description: 'Asks for social proof at the right moment — when reading experience is fresh, not immediately upon purchase.',
    status: 'active', triggers: 445,
    goalExit: 'Reader leaves a review on any platform',
    steps: [
      { id: 's1', type: 'trigger', label: 'Trigger', detail: '5 days after digital delivery confirmed opened' },
      { id: 's2', type: 'email', label: 'Review Ask', detail: 'Subject: Would you leave a quick review? — Invite honest review while enthusiasm is at its peak. Goal: capture social proof through reviews, extend reader journey deeper into catalog, strengthen connection before momentum fades.' },
      { id: 's3', type: 'wait', label: 'Wait 7 Days', detail: 'Delay: 7 days' },
      { id: 's4', type: 'condition', label: 'Left Review?', detail: 'If clicked review link — exit; else — gentle follow-up' },
      { id: 's5', type: 'goal-exit', label: 'Goal Exit', detail: 'Reader clicks a review platform link' },
    ]
  },
  {
    id: '14', name: 'ARC Invitation', family: 'launch',
    description: 'Invites most engaged readers to receive a free early copy in exchange for an honest review at launch. Builds launch-day review base before book goes live.',
    status: 'active', triggers: 89,
    goalExit: 'Reader accepts ARC invitation and is tagged arc-reader',
    steps: [
      { id: 's1', type: 'trigger', label: 'Trigger', detail: 'Segment: most engaged subscribers — sent as targeted broadcast or automated to high-engagement tag' },
      { id: 's2', type: 'email', label: 'ARC Invitation Email', detail: 'Subject: I would love your early eyes on this — Explain what an ARC is for unfamiliar readers. Outline simple expectations: timing and where to post review. Convey exclusive insider nature so readers feel genuinely selected, not mass-solicited. Goal: arrive on release day with reviews already in place, accelerate early visibility across retail platforms, deepen relationship with most loyal readers by making them part of your publishing process.' },
      { id: 's3', type: 'condition', label: 'Accepted?', detail: 'If clicked accept — tag as arc-reader, trigger ARC Confirmation flow; else — no action' },
      { id: 's4', type: 'goal-exit', label: 'Goal Exit', detail: 'Reader tagged as arc-reader — ARC Confirmation flow takes over' },
    ]
  },
  {
    id: '22', name: 'ARC Confirmation & Follow-up', family: 'launch',
    description: 'Delivers ARC copy to confirmed advance readers, checks in during reading, then follows up as release approaches to maximize review conversion.',
    status: 'active', triggers: 156,
    goalExit: 'Reader posts review on launch day',
    steps: [
      { id: 's1', type: 'trigger', label: 'Trigger', detail: 'Tag added: arc-reader' },
      { id: 's2', type: 'email', label: 'ARC Delivery', detail: 'Subject: You are in — here is your advance copy — Deliver ARC immediately and reliably.' },
      { id: 's3', type: 'wait', label: 'Wait 3 Days', detail: 'Delay: 3 days — give them time to start reading' },
      { id: 's4', type: 'email', label: 'Check-In Email', detail: 'Subject: How is the reading going? — Warm check-in, no pressure.' },
      { id: 's5', type: 'wait', label: 'Wait Until Near Release', detail: 'Wait until 3–5 days before release date' },
      { id: 's6', type: 'email', label: 'ARC Follow-up', detail: 'Subject: Release day is almost here — Gentle reminder to post review. Warm and appreciative, not pressuring. Acknowledge life gets busy. Include direct links to review pages on key platforms — remove every friction point between intention and action. Goal: maximize review conversion from ARC team, ensure advance reader program translates into measurable launch-day impact.' },
      { id: 's7', type: 'condition', label: 'Opened?', detail: 'If opened — tag as engaged-arc-reader' },
      { id: 's8', type: 'goal-exit', label: 'Goal Exit', detail: 'Reader posts review — launch-day social proof secured' },
    ]
  },
  {
    id: '23', name: 'New Release Notification', family: 'launch',
    description: 'Targets existing readers who already know and trust your work — warmer and more direct than a launch email. Connects new release to titles they have already enjoyed.',
    status: 'active', triggers: 621,
    goalExit: 'Reader purchases the new title',
    steps: [
      { id: 's1', type: 'trigger', label: 'Trigger', detail: 'New title published — sent to backlist readers and engaged subscribers segment' },
      { id: 's2', type: 'email', label: 'New Release Notification', detail: 'Subject: [New Title] is out — and I think you will love it — Unlike a launch email aimed at first-day momentum, this targets readers who already know and trust your work. Connect new release to titles they have already enjoyed. Highlight what makes this book fresh while feeling familiar. Clear immediate path to purchase. Goal: activate existing readership at moment new title enters market, turn backlist loyalty into frontlist sales.' },
      { id: 's3', type: 'condition', label: 'Purchased?', detail: 'If purchased — exit; else — no further action' },
      { id: 's4', type: 'goal-exit', label: 'Goal Exit', detail: 'Reader purchases new title' },
    ]
  },
  {
    id: '24', name: 'Book Launch', family: 'launch',
    description: 'High-energy broadcast on or just before release day. Creates urgency and excitement. Generates concentrated burst of sales in the critical launch window to signal momentum to retail algorithms.',
    status: 'active', triggers: 1204,
    goalExit: 'Reader purchases or pre-orders on launch day',
    steps: [
      { id: 's1', type: 'trigger', label: 'Trigger', detail: 'Scheduled broadcast — sent on or just before release day to full subscriber list or launch segment' },
      { id: 's2', type: 'email', label: 'Launch Announcement', detail: 'Subject: It is finally here! — Deliberate high-energy moment designed to create urgency and excitement. Share cover, compelling hook from blurb, early reader praise, clear CTA to purchase or pre-order link. Goal: generate concentrated burst of sales in critical launch window, signal momentum to retail algorithms, help book gain early visibility in the market.' },
      { id: 's3', type: 'goal-exit', label: 'Goal Exit', detail: 'Reader purchases or pre-orders — launch momentum achieved' },
    ]
  },
];
