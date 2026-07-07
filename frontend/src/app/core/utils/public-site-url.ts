/** Origin for public landing pages and sign-up forms (matches App:PublicBaseUrl on the API). */
export function getPublicSiteOrigin(): string {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin.replace(/\/$/, '');
  }
  return 'http://localhost:4200';
}

export function landingPagePublicUrl(slug: string): string {
  return `${getPublicSiteOrigin()}/p/${slug}`;
}

export function signUpFormPublicUrl(formId: string): string {
  return `${getPublicSiteOrigin()}/f/${formId}`;
}

export function signUpFormPreviewUrl(formId: string): string {
  return `${getPublicSiteOrigin()}/website/forms/preview/${formId}`;
}

/** e.g. localhost:4200/p/my-page or scribecount.com/p/my-page */
export function formatPublicUrlForDisplay(url: string): string {
  if (!url?.trim()) return '';
  try {
    const full = url.includes('://') ? url : `https://${url}`;
    const u = new URL(full);
    return `${u.host}${u.pathname}`;
  } catch {
    return url;
  }
}
