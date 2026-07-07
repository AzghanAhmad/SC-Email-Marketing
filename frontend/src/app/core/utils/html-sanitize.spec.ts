import { describe, expect, it } from 'vitest';
import { sanitizeEmailHtml } from './html-sanitize';

describe('sanitizeEmailHtml', () => {
  it('removes script tags', () => {
    const input = '<p>Hi</p><script>alert("xss")</script>';
    expect(sanitizeEmailHtml(input)).toBe('<p>Hi</p>');
  });

  it('removes inline event handlers', () => {
    const input = '<img src="x" onerror="alert(1)" alt="test">';
    expect(sanitizeEmailHtml(input)).not.toMatch(/onerror/i);
    expect(sanitizeEmailHtml(input)).toContain('<img');
  });

  it('neutralizes javascript: URLs', () => {
    const input = '<a href="javascript:alert(1)">click</a>';
    expect(sanitizeEmailHtml(input)).not.toMatch(/javascript:/i);
  });

  it('preserves safe formatting tags', () => {
    const input = '<p><strong>Hello</strong> <em>world</em></p>';
    expect(sanitizeEmailHtml(input)).toBe(input);
  });

  it('does not treat SQL injection as executable markup', () => {
    const input = "'; DROP TABLE MailboxMessages; --";
    expect(sanitizeEmailHtml(input)).toBe(input);
  });
});
