'use client';

import { useEffect, useState } from 'react';
import { categoryApi } from '@/lib/api';
import type { DashboardCategory } from '@/types/dashboard';
import {
  HiOutlinePlus,
  HiOutlinePencilAlt,
  HiOutlineTrash,
  HiOutlineCollection,
  HiOutlineFolder,
} from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<DashboardCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<DashboardCategory | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [slug, setSlug] = useState('');
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<DashboardCategory | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await categoryApi.getAll();
      setCategories(res.data.data || []);
    } catch {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setName('');
    setDescription('');
    setSlug('');
    setModalOpen(true);
  };

  const openEdit = (cat: DashboardCategory) => {
    setEditing(cat);
    setName(cat.name);
    setDescription(cat.description || '');
    setSlug(cat.slug || '');
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      if (editing) {
        await categoryApi.update(editing._id, { name: name.trim(), description, slug });
        toast.success('Category updated');
      } else {
        await categoryApi.create({ name: name.trim(), description, slug });
        toast.success('Category created');
      }
      setModalOpen(false);
      fetchCategories();
    } catch {
      toast.error('Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await categoryApi.delete(confirmDelete._id);
      toast.success('Category deleted');
      setConfirmDelete(null);
      fetchCategories();
    } catch {
      toast.error('Failed to delete category');
      setConfirmDelete(null);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slateText font-heading">Product Categories</h2>
          <p className="text-sm text-muted mt-0.5">{categories.length} categories</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors"
        >
          <HiOutlinePlus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-white border border-lineBorder rounded-xl py-16 text-center">
          <HiOutlineCollection className="w-10 h-10 text-muted/30 mx-auto mb-3" />
          <p className="text-sm text-muted">No categories found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="bg-white border border-lineBorder rounded-xl p-5 hover:shadow-card transition-shadow flex flex-col"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <HiOutlineFolder className="w-5 h-5 text-primary" />
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEdit(cat)}
                    className="p-2 text-muted hover:text-primary transition-colors"
                    title="Edit"
                  >
                    <HiOutlinePencilAlt className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setConfirmDelete(cat)}
                    className="p-2 text-muted hover:text-red-500 transition-colors"
                    title="Delete"
                  >
                    <HiOutlineTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="text-base font-bold text-slateText">{cat.name}</h3>
              <p className="text-sm text-muted mt-1 flex-1">
                {cat.description || 'No description'}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-muted font-mono">{cat.slug}</span>
                <span
                  className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                    cat.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                  }`}
                >
                  {cat.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-slateText mb-4">
              {editing ? 'Edit Category' : 'Add Category'}
            </h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slateText mb-1.5">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Electronics"
                  className="w-full bg-white rounded-lg px-3 py-2.5 text-sm border border-lineBorder focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slateText mb-1.5">
                  Slug
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="electronics"
                  className="w-full bg-white rounded-lg px-3 py-2.5 text-sm border border-lineBorder focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slateText mb-1.5">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Category description..."
                  className="w-full bg-white rounded-lg px-3 py-2.5 text-sm border border-lineBorder focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slateText bg-body border border-lineBorder rounded-lg hover:bg-lineBorder/50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editing ? 'Save' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4">
              <HiOutlineTrash className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-slateText mb-2">Delete Category?</h3>
            <p className="text-sm text-muted mb-6">
              Delete <span className="font-semibold text-slateText">{confirmDelete.name}</span>?
              Products in this category may become uncategorized.
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
