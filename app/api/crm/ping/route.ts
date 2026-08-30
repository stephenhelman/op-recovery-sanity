import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/requireAuth';

/**
 * Test route proving the `requireAuth` guard works end to end. Not part of
 * the dashboard (Sprint 5) — exists only to exercise the guard in isolation.
 */
export async function GET() {
  const session = await requireAuth();
  if (!session) return NextResponse.json({ ok: false, error: 'unauthenticated' }, { status: 401 });
  return NextResponse.json({ ok: true, email: session.user?.email });
}
