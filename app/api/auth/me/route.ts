import { type NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import type { ApiResponse } from '@/types/api';
import type { AuthUser } from '@/types/auth';

const AUTH_API_URL = process.env.AUTH_API_URL;

/**
 * BFF Proxy: GET /api/auth/me
 *
 * Returns the current authenticated user by forwarding the request
 * to the authorization-service /api/v1/auth/me endpoint.
 */
export async function GET(_request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: 'Not authenticated' } },
        { status: 401 }
      );
    }

    // Forward to auth service to get full user profile
    const authResponse = await fetch(`${AUTH_API_URL}/api/v1/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.sessionId}`,
      },
      // Disable caching — always fetch fresh user data
      cache: 'no-store',
    });

    if (!authResponse.ok) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: 'Failed to fetch user' } },
        { status: authResponse.status }
      );
    }

    const authData = await authResponse.json() as {
      success: boolean;
      data?: { user: AuthUser };
    };

    // Merge session roles/permissions with auth user data
    const user: AuthUser = {
      userId: session.userId,
      sessionId: session.sessionId,
      email: session.email,
      roles: session.roles,
      permissions: session.permissions,
      ...(authData.data?.user ?? {}),
    };

    return NextResponse.json<ApiResponse<AuthUser>>(
      { success: true, data: user },
      { status: 200 }
    );
  } catch (error) {
    console.error('[BFF] /me error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
