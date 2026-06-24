import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { VentaRequest, VentaResponse } from '../types/venta.types';
import { useMutationWithFeedback } from '../../../hooks/useMutationWithFeedback';

const API_URL = 'http://localhost:8080/api/v1/ventas';

export const useRegistrarVenta = () => {
  const queryClient = useQueryClient();
  return useMutationWithFeedback({
    mutationFn: async (request: VentaRequest) => {
      const { data } = await axios.post(API_URL, request);
      return data as VentaResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
      queryClient.invalidateQueries({ queryKey: ['ventas'] });
    },
    successMessage: 'Venta registrada correctamente.',
    errorMessage: 'Error al registrar la venta.',
  });
};

export const useGetVentas = () => {
  return useQuery<VentaResponse[]>({
    queryKey: ['ventas'],
    queryFn: async () => {
      const { data } = await axios.get(API_URL);
      return data;
    }
  });
};

import { DevolucionRequest, DevolucionResponse } from '../types/venta.types';

export const useDevolverVenta = () => {
  const queryClient = useQueryClient();
  return useMutationWithFeedback({
    mutationFn: async ({ grupoId, request }: { grupoId: string; request: DevolucionRequest }): Promise<DevolucionResponse> => {
      const { data } = await axios.post(`${API_URL}/${grupoId}/devolucion`, request);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
      queryClient.invalidateQueries({ queryKey: ['ventas'] });
    },
    successMessage: 'Devolución procesada correctamente.',
    errorMessage: 'Error al procesar la devolución.',
  });
};
