import React from 'react';
import { useGetProductos, useDeleteProducto, useUpdateStock, useSaveProducto } from '../api/productos.api';
import { ComposicionProductoModal } from './ComposicionProductoModal';
import { LotesProductoModal } from './LotesProductoModal';
import { StudioSubNav } from '../../../components/layout/studio-sub-nav';
import { Plus, Search, Loader2, PackageSearch, Trash2, Minus, Package, Layers, Coins, ListFilter, Edit3 } from 'lucide-react';
import { ConfirmModal } from '../../../components/ui/confirm-modal';
import { Producto } from '../types/stock.types';
import { QueryErrorView } from '../../../components/ui/query-error-view';
import { EditarProductoModal } from './EditarProductoModal';
import { AgregarStockModal } from './AgregarStockModal';
import { PaginationBar } from '../../../components/ui/pagination-bar';

import { ProductoCard } from './ProductoCard';

export function ProductosGalleryView() {
  const [page, setPage] = React.useState(0);
  const { data, isLoading, isError, error, refetch } = useGetProductos(page, 10);
  const productos = data?.content;
  const totalPages = data?.totalPages ?? 0;
  const totalElements = data?.totalElements ?? 0;
  const { mutate: deleteProducto } = useDeleteProducto();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [deleteProductId, setDeleteProductId] = React.useState<string | null>(null);
  const [editProducto, setEditProducto] = React.useState<Producto | null>(null);
  const [addStockProducto, setAddStockProducto] = React.useState<Producto | null>(null);

  const filteredProductos = React.useMemo(() => {
    if (!productos) return [];
    return productos.filter(p => 
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [productos, searchTerm]);

  const isSearching = searchTerm.trim().length > 0;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setSearchTerm('');
  };

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
            <>
              <div className="flex flex-col gap-3 animate-in fade-in duration-500">
                {filteredProductos.map((prod) => (
                  <ProductoCard
                    key={prod.id}
                    producto={prod}
                    onDelete={(id) => setDeleteProductId(id)}
                    onEdit={(p) => setEditProducto(p)}
                    onAddStock={(p) => setAddStockProducto(p)}
                  />
                ))}
              </div>
              <PaginationBar
                page={page}
                totalPages={totalPages}
                totalElements={totalElements}
                size={10}
                onPageChange={handlePageChange}
              />
            </>
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

      {editProducto && (
        <EditarProductoModal 
          isOpen={true}
          onClose={() => setEditProducto(null)}
          producto={editProducto}
        />
      )}

      {addStockProducto && (
        <AgregarStockModal
          isOpen={true}
          onClose={() => setAddStockProducto(null)}
          producto={addStockProducto}
        />
      )}

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
