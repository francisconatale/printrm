import React, { useState } from 'react';
import { FinalDesign } from './FinalDesign';
import { StudioSubNav } from '../../frontend/src/components/layout/studio-sub-nav';
import { CrearOrdenIndependienteModal } from '../../frontend/src/features/produccion/components/CrearOrdenIndependienteModal';
import { Plus, ArrowRight } from 'lucide-react';

const mockOrdenes = [
  { id: 'ORD-001', productoNombre: 'Llavero Personalizado Logo', cantidad: 50, estado: 'IMPRIMIENDO' as const, clienteNombre: 'TechCorp SRL', pedidoId: 'PED-1001' },
  { id: 'ORD-002', productoNombre: 'Caja Organizadora PLA', cantidad: 120, estado: 'COLA' as const, clienteNombre: 'Distribuidora Norte' },
  { id: 'ORD-003', productoNombre: 'Soporte Monitor 3M', cantidad: 30, estado: 'COLA' as const },
  { id: 'ORD-004', productoNombre: 'Carcasa Arduino Premium', cantidad: 200, estado: 'IMPRIMIENDO' as const, pedidoId: 'PED-1003' },
  { id: 'ORD-005', productoNombre: 'Letrero LED "Abierto"', cantidad: 15, estado: 'COMPLETADO' as const, clienteNombre: 'Café Central' },
  { id: 'ORD-006', productoNombre: 'Clip Sujetacables Pack', cantidad: 500, estado: 'COLA' as const },
  { id: 'ORD-007', productoNombre: 'Base Goma para Tablet', cantidad: 80, estado: 'MERMA' as const, clienteNombre: 'TabletPlus SA' },
  { id: 'ORD-008', productoNombre: 'Engranaje PLA 50mm', cantidad: 1000, estado: 'COMPLETADO' as const },
  { id: 'ORD-009', productoNombre: 'Maceta Autorriego', cantidad: 40, estado: 'CANCELADO' as const },
  { id: 'ORD-010', productoNombre: 'Sello Personalizado Goma', cantidad: 25, estado: 'COLA' as const },
];

export default function PreviewPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterType, setFilterType] = useState<'ALL' | 'COLA' | 'IMPRIMIENDO'>('ALL');

  const baseOrders = mockOrdenes.filter(o => o.estado !== 'CANCELADO' || filterType === 'ALL');

  const filteredOrdenes = baseOrders.filter((o) => {
    if (filterType === 'COLA' && o.estado !== 'COLA') return false;
    if (filterType === 'IMPRIMIENDO' && o.estado !== 'IMPRIMIENDO') return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="bg-muted/50 border-b border-border px-8 md:px-12 py-3">
        <div className="max-w-[1400px] mx-auto flex items-center gap-2 text-[13px] text-muted-foreground">
          <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[11px] font-semibold">Preview Final</span>
          <ArrowRight size={12} />
          <span>Diseño ganador: Variante C — Acordeón por estado</span>
        </div>
      </div>
      <StudioSubNav />
      <FinalDesign
        ordenes={filteredOrdenes}
        filterType={filterType}
        onFilterChange={setFilterType}
        onNuevaOrden={() => setShowCreateModal(true)}
        onIniciar={() => {}}
        onCompletar={() => {}}
        onMerma={() => {}}
        onCancelar={() => {}}
        totalElements={mockOrdenes.length}
      />
      <CrearOrdenIndependienteModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
}
