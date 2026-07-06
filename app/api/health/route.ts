import { NextResponse } from 'next/server';
import type { ApiResponse } from '@/types/api';
import { APP_CONFIG } from '@/constants/app';

/**
 * GET /api/health
 * Health check endpoint for monitoring.
 */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json<ApiResponse<{ version: string; name: string }>>(
    {
      success: true,
      data: {
        name: APP_CONFIG.NAME,
        version: APP_CONFIG.VERSION,
      },
      message: 'Workshop Pro API is running',
    },
    { status: 200 }
  );
}
