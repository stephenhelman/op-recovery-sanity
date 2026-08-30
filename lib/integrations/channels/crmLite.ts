import { getMongoDb } from '@/lib/mongo';
import { LeadPayload, ChannelConfig, ChannelResult } from './types';

/**
 * CRM Lite delivery channel — writes a flat, self-contained lead document to
 * the `leads` collection. No relations, no pipeline/stages (see locked
 * decision #1) — just the captured fields + status/notes for a future inbox
 * view to read and update in place.
 */
export async function pushToCrmLite(
  payload: LeadPayload,
  _cfg: ChannelConfig
): Promise<ChannelResult> {
  const channel = 'crm-lite';
  try {
    const db = await getMongoDb();
    const result = await db.collection('leads').insertOne({
      fields: payload.fields,
      companyName: payload.companyName,
      submittedAt: payload.submittedAt,
      status: 'new',
      notes: '',
    });
    return { channel, ok: true, id: result.insertedId.toString() };
  } catch (err) {
    return { channel, ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
