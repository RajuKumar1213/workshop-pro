import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Get the secret from environment variables
const secretStr = process.env.SESSION_SECRET;
const secret = secretStr ? new TextEncoder().encode(secretStr) : undefined;

export async function middleware(request: NextRequest) {
  // If the secret is missing, log an error and block the request safely
  if (!secret) {
    console.error("SESSION_SECRET is not defined in environment variables");
    return NextResponse.json({ error: 'Internal Server Error: Missing Secret' }, { status: 500 });
  }

  // 1. Extract the token from the cookie
  // Make sure 'accessToken' matches the actual cookie name set by your auth service
  const token = request.cookies.get('accessToken')?.value;

  // 2. If there's no token, block the request
  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized: No token provided' },
      { status: 401 }
    );
  }

  try {
    // 3. Verify the JWT signature
    const { payload } = await jwtVerify(token, secret);
    
    // 4. (Optional) Pass the user ID to your API routes via a custom header
    const requestHeaders = new Headers(request.headers);
    if (payload.sub) {
      requestHeaders.set('x-user-id', payload.sub);
    }

    // 5. Token is verified! Allow the request to continue.
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    // The signature was wrong, or the token expired
    return NextResponse.json(
      { error: 'Unauthorized: Invalid or expired token' },
      { status: 401 }
    );
  }
}

// 6. Define WHICH routes this middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths starting with /api/ EXCEPT for /api/auth
     * Adjust this if you have other public API routes.
     * Front-end page routes (like /login) are not matched.
     */
    '/api/((?!auth).*)',
  ],
};
