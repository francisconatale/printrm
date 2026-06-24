import React from 'react';
import { Plus, Minus, MoreVertical, Package } from 'lucide-react';
import { mockProducto, formatCurrency } from '../data/fixtures';

// VARIANT B: Linear-style High Density
export const VariantB = () => {
  return (
    <div className="group bg-white dark:bg-[#0A0A0A] border-b border-gray-100 dark:border-gray-800/50 py-2.5 px-3 flex items-center gap-4 hover:bg-gray-50/50 dark:hover:bg-gray-900/50 transition-colors duration-150 cursor-pointer">
      
      <div className="w-8 h-8 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
        <Package className="w-4 h-4 text-gray-500" />
      </div>

      <div className="flex-1 min-w-0 grid grid-cols-12 items-center gap-4">
        <div className="col-span-5 flex flex-col">
          <span className="font-medium text-gray-900 dark:text-gray-100 text-[14px] truncate">
            {mockProducto.nombre}
          </span>
          <span className="text-[12px] text-gray-500 truncate">
            {mockProducto.descripcion}
          </span>
        </div>

        <div className="col-span-2">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200/50 dark:border-emerald-800/30">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
              {mockProducto.cantidadStock} en stock
            </span>
          </div>
        </div>

        <div className="col-span-4 flex items-center justify-end gap-4">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[11px] text-gray-400">Costo</span>
            <span className="font-mono text-[13px] text-gray-600 dark:text-gray-400">
              {formatCurrency(mockProducto.currentProductionCost)}
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[11px] text-gray-400">Venta</span>
            <span className="font-mono text-[13px] font-medium text-gray-900 dark:text-gray-100">
              {formatCurrency(mockProducto.precioSugerido)}
            </span>
          </div>
        </div>

        <div className="col-span-1 flex justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button className="p-1 text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors duration-150">
            <Minus size={14} />
          </button>
          <button className="p-1 text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors duration-150">
            <Plus size={14} />
          </button>
          <button className="p-1 text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors duration-150">
            <MoreVertical size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
