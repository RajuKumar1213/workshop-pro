import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { productMasters, productMasterImages } from '@/drizzle/schema/product-masters';
import { eq } from 'drizzle-orm';
import { uploadToCloudinary } from '@/lib/utils/cloudinary';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const category = formData.get('category') as string;
    const files = formData.getAll('files') as File[];

    if (!category || files.length === 0) {
      return NextResponse.json({ success: false, error: 'Category and at least one file are required' }, { status: 400 });
    }

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

    const uploadedImages = [];

    // Process each file
    for (const file of files) {
      // Read file buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Upload to Cloudinary
      const imageUrl = await uploadToCloudinary(buffer, file.type, 'workshop/product-masters');
      uploadedImages.push(imageUrl);
    }

    // Add images to this master
    const imageRecordsToInsert = uploadedImages.map(imageUrl => ({
      productMasterId: masterResult.id,
      imageUrl,
    }));

    const newImages = await db.insert(productMasterImages).values(imageRecordsToInsert).returning();

    return NextResponse.json({ success: true, data: newImages });

  } catch (error: any) {
    console.error('Error uploading product master image:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
