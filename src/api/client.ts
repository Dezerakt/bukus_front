import type { Book, CreateBookRequest, UpdateBookRequest, LoginRequest, RegisterRequest, Tokens, ApiError } from './types';
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from '../auth/token';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

async function tryRefresh(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${BASE_URL}/v1/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!res.ok) {
      clearTokens();
      return false;
    }

    const tokens: Tokens = await res.json();
    setTokens(tokens.access_token, tokens.refresh_token);
    return true;
  } catch {
    clearTokens();
    return false;
  }
}

async function refreshIfNeeded(): Promise<boolean> {
  if (isRefreshing) {
    return refreshPromise!;
  }

  isRefreshing = true;
  refreshPromise = tryRefresh().finally(() => {
    isRefreshing = false;
    refreshPromise = null;
  });

  return refreshPromise;
}

class ApiClient {
  private async request<T>(path: string, options?: RequestInit, retry = true): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const token = getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        ...headers,
        ...options?.headers,
      },
    });

    if (res.status === 401 && retry) {
      const refreshed = await refreshIfNeeded();
      if (refreshed) {
        return this.request<T>(path, options, false);
      }

      clearTokens();
      window.location.href = '/login';
      throw new Error('Session expired');
    }

    if (!res.ok) {
      const body: ApiError = await res.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(body.error || `Request failed with status ${res.status}`);
    }

    if (res.status === 204 || res.status === 201) {
      const text = await res.text();
      if (!text || text === 'null') return undefined as T;
      return JSON.parse(text);
    }

    return res.json();
  }

  // Auth
  async login(data: LoginRequest): Promise<Tokens> {
    const res = await fetch(`${BASE_URL}/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const body: ApiError = await res.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(body.error || 'Login failed');
    }

    const tokens: Tokens = await res.json();
    setTokens(tokens.access_token, tokens.refresh_token);
    return tokens;
  }

  async register(data: RegisterRequest): Promise<void> {
    const res = await fetch(`${BASE_URL}/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const body: ApiError = await res.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(body.error || 'Registration failed');
    }
  }

  // Books
  async listBooks(): Promise<Book[]> {
    return this.request<Book[]>('/v1/books');
  }

  async getBook(id: string): Promise<Book> {
    return this.request<Book>(`/v1/books/${id}`);
  }

  async createBook(data: CreateBookRequest): Promise<void> {
    return this.request<void>('/v1/books', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBook(id: string, data: UpdateBookRequest): Promise<void> {
    return this.request<void>(`/v1/books/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteBook(id: string): Promise<void> {
    return this.request<void>(`/v1/books/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient();
