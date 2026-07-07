import { Email } from './email.service';
import { formatEmailDetailDate } from './email-datetime.utils';
import { sanitizeEmailHtml } from '../../core/utils/html-sanitize';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatBodyHtml(body: string): string {
  if (!body?.trim()) return '<p>&nbsp;</p>';
  if (/<[a-z][\s\S]*>/i.test(body)) return sanitizeEmailHtml(body);
  return body
    .split('\n')
    .map(line => `<p>${line.trim() ? escapeHtml(line) : '&nbsp;'}</p>`)
    .join('');
}

export function buildQuotedHtml(email: Email, kind: 'reply' | 'forward'): string {
  const dateStr = formatEmailDetailDate(email.timestamp);
  const header =
    kind === 'reply'
      ? `<p class="quote-line"><strong>On ${escapeHtml(dateStr)}, ${escapeHtml(email.from)} &lt;${escapeHtml(email.fromEmail)}&gt; wrote:</strong></p>`
      : `<p class="quote-line"><strong>---------- Forwarded message ----------</strong></p>
         <p class="quote-line"><strong>From:</strong> ${escapeHtml(email.from)} &lt;${escapeHtml(email.fromEmail)}&gt;</p>
         <p class="quote-line"><strong>Date:</strong> ${escapeHtml(dateStr)}</p>
         <p class="quote-line"><strong>Subject:</strong> ${escapeHtml(email.subject)}</p>`;

  return `<div class="email-quote">${header}<blockquote class="quote-body">${formatBodyHtml(email.body)}</blockquote></div>`;
}
