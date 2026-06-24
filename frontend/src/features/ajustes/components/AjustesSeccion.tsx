import React from 'react';
import { toast } from 'sonner';
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
    updateAjustes(form, {
      onSuccess: () => toast.success('Ajustes guardados'),
      onError: () => toast.error('Error al guardar ajustes'),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="studio-tagline">Ajustes Generales</h2>
          <p className="studio-body text-xs text-muted-foreground mt-0.5">Precio de la energía y margen de seguridad.</p>
        </div>
      </div>

      <div className="border border-border rounded-2xl overflow-hidden bg-background shadow-sm">
        <div className="p-6 space-y-5">
          <AjustesFormFields 
            value={form} 
            onChange={setForm} 
            layout="grid" 
            inputClassName="w-full bg-background border border-border rounded-lg px-4 py-2 text-[14px]"
          />

          <button
            onClick={handleSave}
            disabled={isUpdating}
            className="bg-primary text-white hover:opacity-85 active:scale-95 transition-all text-xs font-semibold rounded-full px-5 py-2 w-full"
          >
            {isUpdating ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
};
