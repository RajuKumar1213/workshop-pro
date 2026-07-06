import { NextRequest, NextResponse } from 'next/server';
import { OrderRepository } from '@/repositories/order.repository';
import { z } from 'zod';

const createOrderSchema = z.object({
  customerId: z.string(),
  priority: z.string().optional(),
  rateType: z.string().optional(),
  estimatedRate: z.number().optional(),
  advanceAmount: z.number().optional(),
  expectedWeight: z.number().optional(),
  deadline: z.string().transform((str) => new Date(str)).optional(),
  remarks: z.string().optional(),
  internalNotes: z.string().optional(),
  items: z.array(z.object({
    productType: z.string(),
    category: z.string().optional(),
  })).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = createOrderSchema.parse(body);
    
    const { items, ...orderData } = data;
    
    const order = await OrderRepository.create(
      { ...orderData, createdBy: 'system' }, // Replace with session userId
      items || []
    );

    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
