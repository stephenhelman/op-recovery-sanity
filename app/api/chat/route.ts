import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { buildSystemPrompt } from '@/lib/chat/prompt';

export const runtime = 'nodejs';

// Sonnet by default (server-side key only); overridable via env (e.g. Haiku).
const MODEL = process.env.CHAT_MODEL || 'claude-sonnet-4-6';
const MAX_HISTORY = 24; // turns
const MAX_MSG_LEN = 2000; // chars per message
const FALLBACK = 'Sorry — I’m having trouble responding right now. A specialist would be glad to help; please reach out using the options below.';

type InMsg = { role?: string; text?: string };

// Per-IP rate limit: bounds call VOLUME so a scripted caller can't run up the
// Anthropic bill (the per-call token caps below bound per-call COST — separate
// protection). Lazily + defensively constructed so missing/blank Upstash env
// throws here (caught at the call site) and fails OPEN instead of crashing the
// route at import time. Prefix namespaces NorthStar's counters on the shared DB.
let ratelimit: Ratelimit | null = null;
let limiterInitFailed = false;
function getRatelimit(): Ratelimit | null {
  if (ratelimit || limiterInitFailed) return ratelimit;
  try {
    // Guard env presence explicitly: Redis.fromEnv() only warns (doesn't throw)
    // on missing vars, so without this it would build a broken client that
    // throws on every .limit() call. Failing init once here is cleaner.
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      throw new Error('UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN not set');
    }
    ratelimit = new Ratelimit({
      redis: Redis.fromEnv(), // reads UPSTASH_REDIS_REST_URL / _TOKEN
      limiter: Ratelimit.slidingWindow(15, '60 s'), // generous for a human, tight for a script
      prefix: 'northstar_chat',
      analytics: true,
    });
  } catch (err) {
    limiterInitFailed = true;
    console.error('[chat] rate limiter init failed — failing open', err);
  }
  return ratelimit;
}

function getClientIp(req: NextRequest): string {
  const xff = req.headers.get('x-forwarded-for');
  return xff?.split(',')[0]?.trim() || 'anonymous';
}

export async function POST(req: NextRequest) {
  // Rate limit FIRST — fail OPEN so a Redis hiccup (or missing env) never breaks
  // the live bot. The Anthropic workspace spend cap is the real backstop if bypassed.
  try {
    const limiter = getRatelimit();
    if (limiter) {
      const { success } = await limiter.limit(getClientIp(req));
      if (!success) {
        return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
      }
    }
  } catch (err) {
    console.error('[chat] rate limiter unavailable — failing open', err);
    // continue; do not block the user on limiter infrastructure failure
  }

  // 2. Parse the request body (pre-stream → JSON error, never a half-open stream).
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  // 3. Key check (pre-stream → JSON 500).
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    // Key missing/misconfigured — surfaces as the UI's graceful fallback + CTA.
    return NextResponse.json({ error: FALLBACK }, { status: 500 });
  }

  const { messages, knowledge, brandName, captureEmail, ctaPhone, ctaFormHref } = (body ?? {}) as {
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

  // 4. All pre-stream checks passed — open the streamed model response. Errors
  //    raised here (before the Response is returned) still surface as JSON.
  try {
    const client = new Anthropic({ apiKey });
    const anthropicStream = client.messages.stream({
      model: MODEL,
      max_tokens: 512,
      system,
      messages: mapped,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const event of anthropicStream) {
            if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
        } catch (err) {
          // Upstream error AFTER the stream opened — end cleanly. The client
          // treats a short/empty stream as a soft failure (friendly fallback).
          console.error('[chat] stream error after open:', err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
      },
    });
  } catch (err) {
    // Pre-stream setup error — degrade to the friendly fallback (502 JSON).
    const detail = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: FALLBACK, detail }, { status: 502 });
  }
}
