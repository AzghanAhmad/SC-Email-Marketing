import { Injectable } from '@angular/core';
import { FLOWS_DATA } from './mock-flows.data';
import { FLOW_TEMPLATES_DATA } from './mock-flow-templates.data';

export interface Subscriber {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'unsubscribed' | 'bounced';
  tags: string[];
  joinedAt: string;
  openRate: number;
}

export interface Segment {
  id: string;
  name: string;
  count: number;
  description: string;
  color: string;
}

export interface Campaign {
  id: string;
  name: string;
  subject: string;
  status: 'draft' | 'sent' | 'scheduled';
  openRate: number;
  clickRate: number;
  sent: number;
  date: string;
}

export interface SubscriptionMetrics {
  paymentUpdateRate?: number;
  retentionRateDunning?: number;
  cancellationRate?: number;
  resubscriptionRate?: number;
}

export interface FlowFormField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select';
  required?: boolean;
  options?: string[];
}

export interface Flow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'draft';
  triggers: number;
  steps: FlowStep[];
  family: 'onboarding' | 'transaction' | 'launch' | 'retention';
  goalExit: string;
  priority?: 'day-one' | 'pre-store' | 'pre-launch' | 'mature';
  requiresWebhook?: boolean;
  subscriptionMetrics?: SubscriptionMetrics;
  templateId?: string;
}

export interface FlowStep {
  id: string;
  type: 'trigger' | 'billing-trigger' | 'email' | 'wait' | 'condition' | 'goal-exit' | 'form';
  label: string;
  detail: string;
  subject?: string;
  emailBody?: string;
  waitDuration?: number;
  waitUnit?: 'minutes' | 'hours' | 'days' | 'weeks';
  conditionType?: string;
  triggerEvent?: string;
  formFields?: FlowFormField[];
}

export interface FlowTemplate {
  id: string;
  name: string;
  family: 'onboarding' | 'transaction' | 'launch' | 'retention';
  description: string;
  goalExit: string;
  estimatedSetupMinutes: number;
  priority?: 'day-one' | 'pre-store' | 'pre-launch' | 'mature';
  requiresWebhook?: boolean;
  steps: FlowStep[];
}

export interface Template {
  id: string;
  name: string;
  category: string;
  preview: string;
  description: string;
}

export interface ActivityItem {
  id: string;
  type: 'campaign_sent' | 'new_subscriber' | 'flow_triggered' | 'unsubscribe';
  message: string;
  time: string;
  icon: string;
}

@Injectable({ providedIn: 'root' })
export class MockDataService {

  getSubscribers(): Subscriber[] {
    return [
      { id:'1', name:'Emily Clarke', email:'emily@example.com', status:'active', tags:['fantasy','newsletter'], joinedAt:'Jan 12, 2026', openRate:68 },
      { id:'2', name:'Marcus Webb', email:'marcus@example.com', status:'active', tags:['thriller','launch'], joinedAt:'Jan 18, 2026', openRate:54 },
      { id:'3', name:'Sarah Kim', email:'sarah@example.com', status:'active', tags:['romance','vip'], joinedAt:'Feb 2, 2026', openRate:82 },
      { id:'4', name:'David Torres', email:'david@example.com', status:'unsubscribed', tags:['sci-fi'], joinedAt:'Dec 5, 2025', openRate:12 },
      { id:'5', name:'Priya Patel', email:'priya@example.com', status:'active', tags:['newsletter','vip'], joinedAt:'Feb 14, 2026', openRate:91 },
      { id:'6', name:'James O\'Brien', email:'james@example.com', status:'active', tags:['mystery'], joinedAt:'Mar 1, 2026', openRate:47 },
      { id:'7', name:'Aisha Johnson', email:'aisha@example.com', status:'bounced', tags:['fantasy'], joinedAt:'Nov 20, 2025', openRate:0 },
      { id:'8', name:'Tom Nguyen', email:'tom@example.com', status:'active', tags:['thriller','launch'], joinedAt:'Mar 8, 2026', openRate:73 },
    ];
  }

  getSegments(): Segment[] {
    return [
      { id:'1', name:'VIP Readers', count:342, description:'Subscribers with >70% open rate', color:'#60a5fa' },
      { id:'2', name:'Fantasy Fans', count:1204, description:'Tagged with fantasy genre', color:'#a78bfa' },
      { id:'3', name:'Launch List', count:876, description:'Opted in for book launches', color:'#34d399' },
      { id:'4', name:'Newsletter Only', count:2341, description:'General newsletter subscribers', color:'#fbbf24' },
      { id:'5', name:'Inactive 90d', count:512, description:'No opens in last 90 days', color:'#f87171' },
      { id:'6', name:'New This Month', count:189, description:'Joined in the last 30 days', color:'#818cf8' },
      { id:'7', name:'ARC Team — The Ember Crown', count:34, description:'Advance readers for The Ember Crown — tagged arc-ember-crown-2026', color:'#8b5cf6' },
      { id:'8', name:'Series Readers — Ember Chronicles', count:621, description:'Purchased 2+ books in the Ember Chronicles series', color:'#6366f1' },
      { id:'9', name:'Superfans / All-Title Buyers', count:187, description:'Purchased every title in the catalog — highest-priority audience for new release notifications', color:'#f59e0b' },
      { id:'10', name:'Backlist Buyers — Gothic Romance', count:843, description:'Purchased previous gothic romance titles — warmest audience for companion or related releases', color:'#ec4899' },
      { id:'11', name:'Local — Nashville, TN', count:312, description:'Subscribers located in Nashville and surrounding area — targeted for in-person signing events', color:'#10b981' },
      { id:'12', name:'Local — New York, NY', count:487, description:'Subscribers located in New York City metro area', color:'#10b981' },
      { id:'13', name:'Local — Los Angeles, CA', count:398, description:'Subscribers located in Los Angeles metro area', color:'#10b981' },
      { id:'14', name:'United Kingdom', count:743, description:'Subscribers located in the UK — targeted for UK signings and UK-timezone virtual events', color:'#3b82f6' },
      { id:'15', name:'Canada', count:512, description:'Subscribers located in Canada', color:'#3b82f6' },
      { id:'16', name:'Australia & New Zealand', count:389, description:'Subscribers located in Australia and New Zealand — targeted for AEST-timezone virtual events', color:'#3b82f6' },
      { id:'17', name:'Community Members', count:284, description:'Subscribers who have joined the reader community — eligible for community-only previews, early access offers, and behind-the-scenes campaign content', color:'#ec4899' },
      { id:'18', name:'Founding Community Members', count:87, description:'First-wave community members who joined during the founding invitation — highest-engagement segment for ARC recruitment and launch-week campaigns', color:'#be185d' },
      { id:'19', name:'New Subscribers — No Purchase', count:1243, description:'Joined in the last 3–6 months with no purchase recorded — primary audience for series entry point backlist spotlights', color:'#64748b' },
      { id:'20', name:'Partial-Series — Book 1 Only', count:412, description:'Purchased Book 1 of the Ember Chronicles but not Book 2 — targeted for next-in-series backlist spotlight', color:'#6366f1' },
      { id:'21', name:'Long-Term — Catalog Gaps', count:298, description:'On list 1+ year, purchased multiple titles but have gaps in catalog reading — targeted for hidden gem spotlights', color:'#475569' },
    ];
  }

  getCampaigns(): Campaign[] {
    return [
      { id:'1', name:'March Newsletter', subject:'What I\'ve been writing this month...', status:'sent', openRate:54.2, clickRate:12.8, sent:4821, date:'Mar 15, 2026' },
      { id:'2', name:'Book Launch: The Ember Crown', subject:'It\'s finally here!', status:'sent', openRate:71.4, clickRate:28.3, sent:3200, date:'Mar 1, 2026' },
      { id:'7', name:'New Release Notification — The Ember Crown', subject:'The next chapter in the Ember Chronicles is here', status:'sent', openRate:68.9, clickRate:34.1, sent:621, date:'Mar 4, 2026' },
      { id:'3', name:'April Newsletter', subject:'Spring reading picks + a surprise', status:'draft', openRate:0, clickRate:0, sent:0, date:'Apr 10, 2026' },
      { id:'4', name:'VIP Early Access', subject:'You get to read it first...', status:'scheduled', openRate:0, clickRate:0, sent:0, date:'Apr 8, 2026' },
      { id:'5', name:'February Roundup', subject:'February was wild. Here\'s why.', status:'sent', openRate:48.9, clickRate:9.1, sent:4650, date:'Feb 28, 2026' },
      { id:'6', name:'Holiday Special', subject:'A gift from me to you', status:'sent', openRate:62.1, clickRate:18.5, sent:5100, date:'Dec 20, 2025' },
      { id:'8', name:'Parnassus Books Signing — Nashville', subject:'Nashville readers: come find me at Parnassus this Saturday', status:'sent', openRate:71.3, clickRate:24.6, sent:312, date:'Apr 5, 2026' },
      { id:'9', name:'Live Q&A — The Ember Crown', subject:'Live Q&A this Thursday — bring your questions about The Ember Crown', status:'scheduled', openRate:0, clickRate:0, sent:0, date:'May 22, 2026' },
      { id:'10', name:'Reader Community — Founding Invitation', subject:"You're invited: I'm opening my reader community to my most loyal subscribers first", status:'draft', openRate:0, clickRate:0, sent:0, date:'Jun 1, 2026' },
      { id:'11', name:'Backlist Spotlight — The Ashford Inheritance', subject:'The book my readers call my best work', status:'scheduled', openRate:0, clickRate:0, sent:0, date:'Jun 20, 2026' },
    ];
  }

  getFlows(): Flow[] {
    return FLOWS_DATA;
  }

  getFlowTemplates(): FlowTemplate[] {
    return FLOW_TEMPLATES_DATA;
  }

  getTemplates(): Template[] {
    return [
      { id:'1', name:'Newsletter Classic', category:'Newsletter', preview:'NL', description:'Clean newsletter layout with header, body, and footer' },
      { id:'37', name:'Preorder Confirmation', category:'Launch', preview:'WE', description:'Fires within seconds of preorder. Confirms transaction and release date. Explicitly clarifies billing timing: "Your card will be charged on [release date], when the book is delivered." Acknowledges the reader\'s advance commitment. Brief specific tease not in the official blurb. Sets expectations: "Preorder readers hear from me before anyone else does."' },
      { id:'38', name:'Preorder Nurture — Behind the Scenes', category:'Launch', preview:'SE', description:'Exclusive to preorder readers — exists nowhere else in your marketing. Personal note about writing the book: what surprised you, what challenged you, the anecdote you haven\'t shared anywhere else. Write it like a letter to a reader friend. Sends ~7 weeks before release.' },
      { id:'39', name:'Preorder Nurture — First Chapter', category:'Launch', preview:'SE', description:'First chapter or compelling excerpt — a reward and commitment-reinforcement device. A reader who reads your first chapter and finds it as good as they hoped will be more impatient for release day, not less. Sends ~4 weeks before release.' },
      { id:'40', name:'Preorder Nurture — Cover Story', category:'Launch', preview:'NL', description:'The story behind the cover: the brief, the design process, the element that nearly didn\'t make it in, the detail you love that most readers won\'t notice on first look. Transforms a cover image from a design asset into a shared experience. Sends ~2 weeks before release.' },
      { id:'41', name:'Preorder Nurture — Countdown', category:'Launch', preview:'BL', description:'Brief and energetic. Release date now presented as imminent rather than distant. One or two lines capturing your excitement. Note that the fulfillment email is coming soon. The drumroll before the payoff. Sends 1 week before release.' },
      { id:'42', name:'Preorder Fulfillment', category:'Launch', preview:'WE', description:'Celebration-first email — not a receipt with a download link. Opens with genuine excitement: "It\'s here. [Title] is finally in your hands." Download link clearly labeled and prominently placed. Acknowledges the reader\'s role in the launch. Plants the review seed. Preorder readers receive this before the general public.' },
      { id:'43', name:'Series Completion — Next Series', category:'Launch', preview:'BL', description:'For readers who finished your series and have another series to discover. Acknowledges the milestone specifically (1–2 sentences). Single targeted recommendation with connection explanation — shared world, emotional register, character complexity. One CTA. Subject: "So you finished [Series Name]…" or "The next chapter in [World Name]"' },
      { id:'44', name:'Series Completion — Standalone Rec.', category:'Launch', preview:'NL', description:'For readers who finished your only series and have standalones to discover. Positions the standalone as a different kind of excellence, not a lesser commitment. Leads with what\'s most similar: emotional register, character complexity, prose style. Subject: "What to read after [Final Title]"' },
      { id:'45', name:'Series Completion — Mid-Series', category:'Launch', preview:'RE', description:'For readers who purchased a non-final book in a series. Warm, direct recommendation for the next book in the sequence. Brief hook referencing where the story left off without spoiling. Shorter wait period than series-end scenario. Subject: "[Character Name] isn\'t quite done with you yet"' },
      { id:'46', name:'Series Completion — Catalog Complete', category:'Launch', preview:'WE', description:'For readers who have read everything in your catalog. No purchase recommendation — relationship deepening instead. What\'s coming next, community invite, exclusive content (deleted scene, character Q&A, world-building document). Subject: "You finished the series. What now?"' },
      { id:'9', name:'Book Launch', category:'Launch', preview:'BL', description:'High-impact launch day email: cover image, hook, early praise, and single CTA button. Structured for maximum sales velocity on release day.' },
      { id:'10', name:'Week-Two Push', category:'Launch', preview:'BL', description:'Post-launch follow-up for non-buyers. Highlights early reviews, reader reactions, and momentum. Warmer tone than day one.' },
      { id:'11', name:'Pre-Launch Tease', category:'Launch', preview:'BL', description:'2–3 days before release: cover reveal, first chapter preview, or a personal note building anticipation.' },
      { id:'12', name:'ARC Invitation', category:'ARC', preview:'BL', description:'Recruit advance readers from your most engaged segment. Covers all 5 required elements: what you\'re offering, what you\'re asking, timing, delivery method, and how to say yes.' },
      { id:'13', name:'ARC Follow-Up', category:'ARC', preview:'RE', description:'Warm reminder to your ARC team 1 week before launch. Leads with gratitude, includes direct platform review links, and frames the ask as low-stakes and easy.' },
      { id:'14', name:'ARC Post-Launch Thank-You', category:'ARC', preview:'WE', description:'Close the loop with your ARC team after launch. Share results, thank them genuinely, and deepen their investment in your next book.' },
      { id:'15', name:'New Release Notification', category:'Launch', preview:'NL', description:'Targeted notification for backlist and series readers, sent 2–4 days post-launch. Warmer tone, more direct ask. Acknowledges the relationship, connects to previous titles, includes early praise.' },
      { id:'16', name:'New Release — Series Readers', category:'Launch', preview:'NL', description:'Series-specific version of the New Release Notification. Explicitly connects the new title to what came before, names the previous book, and includes a secondary "Start from the beginning" link.' },
      { id:'2', name:'Book Launch', category:'Launch', preview:'BL', description:'High-impact launch announcement with CTA button' },
      { id:'33', name:'Abandoned Cart — Email 1', category:'Transaction', preview:'BL', description:'First cart recovery email — fires 1 hour after abandonment. Leads with the book (not the cart), includes cover image, one line of reader praise, and a single button back to the product page or pre-populated cart. Warm and low-pressure.' },
      { id:'34', name:'Abandoned Cart — Final Nudge', category:'Transaction', preview:'RE', description:'Second and final cart recovery email — fires 24 hours after Email 1 if no purchase. Two or three sentences. Acknowledges this is a reminder, not a fresh pitch. No urgency language, no artificial deadlines.' },
      { id:'35', name:'Abandoned Checkout — Email 1', category:'Transaction', preview:'BL', description:'First checkout recovery email — fires 30 minutes after abandonment. Direct acknowledgment of what happened. Lists accepted payment methods, mentions guest checkout, states money-back guarantee. "Hit reply and I\'ll sort it out personally." Cart restoration link if platform supports it.' },
      { id:'36', name:'Abandoned Checkout — Follow-Up', category:'Transaction', preview:'RE', description:'Second and final checkout recovery email — fires 24 hours after Email 1 if no purchase. Shorter and warmer. Closes with a clear invitation to reach out if anything went wrong. After two emails, the flow ends.' },
      { id:'27', name:'Order Confirmation', category:'Transaction', preview:'NL', description:'Immediate receipt confirming the purchase — title, format, price, and what happens next. Warm on-brand message, not a cold generic receipt. Fires within seconds of purchase.' },
      { id:'28', name:'Digital Delivery', category:'Transaction', preview:'BL', description:'Download link goes first. Clear access button with simple device instructions. Offer to help with technical issues via reply. Fires alongside or immediately after the order confirmation.' },
      { id:'29', name:'Post-Purchase Thank You', category:'Transaction', preview:'WE', description:'First-time buyer thank you — genuine appreciation in the author\'s voice, a personal angle on the book, and one soft next step. Not a pitch. Fires immediately after confirmation for first-time buyers.' },
      { id:'30', name:'Post-Purchase Follow-Up', category:'Transaction', preview:'RE', description:'Arrives 3–5 days after purchase when the reading experience is fresh. Opens with curiosity, invites an honest review with a direct link to the review submission page, and includes a brief next-book suggestion as a secondary element.' },
      { id:'31', name:'Review Request', category:'Transaction', preview:'SF', description:'Dedicated standalone review ask — one job, one link. Fires 4–7 days after purchase. More effective than burying the ask inside a longer email. Direct links to review submission pages on each platform, labeled by name. No ask for a five-star review.' },
      { id:'32', name:'Repeat Purchase Thank You', category:'Transaction', preview:'WE', description:'Fires instead of the standard thank you when a reader buys for the second or subsequent time. Warmer, more personal, more explicitly grateful. Acknowledges the return directly and offers something that rewards the loyalty.' },
      { id:'3', name:'Welcome Email', category:'Automation', preview:'WE', description:'Warm welcome email for new subscribers' },
      { id:'4', name:'Story Excerpt', category:'Content', preview:'SE', description:'Share a chapter or excerpt with your readers' },
      { id:'5', name:'Event Invite', category:'Event', preview:'EV', description:'Invite readers to a signing, webinar, or live event' },
      { id:'17', name:'In-Person Signing Announcement', category:'Event', preview:'EV', description:'Structured announcement for bookstore signings and library appearances. Answers all five essential questions — what, when, where, why, and how to attend — in the opening paragraph. Includes venue link and add-to-calendar CTA.' },
      { id:'18', name:'Virtual Q&A Announcement', category:'Event', preview:'EV', description:'Live session announcement for Zoom, YouTube, or social platforms. Includes direct join link, multi-timezone time display, and registration CTA. Designed for the three-email virtual event sequence.' },
      { id:'19', name:'Launch Party Invitation', category:'Event', preview:'EV', description:'Virtual or in-person launch party email. Combines event invitation with new release energy — cover reveal, giveaway details, and early purchase incentive alongside the event logistics.' },
      { id:'20', name:'Event Follow-Up Reminder', category:'Event', preview:'EV', description:'1–2 day pre-event reminder. Shorter than the original announcement — refreshes the essential details (date, time, link) without re-explaining the full context. Assumes the reader has already seen the invitation.' },
      { id:'21', name:'Same-Day Event Reminder', category:'Event', preview:'EV', description:'Morning-of reminder for virtual events. Creates immediacy and makes showing up feel urgent without pressure. Includes the direct join link prominently — test it before sending.' },
      { id:'22', name:'Reader Community Invitation', category:'Community', preview:'RC', description:'Founding-member invitation for your most engaged subscribers. Paints the interior of the community — current conversations, exclusives, what it feels like to be inside — rather than describing it from the outside. Includes one direct join CTA.' },
      { id:'23', name:'Community Re-Invitation', category:'Community', preview:'RC', description:'Second-wave invitation for the broader list after the founding group has established community energy. References what\'s already happening inside to make joining feel like entering a living space rather than an empty room.' },
      { id:'24', name:'Backlist Spotlight — Series Starter', category:'Backlist', preview:'BS', description:'Confident recommendation of your series entry point for new subscribers who haven\'t purchased yet. Leads with what makes the book special, includes your best review line, and ends with one direct purchase CTA plus a secondary series link.' },
      { id:'25', name:'Backlist Spotlight — Hidden Gem', category:'Backlist', preview:'BS', description:'Personal recommendation of a lesser-known catalog title for long-term subscribers with gaps in their reading. Assumes a relationship deep enough to make a specific recommendation based on what they\'ve already read.' },
      { id:'26', name:'Backlist Spotlight — Next in Series', category:'Backlist', preview:'BS', description:'Targeted spotlight for partial-series readers — sent to subscribers who bought Book 1 but not Book 2. Acknowledges what they\'ve read and frames the next book as the natural continuation of their journey.' },
      { id:'6', name:'Re-engagement', category:'Automation', preview:'RE', description:'Win back inactive subscribers with a personal touch' },
      { id:'7', name:'Holiday Special', category:'Seasonal', preview:'HS', description:'Festive email with seasonal design elements' },
      { id:'8', name:'Survey / Feedback', category:'Engagement', preview:'SF', description:'Ask readers for feedback or poll their preferences' },
    ];
  }

  getRecentActivity(): ActivityItem[] {
    return [
      { id:'1', type:'campaign_sent', message:'Campaign "March Newsletter" sent to 4,821 subscribers', time:'2 hours ago', icon:'campaign' },
      { id:'2', type:'new_subscriber', message:'New subscriber: priya@example.com joined via landing page', time:'4 hours ago', icon:'subscriber' },
      { id:'3', type:'flow_triggered', message:'Welcome Flow triggered for 12 new subscribers', time:'6 hours ago', icon:'flow' },
      { id:'4', type:'new_subscriber', message:'New subscriber: tom@example.com joined via book link', time:'8 hours ago', icon:'subscriber' },
      { id:'5', type:'campaign_sent', message:'Campaign "VIP Early Access" scheduled for Apr 8', time:'1 day ago', icon:'scheduled' },
      { id:'6', type:'flow_triggered', message:'Winback Flow triggered for 23 inactive subscribers', time:'2 days ago', icon:'flow' },
    ];
  }

  getDashboardStats() {
    return {
      totalSubscribers: 8421,
      subscriberGrowth: 12.4,
      emailsSent: 24830,
      emailsGrowth: 8.1,
      openRate: 54.2,
      openRateGrowth: 3.2,
      revenue: 4280,
      revenueGrowth: 22.7,
    };
  }

  getCampaignChartData() {
    return [
      { label:'Jan', sent:3200, opened:1740 },
      { label:'Feb', sent:4650, opened:2274 },
      { label:'Mar', sent:4821, opened:2613 },
      { label:'Apr', sent:2100, opened:0 },
    ];
  }

  getSubscriberGrowthData() {
    return [
      { label:'Oct', count:5800 },
      { label:'Nov', count:6200 },
      { label:'Dec', count:6900 },
      { label:'Jan', count:7400 },
      { label:'Feb', count:7900 },
      { label:'Mar', count:8421 },
    ];
  }
}
