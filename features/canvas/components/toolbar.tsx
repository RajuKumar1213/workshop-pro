'use client';

export function Toolbar({ onAddRect, onAddText }: { onAddRect: () => void; onAddText: () => void }) {
  return (
    <div className="flex gap-2 p-2 bg-muted rounded-t-lg border-b">
      <button 
        onClick={onAddRect}
        className="px-3 py-1 bg-card text-card-foreground border rounded shadow-sm hover:bg-accent"
      >
        Add Frame (Rect)
      </button>
      <button 
        onClick={onAddText}
        className="px-3 py-1 bg-card text-card-foreground border rounded shadow-sm hover:bg-accent"
      >
        Add Label (Text)
      </button>
    </div>
  );
}
