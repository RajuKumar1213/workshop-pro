import { useState, useCallback } from 'react';

export interface CanvasObject {
  id: string;
  type: string; // 'rect', 'circle', 'text'
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
}

export function useCanvasState(initialObjects: CanvasObject[] = []) {
  const [objects, setObjects] = useState<CanvasObject[]>(initialObjects);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const addObject = useCallback((obj: CanvasObject) => {
    setObjects((prev) => [...prev, obj]);
    setSelectedId(obj.id);
  }, []);

  const updateObject = useCallback((id: string, newAttrs: Partial<CanvasObject>) => {
    setObjects((prev) =>
      prev.map((obj) => (obj.id === id ? { ...obj, ...newAttrs } : obj))
    );
  }, []);

  const deleteObject = useCallback((id: string) => {
    setObjects((prev) => prev.filter((obj) => obj.id !== id));
    if (selectedId === id) setSelectedId(null);
  }, [selectedId]);

  return {
    objects,
    selectedId,
    setSelectedId,
    addObject,
    updateObject,
    deleteObject,
  };
}
