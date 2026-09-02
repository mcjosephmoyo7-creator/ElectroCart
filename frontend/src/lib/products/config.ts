/**
 * Centralized product catalogue configuration.
 *
 * The catalogue is fetched live from a product API (DummyJSON for development
 * and testing). For a real commercial store, point NEXT_PUBLIC_PRODUCTS_API_URL
 * at a supplier/marketplace API whose terms allow commercial product, image and
 * price display. Never hardcode product data in the frontend — the API is the
 * source of truth.
 */
export const PRODUCTS_API_URL =
  process.env.NEXT_PUBLIC_PRODUCTS_API_URL ||
  process.env.NEXT_PUBLIC_PRODUCTS_API ||
  'https://dummyjson.com';

/** Identifier used to distinguish this product feed (dev/test vs production). */
export const PRODUCTS_API_PROVIDER = 'dummyjson';

/** Re-fetch products at most once per this window (seconds). Set to 0 to disable. */
export const PRODUCTS_CACHE_SECONDS = 60;

/**
 * Electronics categories exposed by the DummyJSON API (its catalogue only
 * contains these electronics categories). Kept stable for the storefront
 * sidebar. This list is derived from the live API provider's categories.
 */
export const PRODUCT_CATEGORIES = [
  { slug: 'smartphones', name: 'Smartphones' },
  { slug: 'laptops', name: 'Laptops' },
  { slug: 'tablets', name: 'Tablets' },
  { slug: 'mobile-accessories', name: 'Audio & Accessories' },
  { slug: 'mens-watches', name: 'Men\'s Watches' },
  { slug: 'womens-watches', name: 'Women\'s Watches' },
] as const;

export const PRODUCT_CATEGORY_SLUGS: string[] = PRODUCT_CATEGORIES.map((c) => c.slug);
