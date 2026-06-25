import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient, PaginatedResponse } from '../../../lib/api-client';
import { useMutationWithFeedback } from '../../../hooks/useMutationWithFeedback';
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

const API_URL = '/v1/perfiles';
const FILAMENT_API_URL = '/v1/filament-profiles';
const PRINT_API_URL = '/v1/print-profiles';

// Helper for generating standard CRUD hooks
function createCrudHooks<T extends { id: string }, TCreate, TUpdate>(
  queryKey: string,
  url: string,
  entitySingular: string
) {
  return {
    useGet: (page = 0, size = 100) => useQuery<PaginatedResponse<T>>({
      queryKey: [queryKey, page, size],
      queryFn: async () => {
        const { data } = await apiClient.get<PaginatedResponse<T>>(url, { params: { page, size } });
        return data;
      },
    }),
    useCreate: () => {
      const queryClient = useQueryClient();
      return useMutationWithFeedback({
        mutationFn: async (newItem: TCreate) => {
          const { data } = await apiClient.post<T>(url, newItem);
          return data;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [queryKey], refetchType: 'all' });
        },
        successMessage: `${entitySingular} creado correctamente.`,
        errorMessage: `Error al crear ${entitySingular.toLowerCase()}.`,
      });
    },
    useUpdate: () => {
      const queryClient = useQueryClient();
      return useMutationWithFeedback({
        mutationFn: async ({ id, ...updates }: TUpdate & { id: string }) => {
          const { data } = await apiClient.put<T>(`${url}/${id}`, updates);
          return data;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [queryKey], refetchType: 'all' });
        },
        successMessage: `${entitySingular} actualizado correctamente.`,
        errorMessage: `Error al actualizar ${entitySingular.toLowerCase()}.`,
      });
    },
    useDelete: () => {
      const queryClient = useQueryClient();
      return useMutationWithFeedback({
        mutationFn: async (id: string) => {
          await apiClient.delete(`${url}/${id}`);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [queryKey], refetchType: 'all' });
        },
        successMessage: `${entitySingular} eliminado correctamente.`,
        errorMessage: `Error al eliminar ${entitySingular.toLowerCase()}.`,
      });
    },
  };
}

const printerHooks = createCrudHooks<Perfil, PerfilCreate, PerfilUpdate>('perfiles', API_URL, 'Impresora');
export const useGetPerfiles = printerHooks.useGet;
export const useCreatePerfil = printerHooks.useCreate;
export const useUpdatePerfil = printerHooks.useUpdate;
export const useDeletePerfil = printerHooks.useDelete;

export const useGetSlicerConfigs = () => {
  return useQuery<SlicerConfigs>({
    queryKey: ['slicer-configs'],
    queryFn: async () => {
      const { data } = await apiClient.get<SlicerConfigs>(`${API_URL}/configs`);
      return data;
    },
  });
};

const filamentHooks = createCrudHooks<FilamentProfile, FilamentProfileCreate, FilamentProfileUpdate>('filament-profiles', FILAMENT_API_URL, 'Filamento');
export const useGetFilamentProfiles = filamentHooks.useGet;
export const useCreateFilamentProfile = filamentHooks.useCreate;
export const useUpdateFilamentProfile = filamentHooks.useUpdate;
export const useDeleteFilamentProfile = filamentHooks.useDelete;

const printHooks = createCrudHooks<PrintProfile, PrintProfileCreate, PrintProfileUpdate>('print-profiles', PRINT_API_URL, 'Ajuste de impresión');
export const useGetPrintProfiles = printHooks.useGet;
export const useCreatePrintProfile = printHooks.useCreate;
export const useUpdatePrintProfile = printHooks.useUpdate;
export const useDeletePrintProfile = printHooks.useDelete;
