export type ValidationErrors = Record<string, string[]>;

export interface ApiResource<T> {
  data: T;
}

export interface MutationResponse<T> extends ApiResource<T> {
  message: string;
}

export interface MessageResponse {
  message: string;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface PaginationMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  links: PaginationLink[];
  path: string;
  per_page: number;
  to: number | null;
  total: number;
}

export interface PaginationLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

export interface PaginatedResponse<T, TFilters, TSort> {
  data: T[];
  links: PaginationLinks;
  meta: PaginationMeta;
  filters: TFilters;
  sort: TSort;
}
