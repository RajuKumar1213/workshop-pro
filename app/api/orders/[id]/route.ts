import { NextRequest, NextResponse } from 'next/server';
import { OrderRepository } from '@/repositories/order.repository';
import { z } from 'zod';

const updateOrderSchema = z.object({
  customerId: z.string().optional(),
  priority: z.string().optional(),
  rateType: z.string().optional(),
  estimatedRate: z.number().optional(),
  advanceAmount: z.number().optional(),
  expectedWeight: z.number().optional(),
  deadline: z.string().transform((str) => new Date(str)).optional(),
  remarks: z.string().optional(),
  internalNotes: z.string().optional(),
  items: z.array(z.object({
    id: z.string().optional(),
    product: z.object({
      category: z.string().optional(),
      imageUrl: z.string().optional(),
      description: z.string().optional(),
    }).optional(),
    design: z.any().optional(), // allow unstructured JSON for design data
  })).optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await OrderRepository.findById(id);
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: order });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const data = updateOrderSchema.parse(body);
    
    const { items, ...orderData } = data;
    
    const order = await OrderRepository.update(id, orderData, items as any[]);

    return NextResponse.json({ success: true, data: order });
  } catch (error: any) {
    console.error("Database Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      detail: error.detail,
      code: error.code,
      hint: error.hint
    }, { status: 400 });
  }
}
