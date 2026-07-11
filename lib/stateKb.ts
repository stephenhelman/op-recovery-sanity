/**
 * State knowledge-base contract shared with the Hub API
 * (GET /api/kb/states/[stateCode] → KbSurplusInfo[]) plus the DERIVED guidance
 * the modal renders.
 *
 * Two rules run through all of this:
 *  1. Never assume a value. Missing/unclear data always routes to "check your
 *     county" — never a guessed default (no assumed "judicial", no "3–6 months").
 *  2. Foreclosure and tax records use DIFFERENT classifications that must never
 *     be cross-applied. Judicial/non-judicial → attorney guidance (foreclosure
 *     only). Lien/deed → sale-type label (tax only).
 *
 * All matching is case-insensitive, string-contains — the source has conditional
 * values like "Nonjudicial … Judicial: 1 year", so `=== "Judicial"` is wrong.
 */

export type KbType = 'foreclosure' | 'tax';

export interface KbSurplusInfo {
  stateCode: string;
  type: KbType;
  systemType: string | null;
  redemptionPeriod: string | null;
  estimatedTimeline: string | null;
  notes: string | null;
}

/** Full ask, used for the guidance paragraph. */
export const CHECK_COUNTY = 'Check your county or state website, or ask the team.';
/** Short form, used in value cells so a row doesn't wrap awkwardly. */
export const CHECK_SHORT = 'Check your county';

const FORECLOSURE_MSG: Record<ForeclosureClass, string> = {
  dual: 'This state can involve either process depending on the case — check your county or state website, or ask the team.',
  nonjudicial: "This is a non-judicial process. An attorney generally isn't required, though it's recommended.",
  judicial: 'This is a court (judicial) process, so an attorney is generally required to file.',
  check: CHECK_COUNTY,
};

export type ForeclosureClass = 'dual' | 'nonjudicial' | 'judicial' | 'check';

/**
 * Classify a foreclosure `systemType`. Dual-label is checked FIRST: a string
 * like "Judicial/Nonjudicial" contains the substring "judicial" inside
 * "nonjudicial", so we strip the "non…judicial" occurrences before testing for a
 * standalone "judicial" — otherwise a pure "Nonjudicial" would wrongly read as
 * dual, or a dual would fall through to nonjudicial ("not required").
 */
export function classifyForeclosure(systemType: string | null): ForeclosureClass {
  if (!systemType) return 'check';
  const s = systemType.toLowerCase();
  const hasNonJudicial = /non-?\s?judicial/.test(s);
  const withoutNon = s.replace(/non-?\s?judicial/g, '');
  const hasStandaloneJudicial = withoutNon.includes('judicial');

  if (hasNonJudicial && hasStandaloneJudicial) return 'dual';
  if (hasNonJudicial) return 'nonjudicial';
  if (hasStandaloneJudicial) return 'judicial';
  return 'check';
}

/** Foreclosure-only attorney/process guidance sentence. */
export function foreclosureGuidance(systemType: string | null): string {
  return FORECLOSURE_MSG[classifyForeclosure(systemType)];
}

/** Short foreclosure process label for the value cell (null/unclear → ''). */
export function foreclosureLabel(systemType: string | null): string {
  switch (classifyForeclosure(systemType)) {
    case 'dual':
      return 'Judicial or non-judicial';
    case 'nonjudicial':
      return 'Non-judicial';
    case 'judicial':
      return 'Judicial';
    default:
      return '';
  }
}

export type TaxClass = 'lien' | 'deed' | 'check';

/**
 * Classify a tax `systemType`. Lien/deed only — this NEVER produces attorney
 * guidance. "Lien & Deed", null, or unrecognized → check-your-county.
 */
export function classifyTax(systemType: string | null): TaxClass {
  if (!systemType) return 'check';
  const s = systemType.toLowerCase();
  const hasLien = s.includes('lien');
  const hasDeed = s.includes('deed');
  if (hasLien && !hasDeed) return 'lien';
  if (hasDeed && !hasLien) return 'deed';
  return 'check';
}

/** Short tax sale-type label for the value cell (null/both/unclear → ''). */
export function taxLabel(systemType: string | null): string {
  switch (classifyTax(systemType)) {
    case 'lien':
      return 'Tax lien';
    case 'deed':
      return 'Tax deed';
    default:
      return '';
  }
}

/**
 * Render a nullable detail field. Only `null` triggers the fallback — a real
 * value like the string "None" (an affirmative "no post-sale redemption")
 * renders verbatim.
 */
export function fieldOrCheck(value: string | null): string {
  return value == null ? CHECK_SHORT : value;
}
