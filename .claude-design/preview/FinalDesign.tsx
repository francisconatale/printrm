import React, { useState } from 'react';
import { Plus, Play, Check, X, AlertTriangle, ChevronDown, ChevronRight, Clock, CircleCheck, CircleX, Hammer, Search } from 'lucide-react';
import { Button } from '../../../frontend/src/components/ui/button';
import { cn } from '../../../frontend/src/lib/utils';

/* ───────────────────────────────────────────
   Final Design: Accordion agrupado por estado
   Basado en Variant C — refactorizado para
   producción con el design system existente.
   ─────────────────────────────────────────── */

type Estado = 'COLA' | 'IMPRIMIENDO' | 'COMPLETADO' | 'MERMA' | 'CANCELADO';

interface Orden {
  id: string;
  productoNombre: string;
  cantidad: number;
  estado: Estado;
  clienteNombre?: string;
  pedidoId?: string;
}

const statusConfig: Record<Estado, { label: string; color: string; dot: string }> = {
  COLA:          { label: 'En Cola',       color: 'bg-card text-foreground border-border',                       dot: '' },
  IMPRIMIENDO:   { label: 'Imprimiendo',   color: 'bg-primary/10 text-primary border-primary/20',                dot: 'bg-primary animate-pulse' },
  COMPLETADO:    { label: 'Completado',    color: 'bg-success/10 text-success border-success/20',                dot: '' },
  MERMA:         { label: 'Merma',         color: 'bg-destructive/10 text-destructive border-destructive/20',   dot: '' },
  CANCELADO:     { label: 'Cancelado',     color: 'bg-muted text-muted-foreground border-transparent',           dot: '' },
};

const groupBorder: Record<Estado, string> = {
  COLA:        'border-l-muted-foreground',
  IMPRIMIENDO: 'border-l-primary',
  COMPLETADO:  'border-l-success',
  MERMA:       'border-l-destructive',
  CANCELADO:   'border-l-border',
};

const estadoOrder: Estado[] = ['COLA', 'IMPRIMIENDO', 'COMPLETADO', 'MERMA', 'CANCELADO'];

interface GroupSectionProps {
  estado: Estado;
  items: Orden[];
  onIniciar: (id: string) => void;
  onCompletar: (id: string) => void;
  onMerma: (orden: Orden) => void;
  onCancelar: (id: string) => void;
}

function GroupSection({ estado, items, onIniciar, onCompletar, onMerma, onCancelar }: GroupSectionProps) {
  const [expanded, setExpanded] = useState(items.length > 0);
  const cfg = statusConfig[estado];
  const isEmpty = items.length === 0;

  return (
    <div className="bg-card border border-border rounded-[18px] overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className={cn(
          "w-full flex items-center gap-3 px-6 py-4 transition-colors",
          "hover:bg-muted/30 border-b border-border"
        )}
      >
        {expanded ? <ChevronDown size={14} className="text-muted-foreground shrink-0" /> : <ChevronRight size={14} className="text-muted-foreground shrink-0" />}
        <span className="flex items-center gap-2 text-[13px] font-semibold text-foreground">
          <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", cfg.dot)} />
          {cfg.label}
        </span>
        <span className="text-[12px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full ml-auto">{items.length}</span>
      </button>

      {expanded && (
        <div className="divide-y divide-border/50">
          {isEmpty ? (
            <div className="py-10 text-center text-[13px] text-muted-foreground">
              Sin órdenes en este estado
            </div>
          ) : (
            items.map((o) => (
              <div
                key={o.id}
                className={cn(
                  "flex items-center gap-4 px-6 py-4 hover:bg-muted/20 transition-colors border-l-2",
                  groupBorder[o.estado]
                )}
              >
                <div className="flex-1 min-w-0 flex items-center gap-3">
                  <span className="studio-caption-strong text-foreground truncate">{o.productoNombre}</span>
                  {o.clienteNombre && (
                    <span className="text-[11px] text-muted-foreground shrink-0 hidden sm:inline">
                      {o.clienteNombre}
                    </span>
                  )}
                  {o.pedidoId && (
                    <span className="text-[11px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded shrink-0 hidden md:inline">
                      {o.pedidoId}
                    </span>
                  )}
                </div>

                <span className="text-[13px] font-semibold text-foreground tabular-nums shrink-0">
                  {o.cantidad}
                </span>

                <div className="flex items-center gap-1.5 shrink-0">
                  {o.estado === 'COLA' && (
                    <>
                      <button
                        onClick={() => onIniciar(o.id)}
                        className="p-1.5 text-primary hover:bg-primary/10 rounded-full transition-colors"
                        title="Iniciar producción"
                      >
                        <Play size={14} fill="currentColor" />
                      </button>
                      <button
                        onClick={() => onCancelar(o.id)}
                        className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                        title="Cancelar orden"
                      >
                        <X size={14} />
                      </button>
                    </>
                  )}
                  {o.estado === 'IMPRIMIENDO' && (
                    <>
                      <button
                        onClick={() => onCompletar(o.id)}
                        className="p-1.5 text-success hover:bg-success/10 rounded-full transition-colors"
                        title="Marcar como completado"
                      >
                        <Check size={14} />
                      </button>
                      <button
                        onClick={() => onMerma(o)}
                        className="p-1.5 text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                        title="Registrar merma"
                      >
                        <AlertTriangle size={14} />
                      </button>
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

interface FinalDesignProps {
  ordenes: Orden[];
  filterType: 'ALL' | 'COLA' | 'IMPRIMIENDO';
  onFilterChange: (f: 'ALL' | 'COLA' | 'IMPRIMIENDO') => void;
  onNuevaOrden: () => void;
  onIniciar: (id: string) => void;
  onCompletar: (id: string) => void;
  onMerma: (orden: Orden) => void;
  onCancelar: (id: string) => void;
  totalElements?: number;
}

export function FinalDesign({
  ordenes,
  filterType,
  onFilterChange,
  onNuevaOrden,
  onIniciar,
  onCompletar,
  onMerma,
  onCancelar,
  totalElements,
}: FinalDesignProps) {
  const activeStates: Estado[] = ['COLA', 'IMPRIMIENDO'];
  const inactiveStates: Estado[] = ['COMPLETADO', 'MERMA', 'CANCELADO'];
  const mostrarInactivas = filterType !== 'IMPRIMIENDO';

  const grouped = (estados: Estado[]) =>
    estados.reduce(
      (acc, e) => {
        acc[e] = ordenes.filter((o) => o.estado === e);
        return acc;
      },
      {} as Record<string, Orden[]>
    );

  const activeGrouped = grouped(activeStates);
  const inactiveGrouped = mostrarInactivas ? grouped(inactiveStates) : {};

  return (
    <div className="flex flex-col w-full bg-background min-h-full">
      <main className="flex-1 px-8 md:px-12 py-10 overflow-y-auto custom-scrollbar">
        <div className="max-w-[1400px] mx-auto space-y-8">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <h1 className="studio-display-md flex items-center gap-3">
                <Hammer className="text-foreground shrink-0" size={32} aria-hidden="true" />
                <span>Agenda de Producción</span>
              </h1>
              <p className="studio-body text-muted-foreground">
                {totalElements !== undefined
                  ? `${totalElements} órdenes en el sistema`
                  : 'Control de piezas en producción'}
              </p>
            </div>
            <Button onClick={onNuevaOrden} className="self-start sm:self-center">
              <Plus size={18} aria-hidden="true" />
              <span>Nueva Orden de Stock</span>
            </Button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            {([
              { key: 'ALL' as const, label: 'Activas' },
              { key: 'COLA' as const, label: 'En Cola' },
              { key: 'IMPRIMIENDO' as const, label: 'Imprimiendo' },
            ]).map((f) => (
              <button
                key={f.key}
                onClick={() => onFilterChange(f.key)}
                className={cn(
                  'px-4 py-1.5 rounded-full text-[12px] font-semibold border transition-colors',
                  filterType === f.key
                    ? 'bg-foreground text-background border-foreground'
                    : 'bg-card text-muted-foreground border-border hover:bg-muted'
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Active orders */}
          <div className="space-y-4">
            {activeStates.map((e) => (
              <GroupSection
                key={e}
                estado={e}
                items={activeGrouped[e] || []}
                onIniciar={onIniciar}
                onCompletar={onCompletar}
                onMerma={onMerma}
                onCancelar={onCancelar}
              />
            ))}
          </div>

          {/* Inactive orders (collapsed by default) */}
          {mostrarInactivas && (
            <details className="group">
              <summary className="cursor-pointer text-[13px] font-semibold text-muted-foreground hover:text-foreground transition-colors select-none py-2">
                Historial
              </summary>
              <div className="mt-4 space-y-4">
                {inactiveStates.map((e) => (
                  <GroupSection
                    key={e}
                    estado={e}
                    items={inactiveGrouped[e] || []}
                    onIniciar={onIniciar}
                    onCompletar={onCompletar}
                    onMerma={onMerma}
                    onCancelar={onCancelar}
                  />
                ))}
              </div>
            </details>
          )}

        </div>
      </main>
    </div>
  );
}
