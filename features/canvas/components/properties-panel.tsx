'use client';

export function PropertiesPanel({ selectedObj, onUpdate }: { selectedObj: any, onUpdate: (attrs: any) => void }) {
  if (!selectedObj) {
    return (
      <div className="w-64 p-4 border-l bg-card text-muted-foreground text-sm flex items-center justify-center">
        Select an object to edit its properties.
      </div>
    );
  }

  return (
    <div className="w-64 p-4 border-l bg-card space-y-4">
      <h3 className="font-semibold border-b pb-2">Properties</h3>
      
      <div className="space-y-2">
        <label className="text-xs font-medium">Width (mm)</label>
        <input 
          type="number" 
          value={selectedObj.width} 
          onChange={(e) => onUpdate({ width: Number(e.target.value) })}
          className="w-full p-1 border rounded text-sm"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium">Height (mm)</label>
        <input 
          type="number" 
          value={selectedObj.height} 
          onChange={(e) => onUpdate({ height: Number(e.target.value) })}
          className="w-full p-1 border rounded text-sm"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium">Color</label>
        <input 
          type="color" 
          value={selectedObj.fill} 
          onChange={(e) => onUpdate({ fill: e.target.value })}
          className="w-full h-8 p-0 border rounded"
        />
      </div>
    </div>
  );
}
