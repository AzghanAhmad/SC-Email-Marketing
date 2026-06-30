/** Parse API timestamps as UTC when the server omits a timezone suffix. */
export function parseApiDate(value: string | Date | null | undefined): Date {
  if (value instanceof Date) return value;
  if (!value) return new Date();
  const raw = String(value).trim();
  if (!raw) return new Date();
  if (/[zZ]$|[+-]\d{2}:\d{2}$/.test(raw)) return new Date(raw);
  return new Date(`${raw}Z`);
}

function formatLocalTime(date: Date): string {
  return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

function isSameCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** Inbox list time using the viewer's local timezone. */
export function formatInboxListTime(value: string | Date, now = new Date()): string {
  const date = parseApiDate(value);
  if (date.getTime() > now.getTime()) {
    return formatLocalTime(date);
  }

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  if (isSameCalendarDay(date, now)) return formatLocalTime(date);
  if (isSameCalendarDay(date, yesterday)) return `Yesterday ${formatLocalTime(date)}`;

  const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);
  if (diffDays < 7) {
    const day = date.toLocaleDateString(undefined, { weekday: 'short' });
    return `${day} ${formatLocalTime(date)}`;
  }

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

/** Full local date/time for the opened email view. */
export function formatEmailDetailDate(value: string | Date): string {
  const date = parseApiDate(value);
  return date.toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}
