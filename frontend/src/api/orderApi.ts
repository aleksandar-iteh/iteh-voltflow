import { apiRequest } from '../lib/api';
import type { MutationResponse, PaginatedResponse } from '../types/api';
import type {
  CreateOrderPayload,
  Order,
  OrderFilters,
  OrderQuery,
  OrderSort,
  OrderStatus,
} from '../types/models';

export type OrderListResponse = PaginatedResponse<
  Order,
  Partial<Record<keyof OrderFilters, string>>,
  OrderSort
>;

export const orderApi = {
  list: (query: OrderQuery = {}) =>
    apiRequest<OrderListResponse>('/orders', { query }),

  get: (orderId: number) =>
    apiRequest<{ data: Order }>(`/orders/${orderId}`),

  create: (payload: CreateOrderPayload) =>
    apiRequest<MutationResponse<Order>>('/orders', {
      method: 'POST',
      body: payload,
    }),

  updateStatus: (orderId: number, status: OrderStatus) =>
    apiRequest<MutationResponse<Order>>(`/orders/${orderId}`, {
      method: 'PATCH',
      body: { status },
    }),
};
