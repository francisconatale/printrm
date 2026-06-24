import React, { useState } from 'react';
import { Modal } from '../../../components/ui/modal';
import { Button } from '../../../components/ui/button';
import { useDevolverProductosPedido } from '../api/pedidos.api';
import { RotateCcw, Minus, Plus, AlertTriangle, Package } from 'lucide-react';

interface DevolverItemsPedidoModalProps {
  isOpen: boolean;
  onClose: () => void;
  pedidoId: string;
  items: Array<{
    id: string;
    productoId?: string;
    productoNombre?: string;
    perfilNombre: string;
    cantidadEntregada: number;
    cantidad: number;
    subtotal: number;
  }>;
}

export function DevolverItemsPedidoModal({ isOpen, onClose, pedidoId, items }: DevolverItemsPedidoModalProps) {
  const { mutate: devolver, isPending } = useDevolverProductosPedido();
  const [motivo, setMotivo] = useState('');
  const [cantidades, setCantidades] = useState<Record<string, number>>({});

  const itemsConStock = items
    .filter(it => it.cantidadEntregada > 0 && it.productoId)
    .map(it => ({
      productoId: it.productoId!,
      productoNombre: it.productoNombre || it.perfilNombre,
      cantidadEntregada: it.cantidadEntregada,
      cantidadADevolver: cantidades[it.productoId!] || 0,
      subtotalUnitario: it.cantidad > 0 ? it.subtotal / it.cantidad : 0,
    }));

  const getCantidad = (productoId: string) => cantidades[productoId] || 0;

  const setCantidad = (productoId: string, val: number, max: number) => {
    const clamped = Math.max(0, Math.min(val, max));
    setCantidades(prev => ({ ...prev, [productoId]: clamped }));
  };

  const tieneSeleccion = Object.values(cantidades).some(c => c > 0);

  const totalReembolso = itemsConStock.reduce(
    (sum, it) => sum + it.subtotalUnitario * getCantidad(it.productoId), 0
  );

  const handleDevolver = () => {
    const requestItems = itemsConStock
      .filter(it => getCantidad(it.productoId) > 0)
      .map(it => ({ productoId: it.productoId, cantidad: getCantidad(it.productoId) }));

    if (requestItems.length === 0) return;

    devolver(
      { pedidoId, request: { items: requestItems, motivo: motivo || undefined } },
      { onSuccess: () => { setCantidades({}); setMotivo(''); onClose(); } }
    );
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(val);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Devolución Parcial de Productos" size="2xl">
      <div className="pt-2 space-y-4">
        <div className="flex items-start gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <Package size={16} className="text-blue-600 shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700">
            Seleccioná los productos que querés devolver y las cantidades. El stock será reintegrado automáticamente.
          </p>
        </div>

        {itemsConStock.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-3 bg-muted/10 rounded-xl border border-dashed border-border/60">
            <Package size={24} className="text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">No hay productos entregados para devolver.</p>
          </div>
        ) : (
          <>
            <div className="space-y-2 max-h-[40vh] overflow-y-auto custom-scrollbar pr-1">
              {itemsConStock.map((item) => (
                <div key={item.productoId} className="flex items-center justify-between bg-muted/5 rounded-xl border border-border/60 p-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{item.productoNombre}</p>
                    <p className="text-xs text-muted-foreground">
                      Entregado: {item.cantidadEntregada} x {formatCurrency(item.subtotalUnitario)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      type="button"
                      className="size-8 rounded-full bg-muted/20 flex items-center justify-center hover:bg-muted/40 transition-colors disabled:opacity-30"
                      onClick={() => setCantidad(item.productoId, getCantidad(item.productoId) - 1, item.cantidadEntregada)}
                      disabled={getCantidad(item.productoId) <= 0}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm font-bold tabular-nums">
                      {getCantidad(item.productoId)}
                    </span>
                    <button
                      type="button"
                      className="size-8 rounded-full bg-muted/20 flex items-center justify-center hover:bg-muted/40 transition-colors disabled:opacity-30"
                      onClick={() => setCantidad(item.productoId, getCantidad(item.productoId) + 1, item.cantidadEntregada)}
                      disabled={getCantidad(item.productoId) >= item.cantidadEntregada}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {tieneSeleccion && (
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 px-3 bg-muted/10 rounded-lg border border-border/40">
                  <span className="text-sm font-semibold text-muted-foreground">Total a reembolsar</span>
                  <span className="text-lg font-black text-amber-600">{formatCurrency(totalReembolso)}</span>
                </div>

                <input
                  type="text"
                  placeholder="Motivo de la devolución (opcional)"
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  className="w-full text-sm bg-background border border-border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />

                <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-700">
                    <p className="font-semibold">Confirmar devolución</p>
                    <p>Se reintegrarán los productos al stock. Esta acción no se puede deshacer.</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <Button variant="ghost" size="sm" onClick={onClose}>
                Cancelar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDevolver}
                disabled={isPending || !tieneSeleccion}
                isLoading={isPending}
                className="text-xs gap-1.5 border-amber-500 text-amber-600 hover:bg-amber-500/10"
              >
                <RotateCcw size={14} />
                Procesar devolución
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
