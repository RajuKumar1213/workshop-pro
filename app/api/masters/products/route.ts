import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { productMasters, productMasterImages } from '@/drizzle/schema/product-masters';
import { eq } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const masters = await db.query.productMasters.findMany({
      with: {
        images: true
      }
    });
    return NextResponse.json({ success: true, data: masters });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { category, name, description } = await req.json();

    if (!category) {
      return NextResponse.json({ success: false, error: 'Category is required' }, { status: 400 });
    }

    // Check if exists
    const existing = await db.query.productMasters.findFirst({
      where: eq(productMasters.category, category)
    });

    if (existing) {
      return NextResponse.json({ success: false, error: 'Category already exists' }, { status: 400 });
    }

    const [newMaster] = await db.insert(productMasters).values({
      category,
      name: name || category,
      description
    }).returning();

    return NextResponse.json({ success: true, data: newMaster });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
