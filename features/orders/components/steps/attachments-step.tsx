'use client';

import { MobileHeader } from '@/components/layout/mobile-header';
import { ArrowRight, Image as ImageIcon, Mic } from 'lucide-react';

export function AttachmentsStep({ onNext, onBack, defaultData }: { onNext: (data: any) => void, onBack: () => void, defaultData?: any }) {
  
  const handleProceed = () => {
    onNext({ attachments: { files: [], voiceNote: null } });
  };

  return (
    <div className="flex-1 w-full flex flex-col relative h-full bg-background md:bg-transparent">
      <MobileHeader title="Attachments" onBack={onBack} />
      
      <div className="flex-1 w-full max-w-4xl mx-auto flex flex-col p-4 md:pt-4 overflow-y-auto">
        <div className="hidden md:block mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Site Photos & Voice Notes</h2>
          <p className="text-muted-foreground text-sm mt-1">Add context to the order with media attachments.</p>
        </div>
        
        <div className="space-y-6 flex-1">
          <div className="bg-surface-container-low border border-outline-variant rounded-xl p-6 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
              <ImageIcon className="w-8 h-8" />
            </div>
            <h3 className="font-label-lg text-label-lg mb-1 text-on-surface">Upload Site Photos</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">Select images from your device</p>
            <input type="file" multiple accept="image/*" className="block w-full max-w-xs mx-auto text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
          </div>

          <div className="bg-surface-container-low border border-outline-variant rounded-xl p-6 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mb-4 text-error">
              <Mic className="w-8 h-8" />
            </div>
            <h3 className="font-label-lg text-label-lg mb-1 text-on-surface">Record Voice Note</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">Explain special requirements or context.</p>
            <button type="button" className="px-6 py-3 bg-error/10 text-error rounded-full font-label-md text-label-md hover:bg-error/20 flex items-center gap-2 transition-colors">
              <div className="w-3 h-3 rounded-full bg-error animate-pulse" />
              Hold to Record
            </button>
          </div>
        </div>

        {/* Action Area (Sticky Bottom on Mobile) */}
        <div className="fixed bottom-0 left-0 w-full md:static md:w-auto bg-surface border-t border-outline-variant md:border-none p-4 md:p-0 z-40 pb-[calc(env(safe-area-inset-bottom)+1rem)] md:pb-0 md:mt-8 flex justify-between gap-4">
          <button type="button" onClick={onBack} className="flex-1 md:flex-none font-label-md text-label-md py-3 px-8 rounded-lg border-2 border-outline-variant hover:bg-surface-variant text-on-surface transition-all">
            Back
          </button>
          <button 
            type="button" 
            onClick={handleProceed}
            className="flex-2 md:flex-none font-label-md text-label-md py-3 px-8 rounded-lg flex items-center justify-center gap-xs transition-colors bg-primary text-on-primary hover:bg-primary/90 shadow-md hover:shadow-lg"
          >
            Commercial Details
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}
