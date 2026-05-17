import { Flow } from './mock-data.service';

export const TRANSACTION_FLOWS: Flow[] = [
  {
    id: '3', name: 'Order Confirmation & Digital Delivery', family: 'transaction', priority: 'pre-store',
    description: 'Immediate official receipt confirming the order, then delivers digital content. Absence of this email creates anxiety and support requests.',
    status: 'active', triggers: 621,
    goalExit: 'Digital content delivered and confirmed opened',
    steps: [
      { id: 's1', type: 'trigger', label: 'Trigger', detail: 'Completed order in direct store — fires in real time, within seconds of purchase confirmation' },
      { id: 's2', type: 'email', label: 'Order Confirmation', detail: 'Subject: Your order is confirmed — Summarize what was ordered, amount charged, delivery details. Warm on-brand message, not a cold generic receipt. Goal: instant reassurance, reduce support inquiries, set positive tone for every transaction that follows.' },
      { id: 's3', type: 'email', label: 'Digital Delivery', detail: 'Subject: Your book is ready to read — Download link goes FIRST. Clear prominent download link or access button with simple instructions. Note on compatible devices/apps. Offer to help with technical issues via reply. Goal: complete purchase experience seamlessly, minimize support requests, get book into reader hands immediately.' },
      { id: 's4', type: 'condition', label: 'First-Time Buyer?', detail: 'ScribeCount checks purchase history: first-time buyer → Post-Purchase Thank You flow; returning buyer → Repeat Purchase Thank You flow. Routing is automatic — no manual list management required.' },
      { id: 's5', type: 'goal-exit', label: 'Goal Exit', detail: 'Reader opens delivery email — routed to appropriate thank you flow based on purchase history' },
    ]
  },
  {
    id: '4', name: 'Post-Purchase Thank You', family: 'transaction', priority: 'pre-store',
    description: 'Sent immediately after a first purchase — confirms, appreciates, and opens the door to an ongoing reader relationship. Reduces buyer remorse and opens the door to a second sale.',
    status: 'active', triggers: 589,
    goalExit: 'Reader clicks a catalog or series link',
    steps: [
      { id: 's1', type: 'trigger', label: 'Trigger', detail: 'First-time purchase completed' },
      { id: 's2', type: 'email', label: 'Thank You Email', detail: 'Subject: Thank you — and a little something extra — Confirm purchase, express genuine appreciation. Suggest related title, invite reader group, or point toward review opportunity while excitement is fresh. Goal: reinforce buying decision, reduce remorse, open door to second sale.' },
      { id: 's3', type: 'goal-exit', label: 'Goal Exit', detail: 'Reader clicks a catalog or series link' },
    ]
  },
  {
    id: '20', name: 'Repeat Purchase Thank You', family: 'transaction',
    description: 'Triggered when a reader buys more than once — they have moved from casual buyer to engaged fan. Warmer and more personal than the first thank you. Acknowledges loyalty and rewards continued support.',
    status: 'active', triggers: 234,
    goalExit: 'Reader accepts exclusive perk or joins reader community',
    steps: [
      { id: 's1', type: 'trigger', label: 'Trigger', detail: 'Reader completes second or subsequent purchase' },
      { id: 's2', type: 'email', label: 'Loyalty Thank You', detail: 'Subject: You are back — and it means a lot — Warmer and more personal than first thank you. Acknowledge loyalty, make them feel recognized. Offer exclusive perk: early access, bonus, or reader community invitation. Goal: deepen relationship, increase lifetime reader value, cultivate loyal fan who recommends books to others.' },
      { id: 's3', type: 'goal-exit', label: 'Goal Exit', detail: 'Reader accepts perk or joins community' },
    ]
  },
  {
    id: '21', name: 'Post-Purchase Follow-up', family: 'transaction', priority: 'pre-store',
    description: 'Sent a few days after purchase when reading experience is fresh and emotion is high. Invites review, asks for feedback, or suggests next book while enthusiasm is at its peak.',
    status: 'active', triggers: 412,
    goalExit: 'Reader leaves a review or clicks next book link',
    steps: [
      { id: 's1', type: 'trigger', label: 'Trigger', detail: '3–5 days after digital delivery confirmed opened' },
      { id: 's2', type: 'email', label: 'Follow-up Email', detail: 'Subject: How are you getting on with [Book Title]? — Arrives when reading experience is fresh and emotion is high. Invite honest review, ask for feedback, or suggest next book in series while enthusiasm is at its peak. Goal: capture social proof through reviews, extend reader journey deeper into catalog, strengthen connection before momentum fades.' },
      { id: 's3', type: 'condition', label: 'Left Review or Clicked?', detail: 'If clicked review link or next book — goal exit; else — no further action' },
      { id: 's4', type: 'goal-exit', label: 'Goal Exit', detail: 'Reader leaves a review or clicks next book — momentum captured before it fades' },
    ]
  },
  {
    id: '5', name: 'Abandoned Cart', family: 'transaction', priority: 'pre-store',
    description: 'Recovers sales within reach. First email fires 1 hour after abandonment — while the book is still in the reader\'s mental foreground. Two-email sequence with goal exit on purchase completion.',
    status: 'active', triggers: 203,
    goalExit: 'Reader completes the purchase',
    steps: [
      { id: 's1', type: 'trigger', label: 'Trigger', detail: 'Reader adds book to cart and leaves store without progressing to checkout — lower intent than checkout abandonment' },
      { id: 's2', type: 'wait', label: 'Wait 1 Hour', detail: 'Delay: 1 hour (ScribeCount default, configurable) — enough time to confirm real abandonment without letting interest cool. An email at 60 minutes finds a reader who may still have the book open in another tab.' },
      { id: 's3', type: 'condition', label: 'Already Purchased?', detail: 'If purchase event received — goal exit immediately, post-purchase sequence begins. Reader never receives cart reminder for a book they already bought.' },
      { id: 's4', type: 'email', label: 'Cart Reminder — Email 1', detail: 'Subject: "[Title] is still waiting for you" — Lead with the book, not the cart. Include cover image. Brief specific hook reconnecting reader to why they wanted it. One line of compelling reader praise (social proof). One button back to the product page or pre-populated cart. Optional: light discount framed as one-time offer — use with caution, consistent discounts train readers to abandon deliberately.' },
      { id: 's5', type: 'wait', label: 'Wait 24 Hours', detail: 'Delay: 24 hours — if no purchase after first email, one final brief reminder' },
      { id: 's6', type: 'condition', label: 'Purchased?', detail: 'If purchased — goal exit; else — send final nudge' },
      { id: 's7', type: 'email', label: 'Final Nudge — Email 2', detail: 'Subject: "[Title] is still in your cart in case you\'ve been meaning to come back" — Two or three sentences maximum. Acknowledges this is a reminder, not a fresh pitch. No urgency language, no artificial deadlines. Just a light, final nudge for the reader who intended to return and got busy. After two emails, the flow ends.' },
      { id: 's8', type: 'goal-exit', label: 'Goal Exit', detail: 'Reader completes purchase at any point — flow stops immediately, post-purchase sequence begins. No further cart reminders sent.' },
    ]
  },
  {
    id: '6', name: 'Abandoned Checkout', family: 'transaction', priority: 'pre-store',
    description: 'Higher intent than abandoned cart — reader entered payment or shipping info. First email fires in 30 minutes. Two-email sequence. One of the highest ROI automations in the direct sales funnel.',
    status: 'active', triggers: 87,
    goalExit: 'Reader completes checkout',
    steps: [
      { id: 's1', type: 'trigger', label: 'Trigger', detail: 'Reader reaches checkout page, enters payment or shipping information, but does not complete purchase — significantly higher intent than cart abandonment' },
      { id: 's2', type: 'wait', label: 'Wait 30 Minutes', detail: 'Delay: 30 minutes (ScribeCount default, configurable) — faster than cart abandonment because intent is higher. Reader was in the middle of completing a transaction. The faster you reach them, the more likely the interruption is still fresh and reversible.' },
      { id: 's3', type: 'condition', label: 'Already Purchased?', detail: 'If purchase event received — goal exit immediately. Reader never receives checkout reminder for a book they already bought.' },
      { id: 's4', type: 'email', label: 'Checkout Reminder — Email 1', detail: 'Subject: "It looks like you didn\'t quite make it through checkout for [Title]" — Direct acknowledgment, not dancing around what happened. Slightly self-deprecating framing (problem might be on your end). Address technical friction: list accepted payment methods, mention guest checkout option if available, state money-back guarantee. "Hit reply and I\'ll sort it out personally" — opens direct support channel. Link restores cart or goes directly to checkout if platform supports it.' },
      { id: 's5', type: 'wait', label: 'Wait 24 Hours', detail: 'Delay: 24 hours — one follow-up for readers who didn\'t complete after first email' },
      { id: 's6', type: 'condition', label: 'Purchased?', detail: 'If purchased — goal exit; else — send 24-hour follow-up' },
      { id: 's7', type: 'email', label: '24-Hour Follow-Up — Email 2', detail: 'Subject: "Still thinking about [Title]?" — Shorter, warmer. Closes with clear invitation to reach out if anything went wrong. After two emails the flow ends — reader who didn\'t complete after two prompts has made their decision. Continuing would be intrusive rather than helpful.' },
      { id: 's8', type: 'goal-exit', label: 'Goal Exit', detail: 'Reader completes purchase — flow stops, post-purchase sequence begins. If no purchase after two emails, reader returns to standard email audience.' },
    ]
  },
  {
    id: '22', name: 'Review Request', family: 'transaction', priority: 'pre-store',
    description: 'A focused, standalone automation dedicated entirely to generating social proof. Fires 4–7 days after purchase as a single clear ask — more effective than burying the review request inside a longer email.',
    status: 'active', triggers: 387,
    goalExit: 'Reader clicks a review link on any platform',
    steps: [
      { id: 's1', type: 'trigger', label: 'Trigger', detail: '4–7 days after completed purchase (shorter reads: 4 days; novels: 6–7 days)' },
      { id: 's2', type: 'condition', label: 'Already Left Review?', detail: 'If reader clicked review link in Post-Purchase Follow-Up — goal exit (no duplicate ask); else — continue' },
      { id: 's3', type: 'email', label: 'Review Request', detail: 'Subject: "One quick thing, if you\'ve had a chance to read [Title]" — Single focused ask. Personal framing: genuine curiosity about reader\'s experience. Direct links to review submission pages on each platform — not the product page. Goal: capture social proof that makes your catalog credible to new readers.' },
      { id: 's4', type: 'goal-exit', label: 'Goal Exit', detail: 'Reader clicks any review link — no further review requests sent for this title. One ask per title, no exceptions.' },
    ]
  },
  {
    id: '7', name: 'Refund Confirmation', family: 'transaction',
    description: 'Handles refunds with professionalism and grace. Opportunity to leave a lasting positive impression and keep the door open for a return.',
    status: 'active', triggers: 14,
    goalExit: 'Refund processed and reader acknowledged',
    steps: [
      { id: 's1', type: 'trigger', label: 'Trigger', detail: 'Refund request processed in direct store' },
      { id: 's2', type: 'email', label: 'Refund Confirmation', detail: 'Subject: Your refund has been processed — Confirm refund clearly, provide timeline for funds return. Acknowledge clearly, invite feedback about experience, leave door open with genuine low-pressure closing. Goal: resolve cleanly, protect reputation, demonstrate author-reader trust that turns even a disappointed reader into someone who may give your work another chance.' },
      { id: 's3', type: 'wait', label: 'Wait 7 Days', detail: 'Delay: 7 days' },
      { id: 's4', type: 'email', label: 'Reconnect Email', detail: 'Subject: I hope we can try again sometime — Gentle, no pressure. Goal: turn even a disappointed reader into someone who may give your work another chance.' },
      { id: 's5', type: 'goal-exit', label: 'Goal Exit', detail: 'Refund acknowledged — reader remains on list unless they unsubscribe' },
    ]
  },
];
