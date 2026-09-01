import { NextRequest, NextResponse } from 'next/server';
import { getProductBySlug } from '@/lib/productApi';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const product = await getProductBySlug(slug, _request.signal);

  if (!product) {
    return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: product });
}