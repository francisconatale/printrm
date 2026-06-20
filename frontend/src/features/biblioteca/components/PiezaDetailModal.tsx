import React from 'react';
import { PiezaSTL } from '../types/biblioteca.types';
import { Modal } from '../../../components/ui/modal';
import { STLPreview } from './STLPreview';
import { Box, Scale, Clock, Cpu, Printer, Layers, Info } from 'lucide-react';

interface PiezaDetailModalProps {
  pieza: PiezaSTL | null;
  isOpen: boolean;
  onClose: () => void;
}

const formatCurrency = (value?: number) => {
  if (value === undefined || value === null) return '$0';
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value);
};

export const PiezaDetailModal: React.FC<PiezaDetailModalProps> = ({ pieza, isOpen, onClose }) => {
  if (!pieza) return null;

  const stlUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/v1/biblioteca/files/${pieza.filePath}`;

  return (
    <Modal
      title={pieza.nombre}
      isOpen={isOpen}
      onClose={onClose}
      size="5xl"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-1 pb-2">
        {/* Lado izquierdo: Previsualización 3D estilo App Store Viewport */}
        <div className="lg:col-span-6 h-[340px] bg-slate-50/50 dark:bg-zinc-900/30 rounded-[1.75rem] overflow-hidden relative border border-slate-200/50 dark:border-zinc-800/40 flex items-center justify-center transition-all shadow-sm">
          <div className="absolute inset-0">
            <STLPreview url={stlUrl} />
          </div>
        </div>

        {/* Lado derecho: Ficha Técnica + Desglose de Costos (iOS Settings Layout) */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-3.5">
          
          {/* Grupo de Especificaciones y Configuración */}
          <div className="space-y-3.5">
            {/* Especificaciones - iOS Grouped List Style */}
            <div>
              <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest px-1 mb-1">Especificaciones</p>
              
              <div className="bg-zinc-50/50 dark:bg-zinc-900/20 border border-slate-200/50 dark:border-zinc-800/40 rounded-2xl overflow-hidden divide-y divide-slate-200/40 dark:divide-zinc-800/40">
                {/* Peso */}
                {pieza.pesoGramos && (
                  <div className="flex items-center justify-between px-3.5 py-2 hover:bg-slate-100/30 dark:hover:bg-zinc-800/10 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="size-7 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
                        <Scale size={13} />
                      </div>
                      <span className="text-xs font-medium text-slate-700 dark:text-zinc-300">Peso</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-900 dark:text-zinc-100">{pieza.pesoGramos}g</span>
                  </div>
                )}

                {/* Tiempo */}
                {pieza.tiempoEstimado && (
                  <div className="flex items-center justify-between px-3.5 py-2 hover:bg-slate-100/30 dark:hover:bg-zinc-800/10 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="size-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                        <Clock size={13} />
                      </div>
                      <span className="text-xs font-medium text-slate-700 dark:text-zinc-300">Tiempo</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-900 dark:text-zinc-100">{pieza.tiempoEstimado}</span>
                  </div>
                )}

                {/* Volumen */}
                {pieza.volumenCm3 && (
                  <div className="flex items-center justify-between px-3.5 py-2 hover:bg-slate-100/30 dark:hover:bg-zinc-800/10 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="size-7 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                        <Layers size={13} />
                      </div>
                      <span className="text-xs font-medium text-slate-700 dark:text-zinc-300">Volumen</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-900 dark:text-zinc-100">{pieza.volumenCm3.toFixed(2)} cm³</span>
                  </div>
                )}

                {/* Material */}
                {pieza.perfilFilamentoNombre && (
                  <div className="flex items-center justify-between px-3.5 py-2 hover:bg-slate-100/30 dark:hover:bg-zinc-800/10 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="size-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                        <Cpu size={13} />
                      </div>
                      <span className="text-xs font-medium text-slate-700 dark:text-zinc-300">Material</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-900 dark:text-zinc-100 truncate max-w-[180px]" title={pieza.perfilFilamentoNombre}>
                      {pieza.perfilFilamentoNombre}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Impresora & Perfiles - iOS Grouped List Style */}
            {(pieza.perfilImpresoraNombre || pieza.perfilImpresionNombre) && (
              <div>
                <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest px-1 mb-1">Configuración de Impresión</p>
                
                <div className="bg-zinc-50/50 dark:bg-zinc-900/20 border border-slate-200/50 dark:border-zinc-800/40 rounded-2xl overflow-hidden divide-y divide-slate-200/40 dark:divide-zinc-800/40">
                  {/* Impresora */}
                  {pieza.perfilImpresoraNombre && (
                    <div className="flex items-center justify-between px-3.5 py-2 hover:bg-slate-100/30 dark:hover:bg-zinc-800/10 transition-colors">
                      <div className="flex items-center gap-2.5">
                        <div className="size-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                          <Printer size={13} />
                        </div>
                        <span className="text-xs font-medium text-slate-700 dark:text-zinc-300">Impresora</span>
                      </div>
                      <span className="text-xs font-semibold text-slate-900 dark:text-zinc-100">{pieza.perfilImpresoraNombre}</span>
                    </div>
                  )}

                  {/* Perfil Impresión */}
                  {pieza.perfilImpresionNombre && (
                    <div className="flex items-center justify-between px-3.5 py-2 hover:bg-slate-100/30 dark:hover:bg-zinc-800/10 transition-colors">
                      <div className="flex items-center gap-2.5">
                        <div className="size-7 rounded-lg bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 flex items-center justify-center shrink-0">
                          <Layers size={13} />
                        </div>
                        <span className="text-xs font-medium text-slate-700 dark:text-zinc-300">Perfil</span>
                      </div>
                      <span className="text-xs font-semibold text-slate-900 dark:text-zinc-100">{pieza.perfilImpresionNombre}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Desglose de Costos estilo Premium iOS Dark Glass */}
          <div className="bg-zinc-950/90 dark:bg-zinc-900/90 backdrop-blur-md text-white rounded-2xl p-4 shadow-md border border-zinc-800/50 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
                Desglose de Costo Estimado
              </h4>
              <Info size={11} className="text-zinc-500 cursor-pointer hover:text-zinc-400" />
            </div>

            <div className="space-y-2 pt-0.5">
              <div className="flex justify-between items-center text-xs text-zinc-300">
                <span className="font-medium text-[11px]">Costo de Material (Filamento)</span>
                <span className="font-bold text-[11px]">{formatCurrency(pieza.costoMaterial)}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-zinc-300">
                <span className="font-medium text-[11px]">Consumo de Energía</span>
                <span className="font-bold text-[11px]">{formatCurrency(pieza.costoEnergia)}</span>
              </div>
              
              <div className="border-t border-zinc-800 pt-2.5 flex justify-between items-end">
                <div>
                  <span className="text-[8px] uppercase font-bold text-zinc-500 tracking-wider block">Costo de Producción</span>
                  <span className="text-xl font-bold tracking-tight text-white">{formatCurrency(pieza.costoBase)}</span>
                </div>
                <div className="text-[9px] text-zinc-500 italic pb-0.5">
                  * Margen de error incluido
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Modal>
  );
};

