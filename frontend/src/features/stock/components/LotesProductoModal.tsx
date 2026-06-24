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
        <div className="relative overflow-hidden bg-primary/5 border border-primary/10 rounded-2xl p-4 flex gap-3.5 transition-all">
          <div className="shrink-0 size-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Info size={18} />
          </div>
          <div className="space-y-1">
            <p className="text-[11px] font-semibold text-primary uppercase tracking-wider">Método FIFO (First-In, First-Out)</p>
            <p className="text-[12px] text-muted-foreground leading-relaxed">
              Los lotes se consumen automáticamente en orden cronológico de ingreso para asegurar una correcta estimación de márgenes de costo y valor neto realizable.
            </p>
          </div>
        </div>

        {/* Apple Widget Stats Grid */}
        <div className="grid grid-cols-3 gap-4 w-full">
          {/* Stock Total Widget */}
          <div className="bg-muted/50 border border-border/50 rounded-3xl p-5 flex flex-col justify-between transition-all duration-200 hover:bg-muted hover:scale-[1.01] shadow-sm">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Stock Total</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-semibold tracking-tight text-foreground font-sans">{producto.cantidadStock}</span>
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">uds</span>
            </div>
          </div>

          {/* Costo Promedio Widget */}
          <div className="bg-muted/50 border border-border/50 rounded-3xl p-5 flex flex-col justify-between transition-all duration-200 hover:bg-muted hover:scale-[1.01] shadow-sm">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Costo Promedio</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-semibold tracking-tight text-foreground font-sans">{formatCurrency(costoPromedio)}</span>
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">c/u</span>
            </div>
          </div>

          {/* Valor Total Widget */}
          <div className="bg-muted/50 border border-border/50 rounded-3xl p-5 flex flex-col justify-between transition-all duration-200 hover:bg-muted hover:scale-[1.01] shadow-sm">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Valor Inventario</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-semibold tracking-tight text-success font-sans">{formatCurrency(totalValue)}</span>
              <span className="text-[10px] text-success/80 font-bold uppercase tracking-wider">total</span>
            </div>
          </div>
        </div>

        {/* Lotes Activos list - iOS Grouped List Style */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Lotes en Stock</h4>
            <span className="text-[10px] bg-muted px-2.5 py-1 rounded-full text-muted-foreground font-semibold border border-border/40">
              {producto.lotes.length} {producto.lotes.length === 1 ? 'lote activo' : 'lotes activos'}
            </span>
          </div>

          {producto.lotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-muted/30 rounded-3xl border border-dashed border-border">
              <Package size={32} className="text-muted-foreground/30 mb-3 animate-pulse" />
              <p className="text-sm font-medium text-foreground/60">Sin stock disponible</p>
              <p className="text-xs text-muted-foreground mt-1">No hay lotes registrados para este producto.</p>
            </div>
          ) : (
            <div className="bg-muted/30 border border-border/50 rounded-3xl overflow-hidden divide-y divide-border/30">
              {producto.lotes.map((lote, index) => (
                <div 
                  key={lote.id} 
                  className="group flex items-center justify-between gap-4 px-5 py-4 hover:bg-muted/50 transition-all duration-200"
                >
                  {/* Left info: Status Icon + Quantity & Date */}
                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 ${
                      index === 0
                        ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                        : 'bg-muted text-muted-foreground border border-border/30'
                    }`}>
                      {index === 0 ? (
                        <TrendingUp size={16} className="animate-pulse" />
                      ) : (
                        <Layers size={16} />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[15px] font-semibold text-foreground">
                          {lote.cantidadActual} {lote.cantidadActual === 1 ? 'unidad' : 'unidades'}
                        </span>
                        {index === 0 ? (
                          <span className="text-[9px] font-bold bg-amber-500/10 text-amber-700 px-2 py-0.5 rounded border border-amber-500/20 uppercase tracking-wider">
                            Siguiente en Salir
                          </span>
                        ) : (
                          <span className="text-[9px] font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded border border-border/30 uppercase tracking-wider">
                            En espera
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-1">
                        <Calendar size={11} className="shrink-0" />
                        <span>Ingresado el {formatDate(lote.fechaCreacion)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right info: Unit cost & Subtotal */}
                  <div className="flex items-center gap-6 shrink-0 text-right">
                    <div className="hidden sm:block">
                      <p className="text-[9px] text-muted-foreground uppercase font-semibold tracking-wider">costo unit.</p>
                      <p className="text-xs font-semibold text-muted-foreground mt-0.5">{formatCurrency(lote.costoUnitario)}</p>
                    </div>

                    <div className="min-w-[90px]">
                      <p className="text-[9px] text-muted-foreground uppercase font-semibold tracking-wider">subtotal</p>
                      <p className="text-sm font-semibold text-foreground mt-0.5">
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
