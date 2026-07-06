'use client';

export function AttachmentsStep({ onNext, onBack, defaultData }: { onNext: (data: any) => void, onBack: () => void, defaultData?: any }) {
  
  const handleProceed = () => {
    onNext({ attachments: { files: [], voiceNote: null } });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-4">Site Photos & Voice Notes</h2>
      
      <div className="space-y-4">
        <div className="p-4 border rounded-lg bg-card">
          <h3 className="font-semibold mb-2">Upload Site Photos</h3>
          <input type="file" multiple accept="image/*" className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
        </div>

        <div className="p-4 border rounded-lg bg-card">
          <h3 className="font-semibold mb-2">Record Voice Note</h3>
          <div className="flex items-center gap-4">
            <button type="button" className="px-4 py-2 bg-red-100 text-red-600 rounded-full font-medium hover:bg-red-200 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse" />
              Start Recording
            </button>
            <span className="text-sm text-muted-foreground">Explain special requirements or context.</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button type="button" onClick={onBack} className="px-4 py-2 border rounded hover:bg-muted">Back</button>
        <button type="button" onClick={handleProceed} className="bg-primary text-primary-foreground px-4 py-2 rounded">Next Step</button>
      </div>
    </div>
  );
}
