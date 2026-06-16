import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Cliente, ClienteCreate, ClienteUpdate } from '../types/clientes.types';

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
  return useMutation({
    mutationFn: async (cliente: ClienteCreate) => {
      const { data } = await axios.post(API_URL, cliente);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
    }
  });
};

export const useUpdateCliente = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (cliente: ClienteUpdate) => {
      const { data } = await axios.post(API_URL, cliente);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
    }
  });
};

export const useDeleteCliente = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`${API_URL}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
    }
  });
};
