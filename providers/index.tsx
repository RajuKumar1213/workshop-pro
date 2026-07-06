'use client';

import type { ReactNode } from 'react';
import { ThemeProvider } from './theme-provider';
import { QueryProvider } from './query-provider';
import { AuthProvider } from './auth-provider';
import { ToastProvider } from './toast-provider';
import { ModalProvider } from './modal-provider';

/**
 * Root providers barrel — wraps the entire application tree.
 * Order matters:
 * 1. ThemeProvider (no dependencies)
 * 2. QueryProvider (no dependencies)
 * 3. AuthProvider (uses query client)
 * 4. ModalProvider (may use auth)
 * 5. ToastProvider (global, no dependencies)
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <AuthProvider>
          <ModalProvider>
            {children}
            <ToastProvider />
          </ModalProvider>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
