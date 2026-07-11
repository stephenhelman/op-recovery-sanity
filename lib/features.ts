import { SiteFeatures } from '@/types/content';

export type FeatureFlag = keyof SiteFeatures;

/**
 * Single source of truth for reading a feature flag off siteConfig.
 * Flags are opt-in — anything unset reads as `false`.
 *
 * NOTE (Phase 0 only): this helper merely *reads* the flag object created in
 * the Sanity schema. No feature behavior is wired to it yet — the chatWidget
 * gating change, the state map, etc. belong to the features brief.
 */
export function isEnabled(
  features: SiteFeatures | undefined,
  flag: FeatureFlag
): boolean {
  return features?.[flag] ?? false;
}
