import { APP_CONFIG } from '@/constants/app';

/**
 * Formats a number as Indian Rupee currency.
 * Example: 150000 → "₹1,50,000.00"
 */
export function formatCurrency(
  amount: number | null | undefined,
  options?: Intl.NumberFormatOptions
): string {
  if (amount === null || amount === undefined) return '—';
  return new Intl.NumberFormat(APP_CONFIG.CURRENCY.LOCALE, {
    style: 'currency',
    currency: APP_CONFIG.CURRENCY.CODE,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  }).format(amount);
}

/**
 * Formats a number compactly. e.g. 1500000 → "₹15L"
 */
export function formatCurrencyCompact(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return '—';
  return new Intl.NumberFormat(APP_CONFIG.CURRENCY.LOCALE, {
    style: 'currency',
    currency: APP_CONFIG.CURRENCY.CODE,
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(amount);
}

/**
 * Parses a currency string back to a number.
 * Strips currency symbols and commas.
 */
export function parseCurrency(value: string): number {
  const cleaned = value.replace(/[^0-9.-]/g, '');
  return parseFloat(cleaned) || 0;
}
