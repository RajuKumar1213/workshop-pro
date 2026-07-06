import { useEffect, useRef } from 'react';

export function useAutoSave(data: any, saveFunction: (data: any) => Promise<void>, delay: number = 2000) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      saveFunction(data).catch(err => console.error("Auto-save failed", err));
    }, delay);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [data, saveFunction, delay]);
}
