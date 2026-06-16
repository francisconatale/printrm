import React from 'react';
import { Ajustes } from '../../ajustes/types/ajustes.types';
import { AjustesFormFields } from '../../ajustes/components/AjustesFormFields';

interface AjustesGlobalesFormProps {
  form: Ajustes;
  onChange: (form: Ajustes) => void;
  isAnalyzing: boolean;
  hasFile: boolean;
  onAnalyze?: () => void;
}

export const AjustesGlobalesForm: React.FC<AjustesGlobalesFormProps> = ({
  form,
  onChange,
  isAnalyzing,
  hasFile,
  onAnalyze,
}) => {
  return (
    <div className="flex-1 overflow-y-auto space-y-5">
      <div className="space-y-1">
        <h3 className="text-[10px] font-bold uppercase text-muted-foreground">Parámetros Globales (Electricidad)</h3>
        <p className="text-[10px] text-muted-foreground">Configuraciones de precio regionales y márgenes generales.</p>
      </div>

      <AjustesFormFields value={form} onChange={onChange} />

      {hasFile && !isAnalyzing ? (
        <button onClick={onAnalyze}
          className="w-full py-3 bg-primary text-white rounded-full text-[13px] font-bold hover:opacity-85 active:scale-95 transition-all">
          Analizar modelo
        </button>
      ) : null}
    </div>
  );
};
