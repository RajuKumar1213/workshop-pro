'use server';

import { redirect } from 'next/navigation';
import { deleteSession, createSession } from '@/lib/auth/session';
import { ROUTES } from '@/constants/routes';
import type { SessionPayload } from '@/types/auth';

const AUTH_API_URL = process.env.AUTH_API_URL;

/**
 * Server Action: Login
 * Called directly from the login form (React 19 form action pattern or manual call).
 */
export async function loginAction(formData: FormData): Promise<{
  success: false;
  error: string;
} | void> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { success: false, error: 'Email and password are required' };
  }

  try {
    const response = await fetch(`${AUTH_API_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json() as {
      success: boolean;
      data?: {
        accessToken: string;
        user: { id: string; email: string; firstName?: string; lastName?: string };
      };
      error?: { message: string };
    };

    if (!response.ok || !data.success || !data.data) {
      return { success: false, error: data.error?.message ?? 'Login failed' };
    }

    const { accessToken, user } = data.data;

    const session: SessionPayload = {
      userId: user.id,
      sessionId: accessToken,
      email: user.email,
      roles: [],
      permissions: [],
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    };

    await createSession(session);
  } catch {
    return { success: false, error: 'Network error. Please try again.' };
  }

  redirect(ROUTES.DASHBOARD);
}

/**
 * Server Action: Logout
 */
export async function logoutAction(): Promise<void> {
  await deleteSession();
  redirect(ROUTES.LOGIN);
}
