import React from 'react';
import { useGetClientes } from '../../clientes/api/clientes.api';
import { useGetProductos } from '../../stock/api/productos.api';
import { useCreatePedido } from '../api/pedidos.api';
import { Modal } from '../../../components/ui/modal';
import { Button } from '../../../components/ui/button';
import { SearchableSelect } from '../../../components/ui/searchable-select';
import { Trash2, AlertCircle, User, Box, Search, CheckCircle2 } from 'lucide-react';

interface CrearPedidoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ItemFormState {
  keyId: string;
  productoId: string;
  cantidad: number;
}

export function CrearPedidoModal({ isOpen, onClose }: CrearPedidoModalProps) {
  const { data: clientesData } = useGetClientes(0, 200);
  const { data: productosData } = useGetProductos(0, 200);
  const clientes = clientesData?.content || [];
  const productos = productosData?.content || [];
  const { mutate: createPedido, isPending: isCreating } = useCreatePedido();

  const [clienteId, setClienteId] = React.useState<string>('');
  const [items, setItems] = React.useState<ItemFormState[]>([]);
  const [error, setError] = React.useState<string>('');
  
  // Search state for products step
  const [productSearch, setProductSearch] = React.useState<string>('');

  const handleAddProduct = (prodId: string) => {
    if (!prodId) return;
    setItems(prev => {
      // Si ya existe, incrementamos cantidad
      const existing = prev.find(item => item.productoId === prodId);
      if (existing) {
        return prev.map(item => 
          item.productoId === prodId ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...prev, { keyId: Math.random().toString(), productoId: prodId, cantidad: 1 }];
    });
    setProductSearch('');
  };

  const handleRemoveItem = (keyId: string) => {
    setItems(prev => prev.filter(item => item.keyId !== keyId));
  };

  const handleUpdateCantidad = (keyId: string, delta: number) => {
    setItems(prev => prev.map(item => {
      if (item.keyId === keyId) {
        const nuevaCantidad = Math.max(1, item.cantidad + delta);
        return { ...item, cantidad: nuevaCantidad };
      }
      return item;
    }));
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');

    if (!clienteId) {
      setError('Por favor, selecciona un cliente.');
      return;
    }

    if (items.length === 0) {
      setError('Por favor, agrega al menos un producto.');
      return;
    }

    createPedido(
      {
        clienteId,
        items: items.map(it => ({
          productoId: it.productoId,
          cantidad: it.cantidad
        }))
      },
      {
        onSuccess: () => {
          onClose();
          // Reset states on success
          setClienteId('');
          setItems([]);
        },
        onError: (err: any) => {
          setError('Error al crear el pedido: ' + (err.response?.data?.message || err.message));
        }
      }
    );
  };

  // Cálculo de totales
  const totals = React.useMemo(() => {
    let totalPrecio = 0;
    let totalCantidad = 0;

    items.forEach(item => {
      const prodObj = productos.find(p => p.id === item.productoId);
      if (prodObj) {
        totalPrecio += (prodObj.precioSugerido || 0) * item.cantidad;
        totalCantidad += item.cantidad;
      }
    });

    return { totalPrecio, totalCantidad };
  }, [items, productos]);

  const selectedCliente = clientes.find(c => c.id === clienteId);

  // Progressive Disclosure Steps Logic
  const isStep2Active = !!clienteId;
  const isStep3Active = isStep2Active && items.length > 0;

  return (
    <Modal
      title=""
      isOpen={isOpen}
      onClose={onClose}
      size="3xl"
    >
      <div className="bg-background text-foreground pt-12 pb-4">
        <h2 className="text-3xl font-bold mb-10 tracking-tight">Nuevo Pedido</h2>

        {error && (
          <div className="mb-8 flex items-center gap-2 text-destructive bg-destructive/10 p-4 rounded-xl border border-destructive/20 text-sm">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-12">
          {/* Paso 1: Seleccionar Cliente */}
          <div className="relative pl-10">
            <div className="absolute left-0 top-1 w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shadow-sm">1</div>
            <div className="absolute left-3.5 top-10 bottom-[-48px] w-0.5 bg-primary/10"></div>
            
            <h3 className="font-semibold text-xl mb-4 text-foreground">Seleccionar Cliente</h3>
            
            {!selectedCliente ? (
              <div className="relative">
                <SearchableSelect
                  placeholder="Buscar cliente por nombre o DNI..."
                  emptyLabel="No se encontraron clientes"
                  value={clienteId}
                  onValueChange={setClienteId}
                  items={clientes.map(c => ({ value: c.id, label: `${c.nombre} (DNI: ${c.dni || 'S/N'})` }))}
                  className="!h-14 !text-base !rounded-xl !pl-4 !pr-4 !bg-muted/10 !border-border/50"
                />
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 rounded-xl border-2 border-primary/40 bg-primary/5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <User size={24} />
                  </div>
                  <div>
                    <p className="font-semibold text-lg text-foreground">{selectedCliente.nombre}</p>
                    <p className="text-sm text-muted-foreground">DNI: {selectedCliente.dni || '-'}</p>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => setClienteId('')}
                  className="text-sm text-primary hover:text-primary/80 font-semibold px-4 py-2 hover:bg-primary/10 rounded-lg transition-colors"
                >
                  Cambiar
                </button>
              </div>
            )}
          </div>

          {/* Paso 2: Añadir Productos */}
          <div className={`relative pl-10 transition-all duration-500 ${isStep2Active ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
            <div className={`absolute left-0 top-1 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shadow-sm transition-colors ${isStep2Active ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>2</div>
            <div className="absolute left-3.5 top-10 bottom-[-48px] w-0.5 bg-border/50"></div>
            
            <h3 className="font-semibold text-xl mb-4 text-foreground">Añadir Productos</h3>
            
            <div className="space-y-4">
              <div className="relative">
                <SearchableSelect
                  placeholder="Buscar producto por nombre..."
                  emptyLabel="No se encontraron productos"
                  value={productSearch}
                  onValueChange={handleAddProduct}
                  items={productos.map(p => ({ 
                    value: p.id, 
                    label: `${p.nombre} - $${p.precioSugerido} (Stock: ${p.cantidadStock})` 
                  }))}
                  className="!h-14 !text-base !rounded-xl !pl-4 !pr-4 !bg-muted/10 !border-border/50"
                />
              </div>
              
              {items.length > 0 ? (
                <div className="border border-border/50 rounded-xl divide-y divide-border/50 overflow-hidden bg-muted/5 shadow-sm">
                  {items.map(item => {
                    const p = productos.find(prod => prod.id === item.productoId);
                    if (!p) return null;
                    return (
                      <div key={item.keyId} className="flex items-center justify-between p-5 hover:bg-muted/10 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-background border border-border/50 flex items-center justify-center shadow-sm">
                            <Box size={20} className="text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-semibold text-base text-foreground">{p.nombre}</p>
                            <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                              <span className="font-medium text-foreground">${p.precioSugerido}</span>
                              <span className="w-1.5 h-1.5 rounded-full bg-border"></span>
                              <span className={p.cantidadStock && p.cantidadStock < item.cantidad ? 'text-destructive font-semibold' : 'text-emerald-600 dark:text-emerald-400'}>
                                Stock: {p.cantidadStock}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="flex items-center bg-background border border-border/50 rounded-lg overflow-hidden shadow-sm h-10">
                            <button type="button" onClick={() => handleUpdateCantidad(item.keyId, -1)} className="px-3 h-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">-</button>
                            <span className="px-2 h-full flex items-center justify-center font-semibold text-sm w-10 border-x border-border/50">{item.cantidad}</span>
                            <button type="button" onClick={() => handleUpdateCantidad(item.keyId, 1)} className="px-3 h-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">+</button>
                          </div>
                          <button type="button" onClick={() => handleRemoveItem(item.keyId)} className="text-muted-foreground hover:text-destructive transition-colors p-2 hover:bg-destructive/10 rounded-lg">
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 rounded-xl border-2 border-border border-dashed text-center text-base font-medium text-muted-foreground">
                  Buscá y seleccioná productos para agregarlos a la orden
                </div>
              )}
            </div>
          </div>

          {/* Paso 3: Confirmación */}
          <div className={`relative pl-10 transition-all duration-500 ${isStep3Active ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
            <div className={`absolute left-0 top-1 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold border ${isStep3Active ? 'bg-primary text-primary-foreground border-transparent' : 'bg-muted text-muted-foreground border-border'}`}>
              {isStep3Active ? <CheckCircle2 size={16} /> : '3'}
            </div>
            
            <h3 className="font-semibold text-xl mb-4 text-foreground">Confirmación</h3>
            
            <div className="bg-muted/10 rounded-xl p-8 border border-border/50 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <p className="text-muted-foreground text-base font-medium">Total del pedido</p>
                  <p className="text-4xl font-black text-foreground mt-1">${totals.totalPrecio.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-muted-foreground text-base font-medium">Ítems</p>
                  <p className="font-bold text-foreground text-xl">{totals.totalCantidad}</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button type="button" variant="outline" className="flex-1 py-7 text-base rounded-xl" onClick={onClose}>
                  Cancelar
                </Button>
                <Button 
                  type="button" 
                  className="flex-[2] py-7 font-bold text-lg rounded-xl shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  onClick={() => handleSubmit()}
                  disabled={!isStep3Active || isCreating}
                  isLoading={isCreating}
                >
                  Emitir Orden de Trabajo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
