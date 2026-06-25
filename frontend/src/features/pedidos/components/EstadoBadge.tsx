import React from 'react';
import { EstadoPedido } from '../types/pedidos.types';

interface EstadoBadgeProps {
  estado: EstadoPedido;
}

export function EstadoBadge({ estado }: EstadoBadgeProps) {
  const styles: Record<EstadoPedido, string> = {
    BORRADOR: 'bg-zinc-100 text-zinc-800 border-zinc-200',
    COTIZADO: 'bg-blue-50 text-blue-700 border-blue-100',
    CONFIRMADO: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    EN_PRODUCCION: 'bg-amber-50 text-amber-700 border-amber-100',
    LISTO_PARA_ENTREGAR: 'bg-teal-50 text-teal-700 border-teal-100',
    ENTREGADO: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    CANCELADO: 'bg-red-50 text-red-700 border-red-100',
    DEVUELTO: 'bg-purple-50 text-purple-700 border-purple-100',
  };

  const labels: Record<EstadoPedido, string> = {
    BORRADOR: 'Borrador',
    COTIZADO: 'Cotizado',
    CONFIRMADO: 'Confirmado',
    EN_PRODUCCION: 'En Producción',
    LISTO_PARA_ENTREGAR: 'Listo para Entregar',
    ENTREGADO: 'Entregado',
    CANCELADO: 'Cancelado',
    DEVUELTO: 'Devuelto',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[estado] || styles.BORRADOR}`}>
      {labels[estado] || estado}
    </span>
  );
}
