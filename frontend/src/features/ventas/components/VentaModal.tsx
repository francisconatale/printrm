import React from 'react';
import { Modal } from '../../../components/ui/modal';
import { Button } from '../../../components/ui/button';
import { ShoppingCart, DollarSign, Package } from 'lucide-react';
import { useRegistrarVenta } from '../api/ventas.api';
import { Producto } from '../../stock/types/stock.types';

interface VentaModalProps {
  isOpen: boolean;
  onClose: () => void;
  producto: Producto;
}

export function VentaModal({ isOpen, onClose, producto }: VentaModalProps) {
  const [cantidad, setCantidad] = React.useState(1);
  const [compradorNombre, setCompradorNombre] = React.useState('');
  const [compradorEmail, setCompradorEmail] = React.useState('');
  const { mutate: registrarVenta, isPending } = useRegistrarVenta();

  React.useEffect(() => {
    if (isOpen) {
      setCantidad(1);
      setCompradorNombre('');
      setCompradorEmail('');
    }
  }, [isOpen]);

  const precioUnitario = producto.precioSugerido || 0;
  const total = precioUnitario * cantidad;
  const sinPrecio = !producto.precioSugerido || producto.precioSugerido <= 0;
  const stockInsuficiente = cantidad > producto.cantidadStock;

  const handleConfirm = () => {
    if (sinPrecio || stockInsuficiente) return;
    registrarVenta(
      {
        items: [{ productoId: producto.id, cantidad }],
        compradorNombre: compradorNombre.trim() || undefined,
        compradorEmail: compradorEmail.trim() || undefined,
      },
      { onSuccess: onClose }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Venta Directa" size="md">
      <div className="space-y-6 pt-2">
        <div className="bg-muted/10 rounded-xl border border-border/60 p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Package size={20} className="text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">{producto.nombre}</p>
              <p className="text-xs text-muted-foreground">Stock disponible: {producto.cantidadStock} unidades</p>
            </div>
          </div>
        </div>

        {sinPrecio && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-xl border border-destructive/20">
            Este producto no tiene un precio de venta asignado. Editá el producto para asignarle un precio antes de vender.
          </div>
        )}

        <div>
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <ShoppingCart size={14} className="text-primary" /> Cantidad
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setCantidad(Math.max(1, cantidad - 1))}
              className="size-9 rounded-lg border border-border flex items-center justify-center text-foreground font-bold hover:bg-muted/20 transition-colors disabled:opacity-30"
              disabled={cantidad <= 1}
            >
              -
            </button>
            <input
              type="number"
              min={1}
              max={producto.cantidadStock}
              value={cantidad}
              onChange={(e) => setCantidad(Math.min(producto.cantidadStock, Math.max(1, parseInt(e.target.value) || 1)))}
              className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-center font-bold text-lg shadow-sm focus:ring-2 focus:ring-primary outline-none"
            />
            <button
              type="button"
              onClick={() => setCantidad(Math.min(producto.cantidadStock, cantidad + 1))}
              className="size-9 rounded-lg border border-border flex items-center justify-center text-foreground font-bold hover:bg-muted/20 transition-colors disabled:opacity-30"
              disabled={cantidad >= producto.cantidadStock}
            >
              +
            </button>
          </div>
          {stockInsuficiente && (
            <p className="text-xs text-destructive mt-1">Stock insuficiente. Máximo: {producto.cantidadStock}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <DollarSign size={14} className="text-primary" /> Precio Unitario
            </label>
            <p className="text-lg font-bold text-foreground">${precioUnitario.toLocaleString('es-AR')}</p>
          </div>
          <div className="text-right">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Total</label>
            <p className="text-2xl font-black text-foreground">${total.toLocaleString('es-AR')}</p>
          </div>
        </div>

        <div className="border-t border-border/60 pt-4 space-y-3">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Comprador (opcional)</p>
          <input
            type="text"
            value={compradorNombre}
            onChange={(e) => setCompradorNombre(e.target.value)}
            placeholder="Nombre del comprador"
            className="w-full bg-background border border-border/60 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="email"
            value={compradorEmail}
            onChange={(e) => setCompradorEmail(e.target.value)}
            placeholder="Email del comprador"
            className="w-full bg-background border border-border/60 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            className="font-bold uppercase tracking-wider shadow-md"
            disabled={sinPrecio || stockInsuficiente || isPending}
            isLoading={isPending}
          >
            Confirmar Venta
          </Button>
        </div>
      </div>
    </Modal>
  );
}
