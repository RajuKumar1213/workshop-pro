'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, Trash2, Plus, Edit2, X, Check } from 'lucide-react';
import { 
  useGetProducts, 
  useCreateProductCategory, 
  useUpdateProductCategory, 
  useDeleteProductCategory 
} from '@/hooks/api/use-masters';

interface ProductCategory {
  id: string;
  category: string;
  name: string;
  description: string | null;
}

export default function ProductCategoriesPage() {
  const { data, isLoading } = useGetProducts();
  const categories: ProductCategory[] = data?.data || [];

  const createCategory = useCreateProductCategory();
  const updateCategory = useUpdateProductCategory();
  const deleteCategory = useDeleteProductCategory();

  // Add state
  const [newCategory, setNewCategory] = useState('');
  const [newDescription, setNewDescription] = useState('');

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCategory, setEditCategory] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const handleAdd = async () => {
    if (!newCategory.trim()) return toast.error('Please enter a category name');
    
    try {
      await createCategory.mutateAsync({ category: newCategory, description: newDescription });
      toast.success('Category added successfully');
      setNewCategory('');
      setNewDescription('');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to add category');
    }
  };

  const handleEdit = (c: ProductCategory) => {
    setEditingId(c.id);
    setEditCategory(c.category);
    setEditDescription(c.description || '');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditCategory('');
    setEditDescription('');
  };

  const handleSaveEdit = async () => {
    if (!editCategory.trim() || !editingId) return;

    try {
      await updateCategory.mutateAsync({ 
        id: editingId, 
        data: { category: editCategory, description: editDescription } 
      });
      toast.success('Category updated');
      setEditingId(null);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update category');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category? All associated images will be deleted.')) return;

    try {
      await deleteCategory.mutateAsync(id);
      toast.success('Category deleted');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to delete category');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <PageHeader 
        title="Product Categories Master" 
        description="Manage product categories like Main Gate, Window Grill, etc."
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Add Category Section */}
        <div className="space-y-6">
          <div className="bg-surface border border-outline-variant rounded-xl p-md space-y-4 shadow-sm h-fit">
            <h3 className="font-semibold text-lg">Add Category</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Category Name</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g. Main Gate"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Description (Optional)</label>
                <textarea 
                  className="w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-primary resize-none h-20"
                  placeholder="Brief description..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                />
              </div>
              <Button className="w-full" onClick={handleAdd} disabled={!newCategory.trim() || createCategory.isPending}>
                {createCategory.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                Add Category
              </Button>
            </div>
          </div>
        </div>

        {/* Categories List */}
        <div className="md:col-span-2 bg-surface border border-outline-variant rounded-xl p-md shadow-sm min-h-[400px]">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h3 className="font-semibold text-lg">Existing Categories</h3>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
              {categories.length} Categories
            </span>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-48 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : categories.length > 0 ? (
            <div className="space-y-3">
              {categories.map((c) => (
                <div key={c.id} className="flex items-center justify-between p-3 border border-outline-variant rounded-xl hover:bg-surface-container-low transition-colors bg-surface">
                  {editingId === c.id ? (
                    <div className="flex-1 flex gap-2 items-start">
                      <div className="flex-1 space-y-2">
                        <input 
                          type="text" 
                          className="w-full p-2 text-sm border rounded-md outline-none focus:ring-2 focus:ring-primary"
                          value={editCategory}
                          onChange={(e) => setEditCategory(e.target.value)}
                        />
                        <input 
                          type="text" 
                          className="w-full p-2 text-sm border rounded-md outline-none focus:ring-2 focus:ring-primary"
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          placeholder="Description"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button size="icon" variant="ghost" onClick={handleSaveEdit} disabled={updateCategory.isPending || !editCategory.trim()}>
                          {updateCategory.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 text-green-600" />}
                        </Button>
                        <Button size="icon" variant="ghost" onClick={handleCancelEdit} disabled={updateCategory.isPending}>
                          <X className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <p className="font-medium">{c.category}</p>
                        {c.description && <p className="text-sm text-muted-foreground">{c.description}</p>}
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(c)}>
                          <Edit2 className="w-4 h-4 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(c.id)} disabled={deleteCategory.isPending}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-muted-foreground border-2 border-dashed rounded-lg bg-muted/20">
              <p>No categories added yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
