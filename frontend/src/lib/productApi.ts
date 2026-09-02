import { Product } from '@/types';
import {
  PRODUCTS_API_URL,
  PRODUCTS_CACHE_SECONDS,
  PRODUCT_CATEGORIES,
  PRODUCT_CATEGORY_SLUGS,
} from '@/lib/products/config';

// Re-exported for components that referenced the category list for the sidebar.
export const ELECTRONIC_CATEGORIES = PRODUCT_CATEGORIES;
export const ELECTRONIC_CATEGORY_SLUGS: string[] = PRODUCT_CATEGORY_SLUGS;

/**
 * DummyJSON product shape. Only the fields the storefront needs are retained.
 * This is the contract for the live product API; new suppliers should map to
 * this same shape via `mapProduct`.
 */
export interface ApiProduct {
  id: number | string;
  title: string;
  description: string;
  price: number;
  discountPercentage?: number;
  category: string;
  brand?: string;
  rating?: number;
  stock?: number;
  tags?: string[];
  images?: string[];
  thumbnail?: string;
  availabilityStatus?: string;
  meta?: { createdAt?: string; updatedAt?: string };
  reviews?: unknown[];
  returnPolicy?: string;
  warrantyInformation?: string;
  shippingInformation?: string;
  sku?: string;
}

interface ApiListResponse {
  products?: ApiProduct[];
  total?: number;
  skip?: number;
  limit?: number;
}

export interface ProductQuery {
  categories?: string[];
  search?: string;
  sort?: 'price-asc' | 'price-desc' | 'rating' | 'popular' | 'featured';
  limit?: number;
  signal?: AbortSignal;
}

export interface ProductListResult {
  products: Product[];
  total: number;
}

const SELECT_FIELDS = [
  'id',
  'title',
  'description',
  'price',
  'discountPercentage',
  'category',
  'brand',
  'rating',
  'stock',
  'availabilityStatus',
  'tags',
  'images',
  'thumbnail',
  'meta',
  'reviews',
  'returnPolicy',
  'warrantyInformation',
  'shippingInformation',
  'sku',
].join(',');

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .replace(/["'“”]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export function toProductSlug(p: { id: number | string; title: string }): string {
  return `${p.id}-${slugify(p.title)}`;
}

export function getProductIdFromSlug(slug: string): string | null {
  const match = slug.match(/^(\d+)/);
  return match ? match[1] : null;
}

const pseudoSold = (id: number | string): number => {
  const n = typeof id === 'number' ? id : parseInt(id, 10) || 0;
  return ((n * 2654435761) % 997) + 1;
};

const numReviews = (raw: ApiProduct): number => {
  const reviews = raw.reviews?.length ?? 0;
  return reviews > 0 ? reviews : Math.max(1, Math.round((raw.rating ?? 0) * 20));
};

/** Map a live API product to the storefront Product model. No invented data. */
function mapProduct(raw: ApiProduct): Product {
  const price = Number(raw.price) || 0;
  const discountRatio = raw.discountPercentage != null ? raw.discountPercentage / 100 : 0;
  const discountPrice =
    discountRatio > 0 && discountRatio < 1
      ? Math.round(price * (1 - discountRatio) * 100) / 100
      : undefined;

  return {
    _id: String(raw.id),
    name: raw.title,
    slug: toProductSlug(raw),
    description: raw.description || '',
    price,
    discountPrice,
    categorySlug: raw.category,
    category: raw.category.replace(/-/g, ' '),
    brand: raw.brand || 'Unknown',
    image: raw.thumbnail || raw.images?.[0] || '',
    images: raw.images?.length ? raw.images : raw.thumbnail ? [raw.thumbnail] : [],
    rating: Number(raw.rating ?? 0),
    numReviews: numReviews(raw),
    stock: Number(raw.stock ?? 0),
    sold: pseudoSold(raw.id),
    isFeatured: false,
    isNew: raw.meta?.createdAt
      ? Date.now() - new Date(raw.meta.createdAt).getTime() < 60 * 24 * 60 * 60 * 1000
      : false,
    onSale: discountPrice != null,
    tags: raw.tags ?? [],
    createdAt: raw.meta?.createdAt ?? new Date().toISOString(),
    warranty: raw.warrantyInformation,
    returnPolicy: raw.returnPolicy,
    shippingInformation: raw.shippingInformation,
  };
}

const buildFetchUrl = (path: string, params: Record<string, string | number | undefined>): string => {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) qs.set(key, String(value));
  });
  return `${PRODUCTS_API_URL}${path}?${qs.toString()}`;
};

async function apiGet<T>(path: string, params: Record<string, string | number | undefined>, signal?: AbortSignal): Promise<T> {
  const url = buildFetchUrl(path, params);
  const res = await fetch(url, {
    signal,
    next: { revalidate: PRODUCTS_CACHE_SECONDS },
  });
  if (!res.ok) throw new Error(`Product API error: ${res.status}`);
  return (await res.json()) as T;
}

/**
 * Search the live API. DummyJSON's /search spans the whole catalogue, so results
 * are narrowed to the electronics categories it exposes.
 */
export async function searchProducts(
  q: string,
  opts: { signal?: AbortSignal; limit?: number } = {}
): Promise<ProductListResult> {
  const data = await apiGet<ApiListResponse>(
    '/products/search',
    { q, limit: opts.limit ?? 100, select: SELECT_FIELDS },
    opts.signal
  );
  const items = (data.products ?? []).filter((p) => PRODUCT_CATEGORY_SLUGS.includes(p.category));
  return { products: items.map(mapProduct), total: items.length };
}

/** Fetch a single API category. */
export async function getProductsByCategory(
  category: string,
  opts: { signal?: AbortSignal; limit?: number } = {}
): Promise<ProductListResult> {
  const data = await apiGet<ApiListResponse>(
    `/products/category/${encodeURIComponent(category)}`,
    { limit: opts.limit ?? 100, select: SELECT_FIELDS },
    opts.signal
  );
  const items = data.products ?? [];
  return { products: items.map(mapProduct), total: data.total ?? items.length };
}

/**
 * Fetch products filtered by brand. DummyJSON exposes no brand endpoint, so this
 * fetches the electronics catalogue (already category-scoped, not the entire
 * store) and filters by the brand name. Returns an empty result when no real API
 * product carries that brand.
 */
export async function getProductsByBrand(
  brand: string,
  opts: { signal?: AbortSignal; limit?: number } = {}
): Promise<ProductListResult> {
  const res = await getProducts({ signal: opts.signal });
  const target = brand.trim().toLowerCase();
  const products = res.products.filter((p) => p.brand.toLowerCase() === target);
  const sliced = opts.limit ? products.slice(0, opts.limit) : products;
  return { products: sliced, total: products.length };
}


/**
 * Fetch products across the given categories (defaults to all electronics).
 * DummyJSON's electronics catalogue is small, so we fan out over categories and
 * merge; everything still comes live from the API.
 */
export async function getProducts(
  query: ProductQuery = {}
): Promise<ProductListResult> {
  const { signal } = query;
  let items: Product[] = [];

  if (query.search) {
    items = (await searchProducts(query.search, { signal })).products;
  } else if (query.categories && query.categories.length === 1) {
    items = (await getProductsByCategory(query.categories[0], { limit: 100, signal })).products;
  } else {
    const categories =
      query.categories && query.categories.length > 0
        ? query.categories
        : [...PRODUCT_CATEGORY_SLUGS];
    const results = await Promise.all(
      categories.map((cat) => getProductsByCategory(cat, { limit: 100, signal }))
    );
    items = results.flatMap((r) => r.products);
  }

  // De-duplicate by id (products can appear across overlapping categories/searches).
  const seen = new Set<string>();
  const products = items.filter((p) => {
    if (seen.has(p._id)) return false;
    seen.add(p._id);
    return true;
  });

  applySort(products, query.sort);
  return { products, total: products.length };
}

function applySort(products: Product[], sort?: ProductQuery['sort']) {
  switch (sort) {
    case 'price-asc':
      products.sort((a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price));
      break;
    case 'price-desc':
      products.sort((a, b) => (b.discountPrice ?? a.price) - (a.discountPrice ?? a.price));
      break;
    case 'rating':
      products.sort((a, b) => b.rating - a.rating);
      break;
    case 'popular':
      products.sort((a, b) => b.sold - a.sold);
      break;
    default:
      break;
  }
}

/** Backward-compatible alias for getProducts. */
export function getElectronicsProducts(query: ProductQuery = {}): Promise<ProductListResult> {
  return getProducts(query);
}

/** Fetch a single product from the live API by its numeric API id. */
export async function getProductById(id: string, signal?: AbortSignal): Promise<Product | null> {
  if (!id) return null;
  try {
    const raw = await apiGet<ApiProduct>(`/products/${encodeURIComponent(id)}`, { select: SELECT_FIELDS }, signal);
    return mapProduct(raw);
  } catch {
    return null;
  }
}

/** Resolve a storefront slug (prefixed with the API id) back to a live product. */
export async function getProductBySlug(slug: string, signal?: AbortSignal): Promise<Product | null> {
  const id = getProductIdFromSlug(slug);
  if (!id) return null;
  return getProductById(id, signal);
}

/** Related products come from the same API category, excluding the current one. */
export async function getRelatedProducts(
  product: Product,
  limit = 4,
  signal?: AbortSignal
): Promise<Product[]> {
  if (!product.categorySlug) return [];
  try {
    const res = await getProductsByCategory(product.categorySlug, { signal, limit: 100 });
    return res.products.filter((p) => p._id !== product._id).slice(0, limit);
  } catch {
    return [];
  }
}

/** Live per-category product counts derived from the API. */
export async function getCategoryCounts(signal?: AbortSignal): Promise<Record<string, number>> {
  const entries = await Promise.all(
    PRODUCT_CATEGORY_SLUGS.map(async (slug) => {
      try {
        const res = await getProductsByCategory(slug, { signal });
        return [slug, res.total] as const;
      } catch {
        return [slug, 0] as const;
      }
    })
  );
  return Object.fromEntries(entries);
}
