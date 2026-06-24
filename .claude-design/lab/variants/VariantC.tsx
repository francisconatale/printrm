import React from 'react';
import { Plus, Minus, MoreVertical, Image as ImageIcon } from 'lucide-react';
import { mockProducto, formatCurrency } from '../data/fixtures';

// VARIANT C: Apple-style Airy Layout
export const VariantC = () => {
  return (
    <div className="bg-white dark:bg-[#1C1C1E] rounded-[20px] p-4 flex items-center gap-5 border border-transparent shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-gray-100 dark:hover:border-gray-800 transition-all duration-300 cursor-pointer">
      
      {/* Thumbnail */}
      <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center shrink-0">
        <ImageIcon className="text-gray-400 w-6 h-6" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
           <div className={`w-1.5 h-1.5 rounded-full ${mockProducto.cantidadStock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
           <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">
             {mockProducto.cantidadStock > 0 ? `${mockProducto.cantidadStock} EN STOCK` : 'AGOTADO'}
           </span>
        </div>

        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg tracking-tight truncate">
          {mockProducto.nombre}
        </h3>
        
        <div className="flex items-baseline gap-3 mt-1">
          <span className="text-lg font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            {formatCurrency(mockProducto.precioSugerido)}
          </span>
          <span className="text-[13px] font-medium text-gray-400">
            costo {formatCurrency(mockProducto.currentProductionCost)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col items-end gap-2 pr-1">
        <button className="p-1.5 text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors duration-200">
          <MoreVertical size={16} />
        </button>

        <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800/50 p-1 rounded-full border border-gray-100 dark:border-gray-800">
          <button className="p-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-white dark:hover:bg-gray-700 rounded-full transition-colors duration-200 shadow-sm">
            <Minus size={14} />
          </button>
          <button className="p-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-white dark:hover:bg-gray-700 rounded-full transition-colors duration-200 shadow-sm">
            <Plus size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
