import { NextRequest, NextResponse } from 'next/server';
import { CustomerRepository } from '@/repositories/customer.repository';
import { z } from 'zod';

const createCustomerSchema = z.object({
  name: z.string().min(1),
  mobile: z.string().min(10),
  whatsapp: z.string().optional(),
  alternativeMobile: z.string().optional(),
  address: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  gst: z.string().optional(),
  notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = createCustomerSchema.parse(body);
    
    // In a real app, inject userId from session
    const customer = await CustomerRepository.create({
      ...data,
      createdBy: 'system', // Replace with session userId
    });

    return NextResponse.json({ success: true, data: customer }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || '';
    const mobile = searchParams.get('mobile') || '';
    
    if (mobile) {
      const customer = await CustomerRepository.findByMobile(mobile);
      if (customer) {
        return NextResponse.json({ success: true, data: customer });
      }
      return NextResponse.json({ success: false, error: 'Customer not found' }, { status: 404 });
    }

    const customers = await CustomerRepository.search(query);
    return NextResponse.json({ success: true, data: customers });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
