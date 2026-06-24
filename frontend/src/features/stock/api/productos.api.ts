import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Producto, ProductoCreate } from '../types/stock.types';
import { useMutationWithFeedback } from '../../../hooks/useMutationWithFeedback';
import { PaginatedResponse } from '../../../lib/api-client';

const API_URL = 'http://localhost:8080/api/v1/productos';

export const useGetProductos = (page = 0, size = 100) => {
  return useQuery<PaginatedResponse<Producto>>({
    queryKey: ['productos', page, size],
    queryFn: async () => {
      const { data } = await axios.get(API_URL, { params: { page, size } });
      return data;
    }
  });
};

export const useSaveProducto = () => {
  const queryClient = useQueryClient();
  return useMutationWithFeedback({
    mutationFn: async (producto: ProductoCreate) => {
      const { data } = await axios.post(API_URL, producto);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
    },
    successMessage: 'Producto guardado correctamente en el catálogo.',
    errorMessage: 'Error al guardar el producto.',
  });
};

export const useUpdateStock = () => {
  const queryClient = useQueryClient();
  return useMutationWithFeedback({
    mutationFn: async ({ id, delta }: { id: string, delta: number }) => {
      await axios.patch(`${API_URL}/${id}/stock?delta=${delta}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
    },
    successMessage: 'Stock del producto actualizado.',
    errorMessage: 'Error al actualizar el stock.',
  });
};

export const useDeleteProducto = () => {
  const queryClient = useQueryClient();
  return useMutationWithFeedback({
    mutationFn: async (id: string) => {
      await axios.delete(`${API_URL}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
    },
    successMessage: 'Producto eliminado correctamente.',
    errorMessage: 'Error al eliminar el producto.',
  });
};
