'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { productApi, categoryApi } from '@/lib/api';
import ProductForm from '@/components/products/ProductForm';
import type { DashboardCategory } from '@/types/dashboard';
import toast from 'react-hot-toast';

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const [product, setProduct] = useState<Record<string, unknown> | null>(null);
  const [categories, setCategories] = useState<DashboardCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [prodRes, catRes] = await Promise.allSettled([
          productApi.getById(params.id),
          categoryApi.getAll(),
        ]);
        if (prodRes.status === 'fulfilled') setProduct(prodRes.value.data.data);
        if (catRes.status === 'fulfilled') setCategories(catRes.value.data.data || []);
      } catch {
        toast.error('Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-16 text-muted text-sm">
        Product not found.
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-slateText font-heading mb-6">
        Edit Product
      </h2>
      <ProductForm initial={product} categories={categories} productId={params.id} />
    </div>
  );
}
