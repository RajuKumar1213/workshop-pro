import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { materials } from '@/drizzle/schema/materials';
import { eq } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const list = await db.select().from(materials);
    return NextResponse.json({ success: true, data: list });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, description } = await req.json();

    if (!name) {
      return NextResponse.json({ success: false, error: 'Name is required' }, { status: 400 });
    }

    // Check if exists
    const existing = await db.query.materials.findFirst({
      where: eq(materials.name, name)
    });

    if (existing) {
      return NextResponse.json({ success: false, error: 'Material name already exists' }, { status: 400 });
    }

    const [newMaterial] = await db.insert(materials).values({
      name,
      description
    }).returning();

    return NextResponse.json({ success: true, data: newMaterial });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
