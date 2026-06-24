import React from 'react';
import { Modal } from '../../../components/ui/modal';
import { Transaccion } from '../types/finanzas.types';
import { format } from 'date-fns/format';
import { es } from 'date-fns/locale/es';

interface TransaccionDetalleModalProps {
  tx: Transaccion;
  isOpen: boolean;
  onClose: () => void;
}

const formatCurrency = (value: number) => {
  const absValue = Math.abs(value);
  const formatted = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(absValue);
  return value < 0 ? `- ${formatted}` : formatted;
};

export function TransaccionDetalleModal({ tx, isOpen, onClose }: TransaccionDetalleModalProps) {
  if (!tx) return null;
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalle de Transacción" size="md">
      <div className="space-y-6">
        {/* Description */}
        <div className="bg-muted/10 p-4 rounded-xl border border-border/50">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Descripción</p>
          <p className="studio-body-strong text-foreground">{tx.descripcion}</p>
        </div>

        {/* Info Grid */}
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
            <p className="studio-body-strong text-foreground">{format(new Date(tx.fecha), 'dd/MM/yyyy HH:mm', { locale: es })}</p>
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
