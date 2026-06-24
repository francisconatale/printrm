import React, { useState, useMemo } from 'react';
import { Modal } from '../../../components/ui/modal';
import { Button } from '../../../components/ui/button';
import { ShoppingCart, DollarSign, Package, Plus, Trash2, Search } from 'lucide-react';
import { useRegistrarVenta } from '../api/ventas.api';
import { useGetProductos } from '../../stock/api/productos.api';
import { Producto } from '../../stock/types/stock.types';

interface CrearVentaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SelectedItem {
  producto: Producto;
  cantidad: number;
}

export function CrearVentaModal({ isOpen, onClose }: CrearVentaModalProps) {
  const { data: productosData, isLoading: isLoadingProductos } = useGetProductos(0, 500);
  const productos = productosData?.content || [];
  
  const [items, setItems] = useState<SelectedItem[]>([]);
  const [compradorNombre, setCompradorNombre] = useState('');
  const [compradorEmail, setCompradorEmail] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { mutate: registrarVenta, isPending } = useRegistrarVenta();

  React.useEffect(() => {
    if (isOpen) {
      setItems([]);
      setCompradorNombre('');
      setCompradorEmail('');
      setSearchTerm('');
      setIsDropdownOpen(false);
    }
  }, [isOpen]);

  const filteredProductos = useMemo(() => {
    return productos.filter(p => 
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) && 
      !items.some(item => item.producto.id === p.id)
    );
  }, [productos, searchTerm, items]);

  const addItem = (producto: Producto) => {
    setItems([...items, { producto, cantidad: 1 }]);
    setSearchTerm('');
    setIsDropdownOpen(false);
  };

  const removeItem = (productoId: string) => {
    setItems(items.filter(i => i.producto.id !== productoId));
  };

  const updateQuantity = (productoId: string, cantidad: number) => {
    setItems(items.map(i => {
      if (i.producto.id === productoId) {
        return { ...i, cantidad: Math.max(1, Math.min(cantidad, i.producto.cantidadStock)) };
      }
      return i;
    }));
  };

  const total = items.reduce((sum, item) => sum + (item.producto.precioSugerido || 0) * item.cantidad, 0);

  const hasErrors = items.length === 0 || items.some(i => !i.producto.precioSugerido || i.producto.precioSugerido <= 0 || i.cantidad > i.producto.cantidadStock);

  const handleConfirm = () => {
    if (hasErrors) return;
    registrarVenta(
      {
        items: items.map(i => ({ productoId: i.producto.id, cantidad: i.cantidad })),
        compradorNombre: compradorNombre.trim() || undefined,
        compradorEmail: compradorEmail.trim() || undefined,
      },
      { onSuccess: onClose }
    );
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(val);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registrar Venta Directa" size="lg">
      <div className="space-y-6 pt-2">
        {/* Selector de productos */}
        <div className="relative">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <Package size={14} className="text-primary" /> Agregar Producto
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setIsDropdownOpen(true); }}
              onFocus={() => setIsDropdownOpen(true)}
              placeholder="Buscar producto por nombre..."
              className="w-full bg-background border border-border/60 rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          {isDropdownOpen && searchTerm.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-card border border-border/60 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {filteredProductos.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">No hay productos disponibles</div>
              ) : (
                filteredProductos.map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => addItem(p)}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-muted/10 transition-colors flex justify-between items-center"
                  >
                    <span>{p.nombre}</span>
                    <span className="text-xs text-muted-foreground">Stock: {p.cantidadStock}</span>
                  </button>
                ))
              )}
            </div>
          )}
          {/* Backdrop for dropdown */}
          {isDropdownOpen && (
            <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
          )}
        </div>

        {/* Lista de items */}
        {items.length > 0 && (
          <div className="space-y-3">
            {items.map((item) => {
              const sinPrecio = !item.producto.precioSugerido || item.producto.precioSugerido <= 0;
              const stockInsuficiente = item.cantidad > item.producto.cantidadStock;

              return (
                <div key={item.producto.id} className="bg-muted/10 rounded-xl border border-border/60 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Package size={20} className="text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">{item.producto.nombre}</p>
                        <p className="text-xs text-muted-foreground">
                          {sinPrecio ? <span className="text-destructive">Sin precio asignado</span> : formatCurrency(item.producto.precioSugerido!)} / un. (Stock: {item.producto.cantidadStock})
                        </p>
                      </div>
                    </div>
                    <button onClick={() => removeItem(item.producto.id)} className="text-muted-foreground hover:text-destructive p-2 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border/40">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.producto.id, item.cantidad - 1)}
                        className="size-8 rounded-lg border border-border flex items-center justify-center text-foreground hover:bg-muted/20 transition-colors disabled:opacity-30"
                        disabled={item.cantidad <= 1}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min={1}
                        max={item.producto.cantidadStock}
                        value={item.cantidad}
                        onChange={(e) => updateQuantity(item.producto.id, parseInt(e.target.value) || 1)}
                        className="w-16 bg-background border border-border rounded-lg text-center font-bold text-sm shadow-sm focus:ring-2 focus:ring-primary outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.producto.id, item.cantidad + 1)}
                        className="size-8 rounded-lg border border-border flex items-center justify-center text-foreground hover:bg-muted/20 transition-colors disabled:opacity-30"
                        disabled={item.cantidad >= item.producto.cantidadStock}
                      >
                        +
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-foreground">
                        {sinPrecio ? '-' : formatCurrency((item.producto.precioSugerido || 0) * item.cantidad)}
                      </p>
                    </div>
                  </div>
                  {stockInsuficiente && (
                    <p className="text-xs text-destructive mt-1">Stock insuficiente. Máximo: {item.producto.cantidadStock}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Totales y Comprador */}
        <div className="border-t border-border/60 pt-4 space-y-4">
          <div className="flex justify-between items-end">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
              <DollarSign size={14} className="text-primary" /> Total Venta
            </label>
            <p className="text-3xl font-black text-foreground">{formatCurrency(total)}</p>
          </div>

          <div className="space-y-3 pt-2">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Comprador (opcional)</p>
            <div className="grid grid-cols-2 gap-3">
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
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="outline" type="button" onClick={onClose} className="w-1/3">
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            className="w-2/3 font-bold uppercase tracking-wider shadow-md"
            disabled={hasErrors || isPending}
            isLoading={isPending}
          >
            Registrar Cobro
          </Button>
        </div>
      </div>
    </Modal>
  );
}
