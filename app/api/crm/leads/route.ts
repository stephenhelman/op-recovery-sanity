import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/requireAuth';
import { getMongoDb } from '@/lib/mongo';
import { isLeadStatus, type CrmLead } from '@/lib/crm/types';

export async function GET(req: NextRequest) {
  const session = await requireAuth();
  if (!session) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });

  const statusParam = req.nextUrl.searchParams.get('status');
  const filter = statusParam && isLeadStatus(statusParam) ? { status: statusParam } : {};

  try {
    const db = await getMongoDb();
    const docs = await db.collection('leads').find(filter).sort({ _id: -1 }).toArray();
    const leads: CrmLead[] = docs.map((doc) => ({
      id: doc._id.toString(),
      fields: doc.fields ?? [],
      companyName: doc.companyName ?? '',
      submittedAt: doc.submittedAt ?? '',
      status: isLeadStatus(doc.status) ? doc.status : 'new',
      notes: typeof doc.notes === 'string' ? doc.notes : '',
    }));
    return NextResponse.json({ leads });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
