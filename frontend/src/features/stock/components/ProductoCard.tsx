import React, { useState } from 'react';
import { Producto } from '../types/stock.types';
import { STLPreview } from '../../biblioteca/components/STLPreview';
import { Plus, Minus, Package, MoreVertical, Trash2, Coins, ListFilter } from 'lucide-react';
import { useUpdateStock } from '../api/productos.api';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LotesProductoModal } from './LotesProductoModal';

interface ProductoCardProps {
  producto: Producto;
  onDelete: (id: string) => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value);
};

export const ProductoCard: React.FC<ProductoCardProps> = ({ producto, onDelete }) => {
  const { mutate: updateStock } = useUpdateStock();
  const [isLotesModalOpen, setIsLotesModalOpen] = useState(false);
  
  // PRODUCTION COST: Aggregate of parts' costoBase (calculated centraly in the backend)
  const currentProductionCost = React.useMemo(() => {
    return producto.partes.reduce((sum, p) => sum + (p.costoBase || 0), 0);
  }, [producto.partes]);

  // If product has parts, use the first one for preview
  const firstPartUrl = `/test-cube.stl`; 

  return (
    <>
      <div className="group relative bg-white border border-[#e0e0e0] dark:border-zinc-800 rounded-[2rem] overflow-hidden transition-all duration-300 hover:border-zinc-950 dark:hover:border-zinc-50 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)]">
        
        {/* 3D Preview Area */}
        <div className="aspect-[4/3] w-full bg-[#f5f5f7] dark:bg-zinc-900 relative">
          <STLPreview url={firstPartUrl} />
          
          {/* Stock Badge Overlay */}
          <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-white/30 dark:border-zinc-800/30 shadow-sm flex items-center gap-2">
            <Package size={12} className="text-zinc-500" aria-hidden="true" />
            <span className="text-[10px] font-bold text-zinc-800 dark:text-zinc-200">{producto.cantidadStock} EN STOCK</span>
          </div>

          {/* Cost Info Overlay (Centralized Backend logic) */}
          <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-zinc-900/60 dark:bg-black/60 backdrop-blur-md border border-white/10 dark:border-zinc-800/10 shadow-sm flex items-center gap-2 text-white">
            <Coins size={10} className="text-zinc-300" aria-hidden="true" />
            <span className="text-[9px] font-bold tracking-tight uppercase" title="Costo calculado centralmente por la API">
              Costo Fab: {formatCurrency(currentProductionCost)}
            </span>
          </div>

          {/* Lots Breakdown Indicator (Clickable) */}
          {producto.lotes && producto.lotes.length > 0 && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsLotesModalOpen(true);
              }}
              className="absolute bottom-4 right-4 flex items-center gap-1.5 h-8 px-2.5 rounded-full bg-white/20 dark:bg-zinc-800/20 backdrop-blur-md border border-white/20 dark:border-zinc-700/20 text-white text-[10px] font-bold hover:bg-white hover:text-black dark:hover:bg-zinc-900 dark:hover:text-white transition-all group/btn shadow-lg"
              title="Ver desglose de inventario (FIFO)"
              aria-label={`Ver ${producto.lotes.length} lotes de ${producto.nombre}`}
            >
              <ListFilter size={12} className="group-hover/btn:rotate-180 transition-transform duration-500" aria-hidden="true" />
              <span>{producto.lotes.length} {producto.lotes.length === 1 ? 'Lote' : 'Lotes'}</span>
            </button>
          )}

          {/* Options Menu */}
          <div className="absolute top-4 right-4">
            <DropdownMenu>
              <DropdownMenuTrigger 
                className="p-2 rounded-full bg-white/85 dark:bg-zinc-900/85 backdrop-blur-md border border-white/30 dark:border-zinc-800/30 shadow-sm hover:bg-white dark:hover:bg-zinc-950 transition-colors"
                aria-label={`Opciones de producto para ${producto.nombre}`}
              >
                <MoreVertical size={14} className="text-zinc-650" aria-hidden="true" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  onClick={() => onDelete(producto.id)}
                  className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20"
                >
                  <Trash2 size={14} className="mr-2" aria-hidden="true" />
                  Eliminar Producto
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 space-y-4 bg-white dark:bg-zinc-950">
          <div className="space-y-1">
            <h3 className="studio-body-strong truncate text-lg text-zinc-900 dark:text-zinc-50" title={producto.nombre}>
              {producto.nombre}
            </h3>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
              {producto.descripcion || 'Sin descripción disponible.'}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-850">
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-widest">Precio Sugerido</span>
              <span className="text-xl font-mono font-bold text-zinc-900 dark:text-zinc-50">
                {producto.precioSugerido ? formatCurrency(producto.precioSugerido) : 'N/A'}
              </span>
            </div>

            {/* Quick Stock Controls */}
            <div className="flex items-center gap-1 bg-[#f5f5f7] dark:bg-zinc-900 rounded-full p-1 border border-zinc-100 dark:border-zinc-800">
              <button 
                onClick={() => updateStock({ id: producto.id, delta: -1 })}
                disabled={producto.cantidadStock <= 0}
                className="size-8 rounded-full hover:bg-white dark:hover:bg-zinc-805 flex items-center justify-center transition-colors disabled:opacity-30"
                aria-label={`Disminuir stock de ${producto.nombre}`}
                title={`Disminuir stock de ${producto.nombre}`}
              >
                <Minus size={14} aria-hidden="true" />
              </button>
              <button 
                onClick={() => updateStock({ id: producto.id, delta: 1 })}
                className="size-8 rounded-full hover:bg-white dark:hover:bg-zinc-805 flex items-center justify-center transition-colors shadow-sm"
                aria-label={`Aumentar stock de ${producto.nombre}`}
                title={`Aumentar stock de ${producto.nombre}`}
              >
                <Plus size={14} aria-hidden="true" />
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
};
