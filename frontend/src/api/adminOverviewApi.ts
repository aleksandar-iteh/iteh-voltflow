import { apiRequest } from '../lib/api';
import type { AdminOverviewData } from '../types/models';

export const adminOverviewApi = {
  get: () => apiRequest<{ data: AdminOverviewData }>('/admin/overview'),
};
