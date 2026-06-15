import React from 'react';
import { Perfil, FilamentProfile, PrintProfile } from '../../perfiles/types/perfiles.types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SlicingConfigSelectorProps {
  printers: Perfil[];
  filaments: FilamentProfile[];
  prints: PrintProfile[];
  selected: {
    print: string;
    filament: string;
    printer: string;
  };
  onChange: (type: 'print' | 'filament' | 'printer', value: string) => void;
}

export const SlicingConfigSelector: React.FC<SlicingConfigSelectorProps> = ({ 
  printers = [], 
  filaments = [], 
  prints = [], 
  selected, 
  onChange 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-muted/[0.06] rounded-2xl p-4">
      
      {/* PRINT SETTINGS PROFILE SELECT */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold uppercase text-muted-foreground">Ajuste Impresión (Print)</label>
        <Select value={selected.print} onValueChange={(val) => onChange('print', val)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Seleccionar" />
          </SelectTrigger>
          <SelectContent side="bottom">
            {prints.map(p => (
              <SelectItem key={p.id} value={p.id}>{p.nombre} ({p.layerHeight}mm)</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* FILAMENT PROFILE SELECT */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold uppercase text-muted-foreground">Material (Filamento)</label>
        <Select value={selected.filament} onValueChange={(val) => onChange('filament', val)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Seleccionar" />
          </SelectTrigger>
          <SelectContent side="bottom">
            {filaments.map(f => (
              <SelectItem key={f.id} value={f.id}>{f.nombre} ({f.material})</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* PRINTER PROFILE SELECT */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold uppercase text-muted-foreground">Impresora (Printer)</label>
        <Select value={selected.printer} onValueChange={(val) => onChange('printer', val)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Seleccionar" />
          </SelectTrigger>
          <SelectContent side="bottom">
            {printers.map(p => (
              <SelectItem key={p.id} value={p.id}>{p.nombre} ({p.modeloImpresora})</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

    </div>
  );
};
