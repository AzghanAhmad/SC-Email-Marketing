import { Email } from './email.service';

export type EmailListItem =
  | { type: 'single'; email: Email }
  | {
      type: 'thread';
      threadId: string;
      emails: Email[];
      latest: Email;
      unreadCount: number;
    };

/** Group messages from the same sender received within this window (ms). */
export const THREAD_WINDOW_MS = 20 * 60 * 1000;

export function groupEmailsIntoThreads(emails: Email[]): EmailListItem[] {
  if (emails.length === 0) return [];

  const chronological = [...emails].sort(
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
  );

  const clusters: Email[][] = [];
  for (const email of chronological) {
    const last = clusters[clusters.length - 1];
    if (last) {
      const prev = last[last.length - 1];
      const sameSender = prev.fromEmail.toLowerCase() === email.fromEmail.toLowerCase();
      const withinWindow =
        email.timestamp.getTime() - prev.timestamp.getTime() <= THREAD_WINDOW_MS;
      if (sameSender && withinWindow) {
        last.push(email);
        continue;
      }
    }
    clusters.push([email]);
  }

  return clusters
    .map(cluster => {
      const ordered = [...cluster].sort(
        (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
      );
      const latest = ordered[0];
      if (ordered.length === 1) {
        return { type: 'single' as const, email: latest };
      }
      return {
        type: 'thread' as const,
        threadId: `thread-${latest.fromEmail}-${latest.id}`,
        emails: ordered,
        latest,
        unreadCount: ordered.filter(e => !e.read).length,
      };
    })
    .sort((a, b) => {
      const aTime = a.type === 'single' ? a.email.timestamp : a.latest.timestamp;
      const bTime = b.type === 'single' ? b.email.timestamp : b.latest.timestamp;
      return bTime.getTime() - aTime.getTime();
    });
}
