export interface Book {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateBookRequest {
  name: string;
}

export interface UpdateBookRequest {
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface Tokens {
  access_token: string;
  refresh_token: string;
}

export interface ApiError {
  error: string;
}
