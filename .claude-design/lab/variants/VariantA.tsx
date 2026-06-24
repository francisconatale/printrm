import React, { useState } from 'react';
import { ordenes, OrdenFixture, Estado } from '../data/fixtures';
import { Plus, Play, Check, X, AlertTriangle, Layers } from 'lucide-react';

/* ───────────────────────────────────────────
   Variant A: Kanban Board
   "Columnas visuales por estado"
   Muestra el pipeline de producción como
   un tablero Kanban con columnas.
   ─────────────────────────────────────────── */

const estados: { key: Estado | 'ALL'; label: string }[] = [
  { key: 'COLA', label: 'En Cola' },
  { key: 'IMPRIMIENDO', label: 'Imprimiendo' },
  { key: 'COMPLETADO', label: 'Terminadas' },
];

const statusColor = (e: Estado) => {
  switch (e) {
    case 'IMPRIMIENDO': return 'bg-primary/10 text-primary border-primary/20';
    case 'COLA': return 'bg-card text-foreground border-border';
    case 'COMPLETADO': return 'bg-success/10 text-success border-success/20';
    case 'MERMA': return 'bg-destructive/10 text-destructive border-destructive/20';
    case 'CANCELADO': return 'bg-muted text-muted-foreground border-transparent';
  }
};

function OrderCard({ orden }: { orden: OrdenFixture }) {
  return (
    <div className="bg-card border border-border rounded-[18px] p-5 space-y-3 hover:border-primary/30 transition-all group">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="studio-caption-strong text-foreground truncate">{orden.productoNombre}</h3>
          {orden.clienteNombre && (
            <p className="text-[12px] text-muted-foreground mt-0.5">{orden.clienteNombre}</p>
          )}
        </div>
        <span className="text-[17px] font-semibold text-foreground font-mono shrink-0">{orden.cantidad}</span>
      </div>

      {orden.esVinculada && orden.pedidoId && (
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Layers size={11} />
          <span>{orden.pedidoId}</span>
        </div>
      )}

      <div className="flex items-center gap-2 pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {orden.estado === 'COLA' && (
          <>
            <button className="flex-1 flex items-center justify-center gap-1.5 bg-primary text-primary-foreground rounded-full py-1.5 text-[12px] font-semibold hover:opacity-90 transition-all"><Play size={12} fill="currentColor" /> Iniciar</button>
            <button className="p-1.5 text-muted-foreground hover:text-destructive transition-colors" title="Cancelar"><X size={15} /></button>
          </>
        )}
        {orden.estado === 'IMPRIMIENDO' && (
          <>
            <button className="flex-1 flex items-center justify-center gap-1.5 bg-foreground text-background rounded-full py-1.5 text-[12px] font-semibold hover:opacity-90 transition-all"><Check size={12} /> Completar</button>
            <button className="p-1.5 text-destructive hover:opacity-80 transition-colors" title="Marcar merma"><AlertTriangle size={15} /></button>
          </>
        )}
      </div>
    </div>
  );
}

export function VariantA() {
  const [showCola, setShowCola] = useState(true);
  const [showImprimiendo, setShowImprimiendo] = useState(true);
  const [showCompletado, setShowCompletado] = useState(true);

  const grouped = {
    COLA: ordenes.filter(o => o.estado === 'COLA'),
    IMPRIMIENDO: ordenes.filter(o => o.estado === 'IMPRIMIENDO'),
    COMPLETADO: ordenes.filter(o => o.estado === 'COMPLETADO' || o.estado === 'MERMA'),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="studio-tagline flex items-center gap-2">
          <Layers size={20} /> Pipeline de Producción
        </h2>
        <button className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground rounded-full px-4 py-2 text-[13px] font-semibold hover:opacity-90 transition-all">
          <Plus size={14} /> Nueva Orden
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {estados.map((col) => {
          const items = col.key === 'ALL' ? ordenes : grouped[col.key] || [];
          return (
            <div key={col.key} className="bg-muted/50 rounded-[18px] border border-border p-4 space-y-3" data-variant="A">
              <div className="flex items-center justify-between px-1">
                <h3 className="studio-caption-strong text-foreground">{col.label}</h3>
                <span className="text-[12px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{items.length}</span>
              </div>
              <div className="space-y-3 min-h-[300px]">
                {items.length === 0 ? (
                  <div className="flex items-center justify-center h-32 text-[13px] text-muted-foreground">Sin órdenes</div>
                ) : (
                  items.map(o => <OrderCard key={o.id} orden={o} />)
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
