import React from 'react';
import { Ajustes } from '../../ajustes/types/ajustes.types';
import { AjustesFormFields } from '../../ajustes/components/AjustesFormFields';
import { Button } from '../../../components/ui/button';

interface AjustesGlobalesFormProps {
  form: Ajustes;
  onChange: (form: Ajustes) => void;
  isAnalyzing: boolean;
  hasFile: boolean;
  onAnalyze?: () => void;
  isAnalyzeDisabled?: boolean;
}

export const AjustesGlobalesForm: React.FC<AjustesGlobalesFormProps> = ({
  form,
  onChange,
  isAnalyzing,
  hasFile,
  onAnalyze,
  isAnalyzeDisabled,
}) => {
  return (
    <div className="flex-1 overflow-y-auto space-y-5">


      <AjustesFormFields value={form} onChange={onChange} />

      <div className="pt-4">
        {hasFile ? (
          <div className="space-y-2">
            <Button
              size="lg"
              className="w-full"
              onClick={onAnalyze}
              disabled={isAnalyzeDisabled}
              isLoading={isAnalyzing}
            >
              Calcular Cotización
            </Button>
            {isAnalyzeDisabled && !isAnalyzing && (
              <p className="text-center text-[10px] text-muted-foreground">
                Completa todos los parámetros para calcular
              </p>
            )}
          </div>
        ) : (
          isAnalyzeDisabled && (
            <p className="text-center text-[10px] text-muted-foreground">
              Completa todos los parámetros para calcular
            </p>
          )
        )}
      </div>
    </div>
  );
};
