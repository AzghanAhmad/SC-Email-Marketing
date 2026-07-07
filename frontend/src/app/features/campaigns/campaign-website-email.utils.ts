import { LandingPageItem, SignUpFormItem } from '../../core/services/website-api.service';
import { NAV_ICONS } from '../../core/constants/nav-icons';
import { landingPagePublicUrl, signUpFormPreviewUrl } from '../../core/utils/public-site-url';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function emailIcon(iconKey: string, color = '#ffffff', size = 48): string {
  const raw = NAV_ICONS[iconKey] ?? NAV_ICONS['book'];
  return raw
    .replace(/width="20"/g, `width="${size}"`)
    .replace(/height="20"/g, `height="${size}"`)
    .replace(/currentColor/g, color)
    .replace(/stroke-width="1.75"/g, 'stroke-width="2"');
}

function mockField(placeholder: string, dark = false): string {
  const bg = dark ? 'rgba(255,255,255,0.95)' : '#ffffff';
  const border = dark ? 'rgba(255,255,255,0.25)' : '#e2e8f0';
  const color = '#94a3b8';
  return `<div style="padding:14px 16px;border:1.5px solid ${border};border-radius:10px;background:${bg};font-family:Arial,sans-serif;font-size:15px;color:${color};margin-bottom:12px">${escapeHtml(placeholder)}</div>`;
}

function heroCtaButton(href: string, label: string, variant: 'light' | 'blue' | 'flyout' = 'light'): string {
  const styles =
    variant === 'blue'
      ? 'background:#3b82f6;color:#ffffff'
      : variant === 'flyout'
        ? 'background:#ffffff;color:#1e3a5f'
        : 'background:#ffffff;color:#0f172a';
  return `<a href="${escapeHtml(href)}" style="display:block;width:100%;box-sizing:border-box;padding:14px 16px;border-radius:10px;${styles};font-family:Arial,sans-serif;font-size:15px;font-weight:700;text-align:center;text-decoration:none;margin-top:4px">${escapeHtml(label)}</a>`;
}

function signupBoxInner(href: string, button: string, dark = true): string {
  const boxBg = dark ? 'rgba(255,255,255,0.14)' : '#f8fafc';
  const boxBorder = dark ? 'rgba(255,255,255,0.22)' : '#cbd5e1';
  const ctaVariant = dark ? 'light' : 'blue';
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:${boxBg};border:1px solid ${boxBorder};border-radius:16px">
      <tr><td style="padding:24px">
        ${mockField('First name', dark)}
        ${mockField('Email address', dark)}
        ${heroCtaButton(href, button, ctaVariant)}
      </td></tr>
    </table>`;
}

function landingHeroBlock(opts: {
  gradient: string;
  iconKey: string;
  headline: string;
  description: string;
  href: string;
  button: string;
}): string {
  const icon = emailIcon(opts.iconKey);
  return `
<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#0f172a;font-family:Arial,sans-serif">
  <tr>
    <td align="center" style="padding:40px 20px;background:${opts.gradient}">
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:560px">
        <tr><td align="center" style="padding-bottom:20px">${icon}</td></tr>
        <tr>
          <td align="center" style="padding:0 0 12px">
            <h1 style="margin:0;font-size:32px;line-height:1.2;font-weight:800;color:#ffffff;letter-spacing:-0.02em">${escapeHtml(opts.headline)}</h1>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding:0 0 28px">
            <p style="margin:0;font-size:17px;line-height:1.6;color:rgba(255,255,255,0.88)">${escapeHtml(opts.description)}</p>
          </td>
        </tr>
        <tr><td>${signupBoxInner(opts.href, opts.button, true)}</td></tr>
      </table>
    </td>
  </tr>
</table>`;
}

function formCardBlock(opts: {
  headline: string;
  description: string;
  href: string;
  button: string;
  darkText?: boolean;
  outerBg?: string;
  cardOnly?: boolean;
}): string {
  const titleColor = opts.darkText ? '#0f172a' : '#0f172a';
  const descColor = opts.darkText ? '#64748b' : '#64748b';
  const card = `
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:420px;background:#ffffff;border-radius:16px;box-shadow:0 25px 50px -12px rgba(0,0,0,0.25)">
      <tr><td style="padding:32px">
        <h2 style="margin:0 0 12px;font-size:22px;font-weight:700;color:${titleColor};line-height:1.3">${escapeHtml(opts.headline)}</h2>
        <p style="margin:0 0 20px;font-size:15px;line-height:1.5;color:${descColor}">${escapeHtml(opts.description)}</p>
        ${mockField('First name', false)}
        ${mockField('Email address', false)}
        ${heroCtaButton(opts.href, opts.button, 'blue')}
      </td></tr>
    </table>`;

  if (opts.cardOnly) return card;

  return `
<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:${opts.outerBg ?? '#f1f5f9'};font-family:Arial,sans-serif">
  <tr>
    <td align="center" style="padding:48px 20px;background:${opts.outerBg ?? '#f1f5f9'}">
      ${card}
    </td>
  </tr>
</table>`;
}

function flyoutFormBlock(opts: {
  headline: string;
  description: string;
  href: string;
  button: string;
}): string {
  const gradient = 'linear-gradient(135deg,#1e3a5f,#2d5a87)';
  return `
<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#f1f5f9;font-family:Arial,sans-serif">
  <tr>
    <td style="padding:32px 20px">
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:640px;margin:0 auto;background:${gradient};border-radius:12px">
        <tr><td style="padding:28px 32px">
          <h2 style="margin:0 0 10px;font-size:22px;font-weight:700;color:#ffffff;line-height:1.3">${escapeHtml(opts.headline)}</h2>
          <p style="margin:0 0 18px;font-size:15px;line-height:1.5;color:rgba(255,255,255,0.9)">${escapeHtml(opts.description)}</p>
          ${mockField('First name', true)}
          ${mockField('Email address', true)}
          ${heroCtaButton(opts.href, opts.button, 'flyout')}
        </td></tr>
      </table>
    </td>
  </tr>
</table>`;
}

function embeddedFormBlock(opts: {
  headline: string;
  description: string;
  href: string;
  button: string;
}): string {
  return `
<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#f1f5f9;font-family:Arial,sans-serif">
  <tr>
    <td style="padding:32px 20px">
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px">
        <tr><td style="padding:28px">
          <div style="height:12px;width:40%;background:#e2e8f0;border-radius:6px;margin-bottom:20px"></div>
          <div style="height:8px;width:70%;background:#f1f5f9;border-radius:4px;margin-bottom:12px"></div>
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#f8fafc;border:1px dashed #cbd5e1;border-radius:12px;margin:16px 0">
            <tr><td style="padding:24px">
              <h2 style="margin:0 0 10px;font-size:20px;font-weight:700;color:#0f172a">${escapeHtml(opts.headline)}</h2>
              <p style="margin:0 0 16px;font-size:14px;line-height:1.5;color:#64748b">${escapeHtml(opts.description)}</p>
              ${mockField('First name', false)}
              ${mockField('Email address', false)}
              ${heroCtaButton(opts.href, opts.button, 'blue')}
            </td></tr>
          </table>
          <div style="height:8px;width:90%;background:#f1f5f9;border-radius:4px;margin-bottom:8px"></div>
          <div style="height:8px;width:70%;background:#f1f5f9;border-radius:4px"></div>
        </td></tr>
      </table>
    </td>
  </tr>
</table>`;
}

function popupFormBlock(opts: {
  headline: string;
  description: string;
  href: string;
  button: string;
}): string {
  return `
<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:rgba(15,23,42,0.45);font-family:Arial,sans-serif">
  <tr>
    <td align="center" style="padding:48px 20px;background:rgba(15,23,42,0.45)">
      ${formCardBlock({ ...opts, cardOnly: true })}
    </td>
  </tr>
</table>`;
}

export function buildEmailHtmlFromLandingPage(page: LandingPageItem): string {
  const url = page.url?.trim() || landingPagePublicUrl(page.slug);
  const gradient = page.themeGradient || 'linear-gradient(135deg,#1e3a5f,#2d5a87)';
  return landingHeroBlock({
    gradient,
    iconKey: page.iconKey || 'book',
    headline: page.headline || page.name,
    description: page.description || 'Download your free reader magnet and stay in the loop on new releases.',
    href: url,
    button: page.buttonText || 'Get access',
  });
}

export function buildEmailHtmlFromSignUpForm(form: SignUpFormItem): string {
  const url = signUpFormPreviewUrl(form.id);
  const headline = form.headline || form.name;
  const description = form.description || 'Get exclusive updates, free chapters, and early access.';
  const button = form.buttonText || 'Subscribe';
  const opts = { headline, description, href: url, button };

  switch (form.type) {
    case 'Flyout':
      return flyoutFormBlock(opts);
    case 'Embedded':
      return embeddedFormBlock(opts);
    case 'Full Page':
      return formCardBlock({ ...opts, outerBg: '#f1f5f9' });
    case 'Popup':
    default:
      return popupFormBlock(opts);
  }
}
