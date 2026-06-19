import React from 'react';
import { EstadoPedido } from '../types/pedidos.types';

interface EstadoBadgeProps {
  estado: EstadoPedido;
}

export function EstadoBadge({ estado }: EstadoBadgeProps) {
  const styles: Record<EstadoPedido, string> = {
    BORRADOR: 'bg-zinc-100 text-zinc-800 border-zinc-200 dark:bg-zinc-800/40 dark:text-zinc-300 dark:border-zinc-700/60',
    COTIZADO: 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/10 dark:text-blue-400 dark:border-blue-800/40',
    CONFIRMADO: 'bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-900/10 dark:text-indigo-400 dark:border-indigo-800/40',
    EN_PRODUCCION: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/10 dark:text-amber-400 dark:border-amber-800/40',
    LISTO_PARA_ENTREGAR: 'bg-teal-50 text-teal-700 border-teal-100 dark:bg-teal-950/10 dark:text-teal-400 dark:border-teal-900/40',
    ENTREGADO: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/10 dark:text-emerald-400 dark:border-emerald-900/40',
    CANCELADO: 'bg-red-50 text-red-700 border-red-100 dark:bg-red-950/10 dark:text-red-400 dark:border-red-900/40',
    DEVUELTO: 'bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-950/10 dark:text-purple-400 dark:border-purple-900/40',
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
