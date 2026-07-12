'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, Trash2, Plus, Edit2, X, Check } from 'lucide-react';

interface Material {
  id: string;
  name: string;
  description: string | null;
}

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Add state
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const fetchMaterials = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/masters/materials');
      const data = await res.json();
      if (data.success) {
        setMaterials(data.data);
      }
    } catch (error) {
      toast.error('Failed to load materials');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleAdd = async () => {
    if (!newName.trim()) return toast.error('Please enter a material name');
    
    setIsAdding(true);
    try {
      const res = await fetch('/api/masters/materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName, description: newDescription }),
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success('Material added successfully');
        setNewName('');
        setNewDescription('');
        fetchMaterials();
      } else {
        toast.error(data.error || 'Failed to add material');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsAdding(false);
    }
  };

  const handleEdit = (m: Material) => {
    setEditingId(m.id);
    setEditName(m.name);
    setEditDescription(m.description || '');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditDescription('');
  };

  const handleSaveEdit = async () => {
    if (!editName.trim() || !editingId) return;

    setIsSaving(true);
    try {
      const res = await fetch(`/api/masters/materials/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName, description: editDescription }),
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success('Material updated');
        setEditingId(null);
        fetchMaterials();
      } else {
        toast.error(data.error || 'Failed to update material');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this material?')) return;

    try {
      const res = await fetch(`/api/masters/materials/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success('Material deleted');
        fetchMaterials();
      } else {
        toast.error(data.error || 'Failed to delete material');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <PageHeader 
        title="Material Specs Master" 
        description="Manage the list of available materials for products."
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Add Material Section */}
        <div className="space-y-6">
          <div className="bg-surface border border-outline-variant rounded-xl p-md space-y-4 shadow-sm h-fit">
            <h3 className="font-semibold text-lg">Add Material</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Name</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g. Mild Steel (MS)"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
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
              <Button className="w-full" onClick={handleAdd} disabled={!newName.trim() || isAdding}>
                {isAdding ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                Add Material
              </Button>
            </div>
          </div>
        </div>

        {/* Materials List */}
        <div className="md:col-span-2 bg-surface border border-outline-variant rounded-xl p-md shadow-sm min-h-[400px]">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h3 className="font-semibold text-lg">Existing Materials</h3>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
              {materials.length} Materials
            </span>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-48 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : materials.length > 0 ? (
            <div className="space-y-3">
              {materials.map((m) => (
                <div key={m.id} className="flex items-center justify-between p-3 border border-outline-variant rounded-xl hover:bg-surface-container-low transition-colors bg-surface">
                  {editingId === m.id ? (
                    <div className="flex-1 flex gap-2 items-start">
                      <div className="flex-1 space-y-2">
                        <input 
                          type="text" 
                          className="w-full p-2 text-sm border rounded-md outline-none focus:ring-2 focus:ring-primary"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
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
                        <Button size="icon" variant="ghost" onClick={handleSaveEdit} disabled={isSaving || !editName.trim()}>
                          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 text-green-600" />}
                        </Button>
                        <Button size="icon" variant="ghost" onClick={handleCancelEdit} disabled={isSaving}>
                          <X className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <p className="font-medium">{m.name}</p>
                        {m.description && <p className="text-sm text-muted-foreground">{m.description}</p>}
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(m)}>
                          <Edit2 className="w-4 h-4 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(m.id)}>
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
              <p>No materials added yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
