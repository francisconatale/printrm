import React from 'react';
import { createPortal } from 'react-dom';
import { Trash2, Box } from 'lucide-react';
import { useModalOverlay } from '../../../hooks/useModalOverlay';
import { Button } from '../../../components/ui/button';
import { PiezaSTL } from '../types/biblioteca.types';

interface EliminarPiezaModalProps {
  pieza: PiezaSTL | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function EliminarPiezaModal({ pieza, isOpen, onClose, onConfirm, isLoading }: EliminarPiezaModalProps) {
  useModalOverlay(isOpen, onClose);

  if (!isOpen || !pieza) return null;

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="bg-background rounded-2xl max-w-md w-full shadow-[0_20px_50px_rgba(0,0,0,0.2)] animate-in zoom-in-95 duration-200 z-10 overflow-hidden">
        {/* Preview header */}
        <div className="h-32 bg-muted relative flex items-center justify-center overflow-hidden">
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

        <div className="p-6 space-y-5">
          {/* Piece identity */}
          <div>
            <h3 className="studio-body-strong text-lg">{pieza.nombre}</h3>
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

          {/* Warning */}
          <div className="bg-red-50/50 border border-red-100 rounded-xl p-3 flex items-start gap-3">
            <Trash2 size={16} className="text-red-500 mt-0.5 shrink-0" />
            <p className="text-[13px] text-red-700 leading-relaxed">
              Esta acción eliminará permanentemente <strong>{pieza.nombre}</strong> de la biblioteca. No se puede deshacer.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancelar
            </Button>
            <Button variant="destructive" size="sm" isLoading={isLoading} onClick={onConfirm}>
              Eliminar pieza
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
