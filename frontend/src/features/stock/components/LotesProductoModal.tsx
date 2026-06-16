import React from 'react';
import { Modal } from '../../../components/ui/modal';
import { Producto, Lote } from '../types/stock.types';
import { Package, Calendar, Tag, TrendingUp } from 'lucide-react';

interface LotesProductoModalProps {
  isOpen: boolean;
  onClose: () => void;
  producto: Producto;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value);
};

const formatDate = (dateStr: string) => {
  return new Intl.DateTimeFormat('es-AR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(dateStr));
};

export function LotesProductoModal({ isOpen, onClose, producto }: LotesProductoModalProps) {
  const totalValue = producto.lotes.reduce((sum, lote) => sum + (lote.cantidadActual * lote.costoUnitario), 0);

  return (
    <Modal
      title={`Inventario: ${producto.nombre}`}
      description="Desglose detallado de unidades por escalón de costo (FIFO)."
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
    >
      <div className="space-y-6 pt-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted/5 border border-border/50 rounded-2xl p-4">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Stock Total</p>
            <div className="flex items-center gap-2">
              <Package size={16} className="text-zinc-500" />
              <span className="text-xl font-mono font-bold text-zinc-900">{producto.cantidadStock} unid.</span>
            </div>
          </div>
          <div className="bg-muted/5 border border-border/50 rounded-2xl p-4">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Valor Inventario</p>
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-green-600" />
              <span className="text-xl font-mono font-bold text-zinc-900">{formatCurrency(totalValue)}</span>
            </div>
          </div>
        </div>

        {/* Lots List */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest px-1">Listado de Lotes Activos</h4>
          <div className="border border-border/50 rounded-2xl overflow-hidden bg-white">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-muted/10">
                <tr>
                  <th className="px-4 py-3 font-semibold text-zinc-500 text-[10px] uppercase">Fecha</th>
                  <th className="px-4 py-3 font-semibold text-zinc-500 text-[10px] uppercase text-center">Cant.</th>
                  <th className="px-4 py-3 font-semibold text-zinc-500 text-[10px] uppercase text-right">Costo Unit.</th>
                  <th className="px-4 py-3 font-semibold text-zinc-500 text-[10px] uppercase text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {producto.lotes.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-10 text-center text-muted-foreground italic">
                      No hay stock disponible para este producto.
                    </td>
                  </tr>
                ) : (
                  producto.lotes.map((lote, index) => (
                    <tr key={lote.id} className="hover:bg-muted/5 transition-colors group">
                      <td className="px-4 py-4 font-medium text-zinc-700">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-zinc-400" />
                          <span className="text-xs">{formatDate(lote.fechaCreacion)}</span>
                          {index === 0 && (
                            <span className="text-[8px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-bold">SALE PRIMERO</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center font-mono font-bold text-zinc-900">
                        {lote.cantidadActual}
                      </td>
                      <td className="px-4 py-4 text-right font-mono text-zinc-600">
                        {formatCurrency(lote.costoUnitario)}
                      </td>
                      <td className="px-4 py-4 text-right font-mono font-bold text-zinc-900">
                        {formatCurrency(lote.cantidadActual * lote.costoUnitario)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button 
            onClick={onClose}
            className="studio-button-primary min-w-[120px]"
          >
            Entendido
          </button>
        </div>
      </div>
    </Modal>
  );
}
