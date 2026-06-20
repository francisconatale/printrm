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

  const currentProductionCost = React.useMemo(() => {
    return producto.partes.reduce((sum, p) => sum + (p.costoBase || 0), 0);
  }, [producto.partes]);

  const costoMaterial = React.useMemo(() => {
    return producto.partes.reduce((sum, p) => sum + (p.costoMaterial || 0), 0);
  }, [producto.partes]);

  const costoEnergia = React.useMemo(() => {
    return producto.partes.reduce((sum, p) => sum + (p.costoEnergia || 0), 0);
  }, [producto.partes]);

  return (
    <>
      <tr className="hover:bg-muted/15 transition-colors group border-b border-border/30">
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="size-16 rounded-2xl bg-muted/50 border border-border/40 flex items-center justify-center text-muted-foreground shrink-0 overflow-hidden">
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
            <div>
              <span className="text-sm font-semibold text-foreground">{producto.nombre}</span>
              {producto.descripcion && (
                <p className="text-[11px] text-muted-foreground truncate max-w-[260px]">{producto.descripcion}</p>
              )}
            </div>
          </div>
        </td>
        <td className="px-4 py-4 text-center">
          <span className={`text-xs font-bold font-mono ${producto.cantidadStock > 0 ? 'text-foreground' : 'text-destructive'}`}>
            {producto.cantidadStock} {producto.cantidadStock === 1 ? 'unidad' : 'unidades'}
          </span>
        </td>
        <td className="px-4 py-4">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Layers size={12} aria-hidden="true" />
            <span className="text-xs font-mono font-medium">{producto.partes.length} {producto.partes.length === 1 ? 'parte' : 'partes'}</span>
          </div>
        </td>
        <td className="px-4 py-4">
          <div className="relative group/tooltip inline-block">
            <span className="text-sm font-bold text-foreground cursor-help border-b border-dashed border-muted-foreground/40 hover:border-foreground/80 transition-colors">
              {formatCurrency(currentProductionCost)}
            </span>
            <div className="absolute z-50 invisible group-hover/tooltip:visible bg-card text-foreground text-xs rounded-2xl p-4 border border-border shadow-xl min-w-[230px] left-1/2 -translate-x-1/2 top-full mt-2.5 transition-all opacity-0 group-hover/tooltip:opacity-100 duration-200 pointer-events-none">
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
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-card" />
            </div>
          </div>
        </td>
        <td className="px-4 py-4">
          <div className="flex items-center gap-1 bg-muted/40 border border-border/50 rounded-full p-0.5 w-fit">
            <button
              onClick={() => updateStock({ id: producto.id, delta: -1 })}
              disabled={producto.cantidadStock <= 0}
              className="size-7 rounded-full hover:bg-card flex items-center justify-center transition-colors disabled:opacity-20 active:scale-90"
              aria-label={`Disminuir stock de ${producto.nombre}`}
              title={`Disminuir stock de ${producto.nombre}`}
            >
              <Minus size={12} aria-hidden="true" />
            </button>
            <button
              onClick={() => updateStock({ id: producto.id, delta: 1 })}
              className="size-7 rounded-full hover:bg-card flex items-center justify-center transition-colors active:scale-90"
              aria-label={`Aumentar stock de ${producto.nombre}`}
              title={`Aumentar stock de ${producto.nombre}`}
            >
              <Plus size={12} aria-hidden="true" />
            </button>
          </div>
        </td>
        <td className="px-6 py-4 text-right">
          <div className="flex items-center justify-end gap-1.5">
            {producto.lotes && producto.lotes.length > 0 && (
              <button
                onClick={() => setIsLotesModalOpen(true)}
                className="size-8 rounded-xl hover:bg-muted flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground"
                title="Ver lotes de stock"
                aria-label={`Ver lotes de ${producto.nombre}`}
              >
                <ListFilter size={14} aria-hidden="true" />
              </button>
            )}
            <button
              onClick={() => onDelete(producto.id)}
              className="size-8 rounded-xl hover:bg-destructive/10 flex items-center justify-center transition-colors text-muted-foreground hover:text-destructive"
              title="Eliminar producto"
              aria-label={`Eliminar producto ${producto.nombre}`}
            >
              <Trash2 size={14} aria-hidden="true" />
            </button>
          </div>
        </td>
      </tr>
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
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7a7a7a]" size={16} aria-hidden="true" />
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
            <div className="border border-border/40 rounded-2xl bg-card animate-in fade-in duration-500 shadow-sm">
              <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-muted/20">
                  <tr className="border-b border-border/40">
                    <th className="px-6 py-4 font-bold text-muted-foreground text-[10px] uppercase tracking-wider rounded-tl-2xl">Producto</th>
                    <th className="px-4 py-4 font-bold text-muted-foreground text-[10px] uppercase tracking-wider text-center">Stock</th>
                    <th className="px-4 py-4 font-bold text-muted-foreground text-[10px] uppercase tracking-wider">Partes</th>
                    <th className="px-4 py-4 font-bold text-muted-foreground text-[10px] uppercase tracking-wider">Costo Prod.</th>
                    <th className="px-4 py-4 font-bold text-muted-foreground text-[10px] uppercase tracking-wider">Ajustar Stock</th>
                    <th className="px-6 py-4 font-bold text-muted-foreground text-[10px] uppercase tracking-wider text-right rounded-tr-2xl">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {filteredProductos.map((prod) => (
                    <ProductoRow
                      key={prod.id}
                      producto={prod}
                      onDelete={(id) => setDeleteProductId(id)}
                    />
                  ))}
                </tbody>
              </table>
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
        isDestructive={true}
      />
    </div>
  );
}
