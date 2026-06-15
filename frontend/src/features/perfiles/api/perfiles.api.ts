import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { 
  Perfil, 
  PerfilCreate, 
  PerfilUpdate, 
  FilamentProfile, 
  FilamentProfileCreate, 
  FilamentProfileUpdate,
  PrintProfile,
  PrintProfileCreate,
  PrintProfileUpdate,
  SlicerConfigs 
} from '../types/perfiles.types';

const API_URL = 'http://localhost:8080/api/v1/perfiles';
const FILAMENT_API_URL = 'http://localhost:8080/api/v1/filament-profiles';
const PRINT_API_URL = 'http://localhost:8080/api/v1/print-profiles';

// --- PRINTER PROFILES (PERFILES) ---

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

// --- FILAMENT PROFILES ---

export const useGetFilamentProfiles = () => {
  return useQuery<FilamentProfile[]>({
    queryKey: ['filament-profiles'],
    queryFn: async () => {
      const { data } = await axios.get(FILAMENT_API_URL);
      return data;
    },
  });
};

export const useCreateFilamentProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newProfile: FilamentProfileCreate) => {
      const { data } = await axios.post(FILAMENT_API_URL, newProfile);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['filament-profiles'] });
    },
  });
};

export const useUpdateFilamentProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: FilamentProfileUpdate & { id: string }) => {
      const { data } = await axios.put(`${FILAMENT_API_URL}/${id}`, updates);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['filament-profiles'] });
    },
  });
};

export const useDeleteFilamentProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`${FILAMENT_API_URL}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['filament-profiles'] });
    },
  });
};

// --- PRINT PROFILES ---

export const useGetPrintProfiles = () => {
  return useQuery<PrintProfile[]>({
    queryKey: ['print-profiles'],
    queryFn: async () => {
      const { data } = await axios.get(PRINT_API_URL);
      return data;
    },
  });
};

export const useCreatePrintProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newProfile: PrintProfileCreate) => {
      const { data } = await axios.post(PRINT_API_URL, newProfile);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['print-profiles'] });
    },
  });
};

export const useUpdatePrintProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: PrintProfileUpdate & { id: string }) => {
      const { data } = await axios.put(`${PRINT_API_URL}/${id}`, updates);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['print-profiles'] });
    },
  });
};

export const useDeletePrintProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`${PRINT_API_URL}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['print-profiles'] });
    },
  });
};
