import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { OrdenProduccion, OrdenProduccionRequest, EstadoProduccion } from '../types/produccion.types';
import { PaginatedResponse } from '../../../lib/api-client';

const API_URL = 'http://localhost:8080/api/v1/produccion/ordenes';

export const useGetOrdenesProduccion = (page = 0, size = 20) => {
  return useQuery<PaginatedResponse<OrdenProduccion>>({
    queryKey: ['ordenesProduccion', page, size],
    queryFn: async () => {
      const { data } = await axios.get(API_URL, { params: { page, size } });
      return data;
    }
  });
};

export const useCreateOrdenVinculada = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orden: OrdenProduccionRequest) => {
      const { data } = await axios.post(`${API_URL}/vinculada`, orden);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ordenesProduccion'] });
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
      if (variables.itemPedidoId) {
        queryClient.invalidateQueries({ queryKey: ['pedidos'] });
      }
    }
  });
};

export const useCreateOrdenIndependiente = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orden: OrdenProduccionRequest) => {
      const { data } = await axios.post(`${API_URL}/independiente`, orden);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ordenesProduccion'] });
      queryClient.invalidateQueries({ queryKey: ['productos'] });
    }
  });
};

export const useUpdateEstadoOrden = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, estado }: { id: string; estado: EstadoProduccion }) => {
      const { data } = await axios.patch(`${API_URL}/${id}/estado?estado=${estado}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ordenesProduccion'] });
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
      queryClient.invalidateQueries({ queryKey: ['productos'] });
    }
  });
};

export const useRegistrarMermaProduccion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, unidadesFallidas }: { id: string; unidadesFallidas: number }) => {
      const { data } = await axios.post(`${API_URL}/${id}/merma?unidadesFallidas=${unidadesFallidas}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ordenesProduccion'] });
      queryClient.invalidateQueries({ queryKey: ['transacciones'] });
    }
  });
};
