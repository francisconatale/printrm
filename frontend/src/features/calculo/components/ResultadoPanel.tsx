import React from 'react';
import { Plus, Percent, X } from 'lucide-react';
import { ResultadoCalculo } from '../types/calculo.types';
import { useAjustes } from '../../ajustes/hooks/useAjustes';
import { Ajustes } from '../../ajustes/types/ajustes.types';

interface ResultadoPanelProps {
  resultado: ResultadoCalculo | null;
  onSave: () => void;
  isSaving?: boolean;
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
  resultado, onSave, isSaving, onAnalyze, isAnalyzing, hasFile, hasAnalyzed,
  insumosExtra = 0, onInsumosExtraChange, multiplicador = 3, onMultiplicadorChange, onReset,
}) => {
  const { ajustes, updateAjustes, isUpdating } = useAjustes();
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

  const handleSaveSettings = () => {
    updateAjustes(form);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6 border-b border-[#f0f0f0] pb-4">
        <span className="text-[10px] font-bold uppercase text-[#a1a1a1]">Análisis de Producción</span>
        <div className="flex items-center gap-2">
          {ajustes && hasResult && (
            <span className="text-[10px] font-bold bg-[#f5f5f7] px-2 py-1 rounded text-[#7a7a7a]">
              ERROR: {ajustes.margenError}%
            </span>
          )}
          {hasResult && onReset && (
            <button onClick={onReset}
              className="size-6 rounded-full bg-[#f5f5f7] hover:bg-[#e0e0e0] flex items-center justify-center transition-colors"
              title="Volver atrás">
              <X size={12} className="text-[#7a7a7a]" />
            </button>
          )}
        </div>
      </div>

      {hasResult && resultado ? (
        <>
          <div className="space-y-4 flex-1 overflow-y-auto">
            <div className="grid grid-cols-2 gap-4 pb-6 border-b border-[#f0f0f0]">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase text-[#a1a1a1]">Tiempo</span>
                <p className="text-lg studio-caption font-bold text-[#1d1d1f]">
                  {resultado.horas}h {resultado.minutosAdicionales}m
                </p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase text-[#a1a1a1]">Material</span>
                <p className="text-lg studio-caption font-bold text-[#1d1d1f]">
                  {resultado.gramos}g
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center">
                <span className="studio-caption text-[#7a7a7a]">Costo Energía</span>
                <span className="studio-caption font-semibold text-[#1d1d1f]">{formatCurrency(resultado.costoEnergia)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="studio-caption text-[#7a7a7a]">Costo Filamento</span>
                <span className="studio-caption font-semibold text-[#1d1d1f]">{formatCurrency(resultado.costoFilamento)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="studio-caption text-[#7a7a7a]">Desgaste Máquina</span>
                <span className="studio-caption font-semibold text-[#1d1d1f]">{formatCurrency(resultado.costoDesgaste)}</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <button onClick={() => setShowInsumos(!showInsumos)}
                    className="size-5 rounded-full bg-[#f5f5f7] hover:bg-[#e0e0e0] flex items-center justify-center transition-colors"
                    title="Añadir insumos extra">
                    <Plus size={10} className="text-[#7a7a7a]" />
                  </button>
                  <span className="studio-caption text-[#7a7a7a]">Insumos Extra</span>
                </div>
                {showInsumos ? (
                  <div className="flex items-center gap-1">
                    <input type="number" value={insumosExtra || ''}
                      onChange={(e) => onInsumosExtraChange?.(parseFloat(e.target.value) || 0)}
                      className="w-20 text-right bg-transparent border-b border-[#e0e0e0] studio-caption font-semibold outline-none focus:border-[#1d1d1f]" placeholder="0" autoFocus />
                  </div>
                ) : (
                  <span className="studio-caption font-semibold text-[#1d1d1f]">{formatCurrency(insumosExtra)}</span>
                )}
              </div>

              <div className="flex justify-between items-center border-t border-[#f0f0f0] pt-4">
                <span className="studio-caption text-[#1d1d1f] font-bold">Costo Base</span>
                <span className="studio-caption font-bold text-[#1d1d1f]">{formatCurrency(resultado.costoBase)}</span>
              </div>

              <div className="mt-8 pt-8 border-t-2 border-black/5 flex flex-col items-center">
                <p className="text-[10px] font-bold uppercase text-[#a1a1a1] mb-2">Precio Sugerido</p>
                <p className="text-4xl font-bold tracking-tight text-[#1d1d1f] mb-2">
                  {formatCurrency(resultado.precioVenta)}
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f5f5f7] border border-[#e0e0e0]">
                  <button onClick={() => {
                    const vals = [2, 3, 4, 5];
                    const idx = vals.indexOf(multiplicador);
                    onMultiplicadorChange?.(vals[(idx + 1) % vals.length]);
                  }} className="size-4 rounded-full hover:bg-[#e0e0e0] flex items-center justify-center transition-colors"
                    title="Ajustar multiplicador de ganancia">
                    <Percent size={9} className="text-[#7a7a7a]" />
                  </button>
                  <span className="text-[9px] font-bold text-[#7a7a7a] uppercase tracking-wider">Markup: {multiplicador}x</span>
                </div>
              </div>
            </div>
          </div>

          <button onClick={onSave} disabled={isSaving || resultado.subtotal === 0}
            className="studio-button-primary !w-full mt-6 !py-3 text-[13px] font-bold">
            {isSaving ? 'Guardando...' : 'Guardar en Historial'}
          </button>
        </>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-5">
          {showSettings && (
            <>
              <div className="space-y-1">
                <h3 className="text-[10px] font-bold uppercase text-[#a1a1a1]">Parámetros Globales (Electricidad)</h3>
                <p className="text-[10px] text-[#7a7a7a]">Configuraciones de precio regionales y márgenes generales.</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-[#7a7a7a]">Precio Energía ($ / kWh)</label>
                  <input type="number" step="any" value={form.preciokWh || ''}
                    onChange={(e) => setForm(f => ({ ...f, preciokWh: parseFloat(e.target.value) || 0 }))}
                    className="w-full bg-transparent studio-caption font-semibold outline-none mt-1" placeholder="0" />
                </div>
                <div className="border-t border-[#e0e0e0]" />
                <div>
                  <label className="text-[10px] font-bold uppercase text-[#7a7a7a]">Margen de Seguridad / Error (%)</label>
                  <input type="number" value={form.margenError || ''}
                    onChange={(e) => setForm(f => ({ ...f, margenError: parseFloat(e.target.value) || 0 }))}
                    className="w-full bg-transparent studio-caption font-semibold outline-none mt-1" placeholder="0" />
                  <p className="text-[10px] text-[#7a7a7a] leading-relaxed mt-1">Se aplica sobre el subtotal de costos antes del multiplicador.</p>
                </div>
              </div>
            </>
          )}

          {isAnalyzing ? (
            <div className="flex items-center justify-center gap-3 text-[#7a7a7a] py-6">
              <div className="size-5 border-2 border-[#1d1d1f]/10 border-t-[#1d1d1f] rounded-full animate-spin" />
              <span className="text-[13px] font-semibold">Analizando modelo...</span>
            </div>
          ) : hasFile ? (
            <button onClick={onAnalyze} disabled={isAnalyzing}
              className="w-full py-3 bg-[#1d1d1f] text-white rounded-full text-[13px] font-bold hover:bg-[#333] active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
              Analizar modelo
            </button>
          ) : null}

          {showSettings && (
            <button onClick={handleSaveSettings} disabled={isUpdating}
              className="w-full py-2 bg-[#f5f5f7] text-[#7a7a7a] rounded-full text-[11px] font-bold hover:bg-[#e0e0e0] active:scale-95 transition-all disabled:opacity-30">
              {isUpdating ? 'Guardando...' : 'Guardar Ajustes Globales'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
