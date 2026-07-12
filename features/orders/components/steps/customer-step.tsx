'use client';

import { useState } from 'react';
import { MobileHeader } from '@/components/layout/mobile-header';
import { ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export function CustomerStep({ onNext, defaultData }: { onNext: (data: any) => void, defaultData?: any }) {
  const [formData, setFormData] = useState(defaultData || { name: '', mobile: '', address: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ customer: formData });
  };

  return (
    <div className="flex-1 w-full flex flex-col relative h-full bg-background md:bg-transparent">
      <MobileHeader title="Customer Details" />
      
      <form onSubmit={handleSubmit} className="flex-1 w-full max-w-4xl mx-auto flex flex-col p-4 md:pt-4 overflow-y-auto">
        <div className="hidden md:block mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Customer Details</h2>
          <p className="text-muted-foreground text-sm mt-1">Enter the client information for this order.</p>
        </div>
        
        <div className="space-y-6 flex-1">
          <div className="space-y-2">
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block mb-1">Full Name</label>
            <Input 
              required
              type="text"
              placeholder="e.g. John Doe"
              className="w-full bg-surface-container-low border-outline-variant rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:border-primary focus:ring-primary"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block mb-1">Mobile Number</label>
            <Input 
              required
              type="tel"
              placeholder="e.g. +91 98765 43210"
              className="w-full bg-surface-container-low border-outline-variant rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:border-primary focus:ring-primary"
              value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block mb-1">Address / Site Location</label>
            <Textarea 
              rows={4}
              placeholder="Full site address..."
              className="w-full bg-surface-container-low border-outline-variant rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:border-primary focus:ring-primary resize-none"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
        </div>

        {/* Action Area (Sticky Bottom on Mobile) */}
        <div className="fixed bottom-0 left-0 w-full md:static md:w-auto bg-surface border-t border-outline-variant md:border-none p-4 md:p-0 z-40 pb-[calc(env(safe-area-inset-bottom)+1rem)] md:pb-0 md:mt-8 flex justify-end">
          <Button 
            type="submit"
            className="w-full md:w-auto py-3 px-8 rounded-lg flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            Continue to Products
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </form>
    </div>
  );
}
