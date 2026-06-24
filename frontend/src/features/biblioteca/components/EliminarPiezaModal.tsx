import React from 'react';
import { Box } from 'lucide-react';
import { ConfirmModal } from '../../../components/ui/confirm-modal';
import { PiezaSTL } from '../types/biblioteca.types';

interface EliminarPiezaModalProps {
  pieza: PiezaSTL | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function EliminarPiezaModal({ pieza, isOpen, onClose, onConfirm, isLoading }: EliminarPiezaModalProps) {
  if (!isOpen || !pieza) return null;

  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      isLoading={isLoading}
      title={pieza.nombre}
      confirmLabel="Eliminar pieza"
      cancelLabel="Cancelar"
      variant="destructive"
      description={
        <div className="space-y-4">
          {/* Preview header */}
          <div className="h-32 bg-muted relative flex items-center justify-center overflow-hidden rounded-xl">
            {pieza.imagenBase64 ? (
              <img
                src={pieza.imagenBase64}
                alt={pieza.nombre}
                className="w-full h-full object-contain p-4"
              />
            ) : (
              <Box size={48} strokeWidth={1} className="text-muted-foreground/30" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          </div>

          {/* Piece identity */}
          <div>
            <h4 className="studio-body-strong">{pieza.nombre}</h4>
            {pieza.perfilFilamentoNombre && (
              <p className="text-[12px] text-muted-foreground uppercase tracking-wider font-semibold">
                {pieza.perfilFilamentoNombre}
              </p>
            )}
          </div>

          {/* Metadata summary */}
          <div className="flex gap-4 text-[11px]">
            {pieza.pesoGramos && (
              <div>
                <span className="text-muted-foreground block uppercase tracking-wide font-semibold">Peso</span>
                <span className="font-mono font-bold">{pieza.pesoGramos}g</span>
              </div>
            )}
            {pieza.tiempoEstimado && (
              <div>
                <span className="text-muted-foreground block uppercase tracking-wide font-semibold">Tiempo</span>
                <span className="font-mono font-bold">{pieza.tiempoEstimado}</span>
              </div>
            )}
            {pieza.costoBase && (
              <div>
                <span className="text-muted-foreground block uppercase tracking-wide font-semibold">Costo</span>
                <span className="font-mono font-bold">
                  {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(pieza.costoBase)}
                </span>
              </div>
            )}
          </div>
        </div>
      }
    />
  );
}
