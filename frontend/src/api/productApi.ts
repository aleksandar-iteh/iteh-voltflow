import { apiRequest } from '../lib/api';
import type {
  MessageResponse,
  MutationResponse,
  PaginatedResponse,
} from '../types/api';
import type {
  Product,
  ProductCreatePayload,
  ProductFilters,
  ProductQuery,
  ProductSort,
  ProductUpdatePayload,
} from '../types/models';

export type ProductListResponse = PaginatedResponse<
  Product,
  Partial<Record<keyof ProductFilters, string>>,
  ProductSort
>;

export const productApi = {
  list: (query: ProductQuery = {}) =>
    apiRequest<ProductListResponse>('/products', { query }),

  get: (productId: number) =>
    apiRequest<{ data: Product }>(`/products/${productId}`),

  create: (payload: ProductCreatePayload) =>
    apiRequest<MutationResponse<Product>>('/products', {
      method: 'POST',
      body: productFormData(payload),
    }),

  update: (productId: number, payload: ProductUpdatePayload) => {
    const formData = productFormData(payload);
    formData.set('_method', 'PATCH');

    return apiRequest<MutationResponse<Product>>(`/products/${productId}`, {
      method: 'POST',
      body: formData,
    });
  },

  delete: (productId: number) =>
    apiRequest<MessageResponse>(`/products/${productId}`, {
      method: 'DELETE',
    }),
};

function productFormData(
  payload: ProductCreatePayload | ProductUpdatePayload,
): FormData {
  const formData = new FormData();

  appendValue(formData, 'name', payload.name);
  appendValue(formData, 'description', payload.description);
  appendValue(formData, 'price', payload.price);
  appendValue(formData, 'stock_quantity', payload.stock_quantity);

  if (payload.image instanceof File) {
    formData.set('image', payload.image);
  }

  return formData;
}

function appendValue(
  formData: FormData,
  key: string,
  value: string | number | null | undefined,
): void {
  if (value !== undefined) {
    formData.set(key, value === null ? '' : String(value));
  }
}
