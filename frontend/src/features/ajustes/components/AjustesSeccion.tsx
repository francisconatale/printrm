import React from 'react';
import { useAjustes } from '../hooks/useAjustes';
import { AjustesFormFields } from './AjustesFormFields';

export const AjustesSeccion: React.FC = () => {
  const { ajustes, updateAjustes, isUpdating } = useAjustes();
  const [form, setForm] = React.useState({ preciokWh: 0, margenError: 10 });

  React.useEffect(() => {
    if (ajustes) {
      setForm(ajustes);
    }
  }, [ajustes]);

  const handleSave = () => {
    updateAjustes(form);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="studio-tagline">Ajustes Generales del Taller</h2>
        <p className="studio-body text-xs text-muted-foreground mt-0.5">Configuraciones de precio regionales y márgenes generales de cotización.</p>
      </div>

      <div className="max-w-2xl border border-border rounded-2xl p-6 bg-muted/20 space-y-4">
        <div>
          <h3 className="studio-tagline text-base text-foreground">Parámetros Globales (Electricidad)</h3>
          <p className="studio-body text-xs text-muted-foreground mt-0.5">Configurá el precio de la energía y el margen comercial de seguridad.</p>
        </div>
        
        <AjustesFormFields 
          value={form} 
          onChange={setForm} 
          layout="grid" 
          inputClassName="w-full bg-background border border-border rounded-lg px-4 py-2 font-mono text-[14px]"
        />

        <button
          onClick={handleSave}
          disabled={isUpdating}
          className="bg-primary text-white hover:opacity-85 active:scale-95 transition-all text-xs font-semibold rounded-full px-5 py-2 !w-full"
        >
          {isUpdating ? 'Guardando...' : 'Guardar Ajustes Globales'}
        </button>
      </div>
    </div>
  );
};
