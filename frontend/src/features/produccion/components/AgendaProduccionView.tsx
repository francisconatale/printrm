import React from 'react';
import { 
  useGetOrdenesProduccion, 
  useUpdateEstadoOrden 
} from '../api/produccion.api';
import { StudioSubNav } from '../../../components/layout/studio-sub-nav';
import { CrearOrdenIndependienteModal } from './CrearOrdenIndependienteModal';
import { 
  Hammer, 
  Plus, 
  Clock, 
  Play, 
  Check, 
  X, 
  Layers, 
  Tag, 
  Search, 
  Filter, 
  ChevronRight, 
  AlertCircle,
  TrendingDown,
  User,
  Package,
  Wrench
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { QueryErrorView } from '../../../components/ui/query-error-view';


export function AgendaProduccionView() {
  const { data: ordenes, isLoading, isError, error, refetch } = useGetOrdenesProduccion();
  const { mutate: updateEstado, isPending: updating } = useUpdateEstadoOrden();

  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [filterType, setFilterType] = React.useState<'ALL' | 'CLIENT' | 'STOCK'>('ALL');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [showCanceled, setShowCanceled] = React.useState(false);

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

  // Filter logic
  const filteredOrdenes = (ordenes || []).filter((o) => {
    // Search
    const searchMatch = 
      o.productoNombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.clienteNombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.proveedor?.toLowerCase().includes(searchTerm.toLowerCase());

    if (!searchMatch) return false;

    // Type
    if (filterType === 'CLIENT' && !o.itemPedidoId) return false;
    if (filterType === 'STOCK' && o.itemPedidoId) return false;

    // Canceled
    if (o.estado === 'CANCELADO' && !showCanceled) return false;

    return true;
  });

  // Group by columns
  const colaOrders = filteredOrdenes.filter(o => o.estado === 'COLA');
  const procesoOrders = filteredOrdenes.filter(o => o.estado === 'IMPRIMIENDO' || o.estado === 'ENVIADO_PROVEEDOR');
  const finalizadasOrders = filteredOrdenes.filter(o => o.estado === 'COMPLETADO' || o.estado === 'RECIBIDO_PROVEEDOR');
  const canceladasOrders = filteredOrdenes.filter(o => o.estado === 'CANCELADO');

  const formatCurrency = (val?: number) => {
    if (val === undefined || val === null) return '-';
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(val);
  };

  const getStatusBadge = (estado: string) => {
    const badges: Record<string, string> = {
      COLA: 'bg-zinc-100 border-zinc-200 text-zinc-700 dark:bg-zinc-800/40 dark:text-zinc-300 dark:border-zinc-700/60',
      IMPRIMIENDO: 'bg-blue-50 border-blue-100 text-blue-700 dark:bg-blue-900/10 dark:text-blue-400 dark:border-blue-800/40',
      ENVIADO_PROVEEDOR: 'bg-amber-50 border-amber-100 text-amber-700 dark:bg-amber-900/10 dark:text-amber-400 dark:border-amber-800/40',
      COMPLETADO: 'bg-emerald-50 border-emerald-100 text-emerald-700 dark:bg-emerald-950/10 dark:text-emerald-400 dark:border-emerald-900/40',
      RECIBIDO_PROVEEDOR: 'bg-emerald-50 border-emerald-100 text-emerald-700 dark:bg-emerald-950/10 dark:text-emerald-400 dark:border-emerald-900/40',
      CANCELADO: 'bg-red-50 border-red-100 text-red-700 dark:bg-red-950/10 dark:text-red-400 dark:border-red-900/40'
    };

    const label: Record<string, string> = {
      COLA: 'En Cola',
      IMPRIMIENDO: 'Imprimiendo',
      ENVIADO_PROVEEDOR: 'En Proveedor',
      COMPLETADO: 'Completada',
      RECIBIDO_PROVEEDOR: 'Recibida',
      CANCELADO: 'Cancelada'
    };

    return (
      <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold border", badges[estado])}>
        {label[estado] || estado}
      </span>
    );
  };

  const renderCard = (o: any) => (
    <div 
      key={o.id} 
      className="bg-card border border-border/50 p-4 rounded-xl space-y-3 hover:border-border transition-all shadow-sm hover:shadow relative group"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-0.5">
          <p className="text-[9px] text-muted-foreground font-mono">#{o.id.substring(0, 8)}</p>
          <h4 className="studio-body-strong text-sm leading-tight">{o.productoNombre}</h4>
        </div>
        {o.itemPedidoId ? (
          <span 
            className="flex items-center gap-1 text-[9px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded-full"
            title={`Para pedido del cliente: ${o.clienteNombre}`}
          >
            <User size={10} aria-hidden="true" /> Cliente
          </span>
        ) : (
          <span 
            className="flex items-center gap-1 text-[9px] font-bold text-teal-600 bg-teal-50 border border-teal-100 px-1.5 py-0.5 rounded-full"
            title="Para stock propio"
          >
            <Package size={10} aria-hidden="true" /> Stock
          </span>
        )}
      </div>

      <div className="flex items-center justify-between text-xs pt-1 border-t border-dashed border-border/60">
        <div>
          <span className="text-muted-foreground">Cantidad: </span>
          <strong className="text-foreground">{o.cantidad} u.</strong>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
            {o.tipo === 'INTERNA' ? 'Interna' : 'Externa'}
          </span>
        </div>
      </div>

      {o.tipo === 'EXTERNA' && (
        <div className="bg-muted/20 p-2 rounded-lg text-[11px] space-y-1 text-muted-foreground">
          <div className="flex justify-between">
            <span>Proveedor:</span>
            <span className="font-semibold text-foreground">{o.proveedor}</span>
          </div>
          <div className="flex justify-between">
            <span>Costo Estimado:</span>
            <span className="font-semibold text-foreground">{formatCurrency(o.costoEstimado)}</span>
          </div>
        </div>
      )}

      {o.itemPedidoId && (
        <div className="text-[10px] text-muted-foreground flex items-center gap-1">
          <span className="font-medium text-foreground">Destinatario:</span>
          <span>{o.clienteNombre}</span>
        </div>
      )}

      <div className="pt-2 flex justify-between gap-2">
        {/* Status Actions */}
        <div className="flex gap-2">
          {o.estado === 'COLA' && (
            <button
              onClick={() => handleStatusChange(o.id, o.tipo === 'INTERNA' ? 'IMPRIMIENDO' : 'ENVIADO_PROVEEDOR')}
              disabled={updating}
              className="flex items-center gap-1 px-3 py-1 bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 text-xs font-bold rounded-lg transition-all"
              aria-label="Iniciar orden de producción"
            >
              <Play size={10} aria-hidden="true" /> Iniciar
            </button>
          )}

          {o.estado === 'IMPRIMIENDO' && (
            <button
              onClick={() => handleStatusChange(o.id, 'COMPLETADO')}
              disabled={updating}
              className="flex items-center gap-1 px-3 py-1 bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold rounded-lg transition-all"
              aria-label="Completar orden de producción"
            >
              <Check size={10} aria-hidden="true" /> Completar
            </button>
          )}

          {o.estado === 'ENVIADO_PROVEEDOR' && (
            <button
              onClick={() => handleStatusChange(o.id, 'RECIBIDO_PROVEEDOR')}
              disabled={updating}
              className="flex items-center gap-1 px-3 py-1 bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold rounded-lg transition-all"
              aria-label="Recibir orden de producción"
            >
              <Check size={10} aria-hidden="true" /> Recibir
            </button>
          )}
        </div>

        {/* Cancellation Button */}
        {['COLA', 'IMPRIMIENDO', 'ENVIADO_PROVEEDOR'].includes(o.estado) && (
          <button
            onClick={() => handleStatusChange(o.id, 'CANCELADO')}
            disabled={updating}
            className="p-1.5 rounded-full border border-transparent text-muted-foreground hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all ml-auto flex items-center justify-center"
            title="Cancelar Orden"
            aria-label="Cancelar orden de producción"
          >
            <X size={14} aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        {getStatusBadge(o.estado)}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col w-full bg-background min-h-full animate-in fade-in duration-500">
      <StudioSubNav />

      <main className="flex-1 px-8 md:px-12 py-10 overflow-y-auto custom-scrollbar">
        <div className="max-w-[1200px] mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <h1 className="studio-display-md !text-4xl tracking-tight flex items-center gap-3">
                <Hammer className="text-foreground shrink-0" size={32} aria-hidden="true" />
                <span>Agenda de Producción</span>
              </h1>
              <p className="studio-body text-muted-foreground">
                Monitoreá las piezas en impresión y ordenes tercerizadas. Al finalizarlas, se repondrá stock automáticamente.
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="studio-button-primary flex items-center gap-2 self-start sm:self-center"
            >
              <Plus size={18} aria-hidden="true" />
              <span>Nueva Orden de Stock</span>
            </button>
          </div>

          {/* Filters Toolbar */}
          <div className="bg-card border border-border/40 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterType('ALL')}
                className={cn(
                  "px-4 py-1.5 text-xs font-bold rounded-full transition-all border",
                  filterType === 'ALL'
                    ? "bg-zinc-100 border-zinc-200 text-foreground"
                    : "hover:bg-zinc-50 border-transparent text-muted-foreground"
                )}
              >
                Todas
              </button>
              <button
                onClick={() => setFilterType('CLIENT')}
                className={cn(
                  "px-4 py-1.5 text-xs font-bold rounded-full transition-all border flex items-center gap-1.5",
                  filterType === 'CLIENT'
                    ? "bg-indigo-50 border-indigo-100 text-indigo-700"
                    : "hover:bg-indigo-50/20 border-transparent text-muted-foreground"
                )}
              >
                <User size={12} aria-hidden="true" />
                <span>Para Clientes</span>
              </button>
              <button
                onClick={() => setFilterType('STOCK')}
                className={cn(
                  "px-4 py-1.5 text-xs font-bold rounded-full transition-all border flex items-center gap-1.5",
                  filterType === 'STOCK'
                    ? "bg-teal-50 border-teal-100 text-teal-700"
                    : "hover:bg-teal-50/20 border-transparent text-muted-foreground"
                )}
              >
                <Package size={12} aria-hidden="true" />
                <span>Reposición Stock</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-2.5 text-muted-foreground" size={16} aria-hidden="true" />
                <label htmlFor="search-agenda" className="sr-only">Buscar orden de producción</label>
                <input
                  id="search-agenda"
                  type="text"
                  placeholder="Buscar producto, cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white border border-[#e0e0e0] rounded-full pl-9 pr-4 py-2 text-xs focus:ring-2 focus:ring-black outline-none transition-all"
                />
              </div>

              <label className="flex items-center gap-2 text-xs text-muted-foreground select-none cursor-pointer">
                <input
                  type="checkbox"
                  checked={showCanceled}
                  onChange={(e) => setShowCanceled(e.target.checked)}
                  className="rounded border-border text-black focus:ring-black"
                />
                <span>Ver Canceladas</span>
              </label>
            </div>
          </div>

          {/* Kanban Board Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Column 1: En Cola */}
            <div className="space-y-4 bg-muted/10 p-5 rounded-[2rem] border border-border/30 flex flex-col min-h-[500px]">
              <div className="flex items-center justify-between pb-2 border-b border-border/40">
                <h3 className="studio-caption-strong uppercase tracking-widest text-[#7a7a7a] flex items-center gap-2">
                  <Clock size={14} /> En Cola ({colaOrders.length})
                </h3>
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto no-scrollbar">
                {colaOrders.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 text-muted-foreground">
                    <p className="text-xs">No hay órdenes esperando en cola.</p>
                  </div>
                ) : (
                  colaOrders.map(renderCard)
                )}
              </div>
            </div>

            {/* Column 2: En Proceso */}
            <div className="space-y-4 bg-muted/10 p-5 rounded-[2rem] border border-border/30 flex flex-col min-h-[500px]">
              <div className="flex items-center justify-between pb-2 border-b border-border/40">
                <h3 className="studio-caption-strong uppercase tracking-widest text-[#7a7a7a] flex items-center gap-2">
                  <Wrench size={14} /> En Proceso ({procesoOrders.length})
                </h3>
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto no-scrollbar">
                {procesoOrders.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 text-muted-foreground">
                    <p className="text-xs">No hay impresiones ni envíos activos.</p>
                  </div>
                ) : (
                  procesoOrders.map(renderCard)
                )}
              </div>
            </div>

            {/* Column 3: Completadas */}
            <div className="space-y-4 bg-muted/10 p-5 rounded-[2rem] border border-border/30 flex flex-col min-h-[500px]">
              <div className="flex items-center justify-between pb-2 border-b border-border/40">
                <h3 className="studio-caption-strong uppercase tracking-widest text-[#7a7a7a] flex items-center gap-2">
                  <Check size={14} /> Completadas ({finalizadasOrders.length})
                </h3>
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto no-scrollbar">
                {finalizadasOrders.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 text-muted-foreground">
                    <p className="text-xs">No hay órdenes finalizadas recientemente.</p>
                  </div>
                ) : (
                  finalizadasOrders.slice(0, 15).map(renderCard)
                )}
                {finalizadasOrders.length > 15 && (
                  <p className="text-[10px] text-center text-muted-foreground pt-2">Mostrando las últimas 15 órdenes completadas.</p>
                )}
              </div>
            </div>

          </div>

          {/* Show Canceled section only if checked */}
          {showCanceled && canceladasOrders.length > 0 && (
            <div className="space-y-4 pt-6 border-t border-border/40">
              <h3 className="studio-caption-strong uppercase tracking-widest text-red-500">Órdenes Canceladas ({canceladasOrders.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {canceladasOrders.map(renderCard)}
              </div>
            </div>
          )}

        </div>
      </main>

      <CrearOrdenIndependienteModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
}
