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
    description: 'Gentle timely reminder 3 hours after abandonment. Removes hesitation by addressing friction points. Recovers sale from warm buyer at moment closest to purchasing decision.',
    goalExit: 'Reader completes the purchase',
    estimatedSetupMinutes: 25,
    steps: [
      { id: 's1', type: 'trigger', label: 'Trigger', detail: 'Reader adds to cart and closes browser' },
      { id: 's2', type: 'wait', label: 'Wait 3 Hours', detail: 'Delay: 3 hours' },
      { id: 's3', type: 'email', label: 'Cart Reminder', detail: 'Gentle reminder book is still waiting. Address friction: discount, guarantee, or remind why they wanted it.' },
      { id: 's4', type: 'goal-exit', label: 'Goal Exit', detail: 'Reader completes purchase' },
    ]
  },
  {
    id: 't5b', name: 'Abandoned Checkout', family: 'transaction', priority: 'pre-store',
    description: 'Higher intent than abandoned cart — reader entered payment info. One of the highest ROI emails in the direct sales funnel. Address last-minute hesitation with trust signals.',
    goalExit: 'Reader completes checkout',
    estimatedSetupMinutes: 20,
    steps: [
      { id: 's1', type: 'trigger', label: 'Trigger', detail: 'Reader reaches checkout, enters payment info, but does not complete' },
      { id: 's2', type: 'wait', label: 'Wait 1 Hour', detail: 'Delay: 1 hour' },
      { id: 's3', type: 'email', label: 'Checkout Reminder', detail: 'Address last-minute hesitation. Reassure with trust signals: secure payment, satisfaction guarantee. Make returning frictionless.' },
      { id: 's4', type: 'goal-exit', label: 'Goal Exit', detail: 'Reader completes purchase' },
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
