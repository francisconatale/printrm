import { useGetPerfiles, useGetFilamentProfiles, useGetPrintProfiles } from '../../perfiles/api/perfiles.api';
import type { ProfileSelectItem } from '../../../components/ui/profile-select';

export interface SlicerProfileOptions {
  printers: ProfileSelectItem[];
  filaments: ProfileSelectItem[];
  prints: ProfileSelectItem[];
  isLoading: boolean;
}

/**
 * Hook que centraliza la obtención y mapeo de los 3 perfiles de slicing
 * (impresora, filamento, ajuste de impresión) como listas para ProfileSelect.
 */
export function useSlicerProfiles(): SlicerProfileOptions {
  const { data: printersData, isLoading: loadingPrinters } = useGetPerfiles(0, 100);
  const { data: filamentsData, isLoading: loadingFilaments } = useGetFilamentProfiles(0, 100);
  const { data: printsData, isLoading: loadingPrints } = useGetPrintProfiles(0, 100);
  const printers = printersData?.content ?? [];
  const filaments = filamentsData?.content ?? [];
  const prints = printsData?.content ?? [];

  return {
    printers: printers.map((p) => ({
      value: p.id,
      label: `${p.nombre} (${p.modeloImpresora})`,
    })),
    filaments: filaments.map((f) => ({
      value: f.id,
      label: `${f.nombre} (${f.material})`,
    })),
    prints: prints.map((p) => ({
      value: p.id,
      label: `${p.nombre} (${p.layerHeight}mm)`,
    })),
    isLoading: loadingPrinters || loadingFilaments || loadingPrints,
  };
}
