import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../../../lib/api-client';

const API_URL = '/slice';

interface SliceRequest {
  file: File;
  printConfig?: string;
  filamentConfig?: string;
  printerConfig?: string;
}

interface SlicingResult {
  gcodePath: string;
  estimatedTime: string;
  filamentUsedG: number;
  filamentUsedCm3: number;
}

export const useSliceSTL = () => {
  return useMutation({
    mutationFn: async ({ file, printConfig, filamentConfig, printerConfig }: SliceRequest) => {
      const formData = new FormData();
      formData.append('file', file);
      if (printConfig) formData.append('printConfig', printConfig);
      if (filamentConfig) formData.append('filamentConfig', filamentConfig);
      if (printerConfig) formData.append('printerConfig', printerConfig);

      const { data } = await apiClient.post<SlicingResult>(API_URL, formData);
      return data;
    },
  });
};
