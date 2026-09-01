import { Suspense } from 'react';
import ShopContent from './ShopContent';

export const metadata = {
  title: 'Shop',
  description: 'Browse and filter all ElectroCart products by category, brand, price and rating.',
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const get = (key: string) => Array.isArray(params[key]) ? params[key]?.[0] : params[key];

  return (
    <Suspense
      fallback={<div className="container-custom py-24 text-center text-muted">Loading products...</div>}
    >
      <ShopContent
        initialSearch={get('search') ?? ''}
        initialCategory={get('category') ?? ''}
        initialBrand={get('brand') ?? ''}
      />
    </Suspense>
  );
}