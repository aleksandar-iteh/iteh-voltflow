import { getStoredToken } from './authStorage';
import type { ValidationErrors } from '../types/api';

type QueryValue = string | number | boolean | null | undefined;

interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  query?: object;
}

interface ErrorPayload {
  message?: string;
  errors?: ValidationErrors;
}

const API_BASE_URL = (import.meta.env.VITE_API_URL ?? '/api').replace(/\/$/, '');

export class ApiError extends Error {
  readonly status: number;
  readonly data: unknown;
  readonly validationErrors: ValidationErrors;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    this.validationErrors = getValidationErrors(data);
  }
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { body, headers: providedHeaders, query, ...requestOptions } = options;
  const headers = new Headers(providedHeaders);
  const token = getStoredToken();
  const isFormData = body instanceof FormData;

  headers.set('Accept', 'application/json');

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (body !== undefined && !isFormData) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE_URL}${path}${queryString(query)}`, {
    ...requestOptions,
    headers,
    body:
      body === undefined
        ? undefined
        : isFormData
          ? body
          : JSON.stringify(body),
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    const payload = isErrorPayload(data) ? data : undefined;

    throw new ApiError(
      payload?.message ?? `Request failed with status ${response.status}.`,
      response.status,
      data,
    );
  }

  return data as T;
}

export function queryString(params?: object): string {
  if (!params) {
    return '';
  }

  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]: [string, QueryValue]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }

    searchParams.set(key, typeof value === 'boolean' ? (value ? '1' : '0') : String(value));
  });

  const query = searchParams.toString();

  return query ? `?${query}` : '';
}

async function parseResponse(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return undefined;
  }

  const text = await response.text();

  if (!text) {
    return undefined;
  }

  if (response.headers.get('content-type')?.includes('application/json')) {
    return JSON.parse(text) as unknown;
  }

  return text;
}

function isErrorPayload(value: unknown): value is ErrorPayload {
  return typeof value === 'object' && value !== null;
}

function getValidationErrors(value: unknown): ValidationErrors {
  if (!isErrorPayload(value) || !value.errors || typeof value.errors !== 'object') {
    return {};
  }

  return value.errors;
}
