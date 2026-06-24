import React, { useMemo } from 'react';
import { useGetTransacciones } from '../../finanzas/api/finanzas.api';
import { StudioSubNav } from '../../../components/layout/studio-sub-nav';
import { Search, Loader2, Plus, ReceiptText, ChevronRight, RotateCcw } from 'lucide-react';
import { QueryErrorView } from '../../../components/ui/query-error-view';
import { format } from 'date-fns/format';
import { es } from 'date-fns/locale/es';
import { PedidoDetalleView } from '../../pedidos/components/PedidoDetalleView';
import { CrearVentaModal } from './CrearVentaModal';
import { DevolucionVentaModal } from './DevolucionVentaModal';
import { TransaccionDetalleModal } from '../../finanzas/components/TransaccionDetalleModal';
import { Transaccion } from '../../finanzas/types/finanzas.types';

export function VentasListView() {
  const [page, setPage] = React.useState(0);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isCrearVentaOpen, setIsCrearVentaOpen] = React.useState(false);
  const [returnGrupoId, setReturnGrupoId] = React.useState<string | null>(null);
  const [selectedPedidoId, setSelectedPedidoId] = React.useState<string | null>(null);
  const [selectedTx, setSelectedTx] = React.useState<Transaccion | null>(null);

  // Fetch all transactions
  const { data, isLoading, error, refetch } = useGetTransacciones(page, 500);

  // Filter SALES transactions (both income and refunds)
  const ventas = useMemo(() => {
    if (!data?.content) return [];
    
    return data.content
      .filter(t => t.categoria === 'VENTA')
      .filter(t => t.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  }, [data, searchTerm]);

  const totalIngresos = useMemo(() =>
    ventas.filter(t => t.tipo === 'INGRESO').reduce((sum, item) => sum + item.monto, 0), [ventas]
  );

  const totalReembolsos = useMemo(() =>
    ventas.filter(t => t.tipo === 'REEMBOLSO').reduce((sum, item) => sum + Math.abs(item.monto), 0), [ventas]
  );

  const formatCurrency = (val: number) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(val);

  if (selectedPedidoId) {
    return <PedidoDetalleView pedidoId={selectedPedidoId} onBack={() => setSelectedPedidoId(null)} />;
  }

  return (
    <div className="flex flex-col w-full bg-background min-h-full">
      <StudioSubNav />

      <main className="flex-1 px-8 md:px-12 py-10 overflow-y-auto custom-scrollbar">
        <div className="max-w-[1400px] mx-auto space-y-10">

          {/* Header & Search */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <h1 className="studio-display-md tracking-tight">Cobranzas</h1>
              <p className="studio-body text-muted-foreground">Historial de ingresos por ventas y pagos de pedidos.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} aria-hidden="true" />
                <label htmlFor="search-clientes" className="sr-only">Buscar clientes</label>
                <input
                  id="search-clientes"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar pago..."
                  className="w-full bg-background border border-border rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>
              <button
                onClick={() => setIsCrearVentaOpen(true)}
                className="studio-button-primary flex items-center gap-2"
              >
                <Plus size={16} />
                <span>Nueva Venta</span>
              </button>
            </div>
          </div>

          {/* KPIs */}
          {!isLoading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-300">
              <div className="bg-card border border-border/50 p-6 rounded-[var(--radius-xl)] flex flex-col justify-center">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Ingresos</p>
                <p className="text-3xl font-black text-success tracking-tight">{formatCurrency(totalIngresos)}</p>
              </div>
              <div className="bg-card border border-border/50 p-6 rounded-[var(--radius-xl)] flex flex-col justify-center">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Devoluciones</p>
                <p className="text-3xl font-black text-destructive tracking-tight">{formatCurrency(totalReembolsos)}</p>
              </div>
              <div className="bg-card border border-border/50 p-6 rounded-[var(--radius-xl)] flex flex-col justify-center">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Transacciones</p>
                <p className="text-3xl font-black text-foreground tracking-tight">{ventas.length}</p>
              </div>
            </div>
          )}

          {/* Content */}
          {error ? (
            <QueryErrorView error={error as Error} refetch={refetch} />
          ) : isLoading ? (
            <div className="flex flex-col items-center justify-center py-40 gap-4 text-muted-foreground">
              <Loader2 className="animate-spin" size={32} />
              <p className="studio-caption">Cargando cobranzas...</p>
            </div>
          ) : ventas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-40 text-center space-y-4 bg-muted/10 rounded-xl border border-border/60">
              <div className="size-20 rounded-full bg-background flex items-center justify-center border border-border">
                <ReceiptText size={32} className="text-muted-foreground/40" />
              </div>
              <div className="space-y-1">
                <p className="studio-body-strong text-foreground">No hay pagos registrados</p>
                <p className="studio-caption text-muted-foreground">Los ingresos por ventas aparecerán aquí.</p>
              </div>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-2xl overflow-hidden animate-in fade-in duration-300">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Fecha</th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Detalle del Pago</th>
                      <th className="px-6 py-4 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Ref</th>
                    <th className="px-6 py-4 text-right text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Monto</th>
                    <th className="px-6 py-4 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {ventas.map((tx) => {
                    const isRefund = tx.tipo === 'REEMBOLSO';
                    return (
                    <tr
                      key={tx.id}
                      onClick={() => tx.pedidoId ? setSelectedPedidoId(tx.pedidoId) : null}
                      className={`transition-colors ${tx.pedidoId ? 'hover:bg-muted/5 cursor-pointer' : 'hover:bg-muted/5'} ${isRefund ? 'opacity-70' : ''}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {format(new Date(tx.fecha), 'dd/MM/yyyy HH:mm', { locale: es })}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedTx(tx); }}
                          className="text-sm font-semibold flex items-center gap-2 text-left hover:text-primary transition-colors"
                        >
                          {isRefund && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-destructive bg-destructive/10 px-1.5 py-0.5 rounded shrink-0">Dev.</span>
                          )}
                          <span className={isRefund ? 'text-destructive' : 'text-foreground'}>{tx.descripcion}</span>
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="text-[10px] font-mono text-muted-foreground bg-muted/20 px-2 py-0.5 rounded-md border border-border/50">
                          #{tx.id.substring(0, 6)}
                        </span>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-black ${isRefund ? 'text-destructive' : 'text-success'}`}>
                        {isRefund ? `- ${formatCurrency(Math.abs(tx.monto))}` : formatCurrency(tx.monto)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {!isRefund && tx.grupoId && !tx.devueltoTotalmente ? (
                          <button
                            onClick={(e) => { e.stopPropagation(); setReturnGrupoId(tx.grupoId!); }}
                            className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-500/10 hover:bg-amber-500/20 px-2 py-1 rounded-lg transition-colors"
                          >
                            <RotateCcw size={12} />
                            Devolver
                          </button>
                        ) : !isRefund && tx.grupoId && tx.devueltoTotalmente ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-green-600 bg-green-500/10 px-2 py-1 rounded-lg">
                            Devuelto
                          </span>
                        ) : tx.pedidoId ? (
                          <ChevronRight size={16} className="inline-flex text-muted-foreground" />
                        ) : null}
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <CrearVentaModal
        isOpen={isCrearVentaOpen}
        onClose={() => { setIsCrearVentaOpen(false); refetch(); }}
      />

      <DevolucionVentaModal
        isOpen={!!returnGrupoId}
        grupoId={returnGrupoId || ''}
        onClose={() => { setReturnGrupoId(null); refetch(); }}
      />

      <TransaccionDetalleModal
        tx={selectedTx!}
        isOpen={!!selectedTx}
        onClose={() => setSelectedTx(null)}
      />
    </div>
  );
}
