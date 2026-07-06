'use client';

import { useState } from 'react';
import { CustomerStep } from './steps/customer-step';
import { ProductStep } from './steps/product-step';
import { DesignStep } from './steps/design-step';
import { AttachmentsStep } from './steps/attachments-step';
import { CommercialStep } from './steps/commercial-step';

const steps = ['Customer', 'Product', 'Design', 'Attachments', 'Commercial'];

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
      <div className="flex justify-between items-center mb-8">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center flex-1">
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
              ${index <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
            `}>
              {index + 1}
            </div>
            <div className="ml-2 text-sm hidden sm:block">{step}</div>
            {index < steps.length - 1 && (
              <div className={`h-1 flex-1 mx-4 ${index < currentStep ? 'bg-primary' : 'bg-muted'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Stepper Content */}
      <div className="bg-card text-card-foreground border rounded-lg p-6 shadow-sm min-h-[400px]">
        {currentStep === 0 && <CustomerStep onNext={handleNext} defaultData={orderData.customer} />}
        {currentStep === 1 && <ProductStep onNext={handleNext} onBack={handleBack} defaultData={orderData.product} />}
        {currentStep === 2 && <DesignStep onNext={handleNext} onBack={handleBack} defaultData={orderData.design} />}
        {currentStep === 3 && <AttachmentsStep onNext={handleNext} onBack={handleBack} defaultData={orderData.attachments} />}
        {currentStep === 4 && <CommercialStep onNext={handleNext} onBack={handleBack} defaultData={orderData.commercial} />}
      </div>
    </div>
  );
}
