import React from 'react';
import { X } from 'lucide-react';
import { ResultadoCalculo } from '../types/calculo.types';
import { useAjustes } from '../../ajustes/hooks/useAjustes';
import { Ajustes, DEFAULT_AJUSTES } from '../../ajustes/types/ajustes.types';
import { ResultadosBreakdown } from './ResultadosBreakdown';
import { AjustesGlobalesForm } from './AjustesGlobalesForm';

interface ResultadoPanelProps {
  resultado: ResultadoCalculo | null;
  onSave: () => void;
  isSaving?: boolean;
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
  onSave, 
  isSaving, 
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
  const [form, setForm] = React.useState<Ajustes>(DEFAULT_AJUSTES);

  React.useEffect(() => {
    if (ajustes) setForm(ajustes);
  }, [ajustes]);

  const hasResult = hasAnalyzed && resultado && (resultado.horas > 0 || resultado.gramos > 0);

  const handleAnalyzeAndSave = () => {
    updateAjustes(form);
    onAnalyze?.();
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6 border-b border-[var(--border-subtle)] pb-4">
        <span className="text-[10px] font-bold uppercase text-muted-foreground">Análisis de Producción</span>
        <div className="flex items-center gap-2">
          {ajustes && hasResult && (
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

      {hasResult && resultado ? (
        <ResultadosBreakdown
          resultado={resultado}
          insumosExtra={insumosExtra}
          onInsumosExtraChange={onInsumosExtraChange}
          onSave={onSave}
          isSaving={isSaving}
          onSaveToLibrary={onSaveToLibrary}
          isSavingToLibrary={isSavingToLibrary}
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
