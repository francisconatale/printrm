import React from 'react';
import { Modal } from '../../../components/ui/modal';
import { Producto } from '../types/stock.types';
import { Package, Calendar, TrendingUp, ArrowRight, Layers } from 'lucide-react';

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
      description=""
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
    >
      <div className="space-y-6 pt-2">
        <div className="grid grid-cols-3 gap-3 w-full">
          <div className="bg-zinc-50 rounded-xl px-5 py-4 border border-zinc-100 min-w-0">
            <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">Stock Total</p>
            <div className="flex items-baseline gap-1 flex-wrap">
              <span className="text-2xl font-bold text-zinc-900">{producto.cantidadStock}</span>
              <span className="text-[10px] text-zinc-400 font-medium">uds</span>
            </div>
          </div>
          <div className="bg-zinc-50 rounded-xl px-5 py-4 border border-zinc-100 min-w-0">
            <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">Costo Prom.</p>
            <div className="flex items-baseline gap-1 flex-wrap">
              <span className="text-2xl font-bold text-zinc-900">{formatCurrency(costoPromedio)}</span>
              <span className="text-[10px] text-zinc-400 font-medium">c/u</span>
            </div>
          </div>
          <div className="bg-zinc-50 rounded-xl px-5 py-4 border border-zinc-100 min-w-0">
            <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">Valor Total</p>
            <div className="flex items-baseline gap-1 flex-wrap">
              <span className="text-2xl font-bold text-emerald-700">{formatCurrency(totalValue)}</span>
              <span className="text-[10px] text-zinc-400 font-medium">total</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Lotes Activos (FIFO)</h4>
            <span className="text-[10px] text-zinc-300 font-medium">{producto.lotes.length} {producto.lotes.length === 1 ? 'lote' : 'lotes'}</span>
          </div>

          {producto.lotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-zinc-50 rounded-xl border border-dashed border-zinc-200">
              <Package size={24} className="text-zinc-300 mb-2" />
              <p className="text-sm font-medium text-zinc-400">Sin stock disponible</p>
              <p className="text-[11px] text-zinc-300 mt-0.5">No hay lotes registrados para este producto.</p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-100 bg-white rounded-xl border border-zinc-100 overflow-hidden">
              {producto.lotes.map((lote, index) => (
                <div key={lote.id} className="flex items-center gap-4 px-5 py-4 hover:bg-zinc-50 transition-colors">
                  <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${
                    index === 0
                      ? 'bg-amber-50 text-amber-600'
                      : 'bg-zinc-50 text-zinc-400'
                  }`}>
                    {index === 0 ? (
                      <TrendingUp size={16} />
                    ) : (
                      <Layers size={16} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-zinc-900">
                        {lote.cantidadActual} {lote.cantidadActual === 1 ? 'unidad' : 'unidades'}
                      </span>
                      {index === 0 && (
                        <span className="text-[9px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200/50 uppercase tracking-wider">
                          FIFO
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-0.5">
                      <Calendar size={11} className="shrink-0" />
                      <span>{formatDate(lote.fechaCreacion)}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-xs text-zinc-400">costo unit.</p>
                    <p className="text-sm font-semibold text-zinc-700">{formatCurrency(lote.costoUnitario)}</p>
                  </div>

                  <div className="hidden sm:flex items-center gap-2 text-zinc-300">
                    <ArrowRight size={14} />
                  </div>

                  <div className="text-right shrink-0 min-w-[90px]">
                    <p className="text-xs text-zinc-400">subtotal</p>
                    <p className="text-sm font-bold text-zinc-900">{formatCurrency(lote.cantidadActual * lote.costoUnitario)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end pt-2 border-t border-zinc-100">
          <button onClick={onClose} className="studio-button-primary min-w-[100px]">
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  );
}
