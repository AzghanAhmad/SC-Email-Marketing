import { Flow } from './mock-data.service';

export const LAUNCH_FLOWS: Flow[] = [
  {
    id: '8', name: 'Preorder Confirmation & Nurture', family: 'launch', priority: 'pre-launch',
    description: 'Three-phase flow: Confirmation honors the commitment immediately, Nurture sequence keeps enthusiasm alive through the wait, Fulfillment delivers the payoff on release day. Preorder readers are suppressed from the general launch broadcast.',
    status: 'active', triggers: 312,
    goalExit: 'Fulfillment email opened and download link clicked',
    steps: [
      { id: 's1', type: 'trigger', label: 'Trigger', detail: 'Preorder completed in direct store — fires in real time. Reader is tagged as preorder-reader immediately, which applies suppression to the launch day broadcast campaign.' },
      { id: 's2', type: 'email', label: 'Phase 1 — Preorder Confirmation', detail: 'Subject: "Your preorder for [Title] is confirmed" or "[Title] is reserved for you — here\'s what to expect" — Confirm transaction details and release date. Explicitly clarify billing: "Your card will be charged on [release date], when the book is delivered to you." Acknowledge what the reader did: they committed early, before reviews were in, on trust alone. Brief specific tease of what\'s coming — something not in the official blurb. Close by setting expectations: "Preorder readers hear from me before anyone else does."' },
      { id: 's3', type: 'wait', label: 'Wait — Anchored to Release Date', detail: 'All nurture emails are scheduled relative to the release date anchor. Updating the release date automatically reschedules every email in the sequence. Late-joining preorder readers enter the flow at the correct point based on how far they are from release.' },
      { id: 's4', type: 'email', label: 'Phase 2a — Behind the Scenes (7 weeks before release)', detail: 'Subject: "What it was really like to write [Title]" — Exclusive to preorder readers. Personal note about the book: what surprised you, what challenged you, what you\'re most proud of. The anecdote you haven\'t shared anywhere else. The character decision that changed everything. Write it like a letter to a reader friend who asked what it was really like. This email exists nowhere else in your marketing.' },
      { id: 's5', type: 'email', label: 'Phase 2b — First Chapter or Excerpt (4 weeks before release)', detail: 'Subject: "An early chapter, just for you" — Reward and commitment-reinforcement. A reader who reads your first chapter and finds it as good as they hoped will be more impatient for release day, not less. Alternative: a scene from a previous book with thematic resonance if the book isn\'t finalized.' },
      { id: 's6', type: 'email', label: 'Phase 2c — Cover Story (2 weeks before release)', detail: 'Subject: "The story behind the cover" — The brief, the design process, the element that nearly didn\'t make it in, the detail you love that most readers won\'t notice on first look. Works well midway through the window when initial excitement has settled and release day is still a distance away.' },
      { id: 's7', type: 'email', label: 'Phase 2d — Countdown (1 week before release)', detail: 'Subject: "One week away" — Brief and energetic. Release date now presented as imminent rather than distant. One or two lines capturing your excitement. Note that the fulfillment email is coming soon. The drumroll before the payoff — its job is to make the fulfillment email land with maximum emotional impact.' },
      { id: 's8', type: 'email', label: 'Phase 3 — Preorder Fulfillment (release day)', detail: 'Subject: "It\'s here. [Title] is finally in your hands." — Celebration first, not transaction. Lead with genuine excitement, not "your download link is below." Download link clearly labeled and prominently placed. State release date explicitly. Acknowledge the reader\'s role: "You preordered before the reviews were in, on the basis of trust alone. That matters more than you probably know." Plant review seed: "If you love it, I\'d be so grateful for a review when you\'re done — I\'ll follow up with a link in a few days." After fulfillment, reader transitions to standard post-purchase flow.' },
      { id: 's9', type: 'goal-exit', label: 'Goal Exit', detail: 'Fulfillment email opened and download link clicked — reader transitions to post-purchase flow. Preorder-reader tag suppresses them from the general launch broadcast automatically.' },
    ]
  },
  {
    id: '9', name: 'Series Completion', family: 'launch', priority: 'pre-launch',
    description: 'Catches readers at the emotionally charged moment when they finish your series. Four routing scenarios based on purchase history and catalog position. One of the most reliably profitable automations in the flow library.',
    status: 'active', triggers: 178,
    goalExit: 'Reader purchases the recommended next title',
    steps: [
      { id: 's1', type: 'trigger', label: 'Trigger', detail: 'Reader purchases the final book in a series from your direct store. ScribeCount identifies the purchase as a series completion event based on AuthorVault catalog metadata — the book\'s position in the series (final installment, mid-series, standalone) is stored in AuthorVault and informs routing.' },
      { id: 's2', type: 'wait', label: 'Wait 3–5 Days', detail: 'Delay: 3–5 days after purchase (configurable). Long enough for the reader to have finished reading. Short enough to catch emotional momentum before it fades. For shorter books a shorter wait may be appropriate; for longer novels a slightly longer window may better match reading pace.' },
      { id: 's3', type: 'condition', label: 'Catalog Position Check', detail: 'ScribeCount cross-references purchase history against AuthorVault catalog structure. Four routing paths: (1) Final book in series + more series available → Series Completion email with next-series recommendation. (2) Final book in series + only standalones → Standalone recommendation email. (3) Mid-series book → In-series continuation email (shorter wait, simpler recommendation). (4) Final book + catalog exhausted → Catalog-complete relationship email.' },
      { id: 's4', type: 'email', label: 'Scenario 1 — Next Series Recommendation', detail: 'Subject: "So you finished [Series Name]…" or "The next chapter in [World Name]" — Acknowledge the milestone specifically (1–2 sentences). Single targeted recommendation: the title most likely to resonate with a reader who just finished this series. Brief explanation of the connection — shared world, emotional register, character complexity. One CTA, one link. "If you loved [Series] for [specific quality], [Next Title] is the book I\'d put in your hands next."' },
      { id: 's5', type: 'email', label: 'Scenario 2 — Standalone Recommendation', detail: 'Subject: "What to read after [Final Title]" — Reader finished your only series. Position the standalone as a different kind of excellence, not a lesser commitment. Lead with what\'s most similar: emotional register, character complexity, prose style. "Your standalone offers the same thing in a different format." One CTA.' },
      { id: 's6', type: 'email', label: 'Scenario 3 — In-Series Continuation', detail: 'Subject: "[Character Name] isn\'t quite done with you yet" — Simpler than the series-end variation. Warm, direct recommendation for the next book in the sequence. Brief hook referencing where the story left off without spoiling. "If you\'ve just finished Book Two — Book Three picks up right where that ending left you." Shorter wait period than series-end scenario.' },
      { id: 's7', type: 'email', label: 'Scenario 4 — Catalog Complete', detail: 'Subject: "You finished the series. What now?" — Reader has read everything. No purchase recommendation — relationship deepening instead. Tell them what\'s coming (even without a release date). Invite them into your community. Offer something exclusive: deleted scene, character Q&A, world-building document. Give them a reason to stay engaged and a sense that their patience is being rewarded with access rather than silence.' },
      { id: 's8', type: 'condition', label: 'Purchased Next Title?', detail: 'If reader purchases recommended title — goal exit. If not — reader returns to standard email audience and continues receiving newsletters and campaigns.' },
      { id: 's9', type: 'goal-exit', label: 'Goal Exit', detail: 'Reader purchases recommended next title — catalog read-through extended. Flow ends cleanly; post-purchase sequence handles the new purchase.' },
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
