import React from 'react';
import { Plus, Minus, MoreVertical, PackageOpen } from 'lucide-react';
import { mockProducto, formatCurrency } from '../data/fixtures';

// VARIANT A: Stripe-style Flat Minimalist
export const VariantA = () => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 flex items-center gap-4 transition-colors duration-200 hover:bg-slate-50 dark:hover:bg-slate-800/50">
      
      {/* Icon / Image Placeholder */}
      <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-md flex items-center justify-center shrink-0">
        <PackageOpen className="text-slate-400 dark:text-slate-500 w-5 h-5" />
      </div>

      {/* Main Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-slate-900 dark:text-slate-100 text-[15px] leading-snug truncate">
          {mockProducto.nombre}
        </h3>
        <p className="text-[13px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
          {mockProducto.descripcion}
        </p>
      </div>

      {/* Metrics */}
      <div className="flex items-center gap-6 px-4">
        <div className="flex flex-col items-end">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">Stock</span>
          <span className={`text-[13px] font-semibold ${mockProducto.cantidadStock > 0 ? 'text-slate-700 dark:text-slate-300' : 'text-red-600 dark:text-red-400'}`}>
            {mockProducto.cantidadStock}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">Costo</span>
          <span className="text-[13px] font-medium text-slate-500 dark:text-slate-400">
            {formatCurrency(mockProducto.currentProductionCost)}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">Venta</span>
          <span className="text-[14px] font-semibold text-slate-900 dark:text-slate-100">
            {formatCurrency(mockProducto.precioSugerido)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 pl-4 border-l border-slate-200 dark:border-slate-800">
        <button className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors duration-200 cursor-pointer">
          <Minus size={16} />
        </button>
        <button className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors duration-200 cursor-pointer">
          <Plus size={16} />
        </button>
        <div className="w-px h-4 bg-slate-200 dark:bg-slate-800 mx-1" />
        <button className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors duration-200 cursor-pointer">
          <MoreVertical size={16} />
        </button>
      </div>

    </div>
  );
};
