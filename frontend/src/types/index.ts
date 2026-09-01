import type { IconType } from 'react-icons';

export interface Category {
  _id: string;
  name: string;
  slug: string;
  icon: IconType;
  pastel: string;
  count: number;
}

export interface Brand {
  _id: string;
  name: string;
  initials: string;
  color: string;
  logo?: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  categorySlug: string;
  category: string;
  brand: string;
  image: string;
  rating: number;
  numReviews: number;
  stock: number;
  sold: number;
  isFeatured: boolean;
  isNew: boolean;
  onSale: boolean;
  tags: string[];
  createdAt: string;
  images?: string[];
  warranty?: string;
  returnPolicy?: string;
  shippingInformation?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderData {
  orderId: string;
  customer: {
    fullName: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  items: { name: string; image: string; price: number; quantity: number }[];
  subtotal: number;
  shippingCost: number;
  total: number;
  createdAt: string;
}