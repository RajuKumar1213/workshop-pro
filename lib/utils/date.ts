import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns';
import { APP_CONFIG } from '@/constants/app';

/**
 * Formats a date string or Date object to the standard app date format.
 * Default: "06 Jul 2026"
 */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return '—';
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(d)) return '—';
  return format(d, APP_CONFIG.DATE_FORMAT);
}

/**
 * Formats a date/time string. Default: "06 Jul 2026, 09:30 AM"
 */
export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return '—';
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(d)) return '—';
  return format(d, APP_CONFIG.DATETIME_FORMAT);
}

/**
 * Returns relative time string. e.g. "2 hours ago", "3 days ago"
 */
export function formatRelativeTime(date: string | Date | null | undefined): string {
  if (!date) return '—';
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(d)) return '—';
  return formatDistanceToNow(d, { addSuffix: true });
}

/**
 * Returns ISO 8601 formatted date for API calls.
 */
export function toISODate(date: Date): string {
  return date.toISOString();
}
