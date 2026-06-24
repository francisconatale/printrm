import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Transaccion } from '../types/finanzas.types';
import { useMutationWithFeedback } from '../../../hooks/useMutationWithFeedback';
import { PaginatedResponse } from '../../../lib/api-client';

const API_URL = 'http://localhost:8080/api/v1/transacciones';

export const useGetTransacciones = (page = 0, size = 20) => {
  return useQuery<PaginatedResponse<Transaccion>>({
    queryKey: ['transacciones', page, size],
    queryFn: async () => {
      const { data } = await axios.get(API_URL, { params: { page, size } });
      return data;
    }
  });
};

export const useGetBalance = () => {
  return useQuery<number>({
    queryKey: ['balance'],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/balance`);
      return data;
    }
  });
};

export const useCreateTransaccion = () => {
  const queryClient = useQueryClient();
  return useMutationWithFeedback({
    mutationFn: async (transaccion: Omit<Transaccion, 'id' | 'fecha'>) => {
      const { data } = await axios.post(API_URL, transaccion);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transacciones'] });
      queryClient.invalidateQueries({ queryKey: ['balance'] });
    },
    successMessage: 'Transacción registrada correctamente.',
    errorMessage: 'Error al registrar la transacción.',
  });
};
