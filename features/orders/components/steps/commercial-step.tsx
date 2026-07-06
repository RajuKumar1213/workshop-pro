'use client';

import { useState } from 'react';


export function CommercialStep({ onNext, onBack, defaultData }: { onNext: (data: any) => void, onBack: () => void, defaultData?: any }) {
  const [formData, setFormData] = useState(defaultData || {
    rateType: 'per_kg',
    estimatedRate: 0,
    expectedWeight: 0,
    advanceAmount: 0,
    deadline: '',
  });

  const estimatedTotal = formData.rateType === 'per_kg' 
    ? formData.estimatedRate * formData.expectedWeight
    : formData.estimatedRate; // for per_sqft or fixed it would be calculated differently, simplified here

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ commercial: { ...formData, estimatedTotal } });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Commercials & Deadline</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Rate Type</label>
          <select 
            className="w-full p-2 border rounded bg-background"
            value={formData.rateType}
            onChange={(e) => setFormData({ ...formData, rateType: e.target.value })}
          >
            <option value="per_kg">Per KG</option>
            <option value="per_sqft">Per Sq.Ft</option>
            <option value="fixed">Fixed Rate</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Rate (₹)</label>
          <input 
            type="number"
            className="w-full p-2 border rounded"
            value={formData.estimatedRate || ''}
            onChange={(e) => setFormData({ ...formData, estimatedRate: Number(e.target.value) })}
          />
        </div>
      </div>

      {formData.rateType === 'per_kg' && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Expected Weight (KG)</label>
          <input 
            type="number"
            className="w-full p-2 border rounded"
            value={formData.expectedWeight || ''}
            onChange={(e) => setFormData({ ...formData, expectedWeight: Number(e.target.value) })}
          />
        </div>
      )}

      <div className="p-4 bg-muted/30 rounded-lg flex justify-between items-center">
        <span className="font-medium">Estimated Total:</span>
        <span className="text-lg font-bold text-primary">₹{estimatedTotal.toFixed(2)}</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Advance Amount (₹)</label>
          <input 
            type="number"
            className="w-full p-2 border rounded"
            value={formData.advanceAmount || ''}
            onChange={(e) => setFormData({ ...formData, advanceAmount: Number(e.target.value) })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Delivery Deadline</label>
          <input 
            required
            type="date"
            className="w-full p-2 border rounded"
            value={formData.deadline}
            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
          />
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button type="button" onClick={onBack} className="px-4 py-2 border rounded hover:bg-muted">Back</button>
        <button type="submit" className="bg-primary text-primary-foreground px-4 py-2 rounded">Complete Order</button>
      </div>
    </form>
  );
}

