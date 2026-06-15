import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ajustesApi } from '../api/ajustes.api';
import { Ajustes } from '../types/ajustes.types';

const AJUSTES_QUERY_KEY = 'ajustes';

export const useAjustes = () => {
  const queryClient = useQueryClient();

  const { data: ajustes, ...queryInfo } = useQuery<Ajustes, Error>({
    queryKey: [AJUSTES_QUERY_KEY],
    queryFn: ajustesApi.get,
    staleTime: Infinity,
  });

  const updateMutation = useMutation({
    mutationFn: ajustesApi.update,
    onSuccess: (updatedAjustes) => {
      queryClient.setQueryData([AJUSTES_QUERY_KEY], updatedAjustes);
    },
  });

  return {
    ajustes,
    ...queryInfo,
    updateAjustes: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  };
};
