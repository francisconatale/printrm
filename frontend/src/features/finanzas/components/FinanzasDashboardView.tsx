import React from 'react';
import { useGetTransacciones } from '../api/finanzas.api';
import { StudioSubNav } from '../../../components/layout/studio-sub-nav';
import { FinanzasDashboard } from './FinanzasDashboard';
import { QueryErrorView } from '../../../components/ui/query-error-view';

export function FinanzasDashboardView() {
  const { refetch: refetchTransacciones, isError, error } = useGetTransacciones(0, 1);

  const refetchAll = () => {
    refetchTransacciones();
  };

  return (
    <div className="flex flex-col w-full bg-background min-h-full">
      <StudioSubNav />

      <main className="flex-1 px-8 md:px-12 py-10 overflow-y-auto custom-scrollbar">
        <div className="max-w-[1400px] mx-auto space-y-8">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
            <div className="space-y-2">
              <h1 className="studio-display-md tracking-tight text-foreground">Finanzas & Negocio</h1>
              <p className="studio-body text-muted-foreground">Control de flujo de caja, mermas, rentabilidad y egresos manuales.</p>
            </div>
          </div>

          {isError ? (
            <QueryErrorView error={error} refetch={refetchAll} />
          ) : (
            <FinanzasDashboard onOpenNewTransaction={() => {}} refetchAll={refetchAll} />
          )}
        </div>
      </main>

    </div>
  );
}
