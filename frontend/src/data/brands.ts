import { Brand } from '@/types';

export const brands: Brand[] = [
  {
    _id: 'brand-hitech',
    name: 'Hi-Tech Limited',
    initials: 'HT',
    color: '#0066CC',
    logo: 'https://cdn.simpleicons.org/hitech/0066CC',
  },
  {
    _id: 'brand-hp',
    name: 'HP Limited',
    initials: 'HP',
    color: '#0096D6',
    logo: 'https://cdn.simpleicons.org/hp/0096D6',
  },
  {
    _id: 'brand-apple',
    name: 'The Apple Limited',
    initials: 'AP',
    color: '#333333',
    logo: 'https://cdn.simpleicons.org/apple/333333',
  },
  {
    _id: 'brand-a4',
    name: 'A4 Tech',
    initials: 'A4',
    color: '#FF6B00',
    logo: 'https://cdn.simpleicons.org/a4tech/FF6B00',
  },
  {
    _id: 'brand-hitachi',
    name: 'The Hitachi Limited',
    initials: 'HI',
    color: '#E60012',
    logo: 'https://cdn.simpleicons.org/hitachi/E60012',
  },
  {
    _id: 'brand-huawei',
    name: 'Huawei Company',
    initials: 'HW',
    color: '#C7000B',
    logo: 'https://cdn.simpleicons.org/huawei/C7000B',
  },
  {
    _id: 'brand-ikea',
    name: 'IKEA Limited',
    initials: 'IK',
    color: '#0058A3',
    logo: 'https://cdn.simpleicons.org/ikea/0058A3',
  },
  {
    _id: 'brand-sony',
    name: 'Sony Limited',
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
