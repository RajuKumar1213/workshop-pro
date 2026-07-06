import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import type { SessionPayload } from '@/types/auth';

const SESSION_COOKIE = 'ws_session';

/**
 * Reads and returns the current session payload from the httpOnly cookie.
 * Returns null if no valid session exists.
 *
 * This is a server-only module — calling from Client Components will fail at build time.
 */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE)?.value;
  if (!raw) return null;

  try {
    // Session is a base64-encoded JSON payload set by the BFF login route handler.
    // In production, this should be encrypted with SESSION_SECRET via Jose.
    const decoded = Buffer.from(raw, 'base64').toString('utf-8');
    const session = JSON.parse(decoded) as SessionPayload;

    // Check expiration
    if (session.expiresAt && Date.now() > session.expiresAt) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

/**
 * Returns the current session, or redirects to the login page.
 * Use this in Server Components that require authentication.
 *
 * @example
 * const session = await requireSession();
 * // session is guaranteed to be non-null here
 */
export async function requireSession(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    redirect(ROUTES.LOGIN);
  }
  return session;
}

/**
 * Creates the session cookie.
 * Called by the BFF login route handler after successful auth service login.
 */
export async function createSession(payload: SessionPayload): Promise<void> {
  const cookieStore = await cookies();
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64');

  const expiresAt = new Date(payload.expiresAt);

  cookieStore.set(SESSION_COOKIE, encoded, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  });
}

/**
 * Deletes the session cookie.
 * Called by the BFF logout route handler.
 */
export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export { SESSION_COOKIE };
