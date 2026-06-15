import { Ajustes } from '../types/ajustes.types';

const API_URL = 'http://localhost:8080/api/ajustes';

export const ajustesApi = {
  get: async (): Promise<Ajustes> => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Error al cargar los ajustes');
    return response.json();
  },

  update: async (ajustes: Ajustes): Promise<Ajustes> => {
    const response = await fetch(API_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ajustes),
    });
    if (!response.ok) throw new Error('Error al actualizar los ajustes');
    return response.json();
  },
};
