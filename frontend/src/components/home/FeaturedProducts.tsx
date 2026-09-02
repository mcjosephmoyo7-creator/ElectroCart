'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { HiOutlineArrowRight } from 'react-icons/hi';
import ProductCard from '@/components/ui/ProductCard';
import { getElectronicsProducts } from '@/lib/productApi';
import { Product } from '@/types';

type TabKey = 'best-sellers' | 'new-arrivals' | 'on-sale';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'best-sellers', label: 'Best Sellers' },
  { key: 'new-arrivals', label: 'New Arrivals' },
  { key: 'on-sale', label: 'On Sale' },
];

export default function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState<TabKey>('best-sellers');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const controller = new AbortController();

  async function loadProducts() {
  try {
  setLoading(true);
  const response = await getElectronicsProducts({ sort: 'popular', signal: controller.signal });
  setProducts(response.products);
  } catch {
  setProducts([]);
  } finally {
  if (!controller.signal.aborted) setLoading(false);
  }
  }

  loadProducts();
  return () => controller.abort();
  }, []);

  const showProducts = useMemo(() => {
  let list: Product[];
  if (activeTab === 'best-sellers') {
  list = [...products].sort((a, b) => b.sold - a.sold);
  } else if (activeTab === 'new-arrivals') {
  list = products.filter((p) => p.isNew);
  if (list.length === 0) list = [...products].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } else {
  list = products.filter((p) => p.onSale);
  }
  return list.slice(0, 8);
  }, [activeTab, products]);

  return (
  <section className="container-custom py-12 lg:py-16">
  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
  <div>
  <h2 className="section-title">Featured Products</h2>
  <p className="text-muted mt-1.5 text-sm">Hand-picked favourites, refreshed every week.</p>
  </div>

  {/* Tabs */}
  <div className="flex items-center gap-1 bg-white  border border-lineBorder  rounded-full p-1 w-fit">
  {tabs.map((tab) => (
  <button
  key={tab.key}
  onClick={() => setActiveTab(tab.key)}
  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
  activeTab === tab.key
  ? 'bg-primary text-white shadow-sm'
  : 'text-muted hover:text-primary '
  }`}
  >
  {tab.label}
  </button>
  ))}
  </div>
  </div>

  {loading ? (
  <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
  {Array.from({ length: 4 }).map((_, index) => (
  <div key={index} className="h-80 animate-pulse rounded-2xl bg-slate-200 " />
  ))}
  </div>
  ) : showProducts.length === 0 ? (
  <div className="rounded-2xl border border-lineBorder  bg-white  p-10 text-center text-muted">
  No featured products are available right now.
  </div>
  ) : (
  <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
  {showProducts.map((product) => (
  <ProductCard key={product._id} product={product} />
  ))}
  </div>
  )}

  <div className="text-center mt-10">
  <Link
  href="/shop"
  className="inline-flex items-center gap-2 bg-navy  text-white  hover:bg-primary px-7 py-3 rounded-lg font-semibold transition-colors"
  >
  Explore All Products <HiOutlineArrowRight className="w-5 h-5" />
  </Link>
  </div>
  </section>
  );
}