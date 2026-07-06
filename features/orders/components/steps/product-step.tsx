'use client';

import { useState } from 'react';

const PRODUCT_CATEGORIES = [
  'Main Gate', 'Sliding Gate', 'Window Grill', 'Balcony Grill', 'Staircase Railing', 'Shed Structure', 'Custom Item'
];

export function ProductStep({ onNext, onBack, defaultData }: { onNext: (data: any) => void, onBack: () => void, defaultData?: any }) {
  const [selectedCategory, setSelectedCategory] = useState<string>(defaultData?.category || '');
  const [description, setDescription] = useState(defaultData?.description || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) return alert("Please select a category");
    onNext({ product: { category: selectedCategory, description } });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-bold mb-4">Product Category</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {PRODUCT_CATEGORIES.map(cat => (
          <div 
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`p-4 border rounded-lg cursor-pointer text-center transition-colors ${selectedCategory === cat ? 'bg-primary/10 border-primary font-medium' : 'hover:bg-muted'}`}
          >
            {cat}
          </div>
        ))}
      </div>

      <div className="space-y-2 pt-4">
        <label className="text-sm font-medium">Item Description / Name</label>
        <input 
          type="text"
          className="w-full p-2 border rounded"
          placeholder="e.g., MS Sliding Gate with Laser Cut Design"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="flex justify-between pt-4">
        <button type="button" onClick={onBack} className="px-4 py-2 border rounded hover:bg-muted">Back</button>
        <button type="submit" className="bg-primary text-primary-foreground px-4 py-2 rounded">Next Step</button>
      </div>
    </form>
  );
}
