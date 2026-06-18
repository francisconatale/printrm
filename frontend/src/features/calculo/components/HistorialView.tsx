import React from 'react';
import { StudioSubNav } from '../../../components/layout/studio-sub-nav';
import { HistorialTable } from './HistorialTable';
import { useClearHistorial } from '../api/historial.api';
import { Trash2 } from 'lucide-react';
import { ConfirmModal } from '../../../components/ui/confirm-modal';

import { CalculoSnapshot } from '../types/calculo.types';

interface HistorialViewProps {
  onSelect?: (item: CalculoSnapshot) => void;
}

export function HistorialView({ onSelect }: HistorialViewProps) {
  const { mutate: clearHistorial, isPending } = useClearHistorial();
  const [showConfirm, setShowConfirm] = React.useState(false);

  return (
    <div className="flex flex-col w-full bg-background min-h-full">
      <StudioSubNav />

      <main className="flex-1 overflow-hidden">
        <section className="px-8 md:px-12 py-8 bg-background h-full overflow-y-auto custom-scrollbar">
          <div className="max-w-[1400px] w-full mx-auto space-y-8">
            
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[24px] font-bold tracking-tight text-foreground">Historial de Cálculos</h2>
                <p className="text-[13px] text-muted-foreground mt-1">
                  Revisá y gestioná tus presupuestos pasados.
                </p>
              </div>
              
              <button
                onClick={() => setShowConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-all text-[12px] font-bold"
              >
                <Trash2 size={14} />
                Limpiar Historial
              </button>
            </div>

            <HistorialTable onSelect={onSelect} />

          </div>
        </section>
      </main>

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => {
          clearHistorial();
          setShowConfirm(false);
        }}
        title="¿Limpiar historial?"
        description="Esta acción eliminará todos los cálculos guardados de forma permanente. No se puede deshacer."
        confirmText="Limpiar todo"
        variant="destructive"
        isLoading={isPending}
      />
    </div>
  );
}
