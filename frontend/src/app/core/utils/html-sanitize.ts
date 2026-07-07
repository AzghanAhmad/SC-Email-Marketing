/** Strip common XSS vectors from email HTML before storage or DOM insertion. */
export function sanitizeEmailHtml(html: string): string {
  if (!html) return '';

  let out = html;
  out = out.replace(/<script\b[\s\S]*?<\/script>/gi, '');
  out = out.replace(/<\/?(?:script|iframe|object|embed|form|meta|link|base|style)\b[^>]*>/gi, '');
  out = out.replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '');
  out = out.replace(/\b(href|src|xlink:href)\s*=\s*(?:"|')\s*javascript:[^"']*(?:"|')/gi, '$1="#"');
  return out;
}
