import { Flow } from './mock-data.service';

export const RETENTION_FLOWS: Flow[] = [

  // ── Relationship & Retention ───────────────────────────────────────────────

  {
    id: '11', name: 'Re-engagement', family: 'retention', priority: 'mature',
    description: 'Low-pressure check-in for subscribers who have gone quiet — 90, 120, or 180 days inactive depending on send frequency. Either rekindles the relationship or cleanly removes them. A smaller engaged list always outperforms a large unresponsive one.',
    status: 'paused', triggers: 89,
    goalExit: 'Reader opens or clicks any re-engagement email — tagged re-engaged and returned to active list',
    steps: [
      { id: 's1', type: 'trigger', label: 'Trigger', detail: 'No open or click within inactivity threshold (90 days weekly / 120 biweekly / 180 monthly)' },
      { id: 's2', type: 'email', label: 'Email 1 — Warm Check-In', detail: 'Subject options: Are you still there? / I just wanted to check in / Do you still want to hear from me? — Genuine low-key check-in, not a win-back campaign. One clear CTA: Yes, keep me on the list. Goal exit fires on open or click.' },
      { id: 's3', type: 'wait', label: 'Wait 5–7 Days', detail: 'Delay: 5–7 days — gives reader time to respond' },
      { id: 's4', type: 'condition', label: 'Engaged?', detail: 'If opened or clicked — re-engaged tag applied, goal exit. If not — continue to Email 2.' },
      { id: 's5', type: 'email', label: 'Email 2 — Last Chance', detail: 'Subject options: This is the last one / Stay or go — your call / I am about to let you go — Shorter, matter-of-fact. Reader knows this is the last email before removal. No guilt, no manufactured urgency.' },
      { id: 's6', type: 'wait', label: 'Wait 2–3 Days', detail: 'Delay: 2–3 days before optional preference offer or removal' },
      { id: 's7', type: 'condition', label: 'Still Silent?', detail: 'If engaged — goal exit. If not — branch to optional Email 3 or proceed to removal.' },
      { id: 's8', type: 'email', label: 'Email 3 (Optional) — Preference Offer', detail: 'Subject options: Too many emails from me? / Want fewer emails instead of none? — Offers frequency adjustment. Best for weekly senders. Preference update removes from re-engagement flow.' },
      { id: 's9', type: 'email', label: "Author's Choice Removal Email", detail: "Subject options: I have removed you from my list / You have been removed due to inactivity — Transparent notification of removal with re-subscribe path. Purchase history retained in account." },
      { id: 's10', type: 'goal-exit', label: 'Goal Exit', detail: 'Re-engaged readers exit early. Unresponsive readers removed cleanly from active list.' },
    ]
  },
  {
    id: '12', name: 'Milestone Celebration', family: 'retention', priority: 'mature',
    description: 'Relationship-forward automation for subscriber anniversaries, birthdays, and catalog purchase milestones. Arrives without commercial purpose — reader feels seen, not marketed to.',
    status: 'active', triggers: 67,
    goalExit: 'Milestone email opened and reader engages — loyalty deepened through genuine recognition',
    steps: [
      { id: 's1', type: 'trigger', label: 'Anniversary Trigger', detail: 'Join date anniversary reached (90 days, 1 year, 2 years, or configured intervals) — calculated automatically from subscriber record' },
      { id: 's2', type: 'email', label: 'Anniversary Email', detail: 'Subject options: One year. Thank you. / [First Name], it\'s been a year — Recognition first. Optional gift: exclusive content, early access, or thank-you discount framed as gift not promotion.' },
      { id: 's3', type: 'trigger', label: 'Birthday Trigger', detail: 'Birth month and day in profile — fires on reader\'s birth date in local time zone. Silent for subscribers without birthday on file.' },
      { id: 's4', type: 'email', label: 'Birthday Email', detail: 'Subject: Happy birthday, [First Name] — Brief, warm, genuinely celebratory. Optional 10–20% gift, free short story, or reply invitation. Birthday data used only for annual message.' },
      { id: 's5', type: 'trigger', label: 'Catalog Milestone Trigger', detail: 'Purchase count crosses threshold via direct store webhook — third purchase, fifth purchase, or catalog completion' },
      { id: 's6', type: 'email', label: 'Catalog Milestone Email', detail: 'Subject: You\'ve just picked up your [N]th book from me — Lead with specific milestone acknowledgment. Optional community invitation for genuine fans.' },
      { id: 's7', type: 'goal-exit', label: 'Goal Exit', detail: 'Milestone email opened and reader engages — reply, click, or community join signals genuine personal connection' },
    ]
  },
  {
    id: '25', name: 'Giveaway Announcement', family: 'retention',
    description: 'Broadcast introducing a contest or giveaway. Leads with the prize, explains how to enter, communicates deadline. Turns existing list into a growth engine for new readers.',
    status: 'active', triggers: 312,
    goalExit: 'Subscribers enter giveaway and share with friends',
    steps: [
      { id: 's1', type: 'trigger', label: 'Trigger', detail: 'Giveaway launched — sent as broadcast to subscriber list or targeted segment' },
      { id: 's2', type: 'email', label: 'Giveaway Announcement', detail: 'Subject: I am running a giveaway — and you are invited — Lead with the prize. Clearly explain how to enter. Communicate deadline to create urgency that drives immediate action. Encourage sharing with friends to expand reach. Goal: generate excitement, reward current subscribers, attract new readers into funnel who have demonstrated interest in exactly the kind of books you write.' },
      { id: 's3', type: 'goal-exit', label: 'Goal Exit', detail: 'Subscribers enter and share — list growth engine activated' },
    ]
  },
  {
    id: '26', name: 'Newsletter Swap / Cross-Promotion', family: 'retention',
    description: 'Introduces a fellow author whose work you are recommending as part of a mutual cross-promotion. Feels like a trusted personal recommendation, not an advertisement.',
    status: 'active', triggers: 189,
    goalExit: 'Subscribers click through to recommended author',
    steps: [
      { id: 's1', type: 'trigger', label: 'Trigger', detail: 'Newsletter swap or cross-promotion scheduled — sent as broadcast' },
      { id: 's2', type: 'email', label: 'Cross-Promotion Email', detail: 'Subject: A book I think you will love — Feel like a trusted personal recommendation, not an advertisement. Lead with why your readers specifically will enjoy this author. Add genuine value by expanding reading options while simultaneously growing your own list through reciprocal exposure. Goal: build subscriber base with pre-qualified readers who already enjoy your genre, strengthen relationships within the author community.' },
      { id: 's3', type: 'goal-exit', label: 'Goal Exit', detail: 'Subscribers click through to recommended author' },
    ]
  },
  {
    id: '27', name: 'Limited Time Offer / Flash Sale', family: 'retention',
    description: 'Short-window price reduction on one or more titles. Lead with offer and deadline immediately — urgency is the engine. Generates concentrated spike in sales activity.',
    status: 'active', triggers: 445,
    goalExit: 'Reader purchases during sale window',
    steps: [
      { id: 's1', type: 'trigger', label: 'Trigger', detail: 'Flash sale activated — sent as broadcast, typically 24 hours to a few days' },
      { id: 's2', type: 'email', label: 'Flash Sale Email', detail: 'Subject: [X]% off — today only — Lead with offer and deadline immediately. Readers decide within seconds whether to keep reading — urgency is the engine that drives action in this email above all others. Combine discounted price with strong reminder of book value so deal feels like opportunity, not clearance. Goal: generate concentrated sales spike, move fence-sitters, reward most engaged subscribers with exclusive early access to best pricing.' },
      { id: 's3', type: 'goal-exit', label: 'Goal Exit', detail: 'Reader purchases during sale window' },
    ]
  },
  {
    id: '28', name: 'Price Drop Notification', family: 'retention',
    description: 'Calmer than a flash sale — less about urgency, more about removing a barrier. Re-surfaces a title to readers who may have passed on it at full price.',
    status: 'active', triggers: 234,
    goalExit: 'Price-sensitive reader converts to buyer',
    steps: [
      { id: 's1', type: 'trigger', label: 'Trigger', detail: 'Price permanently or temporarily reduced on a title — automated or manually triggered' },
      { id: 's2', type: 'email', label: 'Price Drop Email', detail: 'Subject: [Book Title] is now [price] — Re-surface title to readers who may have passed on it at full price. Pair price announcement with fresh look at book hook, reviews, or reader praise to reinvigorate interest. Goal: convert price-sensitive readers who were already warm, extend sales life of existing titles, keep backlist actively earning rather than sitting dormant.' },
      { id: 's3', type: 'goal-exit', label: 'Goal Exit', detail: 'Reader purchases at new price' },
    ]
  },
  {
    id: '29', name: 'Box Set / Bundle Announcement', family: 'retention',
    description: 'Notifies subscribers that multiple titles are now available as a single discounted package. Leads with value proposition immediately. Increases average order value.',
    status: 'active', triggers: 156,
    goalExit: 'Reader purchases the bundle',
    steps: [
      { id: 's1', type: 'trigger', label: 'Trigger', detail: 'Box set or bundle published — sent as broadcast' },
      { id: 's2', type: 'email', label: 'Bundle Announcement', detail: 'Subject: The complete [Series Name] — now in one collection — Lead with value proposition immediately: how many books, how much savings, why this collection belongs together. Make deal feel curated not convenient. Target readers who sampled one title and need reason to commit to full catalog. Goal: increase average order value, accelerate reader progression through catalog, create premium product that justifies strong positioning during promotional windows.' },
      { id: 's3', type: 'goal-exit', label: 'Goal Exit', detail: 'Reader purchases the bundle' },
    ]
  },
  {
    id: '30', name: 'Survey / Feedback Request', family: 'retention',
    description: 'Invites subscribers to share opinions on books, emails, content, or reader experience. Brief and respectful of their time. Gathers actionable intelligence to make informed decisions.',
    status: 'active', triggers: 178,
    goalExit: 'Reader completes survey or replies with feedback',
    steps: [
      { id: 's1', type: 'trigger', label: 'Trigger', detail: 'Broadcast or automated — sent to subscriber list or targeted segment' },
      { id: 's2', type: 'email', label: 'Survey Request', detail: 'Subject: I have a quick question for you — Brief and respectful of their time. Lead with why their specific input matters. Keep ask focused and survey short. Offer small incentive that rewards participation without feeling transactional. Goal: make readers feel heard and valued as collaborators in your author business, collect real-world data that sharpens every future marketing, content, and publishing decision.' },
      { id: 's3', type: 'goal-exit', label: 'Goal Exit', detail: 'Reader completes survey or replies — actionable intelligence gathered' },
    ]
  },
  {
    id: '31', name: 'Reader Group / Community Invitation', family: 'retention',
    description: 'Invites subscribers to join a dedicated reader space — Facebook Group, Discord, Patreon, or private forum. Moves loyal readers from passive email recipients into an active connected community.',
    status: 'active', triggers: 134,
    goalExit: 'Reader joins the community',
    steps: [
      { id: 's1', type: 'trigger', label: 'Trigger', detail: 'Broadcast — target most engaged subscribers first, since early members set culture and energy of any community' },
      { id: 's2', type: 'email', label: 'Community Invitation', detail: 'Subject: I would love to have you inside — Paint vivid picture of what life inside the community looks like: conversations, exclusives, access, connections with fellow readers. Make invitation feel like opportunity not obligation. Give sense of founding-member status that makes joining feel meaningful. Goal: move most loyal readers from passive recipients into active connected community that increases retention, generates word-of-mouth, and gives you a direct line to your most valuable audience.' },
      { id: 's3', type: 'goal-exit', label: 'Goal Exit', detail: 'Reader joins the community — loyalty deepened beyond email' },
    ]
  },
  {
    id: '32', name: 'Event Announcement', family: 'retention',
    description: 'Notifies subscribers of an upcoming appearance, live session, or experience — signing, virtual Q&A, live reading, webinar, or launch party. Brings reader community together around a shared live experience.',
    status: 'active', triggers: 267,
    goalExit: 'Reader registers or RSVPs for the event',
    steps: [
      { id: 's1', type: 'trigger', label: 'Trigger', detail: 'Event scheduled — sent as broadcast with follow-up reminder sequence in days leading up to event' },
      { id: 's2', type: 'email', label: 'Event Announcement', detail: 'Subject: I am [appearing / hosting / going live] — and I want you there — Lead with what, when, and where in first sentence — impossible to miss for readers who scan. Clear registration or RSVP link that removes every barrier between interest and attendance. Goal: bring reader community together around shared live experience, strengthen human connection, create memorable moments that deepen loyalty in ways automated sequences alone never can.' },
      { id: 's3', type: 'wait', label: 'Wait Until 2 Days Before', detail: 'Delay: wait until 2 days before event' },
      { id: 's4', type: 'email', label: 'Event Reminder', detail: 'Subject: Reminder — [Event] is in 2 days — Brief reminder with registration link. Build final anticipation.' },
      { id: 's5', type: 'goal-exit', label: 'Goal Exit', detail: 'Reader registers or RSVPs — community moment secured' },
    ]
  },

  // ── Unsubscribe Flows ──────────────────────────────────────────────────────

  {
    id: '13a', name: "Unsubscribe — Reader's Choice", family: 'retention',
    description: "Fires the moment a subscriber clicks the unsubscribe link and confirms their decision to opt out. Mandatory job: confirm immediately and unambiguously. Optional job: offer a preference alternative, acknowledge the relationship gracefully, and leave the door genuinely open.",
    status: 'active', triggers: 23,
    goalExit: 'Unsubscribe confirmed cleanly — goodwill preserved, door left open',
    subscriptionMetrics: { resubscriptionRate: 14 },
    steps: [
      { id: 's1', type: 'trigger', label: 'Trigger', detail: 'Reader clicks unsubscribe link and confirms opt-out' },
      { id: 's2', type: 'email', label: 'Unsubscribe Confirmation', detail: "Subject options: 'You have been unsubscribed' / 'You are off the list' / 'All done — you have been removed' — First sentence confirms immediately: 'You have been removed from my mailing list and will receive no further emails from me.' One sentence. Complete and unambiguous. No qualifications, no caveats, no 'removal takes 7-10 days'." },
      { id: 's3', type: 'email', label: 'Preference Alternative (optional)', detail: "After confirmation: offer a genuine low-pressure alternative — not a retention pitch. 'If you were receiving more emails than you would like, you can switch to a lower frequency or receive only new release announcements using the link below. No pressure either way — you are already removed if that is what you prefer.' The unsubscribe stands regardless." },
      { id: 's4', type: 'email', label: 'Graceful Acknowledgment + Re-subscribe Path', detail: "Brief warm acknowledgment: 'Thank you for the time you spent on my list. I hope my books find their way to you again someday, even if my emails do not.' Then: single re-subscribe link labeled 'Re-subscribe here' or 'Join the list again.' No elaborate explanation. Just the path, clearly marked." },
      { id: 's5', type: 'goal-exit', label: 'Goal Exit', detail: 'Subscriber removed from active list — address moved to suppression list immediately, not scheduled. Door left open via re-subscribe link and preference center.' },
    ]
  },
  {
    id: '13b', name: "Unsubscribe — Author's Choice", family: 'retention',
    description: "Fires at the conclusion of a failed re-engagement sequence where the subscriber remained unresponsive through every email. Unlike Reader's Choice, the author made this decision — the reader may not have known they were being removed. Transparency is non-negotiable.",
    status: 'active', triggers: 12,
    goalExit: 'Subscriber removed cleanly — transparent, respectful, re-subscribe path provided',
    subscriptionMetrics: { resubscriptionRate: 8 },
    steps: [
      { id: 's1', type: 'trigger', label: 'Trigger', detail: 'Re-engagement sequence exhausted — subscriber remained unresponsive through all re-engagement emails' },
      { id: 's2', type: 'email', label: 'Removal Notification', detail: "Subject options: 'I have removed you from my list' / 'You have been removed due to inactivity' / 'This is the last email I will send you' — Three required elements in order: (1) Clear statement: 'I have removed your address from my mailing list due to inactivity.' One sentence, no softening language. (2) Brief non-blaming explanation: 'I maintain my list carefully to make sure I am only sending emails to readers who are genuinely interested. Since your address has not been active for [X] months, I have removed it from my active list.' (3) Re-subscribe path: 'If you would like to stay connected, you can re-subscribe using the link below. I would genuinely be glad to have you back.' Tone: respectful, not apologetic. Warm farewell, not an apology." },
      { id: 's3', type: 'goal-exit', label: 'Goal Exit', detail: 'Subscriber removed — address moved to suppression list. Re-subscribe link provided. Removal documented for compliance records.' },
    ]
  },

  // ── Subscription & Billing (requires connected payment processor) ──────────

  {
    id: '15', name: 'Subscription Renewal Reminder', family: 'retention',
    requiresWebhook: true,
    description: 'Alerts a subscriber that their recurring plan is about to renew — stating the renewal date, the amount, and a clear management link. Framed as a service to the reader, not a precautionary charge notice.',
    status: 'active', triggers: 41,
    goalExit: 'Subscription renewed — no further reminders sent',
    subscriptionMetrics: { paymentUpdateRate: 78, cancellationRate: 4, resubscriptionRate: 31 },
    steps: [
      { id: 's1', type: 'billing-trigger', label: 'Billing Trigger', detail: 'Renewal date approaching — 7 days out (webhook event from payment processor)' },
      { id: 's2', type: 'email', label: 'Renewal Reminder (7 days)', detail: 'Subject: A heads-up before your renewal — Clearly state renewal date, amount that will be charged, and how to manage subscription. Treat reader as partner in transaction. Briefly remind of value received during subscription period. Goal: reduce surprise cancellations and payment disputes, build billing transparency, give subscribers timely moment to recommit with full confidence.' },
      { id: 's3', type: 'wait', label: 'Wait 4 Days', detail: 'Delay: 4 days — gives reader time to act' },
      { id: 's4', type: 'condition', label: 'Already Renewed?', detail: 'If renewed — exit; else — send annual follow-up reminder' },
      { id: 's5', type: 'email', label: 'Final Reminder (3 days out)', detail: 'Subject: Renewing in 3 days — for annual plans: higher charge warrants a second reminder' },
      { id: 's6', type: 'goal-exit', label: 'Goal Exit', detail: 'Subscription renewed successfully — reader treated as partner, not a charge target' },
    ]
  },
  {
    id: '16', name: 'Payment Failed — Dunning Sequence', family: 'retention',
    requiresWebhook: true,
    description: 'Three-email dunning sequence triggered when a recurring charge fails. Assumes good faith throughout — most failures are a billing system problem, not a reader problem. Access maintained during dunning window.',
    status: 'active', triggers: 8,
    goalExit: 'Payment updated and subscription restored automatically',
    subscriptionMetrics: { paymentUpdateRate: 62, retentionRateDunning: 71, cancellationRate: 29 },
    steps: [
      { id: 's1', type: 'billing-trigger', label: 'Billing Trigger', detail: 'Recurring subscription charge fails to process (webhook: payment_failed event)' },
      { id: 's2', type: 'email', label: 'Email 1 — Immediate', detail: 'Subject: A quick note about your subscription — Warm, blame-free. States access continues normally. Direct link to update payment. Most payment failures are unintentional — communicate problem clearly without blame, provide simple direct path to update payment and restore access immediately.' },
      { id: 's3', type: 'wait', label: 'Wait 3–5 Days', detail: 'Delay: 4 days — reader retains full access during this window' },
      { id: 's4', type: 'condition', label: 'Payment Updated?', detail: 'If updated — subscription restored automatically, exit flow; else — send Email 2' },
      { id: 's5', type: 'email', label: 'Email 2 — Follow-up', detail: 'Subject: Still having trouble? — Slightly more direct about timeline. Access may be restricted if unresolved soon. Repeats fix link prominently. Invites reply if having trouble.' },
      { id: 's6', type: 'wait', label: 'Wait 5 Days', detail: 'Delay: 5 days' },
      { id: 's7', type: 'condition', label: 'Payment Updated?', detail: 'If updated — exit; else — send final notice' },
      { id: 's8', type: 'email', label: 'Email 3 — Final Notice', detail: 'Subject: Last chance to keep your subscription — States deadline clearly. Genuine note that you would hate to lose them. After this, access restriction or cancellation follows automatically. Goal: recover failed revenue passively, minimize involuntary churn, handle friction point in way that feels helpful not punitive.' },
      { id: 's9', type: 'goal-exit', label: 'Goal Exit', detail: 'Payment resolved — subscription restored. If unresolved after Email 3, Author Choice End Subscription fires.' },
    ]
  },
  {
    id: '17', name: 'Upgrade / Downgrade Confirmation', family: 'retention',
    requiresWebhook: true,
    description: 'Fires when a reader changes their subscription tier. Answers four questions immediately: what changed, when it takes effect, new billing amount, and what access changed. Enthusiastic for upgrades, graceful for downgrades.',
    status: 'active', triggers: 19,
    goalExit: 'Plan change confirmed and reader understands new access',
    subscriptionMetrics: { cancellationRate: 2 },
    steps: [
      { id: 's1', type: 'billing-trigger', label: 'Billing Trigger', detail: 'Subscriber changes plan tier (webhook: subscription_updated event)' },
      { id: 's2', type: 'condition', label: 'Upgrade or Downgrade?', detail: 'Branch: upgrade path — enthusiastic confirmation; downgrade path — graceful confirmation, no win-back pitch' },
      { id: 's3', type: 'email', label: 'Upgrade Confirmation', detail: 'Subject: You have upgraded to [Plan Name] — Genuinely warm and celebratory. Immediately confirm: what changed, when it takes effect, new billing amount, new access. Frame upgrade as celebration of expanded commitment. Goal: eliminate confusion around plan changes, prevent support tickets from billing surprises, reinforce that every tier is a valued relationship.' },
      { id: 's4', type: 'email', label: 'Downgrade Confirmation', detail: 'Subject: Your plan has been updated — Clear and respectful. No win-back pitch, no lengthy list of what they are giving up. Confirm: plan change, effective date, new billing amount, what access changed. Brief low-friction path to return if they change their mind. Downgrade deserves same respect as any other reader choice.' },
      { id: 's5', type: 'goal-exit', label: 'Goal Exit', detail: 'Plan change confirmed — reader understands exactly what changed and when' },
    ]
  },
  {
    id: '18', name: "End Subscription — Reader's Choice", family: 'retention',
    requiresWebhook: true,
    description: "Sent when a paying subscriber cancels. Part commercial documentation, part parting letter. Confirms cancellation clearly first — no retention campaign disguised as a confirmation — then acknowledges the relationship warmly and leaves the door open.",
    status: 'active', triggers: 11,
    goalExit: 'Cancellation confirmed, relationship preserved, door left open',
    subscriptionMetrics: { resubscriptionRate: 18, cancellationRate: 100 },
    steps: [
      { id: 's1', type: 'billing-trigger', label: 'Billing Trigger', detail: 'Subscriber cancels subscription (webhook: subscription_cancelled — reader-initiated)' },
      { id: 's2', type: 'email', label: 'Cancellation Confirmation', detail: "Subject: Your subscription has been cancelled — First paragraph: plan name cancelled, access end date, no further charges. Three sentences. Nothing more. Then: genuine acknowledgment of relationship — not performed gratitude but real note from author to reader who chose to support financially. Then: low-pressure re-subscribe link. Present single low-pressure win-back offer such as pause option or reduced rate before fully disengaging. Goal: honor decision respectfully, minimize involuntary churn, leave relationship in good standing so they feel comfortable returning when the time is right." },
      { id: 's3', type: 'goal-exit', label: 'Goal Exit', detail: 'Cancellation confirmed — reader exits paid relationship on positive terms, remains on free list' },
    ]
  },
  {
    id: '19', name: "End Subscription — Author's Choice", family: 'retention',
    requiresWebhook: true,
    description: "Sent when the author ends a subscription — due to unresolved payment failure, community terms violation, or product retirement. Tone varies by reason. Transparency and respect non-negotiable.",
    status: 'active', triggers: 3,
    goalExit: 'Subscription ended cleanly — reader informed, refund referenced if applicable, door left open',
    subscriptionMetrics: { resubscriptionRate: 12 },
    steps: [
      { id: 's1', type: 'billing-trigger', label: 'Billing Trigger', detail: 'Author-initiated cancellation (webhook: subscription_cancelled — author-initiated, or dunning sequence exhausted)' },
      { id: 's2', type: 'condition', label: 'Reason for Cancellation?', detail: 'Branch: payment failure exhausted — matter-of-fact + re-subscribe link; product retirement — personal explanation + refund info; terms violation — clear + professional' },
      { id: 's3', type: 'email', label: 'End Sub — Payment Failure', detail: "Subject: Your subscription has been cancelled — Warm, blame-free. Explain subscription cancelled because payment could not be processed after multiple attempts. Assume good faith — reader may have genuinely missed dunning emails. Clear path to re-subscribe. Refund info if applicable." },
      { id: 's4', type: 'email', label: 'End Sub — Product Retirement', detail: "Subject: An important note about your subscription — Honest explanation of retirement reason. Acknowledge inconvenience directly. State access end date, prorated refund amount and timeline. Thank them sincerely for having been part of what you built together. Cannot be a form letter — must read like personal note from author to readers who supported a project that is ending." },
      { id: 's5', type: 'goal-exit', label: 'Goal Exit', detail: 'Subscription ended — reader informed with clarity and care, goodwill preserved' },
    ]
  },
];
