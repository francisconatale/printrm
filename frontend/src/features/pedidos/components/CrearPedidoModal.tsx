import React from 'react';
import { useGetClientes } from '../../clientes/api/clientes.api';
import { useGetProductos } from '../../stock/api/productos.api';
import { useCreatePedido } from '../api/pedidos.api';
import { Modal } from '../../../components/ui/modal';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import { Plus, Trash2, AlertCircle, User, ShoppingBag, DollarSign, Percent, TrendingUp } from 'lucide-react';

interface CrearPedidoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CrearPedidoModal({ isOpen, onClose }: CrearPedidoModalProps) {
  const { data: clientes } = useGetClientes();
  const { data: productos } = useGetProductos();
  const { mutate: createPedido, isPending: isCreating } = useCreatePedido();

  interface ItemFormState {
    keyId: string;
    productoId: string;
    cantidad: number;
    precioPersonalizado?: number;
  }

  const [clienteId, setClienteId] = React.useState<string>('');
  const [items, setItems] = React.useState<ItemFormState[]>([
    { keyId: Math.random().toString(), productoId: '', cantidad: 1 }
  ]);
  const [error, setError] = React.useState<string>('');

  const handleAddItem = () => {
    setItems(prev => [...prev, { keyId: Math.random().toString(), productoId: '', cantidad: 1 }]);
  };

  const handleRemoveItem = (keyId: string) => {
    setItems(prev => prev.filter(item => item.keyId !== keyId));
  };

  const handleItemChange = (keyId: string, field: keyof ItemFormState, value: any) => {
    setItems(prev => {
      const index = prev.findIndex(item => item.keyId === keyId);
      if (index === -1) return prev;

      // Si cambia el producto y ya está seleccionado en otra fila, unificamos cantidades
      if (field === 'productoId' && value) {
        const existingIndex = prev.findIndex((item) => item.keyId !== keyId && item.productoId === value);
        if (existingIndex !== -1) {
          const copy = [...prev];
          const currentQty = copy[index].cantidad || 1;
          copy[existingIndex] = {
            ...copy[existingIndex],
            cantidad: (copy[existingIndex].cantidad || 0) + currentQty
          };
          // Eliminamos la fila actual redundante
          return copy.filter(item => item.keyId !== keyId);
        }
      }

      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        [field]: value
      };
      if (field === 'productoId') {
        const prodObj = productos?.find(p => p.id === value);
        const prodCost = prodObj ? prodObj.partes.reduce((sum, p) => sum + (p.costoBase || 0), 0) : 0;
        // Default 200% margin (3x cost)
        copy[index].precioPersonalizado = prodCost * 3;
      }
      return copy;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!clienteId) {
      setError('Por favor, selecciona un cliente.');
      return;
    }

    const validItems = items.filter(item => item.productoId !== '');
    if (validItems.length === 0) {
      setError('Por favor, agrega al menos un ítem.');
      return;
    }

    if (validItems.some(item => item.cantidad <= 0)) {
      setError('La cantidad debe ser mayor a 0.');
      return;
    }

    createPedido(
      {
        clienteId,
        items: validItems.map(it => ({
          productoId: it.productoId,
          cantidad: it.cantidad,
          precioPersonalizado: it.precioPersonalizado
        }))
      },
      {
        onSuccess: () => {
          onClose();
        },
        onError: (err: any) => {
          setError('Error al crear el pedido: ' + (err.response?.data?.message || err.message));
        }
      }
    );
  };

  // Cálculo de totales y ganancias
  const totals = React.useMemo(() => {
    let totalPrecio = 0;
    let totalCosto = 0;
    let totalCantidad = 0;

    items.forEach(item => {
      if (item.productoId) {
        const prodObj = productos?.find(p => p.id === item.productoId);
        const prodCost = prodObj ? prodObj.partes.reduce((sum, p) => sum + (p.costoBase || 0), 0) : 0;
        const price = item.precioPersonalizado !== undefined ? item.precioPersonalizado : (prodCost * 3);
        
        totalPrecio += price * item.cantidad;
        totalCosto += prodCost * item.cantidad;
        totalCantidad += item.cantidad;
      }
    });

    const gananciaEstimada = totalPrecio - totalCosto;
    const margenPromedio = totalCosto > 0 ? (gananciaEstimada / totalCosto) * 100 : 0;

    return {
      totalPrecio,
      totalCosto,
      totalCantidad,
      gananciaEstimada,
      margenPromedio
    };
  }, [items, productos]);

  const isFormValid = clienteId && items.some(item => item.productoId !== '') && !isCreating;

  return (
    <Modal
      title="Nuevo Pedido"
      description="Creá un nuevo pedido seleccionando productos de catálogo."
      isOpen={isOpen}
      onClose={onClose}
      size="5xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6 pt-4">
        {error && (
          <div className="flex items-center gap-2 text-red-500 bg-red-500/10 p-3 rounded-xl border border-red-500/20 text-sm">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Selector de Cliente con Diseño Premium */}
        <div className="bg-muted/20 border border-border/60 rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <User size={16} className="text-primary" />
            <label className="text-xs font-semibold uppercase tracking-wider">Cliente Asignado</label>
          </div>
          <Select value={clienteId} onValueChange={setClienteId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona un cliente *" />
            </SelectTrigger>
            <SelectContent className="z-[300]" position="popper" side="bottom">
              <SelectItem value="">
                Selecciona un cliente *
              </SelectItem>
              {clientes?.map(cliente => (
                <SelectItem key={cliente.id} value={cliente.id}>
                  {cliente.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sección de Ítems */}
        <div className="space-y-2">
          <div className="flex justify-between items-center pb-2 border-b border-border/40">
            <div className="flex items-center gap-2">
              <ShoppingBag size={16} className="text-primary" />
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Productos en este Pedido</span>
            </div>
            <button
              type="button"
              onClick={handleAddItem}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-200"
            >
              <Plus size={12} />
              <span>Agregar Producto</span>
            </button>
          </div>

          {/* Encabezados de Grilla */}
          <div className="hidden md:flex gap-4 px-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider py-1.5">
            <div className="flex-1">Producto *</div>
            <div className="w-16 text-center">Cant.</div>
            <div className="w-20 text-right">Costo Base</div>
            <div className="w-20 text-right">Margen %</div>
            <div className="w-24 text-right">Precio Unit.</div>
            <div className="w-24 text-right">Subtotal</div>
            <div className="w-8"></div>
          </div>

          {/* Lista de Filas de Items */}
          <div className="space-y-1 max-h-[340px] overflow-y-auto pr-1 custom-scrollbar">
            {items.map((item, index) => {
              const prodObj = productos?.find(p => p.id === item.productoId);
              const prodCost = prodObj ? prodObj.partes.reduce((sum, p) => sum + (p.costoBase || 0), 0) : 0;
              const isEmptyRow = !item.productoId;

              const currentPrice = item.precioPersonalizado !== undefined ? item.precioPersonalizado : (prodCost * 3);
              const marginPercent = prodCost > 0 ? Math.round(((currentPrice - prodCost) / prodCost) * 100) : 200;

              return (
                <div 
                  key={item.keyId} 
                  className="flex flex-col md:flex-row md:items-center gap-3 py-3 border-b border-border/40 last:border-0"
                >
                  {/* Selector de Producto */}
                  <div className="flex-1 min-w-[200px]">
                    <label className="block md:hidden text-[10px] font-bold text-muted-foreground uppercase mb-1">Producto</label>
                    <Select
                      value={item.productoId}
                      onValueChange={(val) => handleItemChange(item.keyId, 'productoId', val)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona un producto *" />
                      </SelectTrigger>
                      <SelectContent className="z-[300]" position="popper" side="bottom">
                        <SelectItem value="">
                          Selecciona un producto *
                        </SelectItem>
                        {productos?.map(p => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.nombre} (Stock: {p.cantidadStock})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-wrap md:flex-nowrap items-end md:items-center gap-3 flex-1 justify-between md:justify-end">
                    {/* Cantidad */}
                    <div className="w-16">
                      <label className="block md:hidden text-[10px] font-bold text-muted-foreground uppercase mb-1">Cant.</label>
                      <input
                        type="number"
                        min="1"
                        value={item.cantidad}
                        onChange={(e) => handleItemChange(item.keyId, 'cantidad', parseInt(e.target.value) || 0)}
                        className="w-full bg-background border border-border rounded-xl px-2 py-1.5 text-center text-sm font-bold focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      />
                    </div>

                    {/* Costo Base */}
                    <div className="w-20 text-right">
                      <label className="block md:hidden text-[10px] font-bold text-muted-foreground uppercase mb-1">Costo</label>
                      <span className="text-xs font-semibold text-muted-foreground block py-1.5">
                        ${prodCost.toFixed(0)}
                      </span>
                    </div>

                    {/* Margen % */}
                    <div className="w-20 relative">
                      <label className="block md:hidden text-[10px] font-bold text-muted-foreground uppercase mb-1">Margen %</label>
                      <div className="relative">
                        <input
                          type="number"
                          min="-100"
                          value={isEmptyRow ? '' : marginPercent}
                          disabled={isEmptyRow}
                          onChange={(e) => {
                            const marginVal = parseFloat(e.target.value) || 0;
                            const calculatedPrice = prodCost * (1 + marginVal / 100);
                            handleItemChange(item.keyId, 'precioPersonalizado', Math.round(calculatedPrice));
                          }}
                          placeholder="200"
                          className="w-full bg-background border border-border rounded-xl pl-2 pr-5 py-1.5 text-sm text-right font-semibold disabled:opacity-40 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground font-bold pointer-events-none">%</span>
                      </div>
                    </div>

                    {/* Precio Unitario Final */}
                    <div className="w-24 relative">
                      <label className="block md:hidden text-[10px] font-bold text-muted-foreground uppercase mb-1">Precio Unit.</label>
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-bold">$</span>
                        <input
                          type="number"
                          step="1"
                          min="0"
                          value={isEmptyRow ? '' : Math.round(currentPrice)}
                          disabled={isEmptyRow}
                          onChange={(e) => {
                            const priceVal = parseFloat(e.target.value) || 0;
                            handleItemChange(item.keyId, 'precioPersonalizado', priceVal);
                          }}
                          placeholder="0"
                          className="w-full bg-primary/5 border border-primary/20 hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl pl-5 pr-2 py-1.5 text-sm text-right font-bold transition-all disabled:opacity-40 outline-none"
                        />
                      </div>
                    </div>

                    {/* Subtotal */}
                    <div className="w-24 text-right">
                      <label className="block md:hidden text-[10px] font-bold text-muted-foreground uppercase mb-1">Subtotal</label>
                      <span className="font-bold text-sm text-foreground block py-1.5">
                        ${Math.round(currentPrice * item.cantidad)}
                      </span>
                    </div>

                    {/* Botón Eliminar */}
                    <div className="pt-2 md:pt-0">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.keyId)}
                        disabled={items.length === 1}
                        className="p-2 rounded-xl text-muted-foreground/60 hover:text-red-500 hover:bg-red-500/10 active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                        title="Eliminar este ítem"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Panel de Resumen de Finanzas (Minimalista sin bordes) */}
        {totals.totalPrecio > 0 && (
          <div className="flex flex-row flex-wrap justify-between gap-4 py-4 border-t border-b border-border/60">
            <div className="flex-1 min-w-[100px]">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Productos</span>
              <span className="text-sm font-semibold text-foreground">{totals.totalCantidad} unidades</span>
            </div>
            <div className="flex-1 min-w-[120px]">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Costo Estimado</span>
              <span className="text-sm font-semibold text-foreground/80">${totals.totalCosto.toFixed(0)}</span>
            </div>
            <div className="flex-1 min-w-[120px]">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                Ganancia <TrendingUp size={10} className="text-green-500" />
              </span>
              <span className="text-sm font-bold text-green-500">${totals.gananciaEstimada.toFixed(0)}</span>
            </div>
            <div className="flex-1 min-w-[100px]">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Rentabilidad</span>
              <span className="text-sm font-bold text-primary">{Math.round(totals.margenPromedio)}%</span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center pt-2">
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total del Pedido</p>
            <p className="text-3xl font-extrabold text-foreground font-mono leading-none mt-1">
              ${totals.totalPrecio.toLocaleString()}
            </p>
          </div>

          <div className="flex gap-3">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-5 py-2.5 rounded-full border border-border hover:bg-muted text-sm font-medium active:scale-95 transition-all"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={!isFormValid} 
              title={
                !clienteId 
                  ? "Seleccioná un cliente antes de confirmar" 
                  : !items.some(it => it.productoId) 
                  ? "Elegí al menos un producto para confirmar"
                  : items.some(it => it.cantidad <= 0)
                  ? "La cantidad de todos los ítems debe ser mayor a 0"
                  : undefined
              }
              className="studio-button-primary disabled:opacity-50"
            >
              {isCreating ? 'Procesando...' : 'Confirmar Pedido'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

