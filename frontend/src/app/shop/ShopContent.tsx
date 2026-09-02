'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { HiOutlineAdjustments, HiOutlineX, HiOutlineSearch, HiOutlineRefresh } from 'react-icons/hi';
import { categories } from '@/data/categories';
import { brands } from '@/data/brands';
import ProductCard from '@/components/ui/ProductCard';
import PriceRangeSlider from '@/components/ui/PriceRangeSlider';
import BrandLogo from '@/components/ui/BrandLogo';
import { getProducts, getCategoryCounts } from '@/lib/productApi';
import { useDebounce } from '@/hooks/useDebounce';
import { Product } from '@/types';

interface ShopContentProps {
  initialSearch?: string;
  initialCategory?: string;
  initialBrand?: string;
}

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'popular';

const sortOptions: { key: SortKey; label: string }[] = [
  { key: 'featured', label: 'Featured' },
  { key: 'price-asc', label: 'Price: Low to High' },
  { key: 'price-desc', label: 'Price: High to Low' },
  { key: 'rating', label: 'Top Rated' },
  { key: 'popular', label: 'Most Popular' },
];

const MAX_PRICE = 2500;
const PAGE_SIZE = 12;

export default function ShopContent({ initialSearch = '', initialCategory = '', initialBrand = '' }: ShopContentProps) {
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>(initialBrand ? [initialBrand] : []);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, MAX_PRICE]);
  const [sort, setSort] = useState<SortKey>('featured');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [catalog, setCatalog] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [reloadKey, setReloadKey] = useState(0);

  const debouncedSearch = useDebounce(search, 500);
  const categoryKey = [...selectedCategories].sort().join(',');

  useEffect(() => {
    const controller = new AbortController();
    getCategoryCounts(controller.signal)
      .then(setCategoryCounts)
      .catch(() => {});
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      setLoading(true);
      setError(null);
      try {
        const response = await getProducts({
          search: debouncedSearch.trim() || undefined,
          categories: selectedCategories.length > 0 ? selectedCategories : undefined,
          signal: controller.signal,
        });
        if (!controller.signal.aborted) {
          setCatalog(response.products);
          setVisibleCount(PAGE_SIZE);
        }
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError('We couldn’t load products right now. Please try again.');
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadProducts();
    return () => controller.abort();
  }, [debouncedSearch, categoryKey, reloadKey]);

  const toggleCategory = (slug: string) =>
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug]
    );

  const toggleBrand = (name: string) =>
    setSelectedBrands((prev) =>
      prev.includes(name) ? prev.filter((b) => b !== name) : [...prev, name]
    );

  const clearAll = () => {
    setSearch('');
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange([0, MAX_PRICE]);
    setSort('featured');
  };

  const hasFilters =
    search.trim() !== '' || selectedCategories.length > 0 || selectedBrands.length > 0 || sort !== 'featured';

  const filtered = useMemo(() => {
    let list = catalog.filter((p) => {
      const price = p.discountPrice ?? p.price;
      if (selectedBrands.length > 0 && !selectedBrands.some((b) => b.toLowerCase() === p.brand.toLowerCase())) return false;
      if (price < priceRange[0] || price > priceRange[1]) return false;
      return true;
    });

    switch (sort) {
      case 'price-asc':
        list = [...list].sort((a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price));
        break;
      case 'price-desc':
        list = [...list].sort((a, b) => (b.discountPrice ?? a.price) - (a.discountPrice ?? a.price));
        break;
      case 'rating':
        list = [...list].sort((a, b) => b.rating - a.rating);
        break;
      case 'popular':
        list = [...list].sort((a, b) => b.sold - a.sold);
        break;
      default:
        break;
    }
    return list;
  }, [catalog, selectedBrands, priceRange, sort]);

  const visibleProducts = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;
  const brandWithNoProducts =
    selectedBrands.length > 0 &&
    selectedCategories.length === 0 &&
    filtered.length === 0 &&
    !loading;

  const Sidebar = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold text-slateText dark:text-white mb-3 flex items-center gap-2">
          <span className="w-1.5 h-5 bg-accent rounded-full inline-block" /> Categories
        </h3>
        <div className="space-y-2.5">
          {categories.map((cat) => (
            <label key={cat.slug} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat.slug)}
                onChange={() => toggleCategory(cat.slug)}
                className="w-4 h-4 rounded border-lineBorder text-primary focus:ring-primary/30 accent-primary"
              />
              <span className="text-sm text-slateText dark:text-white/85 group-hover:text-primary transition-colors">
                {cat.name}
              </span>
              <span className="ml-auto text-xs text-muted">
                {categoryCounts[cat.slug] ?? 0}
              </span>
            </label>
          ))}
        </div>
      </div>

      <hr className="border-lineBorder dark:border-navy-100" />

      <div>
        <h3 className="font-bold text-slateText dark:text-white mb-3 flex items-center gap-2">
          <span className="w-1.5 h-5 bg-accent rounded-full inline-block" /> Brands
        </h3>
        <div className="grid grid-cols-2 gap-2.5">
          {brands.map((brand) => (
            <button
              key={brand._id}
              type="button"
              onClick={() => toggleBrand(brand.name)}
              className={`group flex flex-col items-center justify-center gap-1.5 px-2 py-3 rounded-xl border transition-all duration-300 ${
                selectedBrands.includes(brand.name)
                  ? 'border-accent shadow-card bg-accent/5'
                  : 'border-lineBorder dark:border-navy-100 hover:border-accent/60 hover:shadow-card'
              }`}
            >
              <span className="transition-transform duration-300 group-hover:scale-110">
                <BrandLogo brand={brand} size={26} />
              </span>
              <span className="text-[11px] font-medium text-muted group-hover:text-accent dark:text-white/70 dark:group-hover:text-accent text-center leading-tight transition-colors">
                {brand.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      <hr className="border-lineBorder dark:border-navy-100" />

      <div>
        <h3 className="font-bold text-slateText dark:text-white mb-3 flex items-center gap-2">
          <span className="w-1.5 h-5 bg-accent rounded-full inline-block" /> Price Range
        </h3>
        <PriceRangeSlider min={0} max={MAX_PRICE} value={priceRange} onChange={setPriceRange} />
      </div>

      {(selectedCategories.length > 0 || selectedBrands.length > 0) && (
        <button onClick={clearAll} className="w-full text-center text-sm font-semibold text-red-500 hover:text-red-600 py-2 border border-lineBorder dark:border-navy-100 rounded-lg hover:bg-red-50 dark:hover:bg-navy-100 transition-colors">
          Clear All Filters
        </button>
      )}
    </div>
  );

  const EmptyState = ({ title, subtitle }: { title: string; subtitle: string }) => (
    <div className="rounded-2xl border border-lineBorder dark:border-navy-50 bg-white dark:bg-navy-200 p-12 text-center">
      <h3 className="text-xl font-bold text-slateText dark:text-white mb-2">{title}</h3>
      <p className="text-muted text-sm mb-4">{subtitle}</p>
      {filtered.length === 0 && hasFilters && (
        <button onClick={clearAll} className="btn-primary inline-flex">
          Clear Filters
        </button>
      )}
    </div>
  );

  return (
    <div>
      <div className="bg-navy dark:bg-navy-900 text-white">
        <div className="container-custom py-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-2">Home / Shop</p>
          <h1 className="text-3xl lg:text-4xl font-bold">Shop Products</h1>
          <p className="text-white/70 mt-1.5">
            {loading ? 'Loading products...' : `${filtered.length} ${filtered.length === 1 ? 'product' : 'products'} available`}
          </p>
        </div>
      </div>

      <div className="container-custom py-8 lg:py-12 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
        <aside className="hidden lg:block">
          <div className="sticky top-28 bg-white dark:bg-navy-200 border border-lineBorder dark:border-navy-50 rounded-2xl p-6">
            <Sidebar />
          </div>
        </aside>

        <div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
            <div className="relative flex-1">
              <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products, brands, categories..."
                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-navy-200 border border-lineBorder dark:border-navy-50 rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-red-500" aria-label="Clear search">
                  <HiOutlineX className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center justify-center gap-2 bg-navy dark:bg-navy-50 text-white px-4 py-3 rounded-xl text-sm font-semibold"
            >
              <HiOutlineAdjustments className="w-5 h-5" /> Filters
            </button>

            <div className="flex items-center gap-2">
              <span className="hidden sm:block text-sm text-muted">Sort by:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="bg-white dark:bg-navy-200 border border-lineBorder dark:border-navy-50 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-primary cursor-pointer"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.key} value={opt.key}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 flex items-center justify-between gap-4">
              <p className="text-sm text-red-600">{error}</p>
              <button
                onClick={() => {
                  setError(null);
                  setLoading(true);
                  setReloadKey((k) => k + 1);
                }}
                className="flex items-center gap-1.5 text-xs font-semibold text-red-600 border border-red-300 rounded-lg px-3 py-1.5 hover:bg-red-100 transition-colors"
              >
                <HiOutlineRefresh className="w-3.5 h-3.5" /> Retry
              </button>
            </div>
          )}

          {loading && catalog.length === 0 ? (
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="h-80 animate-pulse rounded-2xl bg-slate-200 dark:bg-navy-200" />
              ))}
            </div>
          ) : brandWithNoProducts ? (
            <EmptyState title="No products available for this brand." subtitle="The selected brand has no matching products in the current catalogue." />
          ) : !loading && filtered.length === 0 ? (
            <EmptyState title="No products match your filters" subtitle="Try a different search or clear your current filters." />
          ) : (
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {visibleProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {hasFilters && (
            <div className="flex flex-wrap items-center gap-2 mb-6 mt-6">
              {search && (
                <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full">
                  “{search}”
                  <button onClick={() => setSearch('')} aria-label="Remove search">
                    <HiOutlineX className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}
              {selectedCategories.length > 0 && (
                <span className="inline-flex items-center gap-1.5 bg-accent/10 text-accent-dark dark:text-accent text-xs font-semibold px-3 py-1.5 rounded-full">
                  {selectedCategories.length} categor{selectedCategories.length === 1 ? 'y' : 'ies'}
                  <button onClick={() => setSelectedCategories([])} aria-label="Clear categories">
                    <HiOutlineX className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}
              {selectedBrands.length > 0 && (
                <span className="inline-flex items-center gap-1.5 bg-success/10 text-success text-xs font-semibold px-3 py-1.5 rounded-full">
                  {selectedBrands.length} brand{selectedBrands.length === 1 ? '' : 's'}
                  <button onClick={() => setSelectedBrands([])} aria-label="Clear brands">
                    <HiOutlineX className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}
              {(priceRange[0] > 0 || priceRange[1] < MAX_PRICE) && (
                <span className="inline-flex items-center gap-1.5 bg-navy/10 dark:bg-white/10 text-navy dark:text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                  ${priceRange[0]} – ${priceRange[1]}
                  <button onClick={() => setPriceRange([0, MAX_PRICE])} aria-label="Clear price">
                    <HiOutlineX className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}
              <button onClick={clearAll} className="text-xs font-semibold text-red-500 hover:underline">
                Clear all
              </button>
            </div>
          )}

          {filtered.length > 0 ? (
            <div>
              <p className="text-sm text-muted mb-4">
                Showing <span className="font-semibold text-slateText dark:text-white">{Math.min(visibleCount, filtered.length)}</span> of{' '}
                <span className="font-semibold text-slateText dark:text-white">{filtered.length}</span> products
              </p>
              {hasMore && (
                <div className="text-center mt-8">
                  <button
                    onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                    className="inline-flex items-center gap-2 bg-navy dark:bg-navy-50 text-white hover:bg-primary px-7 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Load More Products
                  </button>
                </div>
              )}
            </div>
          ) : (
            !loading && (
              <div className="text-center py-24 bg-white dark:bg-navy-200 border border-lineBorder dark:border-navy-50 rounded-2xl">
                <p className="mb-4"><HiOutlineSearch className="w-16 h-16 inline-block text-muted/50" /></p>
                <h3 className="text-xl font-bold text-slateText dark:text-white mb-2">No Product Available</h3>
                <p className="text-muted text-sm">
                  We&apos;re sorry, but there are no products matching your criteria at the moment.
                </p>
                <button onClick={clearAll} className="btn-primary mt-6">
                  Clear All Filters
                </button>
              </div>
            )
          )}
        </div>
      </div>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white dark:bg-navy-200 overflow-y-auto p-6 animate-zoom-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg text-slateText dark:text-white">Filters</h3>
              <button onClick={() => setMobileFiltersOpen(false)} className="p-2 text-muted hover:text-navy dark:hover:text-white" aria-label="Close filters">
                <HiOutlineX className="w-5 h-5" />
              </button>
            </div>
            <Sidebar />
            <button onClick={() => setMobileFiltersOpen(false)} className="btn-primary w-full mt-6">
              Show {filtered.length} Products
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
