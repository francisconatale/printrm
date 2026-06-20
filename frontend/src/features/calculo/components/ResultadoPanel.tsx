import React from 'react';
import { X } from 'lucide-react';
import { ResultadoCalculo } from '../types/calculo.types';
import { useAjustes } from '../../ajustes/hooks/useAjustes';
import { Ajustes, DEFAULT_AJUSTES } from '../../ajustes/types/ajustes.types';
import { ResultadosBreakdown } from './ResultadosBreakdown';
import { AjustesGlobalesForm } from './AjustesGlobalesForm';
import { usePerfilActivo } from '../../perfiles/hooks/usePerfilActivo';

interface ResultadoPanelProps {
  resultado: ResultadoCalculo | null;
  onSaveToLibrary?: () => void;
  isSavingToLibrary?: boolean;
  onAnalyze?: () => void;
  isAnalyzing?: boolean;
  hasFile?: boolean;
  hasAnalyzed?: boolean;
  insumosExtra?: number;
  onInsumosExtraChange?: (v: number) => void;
  onReset?: () => void;
}

export const ResultadoPanel: React.FC<ResultadoPanelProps> = ({
  resultado, 
  onSaveToLibrary, 
  isSavingToLibrary, 
  onAnalyze, 
  isAnalyzing, 
  hasFile, 
  hasAnalyzed,
  insumosExtra = 0, 
  onInsumosExtraChange, 
  onReset,
}) => {
  const { ajustes, updateAjustes } = useAjustes();
  const { perfilActivo } = usePerfilActivo();
  const [form, setForm] = React.useState<Ajustes>(DEFAULT_AJUSTES);

  React.useEffect(() => {
    if (ajustes) setForm(ajustes);
  }, [ajustes]);

  const hasResult = !!resultado && (resultado.horas > 0 || resultado.gramos > 0);

  const handleAnalyzeAndSave = () => {
    updateAjustes(form);
    onAnalyze?.();
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6 border-b border-[var(--border-subtle)] pb-4">
        <span className="text-[10px] font-bold uppercase text-muted-foreground">Análisis de Producción</span>
        <div className="flex items-center gap-2">
          {ajustes && hasResult && !isAnalyzing && (
            <span className="text-[10px] font-bold bg-muted/30 px-2 py-1 rounded text-muted-foreground">
              ERROR: {ajustes.margenError}%
            </span>
          )}
          {hasResult && onReset && (
            <button onClick={onReset}
              className="size-6 rounded-full bg-muted/30 hover:bg-muted/30 flex items-center justify-center transition-colors"
              title="Volver atrás">
              <X size={12} className="text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {isAnalyzing ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-muted-foreground py-12">
          <div className="size-8 border-2 border-foreground/10 border-t-foreground rounded-full animate-spin" />
          <span className="text-[13px] font-semibold tracking-tight">Calculando costos...</span>
        </div>
      ) : hasResult && resultado ? (
        <ResultadosBreakdown
          resultado={resultado}
          insumosExtra={insumosExtra}
          onInsumosExtraChange={onInsumosExtraChange}
          onSaveToLibrary={onSaveToLibrary}
          isSavingToLibrary={isSavingToLibrary}
          perfilNombre={perfilActivo?.nombre || 'Perfil Estándar'}
          multiplicador={ajustes?.multiplicador || 3}
        />
      ) : (
        <AjustesGlobalesForm
          form={form}
          onChange={setForm}
          isAnalyzing={!!isAnalyzing}
          hasFile={!!hasFile}
          onAnalyze={handleAnalyzeAndSave}
        />
      )}
    </div>
  );
};
