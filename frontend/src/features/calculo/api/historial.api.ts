import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../lib/api-client';
import { CalculoSnapshot } from '../types/calculo.types';

export const useGetHistorial = () => {
  return useQuery({
    queryKey: ['historial'],
    queryFn: async () => {
      const response = await apiClient.get<CalculoSnapshot[]>('/v1/calculos');
      return response.data;
    },
  });
};

export const useDeleteCalculo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/v1/calculos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['historial'] });
    },
  });
};

export const useClearHistorial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await apiClient.delete('/v1/calculos');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['historial'] });
    },
  });
};
