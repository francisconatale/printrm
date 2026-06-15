import React from 'react';
import { ResultadoCalculo, PiezaInput } from '../types/calculo.types';
import { usePerfilActivo } from '../../perfiles/hooks/usePerfilActivo';

interface ResultadoPanelProps {
  resultado: ResultadoCalculo | null;
  onSave: () => void;
  isSaving?: boolean;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
};

export const ResultadoPanel: React.FC<ResultadoPanelProps> = ({ resultado, onSave, isSaving }) => {
  const { perfilActivo } = usePerfilActivo();

  if (!perfilActivo) {
    return (
      <div className="studio-store-card h-full flex flex-col items-center justify-center text-center p-12">
        <p className="studio-body text-[#7a7a7a]">Primero configurá un perfil de impresora para ver los resultados del cálculo.</p>
      </div>
    );
  }

  if (!resultado) return null;

  return (
    <div className="studio-store-card h-full flex flex-col">
      <div className="flex items-center justify-between mb-8 border-b border-[#f0f0f0] pb-4">
        <span className="studio-caption-strong uppercase tracking-wider text-[#7a7a7a]">Desglose de Costos</span>
        <span className="text-[10px] font-bold bg-[#f5f5f7] px-2 py-1 rounded text-[#7a7a7a]">
          MARGEN ERROR: {perfilActivo.margenError}%
        </span>
      </div>

      <div className="space-y-4 flex-1">
        <div className="flex justify-between items-center">
          <span className="studio-body text-[#7a7a7a]">Costo Energía</span>
          <span className="studio-body-strong font-mono">{formatCurrency(resultado.costoEnergia)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="studio-body text-[#7a7a7a]">Costo Filamento</span>
          <span className="studio-body-strong font-mono">{formatCurrency(resultado.costoFilamento)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="studio-body text-[#7a7a7a]">Desgaste Máquina</span>
          <span className="studio-body-strong font-mono">{formatCurrency(resultado.costoDesgaste)}</span>
        </div>
        <div className="flex justify-between items-center border-t border-[#f0f0f0] pt-4">
          <span className="studio-body text-[#7a7a7a]">Costo Base (Producción)</span>
          <span className="studio-body-strong font-mono">{formatCurrency(resultado.costoBase)}</span>
        </div>
        
        <div className="mt-12 bg-black/[0.02] rounded-2xl p-6 text-center border border-[#f0f0f0]">
          <p className="studio-caption-strong uppercase tracking-wider text-[#7a7a7a] mb-2">Precio de Venta Sugerido</p>
          <p className="studio-hero-display !text-4xl font-mono">{formatCurrency(resultado.precioVenta)}</p>
          <p className="studio-caption text-[#7a7a7a] mt-2">Margen aplicado: {resultado.precioVenta / (resultado.costoBase || 1)}x</p>
        </div>
      </div>

      <button 
        onClick={onSave}
        disabled={isSaving || resultado.subtotal === 0}
        className="studio-button-primary !w-full mt-8 disabled:opacity-30"
      >
        {isSaving ? 'Guardando...' : 'Guardar en Historial'}
      </button>
    </div>
  );
};
