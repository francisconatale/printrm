import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/slice';

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

      const { data } = await axios.post<SlicingResult>(API_URL, formData);
      return data;
    },
  });
};
