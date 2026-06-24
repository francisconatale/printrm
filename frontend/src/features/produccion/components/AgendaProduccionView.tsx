import React from 'react';
import { 
  useGetOrdenesProduccion, 
  useUpdateEstadoOrden 
} from '../api/produccion.api';
import { StudioSubNav } from '../../../components/layout/studio-sub-nav';
import { CrearOrdenIndependienteModal } from './CrearOrdenIndependienteModal';
import { RegistrarMermaProduccionModal } from './RegistrarMermaProduccionModal';
import { 
  Hammer, 
  Plus, 
  Clock, 
  Play, 
  Check, 
  X,
  AlertTriangle
} from 'lucide-react';
import { PaginationBar } from '../../../components/ui/pagination-bar';
import { cn } from '@/lib/utils';
import { QueryErrorView } from '../../../components/ui/query-error-view';

export function AgendaProduccionView() {
  const [page, setPage] = React.useState(0);
  const { data: ordenesData, isLoading, isError, error, refetch } = useGetOrdenesProduccion(page, 10);
  const ordenes = ordenesData?.content;
  const totalPages = ordenesData?.totalPages ?? 0;
  const totalElements = ordenesData?.totalElements ?? 0;
  const { mutate: updateEstado, isPending: updating } = useUpdateEstadoOrden();

  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [filterType, setFilterType] = React.useState<'ALL' | 'COLA' | 'IMPRIMIENDO'>('ALL');
  const [mermaTarget, setMermaTarget] = React.useState<any>(null);

  const handleStatusChange = (id: string, nuevoEstado: any) => {
    updateEstado({ id, estado: nuevoEstado });
  };

  if (isError) {
    return (
      <div className="flex-1 flex flex-col min-h-screen bg-background">
        <StudioSubNav />
        <div className="flex-1 flex items-center justify-center p-8">
          <QueryErrorView error={error} refetch={refetch} />
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col min-h-screen bg-background animate-in fade-in">
        <StudioSubNav />
        <div className="flex-1 flex items-center justify-center">
          <Clock className="animate-spin text-muted-foreground" size={32} aria-hidden="true" />
        </div>
      </div>
    );
  }

  // Filtrar fuera las canceladas y completadas para la vista principal si queremos solo activas
  // Aunque capaz conviene dejarlas, pero el rediseño se enfocaba en "Cola" e "Imprimiendo" principalmente.
  // Vamos a dejar todo pero permitir filtrar.
  const baseOrders = (ordenes || []).filter(o => o.estado !== 'CANCELADO');
  
  const filteredOrdenes = baseOrders.filter((o) => {
    if (filterType === 'COLA' && o.estado !== 'COLA') return false;
    if (filterType === 'IMPRIMIENDO' && o.estado !== 'IMPRIMIENDO') return false;
    return true;
  });

  const countCola = baseOrders.filter(o => o.estado === 'COLA').length;
  const countImprimiendo = baseOrders.filter(o => o.estado === 'IMPRIMIENDO').length;

  return (
    <div className="flex flex-col w-full bg-[#f5f5f7] min-h-full animate-in fade-in duration-500 text-[#1d1d1f]">
      <StudioSubNav />

      <main className="flex-1 px-8 md:px-12 py-10 overflow-y-auto custom-scrollbar">
        <div className="max-w-[1200px] mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-[34px] font-semibold tracking-[-0.011em] flex items-center gap-3">
                <Hammer className="text-[#1d1d1f] shrink-0" size={32} aria-hidden="true" />
                <span>Agenda de Producción</span>
              </h1>
              <p className="text-[17px] text-[#7a7a7a]">
                Control estricto de las piezas en cola e impresión.
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 self-start sm:self-center px-5 py-2.5 bg-[#0066cc] text-white font-medium rounded-full hover:scale-95 transition-transform"
            >
              <Plus size={18} aria-hidden="true" />
              <span>Nueva Orden de Stock</span>
            </button>
          </div>

          {/* Tabla Principal */}
          <div className="bg-white rounded-[18px] border border-[#e0e0e0] overflow-hidden shadow-sm">
            <div className="p-5 border-b border-[#e0e0e0] flex items-center justify-between bg-white">
              <h2 className="text-[17px] font-semibold tracking-[-0.022em]">Cola de Producción</h2>
              <div className="flex gap-2">
                <button 
                  onClick={() => setFilterType('ALL')}
                  className={`px-3 py-1 rounded-full text-[12px] font-medium border transition-colors ${
                    filterType === 'ALL' ? 'bg-[#f5f5f7] text-[#1d1d1f] border-[#e0e0e0]' : 'border-transparent text-[#7a7a7a] hover:bg-[#f5f5f7]'
                  }`}
                >
                  Todas ({baseOrders.length})
                </button>
                <button 
                  onClick={() => setFilterType('COLA')}
                  className={`px-3 py-1 rounded-full text-[12px] font-medium border transition-colors ${
                    filterType === 'COLA' ? 'bg-[#f5f5f7] text-[#1d1d1f] border-[#e0e0e0]' : 'border-transparent text-[#7a7a7a] hover:bg-[#f5f5f7]'
                  }`}
                >
                  En Cola ({countCola})
                </button>
                <button 
                  onClick={() => setFilterType('IMPRIMIENDO')}
                  className={`px-3 py-1 rounded-full text-[12px] font-medium border transition-colors ${
                    filterType === 'IMPRIMIENDO' ? 'bg-[#f5f5f7] text-[#1d1d1f] border-[#e0e0e0]' : 'border-transparent text-[#7a7a7a] hover:bg-[#f5f5f7]'
                  }`}
                >
                  Imprimiendo ({countImprimiendo})
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#e0e0e0] bg-[#f5f5f7]/50">
                    <th className="py-3 px-6 text-[12px] font-medium text-[#7a7a7a] uppercase tracking-wider w-[50%]">Producto a Fabricar</th>
                    <th className="py-3 px-6 text-[12px] font-medium text-[#7a7a7a] uppercase tracking-wider text-center">Unidades</th>
                    <th className="py-3 px-6 text-[12px] font-medium text-[#7a7a7a] uppercase tracking-wider text-center">Estado</th>
                    <th className="py-3 px-6 text-[12px] font-medium text-[#7a7a7a] uppercase tracking-wider text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrdenes.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-[#7a7a7a]">
                        No hay órdenes para mostrar con los filtros actuales.
                      </td>
                    </tr>
                  ) : (
                    filteredOrdenes.map((o) => (
                      <tr key={o.id} className="border-b border-[#e0e0e0] last:border-0 hover:bg-[#f5f5f7] transition-colors group">
                        <td className="py-4 px-6 text-[17px] font-medium tracking-[-0.022em] text-[#1d1d1f]">
                          {o.productoNombre}
                        </td>
                        <td className="py-4 px-6 text-[17px] font-mono text-center">
                          {o.cantidad}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-[12px] font-medium border inline-flex items-center gap-1.5",
                            o.estado === 'IMPRIMIENDO' ? 'bg-[#0066cc]/10 text-[#0066cc] border-[#0066cc]/20' :
                            o.estado === 'COLA' ? 'bg-white text-[#333333] border-[#e0e0e0]' :
                            o.estado === 'COMPLETADO' ? 'bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/20' :
                            o.estado === 'MERMA' ? 'bg-red-500/10 text-red-600 border-red-500/20' :
                            'bg-[#f5f5f7] text-[#7a7a7a] border-transparent'
                          )}>
                            {o.estado === 'IMPRIMIENDO' && <span className="w-1.5 h-1.5 rounded-full bg-[#0066cc] animate-pulse" />}
                            {o.estado}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            {o.estado === 'COLA' && (
                              <>
                                <button 
                                  disabled={updating}
                                  onClick={() => handleStatusChange(o.id, 'IMPRIMIENDO')}
                                  className="text-[#0066cc] font-medium text-[14px] hover:underline flex items-center gap-1 disabled:opacity-50"
                                >
                                  <Play size={14} fill="currentColor" /> Iniciar
                                </button>
                                <button 
                                  disabled={updating}
                                  onClick={() => handleStatusChange(o.id, 'CANCELADO')}
                                  className="text-[#7a7a7a] hover:text-red-500 transition-colors disabled:opacity-50"
                                  title="Cancelar Orden"
                                >
                                  <X size={16} />
                                </button>
                              </>
                            )}
                            {o.estado === 'IMPRIMIENDO' && (
                              <>
                                <button 
                                  disabled={updating}
                                  onClick={() => handleStatusChange(o.id, 'COMPLETADO')}
                                  className="text-[#1d1d1f] font-medium text-[14px] hover:underline flex items-center gap-1 disabled:opacity-50"
                                >
                                  <Check size={14} /> Completar
                                </button>
                                <button 
                                  disabled={updating}
                                  onClick={() => setMermaTarget(o)}
                                  className="text-red-500 font-medium text-[14px] hover:underline flex items-center gap-1 ml-2 disabled:opacity-50"
                                  title="Marcar como Merma (Fallo)"
                                >
                                  <AlertTriangle size={14} /> Falló (Merma)
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <PaginationBar
              page={page}
              totalPages={totalPages}
              totalElements={totalElements}
              size={10}
              onPageChange={setPage}
            />
          </div>

        </div>
      </main>

      <CrearOrdenIndependienteModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      <RegistrarMermaProduccionModal
        isOpen={!!mermaTarget}
        onClose={() => setMermaTarget(null)}
        orden={mermaTarget}
      />
    </div>
  );
}
