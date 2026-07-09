'use client';

import { useState } from 'react';
import { CustomerStep } from './steps/customer-step';
import { ProductsManagerStep } from './steps/products-manager-step';
import { AttachmentsStep } from './steps/attachments-step';
import { CommercialStep } from './steps/commercial-step';

const steps = ['Customer', 'Products', 'Attachments', 'Commercial'];

export function OrderStepper() {
  const [currentStep, setCurrentStep] = useState(0);
  const [orderData, setOrderData] = useState<any>({});

  const handleNext = (stepData: any) => {
    setOrderData({ ...orderData, ...stepData });
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log('Final Order Data:', { ...orderData, ...stepData });
      // Submit to API
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      {/* Stepper Header */}
      <div className="flex justify-between items-center mb-12 relative px-4">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const isPending = index > currentStep;

          return (
            <div key={step} className="flex items-center flex-1 relative group">
              <div className="flex flex-col items-center flex-1 relative z-10 cursor-default">
                <div 
                  className={`
                    flex items-center justify-center font-black transition-all duration-300
                    ${isActive ? 'w-14 h-14 rounded-2xl bg-primary text-primary-foreground ring-4 ring-primary/20 shadow-xl scale-110 text-xl' : ''}
                    ${isCompleted ? 'w-12 h-12 rounded-xl bg-primary/90 text-primary-foreground shadow-md text-lg' : ''}
                    ${isPending ? 'w-12 h-12 rounded-xl bg-muted text-muted-foreground border-2 border-transparent text-lg' : ''}
                  `}
                >
                  {isCompleted ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <div 
                  className={`
                    absolute -bottom-8 whitespace-nowrap text-sm font-semibold transition-all duration-300
                    ${isActive ? 'text-primary scale-110 drop-shadow-sm' : ''}
                    ${isCompleted ? 'text-foreground' : ''}
                    ${isPending ? 'text-muted-foreground/70' : ''}
                  `}
                >
                  {step}
                </div>
              </div>

              {index < steps.length - 1 && (
                <div className="absolute left-[50%] right-[-50%] top-1/2 -translate-y-1/2 flex items-center z-0 px-4">
                  <div 
                    className={`h-1.5 w-full rounded-full transition-all duration-500 ${isCompleted ? 'bg-primary/80 shadow-[0_0_8px_rgba(var(--primary),0.5)]' : 'bg-muted'}`} 
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Stepper Content */}
      <div className="bg-card text-card-foreground border rounded-lg p-6 shadow-sm min-h-[400px]">
        {currentStep === 0 && <CustomerStep onNext={handleNext} defaultData={orderData.customer} />}
        {currentStep === 1 && <ProductsManagerStep onNext={handleNext} onBack={handleBack} defaultData={orderData.items} />}
        {currentStep === 2 && <AttachmentsStep onNext={handleNext} onBack={handleBack} defaultData={orderData.attachments} />}
        {currentStep === 3 && <CommercialStep onNext={handleNext} onBack={handleBack} defaultData={orderData.commercial} />}
      </div>
    </div>
  );
}
