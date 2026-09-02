import { Brand } from '@/types';

/**
 * Storefront brand directory. These exactly seven brands are always shown as
 * navigation entry points. Clicking a brand filters the catalogue by that brand
 * name against the live API data — a brand with no matching API products simply
 * shows "No products available for this brand." Brand data is never invented.
 */
export const brands: Brand[] = [
  {
    _id: 'brand-hitech',
    name: 'Hi-Tech',
    initials: 'HT',
    color: '#0066CC',
    logo: 'https://cdn.simpleicons.org/hitech/0066CC',
  },
  {
    _id: 'brand-hp',
    name: 'HP',
    initials: 'HP',
    color: '#0096D6',
    logo: 'https://cdn.simpleicons.org/hp/0096D6',
  },
  {
    _id: 'brand-atech',
    name: 'ATECH',
    initials: 'AT',
    color: '#FF6B00',
    logo: 'https://cdn.simpleicons.org/a4tech/FF6B00',
  },
  {
    _id: 'brand-hitachi',
    name: 'HITACHI',
    initials: 'HI',
    color: '#E60012',
    logo: 'https://cdn.simpleicons.org/hitachi/E60012',
  },
  {
    _id: 'brand-huawei',
    name: 'HUAWEI',
    initials: 'HW',
    color: '#C7000B',
    logo: 'https://cdn.simpleicons.org/huawei/C7000B',
  },
  {
    _id: 'brand-ikea',
    name: 'IKEA',
    initials: 'IK',
    color: '#0058A3',
    logo: 'https://cdn.simpleicons.org/ikea/0058A3',
  },
  {
    _id: 'brand-sony',
    name: 'SONY',
    initials: 'SY',
    color: '#1E293B',
    logo: 'https://cdn.simpleicons.org/sony/1E293B',
  },
];

export function getBrandByName(name: string): Brand | undefined {
  return brands.find((b) => b.name === name);
}

export function getBrandInitials(name: string): string {
  return getBrandByName(name)?.initials ?? name.slice(0, 2).toUpperCase();
}
