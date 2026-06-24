import React, { useState } from 'react';
import { Producto } from '../types/stock.types';
import { Plus, Minus, MoreVertical, Trash2, ListFilter, PackageOpen, Edit3, ShoppingCart } from 'lucide-react';
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
  onEdit?: (producto: Producto) => void;
  onAddStock?: (producto: Producto) => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value);
};

export const ProductoCard: React.FC<ProductoCardProps> = ({ producto, onDelete, onEdit, onAddStock }) => {
  const { mutate: updateStock } = useUpdateStock();
  const [isLotesModalOpen, setIsLotesModalOpen] = useState(false);
  
  // PRODUCTION COST: Aggregate of parts' costoBase (calculated centraly in the backend)
  const currentProductionCost = React.useMemo(() => {
    if (producto.partes && producto.partes.length > 0) {
      return producto.partes.reduce((sum, p) => sum + (p.costoBase || 0), 0);
    }
    return producto.lotes?.[0]?.costoUnitario || 0;
  }, [producto.partes, producto.lotes]);

  return (
    <>
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 flex items-center gap-4 transition-colors duration-200 hover:bg-slate-50 dark:hover:bg-slate-800/50">
        
        {/* Icon / Image Placeholder */}
        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-md flex items-center justify-center shrink-0 overflow-hidden">
          {producto.partes?.[0]?.imagenBase64 ? (
            <img 
              src={producto.partes[0].imagenBase64} 
              alt={producto.nombre} 
              className="w-full h-full object-cover"
            />
          ) : (
            <PackageOpen className="text-slate-400 dark:text-slate-500 w-5 h-5" />
          )}
        </div>

        {/* Main Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-slate-900 dark:text-slate-100 text-[15px] leading-snug truncate" title={producto.nombre}>
            {producto.nombre}
          </h3>
          <p className="text-[13px] text-slate-500 dark:text-slate-400 truncate mt-0.5" title={(producto as any).descripcion || 'Sin descripción disponible.'}>
            {(producto as any).descripcion || 'Sin descripción disponible.'}
          </p>
        </div>

        {/* Metrics */}
        <div className="flex items-center gap-6 px-4">
          <div className="flex flex-col items-end">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">Stock</span>
            <span className={`text-[13px] font-semibold ${producto.cantidadStock > 0 ? 'text-slate-700 dark:text-slate-300' : 'text-red-600 dark:text-red-400'}`}>
              {producto.cantidadStock}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">Costo</span>
            <span className="text-[13px] font-medium text-slate-500 dark:text-slate-400">
              {formatCurrency(currentProductionCost)}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">Venta</span>
            <span className="text-[14px] font-semibold text-slate-900 dark:text-slate-100">
              {formatCurrency(producto.precioSugerido || 0)}
            </span>
          </div>
        </div>

        {/* Lotes Button */}
        {producto.lotes && producto.lotes.length > 0 && (
          <div className="flex items-center px-2">
            <button 
              onClick={() => setIsLotesModalOpen(true)}
              className="flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
              title="Ver desglose de inventario (FIFO)"
            >
              <ListFilter size={14} />
              <span>{producto.lotes.length} {producto.lotes.length === 1 ? 'Lote' : 'Lotes'}</span>
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1 pl-4 border-l border-slate-200 dark:border-slate-800">
          <button 
            onClick={() => updateStock({ id: producto.id, delta: -1 })}
            disabled={producto.cantidadStock <= 0}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            title="Disminuir stock"
          >
            <Minus size={16} />
          </button>
          <button 
            onClick={() => onAddStock ? onAddStock(producto) : updateStock({ id: producto.id, delta: 1 })}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors duration-200 cursor-pointer"
            title="Aumentar stock"
          >
            <Plus size={16} />
          </button>
          <div className="w-px h-4 bg-slate-200 dark:bg-slate-800 mx-1" />
          
          <DropdownMenu>
            <DropdownMenuTrigger className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors duration-200 cursor-pointer focus:outline-none">
              <MoreVertical size={16} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onEdit && (
                <DropdownMenuItem 
                  onClick={() => onEdit(producto)}
                  className="cursor-pointer"
                >
                  <Edit3 size={14} className="mr-2" />
                  Editar Producto
                </DropdownMenuItem>
              )}
              <DropdownMenuItem 
                onClick={() => onDelete(producto.id)}
                className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/50 cursor-pointer"
              >
                <Trash2 size={14} className="mr-2" />
                Eliminar Producto
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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
