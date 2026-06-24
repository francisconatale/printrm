import React from 'react';
import { createPortal } from 'react-dom';
import { Check, Library, Calculator, FileText, Clock, DollarSign } from 'lucide-react';
import { useModalOverlay } from '../../../hooks/useModalOverlay';

interface CalculationSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToLibrary: () => void;
  onNewCalculation: () => void;
  summaryData: {
    nombre: string;
    tiempoFormatted: string;
    precio: string;
  };
}

export function CalculationSuccessModal({
  isOpen,
  onClose,
  onGoToLibrary,
  onNewCalculation,
  summaryData
}: CalculationSuccessModalProps) {
  useModalOverlay(isOpen, onClose);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-[450px] bg-background border rounded-[var(--radius-xl)] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] p-8 relative animate-in zoom-in-95 duration-300 z-10">
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-500 rounded-full flex items-center justify-center mb-4">
            <Check className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-semibold mb-1">¡Cálculo Guardado!</h2>
          <p className="text-muted-foreground text-sm">Tu pieza ha sido añadida a la biblioteca exitosamente.</p>
        </div>
        
        {/* Resumen del cálculo */}
        <div className="bg-accent/40 rounded-xl p-4 mb-8">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Resumen del Cálculo
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Nombre:</span>
              <span className="font-medium truncate max-w-[200px]" title={summaryData.nombre}>
                {summaryData.nombre}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground flex items-center gap-1.5"><Clock className="w-4 h-4"/> Tiempo:</span>
              <span className="font-medium">{summaryData.tiempoFormatted}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground flex items-center gap-1.5"><DollarSign className="w-4 h-4"/> Venta (x3):</span>
              <span className="font-bold text-primary">{summaryData.precio}</span>
            </div>
          </div>
        </div>
        
        {/* Acciones */}
        <p className="text-sm font-medium mb-3 text-center">¿Qué te gustaría hacer ahora?</p>
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={onGoToLibrary}
            className="p-3 border rounded-xl hover:bg-accent font-medium text-sm transition-colors flex items-center justify-center gap-2"
          >
            <Library className="w-4 h-4" />
            Ir a Biblioteca
          </button>
          <button 
            onClick={onNewCalculation}
            className="p-3 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <Calculator className="w-4 h-4" />
            Nuevo Cálculo
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
