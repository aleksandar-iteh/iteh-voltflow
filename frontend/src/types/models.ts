export const USER_ROLES = ['user', 'admin'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const ORDER_STATUSES = [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  email_verified_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface AdminUser extends User {
  orders_count: number;
}

export interface AdminOverviewSummary {
  customers: number;
  products: number;
  orders: number;
  revenue: number;
}

export interface OrdersByStatusDatum {
  status: OrderStatus;
  count: number;
}

export interface RevenueOverTimeDatum {
  date: string;
  label: string;
  orders: number;
  revenue: number;
}

export interface AdminOverviewData {
  summary: AdminOverviewSummary;
  orders_by_status: OrdersByStatusDatum[];
  revenue_over_time: RevenueOverTimeDatum[];
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: string;
  stock_quantity: number;
  image_url: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: string;
  created_at: string | null;
  updated_at: string | null;
  product?: Product;
}

export interface Order {
  id: number;
  user_id: number;
  total_price: string;
  status: OrderStatus;
  shipping_address: string;
  created_at: string | null;
  updated_at: string | null;
  user?: User;
  items?: OrderItem[];
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ProductCreatePayload {
  name: string;
  description?: string | null;
  price: number | string;
  stock_quantity: number;
  image?: File | null;
}

export interface ProductUpdatePayload {
  name?: string;
  description?: string | null;
  price?: number | string;
  stock_quantity?: number;
  image?: File | null;
}

export interface ProductFilters {
  search?: string;
  min_price?: number | string;
  max_price?: number | string;
  in_stock?: boolean;
}

export type SortDirection = 'asc' | 'desc';
export type ProductSortBy =
  | 'name'
  | 'price'
  | 'stock_quantity'
  | 'created_at'
  | 'updated_at';

export interface ProductSort {
  by: ProductSortBy;
  direction: SortDirection;
}

export interface ProductQuery extends ProductFilters {
  sort_by?: ProductSortBy;
  sort_direction?: SortDirection;
  per_page?: number;
  page?: number;
}

export interface CreateOrderItemPayload {
  product_id: number;
  quantity: number;
}

export interface CreateOrderPayload {
  shipping_address: string;
  items: CreateOrderItemPayload[];
}

export interface OrderFilters {
  status?: OrderStatus;
  user_id?: number;
}

export type OrderSortBy =
  | 'total_price'
  | 'status'
  | 'created_at'
  | 'updated_at';

export interface OrderSort {
  by: OrderSortBy;
  direction: SortDirection;
}

export interface OrderQuery extends OrderFilters {
  sort_by?: OrderSortBy;
  sort_direction?: SortDirection;
  per_page?: number;
  page?: number;
}
