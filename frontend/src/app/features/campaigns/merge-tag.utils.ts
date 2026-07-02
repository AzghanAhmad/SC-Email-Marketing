export const AUTO_MERGE_TAGS = new Set([
  'first_name', 'last_name', 'full_name', 'email',
  'author_name', 'month',
  'unsubscribe_url', 'view_in_browser_url',
]);

const TAG_LABELS: Record<string, string> = {
  book_title: 'Book title',
  store_link: 'Store / buy link',
  release_date: 'Release date',
  order_id: 'Order ID',
};

export function extractMergeTags(...texts: (string | undefined)[]): string[] {
  const found = new Set<string>();
  const re = /\{\{\s*([\w_]+)\s*\}\}/gi;
  for (const text of texts) {
    if (!text) continue;
    let match: RegExpExecArray | null;
    while ((match = re.exec(text)) !== null) {
      found.add(match[1].toLowerCase());
    }
  }
  return [...found];
}

export function userCollectibleMergeTags(...texts: (string | undefined)[]): string[] {
  return extractMergeTags(...texts).filter(t => !AUTO_MERGE_TAGS.has(t));
}

export function mergeTagLabel(tag: string): string {
  return TAG_LABELS[tag] ?? tag.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}
