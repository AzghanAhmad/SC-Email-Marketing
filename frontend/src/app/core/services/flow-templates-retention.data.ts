import { FlowTemplate } from './mock-data.service';

export const RETENTION_TEMPLATES: FlowTemplate[] = [

  // ── Retention & Relationship ───────────────────────────────────────────────

  {
    id: 't9', name: 'Re-engagement', family: 'retention', priority: 'mature',
    description: 'Catches inactive subscribers at 60, 90, or 180 days and gives them a genuine reason to reconnect before clean removal. A smaller engaged list always outperforms a large unresponsive one.',
    goalExit: 'Reader opens or clicks — re-engagement confirmed',
    estimatedSetupMinutes: 35,
    steps: [
      { id: 's1', type: 'trigger', label: 'Trigger', detail: 'No open in 90 days' },
      { id: 's2', type: 'email', label: 'Miss You Email', detail: 'Low-pressure check-in. Remind them why they subscribed, share what they have missed, or offer compelling incentive.' },
      { id: 's3', type: 'wait', label: 'Wait 7 Days', detail: 'Delay: 7 days' },
      { id: 's4', type: 'condition', label: 'Opened?', detail: 'If opened — re-engaged; if not — final email' },
      { id: 's5', type: 'email', label: 'Last Chance Email', detail: 'Final notice before removal from active list.' },
      { id: 's6', type: 'goal-exit', label: 'Goal Exit', detail: 'Reader opens or clicks — stays on list' },
    ]
  },
  {
    id: 't10', name: 'Milestone Celebration', family: 'retention', priority: 'mature',
    description: 'Triggered by meaningful dates: subscriber anniversary, birthday, or reading milestone. Genuinely personal and celebratory — reader feels seen, not marketed to.',
    goalExit: 'Milestone email opened and reader engages',
    estimatedSetupMinutes: 15,
    steps: [
      { id: 's1', type: 'trigger', label: 'Trigger', detail: 'Subscriber anniversary date, birthday, or reading milestone' },
      { id: 's2', type: 'email', label: 'Milestone Email', detail: 'Lead with acknowledgment of milestone before anything else. Offer small meaningful gift: discount, free short story, or early access.' },
      { id: 's3', type: 'goal-exit', label: 'Goal Exit', detail: 'Email opened — milestone acknowledged' },
    ]
  },
  {
    id: 't10b', name: 'Giveaway Announcement', family: 'retention',
    description: 'Broadcast introducing a contest or giveaway. Leads with the prize, explains how to enter, communicates deadline. Turns existing list into a growth engine for new readers.',
    goalExit: 'Subscribers enter giveaway and share with friends',
    estimatedSetupMinutes: 20,
    steps: [
      { id: 's1', type: 'trigger', label: 'Trigger', detail: 'Giveaway launched — sent as broadcast' },
      { id: 's2', type: 'email', label: 'Giveaway Announcement', detail: 'Lead with the prize. Clearly explain how to enter. Communicate deadline to create urgency. Encourage sharing with friends.' },
      { id: 's3', type: 'goal-exit', label: 'Goal Exit', detail: 'Subscribers enter and share' },
    ]
  },
  {
    id: 't10c', name: 'Newsletter Swap / Cross-Promotion', family: 'retention',
    description: 'Introduces a fellow author as part of a mutual cross-promotion. Feels like a trusted personal recommendation, not an advertisement.',
    goalExit: 'Subscribers click through to recommended author',
    estimatedSetupMinutes: 15,
    steps: [
      { id: 's1', type: 'trigger', label: 'Trigger', detail: 'Newsletter swap or cross-promotion scheduled — sent as broadcast' },
      { id: 's2', type: 'email', label: 'Cross-Promotion Email', detail: 'Feel like a trusted personal recommendation. Lead with why your readers specifically will enjoy this author.' },
      { id: 's3', type: 'goal-exit', label: 'Goal Exit', detail: 'Subscribers click through to recommended author' },
    ]
  },
  {
    id: 't10d', name: 'Limited Time Offer / Flash Sale', family: 'retention',
    description: 'Short-window price reduction. Lead with offer and deadline immediately — urgency is the engine. Generates concentrated spike in sales activity.',
    goalExit: 'Reader purchases during sale window',
    estimatedSetupMinutes: 15,
    steps: [
      { id: 's1', type: 'trigger', label: 'Trigger', detail: 'Flash sale activated — sent as broadcast, typically 24 hours to a few days' },
      { id: 's2', type: 'email', label: 'Flash Sale Email', detail: 'Lead with offer and deadline immediately. Combine discounted price with strong reminder of book value so deal feels like opportunity, not clearance.' },
      { id: 's3', type: 'goal-exit', label: 'Goal Exit', detail: 'Reader purchases during sale window' },
    ]
  },
  {
    id: 't10e', name: 'Price Drop Notification', family: 'retention',
    description: 'Calmer than a flash sale — less about urgency, more about removing a barrier. Re-surfaces a title to readers who may have passed on it at full price.',
    goalExit: 'Price-sensitive reader converts to buyer',
    estimatedSetupMinutes: 15,
    steps: [
      { id: 's1', type: 'trigger', label: 'Trigger', detail: 'Price permanently or temporarily reduced — automated or manually triggered' },
      { id: 's2', type: 'email', label: 'Price Drop Email', detail: 'Re-surface title to readers who may have passed on it at full price. Pair price announcement with fresh look at book hook, reviews, or reader praise.' },
      { id: 's3', type: 'goal-exit', label: 'Goal Exit', detail: 'Reader purchases at new price' },
    ]
  },
  {
    id: 't10f', name: 'Box Set / Bundle Announcement', family: 'retention',
    description: 'Notifies subscribers that multiple titles are now available as a single discounted package. Leads with value proposition immediately. Increases average order value.',
    goalExit: 'Reader purchases the bundle',
    estimatedSetupMinutes: 20,
    steps: [
      { id: 's1', type: 'trigger', label: 'Trigger', detail: 'Box set or bundle published — sent as broadcast' },
      { id: 's2', type: 'email', label: 'Bundle Announcement', detail: 'Lead with value proposition immediately: how many books, how much savings, why this collection belongs together. Make deal feel curated not convenient.' },
      { id: 's3', type: 'goal-exit', label: 'Goal Exit', detail: 'Reader purchases the bundle' },
    ]
  },
  {
    id: 't10g', name: 'Survey / Feedback Request', family: 'retention',
    description: 'Invites subscribers to share opinions on books, emails, or reader experience. Brief and respectful of their time. Gathers actionable intelligence.',
    goalExit: 'Reader completes survey or replies with feedback',
    estimatedSetupMinutes: 15,
    steps: [
      { id: 's1', type: 'trigger', label: 'Trigger', detail: 'Broadcast or automated — sent to subscriber list or targeted segment' },
      { id: 's2', type: 'email', label: 'Survey Request', detail: 'Brief and respectful of their time. Lead with why their specific input matters. Keep ask focused and survey short.' },
      { id: 's3', type: 'goal-exit', label: 'Goal Exit', detail: 'Reader completes survey or replies' },
    ]
  },
  {
    id: 't10h', name: 'Reader Group / Community Invitation', family: 'retention',
    description: 'Invites subscribers to join a dedicated reader space. Moves loyal readers from passive email recipients into an active connected community.',
    goalExit: 'Reader joins the community',
    estimatedSetupMinutes: 20,
    steps: [
      { id: 's1', type: 'trigger', label: 'Trigger', detail: 'Broadcast — target most engaged subscribers first' },
      { id: 's2', type: 'email', label: 'Community Invitation', detail: 'Paint vivid picture of what life inside the community looks like. Make invitation feel like opportunity not obligation. Give sense of founding-member status.' },
      { id: 's3', type: 'goal-exit', label: 'Goal Exit', detail: 'Reader joins the community' },
    ]
  },
  {
    id: 't10i', name: 'Event Announcement', family: 'retention',
    description: 'Notifies subscribers of an upcoming appearance, live session, or experience. Brings reader community together around a shared live experience.',
    goalExit: 'Reader registers or RSVPs for the event',
    estimatedSetupMinutes: 20,
    steps: [
      { id: 's1', type: 'trigger', label: 'Trigger', detail: 'Event scheduled — sent as broadcast with follow-up reminder sequence' },
      { id: 's2', type: 'email', label: 'Event Announcement', detail: 'Lead with what, when, and where in first sentence. Clear registration or RSVP link that removes every barrier between interest and attendance.' },
      { id: 's3', type: 'wait', label: 'Wait Until 2 Days Before', detail: 'Wait until 2 days before event' },
      { id: 's4', type: 'email', label: 'Event Reminder', detail: 'Brief reminder with registration link. Build final anticipation.' },
      { id: 's5', type: 'goal-exit', label: 'Goal Exit', detail: 'Reader registers or RSVPs' },
    ]
  },

  // ── Unsubscribe ────────────────────────────────────────────────────────────

  {
    id: 't10j', name: "Unsubscribe — Reader's Choice", family: 'retention',
    description: "Fires when a subscriber actively opts out. Mandatory: confirm immediately and unambiguously. Optional: offer preference alternative, acknowledge relationship gracefully, leave door open. Protects deliverability — a clean unsubscribe is always better than a spam complaint.",
    goalExit: 'Unsubscribe confirmed cleanly — goodwill preserved, re-subscribe path provided',
    estimatedSetupMinutes: 15,
    steps: [
      { id: 's1', type: 'trigger', label: 'Trigger', detail: 'Reader clicks unsubscribe link and confirms opt-out' },
      { id: 's2', type: 'email', label: 'Unsubscribe Confirmation', detail: "Subject: 'You have been unsubscribed' or 'You are off the list' or 'All done — you have been removed' — First sentence: 'You have been removed from my mailing list and will receive no further emails from me.' One sentence. No qualifications. No 'removal takes 7-10 days'. Then: preference alternative (low-pressure, unsubscribe already stands). Then: graceful acknowledgment + re-subscribe link." },
      { id: 's3', type: 'goal-exit', label: 'Goal Exit', detail: 'Subscriber removed — address suppressed immediately, door left open' },
    ]
  },
  {
    id: 't10k', name: "Unsubscribe — Author's Choice", family: 'retention',
    description: "Fires at conclusion of failed re-engagement sequence. Three required elements: (1) clear statement of removal, (2) brief non-blaming explanation, (3) re-subscribe path. Tone: respectful, not apologetic. Transparency is non-negotiable.",
    goalExit: 'Subscriber removed transparently — re-subscribe path provided, compliance documented',
    estimatedSetupMinutes: 15,
    steps: [
      { id: 's1', type: 'trigger', label: 'Trigger', detail: 'Re-engagement sequence exhausted — subscriber remained unresponsive through all emails' },
      { id: 's2', type: 'email', label: 'Removal Notification', detail: "Subject: 'I have removed you from my list' or 'You have been removed due to inactivity' or 'This is the last email I will send you' — (1) 'I have removed your address from my mailing list due to inactivity.' (2) Brief non-blaming explanation of why. (3) 'If you would like to stay connected, you can re-subscribe using the link below. I would genuinely be glad to have you back.'" },
      { id: 's3', type: 'goal-exit', label: 'Goal Exit', detail: 'Subscriber removed — address moved to suppression list, removal documented for compliance' },
    ]
  },

  // ── Subscription & Billing (requires connected payment processor) ──────────

  {
    id: 't11', name: 'Subscription Renewal Reminder', family: 'retention',
    requiresWebhook: true,
    description: 'Alerts subscribers before their plan renews — stating the renewal date, amount, and a clear management link. Framed as a service to the reader. For annual plans, sends a second reminder 3 days out.',
    goalExit: 'Subscription renewed — no further reminders sent',
    estimatedSetupMinutes: 25,
    steps: [
      { id: 's1', type: 'billing-trigger', label: 'Billing Trigger', detail: 'Renewal date approaching — 7 days out (webhook from payment processor)' },
      { id: 's2', type: 'email', label: 'Renewal Reminder (7 days)', detail: 'Clearly state renewal date, amount, and how to manage subscription. Treat reader as partner in transaction. Briefly remind of value received.' },
      { id: 's3', type: 'wait', label: 'Wait 4 Days', detail: 'Delay: 4 days' },
      { id: 's4', type: 'condition', label: 'Already Renewed?', detail: 'If renewed — exit; else — send final reminder for annual plans' },
      { id: 's5', type: 'email', label: 'Final Reminder (3 days out)', detail: 'For annual subscriptions where higher charge warrants a second reminder.' },
      { id: 's6', type: 'goal-exit', label: 'Goal Exit', detail: 'Subscription renewed successfully' },
    ]
  },
  {
    id: 't12', name: 'Payment Failed — Dunning Sequence', family: 'retention',
    requiresWebhook: true,
    description: 'Three-email dunning sequence for failed recurring charges. Assumes good faith throughout — most failures are a billing system problem, not a reader problem. Access maintained during dunning window.',
    goalExit: 'Payment updated and subscription restored automatically',
    estimatedSetupMinutes: 40,
    steps: [
      { id: 's1', type: 'billing-trigger', label: 'Billing Trigger', detail: 'Recurring charge fails to process (webhook: payment_failed)' },
      { id: 's2', type: 'email', label: 'Email 1 — Immediate', detail: 'Warm, blame-free. Access continues. Direct payment update link. Most failures are unintentional — usually an expired card.' },
      { id: 's3', type: 'wait', label: 'Wait 4 Days', detail: 'Delay: 4 days — reader retains full access' },
      { id: 's4', type: 'condition', label: 'Payment Updated?', detail: 'If updated — subscription restored, exit; else — Email 2' },
      { id: 's5', type: 'email', label: 'Email 2 — Follow-up', detail: 'Slightly more direct about timeline. Repeats fix link. Invites reply if having trouble.' },
      { id: 's6', type: 'wait', label: 'Wait 5 Days', detail: 'Delay: 5 days' },
      { id: 's7', type: 'condition', label: 'Payment Updated?', detail: 'If updated — exit; else — Email 3' },
      { id: 's8', type: 'email', label: 'Email 3 — Final Notice', detail: 'States deadline clearly. Genuine note that you would hate to lose them. After this, cancellation follows automatically.' },
      { id: 's9', type: 'goal-exit', label: 'Goal Exit', detail: 'Payment resolved — subscription restored. If unresolved, Author Choice End Subscription fires.' },
    ]
  },
  {
    id: 't13', name: 'Upgrade / Downgrade Confirmation', family: 'retention',
    requiresWebhook: true,
    description: 'Fires when a reader changes their subscription tier. Answers four questions immediately: what changed, when it takes effect, new billing amount, and what access changed.',
    goalExit: 'Plan change confirmed and reader understands new access',
    estimatedSetupMinutes: 20,
    steps: [
      { id: 's1', type: 'billing-trigger', label: 'Billing Trigger', detail: 'Subscriber changes plan tier (webhook: subscription_updated)' },
      { id: 's2', type: 'condition', label: 'Upgrade or Downgrade?', detail: 'Branch: upgrade — enthusiastic confirmation; downgrade — graceful confirmation, no win-back pitch' },
      { id: 's3', type: 'email', label: 'Upgrade Confirmation', detail: 'Genuinely warm. Confirms plan, effective date, new billing amount, new access.' },
      { id: 's4', type: 'email', label: 'Downgrade Confirmation', detail: 'Clear and respectful. No win-back pitch. Brief low-friction path to return if they change their mind.' },
      { id: 's5', type: 'goal-exit', label: 'Goal Exit', detail: 'Plan change confirmed — reader understands exactly what changed and when' },
    ]
  },
  {
    id: 't14', name: "End Subscription — Reader's Choice", family: 'retention',
    requiresWebhook: true,
    description: "Sent when a paying subscriber cancels. Part commercial documentation, part parting letter. Confirms cancellation clearly first — no retention campaign disguised as a confirmation.",
    goalExit: 'Cancellation confirmed, relationship preserved, door left open',
    estimatedSetupMinutes: 20,
    steps: [
      { id: 's1', type: 'billing-trigger', label: 'Billing Trigger', detail: 'Subscriber cancels subscription (webhook: subscription_cancelled — reader-initiated)' },
      { id: 's2', type: 'email', label: 'Cancellation Confirmation', detail: 'First: plan cancelled, access end date, no further charges. Three sentences. Then: genuine acknowledgment of relationship. Then: low-pressure re-subscribe link.' },
      { id: 's3', type: 'goal-exit', label: 'Goal Exit', detail: 'Cancellation confirmed — reader exits paid relationship on positive terms, remains on free list' },
    ]
  },
  {
    id: 't15', name: "End Subscription — Author's Choice", family: 'retention',
    requiresWebhook: true,
    description: "Sent when the author ends a subscription — due to unresolved payment failure, terms violation, or product retirement. Tone varies by reason. Transparency and respect non-negotiable.",
    goalExit: 'Subscription ended cleanly — reader informed, refund referenced if applicable',
    estimatedSetupMinutes: 30,
    steps: [
      { id: 's1', type: 'billing-trigger', label: 'Billing Trigger', detail: 'Author-initiated cancellation (webhook: subscription_cancelled — author-initiated, or dunning exhausted)' },
      { id: 's2', type: 'condition', label: 'Reason for Cancellation?', detail: 'Branch: payment failure — matter-of-fact + re-subscribe link; product retirement — personal explanation + refund info' },
      { id: 's3', type: 'email', label: 'End Sub — Payment Failure', detail: 'Warm, blame-free. Explain subscription cancelled because payment could not be processed. Clear path to re-subscribe. Refund info if applicable.' },
      { id: 's4', type: 'email', label: 'End Sub — Product Retirement', detail: 'Honest explanation of retirement reason. Acknowledge inconvenience. State access end date, prorated refund amount and timeline. Personal, not a form letter.' },
      { id: 's5', type: 'goal-exit', label: 'Goal Exit', detail: 'Subscription ended — reader informed with clarity and care, goodwill preserved' },
    ]
  },
];
