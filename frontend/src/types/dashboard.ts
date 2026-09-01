export interface DashboardUser {
  _id: string;
  username: string;
  email: string;
  role: 'customer' | 'admin';
  avatar?: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
}

export interface DashboardProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: DashboardCategory | string;
  brand: string;
  images: string[];
  specifications: { key: string; value: string }[];
  stock: number;
  sold: number;
  isFeatured: boolean;
  isActive: boolean;
  tags: string[];
  ratings: number;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardReview {
  _id: string;
  user: { _id: string; username: string; avatar?: string };
  product: string;
  rating: number;
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
}

export interface DashboardOrderItem {
  product: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface DashboardOrder {
  _id: string;
  user: { _id: string; username: string; email: string } | string;
  items: DashboardOrderItem[];
  shippingAddress: {
    street?: string;
    address?: string;
    city: string;
    state: string;
    country: string;
    zip?: string;
    postalCode?: string;
  };
  paymentMethod: string;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  deliveredAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  pendingOrders: number;
  deliveredOrders: number;
}

export interface SalesChartData {
  _id: string;
  totalSales: number;
  count: number;
}

export interface PaginatedResponse<T> {
  data: {
    products?: T[];
    orders?: T[];
    users?: T[];
    page: number;
    pages: number;
    total: number;
  };
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'refunded';
