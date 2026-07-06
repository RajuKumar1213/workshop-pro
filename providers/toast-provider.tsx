'use client';

import { Toaster } from 'sonner';

/**
 * Sonner toast provider with consistent styling.
 */
export function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      richColors
      closeButton
      toastOptions={{
        duration: 4000,
        classNames: {
          toast: 'font-sans',
        },
      }}
    />
  );
}
