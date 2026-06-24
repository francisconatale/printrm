import React, { useState } from 'react';
import { Modal } from '../../../components/ui/modal';
import { Button } from '../../../components/ui/button';
import { useGetVentas, useDevolverVenta } from '../api/ventas.api';
import { Loader2, RotateCcw, Minus, Plus, AlertTriangle, Package } from 'lucide-react';

interface DevolucionVentaModalProps {
  isOpen: boolean;
  grupoId: string;
  onClose: () => void;
}

export function DevolucionVentaModal({ isOpen, grupoId, onClose }: DevolucionVentaModalProps) {
  const { data: ventas, isLoading } = useGetVentas();
  const { mutate: devolver, isPending: isDevolviendo } = useDevolverVenta();

  const venta = ventas?.find(v => v.grupoId === grupoId);

  const [cantidades, setCantidades] = useState<Record<string, number>>({});
  const [motivo, setMotivo] = useState('');
  const [confirmacion, setConfirmacion] = useState(false);

  const getCantidad = (productoId: string) => cantidades[productoId] || 0;

  const setCantidad = (productoId: string, val: number, max: number) => {
    const clamped = Math.max(0, Math.min(val, max));
    setCantidades(prev => ({ ...prev, [productoId]: clamped }));
  };

  const tieneSeleccion = Object.values(cantidades).some(c => c > 0);

  const handleDevolver = () => {
    if (!venta) return;
    const items = Object.entries(cantidades)
      .filter(([_, cant]) => cant > 0)
      .map(([productoId, cantidad]) => ({ productoId, cantidad }));

    if (items.length === 0) return;

    devolver(
      { grupoId, request: { items, motivo: motivo || undefined } },
      { onSuccess: () => { setCantidades({}); setMotivo(''); setConfirmacion(false); onClose(); } }
    );
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Devolver Productos" size="2xl">
      <div className="pt-2 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="animate-spin text-muted-foreground" size={24} />
          </div>
        ) : !venta ? (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-3 bg-muted/10 rounded-xl border border-dashed border-border/60">
            <Package size={24} className="text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">No se encontró la venta.</p>
          </div>
        ) : (
          <>
            <div className="flex items-start gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <Package size={16} className="text-blue-600 shrink-0 mt-0.5" />
              <div className="text-xs text-blue-700">
                <p className="font-semibold">{venta.compradorNombre || 'Venta directa'}</p>
                <p>Seleccioná los productos y cantidades a devolver. El stock será reintegrado.</p>
              </div>
            </div>

            <div className="space-y-2 max-h-[40vh] overflow-y-auto custom-scrollbar pr-1">
              {venta.items.map((item, i) => (
                <div key={item.productoId || i} className="flex items-center justify-between bg-muted/5 rounded-xl border border-border/60 p-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{item.productoNombre || 'Producto'}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.cantidad} x {formatCurrency(item.precioUnitario)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      type="button"
                      className="size-8 rounded-full bg-muted/20 flex items-center justify-center hover:bg-muted/40 transition-colors disabled:opacity-30"
                      onClick={() => setCantidad(item.productoId, getCantidad(item.productoId) - 1, item.cantidad)}
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
                      onClick={() => setCantidad(item.productoId, getCantidad(item.productoId) + 1, item.cantidad)}
                      disabled={getCantidad(item.productoId) >= item.cantidad}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {tieneSeleccion && (
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Motivo de la devolución (opcional)"
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  className="w-full text-sm bg-background border border-border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />

                {!confirmacion ? (
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setConfirmacion(true)}
                      className="text-xs gap-1.5 border-amber-500 text-amber-600 hover:bg-amber-500/10"
                    >
                      <RotateCcw size={14} />
                      Devolver selección
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                      <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                      <div className="text-xs text-amber-700">
                        <p className="font-semibold">Confirmar devolución</p>
                        <p>Se reintegrarán los productos al stock. Esta acción no se puede deshacer.</p>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setConfirmacion(false)}>
                        Cancelar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDevolver}
                        disabled={isDevolviendo}
                        isLoading={isDevolviendo}
                        className="text-xs gap-1.5 border-amber-500 text-amber-600 hover:bg-amber-500/10"
                      >
                        <RotateCcw size={14} />
                        Confirmar devolución
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  );
}
