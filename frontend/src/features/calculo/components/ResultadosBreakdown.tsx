import React from 'react';
import { Plus } from 'lucide-react';
import { ResultadoCalculo } from '../types/calculo.types';
import { formatCurrency } from '../../../lib/utils';
import { Button } from '../../../components/ui/button';

interface ResultadosBreakdownProps {
  resultado: ResultadoCalculo;
  insumosExtra?: number;
  onInsumosExtraChange?: (v: number) => void;
  multiplicador?: number;
  onMultiplicadorChange?: (v: number) => void;
  onSaveToLibrary?: () => void;
  isSavingToLibrary?: boolean;
  perfilNombre?: string;
}

export const ResultadosBreakdown: React.FC<ResultadosBreakdownProps> = ({
  resultado,
  insumosExtra = 0,
  onInsumosExtraChange,
  multiplicador = 3,
  onSaveToLibrary,
  isSavingToLibrary,
  perfilNombre = 'Perfil Estándar'
}) => {
  const [showInsumos, setShowInsumos] = React.useState(false);
  const [localInsumos, setLocalInsumos] = React.useState(insumosExtra?.toString() || '');

  React.useEffect(() => {
    setLocalInsumos(insumosExtra?.toString() || '');
  }, [insumosExtra]);

  return (
    <>
      <div className="space-y-4 flex-1 overflow-y-auto">
        <div className="grid grid-cols-2 gap-4 pb-6 border-b border-[var(--border-subtle)]">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase text-muted-foreground">Tiempo</span>
            <p className="text-lg studio-caption font-bold text-foreground">
              {resultado.horas}h {resultado.minutosAdicionales}m
            </p>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase text-muted-foreground">Material</span>
            <p className="text-lg studio-caption font-bold text-foreground">
              {resultado.gramos}g
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex justify-between items-center">
            <span className="studio-caption text-muted-foreground">Costo Energía</span>
            <span className="studio-caption font-semibold text-foreground">{formatCurrency(resultado.costoEnergia)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="studio-caption text-muted-foreground">Costo Filamento</span>
            <span className="studio-caption font-semibold text-foreground">{formatCurrency(resultado.costoFilamento)}</span>
          </div>

          {resultado.costoError > 0 && (
            <div className="flex justify-between items-center">
              <span className="studio-caption text-muted-foreground">Margen de Error</span>
              <span className="studio-caption font-semibold text-foreground">{formatCurrency(resultado.costoError)}</span>
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="studio-caption text-muted-foreground">Insumos Extra</span>
            <div className="flex items-center gap-1">
              <span className="studio-caption font-semibold text-muted-foreground">$</span>
              <input type="number" value={localInsumos}
                onChange={(e) => setLocalInsumos(e.target.value)}
                onBlur={() => onInsumosExtraChange?.(parseFloat(localInsumos) || 0)}
                className="w-16 text-right bg-transparent border-b border-border hover:border-muted-foreground focus:border-primary outline-none transition-colors studio-caption font-semibold" placeholder="0" />
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-[var(--border-subtle)] pt-4">
            <span className="studio-caption text-foreground font-bold">Costo Base Final</span>
            <span className="text-xl font-bold text-foreground">{formatCurrency(resultado.costoBase)}</span>
          </div>
        </div>

      </div>

      <Button
        variant="primary"
        size="md"
        className="!w-full mt-3"
        onClick={onSaveToLibrary}
        disabled={isSavingToLibrary || resultado.subtotal === 0}
        isLoading={isSavingToLibrary}
      >
        Añadir a Biblioteca
      </Button>
    </>
  );
};
