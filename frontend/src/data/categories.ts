import type { IconType } from 'react-icons';
import { FaMobileAlt, FaLaptop, FaTabletAlt, FaHeadphones, FaClock, FaRegClock } from 'react-icons/fa';
import { Category } from '@/types';

/**
 * Electronics categories exposed by the live product API (DummyJSON). The
 * sidebar and navigation are driven by these API categories so that filtering
 * against the catalogue returns real results. `count` is a live-fetched value;
 * `getCategoryCounts()` in the product API layer supplies the current total.
 */
export const categories: Category[] = [
  {
    _id: 'cat-smartphones',
    name: 'Smartphones',
    slug: 'smartphones',
    icon: FaMobileAlt,
    pastel: '#DBEAFE',
    count: 0,
  },
  {
    _id: 'cat-laptops',
    name: 'Laptops',
    slug: 'laptops',
    icon: FaLaptop,
    pastel: '#FEE2E2',
    count: 0,
  },
  {
    _id: 'cat-tablets',
    name: 'Tablets',
    slug: 'tablets',
    icon: FaTabletAlt,
    pastel: '#EDE9FE',
    count: 0,
  },
  {
    _id: 'cat-audio',
    name: 'Audio & Accessories',
    slug: 'mobile-accessories',
    icon: FaHeadphones,
    pastel: '#FCE7F3',
    count: 0,
  },
  {
    _id: 'cat-mens-watches',
    name: "Men's Watches",
    slug: 'mens-watches',
    icon: FaClock,
    pastel: '#E0F2FE',
    count: 0,
  },
  {
    _id: 'cat-womens-watches',
    name: "Women's Watches",
    slug: 'womens-watches',
    icon: FaRegClock,
    pastel: '#DCFCE7',
    count: 0,
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export type { IconType };
