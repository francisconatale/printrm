import React from 'react';
import { useGetProductos, useDeleteProducto, useUpdateStock } from '../api/productos.api';
import { ComposicionProductoModal } from './ComposicionProductoModal';
import { LotesProductoModal } from './LotesProductoModal';
import { StudioSubNav } from '../../../components/layout/studio-sub-nav';
import { Plus, Search, Loader2, PackageSearch, Trash2, Minus, Package, Layers, Coins, ListFilter } from 'lucide-react';
import { ConfirmModal } from '../../../components/ui/confirm-modal';
import { Producto } from '../types/stock.types';
import { QueryErrorView } from '../../../components/ui/query-error-view';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value);
};

function ProductoRow({ producto, onDelete }: { producto: Producto; onDelete: (id: string) => void }) {
  const { mutate: updateStock } = useUpdateStock();
  const [isLotesModalOpen, setIsLotesModalOpen] = React.useState(false);

  const hasPartes = producto.partes && producto.partes.length > 0;

  const currentProductionCost = React.useMemo(() => {
    if (hasPartes) {
      return producto.partes.reduce((sum, p) => sum + (p.costoBase || 0), 0);
    }
    return producto.lotes?.[0]?.costoUnitario || 0;
  }, [producto.partes, producto.lotes, hasPartes]);

  const costoMaterial = React.useMemo(() => {
    return hasPartes ? producto.partes.reduce((sum, p) => sum + (p.costoMaterial || 0), 0) : 0;
  }, [producto.partes, hasPartes]);

  const costoEnergia = React.useMemo(() => {
    return hasPartes ? producto.partes.reduce((sum, p) => sum + (p.costoEnergia || 0), 0) : 0;
  }, [producto.partes, hasPartes]);

  return (
    <>
      <div className="bg-card p-4 rounded-2xl border border-border flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all group relative">
        <div className="flex items-center gap-4">
            <div className="size-14 md:size-16 rounded-xl bg-muted/50 border border-border/40 flex items-center justify-center text-muted-foreground shrink-0 overflow-hidden">
              {producto.partes?.[0]?.imagenBase64 ? (
                <img 
                  src={producto.partes[0].imagenBase64} 
                  alt={producto.nombre} 
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              ) : (
                <Package size={24} aria-hidden="true" />
              )}
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-foreground text-base leading-none">{producto.nombre}</h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Layers size={10} /> {producto.partes.length} partes</span>
                <span>•</span>
                <div className="relative group/tooltip inline-block cursor-help">
                  <span className="border-b border-dashed border-muted-foreground/40 hover:border-foreground/80 transition-colors">
                    Costo prod: {formatCurrency(currentProductionCost)}
                  </span>
                  <div className="absolute z-50 invisible group-hover/tooltip:visible bg-card text-foreground text-xs rounded-2xl p-4 border border-border shadow-xl min-w-[230px] left-0 md:left-1/2 md:-translate-x-1/2 top-full mt-2 transition-all opacity-0 group-hover/tooltip:opacity-100 duration-200 pointer-events-none">
                    {hasPartes ? (
                      <div className="space-y-2 font-sans">
                        <p className="font-bold text-foreground border-b border-border/40 pb-1.5 mb-1.5 text-center">Esto es el costo de fabricar hoy</p>
                        <div className="flex justify-between gap-4 text-muted-foreground">
                          <span>Costo Material:</span>
                          <span className="font-bold text-foreground">{formatCurrency(costoMaterial)}</span>
                        </div>
                        <div className="flex justify-between gap-4 text-muted-foreground">
                          <span>Costo Energía:</span>
                          <span className="font-bold text-foreground">{formatCurrency(costoEnergia)}</span>
                        </div>
                        <div className="flex justify-between gap-4 pt-1.5 border-t border-border/40 text-foreground font-bold">
                          <span>Total Costo Prod.:</span>
                          <span className="font-bold text-foreground">{formatCurrency(currentProductionCost)}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 font-sans text-center">
                        <p className="font-bold text-foreground border-b border-border/40 pb-1.5 mb-1.5">Costo de Stock (Lote actual)</p>
                        <div className="flex justify-between gap-4 pt-1 text-foreground font-bold">
                          <span>Costo Unitario:</span>
                          <span className="font-bold text-foreground">{formatCurrency(currentProductionCost)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-6 md:gap-8 mt-2 md:mt-0 pt-4 md:pt-0 border-t border-border md:border-t-0">
            <div className="text-left md:text-right">
              <div className="text-sm font-bold text-foreground">
                 Venta: {producto.precioSugerido ? formatCurrency(producto.precioSugerido) : '—'}
              </div>
              <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-1.5 inline-flex items-center ${producto.cantidadStock > 0 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-destructive/10 text-destructive'}`}>
                {producto.cantidadStock} en stock
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center bg-muted/40 border border-border/50 rounded-lg p-1">
                <button
                  onClick={() => updateStock({ id: producto.id, delta: -1 })}
                  disabled={producto.cantidadStock <= 0}
                  className="p-1.5 hover:bg-card rounded-md text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
                >
                  <Minus size={14} />
                </button>
                <div className="w-8 flex items-center justify-center font-mono font-bold text-sm">
                  {producto.cantidadStock}
                </div>
                <button
                  onClick={() => updateStock({ id: producto.id, delta: 1 })}
                  className="p-1.5 hover:bg-card rounded-md text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                {producto.lotes && producto.lotes.length > 0 && (
                  <button
                    onClick={() => setIsLotesModalOpen(true)}
                    className="size-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground"
                    title="Ver lotes de stock"
                  >
                    <ListFilter size={14} />
                  </button>
                )}
                <button
                  onClick={() => onDelete(producto.id)}
                  className="size-8 rounded-lg hover:bg-destructive/10 flex items-center justify-center transition-colors text-muted-foreground hover:text-destructive"
                  title="Eliminar producto"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
        </div>
      </div>
      <LotesProductoModal
        isOpen={isLotesModalOpen}
        onClose={() => setIsLotesModalOpen(false)}
        producto={producto}
      />
    </>
  );
}

export function ProductosGalleryView() {
  const { data: productos, isLoading, isError, error, refetch } = useGetProductos();
  const { mutate: deleteProducto } = useDeleteProducto();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [deleteProductId, setDeleteProductId] = React.useState<string | null>(null);

  const filteredProductos = React.useMemo(() => {
    if (!productos) return [];
    return productos.filter(p => 
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [productos, searchTerm]);

  const isSearching = searchTerm.trim().length > 0;

  return (
    <div className="flex flex-col w-full bg-background min-h-full">
      <StudioSubNav />

      <main className="flex-1 px-8 md:px-12 py-10 overflow-y-auto custom-scrollbar">
        <div className="max-w-[1400px] mx-auto space-y-10">
          
          {/* Header & Actions */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <h1 className="studio-display-md !text-4xl tracking-tight">Catálogo Stock</h1>
              <p className="studio-body text-muted-foreground">Gestioná tus productos terminados y niveles de inventario.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} aria-hidden="true" />
                <label htmlFor="search-productos" className="sr-only">Buscar producto</label>
                <input 
                  id="search-productos"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar producto..."
                  className="w-full bg-muted/30 dark:bg-muted/15 border border-border/60 rounded-full pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="studio-button-primary flex items-center gap-2"
              >
                <Plus size={16} aria-hidden="true" />
                <span>Nuevo Producto</span>
              </button>
            </div>
          </div>

          {/* Product List Table */}
          {isError ? (
            <QueryErrorView error={error} refetch={refetch} />
          ) : isLoading ? (
            <div className="flex flex-col items-center justify-center py-40 gap-4 text-muted-foreground">
              <Loader2 className="animate-spin text-muted-foreground" size={32} aria-hidden="true" />
              <p className="studio-caption">Cargando catálogo...</p>
            </div>
          ) : filteredProductos.length > 0 ? (
            <div className="flex flex-col gap-3 animate-in fade-in duration-500">
              {filteredProductos.map((prod) => (
                <ProductoRow
                  key={prod.id}
                  producto={prod}
                  onDelete={(id) => setDeleteProductId(id)}
                />
              ))}
            </div>
          ) : isSearching ? (
            <div className="flex flex-col items-center justify-center py-40 text-center space-y-4 bg-muted/10 rounded-[3rem] border border-dashed border-border/60">
              <div className="size-20 rounded-full bg-background flex items-center justify-center border border-border">
                <Search size={32} className="text-muted-foreground/40" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <p className="studio-body-strong text-foreground">Búsqueda sin resultados</p>
                <p className="studio-caption text-muted-foreground">No encontramos productos que coincidan con "{searchTerm}". Intentá con otros términos.</p>
                <button 
                  onClick={() => setSearchTerm('')}
                  className="text-xs text-primary font-semibold hover:underline mt-2"
                >
                  Limpiar filtros
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-40 text-center space-y-4 bg-muted/10 rounded-[3rem] border border-dashed border-border/60">
              <div className="size-20 rounded-full bg-background flex items-center justify-center border border-border">
                <PackageSearch size={32} className="text-muted-foreground/40" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <p className="studio-body-strong text-foreground">Tu catálogo está vacío</p>
                <p className="studio-caption text-muted-foreground">Convertí tus modelos STL en productos para la venta directa.</p>
              </div>
            </div>
          )}

        </div>
      </main>

      <ComposicionProductoModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <ConfirmModal
        isOpen={deleteProductId !== null}
        onClose={() => setDeleteProductId(null)}
        onConfirm={() => {
          if (deleteProductId) {
            deleteProducto(deleteProductId);
            setDeleteProductId(null);
          }
        }}
        title="Eliminar Producto"
        description="¿Estás seguro de que quieres eliminar este producto del catálogo? Las piezas STL asociadas no se borrarán."
        confirmText="Eliminar"
        cancelText="Cancelar"
        cancelVariant="primary"
        isDestructive={false}
      />
    </div>
  );
}
