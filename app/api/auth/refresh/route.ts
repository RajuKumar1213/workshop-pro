import { type NextRequest, NextResponse } from 'next/server';
import { createSession, getSession } from '@/lib/auth/session';
import type { SessionPayload } from '@/types/auth';
import type { ApiResponse } from '@/types/api';

const AUTH_API_URL = process.env.AUTH_API_URL;

/**
 * BFF Proxy: POST /api/auth/refresh
 *
 * Calls the auth service refresh endpoint using the refreshToken cookie,
 * then updates the workshop session cookie with a fresh access token.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const refreshToken = request.cookies.get('refreshToken')?.value;
    const session = await getSession();

    if (!refreshToken || !session) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: 'No active session' } },
        { status: 401 }
      );
    }

    // Call auth service refresh endpoint
    const authResponse = await fetch(`${AUTH_API_URL}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.sessionId}`,
        Cookie: `refreshToken=${refreshToken}`,
      },
    });

    const authData = await authResponse.json() as {
      success: boolean;
      data?: { accessToken: string };
      error?: { message: string };
    };

    if (!authResponse.ok || !authData.success || !authData.data) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: 'Session refresh failed' } },
        { status: 401 }
      );
    }

    // Update session with new access token
    const updatedSession: SessionPayload = {
      ...session,
      sessionId: authData.data.accessToken,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    };
    await createSession(updatedSession);

    return NextResponse.json<ApiResponse>(
      { success: true, message: 'Session refreshed' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[BFF] Refresh error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
