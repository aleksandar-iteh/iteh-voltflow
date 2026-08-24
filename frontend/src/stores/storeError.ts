import { ApiError } from '../lib/api';
import type { ValidationErrors } from '../types/api';

export interface StoreError {
  error: string;
  validationErrors: ValidationErrors;
}

export function toStoreError(error: unknown): StoreError {
  if (error instanceof ApiError) {
    return {
      error: error.message,
      validationErrors: error.validationErrors,
    };
  }

  return {
    error: error instanceof Error ? error.message : 'An unexpected error occurred.',
    validationErrors: {},
  };
}
