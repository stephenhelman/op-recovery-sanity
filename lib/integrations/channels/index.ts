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
 * Channel registry — plug-and-play. Add a new outbound channel by dropping a
 * `channels/<name>.ts` module and a single line here. Enable/disable is driven
 * by the Contact Form's "Send Lead To" selection (formSettings.formAction).
 */
export const channels: Channel[] = [
  {
    key: 'email',
    enabled: (cfg) => selected(cfg).includes('email'),
    run: sendEmail,
  },
  {
    key: 'sheets',
    enabled: (cfg) => selected(cfg).includes('sheets') && Boolean(cfg.formSettings.googleWebhookUrl),
    run: appendToSheet,
  },
  {
    key: 'crm-lite',
    enabled: (cfg) => selected(cfg).includes('crm-lite'),
    run: pushToCrmLite,
  },
  {
    key: 'ghl',
    enabled: (cfg) => selected(cfg).includes('ghl') && Boolean(cfg.formSettings.ghlApiKey),
    run: pushToGHL,
  },
];

export * from './types';
