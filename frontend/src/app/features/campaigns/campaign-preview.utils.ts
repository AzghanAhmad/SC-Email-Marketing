export const CAMPAIGN_TYPE_LABELS: Record<string, string> = {
  'book-launch': 'Book Launch',
  'new-release': 'New Release',
  'arc-invite': 'ARC Invitation',
  'arc-followup': 'ARC Follow-Up',
  newsletter: 'Newsletter',
  'nl-swap': 'Newsletter Swap',
  'flash-sale': 'Flash Sale',
  'price-drop': 'Price Drop',
  'price-drop-2': 'Price Drop Notif.',
  'box-set': 'Box Set / Bundle',
  giveaway: 'Giveaway',
  survey: 'Survey',
  event: 'Event Announcement',
  'reader-community': 'Reader Community',
  backlist: 'Backlist Spotlight',
};

const LEGACY_AUDIENCE_LABELS: Record<string, string> = {
  all: 'All Subscribers',
  vip: 'VIP Readers',
  launch: 'Launch List',
  newsletter: 'Newsletter Only',
};

const PREVIEW_MERGE_TAGS: Record<string, string> = {
  first_name: 'Jane',
  last_name: 'Reader',
  book_title: 'The Midnight Harbor',
  author_name: 'Author',
  release_date: 'March 15, 2026',
  store_link: 'https://books.example.com',
};

export function buildPreviewOverridesFromExtras(
  extras: Record<string, string> | undefined,
  fromName?: string,
): Record<string, string> {
  const e = extras ?? {};
  const overrides: Record<string, string> = {};

  for (const [key, value] of Object.entries(e)) {
    if (value?.trim() && /^[a-z_][\w]*$/i.test(key)) {
      overrides[key] = value.trim();
    }
  }

  const bookTitle =
    overrides['book_title'] ||
    e['flashSale_title']?.trim() ||
    e['backlist_title']?.trim() ||
    e['priceDrop_title']?.trim() ||
    e['boxSet_title']?.trim() ||
    e['event_name']?.trim() ||
    '';
  if (bookTitle) overrides['book_title'] = bookTitle;

  if (fromName?.trim()) {
    overrides['author_name'] = fromName.trim();
  }

  const storeLink =
    overrides['store_link'] ||
    e['directStoreLink']?.trim() ||
    e['amazonLink']?.trim() ||
    '';
  if (storeLink) overrides['store_link'] = storeLink;

  return overrides;
}

export function formatCampaignDateTime(campaign: {
  status?: string;
  scheduledAt?: string | null;
  sentAt?: string | null;
  date?: string;
} | null | undefined): string {
  if (!campaign) return '—';

  const format = (raw: string) => {
    const d = new Date(raw);
    return Number.isNaN(d.getTime())
      ? raw
      : d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
  };

  if (campaign.status === 'scheduled' && campaign.scheduledAt) {
    return format(campaign.scheduledAt);
  }

  if (campaign.sentAt) {
    return format(campaign.sentAt);
  }

  if (campaign.scheduledAt) {
    return format(campaign.scheduledAt);
  }

  return campaign.date || '—';
}

export function campaignTypeLabel(id?: string): string {
  if (!id) return '—';
  return CAMPAIGN_TYPE_LABELS[id] ?? id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export function applyPreviewMergeTags(text: string, overrides: Record<string, string> = {}): string {
  if (!text) return text;
  const tags = { ...PREVIEW_MERGE_TAGS, ...overrides };
  return text.replace(/\{\{\s*([\w_]+)\s*\}\}/g, (_, key: string) =>
    tags[key] ?? key.replace(/_/g, ' ')
  );
}

export function isHtmlContent(content: string): boolean {
  return /<\s*(div|p|table|h[1-6]|a|span|ul|ol|li|html|body|center|tr|td|th|img|style)\b/i.test(content ?? '');
}

function parseJsonIds(json?: string): string[] {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

export function resolveAudienceLabel(
  sendToSegment: string | undefined,
  extras: Record<string, string> | undefined,
  lists: { id: string; name: string }[],
  segments: { id: string; name: string }[],
): string {
  const listIds = parseJsonIds(extras?.['recipientListIds']);
  const segmentIds = parseJsonIds(extras?.['recipientSegmentIds']);
  const contactIds = parseJsonIds(extras?.['recipientContactIds']);

  const parts: string[] = [];
  for (const id of listIds) {
    parts.push(lists.find(l => l.id === id)?.name ?? 'List');
  }
  for (const id of segmentIds) {
    parts.push(segments.find(s => s.id === id)?.name ?? 'Segment');
  }
  if (contactIds.length) {
    parts.push(`${contactIds.length} contact${contactIds.length === 1 ? '' : 's'}`);
  }
  if (parts.length) return parts.join(', ');

  const key = sendToSegment || 'all';
  const segment = segments.find(s => s.id === key);
  if (segment) return segment.name;

  const list = lists.find(l => l.id === key);
  if (list) return list.name;

  return LEGACY_AUDIENCE_LABELS[key] ?? key;
}
