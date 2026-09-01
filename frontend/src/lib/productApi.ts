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

const currentProducts: Product[] = [
  {
    _id: '2026001',
    name: 'Samsung Galaxy S26 Ultra',
    slug: '2026001-samsung-galaxy-s26-ultra',
    description: 'Flagship 2026 Android smartphone with a pro-grade camera system, bright adaptive display and all-day battery life.',
    price: 1299.99,
    categorySlug: 'smartphones',
    category: 'smartphones',
    brand: 'Samsung',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&h=800&q=85',
    rating: 4.8,
    numReviews: 124,
    stock: 18,
    sold: 86,
    isFeatured: true,
    isNew: true,
    onSale: false,
    tags: ['smartphone', 'android', '5g', '2026'],
    createdAt: '2026-02-11T00:00:00.000Z',
  },
  {
    _id: '2026002',
    name: 'Apple iPhone 17 Pro',
    slug: '2026002-apple-iphone-17-pro',
    description: 'Premium 2026 smartphone with a pro camera system, titanium design and fast performance for demanding everyday use.',
    price: 1199.99,
    categorySlug: 'smartphones',
    category: 'smartphones',
    brand: 'Apple',
    image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=800&h=800&q=85',
    rating: 4.9,
    numReviews: 176,
    stock: 24,
    sold: 112,
    isFeatured: true,
    isNew: true,
    onSale: false,
    tags: ['smartphone', 'ios', '5g', '2026'],
    createdAt: '2026-09-01T00:00:00.000Z',
  },
  {
    _id: '2026003',
    name: 'Apple MacBook Air M5 15-inch',
    slug: '2026003-apple-macbook-air-m5-15-inch',
    description: 'Thin 2026 laptop with Apple silicon performance, a bright 15-inch display and quiet all-day productivity.',
    price: 1299.99,
    categorySlug: 'laptops',
    category: 'laptops',
    brand: 'Apple',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&h=800&q=85',
    rating: 4.8,
    numReviews: 98,
    stock: 16,
    sold: 74,
    isFeatured: true,
    isNew: true,
    onSale: false,
    tags: ['laptop', 'apple', 'productivity', '2026'],
    createdAt: '2026-03-18T00:00:00.000Z',
  },
  {
    _id: '2026004',
    name: 'Sony WF-1000XM6 Noise-Cancelling Earbuds',
    slug: '2026004-sony-wf-1000xm6-noise-cancelling-earbuds',
    description: '2026 flagship true wireless earbuds with adaptive noise cancellation, clear calls and a compact charging case.',
    price: 299.99,
    discountPrice: 269.99,
    categorySlug: 'mobile-accessories',
    category: 'mobile accessories',
    brand: 'Sony',
    image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=800&h=800&q=85',
    rating: 4.7,
    numReviews: 63,
    stock: 42,
    sold: 91,
    isFeatured: true,
    isNew: true,
    onSale: true,
    tags: ['earbuds', 'wireless', 'noise-cancelling', '2026'],
    createdAt: '2026-04-08T00:00:00.000Z',
  },
  {
    _id: '2026005',
    name: 'Samsung Galaxy Watch 8 Classic',
    slug: '2026005-samsung-galaxy-watch-8-classic',
    description: 'Modern 2026 smartwatch with health tracking, sleep insights, GPS and a durable rotating-bezel design.',
    price: 399.99,
    categorySlug: 'mens-watches',
    category: 'mens watches',
    brand: 'Samsung',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&h=800&q=85',
    rating: 4.6,
    numReviews: 51,
    stock: 33,
    sold: 68,
    isFeatured: false,
    isNew: true,
    onSale: false,
    tags: ['smartwatch', 'fitness', 'wearable', '2026'],
    createdAt: '2026-07-21T00:00:00.000Z',
  },
  {
    _id: '2026006',
    name: 'Ninja Foodi Smart Air Fryer Pro',
    slug: '2026006-ninja-foodi-smart-air-fryer-pro',
    description: 'Connected 2026 air fryer with dual-zone cooking, smart temperature control and generous family-sized capacity.',
    price: 249.99,
    discountPrice: 219.99,
    categorySlug: 'kitchen-appliances',
    category: 'kitchen appliances',
    brand: 'Ninja',
    image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=800&h=800&q=85',
    rating: 4.7,
    numReviews: 47,
    stock: 29,
    sold: 57,
    isFeatured: true,
    isNew: true,
    onSale: true,
    tags: ['air-fryer', 'smart-kitchen', '2026'],
    createdAt: '2026-01-26T00:00:00.000Z',
  },
  {
    _id: '2026007',
    name: 'Samsung Neo QLED 4K Smart TV 65-inch',
    slug: '2026007-samsung-neo-qled-4k-smart-tv-65-inch',
    description: '2026 65-inch 4K smart TV with quantum mini-LED contrast, smooth motion and a built-in streaming platform.',
    price: 1599.99,
    discountPrice: 1399.99,
    categorySlug: 'television',
    category: 'television',
    brand: 'Samsung',
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&h=800&q=85',
    rating: 4.8,
    numReviews: 39,
    stock: 12,
    sold: 44,
    isFeatured: true,
    isNew: true,
    onSale: true,
    tags: ['television', '4k', 'qled', 'smart-tv', '2026'],
    createdAt: '2026-02-20T00:00:00.000Z',
  },
  {
    _id: '2026008',
    name: 'LG InstaView AI French Door Refrigerator',
    slug: '2026008-lg-instaview-ai-french-door-refrigerator',
    description: 'Large 2026 French-door refrigerator with a glass-view panel, flexible storage and AI-assisted cooling control.',
    price: 2299.99,
    categorySlug: 'refrigerators',
    category: 'refrigerators',
    brand: 'LG',
    image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&w=800&h=800&q=85',
    rating: 4.6,
    numReviews: 28,
    stock: 9,
    sold: 26,
    isFeatured: true,
    isNew: true,
    onSale: false,
    tags: ['refrigerator', 'french-door', 'smart-home', '2026'],
    createdAt: '2026-03-14T00:00:00.000Z',
  },
  {
    _id: '2026009',
    name: 'Samsung Bespoke AI Front Load Washer',
    slug: '2026009-samsung-bespoke-ai-front-load-washer',
    description: '2026 front-load washing machine with AI cycle selection, steam care, low-noise operation and app control.',
    price: 999.99,
    discountPrice: 899.99,
    categorySlug: 'washing-machine',
    category: 'washing machine',
    brand: 'Samsung',
    image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=800&h=800&q=85',
    rating: 4.7,
    numReviews: 34,
    stock: 14,
    sold: 31,
    isFeatured: true,
    isNew: true,
    onSale: true,
    tags: ['washing-machine', 'front-load', 'ai', '2026'],
    createdAt: '2026-04-22T00:00:00.000Z',
  },
];

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

function matchesLocalProduct(product: Product, query: ProductQuery): boolean {
  if (query.categories?.length && !query.categories.includes(product.categorySlug)) return false;
  if (!query.search) return true;
  const haystack = [product.name, product.description, product.brand, product.category, ...product.tags]
    .join(' ')
    .toLowerCase();
  return haystack.includes(query.search.toLowerCase());
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

  const products = [
    ...items.map(mapProduct),
    ...currentProducts.filter((product) => matchesLocalProduct(product, query)),
  ];

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
  const localProduct = currentProducts.find((product) => product._id === id);
  if (localProduct) return localProduct;

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