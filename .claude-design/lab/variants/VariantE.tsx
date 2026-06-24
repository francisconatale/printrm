import React, { useState } from 'react';
import { ordenes, OrdenFixture, Estado } from '../data/fixtures';
import { Plus, Play, Check, X, AlertTriangle, Circle, CircleCheck, Clock, ArrowRight } from 'lucide-react';

/* ───────────────────────────────────────────
   Variant E: Timeline / Feed View
   "Flujo cronológico de producción"
   Muestra las órdenes como eventos en
   una línea de tiempo. Ideal para ver
   el progreso y qué sigue.
   ─────────────────────────────────────────── */

const stepOrder: Estado[] = ['COLA', 'IMPRIMIENDO', 'COMPLETADO'];

function stepIndex(e: Estado): number {
  const i = stepOrder.indexOf(e);
  return i >= 0 ? i : -1;
}

function TimelineOrder({ orden }: { orden: OrdenFixture }) {
  const idx = stepIndex(orden.estado);
  const isActive = orden.estado === 'IMPRIMIENDO';
  const isDone = orden.estado === 'COMPLETADO';
  const isFailed = orden.estado === 'MERMA' || orden.estado === 'CANCELADO';

  return (
    <div className="relative pl-10 pb-8 last:pb-0 group">
      <div className={`absolute left-[13px] top-2 bottom-0 w-0.5 ${isDone ? 'bg-success' : isFailed ? 'bg-destructive/30' : 'bg-border'}`} />

      <div className={`absolute left-0 top-1 w-[26px] h-[26px] rounded-full border-2 flex items-center justify-center bg-card ${
        isActive ? 'border-primary' : isDone ? 'border-success bg-success/10' : isFailed ? 'border-destructive/50' : 'border-border'
      }`}>
        {isDone ? <CircleCheck size={14} className="text-success" /> : isActive ? <Circle size={10} className="text-primary" fill="currentColor" /> : isFailed ? <X size={12} className="text-destructive" /> : <Clock size={12} className="text-muted-foreground" />}
      </div>

      <div className={`bg-card border rounded-[18px] p-5 transition-all ${
        isActive ? 'border-primary/30 bg-primary/[0.02]' : isFailed ? 'border-destructive/20' : 'border-border hover:border-primary/20'
      }`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="studio-caption-strong text-foreground truncate">{orden.productoNombre}</h3>
              {orden.esVinculada && orden.pedidoId && (
                <span className="text-[11px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded shrink-0">{orden.pedidoId}</span>
              )}
            </div>
            {orden.clienteNombre && (
              <p className="text-[12px] text-muted-foreground mt-0.5">{orden.clienteNombre} · {orden.cantidad} uds</p>
            )}
          </div>

          <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border shrink-0 ${
            orden.estado === 'IMPRIMIENDO' ? 'bg-primary/10 text-primary border-primary/20' :
            orden.estado === 'COLA' ? 'bg-card text-foreground border-border' :
            orden.estado === 'COMPLETADO' ? 'bg-success/10 text-success border-success/20' :
            orden.estado === 'MERMA' ? 'bg-destructive/10 text-destructive border-destructive/20' :
            'bg-muted text-muted-foreground border-transparent'
          }`}>
            {orden.estado}
          </span>
        </div>

        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border/50">
          {stepOrder.map((s, i) => (
            <React.Fragment key={s}>
              <div className={`flex items-center gap-1.5 text-[11px] font-semibold ${
                idx >= i ? 'text-foreground' : 'text-muted-foreground/50'
              }`}>
                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                  idx > i ? 'bg-success text-white' : idx === i ? isActive ? 'bg-primary text-white' : 'bg-muted text-muted-foreground' : 'bg-muted/50 text-muted-foreground/50'
                }`}>
                  {idx > i ? <Check size={9} /> : <span className="text-[8px]">{i + 1}</span>}
                </div>
                <span>{s === 'COLA' ? 'Cola' : s === 'IMPRIMIENDO' ? 'Imprimiendo' : 'Terminado'}</span>
              </div>
              {i < stepOrder.length - 1 && <ArrowRight size={10} className="text-border" />}
            </React.Fragment>
          ))}

          <div className="ml-auto flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            {orden.estado === 'COLA' && (
              <>
                <button className="flex items-center gap-1 bg-primary text-primary-foreground rounded-full px-3 py-1 text-[11px] font-semibold hover:opacity-90"><Play size={10} fill="currentColor" /> Iniciar</button>
                <button className="p-1 text-muted-foreground hover:text-destructive transition-colors"><X size={13} /></button>
              </>
            )}
            {orden.estado === 'IMPRIMIENDO' && (
              <>
                <button className="flex items-center gap-1 bg-foreground text-background rounded-full px-3 py-1 text-[11px] font-semibold hover:opacity-90"><Check size={10} /> Terminar</button>
                <button className="flex items-center gap-1 text-destructive rounded-full px-2.5 py-1 text-[11px] font-semibold hover:bg-destructive/10"><AlertTriangle size={10} /> Merma</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function VariantE() {
  const [filter, setFilter] = useState<'ALL' | 'COLA' | 'IMPRIMIENDO'>('ALL');

  const sorted = [...ordenes].sort((a, b) => {
    const order: Record<string, number> = { COLA: 0, IMPRIMIENDO: 1, COMPLETADO: 2, MERMA: 3, CANCELADO: 4 };
    return (order[a.estado] ?? 99) - (order[b.estado] ?? 99);
  });

  const filtered = sorted.filter(o => {
    if (filter === 'ALL') return true;
    return o.estado === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="studio-tagline">Línea de Producción</h2>
        <button className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground rounded-full px-4 py-2 text-[13px] font-semibold hover:opacity-90">
          <Plus size={14} /> Nueva Orden
        </button>
      </div>

      <div className="flex gap-2">
        {(['ALL', 'COLA', 'IMPRIMIENDO'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-[12px] font-semibold border transition-colors ${
              filter === f ? 'bg-foreground text-background border-foreground' : 'bg-card text-muted-foreground border-border hover:bg-muted'
            }`}
          >
            {f === 'ALL' ? 'Todas' : f === 'COLA' ? 'En Cola' : 'Imprimiendo'}
          </button>
        ))}
      </div>

      <div className="max-w-2xl">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground studio-caption">Sin órdenes en esta vista</div>
        ) : (
          filtered.map(o => <TimelineOrder key={o.id} orden={o} />)
        )}
      </div>
    </div>
  );
}
