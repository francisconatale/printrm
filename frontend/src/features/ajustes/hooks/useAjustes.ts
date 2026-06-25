import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ajustesApi } from '../api/ajustes.api';
import { Ajustes } from '../types/ajustes.types';

const AJUSTES_QUERY_KEY = 'ajustes';

export const useAjustes = () => {
  const queryClient = useQueryClient();

  const { data: ajustes, ...queryInfo } = useQuery<Ajustes, Error>({
    queryKey: [AJUSTES_QUERY_KEY],
    queryFn: ajustesApi.get,
    staleTime: 30_000,
  });

  const updateMutation = useMutation({
    mutationFn: ajustesApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [AJUSTES_QUERY_KEY] });
    },
  });

  return {
    ajustes,
    ...queryInfo,
    updateAjustes: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  };
};
