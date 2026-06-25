import React from 'react';
import { X, Package, Receipt, ArrowRight, ArrowLeft } from 'lucide-react';
import { fmtDateShort, fmtDate } from '../../../lib/date-utils';
import { Cliente } from '../types/clientes.types';
import { useGetPedidos } from '../../pedidos/api/pedidos.api';
import { useGetTransacciones } from '../../finanzas/api/finanzas.api';
import { TransaccionDetalleModal } from '../../finanzas/components/TransaccionDetalleModal';
import { Transaccion } from '../../finanzas/types/finanzas.types';
import { QueryErrorView } from '../../../components/ui/query-error-view';

interface ClienteDetalleDrawerProps {
  cliente: Cliente | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToPedido?: (pedidoId: string) => void;
}

export function ClienteDetalleDrawer({ cliente, isOpen, onClose, onNavigateToPedido }: ClienteDetalleDrawerProps) {
  const { data: pedidosData, isLoading: isLoadingPedidos, isError: isErrorPedidos, error: errorPedidos, refetch: refetchPedidos } = useGetPedidos(0, 10, cliente?.id);
  const { data: txData, isLoading: isLoadingTx, isError: isErrorTx, error: errorTx, refetch: refetchTx } = useGetTransacciones(0, 10, cliente?.id);
  const [selectedTx, setSelectedTx] = React.useState<Transaccion | null>(null);

  if (!isOpen || !cliente) return null;

  const pedidos = pedidosData?.content || [];
  const transacciones = txData?.content || [];

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className={`fixed inset-y-0 right-0 z-50 w-full md:w-[600px] bg-background border-l border-border shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-card">
          <div className="space-y-1">
            <h2 className="studio-display-sm tracking-tight text-foreground">{cliente.nombre}</h2>
            <p className="studio-caption text-muted-foreground flex gap-2">
              {cliente.email && <span>{cliente.email}</span>}
              {cliente.email && cliente.telefono && <span>•</span>}
              {cliente.telefono && <span>{cliente.telefono}</span>}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted/30"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          
          {/* Info general */}
          {cliente.notas && (
            <div className="bg-muted/10 p-4 rounded-xl border border-border/50">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Notas</h3>
              <p className="studio-body text-foreground">{cliente.notas}</p>
            </div>
          )}

          {/* Pedidos */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <Package size={18} className="text-primary" />
              <h3 className="studio-body-strong">Últimos Pedidos</h3>
            </div>
            
            {isErrorPedidos ? (
              <QueryErrorView error={errorPedidos} refetch={refetchPedidos} />
            ) : isLoadingPedidos ? (
              <div className="py-8 text-center text-muted-foreground studio-caption">Cargando pedidos...</div>
            ) : pedidos.length === 0 ? (
              <div className="py-8 text-center bg-muted/5 rounded-xl border border-border/50">
                <p className="studio-body text-muted-foreground">No hay pedidos registrados.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pedidos.map(pedido => (
                  <div
                    key={pedido.id}
                    onClick={() => { onClose(); if (onNavigateToPedido) onNavigateToPedido(pedido.id); }}
                    className="flex justify-between items-center p-3 rounded-lg border border-border bg-card hover:bg-muted/10 hover:border-primary/30 transition-all cursor-pointer"
                  >
                    <div>
                      <p className="studio-body-strong">{fmtDateShort(pedido.fechaCreacion)}</p>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        pedido.estado === 'ENTREGADO' ? 'bg-green-500/10 text-green-600' :
                        pedido.estado === 'CANCELADO' ? 'bg-red-500/10 text-red-600' :
                        'bg-blue-500/10 text-blue-600'
                      }`}>
                        {pedido.estado.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="studio-body-strong">${pedido.total?.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{pedido.items?.length || 0} items</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Transacciones */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <Receipt size={18} className="text-primary" />
              <h3 className="studio-body-strong">Últimas Transacciones</h3>
            </div>

            {isErrorTx ? (
              <QueryErrorView error={errorTx} refetch={refetchTx} />
            ) : isLoadingTx ? (
              <div className="py-8 text-center text-muted-foreground studio-caption">Cargando transacciones...</div>
            ) : transacciones.length === 0 ? (
              <div className="py-8 text-center bg-muted/5 rounded-xl border border-border/50">
                <p className="studio-body text-muted-foreground">No hay transacciones registradas.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {transacciones.map(tx => (
                  <div key={tx.id} className="flex justify-between items-center p-3 rounded-lg border border-border bg-card hover:bg-muted/5 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${tx.tipo === 'INGRESO' ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                          {tx.tipo === 'INGRESO' ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
                        </div>
                        <div>
                          <p className="studio-body-strong">{tx.categoria}</p>
                          <button
                            onClick={() => setSelectedTx(tx)}
                            className="text-xs text-muted-foreground truncate max-w-[200px] text-left hover:text-primary transition-colors"
                          >
                            {tx.descripcion}
                          </button>
                        </div>
                      </div>
                    <div className="text-right">
                      <p className={`studio-body-strong ${tx.tipo === 'INGRESO' ? 'text-green-600' : 'text-red-600'}`}>
                        {tx.tipo === 'INGRESO' ? '+' : '-'}${tx.monto?.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">{fmtDateShort(tx.fecha)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>
      </div>

      <TransaccionDetalleModal
        tx={selectedTx!}
        isOpen={!!selectedTx}
        onClose={() => setSelectedTx(null)}
      />
    </>
  );
}
