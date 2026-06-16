import React from 'react';
import { Plus, Percent, X } from 'lucide-react';
import { ResultadoCalculo } from '../types/calculo.types';
import { useAjustes } from '../../ajustes/hooks/useAjustes';
import { Ajustes } from '../../ajustes/types/ajustes.types';

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
  multiplicador?: number;
  onMultiplicadorChange?: (v: number) => void;
  onReset?: () => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
};

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
  multiplicador = 3, 
  onMultiplicadorChange, 
  onReset,
}) => {
  const { ajustes, updateAjustes } = useAjustes();
  const [showInsumos, setShowInsumos] = React.useState(false);
  const [form, setForm] = React.useState<Ajustes>({
    preciokWh: 0,
    margenError: 10,
  });

  React.useEffect(() => {
    if (ajustes) setForm(ajustes);
  }, [ajustes]);

  const hasResult = hasAnalyzed && resultado && (resultado.horas > 0 || resultado.gramos > 0);
  const showSettings = !hasResult;

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
                <span className="studio-caption text-muted-foreground">Desgaste Máquina</span>
                <span className="studio-caption font-semibold text-foreground">{formatCurrency(resultado.costoDesgaste)}</span>
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
                <span className="studio-caption text-foreground font-bold">Costo Base</span>
                <span className="studio-caption font-bold text-foreground">{formatCurrency(resultado.costoBase)}</span>
              </div>

              <div className="mt-8 pt-8 border-t border-[var(--border-subtle)] flex flex-col items-center">
                <p className="text-[10px] font-bold uppercase text-muted-foreground mb-2">Precio Sugerido</p>
                <p className="text-4xl font-bold tracking-tight text-foreground mb-2">
                  {formatCurrency(resultado.precioVenta)}
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/20">
                  <button onClick={() => {
                    const vals = [2, 3, 4, 5];
                    const idx = vals.indexOf(multiplicador);
                    onMultiplicadorChange?.(vals[(idx + 1) % vals.length]);
                  }} className="size-4 rounded-full hover:bg-muted/30 flex items-center justify-center transition-colors"
                    title="Ajustar multiplicador de ganancia">
                    <Percent size={9} className="text-muted-foreground" />
                  </button>
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Markup: {multiplicador}x</span>
                </div>
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
      ) : (
        <div className="flex-1 overflow-y-auto space-y-5">
          {showSettings && (
            <>
              <div className="space-y-1">
                <h3 className="text-[10px] font-bold uppercase text-muted-foreground">Parámetros Globales (Electricidad)</h3>
                <p className="text-[10px] text-muted-foreground">Configuraciones de precio regionales y márgenes generales.</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">Precio Energía ($ / kWh)</label>
                  <input type="number" step="any" value={form.preciokWh || ''}
                    onChange={(e) => setForm(f => ({ ...f, preciokWh: parseFloat(e.target.value) || 0 }))}
                    className="w-full bg-transparent studio-caption font-semibold outline-none mt-1" placeholder="0" />
                </div>
                <div className="border-t border-border" />
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">Margen de Seguridad / Error (%)</label>
                  <input type="number" value={form.margenError || ''}
                    onChange={(e) => setForm(f => ({ ...f, margenError: parseFloat(e.target.value) || 0 }))}
                    className="w-full bg-transparent studio-caption font-semibold outline-none mt-1" placeholder="0" />
                  <p className="text-[10px] text-muted-foreground leading-relaxed mt-1">Se aplica sobre el subtotal de costos antes del multiplicador.</p>
                </div>
              </div>
            </>
          )}

          {isAnalyzing ? (
            <div className="flex items-center justify-center gap-3 text-muted-foreground py-6">
              <div className="size-5 border-2 border-foreground/10 border-t-foreground rounded-full animate-spin" />
              <span className="text-[13px] font-semibold">Analizando modelo...</span>
            </div>
          ) : hasFile ? (
            <button onClick={handleAnalyzeAndSave} disabled={isAnalyzing}
              className="w-full py-3 bg-primary text-white rounded-full text-[13px] font-bold hover:opacity-85 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
              Analizar modelo
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
};
