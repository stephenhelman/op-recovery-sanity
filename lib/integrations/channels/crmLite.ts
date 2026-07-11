import { LeadPayload, ChannelConfig, ChannelResult } from './types';

/**
 * CRM Lite delivery channel — the connection point for the separate CRM Lite
 * track (MongoDB + lead dashboard). Selecting "CRM Lite" in the Contact Form's
 * "Send Lead To" is safe today: it logs and no-ops until that track lands, so
 * no lead is silently reported as stored when it isn't.
 *
 * TODO(crm-lite): persist the lead to the CRM store once CRM Lite is built.
 */
export async function pushToCrmLite(
  _payload: LeadPayload,
  _cfg: ChannelConfig
): Promise<ChannelResult> {
  console.info('[lead] crm-lite selected — CRM Lite not yet wired; lead not persisted to CRM.');
  return { channel: 'crm-lite', ok: true, id: 'pending' };
}
