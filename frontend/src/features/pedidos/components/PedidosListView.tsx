import React from 'react';
import { useGetPedidos } from '../api/pedidos.api';
import { EstadoBadge } from './EstadoBadge';
import { CrearPedidoModal } from './CrearPedidoModal';
import { PedidoDetalleView } from './PedidoDetalleView';
import { Plus, Search, Loader2, ShoppingBag, Eye } from 'lucide-react';
import { StudioSubNav } from '../../../components/layout/studio-sub-nav';
import { QueryErrorView } from '../../../components/ui/query-error-view';

export function PedidosListView() {
  const { data: pedidos, isLoading, error, refetch } = useGetPedidos();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedPedidoId, setSelectedPedidoId] = React.useState<string | null>(null);
  const [isCrearModalOpen, setIsCrearModalOpen] = React.useState(false);

  const filteredPedidos = React.useMemo(() => {
    if (!pedidos) return [];
    return pedidos.filter(pedido =>
      pedido.clienteNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pedido.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [pedidos, searchTerm]);

  if (selectedPedidoId) {
    return (
      <PedidoDetalleView
        pedidoId={selectedPedidoId}
        onBack={() => setSelectedPedidoId(null)}
      />
    );
  }

  const isSearching = searchTerm.trim().length > 0;

  return (
    <div className="flex flex-col w-full bg-background min-h-full">
      <StudioSubNav />

      <main className="flex-1 px-8 md:px-12 py-10 overflow-y-auto custom-scrollbar">
        <div className="max-w-[1400px] mx-auto space-y-10">

          {/* Header & Search */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <h1 className="studio-display-md !text-4xl tracking-tight">Gestión de Pedidos</h1>
              <p className="studio-body text-muted-foreground">Monitoreá estados, registrá pagos parciales y controlá mermas.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} aria-hidden="true" />
                <label htmlFor="search-pedidos" className="sr-only">Buscar pedido</label>
                <input
                  id="search-pedidos"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por cliente o ID de pedido..."
                  className="w-full bg-background border border-border rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-black outline-none transition-all"
                />
              </div>
              <button
                onClick={() => setIsCrearModalOpen(true)}
                className="studio-button-primary flex items-center gap-2"
              >
                <Plus size={16} aria-hidden="true" />
                <span>Nuevo Pedido</span>
              </button>
            </div>
          </div>

          {/* Pedidos Content */}
          {error ? (
            <QueryErrorView error={error} refetch={refetch} />
          ) : isLoading ? (
            <div className="flex flex-col items-center justify-center py-40 gap-4 text-muted-foreground">
              <Loader2 className="animate-spin" size={32} aria-hidden="true" />
              <p className="studio-caption">Cargando pedidos...</p>
            </div>
          ) : filteredPedidos.length === 0 ? (
            isSearching ? (
              <div className="flex flex-col items-center justify-center py-40 text-center space-y-4 bg-muted/10 rounded-[3rem] border border-dashed border-zinc-200 dark:border-zinc-800">
                <div className="size-20 rounded-full bg-background flex items-center justify-center border border-border">
                  <Search size={32} className="text-muted-foreground/40" aria-hidden="true" />
                </div>
                <div className="space-y-1">
                  <p className="studio-body-strong text-foreground">Búsqueda sin resultados</p>
                  <p className="studio-caption text-muted-foreground">No encontramos pedidos que coincidan con "{searchTerm}". Intentá con otros términos.</p>
                  <button
                    onClick={() => setSearchTerm('')}
                    className="text-xs text-primary font-semibold hover:underline mt-2"
                  >
                    Limpiar filtros
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-40 text-center space-y-4 bg-muted/10 rounded-[3rem] border border-dashed border-zinc-200 dark:border-zinc-800">
                <div className="size-20 rounded-full bg-background flex items-center justify-center border border-border">
                  <ShoppingBag size={32} className="text-muted-foreground/40" aria-hidden="true" />
                </div>
                <div className="space-y-1">
                  <p className="studio-body-strong text-foreground">No se encontraron pedidos</p>
                  <p className="studio-caption text-muted-foreground">Creá tu primer pedido cotizado para realizar el seguimiento.</p>
                </div>
              </div>
            )
          ) : (
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-6 py-3 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Cliente</th>
                    <th className="px-6 py-3 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-right text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Monto Total</th>
                    <th className="px-6 py-3 text-right text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Pagado</th>
                    <th className="px-6 py-3 text-right text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Pendiente</th>
                    <th className="px-6 py-3 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Creación</th>
                    <th className="px-6 py-3 text-right text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredPedidos.map((pedido) => (
                    <tr
                      key={pedido.id}
                      onClick={() => setSelectedPedidoId(pedido.id)}
                      className="hover:bg-muted/5 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-muted-foreground">
                        #{pedido.id.substring(0, 8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm studio-body-strong text-foreground">
                        {pedido.clienteNombre}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <EstadoBadge estado={pedido.estado} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-foreground">
                        ${pedido.total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-emerald-600">
                        ${pedido.montoPagado.toFixed(2)}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-medium ${pedido.saldoPendiente > 0 ? 'text-amber-600' : 'text-zinc-400'}`}>
                        ${pedido.saldoPendiente.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground hidden lg:table-cell">
                        {new Date(pedido.fechaCreacion).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedPedidoId(pedido.id)}
                          className="text-primary hover:opacity-80 transition-colors p-2 rounded-full hover:bg-primary/10"
                          title="Ver Detalle"
                          aria-label={`Ver detalle del pedido ${pedido.id.substring(0, 8)}`}
                        >
                          <Eye size={16} aria-hidden="true" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <CrearPedidoModal
        isOpen={isCrearModalOpen}
        onClose={() => setIsCrearModalOpen(false)}
      />
    </div>
  );
}
