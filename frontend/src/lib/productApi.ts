import { Product } from '@/types';

const PRODUCTS_API = process.env.NEXT_PUBLIC_PRODUCTS_API_URL || process.env.NEXT_PUBLIC_PRODUCTS_API || 'https://dummyjson.com';

// Electronics-focused DummyJSON categories. Kept in a stable order for the storefront sidebar.
export const ELECTRONIC_CATEGORIES = [
  { slug: 'smartphones', name: 'Smartphones' },
  { slug: 'laptops', name: 'Laptops' },
  { slug: 'tablets', name: 'Tablets' },
  { slug: 'mobile-accessories', name: 'Audio & Accessories' },
  { slug: 'mens-watches', name: 'Smartwatches' },
  { slug: 'womens-watches', name: 'Watches' },
] as const;

export const ELECTRONIC_CATEGORY_SLUGS: string[] = ELECTRONIC_CATEGORIES.map((c) => c.slug);

interface DummyJSONProduct {
  id: number;
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
  meta?: { createdAt?: string };
  reviews?: unknown[];
  returnPolicy?: string;
  warrantyInformation?: string;
  shippingInformation?: string;
  sku?: string;
}

interface DummyJSONResponse {
  products?: DummyJSONProduct[];
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

const pseudoSold = (id: number): number => ((id * 2654435761) % 997) + 1;

const numReviews = (raw: DummyJSONProduct): number => {
  const reviews = raw.reviews?.length ?? 0;
  return reviews > 0 ? reviews : Math.max(1, Math.round((raw.rating ?? 0) * 20));
};

function mapProduct(raw: DummyJSONProduct): Product {
  const price = Number(raw.price) || 0;
  const discountRatio = raw.discountPercentage != null ? raw.discountPercentage / 100 : 0;
  const discountPrice =
    discountRatio > 0 && discountRatio < 1 ? Math.round(price * (1 - discountRatio) * 100) / 100 : undefined;
  const rating = Number(raw.rating ?? 0);
  const stock = Number(raw.stock ?? 0);

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
    rating,
    numReviews: numReviews(raw),
    stock,
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
  return `${PRODUCTS_API}${path}?${qs.toString()}`;
};

async function fetchCategory(
  category: string,
  signal?: AbortSignal
): Promise<{ items: DummyJSONProduct[]; total: number }> {
  const url = buildFetchUrl(`/products/category/${encodeURIComponent(category)}`, {
    limit: 100,
    select: 'id,title,description,price,discountPercentage,category,brand,rating,stock,tags,images,thumbnail,meta,reviews',
  });
  const res = await fetch(url, { signal, cache: 'no-store' });
  if (!res.ok) throw new Error(`Product API error: ${res.status}`);
  const data = (await res.json()) as DummyJSONResponse;
  return { items: data.products ?? [], total: data.total ?? 0 };
}

async function fetchSearch(
  q: string,
  signal?: AbortSignal
): Promise<{ items: DummyJSONProduct[]; total: number }> {
  const url = buildFetchUrl('/products/search', {
    q,
    limit: 100,
    select: 'id,title,description,price,discountPercentage,category,brand,rating,stock,tags,images,thumbnail,meta,reviews',
  });
  const res = await fetch(url, { signal, cache: 'no-store' });
  if (!res.ok) throw new Error(`Product API error: ${res.status}`);
  const data = (await res.json()) as DummyJSONResponse;
  return { items: data.products ?? [], total: data.total ?? 0 };
}

/**
 * Fetch the full electronics catalogue. DummyJSON's electronics catalogue is small
 * (~50 products), so we fan out across the preferred category endpoints and merge
 * the results. Everything is driven by the API; no hardcoded products here.
 */
export async function getElectronicsProducts(query: ProductQuery = {}): Promise<ProductListResult> {
  const { signal } = query;
  let items: DummyJSONProduct[];
  let total: number;

  if (query.search) {
    const result = await fetchSearch(query.search, signal);
    items = result.items;
    total = result.total;
    // Narrow search results down to electronics categories when a search term is used.
    const electronics = items.filter((p) => ELECTRONIC_CATEGORY_SLUGS.includes(p.category));
    if (electronics.length > 0) {
      items = electronics;
      total = electronics.length;
    }
  } else if (query.categories && query.categories.length === 1) {
    const result = await fetchCategory(query.categories[0], signal);
    items = result.items;
    total = result.total;
  } else {
    const categories = query.categories && query.categories.length > 0
      ? query.categories
      : ELECTRONIC_CATEGORY_SLUGS;
    const results = await Promise.all(categories.map((cat) => fetchCategory(cat, signal)));
    items = results.flatMap((r) => r.items);
    total = items.length;
  }

  // De-duplicate by id (a product can appear in overlapping searches/categories).
  const seen = new Set<string>();
  items = items.filter((p) => {
    if (seen.has(String(p.id))) return false;
    seen.add(String(p.id));
    return true;
  });

  const products = items.map(mapProduct);

  switch (query.sort) {
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

  return { products, total: products.length };
}

export async function getProductById(id: string, signal?: AbortSignal): Promise<Product | null> {
  const url = `${PRODUCTS_API}/products/${encodeURIComponent(id)}`;
  try {
    const res = await fetch(url, { signal, cache: 'no-store' });
    if (!res.ok) return null;
    const raw = (await res.json()) as DummyJSONProduct;
    return mapProduct(raw);
  } catch {
    return null;
  }
}

export async function getProductBySlug(slug: string, signal?: AbortSignal): Promise<Product | null> {
  const id = getProductIdFromSlug(slug);
  if (!id) return null;
  return getProductById(id, signal);
}

export async function getRelatedProducts(
  product: Product,
  limit = 4,
  signal?: AbortSignal
): Promise<Product[]> {
  if (!product.categorySlug) return [];
  try {
    const res = await getElectronicsProducts({ categories: [product.categorySlug], signal });
    return res.products.filter((p) => p._id !== product._id).slice(0, limit);
  } catch {
    return [];
  }
}

export async function getCategoryCounts(signal?: AbortSignal): Promise<Record<string, number>> {
  const entries = await Promise.all(
    ELECTRONIC_CATEGORY_SLUGS.map(async (slug) => {
      try {
        const res = await getElectronicsProducts({ categories: [slug], signal });
        return [slug, res.total] as const;
      } catch {
        return [slug, 0] as const;
      }
    })
  );
  return Object.fromEntries(entries);
}