import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { crmLiteEnabled } from '@/lib/crmLiteFlag';

// Scoped to the CRM Lite route namespace only — the matcher never includes
// marketing paths, so this middleware structurally cannot run on the
// marketing site's request path. In production, DNS/edge-level host routing
// (see vercel.json) maps `app.{domain}/*` onto this same `/app/*` namespace
// before the request reaches Next.js; locally there's no subdomain, so `/app`
// is hit directly (documented dev fallback).
export const config = {
  matcher: ['/app/:path*'],
};

const SIGN_IN_PATH = '/app/sign-in';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Master gate (locked decision #2): off tier => no dashboard routing at all.
  if (!(await crmLiteEnabled())) {
    return new NextResponse('Not Found', { status: 404 });
  }

  if (pathname === SIGN_IN_PATH) return NextResponse.next();

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.redirect(new URL(SIGN_IN_PATH, req.url));
  }

  return NextResponse.next();
}
