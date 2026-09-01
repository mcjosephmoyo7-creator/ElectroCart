'use client';

import { useEffect, useState } from 'react';
import { categoryApi } from '@/lib/api';
import ProductForm from '@/components/products/ProductForm';
import type { DashboardCategory } from '@/types/dashboard';

export default function NewProductPage() {
  const [categories, setCategories] = useState<DashboardCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoryApi
      .getAll()
      .then((res) => setCategories(res.data.data || []))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-slateText font-heading mb-6">
        Add New Product
      </h2>
      <ProductForm categories={categories} />
    </div>
  );
}
