import { getServerSession, type Session } from 'next-auth';
import { authOptions } from './config';

/**
 * Reusable guard for CRM Lite routes/pages (Sprints 4-5). Returns the session
 * when signed in as the configured owner, or `null` — callers respond
 * accordingly (401 for API routes, redirect for pages). No dashboard consumes
 * this yet; Sprint 3 only stands up the guard itself.
 */
export async function requireAuth(): Promise<Session | null> {
  const session = await getServerSession(authOptions);
  return session?.user ? session : null;
}
