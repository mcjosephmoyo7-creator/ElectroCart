import type { IconType } from 'react-icons';
import { FaHeadphones, FaUtensils, FaTv, FaSnowflake, FaTshirt, FaTabletAlt } from 'react-icons/fa';
import { Category } from '@/types';

export const categories: Category[] = [
  {
    _id: 'cat-gadget',
    name: 'Gadget Accessories',
    slug: 'gadget-accessories',
    icon: FaHeadphones,
    pastel: '#DBEAFE',
    count: 12,
  },
  {
    _id: 'cat-kitchen',
    name: 'Kitchen Appliances',
    slug: 'kitchen-appliances',
    icon: FaUtensils,
    pastel: '#FEE2E2',
    count: 7,
  },
  {
    _id: 'cat-tv',
    name: 'Television',
    slug: 'television',
    icon: FaTv,
    pastel: '#FCE7F3',
    count: 6,
  },
  {
    _id: 'cat-fridge',
    name: 'Refrigerators',
    slug: 'refrigerators',
    icon: FaSnowflake,
    pastel: '#E0F2FE',
    count: 5,
  },
  {
    _id: 'cat-washing',
    name: 'Washing Machine',
    slug: 'washing-machine',
    icon: FaTshirt,
    pastel: '#DCFCE7',
    count: 5,
  },
  {
    _id: 'cat-tablets',
    name: 'Tablets',
    slug: 'tablets',
    icon: FaTabletAlt,
    pastel: '#EDE9FE',
    count: 5,
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export type { IconType };