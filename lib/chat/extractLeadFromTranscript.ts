import Anthropic from '@anthropic-ai/sdk';

/**
 * Post-conversation lead extraction. A cheap, NON-streamed Haiku call reads the
 * chat transcript and returns strict JSON. Decoupled from the streaming reply
 * path — this runs server-side on /api/chat/lead only when a lead is logged, so
 * it never blocks or delays the visitor's reply.
 *
 * COMPLIANCE: the extractor only summarizes what the visitor actually said. It
 * must never infer eligibility, that someone qualifies or is owed money, any
 * dollar amount, or any legal conclusion. Missing fields come back empty.
 */

export interface ExtractedLead {
  name: string;
  email: string;
  phone: string;
  /** Short, neutral, factual reason for reaching out. NOT an eligibility/amount claim. */
  situation: string;
}

// Fixed cheap model for extraction, independent of the chat reply model.
const EXTRACTION_MODEL = 'claude-haiku-4-5-20251001';

const SYSTEM = [
  'You extract lead details from a website chat transcript for a surplus- and excess-funds recovery company. You read the transcript and return only the requested fields, based strictly on what the VISITOR said (their turns are labelled "You:").',
  '',
  'Fields:',
  '- name: the visitor’s full name if they stated it, otherwise "".',
  '- email: the visitor’s email address if present, otherwise "".',
  '- phone: the visitor’s phone number if present, otherwise "".',
  '- situation: a short, neutral, factual phrase (max ~15 words) describing why they are reaching out — e.g. "heir handling a relative’s estate after a tax sale", "received a surplus-funds notice after a foreclosure". If unclear, "".',
  '',
  'Absolute rules:',
  '- Summarize ONLY. Never infer or state that anyone qualifies, is owed money, has a claim, any dollar amount, or any legal conclusion — even if the visitor asked. "situation" is context for the team, not a determination.',
  '- If a field is not present in the transcript, return it as an empty string. Never guess or fabricate.',
].join('\n');

const SCHEMA: { [key: string]: unknown } = {
  type: 'object',
  additionalProperties: false,
  properties: {
    name: { type: 'string' },
    email: { type: 'string' },
    phone: { type: 'string' },
    situation: { type: 'string' },
  },
  required: ['name', 'email', 'phone', 'situation'],
};

function asString(v: unknown): string {
  return typeof v === 'string' ? v.trim() : '';
}

/**
 * Returns the extracted lead, or `null` if the transcript is empty or the call
 * fails / returns unparseable output. Callers must treat `null` as "no
 * enrichment" and fall back to the regex-only lead — never drop the lead.
 */
export async function extractLeadFromTranscript(
  transcript: string,
  apiKey: string
): Promise<ExtractedLead | null> {
  if (!transcript || !transcript.trim()) return null;

  try {
    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model: EXTRACTION_MODEL,
      max_tokens: 300,
      system: SYSTEM,
      messages: [{ role: 'user', content: `Transcript:\n${transcript}` }],
      output_config: { format: { type: 'json_schema', schema: SCHEMA } },
    });

    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('')
      .trim();

    const parsed = JSON.parse(text) as Record<string, unknown>;
    return {
      name: asString(parsed.name),
      email: asString(parsed.email),
      phone: asString(parsed.phone),
      situation: asString(parsed.situation),
    };
  } catch (err) {
    // Any failure (network, model, unparseable JSON) → no enrichment. The lead
    // still logs via the regex-only path. Never surfaced to the visitor.
    console.error('[chat-lead] transcript extraction failed — using regex-only lead:', err);
    return null;
  }
}
