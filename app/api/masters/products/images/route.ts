import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { productMasters, productMasterImages } from '@/drizzle/schema/product-masters';
import { eq } from 'drizzle-orm';
import { uploadToCloudinary } from '@/lib/utils/cloudinary';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const category = formData.get('category') as string;
    const file = formData.get('file') as File;

    if (!category || !file) {
      return NextResponse.json({ success: false, error: 'Category and file are required' }, { status: 400 });
    }

    // Read file buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary
    const imageUrl = await uploadToCloudinary(buffer, file.type, 'workshop/product-masters');

    // Find or create product master for this category
    let masterResult = await db.query.productMasters.findFirst({
      where: eq(productMasters.category, category)
    });

    if (!masterResult) {
      const [newMaster] = await db.insert(productMasters).values({
        category,
        name: category,
      }).returning();
      masterResult = newMaster;
    }

    // Add image to this master
    const [newImage] = await db.insert(productMasterImages).values({
      productMasterId: masterResult.id,
      imageUrl,
    }).returning();

    return NextResponse.json({ success: true, data: newImage });

  } catch (error: any) {
    console.error('Error uploading product master image:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
