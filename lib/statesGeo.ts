import { ALL_STATES } from './statesData';

/**
 * State geography for the interactive map.
 *
 * NOTE ON FORM: this is a **tile-grid** map (each state a labeled square in an
 * approximate geographic layout), not a pixel-accurate geographic outline.
 * Accurate 50-state SVG paths can't be sourced in this environment, and a
 * tile-grid is honest, fully brand-token styled, and reliably renders. The
 * StateMap component and the data/modal wiring are shape-agnostic — a real
 * geographic SVG can swap in later without touching the API or the modal.
 */

export type USState = {
  abbr: string;
  name: string;
  slug: string;
  served: boolean;
};

// Continental US only — Alaska and Hawaii are intentionally excluded.
const ABBR_TO_NAME: Record<string, string> = {
  AL: 'Alabama', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', FL: 'Florida', GA: 'Georgia',
  ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa',
  KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland',
  MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi', MO: 'Missouri',
  MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey',
  NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio',
  OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina',
  SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont',
  VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
};

/** Approximate geographic tile layout (row-major; '' = empty cell). */
export const STATE_GRID: string[][] = [
  ['',   '',   '',   '',   '',   '',   '',   '',   '',   '',   '',   'ME'],
  ['WA', '',   'MT', 'ND', 'MN', '',   'WI', '',   'MI', '',   'NH', 'VT'],
  ['OR', 'ID', 'WY', 'SD', 'IA', 'IL', 'IN', 'OH', 'PA', 'NY', 'MA', 'RI'],
  ['CA', 'NV', 'UT', 'CO', 'NE', 'MO', 'KY', 'WV', 'VA', 'NJ', 'CT', ''],
  ['',   'AZ', 'NM', 'KS', 'AR', 'TN', 'NC', 'SC', 'MD', 'DE', '',   ''],
  ['',   '',   '',   'OK', 'LA', 'MS', 'AL', 'GA', '',   '',   '',   ''],
  ['',   '',   '',   'TX', '',   '',   '',   '',   'FL', '',   '',   ''],
];

export function slugify(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-');
}

const SERVED = new Set(ALL_STATES);

/** Continental US states (48) with served flag + slug, keyed by abbreviation. */
export const US_STATES: Record<string, USState> = Object.fromEntries(
  Object.entries(ABBR_TO_NAME).map(([abbr, name]) => [
    abbr,
    { abbr, name, slug: slugify(name), served: SERVED.has(name) },
  ])
);

export const US_STATES_LIST: USState[] = Object.values(US_STATES);

export function findStateBySlug(slug: string): USState | undefined {
  return US_STATES_LIST.find((s) => s.slug === slug);
}
