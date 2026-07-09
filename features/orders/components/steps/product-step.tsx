'use client';

import { useState, useEffect } from 'react';
import { Loader2, Image as ImageIcon } from 'lucide-react';

export function ProductStep({ onNext, onBack, defaultData }: { onNext: (data: any) => void, onBack: () => void, defaultData?: any }) {
  const [selectedCategory, setSelectedCategory] = useState<string>(defaultData?.category || '');
  const [description, setDescription] = useState(defaultData?.description || '');
  
  const [masters, setMasters] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>(defaultData?.imageUrl || '');

  // Fetch product masters from API
  useEffect(() => {
    async function fetchMasters() {
      setIsLoading(true);
      try {
        const res = await fetch('/api/masters/products');
        const data = await res.json();
        if (data.success) {
          setMasters(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch masters:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMasters();
  }, []);

  // Filter images based on selected category
  const currentCategoryImages = masters.find(m => m.category === selectedCategory)?.images || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) return alert("Please select a category");
    
    // Warn if no image selected, but allow for Custom items if none exist
    if (currentCategoryImages.length > 0 && !selectedImageUrl) {
      return alert("Please select a master design image for this category.");
    }

    onNext({ 
      product: { 
        category: selectedCategory, 
        description,
        imageUrl: selectedImageUrl
      } 
    });
  };

  // Generate dynamic categories from the database, plus an optional 'Custom Item' fallback
  const dynamicCategories = masters.map(m => m.category);
  const categoriesToRender = dynamicCategories.length > 0 
    ? dynamicCategories.includes('Custom Item') ? dynamicCategories : [...dynamicCategories, 'Custom Item']
    : ['Loading categories...'];

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-300">
      
      <div className="space-y-4">
        <h2 className="text-xl font-bold">1. Select Product Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {categoriesToRender.map(cat => (
            <div 
              key={cat}
              onClick={() => {
                if (cat === 'Loading categories...') return;
                setSelectedCategory(cat);
                setSelectedImageUrl(''); // reset image selection on category change
              }}
              className={`p-3 border rounded-lg cursor-pointer text-center transition-all ${selectedCategory === cat ? 'bg-primary text-primary-foreground border-primary font-medium shadow-md scale-[1.02]' : 'hover:bg-muted bg-card text-card-foreground'}`}
            >
              {cat}
            </div>
          ))}
        </div>
      </div>

      {selectedCategory && (
        <div className="space-y-4 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">2. Select Master Design</h2>
            {isLoading && <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />}
          </div>
          
          <div className="bg-muted/30 border rounded-xl p-6 min-h-[200px]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-10">
                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                <p>Loading master designs...</p>
              </div>
            ) : currentCategoryImages.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {currentCategoryImages.map((img: any) => (
                  <div 
                    key={img.id} 
                    onClick={() => setSelectedImageUrl(img.imageUrl)}
                    className={`relative rounded-lg border-2 overflow-hidden cursor-pointer aspect-square transition-all ${selectedImageUrl === img.imageUrl ? 'border-primary ring-4 ring-primary/20 scale-[1.02] shadow-lg' : 'border-transparent hover:border-primary/50'}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.imageUrl} alt="Design Option" className="w-full h-full object-cover" />
                    {selectedImageUrl === img.imageUrl && (
                      <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded shadow">
                        Selected
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                <ImageIcon className="w-12 h-12 mb-3 opacity-30" />
                <p>No master designs available for <strong>{selectedCategory}</strong>.</p>
                <p className="text-sm mt-1">Super Admin can add designs from Settings &gt; Product Masters.</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="space-y-2 pt-2">
        <label className="text-sm font-bold text-foreground">3. Item Description / Name (Optional)</label>
        <input 
          type="text"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm"
          placeholder="e.g., MS Sliding Gate with Laser Cut Design"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="flex justify-between pt-6 border-t mt-8">
        <button type="button" onClick={onBack} className="px-6 py-2.5 border-2 rounded-lg hover:bg-muted font-semibold transition-all">Back</button>
        <button type="submit" className="bg-primary text-primary-foreground px-8 py-2.5 rounded-lg font-semibold hover:bg-primary/90 transition-all shadow-md hover:shadow-lg">Next Step</button>
      </div>
    </form>
  );
}
