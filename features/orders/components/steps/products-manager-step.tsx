'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ProductStep } from './product-step';
import { DesignStep } from './design-step';
import { useEditorStore } from '@/features/editor/store/useEditorStore';
import { Trash2, Edit, Plus, Image as ImageIcon, ArrowRight } from 'lucide-react';
import { MobileHeader } from '@/components/layout/mobile-header';
import { Button } from '@/components/ui/button';

export function ProductsManagerStep({ onNext, onBack, defaultData = [] }: { onNext: (data: any) => void, onBack: () => void, defaultData?: any[] }) {
  const [items, setItems] = useState<any[]>(defaultData);
  const [view, setView] = useState<'list' | 'product' | 'design'>('list');
  const [editingIndex, setEditingIndex] = useState<number>(-1);
  const [draftItem, setDraftItem] = useState<any>(null);

  // Auto-redirect to add product if list is empty
  useEffect(() => {
    if (items.length === 0 && view === 'list') {
      handleAddProduct();
    }
  }, [items.length, view]);

  const handleAddProduct = () => {
    setDraftItem({ id: uuidv4() });
    setEditingIndex(-1);
    setView('product');
  };

  const handleEditItem = (index: number) => {
    const item = items[index];
    setDraftItem(item);
    setEditingIndex(index);
    // Load existing elements into store
    useEditorStore.getState().loadState(item.design?.elements || []);
    setView('design');
  };

  const handleDeleteItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
    onNext({ items: newItems }); // Auto-save list state
  };

  const handleProductSubmit = (data: any) => {
    const updatedDraft = { ...draftItem, product: data.product };
    setDraftItem(updatedDraft);
    
    if (editingIndex === -1) {
      useEditorStore.getState().loadState([]);
    } else {
      useEditorStore.getState().loadState(updatedDraft.design?.elements || []);
    }
    setView('design');
  };

  const handleSaveAndReturn = (designData: any) => {
    const currentElements = useEditorStore.getState().elements;
    const finalDesign = { ...designData.design, elements: currentElements };
    
    const updatedDraft = { ...draftItem, design: finalDesign };
    
    const newItems = [...items];
    if (editingIndex === -1) {
      newItems.push(updatedDraft);
    } else {
      newItems[editingIndex] = updatedDraft;
    }
    
    setItems(newItems);
    onNext({ items: newItems }); // Push state to parent
    setView('list');
  };

  if (view === 'product') {
    return (
      <ProductStep 
        onNext={handleProductSubmit} 
        onBack={() => {
          if (items.length === 0) onBack(); // Go back to customer step if no items exist
          else setView('list');
        }} 
        defaultData={draftItem?.product} 
      />
    );
  }

  if (view === 'design') {
    return (
      <DesignStep 
        onNext={handleSaveAndReturn} 
        onBack={() => setView('product')} 
        defaultData={draftItem?.design} 
        productData={draftItem?.product} 
      />
    );
  }

  // LIST VIEW
  return (
    <div className="flex-1 w-full flex flex-col relative h-full">
      <MobileHeader 
        title="Order Items" 
        onBack={onBack} 
        rightAction={
          <Button variant="ghost" size="icon" onClick={handleAddProduct} className="text-primary hover:bg-surface-container-low w-10 h-10 rounded-full">
            <Plus className="w-5 h-5" />
          </Button>
        } 
      />

      <div className="space-y-6 animate-in fade-in duration-300 p-4 md:p-0 flex-1 overflow-y-auto">
        <div className="hidden md:flex items-center justify-between border-b border-outline-variant pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Order Items</h2>
          <p className="text-muted-foreground text-sm mt-1">Manage all products and gates for this order.</p>
        </div>
        <button 
          onClick={handleAddProduct}
          className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/20 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Another Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, index) => (
          <div key={item.id || index} className="bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
            <div className="h-40 bg-muted/30 relative flex items-center justify-center border-b">
              {item.product?.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.product.imageUrl} alt={item.product.category} className="w-full h-full object-contain p-4" />
              ) : (
                <ImageIcon className="w-10 h-10 text-muted-foreground/30" />
              )}
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleEditItem(index)}
                  className="p-1.5 bg-surface border border-outline-variant rounded-md shadow-sm hover:text-primary transition-colors"
                  title="Edit Product"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDeleteItem(index)}
                  className="p-1.5 bg-surface border border-outline-variant rounded-md shadow-sm hover:text-destructive transition-colors"
                  title="Delete Product"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <h4 className="font-bold text-lg">{item.product?.category || 'Custom Item'}</h4>
              {item.product?.description && <p className="text-sm text-muted-foreground truncate mb-2">{item.product.description}</p>}
              
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-1 rounded">
                  {item.design?.width || '?'} x {item.design?.height || '?'} {item.design?.unit || 'inch'}
                </span>
                <span className="text-xs text-muted-foreground font-medium">
                  {item.design?.material || 'Unknown Material'}
                </span>
              </div>
            </div>
          </div>
        ))}

        <div 
          onClick={handleAddProduct}
          className="border-2 border-dashed border-outline-variant rounded-xl flex flex-col items-center justify-center p-8 cursor-pointer hover:border-primary hover:bg-surface-container-low transition-all min-h-[250px] text-muted-foreground hover:text-primary group bg-surface"
        >
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Plus className="w-6 h-6" />
          </div>
          <span className="font-semibold text-lg">Add Product</span>
          <span className="text-sm mt-1 text-center">Add another gate, window, or item to this order</span>
        </div>
      </div>

      <div className="flex justify-between pt-6 border-t mt-8">
        <button type="button" onClick={onBack} className="px-6 py-2.5 border-2 rounded-lg hover:bg-muted font-semibold transition-all">Back</button>
        <button 
          type="button" 
          onClick={() => onNext({ items })} 
          className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-2.5 rounded-lg font-semibold hover:bg-primary/90 transition-all shadow-md hover:shadow-lg"
        >
          Proceed to Attachments <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      </div>
    </div>
  );
}
