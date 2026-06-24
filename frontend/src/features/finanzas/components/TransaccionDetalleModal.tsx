import React from 'react';
import { Modal } from '../../../components/ui/modal';
import { Transaccion } from '../types/finanzas.types';
import { useGetPedido } from '../../pedidos/api/pedidos.api';
import { fmtDateTime, formatCurrency } from '../../../lib/date-utils';
import { ExternalLink } from 'lucide-react';
import { EstadoBadge } from '../../pedidos/components/EstadoBadge';

interface TransaccionDetalleModalProps {
  tx: Transaccion;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToPedido?: (pedidoId: string) => void;
}

function PedidoInfo({ pedidoId, onNavigate }: { pedidoId: string; onNavigate?: (id: string) => void }) {
  const { data: pedido, isLoading } = useGetPedido(pedidoId);

  return (
    <div className="bg-muted/10 p-4 rounded-xl border border-border/50 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Pedido Asociado</p>
        {onNavigate && (
          <button
            onClick={() => onNavigate(pedidoId)}
            className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1"
          >
            <ExternalLink size={12} /> Ver Pedido
          </button>
        )}
      </div>

      {isLoading ? (
        <p className="text-[13px] text-muted-foreground animate-pulse">Cargando datos del pedido...</p>
      ) : pedido ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[13px]">
          <div>
            <span className="text-muted-foreground">Cliente:</span>
            <span className="ml-1 font-semibold text-foreground">{pedido.clienteNombre}</span>
          </div>
          <div className="text-right">
            <EstadoBadge estado={pedido.estado} />
          </div>
          <div>
            <span className="text-muted-foreground">Total:</span>
            <span className="ml-1 font-semibold text-foreground">{formatCurrency(pedido.total)}</span>
          </div>
          <div className="text-right">
            <span className="text-muted-foreground">Pagado:</span>
            <span className="ml-1 font-semibold text-success">{formatCurrency(pedido.montoPagado)}</span>
          </div>
          <div className="col-span-2 text-right">
            <span className="text-muted-foreground">Saldo Pendiente:</span>
            <span className={`ml-1 font-semibold ${pedido.saldoPendiente > 0 ? 'text-warning' : 'text-muted-foreground'}`}>
              {formatCurrency(pedido.saldoPendiente)}
            </span>
          </div>
        </div>
      ) : (
        <p className="text-[13px] text-muted-foreground">No se pudo cargar el pedido.</p>
      )}
    </div>
  );
}

export function TransaccionDetalleModal({ tx, isOpen, onClose, onNavigateToPedido }: TransaccionDetalleModalProps) {
  if (!tx) return null;
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalle de Transacción" size="xl">
      <div className="space-y-6">
        <div className="bg-muted/10 p-4 rounded-xl border border-border/50">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Descripción</p>
          <p className="studio-body-strong text-foreground">{tx.descripcion}</p>
        </div>

        {tx.pedidoId && (
          <PedidoInfo pedidoId={tx.pedidoId} onNavigate={onNavigateToPedido} />
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted/10 p-4 rounded-xl border border-border/50">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Tipo</p>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase border ${
              tx.tipo === 'INGRESO' ? 'bg-success/10 text-success border-success/20' :
              tx.tipo === 'REEMBOLSO' ? 'bg-warning/10 text-warning border-warning/20' :
              'bg-muted text-muted-foreground border-border'
            }`}>
              {tx.tipo}
            </span>
          </div>

          <div className="bg-muted/10 p-4 rounded-xl border border-border/50">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Categoría</p>
            <p className="studio-body-strong text-foreground">{tx.categoria}</p>
          </div>

          {tx.cantidad != null && (
            <div className="bg-muted/10 p-4 rounded-xl border border-border/50">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Cantidad</p>
              <p className="studio-body-strong text-foreground">{tx.cantidad} unidad{tx.cantidad !== 1 ? 'es' : ''}</p>
            </div>
          )}

          {tx.precioUnitario != null && (
            <div className="bg-muted/10 p-4 rounded-xl border border-border/50">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Precio Unitario</p>
              <p className="studio-body-strong text-foreground">{formatCurrency(tx.precioUnitario)}</p>
            </div>
          )}

          <div className="bg-muted/10 p-4 rounded-xl border border-border/50">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Monto Total</p>
            <p className={`studio-body-strong ${
              tx.tipo === 'INGRESO' ? 'text-success' :
              tx.tipo === 'REEMBOLSO' ? 'text-warning' :
              'text-foreground'
            }`}>
              {formatCurrency(tx.monto)}
            </p>
          </div>

          <div className="bg-muted/10 p-4 rounded-xl border border-border/50">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Fecha</p>
            <p className="studio-body-strong text-foreground">{fmtDateTime(tx.fecha)}</p>
          </div>
        </div>

        {tx.productoId && (
          <div className="bg-muted/10 p-4 rounded-xl border border-border/50">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">ID Producto</p>
            <p className="text-sm font-mono text-muted-foreground">#{tx.productoId.substring(0, 8)}</p>
          </div>
        )}

        <div className="bg-muted/10 p-4 rounded-xl border border-border/50">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">ID Transacción</p>
          <p className="text-sm font-mono text-muted-foreground">#{tx.id.substring(0, 8)}</p>
        </div>
      </div>
    </Modal>
  );
}
