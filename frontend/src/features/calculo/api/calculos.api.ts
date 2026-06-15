import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { CalculoSnapshot } from '../types/calculo.types';

const API_URL = 'http://localhost:8080/api/v1/calculos';

export const useGetHistorial = () => {
  return useQuery<CalculoSnapshot[]>({
    queryKey: ['historial'],
    queryFn: async () => {
      const { data } = await axios.get(API_URL);
      return data;
    },
  });
};

export const useGuardarCalculo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (snapshot: any) => {
      const { data } = await axios.post(API_URL, snapshot);
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
      await axios.delete(API_URL);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['historial'] });
    },
  });
};
