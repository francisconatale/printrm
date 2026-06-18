import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Transaccion } from '../types/finanzas.types';

const API_URL = 'http://localhost:8080/api/v1/transacciones';

export const useGetTransacciones = () => {
  return useQuery<Transaccion[]>({
    queryKey: ['transacciones'],
    queryFn: async () => {
      const { data } = await axios.get(API_URL);
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
  return useMutation({
    mutationFn: async (transaccion: Omit<Transaccion, 'id' | 'fecha'>) => {
      const { data } = await axios.post(API_URL, transaccion);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transacciones'] });
      queryClient.invalidateQueries({ queryKey: ['balance'] });
    }
  });
};
