import React from 'react';
import { ProfileSelect } from '../../../components/ui/profile-select';
import { useSlicerProfiles } from '../hooks/useSlicingConfigs';

interface SlicingConfigSelectorProps {
  selected: {
    print: string;
    filament: string;
    printer: string;
  };
  onChange: (type: 'print' | 'filament' | 'printer', value: string) => void;
}

export const SlicingConfigSelector: React.FC<SlicingConfigSelectorProps> = ({
  selected,
  onChange,
}) => {
  const { printers, filaments, prints } = useSlicerProfiles();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-muted/[0.06] rounded-2xl p-4">
      <ProfileSelect
        label="Ajuste Impresión (Print)"
        placeholder="Seleccionar ajuste..."
        emptyLabel="Sin ajuste de impresión"
        value={selected.print}
        onValueChange={(val) => onChange('print', val)}
        items={prints}
      />
      <ProfileSelect
        label="Material (Filamento)"
        placeholder="Seleccionar material..."
        emptyLabel="Sin filamento"
        value={selected.filament}
        onValueChange={(val) => onChange('filament', val)}
        items={filaments}
      />
      <ProfileSelect
        label="Impresora (Printer)"
        placeholder="Seleccionar impresora..."
        emptyLabel="Sin impresora"
        value={selected.printer}
        onValueChange={(val) => onChange('printer', val)}
        items={printers}
      />
    </div>
  );
};
