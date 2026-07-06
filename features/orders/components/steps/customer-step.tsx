'use client';

import { useState } from 'react';

export function CustomerStep({ onNext, defaultData }: { onNext: (data: any) => void, defaultData?: any }) {
  const [formData, setFormData] = useState(defaultData || { name: '', mobile: '', address: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ customer: formData });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Customer Details</h2>
      <div className="space-y-2">
        <label className="text-sm font-medium">Name</label>
        <input 
          required
          type="text"
          className="w-full p-2 border rounded"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Mobile</label>
        <input 
          required
          type="tel"
          className="w-full p-2 border rounded"
          value={formData.mobile}
          onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Address</label>
        <textarea 
          className="w-full p-2 border rounded"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        />
      </div>
      <div className="flex justify-end pt-4">
        <button type="submit" className="bg-primary text-primary-foreground px-4 py-2 rounded">Next Step</button>
      </div>
    </form>
  );
}
