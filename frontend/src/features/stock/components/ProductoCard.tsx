import React from 'react';
import { Producto } from '../types/stock.types';
import { STLPreview } from '../../biblioteca/components/STLPreview';
import { Plus, Minus, Package, Tag } from 'lucide-react';
import { useUpdateStock } from '../api/productos.api';

interface ProductoCardProps {
  producto: Producto;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
};

export const ProductoCard: React.FC<ProductoCardProps> = ({ producto }) => {
  const { mutate: updateStock } = useUpdateStock();

  // If product has parts, use the first one for preview
  const firstPartUrl = `/test-cube.stl`; 

  return (
    <div className="group relative bg-white border border-[#e0e0e0] rounded-[2rem] overflow-hidden transition-all duration-300 hover:border-[#1d1d1f] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]">
      
      {/* 3D Preview Area */}
      <div className="aspect-[4/3] w-full bg-[#f5f5f7] relative">
        <STLPreview url={firstPartUrl} />
        
        {/* Stock Badge Overlay */}
        <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-white/30 shadow-sm flex items-center gap-2">
          <Package size={12} className="text-zinc-500" />
          <span className="text-[10px] font-bold text-zinc-800">{producto.cantidadStock} EN STOCK</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 space-y-4">
        <div className="space-y-1">
          <h3 className="studio-body-strong truncate text-lg" title={producto.nombre}>
            {producto.nombre}
          </h3>
          <p className="text-[11px] text-[#7a7a7a] line-clamp-2 leading-relaxed">
            {producto.descripcion || 'Sin descripción disponible.'}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#f0f0f0]">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-[#7a7a7a] uppercase tracking-widest">Precio Sugerido</span>
            <span className="text-xl font-mono font-bold text-zinc-900">
              {producto.precioSugerido ? formatCurrency(producto.precioSugerido) : 'N/A'}
            </span>
          </div>

          {/* Quick Stock Controls */}
          <div className="flex items-center gap-1 bg-[#f5f5f7] rounded-full p-1 border border-zinc-100">
            <button 
              onClick={() => updateStock({ id: producto.id, delta: -1 })}
              disabled={producto.cantidadStock <= 0}
              className="size-8 rounded-full hover:bg-white flex items-center justify-center transition-colors disabled:opacity-30"
            >
              <Minus size={14} />
            </button>
            <button 
              onClick={() => updateStock({ id: producto.id, delta: 1 })}
              className="size-8 rounded-full hover:bg-white flex items-center justify-center transition-colors shadow-sm"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
