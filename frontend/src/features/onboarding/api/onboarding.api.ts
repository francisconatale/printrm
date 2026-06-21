import { apiClient } from '../../../lib/api-client';
import { Onboarding } from '../types/onboarding.types';

export const onboardingApi = {
  getStatus: async (): Promise<Onboarding> => {
    const { data } = await apiClient.get<Onboarding>('/v1/onboarding');
    return data;
  },

  complete: async (payload: { nombreUsuario: string; nombreEmprendimiento: string }): Promise<Onboarding> => {
    const { data } = await apiClient.post<Onboarding>('/v1/onboarding', payload);
    return data;
  },
};
