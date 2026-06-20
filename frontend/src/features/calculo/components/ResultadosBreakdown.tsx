import React from 'react';
import { Plus, Copy, MessageCircle, Download, Check } from 'lucide-react';
import { ResultadoCalculo } from '../types/calculo.types';
import { formatCurrency } from '../../../lib/utils';
import { generateSummaryText, copyToClipboard, shareWhatsApp, downloadCSV } from '../utils/export.utils';

interface ResultadosBreakdownProps {
  resultado: ResultadoCalculo;
  insumosExtra?: number;
  onInsumosExtraChange?: (v: number) => void;
  multiplicador?: number;
  onMultiplicadorChange?: (v: number) => void;
  onSaveToLibrary?: () => void;
  isSavingToLibrary?: boolean;
  perfilNombre?: string;
}

export const ResultadosBreakdown: React.FC<ResultadosBreakdownProps> = ({
  resultado,
  insumosExtra = 0,
  onInsumosExtraChange,
  multiplicador = 3,
  onSaveToLibrary,
  isSavingToLibrary,
  perfilNombre = 'Perfil Estándar'
}) => {
  const [showInsumos, setShowInsumos] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    const text = generateSummaryText(perfilNombre, resultado, multiplicador, insumosExtra);
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWhatsApp = () => {
    const text = generateSummaryText(perfilNombre, resultado, multiplicador, insumosExtra);
    shareWhatsApp(text);
  };

  const handleCSV = () => {
    downloadCSV(perfilNombre, resultado, multiplicador, insumosExtra);
  };

  return (
    <>
      <div className="space-y-4 flex-1 overflow-y-auto">
        <div className="grid grid-cols-2 gap-4 pb-6 border-b border-[var(--border-subtle)]">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase text-muted-foreground">Tiempo</span>
            <p className="text-lg studio-caption font-bold text-foreground">
              {resultado.horas}h {resultado.minutosAdicionales}m
            </p>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase text-muted-foreground">Material</span>
            <p className="text-lg studio-caption font-bold text-foreground">
              {resultado.gramos}g
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex justify-between items-center">
            <span className="studio-caption text-muted-foreground">Costo Energía</span>
            <span className="studio-caption font-semibold text-foreground">{formatCurrency(resultado.costoEnergia)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="studio-caption text-muted-foreground">Costo Filamento</span>
            <span className="studio-caption font-semibold text-foreground">{formatCurrency(resultado.costoFilamento)}</span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <button onClick={() => setShowInsumos(!showInsumos)}
                className="size-5 rounded-full bg-muted/30 hover:bg-muted/30 flex items-center justify-center transition-colors"
                title="Añadir insumos extra">
                <Plus size={10} className="text-muted-foreground" />
              </button>
              <span className="studio-caption text-muted-foreground">Insumos Extra</span>
            </div>
            {showInsumos ? (
              <div className="flex items-center gap-1">
                <input type="number" value={insumosExtra || ''}
                  onChange={(e) => onInsumosExtraChange?.(parseFloat(e.target.value) || 0)}
                  className="w-20 text-right bg-transparent border-b border-border studio-caption font-semibold outline-none focus:border-primary" placeholder="0" autoFocus />
              </div>
            ) : (
              <span className="studio-caption font-semibold text-foreground">{formatCurrency(insumosExtra)}</span>
            )}
          </div>

          <div className="flex justify-between items-center border-t border-[var(--border-subtle)] pt-4">
            <span className="studio-caption text-foreground font-bold">Costo Base Final</span>
            <span className="text-xl font-bold text-foreground font-mono">{formatCurrency(resultado.costoBase)}</span>
          </div>
        </div>

        {/* Acciones Rápidas - Exportación */}
        <div className="pt-6 mt-2 grid grid-cols-3 gap-2 border-t border-[var(--border-subtle)] border-dashed">
          <button 
            onClick={handleCopy}
            className="flex flex-col items-center justify-center py-3 rounded-xl border border-border hover:bg-muted/30 transition-all gap-1.5"
            title="Copiar resumen"
          >
            {copied ? (
              <>
                <Check size={14} className="text-green-600" />
                <span className="text-[10px] font-bold uppercase text-green-600">¡Copiado!</span>
              </>
            ) : (
              <>
                <Copy size={14} className="text-muted-foreground" />
                <span className="text-[10px] font-bold uppercase text-muted-foreground">Copiar</span>
              </>
            )}
          </button>
          
          <button 
            onClick={handleWhatsApp}
            className="flex flex-col items-center justify-center py-3 rounded-xl border border-border hover:bg-muted/30 transition-all gap-1.5"
            title="Compartir por WhatsApp"
          >
            <MessageCircle size={14} className="text-muted-foreground" />
            <span className="text-[10px] font-bold uppercase text-muted-foreground">WhatsApp</span>
          </button>

          <button 
            onClick={handleCSV}
            className="flex flex-col items-center justify-center py-3 rounded-xl border border-border hover:bg-muted/30 transition-all gap-1.5"
            title="Exportar CSV"
          >
            <Download size={14} className="text-muted-foreground" />
            <span className="text-[10px] font-bold uppercase text-muted-foreground">CSV</span>
          </button>
        </div>
      </div>

      <button onClick={onSaveToLibrary} disabled={isSavingToLibrary || resultado.subtotal === 0}
        className="studio-button-secondary-pill !w-full mt-3 !py-3 text-[13px] font-bold border-zinc-200 text-zinc-600 hover:border-zinc-800 hover:text-zinc-800">
        {isSavingToLibrary ? 'Guardando...' : 'Añadir a Biblioteca'}
      </button>
    </>
  );
};
