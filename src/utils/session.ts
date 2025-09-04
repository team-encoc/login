import { LoginResponse } from '@/types/auth';

export const saveAuthToSession = (loginResponse: LoginResponse): void => {
  sessionStorage.setItem('auth.token', loginResponse.token);
  sessionStorage.setItem('auth.user', JSON.stringify(loginResponse));
};

export const getTokenFromSession = (): string | null => {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem('auth.token');
};

export const getUserFromSession = (): LoginResponse | null => {
  if (typeof window === 'undefined') return null;
  const userStr = sessionStorage.getItem('auth.user');
  return userStr ? JSON.parse(userStr) : null;
};

export const clearAuthFromSession = (): void => {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem('auth.token');
  sessionStorage.removeItem('auth.user');
};