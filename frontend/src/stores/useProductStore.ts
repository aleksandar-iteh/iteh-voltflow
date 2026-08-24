import { create } from 'zustand';
import { productApi } from '../api/productApi';
import type { PaginationMeta, ValidationErrors } from '../types/api';
import type {
  Product,
  ProductCreatePayload,
  ProductFilters,
  ProductQuery,
  ProductSort,
  ProductUpdatePayload,
} from '../types/models';
import { toStoreError } from './storeError';

interface ProductStore {
  products: Product[];
  selectedProduct: Product | null;
  pagination: PaginationMeta | null;
  filters: ProductFilters;
  sort: ProductSort;
  isLoading: boolean;
  error: string | null;
  validationErrors: ValidationErrors;
  setFilters: (filters: Partial<ProductFilters>) => void;
  setSort: (sort: ProductSort) => void;
  fetchProducts: (overrides?: ProductQuery) => Promise<Product[]>;
  fetchProduct: (productId: number) => Promise<Product>;
  createProduct: (payload: ProductCreatePayload) => Promise<Product>;
  updateProduct: (
    productId: number,
    payload: ProductUpdatePayload,
  ) => Promise<Product>;
  deleteProduct: (productId: number) => Promise<void>;
  clearFilters: () => void;
  clearSelectedProduct: () => void;
  clearError: () => void;
}

const defaultSort: ProductSort = { by: 'created_at', direction: 'desc' };

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  selectedProduct: null,
  pagination: null,
  filters: {},
  sort: defaultSort,
  isLoading: false,
  error: null,
  validationErrors: {},

  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),

  setSort: (sort) => set({ sort }),

  fetchProducts: async (overrides = {}) => {
    const state = get();
    const query: ProductQuery = {
      ...state.filters,
      sort_by: state.sort.by,
      sort_direction: state.sort.direction,
      ...overrides,
    };

    set({
      filters: productFiltersFrom(query),
      sort: {
        by: query.sort_by ?? defaultSort.by,
        direction: query.sort_direction ?? defaultSort.direction,
      },
      isLoading: true,
      error: null,
      validationErrors: {},
    });

    try {
      const response = await productApi.list(query);
      set({
        products: response.data,
        pagination: response.meta,
        filters: productFiltersFrom(query),
        sort: response.sort,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({ ...toStoreError(error), isLoading: false });
      throw error;
    }
  },

  fetchProduct: async (productId) => {
    set({ isLoading: true, error: null, validationErrors: {} });

    try {
      const response = await productApi.get(productId);
      set({ selectedProduct: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({ ...toStoreError(error), isLoading: false });
      throw error;
    }
  },

  createProduct: async (payload) => {
    set({ isLoading: true, error: null, validationErrors: {} });

    try {
      const response = await productApi.create(payload);
      set((state) => ({
        products: [response.data, ...state.products],
        selectedProduct: response.data,
        isLoading: false,
      }));
      return response.data;
    } catch (error) {
      set({ ...toStoreError(error), isLoading: false });
      throw error;
    }
  },

  updateProduct: async (productId, payload) => {
    set({ isLoading: true, error: null, validationErrors: {} });

    try {
      const response = await productApi.update(productId, payload);
      set((state) => ({
        products: state.products.map((product) =>
          product.id === productId ? response.data : product,
        ),
        selectedProduct:
          state.selectedProduct?.id === productId
            ? response.data
            : state.selectedProduct,
        isLoading: false,
      }));
      return response.data;
    } catch (error) {
      set({ ...toStoreError(error), isLoading: false });
      throw error;
    }
  },

  deleteProduct: async (productId) => {
    set({ isLoading: true, error: null, validationErrors: {} });

    try {
      await productApi.delete(productId);
      set((state) => ({
        products: state.products.filter((product) => product.id !== productId),
        selectedProduct:
          state.selectedProduct?.id === productId
            ? null
            : state.selectedProduct,
        isLoading: false,
      }));
    } catch (error) {
      set({ ...toStoreError(error), isLoading: false });
      throw error;
    }
  },

  clearFilters: () => set({ filters: {}, sort: defaultSort }),
  clearSelectedProduct: () => set({ selectedProduct: null }),
  clearError: () => set({ error: null, validationErrors: {} }),
}));

function productFiltersFrom(query: ProductQuery): ProductFilters {
  return {
    search: query.search,
    min_price: query.min_price,
    max_price: query.max_price,
    in_stock: query.in_stock,
  };
}
