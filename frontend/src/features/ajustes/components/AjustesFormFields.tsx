import React from 'react';
import { Ajustes } from '../types/ajustes.types';

interface AjustesFormFieldsProps {
  value: Ajustes;
  onChange: (value: Ajustes) => void;
  layout?: 'grid' | 'stacked';
  inputClassName?: string;
}

export const AjustesFormFields: React.FC<AjustesFormFieldsProps> = ({
  value,
  onChange,
  layout = 'stacked',
  inputClassName = '',
}) => {
  const handleChange = (field: keyof Ajustes, val: number) => {
    onChange({ ...value, [field]: val });
  };

  const isGrid = layout === 'grid';

  return (
    <div className={isGrid ? 'grid grid-cols-2 gap-4' : 'space-y-4'}>
      <div className="space-y-1">
        <label className="text-xs text-muted-foreground block mb-1">
          Precio Energía ($ / kWh)
        </label>
        <input
          type="number"
          step="any"
          value={value.preciokWh || ''}
          onChange={(e) => handleChange('preciokWh', parseFloat(e.target.value) || 0)}
          className={inputClassName || "w-full p-2 bg-background border-b border-border focus:border-primary outline-none transition-all font-medium"}
          placeholder="0"
        />
      </div>
      {!isGrid && <div className="border-t border-border" />}
      <div className="space-y-1">
        <label className="text-xs text-muted-foreground block mb-1">
          Margen de Seguridad / Error (%)
        </label>
        <input
          type="number"
          step="any"
          value={value.margenError || ''}
          onChange={(e) => handleChange('margenError', parseFloat(e.target.value) || 0)}
          className={inputClassName || "w-full p-2 bg-background border-b border-border focus:border-primary outline-none transition-all font-medium"}
          placeholder="0"
        />
        {!isGrid && (
          <p className="text-[10px] text-muted-foreground leading-relaxed mt-1">
            Se aplica sobre el subtotal de costos antes del multiplicador.
          </p>
        )}
      </div>
    </div>
  );
};
