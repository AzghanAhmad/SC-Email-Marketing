/** Serialize / deserialize type-specific guidance fields into campaign extras. */

export function collectGuidanceExtras(
  campaignType: string,
  refs: {
    flashSale?: { saleDetails: Record<string, string> };
    priceDrop?: { dropDetails: Record<string, string> };
    boxSet?: { bundleDetails: Record<string, string> };
    survey?: { surveyDetails: Record<string, string>; surveyQuestions: { text: string; type: string }[] };
    event?: { eventDetails: Record<string, string> };
    readerCommunity?: { communityDetails: Record<string, string> };
    backlist?: { spotlightDetails: Record<string, string>; catalogTitles: { title: string; status: string }[] };
    nlSwap?: { partner: Record<string, string> };
  }
): Record<string, string> {
  const out: Record<string, string> = {};
  const prefix = (p: string, obj: Record<string, unknown>) => {
    for (const [k, v] of Object.entries(obj)) {
      if (v !== undefined && v !== null && String(v).trim() !== '') {
        out[`${p}_${k}`] = String(v);
      }
    }
  };

  switch (campaignType) {
    case 'flash-sale':
      if (refs.flashSale) prefix('flashSale', refs.flashSale.saleDetails);
      break;
    case 'price-drop':
    case 'price-drop-2':
      if (refs.priceDrop) prefix('priceDrop', refs.priceDrop.dropDetails);
      break;
    case 'box-set':
      if (refs.boxSet) prefix('boxSet', refs.boxSet.bundleDetails);
      break;
    case 'survey':
      if (refs.survey) {
        prefix('survey', refs.survey.surveyDetails);
        out['survey_questions'] = JSON.stringify(refs.survey.surveyQuestions.filter(q => q.text.trim()));
      }
      break;
    case 'event':
      if (refs.event) prefix('event', refs.event.eventDetails);
      break;
    case 'reader-community':
      if (refs.readerCommunity) prefix('community', refs.readerCommunity.communityDetails);
      break;
    case 'backlist':
      if (refs.backlist) {
        prefix('backlist', refs.backlist.spotlightDetails);
        out['backlist_catalog'] = JSON.stringify(refs.backlist.catalogTitles.filter(t => t.title.trim()));
      }
      break;
    case 'nl-swap':
      if (refs.nlSwap) prefix('nlSwap', refs.nlSwap.partner);
      break;
  }

  const bookTitle =
    refs.flashSale?.saleDetails?.['title']?.trim() ||
    refs.priceDrop?.dropDetails?.['title']?.trim() ||
    refs.boxSet?.bundleDetails?.['title']?.trim() ||
    refs.backlist?.spotlightDetails?.['title']?.trim() ||
    refs.event?.eventDetails?.['name']?.trim();
  if (bookTitle) out['book_title'] = bookTitle;

  return out;
}

export function loadGuidanceExtras(
  campaignType: string,
  extras: Record<string, string>,
  refs: Parameters<typeof collectGuidanceExtras>[1]
): void {
  const read = (p: string, target: Record<string, string>) => {
    for (const key of Object.keys(target)) {
      const v = extras[`${p}_${key}`];
      if (v !== undefined) target[key] = v;
    }
  };

  switch (campaignType) {
    case 'flash-sale':
      if (refs.flashSale) read('flashSale', refs.flashSale.saleDetails);
      break;
    case 'price-drop':
    case 'price-drop-2':
      if (refs.priceDrop) read('priceDrop', refs.priceDrop.dropDetails);
      break;
    case 'box-set':
      if (refs.boxSet) read('boxSet', refs.boxSet.bundleDetails);
      break;
    case 'survey':
      if (refs.survey) {
        read('survey', refs.survey.surveyDetails);
        if (extras['survey_questions']) {
          try {
            const parsed = JSON.parse(extras['survey_questions']) as { text: string; type: string }[];
            if (Array.isArray(parsed) && parsed.length) refs.survey.surveyQuestions = parsed;
          } catch { /* ignore */ }
        }
      }
      break;
    case 'event':
      if (refs.event) read('event', refs.event.eventDetails);
      break;
    case 'reader-community':
      if (refs.readerCommunity) read('community', refs.readerCommunity.communityDetails);
      break;
    case 'backlist':
      if (refs.backlist) {
        read('backlist', refs.backlist.spotlightDetails);
        if (extras['backlist_catalog']) {
          try {
            const parsed = JSON.parse(extras['backlist_catalog']) as { title: string; status: string }[];
            if (Array.isArray(parsed) && parsed.length) refs.backlist.catalogTitles = parsed;
          } catch { /* ignore */ }
        }
      }
      break;
    case 'nl-swap':
      if (refs.nlSwap) read('nlSwap', refs.nlSwap.partner);
      break;
  }
}
