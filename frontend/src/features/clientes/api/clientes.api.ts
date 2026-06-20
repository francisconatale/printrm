import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Cliente, ClienteCreate, ClienteUpdate } from '../types/clientes.types';
import { useMutationWithFeedback } from '../../../hooks/useMutationWithFeedback';

const API_URL = 'http://localhost:8080/api/v1/clientes';

export const useGetClientes = () => {
  return useQuery<Cliente[]>({
    queryKey: ['clientes'],
    queryFn: async () => {
      const { data } = await axios.get(API_URL);
      return data;
    }
  });
};

export const useCreateCliente = () => {
  const queryClient = useQueryClient();
  return useMutationWithFeedback({
    mutationFn: async (cliente: ClienteCreate) => {
      const { data } = await axios.post(API_URL, cliente);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
    },
    successMessage: 'Cliente creado correctamente.',
    errorMessage: 'Error al crear el cliente.',
  });
};

export const useUpdateCliente = () => {
  const queryClient = useQueryClient();
  return useMutationWithFeedback({
    mutationFn: async (cliente: ClienteUpdate) => {
      const { data } = await axios.put(`${API_URL}/${cliente.id}`, cliente);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
    },
    successMessage: 'Cliente actualizado correctamente.',
    errorMessage: 'Error al actualizar el cliente.',
  });
};

export const useDeleteCliente = () => {
  const queryClient = useQueryClient();
  return useMutationWithFeedback({
    mutationFn: async (id: string) => {
      await axios.delete(`${API_URL}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
    },
    successMessage: 'Cliente eliminado correctamente.',
    errorMessage: 'Error al eliminar el cliente.',
  });
};
