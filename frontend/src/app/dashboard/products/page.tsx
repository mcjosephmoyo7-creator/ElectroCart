'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { productApi, categoryApi } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/dashboardUtils';
import type { DashboardProduct, DashboardCategory } from '@/types/dashboard';
import {
  HiOutlinePlus,
  HiOutlineSearch,
  HiOutlinePencilAlt,
  HiOutlineTrash,
  HiOutlineEye,
  HiOutlineDownload,
} from 'react-icons/hi';
import { FaStar } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Pagination from '@/components/dashboard/Pagination';

type SortOption =
  | 'all'
  | 'new'
  | 'price-asc'
  | 'price-desc'
  | 'bestselling'
  | 'rating';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<DashboardProduct[]>([]);
  const [categories, setCategories] = useState<DashboardCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('all');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [confirmDelete, setConfirmDelete] = useState<DashboardProduct | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params: Record<string, string | number> = { page, limit: 10 };
    if (search) params.search = search;
    if (category) params.category = category;
    if (sort !== 'all') {
      if (sort === 'new') params.sort = 'newest';
      else if (sort === 'price-asc') params.sort = 'price';
      else if (sort === 'price-desc') params.sort = '-price';
      else if (sort === 'bestselling') params.sort = 'bestselling';
      else if (sort === 'rating') params.sort = 'rating';
    }
    try {
      const res = await productApi.getAll(params);
      const data = res.data.data;
      setProducts(data.products || []);
      setTotalPages(data.pages || 1);
      setTotal(data.total || 0);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [page, search, category, sort]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    categoryApi
      .getAll()
      .then((res) => setCategories(res.data.data || []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, category, sort]);

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await productApi.delete(confirmDelete._id);
      toast.success('Product deleted');
      setConfirmDelete(null);
      fetchProducts();
    } catch {
      toast.error('Failed to delete product');
      setConfirmDelete(null);
    }
  };

  const handleToggleVisibility = async (product: DashboardProduct) => {
    try {
      await productApi.toggleVisibility(product._id);
      toast.success(product.isActive ? 'Product hidden' : 'Product visible');
      fetchProducts();
    } catch {
      toast.error('Failed to update visibility');
    }
  };

  const handleExport = () => {
    const header = 'Name,Price,Stock,Sold,Status,Created';
    const rows = products.map((p) =>
      [
        `"${p.name.replace(/"/g, '""')}"`,
        p.discountPrice || p.price,
        p.stock,
        p.sold,
        p.isActive ? 'Active' : 'Inactive',
        new Date(p.createdAt).toISOString(),
      ].join(',')
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'electrocart-products.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      {/* Header + actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slateText font-heading">
            All Product List
          </h2>
          <p className="text-sm text-muted mt-0.5">
            {total} products total
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slateText bg-white border border-lineBorder rounded-lg hover:bg-body transition-colors"
          >
            <HiOutlineDownload className="w-4 h-4" />
            Export
          </button>
          <Link
            href="/dashboard/products/new"
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors"
          >
            <HiOutlinePlus className="w-4 h-4" />
            Add Product
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-lineBorder rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-body rounded-lg pl-9 pr-4 py-2.5 text-sm text-slateText placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary border border-lineBorder"
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-body rounded-lg px-3 py-2.5 text-sm text-slateText border border-lineBorder focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary md:w-56"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="bg-body rounded-lg px-3 py-2.5 text-sm text-slateText border border-lineBorder focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary md:w-56"
          >
            <option value="all">Show All Product</option>
            <option value="new">New Product</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="bestselling">Best Selling</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Products table */}
      <div className="bg-white border border-lineBorder rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-body">
                {['Product', 'Category', 'Price', 'Stock', 'Sold', 'Rating', 'Status', 'Created', 'Actions'].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-4 py-3 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-lineBorder">
              {loading ? (
                <tr>
                  <td colSpan={9} className="text-center py-16">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                      <p className="text-sm text-muted">Loading products...</p>
                    </div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-16 text-muted text-sm">
                    No products found
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const cat =
                    typeof product.category === 'object' ? product.category : null;
                  return (
                    <tr key={product._id} className="hover:bg-body/50 transition-colors">
                      <td className="px-4 py-3">
                        <Link
                          href={`/dashboard/products/${product._id}`}
                          className="flex items-center gap-3"
                        >
                          <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-body">
                            {product.images?.[0] ? (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-lineBorder flex items-center justify-center text-[10px] text-muted">
                                N/A
                              </div>
                            )}
                          </div>
                          <span className="text-sm font-medium text-slateText truncate max-w-[180px]">
                            {product.name}
                          </span>
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted">
                        {cat?.name || 'Uncategorized'}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-semibold text-slateText">
                          {formatCurrency(product.discountPrice || product.price)}
                        </span>
                        {product.discountPrice && (
                          <span className="text-xs text-muted line-through ml-1">
                            {formatCurrency(product.price)}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-sm font-medium ${
                            product.stock < 10 ? 'text-red-500' : 'text-slateText'
                          }`}
                        >
                          {product.stock}
                        </span>
                        {product.stock < 10 && (
                          <span className="ml-2 text-[10px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded">
                            LOW
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted">{product.sold}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <FaStar className="w-3 h-3 text-star" />
                          <span className="text-sm font-medium text-slateText">
                            {(product.ratings || 0).toFixed(1)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            product.isActive
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {product.isActive ? 'Active' : 'Hidden'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted whitespace-nowrap">
                        {formatDate(product.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Link
                            href={`/dashboard/products/${product._id}`}
                            className="p-2 text-muted hover:text-primary transition-colors"
                            title="Edit"
                          >
                            <HiOutlinePencilAlt className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleToggleVisibility(product)}
                            className="p-2 text-muted hover:text-amber-500 transition-colors"
                            title={product.isActive ? 'Hide' : 'Show'}
                          >
                            <HiOutlineEye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setConfirmDelete(product)}
                            className="p-2 text-muted hover:text-red-500 transition-colors"
                            title="Delete"
                          >
                            <HiOutlineTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-lineBorder">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>

      {/* Delete confirm modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4">
              <HiOutlineTrash className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-slateText mb-2">Delete Product?</h3>
            <p className="text-sm text-muted mb-6">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-slateText">{confirmDelete.name}</span>?
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 text-sm font-medium text-slateText bg-body border border-lineBorder rounded-lg hover:bg-lineBorder/50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
