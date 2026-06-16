import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../lib/api-client';
import { CalculoSnapshot } from '../types/calculo.types';

const API_URL = '/v1/calculos';

export const useGetHistorial = () => {
  return useQuery<CalculoSnapshot[]>({
    queryKey: ['historial'],
    queryFn: async () => {
      const { data } = await apiClient.get<CalculoSnapshot[]>(API_URL);
      return data;
    },
  });
};

export const useGuardarCalculo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (snapshot: CalculoSnapshot) => {
      const { data } = await apiClient.post<CalculoSnapshot>(API_URL, snapshot);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['historial'] });
    },
  });
};

export const useLimpiarHistorial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await apiClient.delete(API_URL);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['historial'] });
    },
  });
};
