import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orderItems } from '@/drizzle/schema/orders';

export async function GET() {
  try {
    await db.insert(orderItems).values([
      {
        id: "61f2876d-a716-4e99-8b5c-c512959a8245",
        orderId: "832c295a-f002-40a2-86d3-5ca00d643333",
        productType: null,
        category: null,
        previewImageId: null,
        designData: {},
      },
      {
        id: "b9b74983-21cb-43d0-b6f5-991ac6c1f2bf",
        orderId: "832c295a-f002-40a2-86d3-5ca00d643333",
        productType: null,
        category: null,
        previewImageId: null,
        designData: {},
      },
      {
        id: "bc780b3f-7dac-4367-b53a-d9667c540e61",
        orderId: "832c295a-f002-40a2-86d3-5ca00d643333",
        productType: "Main Gate",
        category: "Main Gate",
        previewImageId: "https://res.cloudinary.com/dykqvsfd1/image/upload/v1783840723/workshop/product-masters/fcnawlx9a4gzc9y4etml.png",
        designData: {"width":56,"height":23,"unit":"inch","material":"Mild Steel","templateId":"Main Gate","holfass":{"side":"right","left":{"top":"","middle":"","bottom":""},"right":{"top":78,"middle":45,"bottom":12}},"kabja":"right","hasVentilator":false,"ventilatorImageUrl":"","elements":[]},
      }
    ]);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message, detail: err.detail, code: err.code, name: err.name });
  }
}
