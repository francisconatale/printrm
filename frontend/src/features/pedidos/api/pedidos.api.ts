import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Pedido, PedidoCreate, EstadoPedido } from '../types/pedidos.types';
import { useMutationWithFeedback } from '../../../hooks/useMutationWithFeedback';

const API_URL = 'http://localhost:8080/api/v1/pedidos';

export const useGetPedidos = () => {
  return useQuery<Pedido[]>({
    queryKey: ['pedidos'],
    queryFn: async () => {
      const { data } = await axios.get(API_URL);
      return data;
    }
  });
};

export const useGetPedido = (id: string) => {
  return useQuery<Pedido>({
    queryKey: ['pedidos', id],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/${id}`);
      return data;
    },
    enabled: !!id
  });
};

export const useCreatePedido = () => {
  const queryClient = useQueryClient();
  return useMutationWithFeedback({
    mutationFn: async (pedido: PedidoCreate) => {
      const { data } = await axios.post(API_URL, pedido);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
    },
    successMessage: 'Pedido creado correctamente.',
    errorMessage: 'Error al crear el pedido.',
  });
};

export const useUpdateEstadoPedido = () => {
  const queryClient = useQueryClient();
  return useMutationWithFeedback({
    mutationFn: async ({ id, estado }: { id: string, estado: EstadoPedido }) => {
      await axios.patch(`${API_URL}/${id}/estado?estado=${estado}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
      queryClient.invalidateQueries({ queryKey: ['pedidos', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['transacciones'] });
    },
    successMessage: 'Estado del pedido actualizado.',
    errorMessage: 'Error al actualizar el estado del pedido.',
  });
};

export const useRegistrarPago = () => {
  const queryClient = useQueryClient();
  return useMutationWithFeedback({
    mutationFn: async ({ id, monto, descripcion }: { id: string, monto: number, descripcion?: string }) => {
      await axios.post(`${API_URL}/${id}/pagos`, { monto, descripcion });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pedidos', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['transacciones'] });
    },
    successMessage: 'Pago registrado correctamente.',
    errorMessage: 'Error al registrar el pago.',
  });
};

export const useRegistrarMerma = () => {
  const queryClient = useQueryClient();
  return useMutationWithFeedback({
    mutationFn: async ({ pedidoId, itemId, unidadesFallidas }: { pedidoId: string, itemId: string, unidadesFallidas: number }) => {
      await axios.post(`${API_URL}/${pedidoId}/items/${itemId}/merma?unidadesFallidas=${unidadesFallidas}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pedidos', variables.pedidoId] });
      queryClient.invalidateQueries({ queryKey: ['transacciones'] });
    },
    successMessage: 'Merma registrada correctamente.',
    errorMessage: 'Error al registrar la merma.',
  });
};
