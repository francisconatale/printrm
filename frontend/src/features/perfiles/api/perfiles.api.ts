import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Perfil, PerfilCreate, PerfilUpdate, SlicerConfigs } from '../types/perfiles.types';

const API_URL = 'http://localhost:8080/api/v1/perfiles';

export const useGetPerfiles = () => {
  return useQuery<Perfil[]>({
    queryKey: ['perfiles'],
    queryFn: async () => {
      const { data } = await axios.get(API_URL);
      return data;
    },
  });
};

export const useGetSlicerConfigs = () => {
  return useQuery<SlicerConfigs>({
    queryKey: ['slicer-configs'],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/configs`);
      return data;
    },
  });
};

export const useCreatePerfil = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newPerfil: PerfilCreate) => {
      const { data } = await axios.post(API_URL, newPerfil);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['perfiles'] });
    },
  });
};

export const useUpdatePerfil = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: PerfilUpdate & { id: string }) => {
      const { data } = await axios.put(`${API_URL}/${id}`, updates);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['perfiles'] });
    },
  });
};

export const useDeletePerfil = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`${API_URL}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['perfiles'] });
    },
  });
};
