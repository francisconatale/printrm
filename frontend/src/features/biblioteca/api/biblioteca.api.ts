import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient, PaginatedResponse } from '../../../lib/api-client';
import { PiezaSTL, PiezaSTLCreate } from '../types/biblioteca.types';
import { useMutationWithFeedback } from '../../../hooks/useMutationWithFeedback';

const API_URL = '/v1/biblioteca';

export const useGetPiezas = (page = 0, size = 100) => {
  return useQuery<PaginatedResponse<PiezaSTL>>({
    queryKey: ['piezas-stl', page, size],
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResponse<PiezaSTL>>(API_URL, { params: { page, size } });
      return data;
    }
  });
};

export const useGuardarPieza = () => {
  const queryClient = useQueryClient();
  return useMutationWithFeedback({
    mutationFn: async (pieza: PiezaSTLCreate) => {
      const { data } = await apiClient.post<PiezaSTL>(API_URL, pieza);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['piezas-stl'] });
    },
  });
};

export const useEliminarPieza = () => {
  const queryClient = useQueryClient();
  return useMutationWithFeedback({
    mutationFn: async (id: string) => {
      await apiClient.delete(`${API_URL}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['piezas-stl'] });
    },
    successMessage: 'Pieza eliminada de la biblioteca.',
    errorMessage: 'Error al eliminar la pieza de la biblioteca.',
  });
};
