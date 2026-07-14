import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { get, post, put } from '@/lib/api/axios';

// A utility wrapper for DELETE since we might not have a generic delete exported from axios yet.
// If it's not exported, we'll just use fetch for delete or add delete to axios. Let's assume we use raw fetch for delete for now, or check if axios exports `del`.
import axios from 'axios';

export const useGetMaterials = () => {
  return useQuery({
    queryKey: ['masters', 'materials'],
    queryFn: () => get<any>('/masters/materials'),
    staleTime: 1000 * 60 * 60, // 1 hour cache
  });
};

export const useGetProducts = () => {
  return useQuery({
    queryKey: ['masters', 'products'],
    queryFn: () => get<any>('/masters/products'),
    staleTime: 1000 * 60 * 60, // 1 hour cache
  });
};

export const useCreateProductCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => post<any>('/masters/products', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['masters', 'products'] });
    },
  });
};

export const useUpdateProductCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => put<any>(`/masters/products/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['masters', 'products'] });
    },
  });
};

export const useDeleteProductCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => fetch(`/api/masters/products/${id}`, { method: 'DELETE' }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['masters', 'products'] });
    },
  });
};
