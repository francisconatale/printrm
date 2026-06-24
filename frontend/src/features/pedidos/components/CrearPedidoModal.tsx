import React from 'react';
import { useGetClientes } from '../../clientes/api/clientes.api';
import { useGetProductos } from '../../stock/api/productos.api';
import { useCreatePedido } from '../api/pedidos.api';
import { Modal } from '../../../components/ui/modal';
import { Button } from '../../../components/ui/button';
import { ProfileSelect } from '../../../components/ui/profile-select';
import { Plus, Trash2, AlertCircle, User, ShoppingBag, DollarSign, Percent, TrendingUp } from 'lucide-react';

interface CrearPedidoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CrearPedidoModal({ isOpen, onClose }: CrearPedidoModalProps) {
  const { data: clientesData } = useGetClientes(0, 200);
  const { data: productosData } = useGetProductos(0, 200);
  const clientes = clientesData?.content;
  const productos = productosData?.content;
  const { mutate: createPedido, isPending: isCreating } = useCreatePedido();

  interface ItemFormState {
    keyId: string;
    productoId: string;
    cantidad: number;
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
          cantidad: it.cantidad
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
        const prodCost = prodObj ? (prodObj.partes?.length > 0 ? prodObj.partes.reduce((sum, p) => sum + (p.costoBase || 0), 0) : (prodObj.lotes?.[0]?.costoUnitario || 0)) : 0;
        const price = prodObj?.precioSugerido || 0;
        
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
      title="Nueva Orden de Trabajo"
      description="Creá un pedido estructurado seleccionando productos de la base de datos."
      isOpen={isOpen}
      onClose={onClose}
      size="5xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6 pt-2 pb-4">
        {error && (
          <div className="flex items-center gap-2 text-red-500 bg-red-500/10 p-3 rounded-xl border border-red-500/20 text-sm">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Encabezado: Cliente */}
        <div className="bg-muted/10 border border-border/50 rounded-xl p-5 flex flex-col md:flex-row md:justify-between md:items-end gap-4 shadow-sm">
          <div className="flex-1 max-w-md">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <User size={14} className="text-primary" /> Facturar a:
            </label>
            <ProfileSelect
              placeholder="Buscar cliente por nombre o DNI..."
              emptyLabel="Buscar cliente por nombre o DNI..."
              value={clienteId}
              onValueChange={setClienteId}
              items={(clientes ?? []).map((c) => ({ value: c.id, label: c.nombre }))}
            />
          </div>
          <div className="text-right hidden md:block pb-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Fecha de Orden</p>
            <p className="text-sm font-bold text-foreground">{new Date().toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
          </div>
        </div>

        {/* Tabla de Productos (Estilo Factura) */}
        <div className="border border-border/60 rounded-xl overflow-hidden bg-background shadow-sm">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-sm border-collapse min-w-[750px]">
              <thead className="bg-muted/30">
                <tr className="border-b-2 border-border text-foreground">
                  <th className="py-3.5 px-4 font-bold text-xs tracking-wider uppercase text-muted-foreground">Producto / Servicio</th>
                  <th className="py-3.5 px-4 font-bold text-xs tracking-wider uppercase text-muted-foreground text-center w-24">Cant.</th>
                  <th className="py-3.5 px-4 font-bold text-xs tracking-wider uppercase text-muted-foreground text-right w-28">Costo Base</th>
                  <th className="py-3.5 px-4 font-bold text-xs tracking-wider uppercase text-muted-foreground text-right w-32">Margen %</th>
                  <th className="py-3.5 px-4 font-bold text-xs tracking-wider uppercase text-muted-foreground text-right w-36">Precio Unit.</th>
                  <th className="py-3.5 px-4 font-bold text-xs tracking-wider uppercase text-muted-foreground text-right w-32">Importe</th>
                  <th className="py-3.5 px-4 w-12"></th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-muted-foreground bg-muted/5">
                      <ShoppingBag size={40} className="mx-auto mb-4 opacity-20" />
                      <p className="text-sm font-semibold">No hay líneas en la orden</p>
                      <Button type="button" variant="outline" size="sm" onClick={handleAddItem} className="mt-5 rounded-full px-6">
                        <Plus size={14} className="mr-1.5" /> Insertar Primera Línea
                      </Button>
                    </td>
                  </tr>
                ) : (
                  items.map((item, index) => {
                    const prodObj = productos?.find(p => p.id === item.productoId);
                    const prodCost = prodObj ? (prodObj.partes?.length > 0 ? prodObj.partes.reduce((sum, p) => sum + (p.costoBase || 0), 0) : (prodObj.lotes?.[0]?.costoUnitario || 0)) : 0;
                    const isEmptyRow = !item.productoId;

                    const currentPrice = prodObj?.precioSugerido || 0;
                    const marginPercent = prodCost > 0 ? Math.round(((currentPrice - prodCost) / prodCost) * 100) : 0;

                    return (
                      <tr key={item.keyId} className="border-b border-border/40 hover:bg-muted/10 transition-colors group">
                        <td className="py-2.5 px-4">
                          <ProfileSelect
                            placeholder="Seleccionar producto..."
                            emptyLabel="Seleccionar producto..."
                            value={item.productoId}
                            onValueChange={(val) => handleItemChange(item.keyId, 'productoId', val)}
                            items={(productos ?? []).map((p) => ({
                              value: p.id,
                              label: `${p.nombre} (Stock: ${p.cantidadStock})`,
                            }))}
                          />
                        </td>
                        <td className="py-2.5 px-4">
                          <input
                            type="number"
                            min="1"
                            value={item.cantidad}
                            onChange={(e) => handleItemChange(item.keyId, 'cantidad', parseInt(e.target.value) || 0)}
                            className="w-full bg-background border border-border rounded-lg px-2 py-2 text-center font-bold shadow-sm focus:ring-2 focus:ring-primary outline-none"
                          />
                        </td>
                        <td className="py-2.5 px-4 text-right text-muted-foreground font-semibold">
                          ${prodCost.toFixed(0)}
                        </td>
                        <td className="py-2.5 px-4">
                          <div className="relative">
                            <span className="block w-full bg-primary/5 border border-primary/10 rounded-lg pl-2 pr-6 py-2 text-right font-bold text-primary shadow-sm opacity-60">
                              {isEmptyRow ? '-' : marginPercent}
                            </span>
                            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-primary font-bold pointer-events-none">%</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-4">
                          <div className="relative">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-bold">$</span>
                            <span className="block w-full bg-muted/20 border border-border rounded-lg pl-6 pr-2 py-2 text-right font-bold shadow-sm opacity-60">
                              {isEmptyRow ? '-' : Math.round(currentPrice)}
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 px-4 text-right font-black text-foreground">
                          ${Math.round(currentPrice * item.cantidad).toLocaleString()}
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.keyId)}
                            className="text-muted-foreground/30 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30"
                            title="Eliminar línea"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
                {items.length > 0 && (
                  <tr>
                    <td colSpan={7} className="py-3 px-4 border-b border-border/40 bg-muted/5">
                      <button
                        type="button"
                        onClick={handleAddItem}
                        className="text-primary text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 hover:underline"
                      >
                        <Plus size={14} /> Insertar Nueva Línea
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Resumen de Totales y Finanzas (Estilo Factura) */}
        <div className="flex flex-col md:flex-row justify-between items-start pt-6">
          {/* Info extra */}
          <div className="w-full md:w-1/2 text-muted-foreground text-xs p-5 bg-muted/10 rounded-xl border border-border/60 mb-4 md:mb-0 hidden md:block shadow-sm">
            <p className="font-bold mb-3 uppercase tracking-wider text-foreground">Detalles Operativos</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="block opacity-70 mb-1">Total Unidades:</span>
                <span className="font-bold text-foreground text-base">{totals.totalCantidad}</span>
              </div>
              <div>
                <span className="block opacity-70 mb-1">Rentabilidad Promedio:</span>
                <span className="font-bold text-primary text-base">{Math.round(totals.margenPromedio)}%</span>
              </div>
            </div>
          </div>

          {/* Totales */}
          <div className="w-full md:w-80 space-y-3 bg-muted/5 p-5 rounded-xl border border-border/50 shadow-sm">
            <div className="flex justify-between text-sm border-b border-border/60 pb-3">
              <span className="text-muted-foreground font-semibold">Subtotal Costos Base</span>
              <span className="font-bold">${totals.totalCosto.toLocaleString(undefined, { minimumFractionDigits: 0 })}</span>
            </div>
            <div className="flex justify-between text-sm border-b border-border/60 pb-3">
              <span className="text-muted-foreground font-semibold">Ganancia Proyectada</span>
              <span className="font-bold text-green-600 dark:text-green-500">+${totals.gananciaEstimada.toLocaleString(undefined, { minimumFractionDigits: 0 })}</span>
            </div>
            <div className="flex justify-between items-end pt-2 pb-4">
              <span className="font-black text-foreground uppercase tracking-wider text-sm">Total</span>
              <span className="font-black text-foreground text-3xl leading-none">
                ${totals.totalPrecio.toLocaleString(undefined, { minimumFractionDigits: 0 })}
              </span>
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="outline" type="button" onClick={onClose} className="w-1/3">
                Cancelar
              </Button>
              <Button
                type="submit"
                className="w-2/3 font-bold uppercase tracking-wider shadow-md"
                disabled={!isFormValid}
                isLoading={isCreating}
                title={
                  !clienteId
                    ? "Seleccioná un cliente antes de confirmar"
                    : !items.some(it => it.productoId)
                    ? "Elegí al menos un producto para confirmar"
                    : items.some(it => it.cantidad <= 0)
                    ? "La cantidad de todos los ítems debe ser mayor a 0"
                    : undefined
                }
              >
                Emitir Pedido
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
}

