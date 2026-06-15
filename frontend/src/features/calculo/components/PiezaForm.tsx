import React from 'react';
import { PiezaInput } from '../types/calculo.types';

interface PiezaFormProps {
  input: PiezaInput;
  onChange: (input: PiezaInput) => void;
  disabled?: boolean;
}

export const PiezaForm: React.FC<PiezaFormProps> = ({ input, onChange, disabled }) => {
  const handleChange = (field: keyof PiezaInput, value: string) => {
    const numValue = parseFloat(value) || 0;
    onChange({ ...input, [field]: numValue });
  };

  return (
    <div className={`space-y-6 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="studio-caption-strong uppercase tracking-wider text-[#7a7a7a]">Tiempo de Impresión</label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input 
                type="number"
                value={input.horas || ''}
                onChange={(e) => handleChange('horas', e.target.value)}
                className="w-full bg-white border border-[#e0e0e0] rounded-lg pl-4 pr-10 py-3 studio-body-strong font-mono outline-none focus:border-[#1d1d1f]"
                placeholder="0"
              />
              <span className="absolute right-3 top-3.5 text-[10px] font-bold text-[#7a7a7a]">H</span>
            </div>
            <div className="flex-1 relative">
              <input 
                type="number"
                value={input.minutosAdicionales || ''}
                onChange={(e) => handleChange('minutosAdicionales', e.target.value)}
                className="w-full bg-white border border-[#e0e0e0] rounded-lg pl-4 pr-10 py-3 studio-body-strong font-mono outline-none focus:border-[#1d1d1f]"
                placeholder="0"
              />
              <span className="absolute right-3 top-3.5 text-[10px] font-bold text-[#7a7a7a]">MIN</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="studio-caption-strong uppercase tracking-wider text-[#7a7a7a]">Peso del Filamento</label>
          <div className="relative">
            <input 
              type="number"
              value={input.gramos || ''}
              onChange={(e) => handleChange('gramos', e.target.value)}
              className="w-full bg-white border border-[#e0e0e0] rounded-lg pl-4 pr-10 py-3 studio-body-strong font-mono outline-none focus:border-[#1d1d1f]"
              placeholder="0"
            />
            <span className="absolute right-3 top-3.5 text-[10px] font-bold text-[#7a7a7a]">GRAMOS</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="studio-caption-strong uppercase tracking-wider text-[#7a7a7a]">Insumos Extra ($)</label>
          <input 
            type="number"
            value={input.insumosExtra || ''}
            onChange={(e) => handleChange('insumosExtra', e.target.value)}
            className="w-full bg-white border border-[#e0e0e0] rounded-lg px-4 py-3 studio-body-strong font-mono outline-none focus:border-[#1d1d1f]"
            placeholder="0.00"
          />
        </div>

        <div className="space-y-2">
          <label className="studio-caption-strong uppercase tracking-wider text-[#7a7a7a]">Multiplicador Ganancia</label>
          <div className="flex gap-2">
             <input 
               type="number"
               step="0.1"
               value={input.multiplicador || ''}
               onChange={(e) => handleChange('multiplicador', e.target.value)}
               className="flex-1 bg-white border border-[#e0e0e0] rounded-lg px-4 py-3 studio-body-strong font-mono outline-none focus:border-[#1d1d1f]"
               placeholder="3.0"
             />
             <div className="flex gap-1">
               {[3, 4, 5].map(v => (
                 <button 
                   key={v}
                   onClick={() => onChange({ ...input, multiplicador: v })}
                   className={`px-3 rounded-lg border text-[10px] font-bold transition-colors ${input.multiplicador === v ? 'bg-[#1d1d1f] text-white border-[#1d1d1f]' : 'bg-[#f5f5f7] text-[#7a7a7a] border-[#e0e0e0] hover:bg-[#e0e0e0]'}`}
                 >
                   {v}x
                 </button>
               ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
