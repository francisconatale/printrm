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

const inputCls = "w-full bg-[#f5f5f7]/50 border border-[#e0e0e0] rounded-xl px-4 py-3 text-[13px] font-mono outline-none focus:border-[#1d1d1f] focus:bg-white transition-all shadow-sm";

export const ResultadoPanel: React.FC<ResultadoPanelProps> = ({
  resultado, onSave, isSaving, onAnalyze, isAnalyzing, hasFile, hasAnalyzed,
  insumosExtra = 0, onInsumosExtraChange, multiplicador = 3, onMultiplicadorChange, onReset,
}) => {
  const { ajustes, updateAjustes, isUpdating } = useAjustes();
  const [showInsumos, setShowInsumos] = React.useState(false);
  const [ajustesDone, setAjustesDone] = React.useState(false);
  const [form, setForm] = React.useState<Ajustes>({
    filamentoPorKg: 0,
    preciokWh: 0,
    vidaUtilHoras: 10000,
    costoRepuestos: 0,
    margenError: 10,
  });

  React.useEffect(() => {
    if (ajustes) setForm(ajustes);
  }, [ajustes]);

  React.useEffect(() => {
    if (hasFile) setAjustesDone(true);
    if (!hasFile && !hasAnalyzed) setAjustesDone(false);
  }, [hasFile, hasAnalyzed]);

  const hasResult = hasAnalyzed && resultado && (resultado.horas > 0 || resultado.gramos > 0);
  const showAjustesForm = !hasFile && !hasResult && !ajustesDone;

  const handleConfirm = () => {
    updateAjustes(form);
    setAjustesDone(true);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6 border-b border-[#f0f0f0] pb-4">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#a1a1a1]">Análisis de Producción</span>
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

      {showAjustesForm ? (
        <div className="flex-1 overflow-y-auto space-y-6">
          <section className="space-y-4">
            <div className="pb-1">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a1a1a1]">Costos de Energía y Material</h3>
            </div>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold uppercase tracking-widest text-[#7a7a7a]">Filamento ($ / kg)</label>
                <div className="relative">
                  <input type="number" step="any" value={form.filamentoPorKg || ''}
                    onChange={(e) => setForm(f => ({ ...f, filamentoPorKg: parseFloat(e.target.value) || 0 }))}
                    className={inputCls} placeholder="0" />
                  <span className="absolute right-4 top-3 text-[9px] font-bold text-[#7a7a7a]">ARS/KG</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold uppercase tracking-widest text-[#7a7a7a]">Costo Energía ($ / kWh)</label>
                <div className="relative">
                  <input type="number" step="any" value={form.preciokWh || ''}
                    onChange={(e) => setForm(f => ({ ...f, preciokWh: parseFloat(e.target.value) || 0 }))}
                    className={inputCls} placeholder="0" />
                  <span className="absolute right-4 top-3 text-[9px] font-bold text-[#7a7a7a]">ARS/KWH</span>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="pb-1">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a1a1a1]">Hardware y Desgaste</h3>
            </div>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold uppercase tracking-widest text-[#7a7a7a]">Vida Útil (Horas)</label>
                <div className="relative">
                  <input type="number" value={form.vidaUtilHoras || ''}
                    onChange={(e) => setForm(f => ({ ...f, vidaUtilHoras: parseFloat(e.target.value) || 0 }))}
                    className={inputCls} placeholder="0" />
                  <span className="absolute right-4 top-3 text-[9px] font-bold text-[#7a7a7a]">HS</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold uppercase tracking-widest text-[#7a7a7a]">Repuestos ($)</label>
                <div className="relative">
                  <input type="number" value={form.costoRepuestos || ''}
                    onChange={(e) => setForm(f => ({ ...f, costoRepuestos: parseFloat(e.target.value) || 0 }))}
                    className={inputCls} placeholder="0" />
                  <span className="absolute right-4 top-3 text-[9px] font-bold text-[#7a7a7a]">ARS</span>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="pb-1">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a1a1a1]">Ajuste de Precisión</h3>
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold uppercase tracking-widest text-[#7a7a7a]">Margen de Error (%)</label>
              <div className="relative">
                <input type="number" value={form.margenError || ''}
                  onChange={(e) => setForm(f => ({ ...f, margenError: parseFloat(e.target.value) || 0 }))}
                  className={inputCls} placeholder="0" />
                <span className="absolute right-4 top-3 text-[9px] font-bold text-[#7a7a7a]">%</span>
              </div>
              <p className="text-[10px] text-[#7a7a7a] leading-relaxed">Se aplica sobre el subtotal de costos antes del multiplicador.</p>
            </div>
          </section>

          <button onClick={handleConfirm} disabled={isUpdating}
            className="w-full py-3 bg-[#1d1d1f] text-white rounded-full text-[13px] font-bold hover:bg-[#333] active:scale-95 transition-all disabled:opacity-30 shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
            {isUpdating ? 'Guardando...' : 'Confirmar'}
          </button>
        </div>
      ) : !hasResult ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 py-12">
          {isAnalyzing ? (
            <div className="flex items-center justify-center gap-3 text-[#7a7a7a]">
              <div className="size-5 border-2 border-[#1d1d1f]/10 border-t-[#1d1d1f] rounded-full animate-spin" />
              <span className="text-[13px] font-semibold">Analizando modelo...</span>
            </div>
          ) : hasFile ? (
            <button onClick={onAnalyze} disabled={isAnalyzing}
              className="w-full py-3 bg-[#1d1d1f] text-white rounded-full text-[13px] font-bold hover:bg-[#333] active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
              Analizar modelo
            </button>
          ) : (
            <p className="text-[12px] text-[#7a7a7a] text-center">Importá un modelo STL para comenzar</p>
          )}
        </div>
      ) : resultado ? (
        <>
          <div className="space-y-4 flex-1">
            <div className="grid grid-cols-2 gap-4 pb-6 border-b border-[#f0f0f0]">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#a1a1a1]">Tiempo</span>
                <p className="text-lg font-mono font-bold text-[#1d1d1f]">
                  {resultado.horas}h {resultado.minutosAdicionales}m
                </p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#a1a1a1]">Material</span>
                <p className="text-lg font-mono font-bold text-[#1d1d1f]">
                  {resultado.gramos}g
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center">
                <span className="text-[12px] text-[#7a7a7a] font-medium">Costo Energía</span>
                <span className="text-[12px] font-mono text-[#1d1d1f]">{formatCurrency(resultado.costoEnergia)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[12px] text-[#7a7a7a] font-medium">Costo Filamento</span>
                <span className="text-[12px] font-mono text-[#1d1d1f]">{formatCurrency(resultado.costoFilamento)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[12px] text-[#7a7a7a] font-medium">Desgaste Máquina</span>
                <span className="text-[12px] font-mono text-[#1d1d1f]">{formatCurrency(resultado.costoDesgaste)}</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <button onClick={() => setShowInsumos(!showInsumos)}
                    className="size-5 rounded-full bg-[#f5f5f7] hover:bg-[#e0e0e0] flex items-center justify-center transition-colors"
                    title="Añadir insumos extra">
                    <Plus size={10} className="text-[#7a7a7a]" />
                  </button>
                  <span className="text-[12px] text-[#7a7a7a] font-medium">Insumos Extra</span>
                </div>
                {showInsumos ? (
                  <div className="flex items-center gap-1">
                    <input type="number" value={insumosExtra || ''}
                      onChange={(e) => onInsumosExtraChange?.(parseFloat(e.target.value) || 0)}
                      className="w-20 text-right bg-transparent border-b border-[#e0e0e0] text-[12px] font-mono outline-none focus:border-[#1d1d1f]" placeholder="0" autoFocus />
                    <span className="text-[9px] font-bold text-[#7a7a7a]">ARS</span>
                  </div>
                ) : (
                  <span className="text-[12px] font-mono text-[#1d1d1f]">{formatCurrency(insumosExtra)}</span>
                )}
              </div>

              <div className="flex justify-between items-center border-t border-[#f0f0f0] pt-4">
                <span className="text-[12px] text-[#1d1d1f] font-bold">Costo Base</span>
                <span className="text-[12px] font-mono font-bold text-[#1d1d1f]">{formatCurrency(resultado.costoBase)}</span>
              </div>

              <div className="mt-8 pt-8 border-t-2 border-black/5 flex flex-col items-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a1a1a1] mb-2">Precio Sugerido</p>
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
      ) : null}
    </div>
  );
};
