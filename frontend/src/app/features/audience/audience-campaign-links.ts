/** Build campaign wizard URLs with audience pre-selected (Brevo-style "Send email"). */
export function campaignUrlForList(listId: string, name?: string): string {
  const params = new URLSearchParams({ create: '1', listId });
  if (name) params.set('audienceName', name);
  return `/campaigns?${params.toString()}`;
}

export function campaignUrlForSegment(segmentId: string, name?: string): string {
  const params = new URLSearchParams({ create: '1', segmentId });
  if (name) params.set('audienceName', name);
  return `/campaigns?${params.toString()}`;
}

export function profilesUrlForList(listId: string, name?: string): string {
  const params = new URLSearchParams({ listId });
  if (name) params.set('audienceName', name);
  return `/audience/profiles?${params.toString()}`;
}

export function profilesUrlForSegment(segmentId: string, name?: string): string {
  const params = new URLSearchParams({ segmentId });
  if (name) params.set('audienceName', name);
  return `/audience/profiles?${params.toString()}`;
}

export interface AudienceFolderGroup<T> {
  folderId: string;
  folderName: string;
  items: T[];
}

export function groupByFolder<T extends { folderId?: string; folderName?: string }>(
  items: T[],
  uncategorizedLabel = 'Uncategorized',
): AudienceFolderGroup<T>[] {
  const map = new Map<string, T[]>();
  for (const item of items) {
    const key = item.folderId || '';
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(item);
  }
  return Array.from(map.entries()).map(([folderId, groupItems]) => ({
    folderId,
    folderName: groupItems[0]?.folderName || uncategorizedLabel,
    items: groupItems,
  }));
}
