import { Flow } from './mock-data.service';

export const TRANSACTION_FLOWS: Flow[] = [
  {
    id: '3', name: 'Order Confirmation & Digital Delivery', family: 'transaction', priority: 'pre-store',
    description: 'Immediate official receipt confirming the order, then delivers digital content. Absence of this email creates anxiety and support requests.',
    status: 'active', triggers: 621,
    goalExit: 'Digital content delivered and confirmed opened',
    steps: [
      { id: 's1', type: 'trigger', label: 'Trigger', detail: 'Completed order in direct store' },
      { id: 's2', type: 'email', label: 'Order Confirmation', detail: 'Subject: Your order is confirmed — Summarize what was ordered, amount charged, delivery details. Warm on-brand message, not a cold generic receipt. Goal: instant reassurance, reduce support inquiries, set positive tone for every transaction that follows.' },
      { id: 's3', type: 'email', label: 'Digital Delivery', detail: 'Subject: Your book is ready to read — Clear prominent download link or access button with simple instructions. Note on compatible devices/apps. Goal: complete purchase experience seamlessly, minimize support requests, get book into reader hands immediately.' },
      { id: 's4', type: 'goal-exit', label: 'Goal Exit', detail: 'Reader opens delivery email — moves to Post-Purchase flow' },
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
    description: 'Recovers sales within reach. Gentle timely reminder sent 3 hours after abandonment — removes hesitation by addressing friction points.',
    status: 'active', triggers: 203,
    goalExit: 'Reader completes the purchase',
    steps: [
      { id: 's1', type: 'trigger', label: 'Trigger', detail: 'Reader adds to cart and closes browser without purchasing' },
      { id: 's2', type: 'wait', label: 'Wait 3 Hours', detail: 'Delay: 3 hours (quiet hours applied) — well-timed nudge, not surveillance' },
      { id: 's3', type: 'email', label: 'Cart Reminder', detail: 'Subject: You left something behind... — Gentle reminder that book is still waiting. Address friction: small discount, highlight guarantee, or remind why they wanted it. Goal: recover sale from warm buyer at moment closest to purchasing decision.' },
      { id: 's4', type: 'wait', label: 'Wait 1 Day', detail: 'Delay: 1 day' },
      { id: 's5', type: 'condition', label: 'Purchased?', detail: 'If purchased — exit; else — second nudge' },
      { id: 's6', type: 'email', label: 'Final Nudge', detail: 'Subject: Last chance — your cart is about to expire' },
      { id: 's7', type: 'goal-exit', label: 'Goal Exit', detail: 'Reader completes purchase — no further reminders sent' },
    ]
  },
  {
    id: '6', name: 'Abandoned Checkout', family: 'transaction', priority: 'pre-store',
    description: 'Higher intent than abandoned cart — reader entered shipping or payment info. Timing and tone critical. One of the highest ROI emails in the direct sales funnel.',
    status: 'active', triggers: 87,
    goalExit: 'Reader completes checkout',
    steps: [
      { id: 's1', type: 'trigger', label: 'Trigger', detail: 'Reader reaches checkout page, enters payment/shipping info, but does not complete purchase' },
      { id: 's2', type: 'wait', label: 'Wait 1 Hour', detail: 'Delay: 1 hour — significantly higher intent than abandoned cart visitor' },
      { id: 's3', type: 'email', label: 'Checkout Reminder', detail: 'Subject: Something went wrong? Your order is waiting — Address last-minute hesitation directly. Reassure with trust signals: secure payment badges, satisfaction guarantee. Make returning as frictionless as possible. Goal: close sale from buyer who was moments away from converting — one of the highest ROI emails in the direct sales funnel.' },
      { id: 's4', type: 'goal-exit', label: 'Goal Exit', detail: 'Reader completes purchase' },
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
