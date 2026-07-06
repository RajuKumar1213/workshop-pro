'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
  type ComponentType,
} from 'react';

interface ModalEntry {
  id: string;
  component: ComponentType<{ onClose: () => void }>;
  props?: Record<string, unknown>;
}

interface ModalContextValue {
  openModal: (
    id: string,
    component: ComponentType<{ onClose: () => void }>,
    props?: Record<string, unknown>
  ) => void;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

/**
 * Global modal registry.
 * Allows any component to open a modal from anywhere in the tree.
 *
 * Usage:
 *   const { openModal } = useModal();
 *   openModal('confirm-delete', DeleteConfirmDialog, { itemId: '123' });
 */
export function ModalProvider({ children }: { children: ReactNode }) {
  const [modals, setModals] = useState<ModalEntry[]>([]);

  const openModal = useCallback(
    (
      id: string,
      component: ComponentType<{ onClose: () => void }>,
      props?: Record<string, unknown>
    ) => {
      setModals((prev) => {
        const exists = prev.find((m) => m.id === id);
        if (exists) return prev; // Don't duplicate
        return [...prev, { id, component, props }];
      });
    },
    []
  );

  const closeModal = useCallback((id: string) => {
    setModals((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const closeAllModals = useCallback(() => setModals([]), []);

  return (
    <ModalContext.Provider value={{ openModal, closeModal, closeAllModals }}>
      {children}
      {modals.map(({ id, component: ModalComponent, props }) => (
        <ModalComponent key={id} onClose={() => closeModal(id)} {...props} />
      ))}
    </ModalContext.Provider>
  );
}

export function useModal(): ModalContextValue {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}
