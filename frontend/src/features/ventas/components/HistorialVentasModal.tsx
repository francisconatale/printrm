import React, { useState } from 'react';
import { Modal } from '../../../components/ui/modal';
import { Button } from '../../../components/ui/button';
import { useGetVentas, useDevolverVenta } from '../api/ventas.api';
import { Loader2, PackageSearch, RotateCcw, Minus, Plus } from 'lucide-react';

interface HistorialVentasModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HistorialVentasModal({ isOpen, onClose }: HistorialVentasModalProps) {
  const { data: ventas, isLoading } = useGetVentas();
  const { mutate: devolver, isPending: isDevolviendo } = useDevolverVenta();

  const [cantidades, setCantidades] = useState<Record<string, Record<string, number>>>({});

  const getCantidad = (grupoId: string, productoId: string) =>
    cantidades[grupoId]?.[productoId] ?? 0;

  const setCantidad = (grupoId: string, productoId: string, val: number, max: number) => {
    const clamped = Math.max(0, Math.min(val, max));
    setCantidades((prev) => ({
      ...prev,
      [grupoId]: { ...prev[grupoId], [productoId]: clamped },
    }));
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const handleDevolver = (grupoId: string) => {
    const items = (cantidades[grupoId] ?? {});
    const requestItems = Object.entries(items)
      .filter(([_, cant]) => cant > 0)
      .map(([productoId, cantidad]) => ({ productoId, cantidad }));

    if (requestItems.length === 0) return;

    devolver({ grupoId, request: { items: requestItems } });
  };

  const tieneSeleccion = (grupoId: string) =>
    Object.values(cantidades[grupoId] ?? {}).some((c) => c > 0);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Historial de Ventas" size="3xl">
      <div className="pt-2">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-muted-foreground" size={24} />
          </div>
        ) : !ventas || ventas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-muted/10 rounded-[2rem] border border-dashed border-border/60">
            <div className="size-16 rounded-full bg-background flex items-center justify-center border border-border">
              <PackageSearch size={24} className="text-muted-foreground/40" />
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-foreground">No hay ventas registradas</p>
              <p className="text-sm text-muted-foreground">Las ventas directas desde el catálogo aparecerán acá.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar pr-1">
            {ventas.map((venta) => (
              <div key={venta.grupoId} className="bg-muted/5 rounded-xl border border-border/60 p-4 space-y-2">
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>{formatDate(venta.fecha)}</span>
                  <span className="font-bold text-foreground text-sm">{formatCurrency(venta.total)}</span>
                </div>
                {venta.compradorNombre && (
                  <p className="text-xs text-muted-foreground">Comprador: {venta.compradorNombre}</p>
                )}
                <div className="space-y-1">
                  {venta.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-sm py-1 border-b border-border/20 last:border-0">
                      <span className="text-foreground">{item.productoNombre || 'Producto'}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground text-xs">
                          {item.cantidad} x {formatCurrency(item.precioUnitario)}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            className="size-6 rounded-full bg-muted/20 flex items-center justify-center hover:bg-muted/40 transition-colors disabled:opacity-30"
                            onClick={() =>
                              setCantidad(venta.grupoId, item.productoId, getCantidad(venta.grupoId, item.productoId) - 1, item.cantidad)
                            }
                            disabled={getCantidad(venta.grupoId, item.productoId) <= 0}
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-6 text-center text-xs font-medium tabular-nums">
                            {getCantidad(venta.grupoId, item.productoId)}
                          </span>
                          <button
                            type="button"
                            className="size-6 rounded-full bg-muted/20 flex items-center justify-center hover:bg-muted/40 transition-colors disabled:opacity-30"
                            onClick={() =>
                              setCantidad(venta.grupoId, item.productoId, getCantidad(venta.grupoId, item.productoId) + 1, item.cantidad)
                            }
                            disabled={getCantidad(venta.grupoId, item.productoId) >= item.cantidad}
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-1 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDevolver(venta.grupoId)}
                    disabled={isDevolviendo || !tieneSeleccion(venta.grupoId)}
                    isLoading={isDevolviendo}
                    className="text-xs gap-1.5"
                  >
                    <RotateCcw size={14} />
                    Devolver selección
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}
