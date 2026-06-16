import React from 'react';
import { useGetPiezas, useEliminarPieza } from '../api/biblioteca.api';
import { STLCard } from './STLCard';
import { StudioSubNav } from '../../../components/layout/studio-sub-nav';
import { Search, PackageOpen, Loader2 } from 'lucide-react';
import { ConfirmModal } from '../../../components/ui/confirm-modal';
import { PiezaSTL } from '../types/biblioteca.types';

export function PiezasGalleryView() {
  const { data: piezas, isLoading } = useGetPiezas();
  const { mutate: eliminarPieza } = useEliminarPieza();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [deletePieceId, setDeletePieceId] = React.useState<string | null>(null);

  const filteredPiezas = React.useMemo(() => {
    if (!piezas) return [];
    return piezas.filter(p => 
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.perfilFilamentoNombre?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [piezas, searchTerm]);

  const handleCalculate = (pieza: PiezaSTL) => {
    // Logic to navigate to calculator with this piece
    console.log("Calcular costo para:", pieza.nombre);
    alert(`Próximamente: Cargando ${pieza.nombre} en el cotizador...`);
  };

  return (
    <div className="flex flex-col w-full bg-background min-h-full">
      <StudioSubNav />

      <main className="flex-1 px-8 md:px-12 py-10 overflow-y-auto custom-scrollbar">
        <div className="max-w-[1400px] mx-auto space-y-10">
          
          {/* Header & Search */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <h2 className="studio-display-md !text-4xl tracking-tight">Biblioteca de Piezas</h2>
              <p className="studio-body text-muted-foreground">Gestioná tus modelos 3D y recalcula costos rápidamente.</p>
            </div>

            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7a7a7a]" size={16} />
              <input 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar modelo o material..."
                className="w-full bg-white border border-[#e0e0e0] rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-black outline-none transition-all"
              />
            </div>
          </div>

          {/* Gallery Grid */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-40 gap-4 text-muted-foreground">
              <Loader2 className="animate-spin" size={32} />
              <p className="studio-caption">Cargando biblioteca...</p>
            </div>
          ) : filteredPiezas.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 animate-in fade-in duration-700">
              {filteredPiezas.map((pieza) => (
                <STLCard 
                  key={pieza.id} 
                  pieza={pieza} 
                  onDelete={(id) => setDeletePieceId(id)}
                  onCalculate={handleCalculate}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-40 text-center space-y-4 bg-muted/10 rounded-[3rem] border border-dashed border-border/60">
              <div className="size-20 rounded-full bg-background flex items-center justify-center border border-border">
                <PackageOpen size={32} className="text-muted-foreground/40" />
              </div>
              <div className="space-y-1">
                <p className="studio-body-strong text-foreground">No se encontraron piezas</p>
                <p className="studio-caption text-muted-foreground">Usa el cotizador para subir y guardar tu primer modelo STL.</p>
              </div>
            </div>
          )}

        </div>
      </main>

      <ConfirmModal
        isOpen={deletePieceId !== null}
        onClose={() => setDeletePieceId(null)}
        onConfirm={() => {
          if (deletePieceId) {
            eliminarPieza(deletePieceId);
            setDeletePieceId(null);
          }
        }}
        title="Eliminar Pieza"
        description="¿Estás seguro de que quieres eliminar esta pieza de la biblioteca? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        isDestructive={true}
      />
    </div>
  );
}
