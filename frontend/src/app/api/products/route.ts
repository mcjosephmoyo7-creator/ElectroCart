import { NextRequest, NextResponse } from 'next/server';
import { getElectronicsProducts } from '@/lib/productApi';
import { combineQueryValue } from '@/lib/utils';

/** GET /api/products?search=&category=&brand=&min=&max=&sort=&featured=&new=&sale=&page=&limit= */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const search = combineQueryValue(searchParams.get('search') ?? undefined).trim();
  const category = combineQueryValue(searchParams.get('category') ?? undefined);
  const brand = combineQueryValue(searchParams.get('brand') ?? undefined);
  const min = Number(searchParams.get('min')) || 0;
  const max = Number(searchParams.get('max')) || 99999;
  const sort = searchParams.get('sort') ?? 'default';
  const featured = searchParams.get('featured') === 'true';
  const isNew = searchParams.get('new') === 'true';
  const onSale = searchParams.get('sale') === 'true';
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 24;

  const response = await getElectronicsProducts({
    search: search || undefined,
    categories: category ? [category] : undefined,
    sort: sort === 'default' ? undefined : (sort as 'price-asc' | 'price-desc' | 'rating' | 'popular'),
    signal: request.signal,
  });

  const result = response.products.filter((p) => {
    const price = p.discountPrice ?? p.price;
    if (brand && p.brand !== brand) return false;
    if (min && price < min) return false;
    if (price > max) return false;
    if (featured && !p.isFeatured) return false;
    if (isNew && !p.isNew) return false;
    if (onSale && !p.onSale) return false;
    return true;
  });

  const total = result.length;
  const start = (page - 1) * limit;
  const data = result.slice(start, start + limit);

  return NextResponse.json({
    success: true,
    count: data.length,
    total,
    page,
    pages: Math.max(1, Math.ceil(total / limit)),
    data,
  });
}
