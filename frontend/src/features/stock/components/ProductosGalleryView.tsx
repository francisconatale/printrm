import React from 'react';
import { useGetProductos } from '../api/productos.api';
import { ProductoCard } from './ProductoCard';
import { ComposicionProductoModal } from './ComposicionProductoModal';
import { StudioSubNav } from '../../../components/layout/studio-sub-nav';
import { Plus, Search, Loader2, PackageSearch } from 'lucide-react';

export function ProductosGalleryView() {
  const { data: productos, isLoading } = useGetProductos();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const filteredProductos = React.useMemo(() => {
    if (!productos) return [];
    return productos.filter(p => 
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [productos, searchTerm]);

  return (
    <div className="flex flex-col w-full bg-background min-h-full">
      <StudioSubNav />

      <main className="flex-1 px-8 md:px-12 py-10 overflow-y-auto custom-scrollbar">
        <div className="max-w-[1400px] mx-auto space-y-10">
          
          {/* Header & Actions */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <h2 className="studio-display-md !text-4xl tracking-tight">Catálogo Stock</h2>
              <p className="studio-body text-muted-foreground">Gestioná tus productos terminados y niveles de inventario.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7a7a7a]" size={16} />
                <input 
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar producto..."
                  className="w-full bg-white border border-[#e0e0e0] rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-black outline-none transition-all"
                />
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="studio-button-primary"
              >
                <Plus size={16} /> Nuevo Producto
              </button>
            </div>
          </div>

          {/* Gallery Grid */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-40 gap-4 text-muted-foreground">
              <Loader2 className="animate-spin" size={32} />
              <p className="studio-caption">Cargando catálogo...</p>
            </div>
          ) : filteredProductos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-in fade-in duration-700">
              {filteredProductos.map((prod) => (
                <ProductoCard key={prod.id} producto={prod} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-40 text-center space-y-4 bg-muted/10 rounded-[3rem] border border-dashed border-border/60">
              <div className="size-20 rounded-full bg-background flex items-center justify-center border border-border">
                <PackageSearch size={32} className="text-muted-foreground/40" />
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
    </div>
  );
}
