import React, { useState } from 'react';
import { ordenes, OrdenFixture, Estado } from '../data/fixtures';
import { Plus, Play, Check, X, AlertTriangle, Package, User, Hash, ExternalLink } from 'lucide-react';

/* ───────────────────────────────────────────
   Variant D: Card Grid + Drawer
   "Tarjetas visuales con panel lateral"
   Grid de cards con acciones principales,
   y panel deslizable para detalles.
   Progressive disclosure.
   ─────────────────────────────────────────── */

const estadoColor = (e: Estado) => {
  switch (e) {
    case 'IMPRIMIENDO': return 'bg-primary/10 text-primary border-primary/20';
    case 'COLA': return 'bg-card text-foreground border-border';
    case 'COMPLETADO': return 'bg-success/10 text-success border-success/20';
    case 'MERMA': return 'bg-destructive/10 text-destructive border-destructive/20';
    case 'CANCELADO': return 'bg-muted text-muted-foreground border-transparent';
  }
};

function ProductCard({ orden, onSelect }: { orden: OrdenFixture; onSelect: (o: OrdenFixture) => void }) {
  return (
    <div
      onClick={() => onSelect(orden)}
      className="bg-card border border-border rounded-[18px] p-6 space-y-4 hover:border-primary/20 hover:bg-muted/20 transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shrink-0">
            <Package size={22} className="text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <h3 className="studio-caption-strong text-foreground truncate">{orden.productoNombre}</h3>
            {orden.clienteNombre && (
              <p className="text-[12px] text-muted-foreground flex items-center gap-1 mt-0.5">
                <User size={10} /> {orden.clienteNombre}
              </p>
            )}
          </div>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border shrink-0 ${estadoColor(orden.estado)}`}>
          {orden.estado}
        </span>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-border/50">
        <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
          <Hash size={12} />
          <span className="font-mono">{orden.cantidad} uds</span>
          {orden.esVinculada && orden.pedidoId && (
            <>
              <span className="text-border/50">|</span>
              <span className="text-[11px]">{orden.pedidoId}</span>
            </>
          )}
        </div>

        {orden.estado === 'COLA' && (
          <button
            onClick={e => { e.stopPropagation(); }}
            className="flex items-center gap-1 bg-primary text-primary-foreground rounded-full px-3 py-1.5 text-[11px] font-semibold hover:opacity-90"
          >
            <Play size={11} fill="currentColor" /> Iniciar
          </button>
        )}
        {orden.estado === 'IMPRIMIENDO' && (
          <div className="flex gap-1.5" onClick={e => e.stopPropagation()}>
            <button className="flex items-center gap-1 bg-foreground text-background rounded-full px-3 py-1.5 text-[11px] font-semibold hover:opacity-90">
              <Check size={11} /> Completar
            </button>
            <button className="p-1.5 text-destructive hover:bg-destructive/10 rounded-full transition-colors" title="Merma">
              <AlertTriangle size={13} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function VariantD() {
  const [selected, setSelected] = useState<OrdenFixture | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'COLA' | 'IMPRIMIENDO'>('ALL');

  const filtered = ordenes.filter(o => {
    if (filter === 'ALL') return true;
    return o.estado === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="studio-tagline">Producción</h2>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center py-16 text-muted-foreground studio-caption">Sin órdenes activas</div>
        ) : (
          filtered.map(o => <ProductCard key={o.id} orden={o} onSelect={setSelected} />)
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative w-full max-w-lg bg-background border-l border-border p-8 overflow-y-auto animate-in slide-in-from-right">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="studio-display-md !text-2xl">{selected.productoNombre}</h3>
                <button onClick={() => setSelected(null)} className="p-2 hover:bg-muted rounded-full transition-colors">
                  <X size={18} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/50 rounded-xl p-4 space-y-1">
                  <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">Cantidad</span>
                  <p className="studio-body-strong font-mono">{selected.cantidad} uds</p>
                </div>
                <div className="bg-muted/50 rounded-xl p-4 space-y-1">
                  <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">Estado</span>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${estadoColor(selected.estado)}`}>
                    {selected.estado}
                  </span>
                </div>
                {selected.clienteNombre && (
                  <div className="bg-muted/50 rounded-xl p-4 space-y-1">
                    <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">Cliente</span>
                    <p className="studio-caption-strong">{selected.clienteNombre}</p>
                  </div>
                )}
                {selected.pedidoId && (
                  <div className="bg-muted/50 rounded-xl p-4 space-y-1">
                    <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">Pedido</span>
                    <p className="studio-caption-strong">{selected.pedidoId}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4 border-t border-border">
                {selected.estado === 'COLA' && (
                  <>
                    <button className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-full py-2.5 text-[13px] font-semibold hover:opacity-90">
                      <Play size={14} fill="currentColor" /> Iniciar Producción
                    </button>
                    <button className="px-4 py-2.5 text-muted-foreground hover:text-destructive border border-border rounded-full hover:border-destructive/50 transition-colors">
                      <X size={16} />
                    </button>
                  </>
                )}
                {selected.estado === 'IMPRIMIENDO' && (
                  <>
                    <button className="flex-1 flex items-center justify-center gap-2 bg-foreground text-background rounded-full py-2.5 text-[13px] font-semibold hover:opacity-90">
                      <Check size={14} /> Marcar Completado
                    </button>
                    <button className="flex items-center gap-2 px-5 py-2.5 text-destructive border border-destructive/30 rounded-full text-[13px] font-semibold hover:bg-destructive/10 transition-colors">
                      <AlertTriangle size={14} /> Merma
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
