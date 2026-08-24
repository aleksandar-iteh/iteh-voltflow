import { create } from 'zustand';
import { orderApi } from '../api/orderApi';
import type { PaginationMeta, ValidationErrors } from '../types/api';
import type {
  CreateOrderPayload,
  Order,
  OrderFilters,
  OrderQuery,
  OrderSort,
  OrderStatus,
} from '../types/models';
import { toStoreError } from './storeError';

interface OrderStore {
  orders: Order[];
  selectedOrder: Order | null;
  pagination: PaginationMeta | null;
  filters: OrderFilters;
  sort: OrderSort;
  isLoading: boolean;
  error: string | null;
  validationErrors: ValidationErrors;
  setFilters: (filters: Partial<OrderFilters>) => void;
  setSort: (sort: OrderSort) => void;
  fetchOrders: (overrides?: OrderQuery) => Promise<Order[]>;
  fetchOrder: (orderId: number) => Promise<Order>;
  createOrder: (payload: CreateOrderPayload) => Promise<Order>;
  updateOrderStatus: (
    orderId: number,
    status: OrderStatus,
  ) => Promise<Order>;
  clearFilters: () => void;
  clearSelectedOrder: () => void;
  clearError: () => void;
}

const defaultSort: OrderSort = { by: 'created_at', direction: 'desc' };

export const useOrderStore = create<OrderStore>((set, get) => ({
  orders: [],
  selectedOrder: null,
  pagination: null,
  filters: {},
  sort: defaultSort,
  isLoading: false,
  error: null,
  validationErrors: {},

  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),

  setSort: (sort) => set({ sort }),

  fetchOrders: async (overrides = {}) => {
    const state = get();
    const query: OrderQuery = {
      ...state.filters,
      sort_by: state.sort.by,
      sort_direction: state.sort.direction,
      ...overrides,
    };

    set({
      filters: orderFiltersFrom(query),
      sort: {
        by: query.sort_by ?? defaultSort.by,
        direction: query.sort_direction ?? defaultSort.direction,
      },
      isLoading: true,
      error: null,
      validationErrors: {},
    });

    try {
      const response = await orderApi.list(query);
      set({
        orders: response.data,
        pagination: response.meta,
        filters: orderFiltersFrom(query),
        sort: response.sort,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({ ...toStoreError(error), isLoading: false });
      throw error;
    }
  },

  fetchOrder: async (orderId) => {
    set({ isLoading: true, error: null, validationErrors: {} });

    try {
      const response = await orderApi.get(orderId);
      set({ selectedOrder: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({ ...toStoreError(error), isLoading: false });
      throw error;
    }
  },

  createOrder: async (payload) => {
    set({ isLoading: true, error: null, validationErrors: {} });

    try {
      const response = await orderApi.create(payload);
      set((state) => ({
        orders: [response.data, ...state.orders],
        selectedOrder: response.data,
        isLoading: false,
      }));
      return response.data;
    } catch (error) {
      set({ ...toStoreError(error), isLoading: false });
      throw error;
    }
  },

  updateOrderStatus: async (orderId, status) => {
    set({ isLoading: true, error: null, validationErrors: {} });

    try {
      const response = await orderApi.updateStatus(orderId, status);
      set((state) => ({
        orders: state.orders.map((order) =>
          order.id === orderId ? response.data : order,
        ),
        selectedOrder:
          state.selectedOrder?.id === orderId
            ? response.data
            : state.selectedOrder,
        isLoading: false,
      }));
      return response.data;
    } catch (error) {
      set({ ...toStoreError(error), isLoading: false });
      throw error;
    }
  },

  clearFilters: () => set({ filters: {}, sort: defaultSort }),
  clearSelectedOrder: () => set({ selectedOrder: null }),
  clearError: () => set({ error: null, validationErrors: {} }),
}));

function orderFiltersFrom(query: OrderQuery): OrderFilters {
  return {
    status: query.status,
    user_id: query.user_id,
  };
}
