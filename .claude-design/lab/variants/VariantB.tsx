import React, { useState } from 'react';
import { ordenes, OrdenFixture, Estado } from '../data/fixtures';
import { Plus, Play, Check, X, AlertTriangle, Search } from 'lucide-react';

/* ───────────────────────────────────────────
   Variant B: Modern List — Stripe-style
   "Lista limpia con acciones visibles"
   Filas espaciadas con estados inline,
   acciones siempre visibles (no hover).
   ─────────────────────────────────────────── */

const statusBadge = (e: Estado) => {
  const base = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold border';
  switch (e) {
    case 'IMPRIMIENDO': return `${base} bg-primary/10 text-primary border-primary/20`;
    case 'COLA': return `${base} bg-card text-foreground border-border`;
    case 'COMPLETADO': return `${base} bg-success/10 text-success border-success/20`;
    case 'MERMA': return `${base} bg-destructive/10 text-destructive border-destructive/20`;
    case 'CANCELADO': return `${base} bg-muted text-muted-foreground border-transparent`;
  }
};

function OrderRow({ orden }: { orden: OrdenFixture }) {
  return (
    <div className="flex items-center gap-4 px-6 py-5 bg-card border border-border rounded-[18px] hover:border-primary/20 transition-all">
      <div className="flex-1 min-w-0 space-y-0.5">
        <div className="flex items-center gap-2">
          <span className="studio-body-strong text-foreground truncate">{orden.productoNombre}</span>
          {orden.esVinculada && (
            <span className="text-[11px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded shrink-0">{orden.pedidoId}</span>
          )}
        </div>
        {orden.clienteNombre && (
          <p className="studio-caption text-muted-foreground">{orden.clienteNombre}</p>
        )}
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <span className="studio-body-strong text-foreground font-mono">{orden.cantidad}uds</span>
        <span className={statusBadge(orden.estado)}>
          {orden.estado === 'IMPRIMIENDO' && <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
          {orden.estado}
        </span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {orden.estado === 'COLA' && (
          <>
            <button className="flex items-center gap-1.5 bg-primary text-primary-foreground rounded-full px-4 py-1.5 text-[12px] font-semibold hover:opacity-90"><Play size={12} fill="currentColor" /> Iniciar</button>
            <button className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-full hover:bg-destructive/10"><X size={14} /></button>
          </>
        )}
        {orden.estado === 'IMPRIMIENDO' && (
          <>
            <button className="flex items-center gap-1.5 bg-foreground text-background rounded-full px-4 py-1.5 text-[12px] font-semibold hover:opacity-90"><Check size={12} /> Terminar</button>
            <button className="flex items-center gap-1.5 text-destructive rounded-full px-3 py-1.5 text-[12px] font-semibold hover:bg-destructive/10"><AlertTriangle size={12} /> Falló</button>
          </>
        )}
      </div>
    </div>
  );
}

export function VariantB() {
  const [filter, setFilter] = useState<'ALL' | 'COLA' | 'IMPRIMIENDO'>('ALL');
  const [search, setSearch] = useState('');

  const filtered = ordenes.filter(o => {
    if (filter === 'COLA' && o.estado !== 'COLA') return false;
    if (filter === 'IMPRIMIENDO' && o.estado !== 'IMPRIMIENDO') return false;
    if (search && !o.productoNombre.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="studio-tagline">Órdenes de Producción</h2>
        <button className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground rounded-full px-4 py-2 text-[13px] font-semibold hover:opacity-90">
          <Plus size={14} /> Nueva Orden
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar producto..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-card border border-border rounded-full pl-9 pr-4 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          />
        </div>
        <div className="flex gap-1.5">
          {(['ALL', 'COLA', 'IMPRIMIENDO'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-[12px] font-semibold border transition-colors ${
                filter === f ? 'bg-foreground text-background border-foreground' : 'bg-card text-muted-foreground border-border hover:bg-muted'
              }`}
            >
              {f === 'ALL' ? 'Todas' : f === 'COLA' ? 'En Cola' : 'Imprimiendo'}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground studio-caption">No hay órdenes para mostrar.</div>
        ) : (
          filtered.map(o => <OrderRow key={o.id} orden={o} />)
        )}
      </div>
    </div>
  );
}
