import { Injectable } from '@angular/core';

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

export interface Flow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused';
  triggers: number;
  steps: FlowStep[];
}

export interface FlowStep {
  id: string;
  type: 'trigger' | 'email' | 'wait' | 'condition';
  label: string;
  detail: string;
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
    ];
  }

  getCampaigns(): Campaign[] {
    return [
      { id:'1', name:'March Newsletter', subject:'What I\'ve been writing this month...', status:'sent', openRate:54.2, clickRate:12.8, sent:4821, date:'Mar 15, 2026' },
      { id:'2', name:'Book Launch: The Ember Crown', subject:'It\'s finally here!', status:'sent', openRate:71.4, clickRate:28.3, sent:3200, date:'Mar 1, 2026' },
      { id:'3', name:'April Newsletter', subject:'Spring reading picks + a surprise', status:'draft', openRate:0, clickRate:0, sent:0, date:'Apr 10, 2026' },
      { id:'4', name:'VIP Early Access', subject:'You get to read it first...', status:'scheduled', openRate:0, clickRate:0, sent:0, date:'Apr 8, 2026' },
      { id:'5', name:'February Roundup', subject:'February was wild. Here\'s why.', status:'sent', openRate:48.9, clickRate:9.1, sent:4650, date:'Feb 28, 2026' },
      { id:'6', name:'Holiday Special', subject:'A gift from me to you', status:'sent', openRate:62.1, clickRate:18.5, sent:5100, date:'Dec 20, 2025' },
    ];
  }

  getFlows(): Flow[] {
    return [
      {
        id:'1', name:'Welcome Flow', description:'Greet new subscribers and introduce your world', status:'active', triggers:1842,
        steps:[
          { id:'s1', type:'trigger', label:'Trigger', detail:'New subscriber joins list' },
          { id:'s2', type:'email', label:'Welcome Email', detail:'Subject: Welcome to my reader community!' },
          { id:'s3', type:'wait', label:'Wait 2 Days', detail:'Delay: 2 days' },
          { id:'s4', type:'email', label:'Story Email', detail:'Subject: Here\'s a free chapter for you...' },
          { id:'s5', type:'wait', label:'Wait 3 Days', detail:'Delay: 3 days' },
          { id:'s6', type:'condition', label:'Opened?', detail:'If opened → VIP tag, else → re-engage' },
        ]
      },
      {
        id:'2', name:'Book Launch Flow', description:'Automated sequence for new book releases', status:'active', triggers:634,
        steps:[
          { id:'s1', type:'trigger', label:'Trigger', detail:'Tag: launch-list added' },
          { id:'s2', type:'email', label:'Announcement', detail:'Subject: Big news — my new book is coming!' },
          { id:'s3', type:'wait', label:'Wait 1 Day', detail:'Delay: 1 day' },
          { id:'s4', type:'email', label:'Pre-order Email', detail:'Subject: Pre-order is LIVE' },
          { id:'s5', type:'condition', label:'Pre-ordered?', detail:'If clicked → thank you email' },
        ]
      },
      {
        id:'3', name:'Winback Flow', description:'Re-engage subscribers who haven\'t opened in 90 days', status:'paused', triggers:89,
        steps:[
          { id:'s1', type:'trigger', label:'Trigger', detail:'No open in 90 days' },
          { id:'s2', type:'email', label:'Miss You Email', detail:'Subject: Still there? I miss you...' },
          { id:'s3', type:'wait', label:'Wait 7 Days', detail:'Delay: 7 days' },
          { id:'s4', type:'condition', label:'Opened?', detail:'If no open → unsubscribe tag' },
        ]
      },
    ];
  }

  getTemplates(): Template[] {
    return [
      { id:'1', name:'Newsletter Classic', category:'Newsletter', preview:'NL', description:'Clean newsletter layout with header, body, and footer' },
      { id:'2', name:'Book Launch', category:'Launch', preview:'BL', description:'High-impact launch announcement with CTA button' },
      { id:'3', name:'Welcome Email', category:'Automation', preview:'WE', description:'Warm welcome email for new subscribers' },
      { id:'4', name:'Story Excerpt', category:'Content', preview:'SE', description:'Share a chapter or excerpt with your readers' },
      { id:'5', name:'Event Invite', category:'Event', preview:'EV', description:'Invite readers to a signing, webinar, or live event' },
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
