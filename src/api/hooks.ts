import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';
import type { CreateBookRequest, UpdateBookRequest, LoginRequest, RegisterRequest } from './types';

export function useBooks() {
  return useQuery({
    queryKey: ['books'],
    queryFn: () => apiClient.listBooks(),
  });
}

export function useBook(id: string) {
  return useQuery({
    queryKey: ['books', id],
    queryFn: () => apiClient.getBook(id),
    enabled: !!id,
  });
}

export function useCreateBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBookRequest) => apiClient.createBook(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
}

export function useUpdateBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBookRequest }) =>
      apiClient.updateBook(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
}

export function useDeleteBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.deleteBook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: (data: LoginRequest) => apiClient.login(data),
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterRequest) => apiClient.register(data),
  });
}
