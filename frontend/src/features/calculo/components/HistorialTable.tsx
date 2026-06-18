import React from 'react';
import { Trash2, Download, Copy, MessageCircle, Clock, Package, Play } from 'lucide-react';
import { useGetHistorial, useDeleteCalculo } from '../api/historial.api';
import { formatCurrency } from '../../../lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { generateSummaryText, copyToClipboard, shareWhatsApp, downloadCSV } from '../utils/export.utils';
import { useAjustes } from '../../ajustes/hooks/useAjustes';
import { CalculoSnapshot } from '../types/calculo.types';

interface HistorialTableProps {
  onSelect?: (item: CalculoSnapshot) => void;
}

export function HistorialTable({ onSelect }: HistorialTableProps) {
  const { data: historial, isLoading } = useGetHistorial();
  const { mutate: deleteCalculo } = useDeleteCalculo();
  const { ajustes } = useAjustes();
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="py-12 flex flex-col items-center justify-center gap-4 text-muted-foreground">
        <div className="size-8 border-2 border-foreground/10 border-t-foreground rounded-full animate-spin" />
        <span className="text-[13px] font-semibold tracking-tight">Cargando historial...</span>
      </div>
    );
  }

  if (!historial || historial.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        <p className="text-[13px] font-medium">No hay cálculos guardados todavía.</p>
      </div>
    );
  }

  const handleCopy = async (item: any) => {
    const text = generateSummaryText(
      item.perfilNombre, 
      item, 
      ajustes?.multiplicador || 3, 
      item.insumosExtra
    );
    const success = await copyToClipboard(text);
    if (success && item.id) {
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="w-full overflow-hidden rounded-xl border border-border bg-card">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-muted/30 border-b border-border">
            <th className="px-6 py-4 text-[10px] font-bold uppercase text-muted-foreground">Fecha</th>
            <th className="px-6 py-4 text-[10px] font-bold uppercase text-muted-foreground">Perfil</th>
            <th className="px-6 py-4 text-[10px] font-bold uppercase text-muted-foreground">Producción</th>
            <th className="px-6 py-4 text-[10px] font-bold uppercase text-muted-foreground">Costo Base</th>
            <th className="px-6 py-4 text-[10px] font-bold uppercase text-muted-foreground text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {historial.map((item) => (
            <tr key={item.id} className="hover:bg-muted/10 transition-colors group">
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-[12px] text-muted-foreground font-mono">
                  {item.timestamp ? format(new Date(item.timestamp), 'dd MMM, HH:mm', { locale: es }) : '-'}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="text-[13px] font-bold text-foreground">{item.perfilNombre}</span>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock size={10} />
                    <span className="text-[11px] font-medium">{item.horas}h {item.minutosAdicionales}m</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Package size={10} />
                    <span className="text-[11px] font-medium">{item.gramos}g</span>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="text-[14px] font-bold text-foreground font-mono">
                  {formatCurrency(item.costoBase)}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {onSelect && (
                    <button
                      onClick={() => onSelect(item)}
                      className="p-2 hover:bg-primary/10 rounded-lg transition-all text-primary"
                      title="Cargar en calculadora"
                    >
                      <Play size={14} fill="currentColor" />
                    </button>
                  )}
                  <button
                    onClick={() => handleCopy(item)}
                    className={`p-2 rounded-lg transition-all ${copiedId === item.id ? 'bg-green-500/10 text-green-600' : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'}`}
                    title="Copiar resumen"
                  >
                    <Copy size={14} />
                  </button>
                  <button
                    onClick={() => shareWhatsApp(generateSummaryText(item.perfilNombre, item, ajustes?.multiplicador || 3, item.insumosExtra))}
                    className="p-2 hover:bg-muted/50 rounded-lg transition-all text-muted-foreground hover:text-foreground"
                    title="Compartir WhatsApp"
                  >
                    <MessageCircle size={14} />
                  </button>
                  <button
                    onClick={() => downloadCSV(item.perfilNombre, item, ajustes?.multiplicador || 3, item.insumosExtra)}
                    className="p-2 hover:bg-muted/50 rounded-lg transition-all text-muted-foreground hover:text-foreground"
                    title="Exportar CSV"
                  >
                    <Download size={14} />
                  </button>
                  <button
                    onClick={() => item.id && deleteCalculo(item.id)}
                    className="p-2 hover:bg-red-500/10 rounded-lg transition-all text-muted-foreground hover:text-red-600"
                    title="Eliminar"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
