import { OrderStepper } from "@/features/orders/components/order-stepper";
import { PageHeader } from "@/components/common/page-header";

export default function NewOrderPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Create New Order" 
        description="Follow the steps below to create a new workshop order."
      />
      <div className="bg-card rounded-lg border shadow-sm p-6">
        <OrderStepper />
      </div>
    </div>
  );
}
