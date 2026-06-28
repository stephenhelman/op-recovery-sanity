import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { buildSystemPrompt } from '@/lib/chat/prompt';

export const runtime = 'nodejs';

// Haiku by default (server-side key only); overridable via env.
const MODEL = process.env.CHAT_MODEL || 'claude-haiku-4-5-20251001';
const MAX_HISTORY = 24; // turns
const MAX_MSG_LEN = 2000; // chars per message
const FALLBACK = 'Sorry — I’m having trouble responding right now. A specialist would be glad to help; please reach out using the options below.';

type InMsg = { role?: string; text?: string };

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    // Key missing/misconfigured — surfaces as the UI's graceful fallback + CTA.
    return NextResponse.json({ error: FALLBACK }, { status: 500 });
  }

  try {
    const body = await req.json();
    const {
      messages,
      knowledge,
      brandName,
      captureEmail,
      ctaPhone,
      ctaFormHref,
    } = body as {
      messages?: InMsg[];
      knowledge?: string;
      brandName?: string;
      captureEmail?: boolean;
      ctaPhone?: string;
      ctaFormHref?: string;
    };

    // Normalize → Anthropic message shape, cap length and history.
    const mapped = (messages ?? [])
      .filter((m) => m && typeof m.text === 'string' && (m.role === 'user' || m.role === 'bot'))
      .map((m) => ({
        role: (m.role === 'bot' ? 'assistant' : 'user') as 'assistant' | 'user',
        content: (m.text as string).slice(0, MAX_MSG_LEN),
      }))
      .slice(-MAX_HISTORY);

    // The API requires the first message to be from the user.
    while (mapped.length && mapped[0].role === 'assistant') mapped.shift();

    if (!mapped.length || mapped[mapped.length - 1].role !== 'user') {
      return NextResponse.json({ error: 'No user message to respond to.' }, { status: 400 });
    }

    const system = buildSystemPrompt({
      brandName: brandName || 'our team',
      knowledge,
      captureEmail: captureEmail ?? true,
      ctaPhone,
      ctaFormHref,
    });

    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 512,
      system,
      messages: mapped,
    });

    const reply = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('')
      .trim();

    return NextResponse.json({ reply: reply || FALLBACK });
  } catch (err) {
    // Upstream/model error — degrade to the friendly fallback (502).
    const detail = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: FALLBACK, detail }, { status: 502 });
  }
}
