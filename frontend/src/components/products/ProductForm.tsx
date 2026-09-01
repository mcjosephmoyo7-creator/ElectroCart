'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { productApi, categoryApi } from '@/lib/api';
import type { DashboardCategory } from '@/types/dashboard';
import toast from 'react-hot-toast';
import { HiOutlineArrowLeft, HiOutlineUpload } from 'react-icons/hi';

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  discountPrice: string;
  brand: string;
  category: string;
  stock: string;
  tags: string;
  isFeatured: boolean;
  isActive: boolean;
}

interface ProductFormProps {
  initial?: Record<string, unknown>;
  categories: DashboardCategory[];
  productId?: string;
}

export default function ProductForm({ initial, categories, productId }: ProductFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ProductFormData>({
    name: (initial?.name as string) || '',
    description: (initial?.description as string) || '',
    price: initial?.price != null ? String(initial.price) : '',
    discountPrice: initial?.discountPrice != null ? String(initial.discountPrice) : '',
    brand: (initial?.brand as string) || '',
    category:
      typeof initial?.category === 'object' && initial?.category
        ? (initial.category as { _id: string })._id
        : ((initial?.category as string) || ''),
    stock: initial?.stock != null ? String(initial.stock) : '0',
    tags: Array.isArray(initial?.tags) ? (initial.tags as string[]).join(', ') : '',
    isFeatured: Boolean(initial?.isFeatured),
    isActive: initial?.isActive !== false,
  });
  const [images, setImages] = useState<string[]>(
    Array.isArray(initial?.images) ? (initial.images as string[]) : []
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof ProductFormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImageFile(file);
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Product name is required';
    if (!form.price || Number(form.price) <= 0) errs.price = 'Valid price is required';
    if (Number(form.stock) < 0) errs.stock = 'Stock cannot be negative';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    formData.append('name', form.name.trim());
    formData.append('description', form.description.trim());
    formData.append('price', form.price);
    if (form.discountPrice) formData.append('discountPrice', form.discountPrice);
    formData.append('brand', form.brand.trim());
    if (form.category) formData.append('category', form.category);
    formData.append('stock', form.stock);
    formData.append('tags', form.tags);
    formData.append('isFeatured', String(form.isFeatured));
    formData.append('isActive', String(form.isActive));
    if (imageFile) formData.append('image', imageFile);
    else if (images.length > 0) {
      images.forEach((img) => formData.append('images', img));
    }

    setSaving(true);
    try {
      if (productId) {
        await productApi.update(productId, formData);
        toast.success('Product updated successfully');
      } else {
        await productApi.create(formData);
        toast.success('Product created successfully');
      }
      router.push('/dashboard/products');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to save product';
      toast.error(msg);
      setSaving(false);
    }
  };

  const inputClass = (err?: string) =>
    `w-full bg-white rounded-lg px-3 py-2.5 text-sm text-slateText placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary border ${
      err ? 'border-red-500' : 'border-lineBorder'
    }`;

  const labelClass = 'block text-sm font-medium text-slateText mb-1.5';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push('/dashboard/products')}
          className="flex items-center gap-2 text-sm font-medium text-muted hover:text-primary transition-colors"
        >
          <HiOutlineArrowLeft className="w-4 h-4" />
          Back to Products
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-lineBorder rounded-xl p-5 space-y-4">
            <h3 className="text-base font-bold text-slateText">Basic Information</h3>
            <div>
              <label className={labelClass}>Product Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g. Wireless Headphones"
                className={inputClass(errors.name)}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
                placeholder="Describe the product..."
                className={inputClass()}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Price (USD) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                  placeholder="0.00"
                  className={inputClass(errors.price)}
                />
                {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
              </div>
              <div>
                <label className={labelClass}>Sale Price (USD)</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.discountPrice}
                  onChange={(e) => handleChange('discountPrice', e.target.value)}
                  placeholder="0.00"
                  className={inputClass()}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Brand</label>
                <input
                  type="text"
                  value={form.brand}
                  onChange={(e) => handleChange('brand', e.target.value)}
                  placeholder="e.g. Apple"
                  className={inputClass()}
                />
              </div>
              <div>
                <label className={labelClass}>Category</label>
                <select
                  value={form.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className={inputClass()}
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Stock Quantity</label>
                <input
                  type="number"
                  value={form.stock}
                  onChange={(e) => handleChange('stock', e.target.value)}
                  placeholder="0"
                  className={inputClass(errors.stock)}
                />
                {errors.stock && <p className="text-xs text-red-500 mt-1">{errors.stock}</p>}
              </div>
              <div>
                <label className={labelClass}>Tags (comma separated)</label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={(e) => handleChange('tags', e.target.value)}
                  placeholder="new, featured, sale"
                  className={inputClass()}
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-lineBorder rounded-xl p-5 space-y-4">
            <h3 className="text-base font-bold text-slateText">Product Image</h3>
            <div className="flex items-start gap-4">
              <div className="w-24 h-24 rounded-lg overflow-hidden bg-body border border-lineBorder flex-shrink-0">
                {imageFile ? (
                  <img
                    src={URL.createObjectURL(imageFile)}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : images[0] ? (
                  <img
                    src={images[0]}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted">
                    <HiOutlineUpload className="w-6 h-6" />
                  </div>
                )}
              </div>
              <label className="flex flex-col items-center justify-center w-40 h-24 border-2 border-dashed border-lineBorder rounded-lg cursor-pointer hover:border-primary hover:bg-body/50 transition-colors">
                <HiOutlineUpload className="w-5 h-5 text-muted mb-1" />
                <span className="text-xs text-muted">Upload image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
            {images.length > 0 && !imageFile && (
              <p className="text-xs text-muted">
                Keep current image. Upload a new file to replace it.
              </p>
            )}
          </div>
        </div>

        {/* Side panel */}
        <div className="space-y-6">
          <div className="bg-white border border-lineBorder rounded-xl p-5 space-y-4">
            <h3 className="text-base font-bold text-slateText">Visibility</h3>
            <label className="flex items-center justify-between">
              <span className="text-sm text-slateText">Active</span>
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => handleChange('isActive', e.target.checked)}
                className="w-5 h-5 accent-primary"
              />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm text-slateText">Featured</span>
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => handleChange('isFeatured', e.target.checked)}
                className="w-5 h-5 accent-primary"
              />
            </label>
          </div>

          <div className="bg-white border border-lineBorder rounded-xl p-5">
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-primary hover:bg-primary-dark text-white py-2.5 rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : productId ? (
                'Save Changes'
              ) : (
                'Create Product'
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
