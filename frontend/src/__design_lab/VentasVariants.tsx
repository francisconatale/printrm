import React, { useState, useMemo } from 'react';
import { Search, ShoppingBag, Zap, Eye, RotateCcw, Plus, Minus, Loader2 } from 'lucide-react';

// ── Mock data ────────────────────────────────────────────────────────────────
const MOCK_PEDIDOS = [
  { id: 'ped-001aabbcc', clienteNombre: 'Lucía Fernández', estado: 'PENDIENTE', total: 12500, montoPagado: 5000, saldoPendiente: 7500, fechaCreacion: '2024-06-20T10:30:00' },
  { id: 'ped-002ddeeff', clienteNombre: 'Marcos Ruiz', estado: 'PAGADO', total: 8200, montoPagado: 8200, saldoPendiente: 0, fechaCreacion: '2024-06-18T14:00:00' },
  { id: 'ped-003gghhii', clienteNombre: 'Ana Gómez', estado: 'EN_PROCESO', total: 21000, montoPagado: 10000, saldoPendiente: 11000, fechaCreacion: '2024-06-15T09:00:00' },
];

const MOCK_VENTAS = [
  { grupoId: 'vta-aaa111', total: 4500, compradorNombre: 'Cliente Anónimo', fecha: '2024-06-21T11:20:00', items: [{ productoNombre: 'Maceta Groot S', cantidad: 3, precioUnitario: 1500, subtotal: 4500, productoId: 'p1' }] },
  { grupoId: 'vta-bbb222', total: 6000, compradorNombre: 'Roberto Silva', fecha: '2024-06-19T16:45:00', items: [{ productoNombre: 'Soporte Auriculares', cantidad: 1, precioUnitario: 6000, subtotal: 6000, productoId: 'p2' }] },
];

const formatCurrency = (v: number) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(v);
const formatDate = (d: string) => new Date(d).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

const ESTADO_COLORS: Record<string, string> = {
  PENDIENTE: 'bg-amber-50 text-amber-700 border-amber-200',
  PAGADO: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  EN_PROCESO: 'bg-blue-50 text-blue-700 border-blue-200',
  CANCELADO: 'bg-zinc-100 text-zinc-500 border-zinc-200',
};

// ── Variant A: Lista unificada con badge de tipo ─────────────────────────────
export function VariantA() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'todos' | 'pedido' | 'rapida'>('todos');

  type Row =
    | { tipo: 'pedido'; id: string; desc: string; monto: number; fecha: string; badge: string; estado: string }
    | { tipo: 'rapida'; id: string; desc: string; monto: number; fecha: string; badge: string };

  const rows: Row[] = [
    ...MOCK_PEDIDOS.map(p => ({ tipo: 'pedido' as const, id: p.id, desc: p.clienteNombre, monto: p.total, fecha: p.fechaCreacion, badge: p.estado, estado: p.estado })),
    ...MOCK_VENTAS.map(v => ({ tipo: 'rapida' as const, id: v.grupoId, desc: v.compradorNombre || 'Anónimo', monto: v.total, fecha: v.fecha, badge: 'RÁPIDA' })),
  ].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  const filtered = rows.filter(r =>
    (filter === 'todos' || r.tipo === filter) &&
    r.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="px-8 py-6 border-b border-border/50 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Ventas</h1>
          <p className="text-sm text-muted-foreground mt-1">Historial unificado de pedidos y ventas rápidas.</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold">
          <span className="text-2xl font-black text-foreground">{formatCurrency(filtered.reduce((s, r) => s + r.monto, 0))}</span>
          <span className="text-muted-foreground text-xs">total visible</span>
        </div>
      </div>

      {/* Filters */}
      <div className="px-8 py-4 flex items-center gap-3 border-b border-border/30">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input className="w-full pl-9 pr-3 py-2 text-sm rounded-full border border-border bg-muted/20 outline-none focus:ring-2 focus:ring-primary/20" placeholder="Buscar cliente..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {(['todos', 'pedido', 'rapida'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${filter === f ? 'bg-foreground text-background border-foreground' : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'}`}>
            {f === 'todos' ? 'Todos' : f === 'pedido' ? '📋 Pedidos' : '⚡ Rápidas'}
          </button>
        ))}
      </div>

      {/* Tabla */}
      <div className="flex-1 overflow-y-auto px-8 py-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Tipo</th>
              <th className="text-left py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Cliente / Comprador</th>
              <th className="text-center py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Estado</th>
              <th className="text-right py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Monto</th>
              <th className="text-right py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {filtered.map(r => (
              <tr key={r.id} className="hover:bg-muted/5 transition-colors cursor-pointer">
                <td className="py-3.5">
                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${r.tipo === 'pedido' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                    {r.tipo === 'pedido' ? <ShoppingBag size={10} /> : <Zap size={10} />}
                    {r.tipo === 'pedido' ? 'Pedido' : 'Rápida'}
                  </span>
                </td>
                <td className="py-3.5 font-semibold text-foreground">{r.desc}</td>
                <td className="py-3.5 text-center">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${ESTADO_COLORS[r.badge] || 'bg-zinc-50 text-zinc-600 border-zinc-200'}`}>{r.badge}</span>
                </td>
                <td className="py-3.5 text-right font-bold text-foreground">{formatCurrency(r.monto)}</td>
                <td className="py-3.5 text-right text-muted-foreground text-xs">{formatDate(r.fecha)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Variant B: Doble columna (Pedidos | Ventas rápidas) ──────────────────────
export function VariantB() {
  const [search, setSearch] = useState('');

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="px-8 py-6 border-b border-border/50 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Ventas</h1>
          <p className="text-sm text-muted-foreground mt-1">Pedidos cotizados y ventas directas de catálogo.</p>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input className="pl-9 pr-3 py-2 text-sm rounded-full border border-border bg-muted/20 outline-none focus:ring-2 focus:ring-primary/20" placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="flex-1 grid grid-cols-2 divide-x divide-border/50 overflow-hidden">
        {/* Pedidos */}
        <div className="flex flex-col overflow-hidden">
          <div className="px-6 py-3 border-b border-border/30 flex items-center gap-2">
            <ShoppingBag size={14} className="text-blue-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Pedidos</span>
            <span className="ml-auto text-xs font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-200">{MOCK_PEDIDOS.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-border/30">
            {MOCK_PEDIDOS.filter(p => p.clienteNombre.toLowerCase().includes(search.toLowerCase())).map(p => (
              <div key={p.id} className="px-6 py-4 hover:bg-muted/5 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-semibold text-sm text-foreground">{p.clienteNombre}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${ESTADO_COLORS[p.estado] || ''}`}>{p.estado}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground font-mono">#{p.id.slice(4, 12)}</span>
                  <span className="font-bold text-sm text-foreground">{formatCurrency(p.total)}</span>
                </div>
                {p.saldoPendiente > 0 && <p className="text-[10px] text-amber-600 mt-1">Pendiente: {formatCurrency(p.saldoPendiente)}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Ventas rápidas */}
        <div className="flex flex-col overflow-hidden">
          <div className="px-6 py-3 border-b border-border/30 flex items-center gap-2">
            <Zap size={14} className="text-amber-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Ventas Rápidas</span>
            <span className="ml-auto text-xs font-bold bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full border border-amber-200">{MOCK_VENTAS.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-border/30">
            {MOCK_VENTAS.map(v => (
              <div key={v.grupoId} className="px-6 py-4 hover:bg-muted/5 transition-colors cursor-pointer">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-semibold text-sm text-foreground">{v.compradorNombre || 'Anónimo'}</span>
                  <span className="font-bold text-sm text-foreground">{formatCurrency(v.total)}</span>
                </div>
                <span className="text-xs text-muted-foreground">{formatDate(v.fecha)}</span>
                <div className="mt-2 space-y-0.5">
                  {v.items.map((it, i) => (
                    <p key={i} className="text-[11px] text-muted-foreground">{it.cantidad}× {it.productoNombre}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Variant C: Feed cronológico con tarjetas expandibles ────────────────────
export function VariantC() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'todos' | 'pedido' | 'rapida'>('todos');
  const [expanded, setExpanded] = useState<string | null>(null);

  type Item =
    | { tipo: 'pedido'; id: string; nombre: string; monto: number; fecha: string; estado: string; pendiente: number; pagado: number }
    | { tipo: 'rapida'; id: string; nombre: string; monto: number; fecha: string; items: typeof MOCK_VENTAS[0]['items'] };

  const all: Item[] = [
    ...MOCK_PEDIDOS.map(p => ({ tipo: 'pedido' as const, id: p.id, nombre: p.clienteNombre, monto: p.total, fecha: p.fechaCreacion, estado: p.estado, pendiente: p.saldoPendiente, pagado: p.montoPagado })),
    ...MOCK_VENTAS.map(v => ({ tipo: 'rapida' as const, id: v.grupoId, nombre: v.compradorNombre || 'Anónimo', monto: v.total, fecha: v.fecha, items: v.items })),
  ].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
   .filter(r => (filter === 'todos' || r.tipo === filter) && r.nombre.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col h-full bg-background">
      {/* KPIs */}
      <div className="px-8 py-5 border-b border-border/50">
        <div className="flex items-end justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Ventas</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Vista cronológica de todas las operaciones.</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-muted/10 rounded-xl p-3 border border-border/40">
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Total Ventas</p>
            <p className="text-xl font-black text-foreground mt-0.5">{formatCurrency([...MOCK_PEDIDOS.map(p=>p.total), ...MOCK_VENTAS.map(v=>v.total)].reduce((a,b)=>a+b,0))}</p>
          </div>
          <div className="bg-muted/10 rounded-xl p-3 border border-border/40">
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Pedidos</p>
            <p className="text-xl font-black text-foreground mt-0.5">{MOCK_PEDIDOS.length}</p>
          </div>
          <div className="bg-muted/10 rounded-xl p-3 border border-border/40">
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Rápidas</p>
            <p className="text-xl font-black text-foreground mt-0.5">{MOCK_VENTAS.length}</p>
          </div>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="px-8 py-3 flex items-center gap-3 border-b border-border/30">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input className="w-full pl-9 pr-3 py-1.5 text-sm rounded-full border border-border bg-muted/10 outline-none" placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {(['todos', 'pedido', 'rapida'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${filter === f ? 'bg-foreground text-background border-foreground' : 'border-border text-muted-foreground hover:text-foreground'}`}>
            {f === 'todos' ? 'Todos' : f === 'pedido' ? 'Pedidos' : 'Rápidas'}
          </button>
        ))}
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto px-8 py-4 space-y-2">
        {all.map(item => {
          const isOpen = expanded === item.id;
          return (
            <div key={item.id} className="rounded-xl border border-border/50 bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <button className="w-full flex items-center gap-4 px-5 py-4 text-left" onClick={() => setExpanded(isOpen ? null : item.id)}>
                <div className={`size-9 rounded-lg flex items-center justify-center shrink-0 ${item.tipo === 'pedido' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-500'}`}>
                  {item.tipo === 'pedido' ? <ShoppingBag size={16} /> : <Zap size={16} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-foreground truncate">{item.nombre}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(item.fecha)}</p>
                </div>
                {item.tipo === 'pedido' && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${ESTADO_COLORS[item.estado] || ''}`}>{item.estado}</span>
                )}
                <span className="font-bold text-foreground text-sm shrink-0">{formatCurrency(item.monto)}</span>
              </button>
              {isOpen && (
                <div className="border-t border-border/30 px-5 py-3 bg-muted/5 text-xs text-muted-foreground space-y-1 animate-in slide-in-from-top-1 duration-150">
                  {item.tipo === 'rapida'
                    ? item.items.map((it, i) => (
                        <div key={i} className="flex justify-between">
                          <span>{it.cantidad}× {it.productoNombre}</span>
                          <span className="font-semibold text-foreground">{formatCurrency(it.subtotal)}</span>
                        </div>
                      ))
                    : <>
                        <div className="flex justify-between"><span>Pagado</span><span className="text-emerald-600 font-semibold">{formatCurrency(item.pagado)}</span></div>
                        <div className="flex justify-between"><span>Pendiente</span><span className={item.pendiente > 0 ? 'text-amber-600 font-semibold' : 'text-zinc-400'}>{formatCurrency(item.pendiente)}</span></div>
                      </>
                  }
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
