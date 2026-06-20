import React from 'react';
import { PiezaSTL } from '../types/biblioteca.types';
import { Modal } from '../../../components/ui/modal';
import { STLPreview } from './STLPreview';
import { Box, Sparkles, Scale, Clock, Cpu, Printer, Layers } from 'lucide-react';

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
      description="Detalles técnicos y desglose detallado de costos de producción."
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        {/* Lado izquierdo: Previsualización 3D */}
        <div className="aspect-square bg-[#f5f5f7] rounded-3xl overflow-hidden relative border border-border/40 flex items-center justify-center min-h-[300px]">
          <div className="absolute inset-0">
            <STLPreview url={stlUrl} />
          </div>
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white text-[9px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 pointer-events-none uppercase tracking-wider">
            Vista Interactiva 3D
          </div>
        </div>

        {/* Lado derecho: Metadatos y Desglose de Costo */}
        <div className="flex flex-col justify-between space-y-6">
          {/* Ficha Técnica */}
          <div className="space-y-4">
            <h3 className="studio-caption font-bold text-foreground flex items-center gap-2 border-b border-border/60 pb-2">
              <Box size={14} className="text-zinc-600" /> Ficha Técnica
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              {pieza.pesoGramos && (
                <div className="bg-muted/5 border border-border/40 rounded-2xl p-3 flex items-center gap-3">
                  <div className="size-8 rounded-xl bg-white border border-border/50 flex items-center justify-center text-zinc-500 shrink-0">
                    <Scale size={14} />
                  </div>
                  <div>
                    <span className="text-[9px] text-muted-foreground block uppercase font-bold tracking-tight">Peso</span>
                    <span className="text-xs font-mono font-bold text-foreground">{pieza.pesoGramos}g</span>
                  </div>
                </div>
              )}
              {pieza.tiempoEstimado && (
                <div className="bg-muted/5 border border-border/40 rounded-2xl p-3 flex items-center gap-3">
                  <div className="size-8 rounded-xl bg-white border border-border/50 flex items-center justify-center text-zinc-500 shrink-0">
                    <Clock size={14} />
                  </div>
                  <div>
                    <span className="text-[9px] text-muted-foreground block uppercase font-bold tracking-tight">Tiempo</span>
                    <span className="text-xs font-mono font-bold text-foreground">{pieza.tiempoEstimado}</span>
                  </div>
                </div>
              )}
              {pieza.volumenCm3 && (
                <div className="bg-muted/5 border border-border/40 rounded-2xl p-3 flex items-center gap-3">
                  <div className="size-8 rounded-xl bg-white border border-border/50 flex items-center justify-center text-zinc-500 shrink-0">
                    <Layers size={14} />
                  </div>
                  <div>
                    <span className="text-[9px] text-muted-foreground block uppercase font-bold tracking-tight">Volumen</span>
                    <span className="text-xs font-mono font-bold text-foreground">{pieza.volumenCm3.toFixed(2)} cm³</span>
                  </div>
                </div>
              )}
              {pieza.perfilFilamentoNombre && (
                <div className="bg-muted/5 border border-border/40 rounded-2xl p-3 flex items-center gap-3 col-span-2 md:col-span-1">
                  <div className="size-8 rounded-xl bg-white border border-border/50 flex items-center justify-center text-zinc-500 shrink-0">
                    <Cpu size={14} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] text-muted-foreground block uppercase font-bold tracking-tight">Material</span>
                    <span className="text-xs font-bold text-foreground truncate block" title={pieza.perfilFilamentoNombre}>
                      {pieza.perfilFilamentoNombre}
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            {(pieza.perfilImpresoraNombre || pieza.perfilImpresionNombre) && (
              <div className="bg-muted/5 border border-border/40 rounded-2xl p-3 space-y-2">
                {pieza.perfilImpresoraNombre && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground flex items-center gap-1.5"><Printer size={12} /> Impresora:</span>
                    <span className="font-semibold text-foreground">{pieza.perfilImpresoraNombre}</span>
                  </div>
                )}
                {pieza.perfilImpresionNombre && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground flex items-center gap-1.5"><Layers size={12} /> Perfil Impresión:</span>
                    <span className="font-semibold text-foreground">{pieza.perfilImpresionNombre}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desglose de Costos */}
          <div className="bg-[#1d1d1f] text-white rounded-3xl p-5 shadow-xl relative overflow-hidden space-y-4">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles size={100} strokeWidth={1} />
            </div>
            
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              Desglose de Costo Estimado
            </h4>

            <div className="space-y-2.5 pt-2">
              <div className="flex justify-between items-center text-xs text-zinc-300">
                <span>Costo de Material (Filamento)</span>
                <span className="font-mono font-semibold">{formatCurrency(pieza.costoMaterial)}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-zinc-300">
                <span>Consumo de Energía</span>
                <span className="font-mono font-semibold">{formatCurrency(pieza.costoEnergia)}</span>
              </div>
              <div className="border-t border-zinc-800 pt-3 flex justify-between items-end">
                <div>
                  <span className="text-[9px] uppercase font-bold text-zinc-400 tracking-tight block">Costo Total</span>
                  <span className="text-2xl font-bold font-mono tracking-tight text-white">{formatCurrency(pieza.costoBase)}</span>
                </div>
                <div className="text-[10px] text-zinc-400 italic">
                  * Incluye margen de error
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-border/40">
        <button onClick={onClose} className="studio-button-secondary-pill px-6 py-2.5">
          Cerrar
        </button>
      </div>
    </Modal>
  );
};
