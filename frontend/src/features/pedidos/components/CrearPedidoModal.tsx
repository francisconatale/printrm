import React from 'react';
import { useGetClientes } from '../../clientes/api/clientes.api';
import { useGetProductos } from '../../stock/api/productos.api';
import { useCreatePedido } from '../api/pedidos.api';
import { Modal } from '../../../components/ui/modal';
import { Plus, Trash2, AlertCircle } from 'lucide-react';

interface CrearPedidoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CrearPedidoModal({ isOpen, onClose }: CrearPedidoModalProps) {
  const { data: clientes } = useGetClientes();
  const { data: productos } = useGetProductos();
  const { mutate: createPedido, isPending: isCreating } = useCreatePedido();

  interface ItemFormState {
    productoId: string;
    cantidad: number;
    precioPersonalizado?: number;
  }

  const [clienteId, setClienteId] = React.useState<string>('');
  const [items, setItems] = React.useState<ItemFormState[]>([
    { productoId: '', cantidad: 1 }
  ]);
  const [error, setError] = React.useState<string>('');

  const handleAddItem = () => {
    setItems(prev => [...prev, { productoId: '', cantidad: 1 }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof ItemFormState, value: any) => {
    setItems(prev => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        [field]: value
      };
      if (field === 'productoId') {
        const prodObj = productos?.find(p => p.id === value);
        copy[index].precioPersonalizado = prodObj?.precioSugerido ?? undefined;
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

  const calculateTotalPreview = () => {
    return items.reduce((sum, item) => {
      if (item.productoId) {
        const prodObj = productos?.find(p => p.id === item.productoId);
        const price = item.precioPersonalizado !== undefined ? item.precioPersonalizado : (prodObj?.precioSugerido || 0);
        return sum + (price * item.cantidad);
      }
      return sum;
    }, 0);
  };

  const isFormValid = clienteId && items.some(item => item.productoId !== '') && !isCreating;

  return (
    <Modal
      title="Nuevo Pedido"
      description="Creá un nuevo pedido seleccionando productos de catálogo."
      isOpen={isOpen}
      onClose={onClose}
      size="3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6 pt-4">
        {error && (
          <div className="flex items-center gap-2 text-red-500 bg-red-500/10 p-3 rounded-lg border border-red-500/20 text-sm">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Cliente Selector */}
        <div className="space-y-2">
          <label className="studio-caption font-semibold">Cliente</label>
          <select
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
            className="w-full bg-white border border-[#e0e0e0] rounded-lg px-4 py-2 focus:ring-2 focus:ring-black outline-none transition-all text-sm"
          >
            <option value="">Elegí un cliente *</option>
            {clientes?.map(cliente => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Items Section */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="studio-caption font-semibold">Ítems del Pedido</label>
            <button
              type="button"
              onClick={handleAddItem}
              className="flex items-center gap-1 text-sm text-primary hover:opacity-85 font-medium"
            >
              <Plus size={14} aria-hidden="true" />
              <span>Agregar Ítem</span>
            </button>
          </div>

          {/* Grid Headers for Numeric Columns */}
          <div className="flex gap-4 px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider pb-1.5 border-b border-border/40">
            <div className="flex-1">Producto *</div>
            <div className="w-20 text-center">Cant.</div>
            <div className="w-28 text-right">Precio Unit. (Editar)</div>
            <div className="w-24 text-right">Subtotal</div>
            <div className="w-8"></div>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {items.map((item, index) => {
              const selectedPrice = productos?.find(p => p.id === item.productoId)?.precioSugerido;
              const isEmptyRow = !item.productoId;

              return (
                <div key={index} className="flex flex-col gap-3 bg-muted/10 p-4 rounded-xl border border-border/50">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 flex gap-2">
                      <select
                        value={item.productoId}
                        onChange={(e) => handleItemChange(index, 'productoId', e.target.value)}
                        className="flex-1 bg-white border border-[#e0e0e0] rounded-lg px-3 py-1.5 text-sm"
                      >
                        <option value="">Elegí un producto *</option>
                        {productos?.map(p => (
                          <option key={p.id} value={p.id}>{p.nombre} (Stock: {p.cantidadStock})</option>
                        ))}
                      </select>
                    </div>

                    <div className="w-20">
                      <input
                        type="number"
                        min="1"
                        value={item.cantidad}
                        onChange={(e) => handleItemChange(index, 'cantidad', parseInt(e.target.value) || 0)}
                        className="w-full bg-white border border-[#e0e0e0] rounded-lg px-2 py-1.5 text-center text-sm font-bold"
                      />
                    </div>

                    <div className="w-28 relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-mono">$</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.precioPersonalizado !== undefined ? item.precioPersonalizado : (selectedPrice || '')}
                        onChange={(e) => {
                          const val = e.target.value;
                          handleItemChange(index, 'precioPersonalizado', val === '' ? undefined : parseFloat(val));
                        }}
                        placeholder="0.00"
                        className="w-full bg-blue-50/30 border border-primary/20 hover:border-primary focus:border-primary/80 focus:ring-1 focus:ring-primary/30 rounded-lg pl-5 pr-2 py-1.5 text-sm font-mono text-right transition-colors"
                        title="Precio unitario (editable)"
                      />
                    </div>

                    <div className="w-24 text-right font-mono font-bold text-sm text-foreground/80">
                      ${((item.precioPersonalizado !== undefined ? item.precioPersonalizado : (selectedPrice || 0)) * item.cantidad).toFixed(2)}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      disabled={items.length === 1}
                      className={`p-1.5 rounded-full transition-colors ${
                        isEmptyRow 
                          ? 'text-muted-foreground/30 hover:text-foreground hover:bg-muted/50' 
                          : 'text-red-400 hover:text-red-600 hover:bg-red-500/10'
                      }`}
                      title={isEmptyRow ? "Quitar fila" : "Eliminar ítem (se perderán los datos)"}
                      aria-label="Quitar fila"
                    >
                      <Trash2 size={16} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Summary */}
        <div className="flex justify-between items-center border-t border-[var(--studio-hairline)] pt-4">
          <div>
            <p className="studio-caption text-muted-foreground uppercase tracking-widest text-[9px] font-bold">Total Presupuestado</p>
            <p className="studio-lead font-bold text-2xl text-foreground font-mono">${calculateTotalPreview().toFixed(2)}</p>
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="studio-button-secondary-pill">Cancelar</button>
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
              {isCreating ? 'Creando...' : 'Confirmar Pedido'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
