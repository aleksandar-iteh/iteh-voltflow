import { apiRequest } from '../lib/api';
import type { ApiResource, MessageResponse } from '../types/api';
import type { LoginPayload, RegisterPayload, User } from '../types/models';

export interface AuthResponse extends ApiResource<User> {
  access_token: string;
  token_type: 'Bearer';
}

export const authApi = {
  register: (payload: RegisterPayload) =>
    apiRequest<AuthResponse>('/register', {
      method: 'POST',
      body: payload,
    }),

  login: (payload: LoginPayload) =>
    apiRequest<AuthResponse>('/login', {
      method: 'POST',
      body: payload,
    }),

  currentUser: () => apiRequest<ApiResource<User>>('/user'),

  logout: () =>
    apiRequest<MessageResponse>('/logout', {
      method: 'POST',
    }),
};
