import { FlowTemplate } from './mock-data.service';

export const TRANSACTION_TEMPLATES: FlowTemplate[] = [
  {
    id: 't3', name: 'Order Confirmation & Digital Delivery', family: 'transaction', priority: 'pre-store',
    description: 'Immediate official receipt then digital content delivery. Absence of this email creates anxiety and support requests. Goal: instant reassurance, reduce support inquiries.',
    goalExit: 'Digital content delivered and confirmed opened',
    estimatedSetupMinutes: 30,
    steps: [
      { id: 's1', type: 'trigger', label: 'Trigger', detail: 'Completed order in direct store' },
      { id: 's2', type: 'email', label: 'Order Confirmation', detail: 'Summarize order, amount charged, delivery details. Warm on-brand message, not a cold generic receipt.' },
      { id: 's3', type: 'email', label: 'Digital Delivery', detail: 'Clear prominent download link. Simple instructions. Note on compatible devices/apps.' },
      { id: 's4', type: 'goal-exit', label: 'Goal Exit', detail: 'Reader opens delivery email' },
    ]
  },
  {
    id: 't4a', name: 'Post-Purchase Thank You (First Purchase)', family: 'transaction', priority: 'pre-store',
    description: 'Sent immediately after first purchase. Confirms, appreciates, suggests related title or review opportunity. Reduces buyer remorse and opens door to second sale.',
    goalExit: 'Reader clicks a catalog or series link',
    estimatedSetupMinutes: 20,
    steps: [
      { id: 's1', type: 'trigger', label: 'Trigger', detail: 'First-time purchase completed' },
      { id: 's2', type: 'email', label: 'First Purchase Thank You', detail: 'Confirm purchase, express genuine appreciation. Suggest related title, invite reader group, or point toward review opportunity while excitement is fresh.' },
      { id: 's3', type: 'goal-exit', label: 'Goal Exit', detail: 'Reader clicks catalog or series link' },
    ]
  },
  {
    id: 't4b', name: 'Repeat Purchase Thank You', family: 'transaction',
    description: 'Triggered on second or subsequent purchase. Warmer and more personal than first thank you. Acknowledges loyalty, offers exclusive perk. Deepens relationship and increases lifetime reader value.',
    goalExit: 'Reader accepts exclusive perk or joins reader community',
    estimatedSetupMinutes: 20,
    steps: [
      { id: 's1', type: 'trigger', label: 'Trigger', detail: 'Reader completes second or subsequent purchase' },
      { id: 's2', type: 'email', label: 'Loyalty Thank You', detail: 'Acknowledge loyalty, make them feel recognized. Offer exclusive perk: early access, bonus, or reader community invitation.' },
      { id: 's3', type: 'goal-exit', label: 'Goal Exit', detail: 'Reader accepts perk or joins community' },
    ]
  },
  {
    id: 't4c', name: 'Post-Purchase Follow-up', family: 'transaction', priority: 'pre-store',
    description: 'Sent 3–5 days after purchase when reading experience is fresh and emotion is high. Invites review, asks for feedback, or suggests next book while enthusiasm is at its peak.',
    goalExit: 'Reader leaves a review or clicks next book link',
    estimatedSetupMinutes: 20,
    steps: [
      { id: 's1', type: 'trigger', label: 'Trigger', detail: '3–5 days after digital delivery confirmed opened' },
      { id: 's2', type: 'email', label: 'Follow-up Email', detail: 'Invite honest review, ask for feedback, or suggest next book in series while enthusiasm is at its peak.' },
      { id: 's3', type: 'goal-exit', label: 'Goal Exit', detail: 'Reader leaves review or clicks next book' },
    ]
  },
  {
    id: 't5', name: 'Abandoned Cart', family: 'transaction', priority: 'pre-store',
    description: 'First email fires 1 hour after abandonment — while the book is still in the reader\'s mental foreground. Two-email sequence. Conversion rate 5–15%. Lead with the book, not the cart. Include cover image and social proof.',
    goalExit: 'Reader completes the purchase',
    estimatedSetupMinutes: 25,
    steps: [
      { id: 's1', type: 'trigger', label: 'Trigger', detail: 'Reader adds book to cart and leaves without progressing to checkout' },
      { id: 's2', type: 'wait', label: 'Wait 1 Hour', detail: 'Delay: 1 hour (configurable) — confirms real abandonment without letting interest cool' },
      { id: 's3', type: 'condition', label: 'Already Purchased?', detail: 'If purchase event received — goal exit; else — send reminder' },
      { id: 's4', type: 'email', label: 'Cart Reminder — Email 1', detail: 'Lead with the book. Cover image. Brief hook. One line of reader praise. One button back to product page or pre-populated cart.' },
      { id: 's5', type: 'wait', label: 'Wait 24 Hours', detail: 'Delay: 24 hours' },
      { id: 's6', type: 'condition', label: 'Purchased?', detail: 'If purchased — goal exit; else — final nudge' },
      { id: 's7', type: 'email', label: 'Final Nudge — Email 2', detail: 'Two or three sentences. Light reminder, no urgency language. After two emails, flow ends.' },
      { id: 's8', type: 'goal-exit', label: 'Goal Exit', detail: 'Reader completes purchase — post-purchase sequence begins' },
    ]
  },
  {
    id: 't5b', name: 'Abandoned Checkout', family: 'transaction', priority: 'pre-store',
    description: 'First email fires in 30 minutes — faster than cart because intent is higher. Reader entered payment info. Two-email sequence. Direct acknowledgment, friction removal, cart restoration link.',
    goalExit: 'Reader completes checkout',
    estimatedSetupMinutes: 20,
    steps: [
      { id: 's1', type: 'trigger', label: 'Trigger', detail: 'Reader reaches checkout, enters payment or shipping info, but does not complete' },
      { id: 's2', type: 'wait', label: 'Wait 30 Minutes', detail: 'Delay: 30 minutes (configurable) — higher intent warrants faster response' },
      { id: 's3', type: 'condition', label: 'Already Purchased?', detail: 'If purchase event received — goal exit; else — send reminder' },
      { id: 's4', type: 'email', label: 'Checkout Reminder — Email 1', detail: 'Direct acknowledgment. Address technical friction: payment methods, guest checkout, money-back guarantee. "Hit reply and I\'ll sort it out personally." Cart restoration link if platform supports it.' },
      { id: 's5', type: 'wait', label: 'Wait 24 Hours', detail: 'Delay: 24 hours' },
      { id: 's6', type: 'condition', label: 'Purchased?', detail: 'If purchased — goal exit; else — 24-hour follow-up' },
      { id: 's7', type: 'email', label: '24-Hour Follow-Up — Email 2', detail: 'Shorter, warmer. Invitation to reach out if anything went wrong. After two emails, flow ends.' },
      { id: 's8', type: 'goal-exit', label: 'Goal Exit', detail: 'Reader completes purchase — post-purchase sequence begins' },
    ]
  },
  {
    id: 't4d', name: 'Review Request', family: 'transaction', priority: 'pre-store',
    description: 'A focused, standalone automation dedicated entirely to generating social proof. Fires 4–7 days after purchase as a single clear ask. More effective than burying the review request inside a longer email with multiple purposes.',
    goalExit: 'Reader clicks a review link on any platform',
    estimatedSetupMinutes: 20,
    steps: [
      { id: 's1', type: 'trigger', label: 'Trigger', detail: '4–7 days after completed purchase' },
      { id: 's2', type: 'condition', label: 'Already Left Review?', detail: 'If reader clicked review link in Post-Purchase Follow-Up — goal exit; else — continue' },
      { id: 's3', type: 'email', label: 'Review Request', detail: 'Single focused ask with direct links to review submission pages on each platform. Personal framing, genuine curiosity about reader\'s experience.' },
      { id: 's4', type: 'goal-exit', label: 'Goal Exit', detail: 'Reader clicks any review link — no further review requests sent for this title' },
    ]
  },
  {
    id: 't5c', name: 'Refund Confirmation', family: 'transaction',
    description: 'Handles refunds with professionalism and grace. Opportunity to leave lasting positive impression and keep door open for return.',
    goalExit: 'Refund processed and reader acknowledged',
    estimatedSetupMinutes: 15,
    steps: [
      { id: 's1', type: 'trigger', label: 'Trigger', detail: 'Refund request processed in direct store' },
      { id: 's2', type: 'email', label: 'Refund Confirmation', detail: 'Confirm refund clearly, provide timeline for funds return. Invite feedback, leave door open with genuine low-pressure closing.' },
      { id: 's3', type: 'goal-exit', label: 'Goal Exit', detail: 'Refund acknowledged — reader remains on list' },
    ]
  },
];
