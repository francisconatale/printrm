import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSlicerProfiles } from '../hooks/useSlicingConfigs';

interface CalculadoraConfigSelectorProps {
  selected: {
    print: string;
    filament: string;
    printer: string;
  };
  onChange: (type: 'print' | 'filament' | 'printer', value: string) => void;
}

export function CalculadoraConfigSelector({ selected, onChange }: CalculadoraConfigSelectorProps) {
  const { printers, filaments, prints } = useSlicerProfiles();

  return (
    <div className="divide-y divide-border">
      <ConfigRow
        label="Ajuste de impresión"
        placeholder="Seleccionar ajuste..."
        value={selected.print}
        onChange={(val) => onChange('print', val)}
        items={prints}
      />
      <ConfigRow
        label="Material"
        placeholder="Seleccionar material..."
        value={selected.filament}
        onChange={(val) => onChange('filament', val)}
        items={filaments}
      />
      <ConfigRow
        label="Impresora"
        placeholder="Seleccionar impresora..."
        value={selected.printer}
        onChange={(val) => onChange('printer', val)}
        items={printers}
      />
    </div>
  );
}

interface ConfigRowProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  items: { value: string; label: string }[];
}

function ConfigRow({ label, placeholder, value, onChange, items }: ConfigRowProps) {
  return (
    <div className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
      <span className="text-[13px] text-muted-foreground">{label}</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-auto gap-1.5 border-0 bg-transparent p-0 h-auto shadow-none text-[13px] font-medium text-foreground focus:ring-0 data-placeholder:text-muted-foreground/60">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent side="bottom" align="end" position="popper" className="min-w-[200px]">
          <SelectItem value="">—</SelectItem>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
