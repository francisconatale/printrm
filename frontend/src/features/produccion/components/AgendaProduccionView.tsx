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
  AlertTriangle,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { PaginationBar } from '../../../components/ui/pagination-bar';
import { Button } from '../../../components/ui/button';
import { cn } from '@/lib/utils';
import { QueryErrorView } from '../../../components/ui/query-error-view';
import { EstadoProduccion } from '../types/produccion.types';

const ESTADO_ORDER: EstadoProduccion[] = ['IMPRIMIENDO', 'COLA', 'COMPLETADO', 'MERMA', 'CANCELADO'];

const statusConfig: Record<string, { icon: React.ReactNode; label: string }> = {
  COLA: { icon: <Clock size={12} />, label: 'En Cola' },
  IMPRIMIENDO: { icon: <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />, label: 'Imprimiendo' },
  COMPLETADO: { icon: <Check size={12} className="text-success" />, label: 'Completado' },
  MERMA: { icon: <AlertTriangle size={12} />, label: 'Merma' },
  CANCELADO: { icon: <X size={12} />, label: 'Cancelado' },
};

const groupBorder = (e: EstadoProduccion) => {
  switch (e) {
    case 'IMPRIMIENDO': return 'border-l-primary';
    case 'COLA': return 'border-l-muted-foreground';
    case 'COMPLETADO': return 'border-l-success';
    case 'MERMA': return 'border-l-destructive';
    case 'CANCELADO': return 'border-l-border';
  }
};

function GroupSection({
  estado,
  items,
  onStatusChange,
  onMerma,
  updating,
}: {
  estado: EstadoProduccion;
  items: Array<{
    id: string;
    productoNombre?: string;
    clienteNombre?: string;
    cantidad: number;
    estado: EstadoProduccion;
  }>;
  onStatusChange: (id: string, estado: EstadoProduccion) => void;
  onMerma: (item: any) => void;
  updating: boolean;
}) {
  const [expanded, setExpanded] = React.useState(
    estado === 'IMPRIMIENDO' || estado === 'COLA'
  );
  const config = statusConfig[estado] || { icon: null, label: estado };

  return (
    <div className="bg-card border border-border rounded-[18px] overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-6 py-4 hover:bg-muted/30 transition-colors border-b border-border"
      >
        {expanded ? (
          <ChevronDown size={14} className="text-muted-foreground shrink-0" />
        ) : (
          <ChevronRight size={14} className="text-muted-foreground shrink-0" />
        )}
        <span className="flex items-center gap-2 text-[13px] font-semibold text-foreground">
          {config.icon}
          {config.label}
        </span>
        <span className="text-[12px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full ml-auto">
          {items.length}
        </span>
      </button>

      {expanded && (
        <div className="divide-y divide-border/50">
          {items.length === 0 ? (
            <div className="py-8 text-center text-[13px] text-muted-foreground">
              Sin órdenes en este estado
            </div>
          ) : (
            items.map(o => (
              <div
                key={o.id}
                className={`flex items-center gap-4 px-6 py-3.5 hover:bg-muted/20 transition-colors border-l-2 ${groupBorder(o.estado)}`}
              >
                <div className="flex-1 min-w-0 flex items-center gap-3">
                  <span className="studio-caption-strong text-foreground truncate">
                    {o.productoNombre}
                  </span>
                  {o.clienteNombre && (
                    <span className="text-[11px] text-muted-foreground shrink-0">
                      {o.clienteNombre}
                    </span>
                  )}
                </div>

                <span className="text-[13px] font-semibold text-foreground font-mono tabular-nums">
                  {o.cantidad}
                </span>

                <div className="flex items-center gap-1.5 shrink-0">
                  {o.estado === 'COLA' && (
                    <>
                      <button
                        disabled={updating}
                        onClick={() => onStatusChange(o.id, 'IMPRIMIENDO')}
                        className="p-1.5 text-primary hover:bg-primary/10 rounded-full transition-colors disabled:opacity-50"
                        title="Iniciar"
                      >
                        <Play size={14} fill="currentColor" />
                      </button>
                      <button
                        disabled={updating}
                        onClick={() => onStatusChange(o.id, 'CANCELADO')}
                        className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors disabled:opacity-50"
                        title="Cancelar"
                      >
                        <X size={14} />
                      </button>
                    </>
                  )}
                  {o.estado === 'IMPRIMIENDO' && (
                    <>
                      <button
                        disabled={updating}
                        onClick={() => onStatusChange(o.id, 'COMPLETADO')}
                        className="p-1.5 text-success hover:bg-success/10 rounded-full transition-colors disabled:opacity-50"
                        title="Completar"
                      >
                        <Check size={14} />
                      </button>
                      <button
                        disabled={updating}
                        onClick={() => onMerma(o)}
                        className="p-1.5 text-destructive hover:bg-destructive/10 rounded-full transition-colors disabled:opacity-50"
                        title="Merma"
                      >
                        <AlertTriangle size={14} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export function AgendaProduccionView() {
  const [page, setPage] = React.useState(0);
  const { data: ordenesData, isLoading, isError, error, refetch } = useGetOrdenesProduccion(page, 10);
  const ordenes = ordenesData?.content;
  const totalPages = ordenesData?.totalPages ?? 0;
  const totalElements = ordenesData?.totalElements ?? 0;
  const { mutate: updateEstado, isPending: updating } = useUpdateEstadoOrden();

  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [mermaTarget, setMermaTarget] = React.useState<any>(null);

  const grouped = React.useMemo(() => {
    const map: Record<string, NonNullable<typeof ordenes>> = {};
    for (const e of ESTADO_ORDER) map[e] = [];
    for (const o of ordenes || []) {
      map[o.estado]?.push(o);
    }
    return map;
  }, [ordenes]);

  const totalActive = (ordenes || []).filter(o => o.estado === 'COLA' || o.estado === 'IMPRIMIENDO').length;

  const handleStatusChange = (id: string, nuevoEstado: EstadoProduccion) => {
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

  return (
    <div className="flex flex-col w-full bg-background min-h-full animate-in fade-in duration-500 text-foreground">
      <StudioSubNav />

      <main className="flex-1 px-8 md:px-12 py-10 overflow-y-auto custom-scrollbar">
        <div className="max-w-[1400px] mx-auto space-y-10">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <h1 className="studio-display-md flex items-center gap-3">
                <Hammer className="text-foreground shrink-0" size={32} aria-hidden="true" />
                <span>Agenda de Producción</span>
              </h1>
              <p className="studio-body text-muted-foreground">
                Control estricto de las piezas en cola e impresión.
              </p>
            </div>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="self-start sm:self-center"
            >
              <Plus size={18} aria-hidden="true" />
              <span>Nueva Orden de Stock</span>
            </Button>
          </div>

          {/* Accordion by status */}
          {totalActive === 0 && (
            <div className="py-12 text-center text-[13px] text-muted-foreground bg-card border border-border rounded-[18px]">
              No hay órdenes activas en este momento.
            </div>
          )}

          <div className="space-y-4">
            {ESTADO_ORDER.map(e => {
              const items = grouped[e] || [];
              if (items.length === 0 && e !== 'IMPRIMIENDO' && e !== 'COLA') return null;
              return (
                <GroupSection
                  key={e}
                  estado={e}
                  items={items}
                  onStatusChange={handleStatusChange}
                  onMerma={setMermaTarget}
                  updating={updating}
                />
              );
            })}
          </div>

          {totalPages > 1 && (
            <PaginationBar
              page={page}
              totalPages={totalPages}
              totalElements={totalElements}
              size={10}
              onPageChange={setPage}
            />
          )}

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
