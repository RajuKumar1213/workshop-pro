'use client';

import { useCallback, useState } from 'react';
import { APP_CONFIG } from '@/constants/app';

interface PaginationState {
  page: number;
  pageSize: number;
}

interface PaginationActions {
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  reset: () => void;
}

type UsePaginationReturn = PaginationState & PaginationActions;

/**
 * Reusable pagination state hook.
 * Use with DataTable and list components.
 */
export function usePagination(
  initialPage = 1,
  initialPageSize = APP_CONFIG.PAGINATION.DEFAULT_PAGE_SIZE
): UsePaginationReturn {
  const [page, setPageState] = useState<number>(initialPage);
  const [pageSize, setPageSizeState] = useState<number>(initialPageSize);

  const setPage = useCallback((p: number) => {
    setPageState(Math.max(1, p));
  }, []);

  const setPageSize = useCallback((size: number) => {
    setPageSizeState(size);
    setPageState(1); // Reset to first page when page size changes
  }, []);

  const nextPage = useCallback(() => setPageState((p) => p + 1), []);
  const prevPage = useCallback(() => setPageState((p) => Math.max(1, p - 1)), []);
  const reset = useCallback(() => {
    setPageState(initialPage);
    setPageSizeState(initialPageSize);
  }, [initialPage, initialPageSize]);

  return { page, pageSize, setPage, setPageSize, nextPage, prevPage, reset };
}
