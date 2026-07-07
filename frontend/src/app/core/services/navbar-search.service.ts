import { Injectable } from '@angular/core';

export interface NavbarSearchResult {
  title: string;
  description: string;
  route: string;
  category: string;
  keywords: string[];
}

const SEARCH_INDEX: NavbarSearchResult[] = [
  { title: 'Email Inbox', description: 'Read and send email', route: '/email/inbox', category: 'Email', keywords: ['mail', 'inbox', 'messages'] },
  { title: 'Dashboard', description: 'Overview and key metrics', route: '/dashboard', category: 'Analytics', keywords: ['overview', 'stats', 'home'] },
  { title: 'Campaigns', description: 'Newsletters and broadcast emails', route: '/campaigns', category: 'Campaigns', keywords: ['newsletter', 'broadcast', 'send'] },
  { title: 'Flows', description: 'Automation flows and library', route: '/flows', category: 'Flows', keywords: ['automation', 'sequence', 'welcome', 'templates'] },
  { title: 'Audience', description: 'Subscribers and lists', route: '/audience', category: 'Audience', keywords: ['subscribers', 'readers', 'list'] },
  { title: 'Lists & Segments', description: 'Manage segments and tags', route: '/audience/lists-segments', category: 'Audience', keywords: ['segment', 'tag', 'vip'] },
  { title: 'Subscriber Profiles', description: 'Individual reader profiles', route: '/audience/profiles', category: 'Audience', keywords: ['profile', 'contact'] },
  { title: 'Growth Tools', description: 'List building tools', route: '/audience/growth-tools', category: 'Audience', keywords: ['growth', 'opt-in', 'magnet'] },
  { title: 'Email Templates', description: 'Reusable email designs', route: '/content/templates', category: 'Content', keywords: ['template', 'design'] },
  { title: 'Sign-up Forms', description: 'Embedded subscription forms', route: '/website/sign-up-forms', category: 'Website', keywords: ['form', 'subscribe', 'embed'] },
  { title: 'Landing Pages', description: 'Reader landing pages', route: '/website/landing-pages', category: 'Website', keywords: ['landing', 'page'] },
  { title: 'Analytics Dashboards', description: 'Performance dashboards', route: '/analytics/dashboards', category: 'Analytics', keywords: ['reports', 'metrics'] },
  { title: 'List Health', description: 'List quality and engagement', route: '/analytics/list-health', category: 'Analytics', keywords: ['health', 'engagement', 'inactive'] },
  { title: 'Domain Setup', description: 'Amazon SES and DNS configuration', route: '/settings/domain', category: 'Settings', keywords: ['domain', 'ses', 'dns', 'deliverability'] },
  { title: 'Amazon SES setup', description: 'Connect AWS SES and SNS', route: '/settings/amazon-ses-setup', category: 'Settings', keywords: ['ses', 'sns', 'aws', 'domain', 'deliverability'] },
  { title: 'Deliverability', description: 'Inbox placement and sending', route: '/analytics/deliverability', category: 'Analytics', keywords: ['spam', 'bounce', 'domain'] },
  { title: 'Integrations', description: 'Shopify, BookFunnel, and more', route: '/integrations', category: 'Integrations', keywords: ['shopify', 'bookfunnel', 'connect'] },
  { title: 'Settings', description: 'Account, domain, and inbox', route: '/settings', category: 'Settings', keywords: ['account', 'profile', 'password', 'inbox'] },
  { title: 'About ScribeCount Email', description: 'What this platform does', route: '/about', category: 'Help', keywords: ['about', 'help', 'what', 'platform'] },
];

@Injectable({ providedIn: 'root' })
export class NavbarSearchService {
  search(query: string, limit = 8): NavbarSearchResult[] {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return [];

    return SEARCH_INDEX
      .map(item => ({ item, score: this.scoreItem(item, terms) }))
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(x => x.item);
  }

  private scoreItem(item: NavbarSearchResult, terms: string[]): number {
    const title = item.title.toLowerCase();
    const description = item.description.toLowerCase();
    const category = item.category.toLowerCase();
    const keywords = item.keywords.map(k => k.toLowerCase());
    const haystack = [title, description, category, ...keywords].join(' ');

    let score = 0;
    for (const term of terms) {
      if (!haystack.includes(term)) return 0;

      if (title === term) score += 120;
      else if (title.startsWith(term)) score += 80;
      else if (title.includes(term)) score += 50;
      else if (keywords.some(k => k === term || k.startsWith(term))) score += 40;
      else if (category.includes(term)) score += 25;
      else if (description.includes(term)) score += 15;
      else score += 5;
    }

    return score;
  }
}
