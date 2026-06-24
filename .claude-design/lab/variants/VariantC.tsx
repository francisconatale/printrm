import React, { useState } from 'react';
import { ordenes, Estado } from '../data/fixtures';
import { Plus, Play, Check, X, AlertTriangle, ChevronDown, ChevronRight, Clock, CircleCheck, CircleX } from 'lucide-react';

/* ───────────────────────────────────────────
   Variant C: Dense Accordion Table
   "Compacta pero organizada"
   Tabla agrupada por estado con filas
   expandibles para detalles. Máxima
   información en mínimo espacio.
   ─────────────────────────────────────────── */

const statusConfig: Record<string, { icon: React.ReactNode; label: string }> = {
  COLA: { icon: <Clock size={12} />, label: 'En Cola' },
  IMPRIMIENDO: { icon: <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />, label: 'Imprimiendo' },
  COMPLETADO: { icon: <CircleCheck size={12} />, label: 'Completado' },
  MERMA: { icon: <CircleX size={12} />, label: 'Merma' },
  CANCELADO: { icon: <X size={12} />, label: 'Cancelado' },
};

const groupColor = (e: Estado) => {
  switch (e) {
    case 'IMPRIMIENDO': return 'border-l-primary';
    case 'COLA': return 'border-l-muted-foreground';
    case 'COMPLETADO': return 'border-l-success';
    case 'MERMA': return 'border-l-destructive';
    case 'CANCELADO': return 'border-l-border';
  }
};

function GroupSection({ estado, items }: { estado: Estado; items: typeof ordenes }) {
  const [expanded, setExpanded] = useState(true);
  const config = statusConfig[estado] || { icon: null, label: estado };

  return (
    <div className="bg-card border border-border rounded-[18px] overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-6 py-4 hover:bg-muted/30 transition-colors border-b border-border"
      >
        {expanded ? <ChevronDown size={14} className="text-muted-foreground" /> : <ChevronRight size={14} className="text-muted-foreground" />}
        <span className="flex items-center gap-2 text-[13px] font-semibold text-foreground">
          {config.icon}
          {config.label}
        </span>
        <span className="text-[12px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full ml-auto">{items.length}</span>
      </button>

      {expanded && (
        <div className="divide-y divide-border/50">
          {items.length === 0 ? (
            <div className="py-8 text-center text-[13px] text-muted-foreground">Sin órdenes en este estado</div>
          ) : (
            items.map(o => (
              <div key={o.id} className={`flex items-center gap-4 px-6 py-3.5 hover:bg-muted/20 transition-colors border-l-2 ${groupColor(o.estado)}`}>
                <div className="flex-1 min-w-0 flex items-center gap-3">
                  <span className="studio-caption-strong text-foreground truncate">{o.productoNombre}</span>
                  {o.clienteNombre && <span className="text-[11px] text-muted-foreground shrink-0">{o.clienteNombre}</span>}
                </div>
                <span className="text-[13px] font-semibold text-foreground font-mono tabular-nums">{o.cantidad}</span>

                <div className="flex items-center gap-1.5 shrink-0">
                  {o.estado === 'COLA' && (
                    <>
                      <button className="p-1.5 text-primary hover:bg-primary/10 rounded-full transition-colors" title="Iniciar"><Play size={14} fill="currentColor" /></button>
                      <button className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors" title="Cancelar"><X size={14} /></button>
                    </>
                  )}
                  {o.estado === 'IMPRIMIENDO' && (
                    <>
                      <button className="p-1.5 text-success hover:bg-success/10 rounded-full transition-colors" title="Completar"><Check size={14} /></button>
                      <button className="p-1.5 text-destructive hover:bg-destructive/10 rounded-full transition-colors" title="Merma"><AlertTriangle size={14} /></button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export function VariantC() {
  const grupos: Estado[] = ['COLA', 'IMPRIMIENDO', 'COMPLETADO', 'MERMA', 'CANCELADO'];

  const grouped = grupos.reduce((acc, e) => {
    acc[e] = ordenes.filter(o => o.estado === e);
    return acc;
  }, {} as Record<string, typeof ordenes>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="studio-tagline">Agenda de Producción</h2>
        <button className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground rounded-full px-4 py-2 text-[13px] font-semibold hover:opacity-90">
          <Plus size={14} /> Nueva Orden
        </button>
      </div>

      <div className="space-y-4">
        {grupos.map(e => (
          <GroupSection key={e} estado={e} items={grouped[e] || []} />
        ))}
      </div>
    </div>
  );
}
