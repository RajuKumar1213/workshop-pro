'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, Upload, Trash2, Image as ImageIcon, Plus } from 'lucide-react';

export default function ProductMastersPage() {
  const [masters, setMasters] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  
  // New category state
  const [newCategory, setNewCategory] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  // Upload state
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const [isLoading, setIsLoading] = useState(true);

  const fetchMasters = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/masters/products');
      const data = await res.json();
      if (data.success) {
        setMasters(data.data);
        if (data.data.length > 0 && !selectedCategory) {
          setSelectedCategory(data.data[0].category);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMasters();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return toast.error('Please enter a category name');
    
    setIsAddingCategory(true);
    try {
      const res = await fetch('/api/masters/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: newCategory }),
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success('Category created successfully');
        setNewCategory('');
        fetchMasters();
      } else {
        toast.error(data.error || 'Failed to create category');
      }
    } catch (error) {
      toast.error('An error occurred while creating category');
    } finally {
      setIsAddingCategory(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return toast.error('Please select a file to upload');
    if (!selectedCategory) return toast.error('Please select a category or create one first');

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', selectedCategory);

    try {
      const res = await fetch('/api/masters/products/images', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        toast.success('Image uploaded successfully');
        setFile(null);
        fetchMasters(); // Refresh
      } else {
        toast.error(data.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred during upload');
    } finally {
      setIsUploading(false);
    }
  };

  const currentMaster = masters.find(m => m.category === selectedCategory);
  const images = currentMaster?.images || [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <PageHeader 
        title="Product Masters (Super Admin)" 
        description="Manage product categories and upload design images."
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-6">
          {/* Add Category Section */}
          <div className="bg-surface border border-outline-variant rounded-xl p-md space-y-4 shadow-sm h-fit">
            <h3 className="font-semibold text-lg">Add Category</h3>
            <div className="space-y-2">
              <label className="text-sm font-medium">New Category Name</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  className="flex-1 p-2 border rounded-md outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g. Main Gate"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
                <Button size="icon" onClick={handleAddCategory} disabled={!newCategory.trim() || isAddingCategory}>
                  {isAddingCategory ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </div>

          {/* Upload Section */}
          <div className="bg-surface border border-outline-variant rounded-xl p-md space-y-4 shadow-sm h-fit">
            <h3 className="font-semibold text-lg">Upload New Image</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Category</label>
              <select 
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary outline-none"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                disabled={masters.length === 0}
              >
                {masters.length === 0 && <option value="">No categories available</option>}
                {masters.map(m => <option key={m.id} value={m.category}>{m.category}</option>)}
              </select>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-sm font-medium">Image File</label>
              <div className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer transition relative ${!selectedCategory ? 'opacity-50 pointer-events-none' : 'hover:bg-muted/50'}`}>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => e.target.files && setFile(e.target.files[0])}
                  disabled={!selectedCategory}
                />
                {file ? (
                  <p className="text-sm text-primary font-medium truncate">{file.name}</p>
                ) : (
                  <div className="text-muted-foreground flex flex-col items-center">
                    <Upload className="w-6 h-6 mb-2" />
                    <span className="text-sm">Click to select an image</span>
                  </div>
                )}
              </div>
            </div>

            <Button 
              className="w-full mt-4" 
              onClick={handleUpload} 
              disabled={!file || !selectedCategory || isUploading}
            >
              {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Upload to Cloudinary
            </Button>
          </div>
        </div>

        {/* Images Display Section */}
        <div className="md:col-span-2 bg-surface border border-outline-variant rounded-xl p-md shadow-sm min-h-[400px]">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <div>
              <h3 className="font-semibold text-lg">Master Images</h3>
              {selectedCategory ? (
                <p className="text-sm text-muted-foreground">Showing images for <strong>{selectedCategory}</strong></p>
              ) : (
                <p className="text-sm text-muted-foreground">Select a category to view images</p>
              )}
            </div>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
              {images.length} Images
            </span>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-48 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : !selectedCategory ? (
            <div className="flex flex-col items-center justify-center h-48 text-muted-foreground border-2 border-dashed rounded-lg bg-muted/20 p-6 text-center">
              <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
              <p>No category selected.</p>
              <p className="text-sm mt-1">Please add or select a category first.</p>
            </div>
          ) : images.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((img: any) => (
                <div key={img.id} className="group relative rounded-md border overflow-hidden bg-muted aspect-square">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.imageUrl} alt="Master design" className="w-full h-full object-cover transition group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="destructive" size="icon" className="w-8 h-8 rounded-full shadow-lg">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-muted-foreground border-2 border-dashed rounded-lg bg-muted/20">
              <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
              <p>No master images uploaded for this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
