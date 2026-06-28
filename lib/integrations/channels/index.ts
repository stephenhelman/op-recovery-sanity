import { Channel, ChannelConfig } from './types';
import { sendEmail } from './email';
import { appendToSheet } from './sheets';
import { pushToGHL } from './ghl';

const action = (cfg: ChannelConfig) => cfg.formSettings.formAction ?? 'email';

/**
 * Channel registry — plug-and-play. Add a new outbound channel by dropping a
 * `channels/<name>.ts` module and a single line here. Enable/disable stays
 * driven by `formSettings` (same gating as before).
 */
export const channels: Channel[] = [
  {
    key: 'email',
    enabled: (cfg) => action(cfg).includes('email'),
    run: sendEmail,
  },
  {
    key: 'sheets',
    enabled: (cfg) => action(cfg).includes('sheets') && Boolean(cfg.formSettings.googleWebhookUrl),
    run: appendToSheet,
  },
  {
    key: 'ghl',
    enabled: (cfg) => action(cfg).includes('ghl') && Boolean(cfg.formSettings.ghlApiKey),
    run: pushToGHL,
  },
];

export * from './types';
