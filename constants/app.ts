export const APP_CONFIG = {
  NAME: 'Workshop Pro',
  TAGLINE: 'Iron & Aluminium Fabrication Management',
  VERSION: '1.0.0',
  CURRENCY: {
    CODE: 'INR',
    SYMBOL: '₹',
    LOCALE: 'en-IN',
  },
  TIMEZONE: 'Asia/Kolkata',
  DATE_FORMAT: 'dd MMM yyyy',
  DATETIME_FORMAT: 'dd MMM yyyy, hh:mm a',
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  },
  TOAST: {
    DURATION: 4000,
  },
} as const;
