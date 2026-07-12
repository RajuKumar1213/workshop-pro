import { OrderStepper } from "@/features/orders/components/order-stepper";
import { PageHeader } from "@/components/common/page-header";

export default function NewOrderPage() {
  return (
    <div className="flex flex-col h-[calc(100dvh)] md:h-auto md:space-y-6 md:p-0">
      <div className="hidden md:block">
        <PageHeader 
          title="Create New Order" 
          description="Follow the steps below to create a new workshop order."
        />
      </div>
      <div className="flex-1 bg-surface md:rounded-xl md:border md:border-outline-variant md:shadow-sm md:p-6 w-full max-w-full overflow-hidden flex flex-col">
        <OrderStepper />
      </div>
    </div>
  );
}
