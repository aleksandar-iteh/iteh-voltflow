import type { User } from '../types/models';

const TOKEN_KEY = 'voltflow_auth_token';
const USER_KEY = 'voltflow_auth_user';

const hasLocalStorage = () => typeof window !== 'undefined';

export function getStoredToken(): string | null {
  return hasLocalStorage() ? window.localStorage.getItem(TOKEN_KEY) : null;
}

export function getStoredUser(): User | null {
  if (!hasLocalStorage()) {
    return null;
  }

  const storedUser = window.localStorage.getItem(USER_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as User;
  } catch {
    window.localStorage.removeItem(USER_KEY);
    return null;
  }
}

export function storeAuthSession(token: string, user: User): void {
  if (!hasLocalStorage()) {
    return;
  }

  window.localStorage.setItem(TOKEN_KEY, token);
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function storeAuthenticatedUser(user: User): void {
  if (hasLocalStorage()) {
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

export function clearAuthSession(): void {
  if (!hasLocalStorage()) {
    return;
  }

  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}
