import { type NextRequest, NextResponse } from 'next/server';
import { ROUTES } from '@/constants/routes';

/**
 * Next.js 16 Proxy (formerly `middleware`).
 *
 * Runs on every matching request BEFORE rendering.
 * Performs OPTIMISTIC auth checks using the session cookie only (no DB calls).
 *
 * ⚠️  Proxy runtime is Node.js in Next.js 16 — edge runtime is not supported.
 */

const SESSION_COOKIE = 'ws_session';

/** Routes that do NOT require authentication */
const PUBLIC_ROUTES = new Set<string>([ROUTES.LOGIN]);

/** Routes that should redirect authenticated users away (login page) */
const AUTH_ROUTES = new Set<string>([ROUTES.LOGIN]);

/** Paths that proxy should never touch */
const SKIP_PATTERNS = [
  /^\/_next\/static/,
  /^\/_next\/image/,
  /^\/api\//,
  /^\/public\//,
  /\.(ico|png|jpg|jpeg|svg|webp|gif|woff|woff2|ttf|otf|css|js|map)$/,
];

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // Skip static assets and API routes
  if (SKIP_PATTERNS.some((pattern) => pattern.test(pathname))) {
    return NextResponse.next();
  }

  // Optimistic check — read cookie without decoding (fast path)
  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE)?.value);

  const isPublicRoute = PUBLIC_ROUTES.has(pathname);
  const isAuthRoute = AUTH_ROUTES.has(pathname);

  // Unauthenticated user trying to access protected route → redirect to login
  if (!hasSession && !isPublicRoute) {
    const loginUrl = new URL(ROUTES.LOGIN, request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated user trying to access login → redirect to dashboard
  if (hasSession && isAuthRoute) {
    return NextResponse.redirect(new URL(ROUTES.DASHBOARD, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - api routes (handled by their own route handlers)
     */
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
};
