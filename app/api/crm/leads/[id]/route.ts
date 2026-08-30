import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { requireAuth } from '@/lib/auth/requireAuth';
import { getMongoDb } from '@/lib/mongo';
import { isLeadStatus } from '@/lib/crm/types';

/** Update status/notes in place on the flat lead doc — no new collections, no history. */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAuth();
  if (!session) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });

  const { id } = await params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'invalid lead id' }, { status: 400 });
  }

  const body = await req.json().catch(() => null);
  const update: Record<string, unknown> = {};
  if (body?.status !== undefined) {
    if (!isLeadStatus(body.status)) {
      return NextResponse.json({ error: 'invalid status' }, { status: 400 });
    }
    update.status = body.status;
  }
  if (body?.notes !== undefined) {
    if (typeof body.notes !== 'string') {
      return NextResponse.json({ error: 'notes must be a string' }, { status: 400 });
    }
    update.notes = body.notes;
  }
  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: 'nothing to update' }, { status: 400 });
  }

  try {
    const db = await getMongoDb();
    const result = await db.collection('leads').updateOne({ _id: new ObjectId(id) }, { $set: update });
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'lead not found' }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
