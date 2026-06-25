import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { onboardingApi } from '../api/onboarding.api';
import { Onboarding } from '../types/onboarding.types';

const ONBOARDING_QUERY_KEY = 'onboarding';
const LS_KEY = 'printly_onboarding';

function readFromLS(): Onboarding | undefined {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : undefined;
  } catch {
    return undefined;
  }
}

function writeToLS(data: Onboarding) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(data));
  } catch { /* quota exceeded, ignore */ }
}

export const useOnboardingStatus = () => {
  return useQuery<Onboarding, Error>({
    queryKey: [ONBOARDING_QUERY_KEY],
    queryFn: async () => {
      const data = await onboardingApi.getStatus();
      writeToLS(data);
      return data;
    },
    initialData: readFromLS(),
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
      writeToLS(data);
      queryClient.setQueryData([ONBOARDING_QUERY_KEY], data);
    },
  });
};
