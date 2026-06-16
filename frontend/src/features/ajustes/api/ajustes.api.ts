import { apiClient } from '../../../lib/api-client';
import { Ajustes } from '../types/ajustes.types';

const API_URL = '/ajustes';

export const ajustesApi = {
  get: async (): Promise<Ajustes> => {
    const { data } = await apiClient.get<Ajustes>(API_URL);
    return data;
  },

  update: async (ajustes: Ajustes): Promise<Ajustes> => {
    const { data } = await apiClient.put<Ajustes>(API_URL, ajustes);
    return data;
  },
};
