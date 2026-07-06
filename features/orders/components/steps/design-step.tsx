'use client';

export function DesignStep({ onNext, onBack, defaultData }: { onNext: (data: any) => void, onBack: () => void, defaultData?: any }) {
  // Simple placeholder for Design Canvas / Template selection
  const handleProceed = () => {
    onNext({ design: { templateId: 'custom', drawn: true } });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-4">Measurement Canvas & Design</h2>
      
      <div className="h-64 border-2 border-dashed rounded-lg flex items-center justify-center bg-muted/30">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Here the interactive 2D Measurement Canvas will be loaded.</p>
          <p className="text-sm">Features: Grid snap, Shapes, Measurements lines, Material selection.</p>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button type="button" onClick={onBack} className="px-4 py-2 border rounded hover:bg-muted">Back</button>
        <button type="button" onClick={handleProceed} className="bg-primary text-primary-foreground px-4 py-2 rounded">Save & Next</button>
      </div>
    </div>
  );
}
