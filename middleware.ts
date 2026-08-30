import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { crmLiteEnabled } from '@/lib/crmLiteFlag';

// Host-gated: the CRM lives at real paths under (crm) — /dashboard, /sign-in —
// and this middleware decides, per request host, whether those paths (and only
// those) are reachable. No host->path rewrite; app.{domain} and the apex serve
// the same route tree, gated here.
//
// Local dev has no subdomain, so `app.{domain}` won't resolve. Add
// `127.0.0.1 app.localhost` to /etc/hosts and hit http://app.localhost:3000 —
// the host check below also matches `app.localhost` as the CRM host.
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

const SIGN_IN_PATH = '/sign-in';

function isAppHost(host: string | null): boolean {
  if (!host) return false;
  const hostname = host.split(':')[0];
  return hostname.startsWith('app.');
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const host = req.headers.get('host');

  if (!isAppHost(host)) {
    // Marketing (apex) host: serve normally. A stray hit on CRM paths here
    // just 404s naturally — the CRM is app.-host only.
    return NextResponse.next();
  }

  // Master gate (locked decision #2): off tier => no dashboard routing at all.
  if (!(await crmLiteEnabled())) {
    return new NextResponse('Not Found', { status: 404 });
  }

  if (pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  if (pathname === SIGN_IN_PATH) return NextResponse.next();

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.redirect(new URL(SIGN_IN_PATH, req.url));
  }

  return NextResponse.next();
}
