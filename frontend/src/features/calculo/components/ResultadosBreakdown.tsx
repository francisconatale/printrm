import React from 'react';
import { Plus, Percent } from 'lucide-react';
import { ResultadoCalculo } from '../types/calculo.types';
import { formatCurrency } from '../../../lib/utils';

interface ResultadosBreakdownProps {
  resultado: ResultadoCalculo;
  insumosExtra?: number;
  onInsumosExtraChange?: (v: number) => void;
  multiplicador?: number;
  onMultiplicadorChange?: (v: number) => void;
  onSave: () => void;
  isSaving?: boolean;
  onSaveToLibrary?: () => void;
  isSavingToLibrary?: boolean;
}

export const ResultadosBreakdown: React.FC<ResultadosBreakdownProps> = ({
  resultado,
  insumosExtra = 0,
  onInsumosExtraChange,
  multiplicador = 3,
  onMultiplicadorChange,
  onSave,
  isSaving,
  onSaveToLibrary,
  isSavingToLibrary,
}) => {
  const [showInsumos, setShowInsumos] = React.useState(false);

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

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <button onClick={() => setShowInsumos(!showInsumos)}
                className="size-5 rounded-full bg-muted/30 hover:bg-muted/30 flex items-center justify-center transition-colors"
                title="Añadir insumos extra">
                <Plus size={10} className="text-muted-foreground" />
              </button>
              <span className="studio-caption text-muted-foreground">Insumos Extra</span>
            </div>
            {showInsumos ? (
              <div className="flex items-center gap-1">
                <input type="number" value={insumosExtra || ''}
                  onChange={(e) => onInsumosExtraChange?.(parseFloat(e.target.value) || 0)}
                  className="w-20 text-right bg-transparent border-b border-border studio-caption font-semibold outline-none focus:border-primary" placeholder="0" autoFocus />
              </div>
            ) : (
              <span className="studio-caption font-semibold text-foreground">{formatCurrency(insumosExtra)}</span>
            )}
          </div>

          <div className="flex justify-between items-center border-t border-[var(--border-subtle)] pt-4">
            <span className="studio-caption text-foreground font-bold">Costo Base Final</span>
            <span className="text-xl font-bold text-foreground font-mono">{formatCurrency(resultado.costoBase)}</span>
          </div>
        </div>
      </div>

      <button onClick={onSave} disabled={isSaving || resultado.subtotal === 0}
        className="studio-button-primary !w-full mt-6 !py-3 text-[13px] font-bold">
        {isSaving ? 'Guardando...' : 'Guardar en Historial'}
      </button>

      <button onClick={onSaveToLibrary} disabled={isSavingToLibrary || resultado.subtotal === 0}
        className="studio-button-secondary-pill !w-full mt-3 !py-3 text-[13px] font-bold border-zinc-200 text-zinc-600 hover:border-zinc-800 hover:text-zinc-800">
        {isSavingToLibrary ? 'Guardando...' : 'Añadir a Biblioteca'}
      </button>
    </>
  );
};
