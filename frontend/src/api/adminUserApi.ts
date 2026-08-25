import { apiRequest } from '../lib/api';
import type { PaginationLinks, PaginationMeta } from '../types/api';
import type { AdminUser } from '../types/models';

export interface AdminUserQuery {
  per_page?: number;
  page?: number;
}

export interface AdminUserListResponse {
  data: AdminUser[];
  links: PaginationLinks;
  meta: PaginationMeta;
}

export const adminUserApi = {
  list: (query: AdminUserQuery = {}) =>
    apiRequest<AdminUserListResponse>('/admin/users', { query }),
};
