import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { PiezaSTL, PiezaSTLCreate } from '../types/biblioteca.types';

const API_URL = 'http://localhost:8080/api/v1/biblioteca';

export const useGetPiezas = () => {
  return useQuery<PiezaSTL[]>({
    queryKey: ['piezas-stl'],
    queryFn: async () => {
      const { data } = await axios.get(API_URL);
      return data;
    }
  });
};

export const useGuardarPieza = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (pieza: PiezaSTLCreate) => {
      const { data } = await axios.post(API_URL, pieza);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['piezas-stl'] });
    }
  });
};

export const useEliminarPieza = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`${API_URL}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['piezas-stl'] });
    }
  });
};
