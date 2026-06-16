import React from 'react';
import { useGetClientes } from '../../clientes/api/clientes.api';
import { useGetHistorial } from '../../calculo/api/calculos.api';
import { useGetProductos } from '../../stock/api/productos.api';
import { useCreatePedido } from '../api/pedidos.api';
import { Modal } from '../../../components/ui/modal';
import { Plus, Trash2, AlertCircle, Loader2 } from 'lucide-react';
import { ItemPedidoRequest } from '../types/pedidos.types';

interface CrearPedidoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CrearPedidoModal({ isOpen, onClose }: CrearPedidoModalProps) {
  const { data: clientes, isLoading: isLoadingClientes } = useGetClientes();
  const { data: historial, isLoading: isLoadingHistorial } = useGetHistorial();
  const { data: productos, isLoading: isLoadingProductos } = useGetProductos();
  const { mutate: createPedido, isPending: isCreating } = useCreatePedido();

  const [clienteId, setClienteId] = React.useState<string>('');
  const [items, setItems] = React.useState<ItemPedidoRequest[]>([
    { calculoId: '', productoId: '', cantidad: 1 }
  ]);
  const [error, setError] = React.useState<string>('');

  const handleAddItem = () => {
    setItems(prev => [...prev, { calculoId: '', productoId: '', cantidad: 1 }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof ItemPedidoRequest, value: string | number) => {
    setItems(prev => {
      const copy = [...prev];
      if (field === 'calculoId' && value !== '') {
        copy[index] = { ...copy[index], calculoId: value as string, productoId: '', [field]: value };
      } else if (field === 'productoId' && value !== '') {
        copy[index] = { ...copy[index], productoId: value as string, calculoId: '', [field]: value };
      } else {
        copy[index] = {
          ...copy[index],
          [field]: value
        };
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

    const validItems = items.filter(item => item.calculoId !== '' || item.productoId !== '');
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
          calculoId: it.calculoId || undefined,
          productoId: it.productoId || undefined,
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

  const calculateTotalPreview = () => {
    return items.reduce((sum, item) => {
      if (item.calculoId) {
        const calcObj = historial?.find(h => h.id === item.calculoId);
        return sum + (calcObj ? calcObj.precioVenta * item.cantidad : 0);
      }
      if (item.productoId) {
        const prodObj = productos?.find(p => p.id === item.productoId);
        return sum + (prodObj?.precioSugerido ? prodObj.precioSugerido * item.cantidad : 0);
      }
      return sum;
    }, 0);
  };

  const isFormValid = clienteId && items.some(item => item.calculoId !== '' || item.productoId !== '') && !isCreating;

  return (
    <Modal
      title="Nuevo Pedido"
      description="Creá un nuevo pedido asociando cotizaciones o productos de catálogo."
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
            <option value="">-- Seleccionar Cliente --</option>
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
              <Plus size={14} /> Agregar Ítem
            </button>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {items.map((item, index) => {
              const selectedPrice = item.calculoId 
                ? historial?.find(h => h.id === item.calculoId)?.precioVenta
                : productos?.find(p => p.id === item.productoId)?.precioSugerido;

              return (
                <div key={index} className="flex flex-col gap-3 bg-muted/10 p-4 rounded-xl border border-border/50">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 flex gap-2">
                      <select
                        value={item.productoId ? 'PROD' : 'CALC'}
                        onChange={(e) => {
                          if (e.target.value === 'PROD') handleItemChange(index, 'productoId', '');
                          else handleItemChange(index, 'calculoId', '');
                        }}
                        className="w-32 bg-[#f5f5f7] border border-transparent rounded-lg px-2 py-1.5 text-[10px] font-bold uppercase"
                      >
                        <option value="CALC">Cotización</option>
                        <option value="PROD">Producto</option>
                      </select>

                      {item.productoId !== undefined && !item.calculoId ? (
                        <select
                          value={item.productoId}
                          onChange={(e) => handleItemChange(index, 'productoId', e.target.value)}
                          className="flex-1 bg-white border border-[#e0e0e0] rounded-lg px-3 py-1.5 text-sm"
                        >
                          <option value="">-- Seleccionar Producto --</option>
                          {productos?.map(p => (
                            <option key={p.id} value={p.id}>{p.nombre} (Stock: {p.cantidadStock})</option>
                          ))}
                        </select>
                      ) : (
                        <select
                          value={item.calculoId}
                          onChange={(e) => handleItemChange(index, 'calculoId', e.target.value)}
                          className="flex-1 bg-white border border-[#e0e0e0] rounded-lg px-3 py-1.5 text-sm"
                        >
                          <option value="">-- Seleccionar Cotización --</option>
                          {historial?.map(calc => (
                            <option key={calc.id} value={calc.id}>{calc.perfilNombre} - {calc.gramos}g</option>
                          ))}
                        </select>
                      )}
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

                    <div className="w-24 text-right font-mono font-bold text-sm">
                      ${((selectedPrice || 0) * item.cantidad).toFixed(2)}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      disabled={items.length === 1}
                      className="text-red-400 hover:text-red-600 p-1"
                    >
                      <Trash2 size={16} />
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
            <button type="submit" disabled={!isFormValid} className="studio-button-primary disabled:opacity-50">
              {isCreating ? 'Creando...' : 'Confirmar Pedido'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
