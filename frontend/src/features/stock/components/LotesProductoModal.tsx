import React from 'react';
import { Modal } from '../../../components/ui/modal';
import { Producto } from '../types/stock.types';
import { Package, Calendar, TrendingUp, Layers, Info } from 'lucide-react';

interface LotesProductoModalProps {
  isOpen: boolean;
  onClose: () => void;
  producto: Producto;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value);
};

const formatDate = (dateStr: string) => {
  return new Intl.DateTimeFormat('es-AR', { dateStyle: 'long' }).format(new Date(dateStr));
};

export function LotesProductoModal({ isOpen, onClose, producto }: LotesProductoModalProps) {
  const totalValue = producto.lotes.reduce((sum, lote) => sum + (lote.cantidadActual * lote.costoUnitario), 0);
  const costoPromedio = producto.cantidadStock > 0 ? totalValue / producto.cantidadStock : 0;

  return (
    <Modal
      title={producto.nombre}
      isOpen={isOpen}
      onClose={onClose}
      size="3xl"
    >
      <div className="space-y-6 pt-2 pb-4">
        {/* iOS-Style Banner Info Callout */}
        <div className="relative overflow-hidden bg-blue-50/40 dark:bg-blue-950/10 border border-blue-100/50 dark:border-blue-900/30 rounded-2xl p-4 flex gap-3.5 transition-all">
          <div className="shrink-0 size-8 rounded-xl bg-blue-500/10 dark:bg-blue-400/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Info size={18} />
          </div>
          <div className="space-y-1">
            <p className="text-[11px] font-semibold text-blue-800 dark:text-blue-400 uppercase tracking-wider">Método FIFO (First-In, First-Out)</p>
            <p className="text-[12px] text-slate-600 dark:text-slate-400 leading-relaxed">
              Los lotes se consumen automáticamente en orden cronológico de ingreso para asegurar una correcta estimación de márgenes de costo y valor neto realizable.
            </p>
          </div>
        </div>

        {/* Apple Widget Stats Grid */}
        <div className="grid grid-cols-3 gap-4 w-full">
          {/* Stock Total Widget */}
          <div className="bg-zinc-50/50 dark:bg-zinc-900/30 border border-slate-200/50 dark:border-zinc-800/40 rounded-3xl p-5 flex flex-col justify-between transition-all duration-200 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 hover:scale-[1.01] shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-4">Stock Total</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-semibold tracking-tight text-slate-800 dark:text-zinc-100 font-sans">{producto.cantidadStock}</span>
              <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wider">uds</span>
            </div>
          </div>

          {/* Costo Promedio Widget */}
          <div className="bg-zinc-50/50 dark:bg-zinc-900/30 border border-slate-200/50 dark:border-zinc-800/40 rounded-3xl p-5 flex flex-col justify-between transition-all duration-200 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 hover:scale-[1.01] shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-4">Costo Promedio</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-semibold tracking-tight text-slate-800 dark:text-zinc-100 font-sans">{formatCurrency(costoPromedio)}</span>
              <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wider">c/u</span>
            </div>
          </div>

          {/* Valor Total Widget */}
          <div className="bg-zinc-50/50 dark:bg-zinc-900/30 border border-slate-200/50 dark:border-zinc-800/40 rounded-3xl p-5 flex flex-col justify-between transition-all duration-200 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 hover:scale-[1.01] shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-4">Valor Inventario</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-semibold tracking-tight text-emerald-600 dark:text-emerald-400 font-sans">{formatCurrency(totalValue)}</span>
              <span className="text-[10px] text-emerald-500/80 dark:text-emerald-400/80 font-bold uppercase tracking-wider">total</span>
            </div>
          </div>
        </div>

        {/* Lotes Activos list - iOS Grouped List Style */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h4 className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Lotes en Stock</h4>
            <span className="text-[10px] bg-zinc-100 dark:bg-zinc-900/60 px-2.5 py-1 rounded-full text-slate-600 dark:text-zinc-400 font-semibold border border-slate-200/40 dark:border-zinc-800/40">
              {producto.lotes.length} {producto.lotes.length === 1 ? 'lote activo' : 'lotes activos'}
            </span>
          </div>

          {producto.lotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-zinc-50/50 dark:bg-zinc-900/20 rounded-3xl border border-dashed border-slate-200 dark:border-zinc-800">
              <Package size={32} className="text-slate-300 dark:text-zinc-600 mb-3 animate-pulse" />
              <p className="text-sm font-medium text-slate-700 dark:text-zinc-300">Sin stock disponible</p>
              <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1">No hay lotes registrados para este producto.</p>
            </div>
          ) : (
            <div className="bg-zinc-50/50 dark:bg-zinc-900/20 border border-slate-200/60 dark:border-zinc-800/50 rounded-3xl overflow-hidden divide-y divide-slate-200/40 dark:divide-zinc-800/40">
              {producto.lotes.map((lote, index) => (
                <div 
                  key={lote.id} 
                  className="group flex items-center justify-between gap-4 px-5 py-4 hover:bg-slate-100/30 dark:hover:bg-zinc-800/20 transition-all duration-200"
                >
                  {/* Left info: Status Icon + Quantity & Date */}
                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 ${
                      index === 0
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                        : 'bg-slate-100 dark:bg-zinc-900 text-slate-500 dark:text-zinc-400 border border-slate-200/30 dark:border-zinc-800/30'
                    }`}>
                      {index === 0 ? (
                        <TrendingUp size={16} className="animate-pulse" />
                      ) : (
                        <Layers size={16} />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[15px] font-semibold text-slate-800 dark:text-zinc-200">
                          {lote.cantidadActual} {lote.cantidadActual === 1 ? 'unidad' : 'unidades'}
                        </span>
                        {index === 0 ? (
                          <span className="text-[9px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded border border-amber-500/20 uppercase tracking-wider">
                            Siguiente en Salir
                          </span>
                        ) : (
                          <span className="text-[9px] font-medium bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 px-2 py-0.5 rounded border border-slate-200/30 dark:border-zinc-800/30 uppercase tracking-wider">
                            En espera
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-zinc-500 mt-1">
                        <Calendar size={11} className="shrink-0" />
                        <span>Ingresado el {formatDate(lote.fechaCreacion)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right info: Unit cost & Subtotal */}
                  <div className="flex items-center gap-6 shrink-0 text-right">
                    <div className="hidden sm:block">
                      <p className="text-[9px] text-slate-400 dark:text-zinc-500 uppercase font-semibold tracking-wider">costo unit.</p>
                      <p className="text-xs font-semibold text-slate-600 dark:text-zinc-400 mt-0.5">{formatCurrency(lote.costoUnitario)}</p>
                    </div>

                    <div className="min-w-[90px]">
                      <p className="text-[9px] text-slate-400 dark:text-zinc-500 uppercase font-semibold tracking-wider">subtotal</p>
                      <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200 mt-0.5">
                        {formatCurrency(lote.cantidadActual * lote.costoUnitario)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

