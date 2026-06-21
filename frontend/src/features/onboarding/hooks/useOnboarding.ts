import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { onboardingApi } from '../api/onboarding.api';
import { Onboarding } from '../types/onboarding.types';

const ONBOARDING_QUERY_KEY = 'onboarding';

export const useOnboardingStatus = () => {
  return useQuery<Onboarding, Error>({
    queryKey: [ONBOARDING_QUERY_KEY],
    queryFn: onboardingApi.getStatus,
    staleTime: Infinity,
    retry: 2,
  });
};

export const useCompleteOnboarding = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { nombreUsuario: string; nombreEmprendimiento: string }) =>
      onboardingApi.complete(payload),
    onSuccess: (data) => {
      queryClient.setQueryData([ONBOARDING_QUERY_KEY], data);
    },
  });
};
