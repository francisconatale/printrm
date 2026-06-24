import React from 'react';
import { PiezaSTL } from '../types/biblioteca.types';
import { Modal } from '../../../components/ui/modal';
import { STLPreview } from './STLPreview';

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
      title=""
      isOpen={isOpen}
      onClose={onClose}
      size="5xl"
    >
      <div className="bg-background text-foreground w-full font-serif mt-4 pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: 3D Viewport */}
          <div className="lg:col-span-8 h-[550px] bg-muted/20 dark:bg-muted/5 flex flex-col items-center justify-center relative overflow-hidden rounded-md border border-border/50">
            <div className="absolute top-8 left-8 z-10 pointer-events-none">
              <h2 className="text-4xl tracking-tight font-light mb-2">{pieza.nombre}</h2>
              <p className="text-muted-foreground font-sans text-sm tracking-widest uppercase">ID: {pieza.id?.split('-')[0] || 'N/A'}</p>
            </div>
            <div className="absolute inset-0">
              <STLPreview url={stlUrl} />
            </div>
          </div>

          {/* Right: Specs (Minimalist / Editorial) */}
          <div className="lg:col-span-4 flex flex-col font-sans">
            
            <div className="space-y-8 flex-1 pt-8">
               <div>
                 <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Peso / Masa</p>
                 <div className="text-2xl font-light">{pieza.pesoGramos || 0}g</div>
               </div>

               <div>
                 <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Tiempo Estimado</p>
                 <div className="text-2xl font-light">{pieza.tiempoEstimado || '-'}</div>
               </div>

               <div className="pt-8 border-t border-border/50">
                 <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-4">Hardware & Material</p>
                 <div className="space-y-4">
                   <div>
                     <p className="text-xs font-medium text-foreground">{pieza.perfilImpresoraNombre || 'N/A'}</p>
                     <p className="text-xs text-muted-foreground">Impresora</p>
                   </div>
                   <div>
                     <p className="text-xs font-medium text-foreground">{pieza.perfilFilamentoNombre || 'N/A'}</p>
                     <p className="text-xs text-muted-foreground">Perfil de Material</p>
                   </div>
                 </div>
               </div>
            </div>

            {/* Cost Breakdown */}
            <div className="mt-12 pt-8 border-t border-foreground/20">
               <div className="flex justify-between items-end mb-4">
                 <p className="text-xs font-bold text-foreground uppercase tracking-widest">Costo Est.</p>
                 <div className="text-4xl font-light">{formatCurrency(pieza.costoBase)}</div>
               </div>
               <div className="space-y-2 text-xs text-muted-foreground">
                 <div className="flex justify-between"><span>Material</span><span>{formatCurrency(pieza.costoMaterial)}</span></div>
                 <div className="flex justify-between"><span>Energía</span><span>{formatCurrency(pieza.costoEnergia)}</span></div>
                 {!!pieza.costoError && pieza.costoError > 0 && (
                   <div className="flex justify-between"><span>Margen de Error</span><span>{formatCurrency(pieza.costoError)}</span></div>
                 )}
               </div>
            </div>

          </div>
        </div>
      </div>
    </Modal>
  );
};
