import type { ApiError } from '@/types/api';

/**
 * Extracts a human-readable error message from any thrown value.
 * Works with: ApiError, Error, Axios errors, plain strings.
 */
export function parseError(error: unknown): string {
  if (typeof error === 'string') return error;

  if (isAxiosError(error)) {
    const data = error.response?.data as { error?: ApiError; message?: string } | undefined;
    return data?.error?.message ?? data?.message ?? 'Network error. Please try again.';
  }

  if (error instanceof Error) return error.message;

  return 'An unexpected error occurred.';
}

/**
 * Extracts field-level validation errors from an API response.
 * Returns a map of { fieldName: errorMessage }.
 */
export function parseFieldErrors(error: unknown): Record<string, string> {
  if (isAxiosError(error)) {
    const data = error.response?.data as { error?: ApiError } | undefined;
    const details = data?.error?.details;
    if (details) {
      return Object.fromEntries(
        Object.entries(details).map(([field, messages]) => [field, messages[0] ?? 'Invalid value'])
      );
    }
  }
  return {};
}

/**
 * Type guard for Axios-like errors.
 */
function isAxiosError(error: unknown): error is {
  response?: { data?: unknown; status?: number };
  message: string;
} {
  return typeof error === 'object' && error !== null && 'response' in error;
}
