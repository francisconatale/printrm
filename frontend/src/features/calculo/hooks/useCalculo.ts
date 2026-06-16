import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../lib/api-client';
import { PiezaInput, ResultadoCalculo } from '../types/calculo.types';
import { usePerfilActivo } from '../../perfiles/hooks/usePerfilActivo';

export const useCalculo = (
  input: PiezaInput,
  printerOverride?: { id: string } | null,
  filamentOverride?: { id: string } | null
) => {
  const { perfilActivo } = usePerfilActivo();
  const activePrinterId = printerOverride?.id || perfilActivo?.id;

  return useQuery({
    queryKey: ['calculo', input, activePrinterId, filamentOverride?.id],
    queryFn: async () => {
      if (!activePrinterId || (input.horas === 0 && input.gramos === 0)) return null;
      
      const response = await apiClient.post<ResultadoCalculo>('/v1/calculos/calculate', {
        ...input,
        perfilId: activePrinterId,
        // Backend can be extended to accept filamentId if needed
      });
      return response.data;
    },
    enabled: !!activePrinterId && (input.horas > 0 || input.gramos > 0 || input.insumosExtra > 0),
  });
};
