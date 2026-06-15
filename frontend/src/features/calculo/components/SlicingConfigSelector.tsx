import React from 'react';
import { SlicerConfigs } from '../../perfiles/types/perfiles.types';

interface SlicingConfigSelectorProps {
  configs: SlicerConfigs;
  selected: {
    print: string;
    filament: string;
    printer: string;
  };
  onChange: (type: 'print' | 'filament' | 'printer', value: string) => void;
}

export const SlicingConfigSelector: React.FC<SlicingConfigSelectorProps> = ({ configs, selected, onChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#fcfcfc] border border-[#e0e0e0] rounded-2xl p-4">
      <div className="space-y-1">
        <label className="text-[10px] font-bold uppercase text-[#7a7a7a]">Print</label>
        <select 
          value={selected.print}
          onChange={(e) => onChange('print', e.target.value)}
          className="w-full bg-transparent studio-caption font-semibold outline-none"
        >
          <option value="">Default</option>
          {configs.print.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="space-y-1">
        <label className="text-[10px] font-bold uppercase text-[#7a7a7a]">Filament</label>
        <select 
          value={selected.filament}
          onChange={(e) => onChange('filament', e.target.value)}
          className="w-full bg-transparent studio-caption font-semibold outline-none"
        >
          <option value="">Default</option>
          {configs.filament.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="space-y-1">
        <label className="text-[10px] font-bold uppercase text-[#7a7a7a]">Printer</label>
        <select 
          value={selected.printer}
          onChange={(e) => onChange('printer', e.target.value)}
          className="w-full bg-transparent studio-caption font-semibold outline-none"
        >
          <option value="">Default</option>
          {configs.printer.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
    </div>
  );
};
