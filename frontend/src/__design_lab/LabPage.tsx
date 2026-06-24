import React, { useState } from 'react';
import { FeedbackOverlay } from './FeedbackOverlay';
import { VariantA, VariantB, VariantC } from './VentasVariants';

const VARIANTS = [
  {
    id: 'A',
    name: 'Lista Unificada + Badge de tipo',
    rationale: 'Una sola tabla con todos los registros ordenados por fecha. Chips de tipo (Pedido / Rápida) y filtros horizontales. Más "Stripe-like".',
    tags: ['unificado', 'tabla', 'filtro rápido'],
  },
  {
    id: 'B',
    name: 'Split view (2 columnas)',
    rationale: 'Dos columnas fijas: izquierda para Pedidos, derecha para Ventas Rápidas. Nunca mezcla los tipos. Máxima claridad visual.',
    tags: ['separado', 'dos columnas', 'sin scroll horizontal'],
  },
  {
    id: 'C',
    name: 'Feed cronológico con cards expandibles',
    rationale: 'Cards con KPIs arriba y feed cronológico. Hacé click en cualquier item para ver el detalle inline (sin modal). Inspiración Apple.',
    tags: ['KPIs', 'expandible', 'premium'],
  },
];

export function LabPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f7] font-[Inter,system-ui,sans-serif]">
      {/* Header */}
      <div className="bg-white border-b border-[#e5e7eb] px-8 py-5">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-[#9ca3af] mb-1">Design Lab</p>
          <h1 className="text-2xl font-bold text-[#111827] tracking-tight">Nueva Sección: Ventas</h1>
          <p className="text-sm text-[#6b7280] mt-1">
            3 enfoques para unificar <strong className="text-[#111827]">Pedidos</strong> y <strong className="text-[#111827]">Ventas Rápidas</strong> en un solo lugar. Datos de prueba incluidos.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-8 py-10 space-y-10">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {VARIANTS.map(v => {
            const Component = { A: VariantA, B: VariantB, C: VariantC }[v.id as 'A' | 'B' | 'C'];
            return (
              <div key={v.id} data-variant={v.id} className="bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden shadow-sm flex flex-col">
                {/* Card header */}
                <div className="px-5 py-4 border-b border-[#f0f0f0]">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="size-6 rounded-full bg-[#111827] text-white text-[11px] font-bold flex items-center justify-center">{v.id}</span>
                    <span className="font-semibold text-[#111827] text-sm">{v.name}</span>
                  </div>
                  <p className="text-xs text-[#6b7280] leading-relaxed">{v.rationale}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {v.tags.map(t => (
                      <span key={t} className="text-[10px] bg-[#f5f5f7] text-[#6b7280] border border-[#e5e7eb] px-2 py-0.5 rounded-full">{t}</span>
                    ))}
                  </div>
                </div>
                {/* Preview */}
                <div className="flex-1 overflow-hidden" style={{ height: 520 }}>
                  <Component />
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center py-6">
          <p className="text-sm text-[#9ca3af]">
            Usá el botón <strong className="text-[#111827]">💬 Add Feedback</strong> (abajo a la derecha) para dejar comentarios sobre elementos específicos.
          </p>
        </div>
      </div>

      <FeedbackOverlay targetName="VentasView" />
    </div>
  );
}
