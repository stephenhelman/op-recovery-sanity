import { ChannelResult, LeadPayload, ChannelConfig } from './types';

/**
 * Google Sheets channel — POSTs to the Apps Script webhook.
 *
 * Apps Script frequently returns HTTP 200 even on failure, so we check the
 * status AND, when the script returns a parseable body, inspect it for an
 * error signal. The POST body shape is unchanged from before (by-label keys),
 * so existing sheet columns keep working.
 */
export async function appendToSheet(payload: LeadPayload, cfg: ChannelConfig): Promise<ChannelResult> {
  const channel = 'sheets';
  const url = cfg.formSettings.googleWebhookUrl;
  if (!url) return { channel, ok: false, error: 'no Google webhook URL configured' };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        submittedAt: payload.submittedAt,
        company: payload.companyName,
        ...Object.fromEntries(payload.fields.map((f) => [f.label, f.value])),
      }),
    });

    if (!res.ok) {
      return { channel, ok: false, error: `Sheets webhook returned HTTP ${res.status}` };
    }

    // Apps Script returns 200 even on failure — inspect a JSON body if present.
    const text = await res.text().catch(() => '');
    if (text) {
      try {
        const json = JSON.parse(text);
        const failed =
          json?.result === 'error' || json?.success === false || Boolean(json?.error);
        if (failed) {
          return {
            channel,
            ok: false,
            error: `Sheets reported failure: ${json.error || json.message || text.slice(0, 200)}`,
          };
        }
      } catch {
        // Non-JSON body (Apps Script often returns plain text/HTML) — 200 = success.
      }
    }

    return { channel, ok: true };
  } catch (err) {
    return { channel, ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
