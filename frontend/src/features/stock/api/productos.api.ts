import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Producto, ProductoCreate } from '../types/stock.types';

const API_URL = 'http://localhost:8080/api/v1/productos';

export const useGetProductos = () => {
  return useQuery<Producto[]>({
    queryKey: ['productos'],
    queryFn: async () => {
      const { data } = await axios.get(API_URL);
      return data;
    }
  });
};

export const useSaveProducto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (producto: ProductoCreate) => {
      const { data } = await axios.post(API_URL, producto);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
    }
  });
};

export const useUpdateStock = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, delta }: { id: string, delta: number }) => {
      await axios.patch(`${API_URL}/${id}/stock?delta=${delta}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
    }
  });
};

export const useDeleteProducto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`${API_URL}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
    }
  });
};
