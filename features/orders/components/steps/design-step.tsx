'use client';

import { useState, useEffect } from 'react';
import { Settings2, Ruler } from 'lucide-react';
import { AnnotationEditor } from '@/features/editor/components/AnnotationEditor';

interface DesignStepProps {
  onNext: (data: any) => void;
  onBack: () => void;
  defaultData?: any;
  productData?: any;
}

const UNITS = ['inch', 'cm', 'mm', 'foot', 'meter'];

export function DesignStep({ onNext, onBack, defaultData, productData }: DesignStepProps) {
  const category = productData?.category || 'Custom Item';
  const [unit, setUnit] = useState(defaultData?.unit || 'inch');
  const [width, setWidth] = useState<number | string>(defaultData?.width ?? 0);
  const [height, setHeight] = useState<number | string>(defaultData?.height ?? 0);
  const [material, setMaterial] = useState(defaultData?.material || 'Mild Steel');
  const [materialsList, setMaterialsList] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/masters/materials')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMaterialsList(data.data);
          if (!defaultData?.material && data.data.length > 0) {
            setMaterial(data.data[0].name);
          }
        }
      })
      .catch(console.error);
  }, [defaultData?.material]);
  
  const [holfass, setHolfass] = useState<{
    side: 'none' | 'left' | 'right' | 'both';
    left: { top: number | ''; middle: number | ''; bottom: number | '' };
    right: { top: number | ''; middle: number | ''; bottom: number | '' };
  }>(defaultData?.holfass || {
    side: 'none',
    left: { top: '', middle: '', bottom: '' },
    right: { top: '', middle: '', bottom: '' }
  });

  const handleProceed = () => {
    // In later steps, we will extract the drawing data from the AnnotationEditor
    // For now, we proceed with the dimensions
    onNext({ design: { width, height, unit, material, templateId: category, holfass } });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Canvas & Dimensions</h2>
          <p className="text-muted-foreground text-sm mt-1">Configure measurements and specifications for this item.</p>
        </div>
        <span className="bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm border border-primary/20">
          {category}
        </span>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-2">
        {/* Canvas Area (New Annotation Editor) */}
        <div className="lg:col-span-2 relative h-[600px]">
          <AnnotationEditor imageUrl={productData?.imageUrl} canvasWidth={Number(width) || 0} canvasHeight={Number(height) || 0} unit={unit} holfass={holfass} />
        </div>

        {/* Controls */}
        <div className="space-y-6">
          <div className="bg-card p-6 rounded-2xl border shadow-sm space-y-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold flex items-center text-lg"><Settings2 className="w-5 h-5 mr-2 text-primary" /> Dimensions</h3>
              
              {/* Unit Selector */}
              <div className="flex items-center gap-2">
                <Ruler className="w-4 h-4 text-muted-foreground" />
                <select 
                  className="bg-muted text-xs font-semibold px-2 py-1.5 rounded-md outline-none focus:ring-2 focus:ring-primary/50 border"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                >
                  {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">
                  Width <span className="text-gray-700 normal-case font-medium">({unit})</span>
                </label>
                <input type="number" min="0" className="w-full p-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" value={width} onFocus={(e) => e.target.select()} onChange={(e) => setWidth(e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))} />
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">
                  Height <span className="text-gray-700 normal-case font-medium">({unit})</span>
                </label>
                <input type="number" min="0" className="w-full p-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" value={height} onFocus={(e) => e.target.select()} onChange={(e) => setHeight(e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))} />
              </div>
            </div>
          </div>

          {/* Holfass Specs */}
          <div className="bg-card p-6 rounded-2xl border shadow-sm space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Holfass Specs</h3>
            <div>
              <label className="text-sm font-medium mb-2 block">Location</label>
              <div className="flex flex-wrap gap-4">
                {['none', 'left', 'right', 'both'].map((s) => (
                  <label key={s} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="holfass" value={s} checked={holfass.side === s} onChange={(e) => setHolfass({ ...holfass, side: e.target.value as any })} className="accent-primary" />
                    <span className="text-sm capitalize">{s}</span>
                  </label>
                ))}
              </div>
            </div>

            {(holfass.side === 'left' || holfass.side === 'both') && (
              <div className="pt-2 border-t">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">Left Side</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <span className="text-xs text-muted-foreground mb-1 block">Top</span>
                    <input type="number" min="0" className="w-full p-2 text-sm border rounded focus:ring-2 focus:ring-primary focus:border-primary outline-none" value={holfass.left.top} onChange={(e) => setHolfass({ ...holfass, left: { ...holfass.left, top: e.target.value === '' ? '' : Math.max(0, Number(e.target.value)) } })} />
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground mb-1 block">Middle</span>
                    <input type="number" min="0" className="w-full p-2 text-sm border rounded focus:ring-2 focus:ring-primary focus:border-primary outline-none" value={holfass.left.middle} onChange={(e) => setHolfass({ ...holfass, left: { ...holfass.left, middle: e.target.value === '' ? '' : Math.max(0, Number(e.target.value)) } })} />
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground mb-1 block">Bottom</span>
                    <input type="number" min="0" className="w-full p-2 text-sm border rounded focus:ring-2 focus:ring-primary focus:border-primary outline-none" value={holfass.left.bottom} onChange={(e) => setHolfass({ ...holfass, left: { ...holfass.left, bottom: e.target.value === '' ? '' : Math.max(0, Number(e.target.value)) } })} />
                  </div>
                </div>
              </div>
            )}

            {(holfass.side === 'right' || holfass.side === 'both') && (
              <div className="pt-2 border-t">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">Right Side</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <span className="text-xs text-muted-foreground mb-1 block">Top</span>
                    <input type="number" min="0" className="w-full p-2 text-sm border rounded focus:ring-2 focus:ring-primary focus:border-primary outline-none" value={holfass.right.top} onChange={(e) => setHolfass({ ...holfass, right: { ...holfass.right, top: e.target.value === '' ? '' : Math.max(0, Number(e.target.value)) } })} />
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground mb-1 block">Middle</span>
                    <input type="number" min="0" className="w-full p-2 text-sm border rounded focus:ring-2 focus:ring-primary focus:border-primary outline-none" value={holfass.right.middle} onChange={(e) => setHolfass({ ...holfass, right: { ...holfass.right, middle: e.target.value === '' ? '' : Math.max(0, Number(e.target.value)) } })} />
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground mb-1 block">Bottom</span>
                    <input type="number" min="0" className="w-full p-2 text-sm border rounded focus:ring-2 focus:ring-primary focus:border-primary outline-none" value={holfass.right.bottom} onChange={(e) => setHolfass({ ...holfass, right: { ...holfass.right, bottom: e.target.value === '' ? '' : Math.max(0, Number(e.target.value)) } })} />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-card p-6 rounded-2xl border shadow-sm space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Material Specs</h3>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Primary Material</label>
              <select className="w-full p-2.5 border rounded-lg bg-background text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all shadow-sm" value={material} onChange={(e)=>setMaterial(e.target.value)}>
                {materialsList.length === 0 ? (
                  <option value="Mild Steel">Mild Steel</option>
                ) : (
                  materialsList.map(m => (
                    <option key={m.id} value={m.name}>{m.name}</option>
                  ))
                )}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6 mt-4">
        <button type="button" onClick={onBack} className="px-8 py-2.5 border-2 rounded-xl hover:bg-muted font-semibold transition-all">Back</button>
        <button type="button" onClick={handleProceed} className="bg-primary text-primary-foreground px-8 py-2.5 rounded-xl font-semibold hover:bg-primary/90 hover:-translate-y-0.5 transition-all shadow-lg hover:shadow-xl">Save Dimensions & Next</button>
      </div>
    </div>
  );
}
