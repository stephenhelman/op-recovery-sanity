import { Channel, ChannelConfig } from './types';
import { sendEmail } from './email';
import { appendToSheet } from './sheets';
import { pushToGHL } from './ghl';
import { pushToCrmLite } from './crmLite';

/**
 * Normalize the "Send Lead To" multi-select to a channel-key array.
 * Accepts the new array form (['email','sheets']) and legacy '+'-joined
 * strings ('email+sheets+ghl'). Defaults to ['email'].
 */
function selected(cfg: ChannelConfig): string[] {
  const a = cfg.formSettings.formAction;
  if (Array.isArray(a)) return a;
  if (typeof a === 'string' && a.length > 0) return a.split('+');
  return ['email'];
}

/**
 * Store channels are mutually exclusive (locked decision #3): sheets XOR
 * crm-lite XOR ghl. If more than one is selected in `formAction`, precedence
 * picks a single winner — ghl > crm-lite > sheets (GHL is the most
 * "committed" integration a client would set up; CRM Lite is the
 * always-available Mongo fallback; sheets is the base tier). Each candidate
 * still needs its own config present to be eligible.
 */
const STORE_PRECEDENCE = ['ghl', 'crm-lite', 'sheets'] as const;

function isStoreEligible(key: string, cfg: ChannelConfig): boolean {
  const sel = selected(cfg);
  if (!sel.includes(key)) return false;
  if (key === 'sheets') return Boolean(cfg.formSettings.googleWebhookUrl);
  if (key === 'ghl') return Boolean(cfg.formSettings.ghlApiKey);
  return true; // crm-lite has no extra config requirement
}

function resolvedStore(cfg: ChannelConfig): string | null {
  return STORE_PRECEDENCE.find((key) => isStoreEligible(key, cfg)) ?? null;
}

/**
 * Channel registry — plug-and-play. Add a new outbound channel by dropping a
 * `channels/<name>.ts` module and a single line here. Store channels are
 * gated through `resolvedStore` so exactly one runs (locked decision #3);
 * email is unconditional (locked decision #3 — fires regardless of tier).
 */
export const channels: Channel[] = [
  {
    key: 'email',
    enabled: () => true,
    run: sendEmail,
  },
  {
    key: 'sheets',
    enabled: (cfg) => resolvedStore(cfg) === 'sheets',
    run: appendToSheet,
  },
  {
    key: 'crm-lite',
    enabled: (cfg) => resolvedStore(cfg) === 'crm-lite',
    run: pushToCrmLite,
  },
  {
    key: 'ghl',
    enabled: (cfg) => resolvedStore(cfg) === 'ghl',
    run: pushToGHL,
  },
];

export * from './types';
