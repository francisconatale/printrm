import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Perfil, PerfilCreate } from '../types/perfiles.types';
import { MODELOS_IMPRESORA } from '../data/modelos-impresora';
import { Save, X, Settings, Monitor } from 'lucide-react';

const perfilSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio").max(50),
  modeloImpresora: z.string().min(1),
  nozzleDiameter: z.number().min(0.1, "Mínimo 0.1 mm").max(2.0, "Máximo 2.0 mm"),
  bedShape: z.string().min(1, "La cama es obligatoria"),
  maxPrintHeight: z.number().min(1, "Mínimo 1 mm"),
});

interface PerfilFormProps {
  initialData?: Perfil | null;
  onSubmit: (data: PerfilCreate) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

type PerfilFormValues = z.infer<typeof perfilSchema>;

export const PerfilForm: React.FC<PerfilFormProps> = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<PerfilFormValues>({
    resolver: zodResolver(perfilSchema),
    defaultValues: initialData || {
      nombre: '',
      modeloImpresora: 'Prusa MK4',
      nozzleDiameter: 0.4,
      bedShape: '250x210',
      maxPrintHeight: 220,
    }
  });

  const selectedModelo = watch('modeloImpresora');
  const modelo = MODELOS_IMPRESORA.find(m => m.nombre === selectedModelo);

  React.useEffect(() => {
    if (modelo && !initialData) {
      setValue('nozzleDiameter', 0.4);

      if (modelo.nombre.includes("Ender 3")) {
        setValue('bedShape', '220x220');
        setValue('maxPrintHeight', 250);
      } else if (modelo.nombre.includes("MK4") || modelo.nombre.includes("MK3S")) {
        setValue('bedShape', '250x210');
        setValue('maxPrintHeight', 220);
      } else if (modelo.nombre.includes("MINI")) {
        setValue('bedShape', '180x180');
        setValue('maxPrintHeight', 180);
      } else if (modelo.nombre.includes("Bambu")) {
        setValue('bedShape', '256x256');
        setValue('maxPrintHeight', 256);
      } else {
        setValue('bedShape', '220x220');
        setValue('maxPrintHeight', 250);
      }
    }
  }, [selectedModelo, setValue, initialData]);

  const onInternalSubmit = (data: PerfilFormValues) => {
    onSubmit({
      ...data,
      consumoW: initialData?.consumoW ?? modelo?.consumoW ?? 350,
      vidaUtilHoras: initialData?.vidaUtilHoras ?? modelo?.vidaUtilHoras ?? 8000,
      costoRepuestos: initialData?.costoRepuestos ?? modelo?.costoRepuestos ?? 45000,
      filamentoPorKg: initialData?.filamentoPorKg ?? 15000,
    });
  };

  return (
    <form onSubmit={handleSubmit(onInternalSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 md:gap-x-12 gap-y-6">
        <div className="col-span-full border-b border-border/50 pb-2 mb-2 flex items-center gap-2">
          <Monitor size={14} className="text-muted-foreground" />
          <h3 className="studio-caption-strong uppercase tracking-widest text-muted-foreground">Datos Generales</h3>
        </div>

        <div className="space-y-2">
          <label className="studio-caption font-semibold">Nombre del Perfil</label>
          <input 
            {...register('nombre')}
            className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-foreground outline-none transition-all"
            placeholder="Ej: MK4 - Trabajo"
          />
          {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="studio-caption font-semibold">Modelo de Impresora</label>
          <div className="relative">
            <select 
              {...register('modeloImpresora')}
              className="w-full bg-background border border-border rounded-lg px-4 py-2 appearance-none focus:ring-2 focus:ring-foreground outline-none"
            >
              {MODELOS_IMPRESORA.map(m => (
                <option key={m.nombre} value={m.nombre}>{m.nombre}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="col-span-full border-b border-border/50 pb-2 mt-4 mb-2 flex items-center gap-2">
          <Settings size={14} className="text-muted-foreground" />
          <h3 className="studio-caption-strong uppercase tracking-widest text-muted-foreground">Hardware y Slicer</h3>
        </div>

        <div className="space-y-2">
          <label className="studio-caption font-semibold">Diámetro de Boquilla (mm)</label>
          <input 
            type="number"
            step="0.1"
            {...register('nozzleDiameter', { valueAsNumber: true })}
            className="w-full bg-background border border-border rounded-lg px-4 py-2 font-mono focus:ring-2 focus:ring-foreground outline-none"
            placeholder="Ej: 0.4"
          />
          {errors.nozzleDiameter && <p className="text-red-500 text-xs mt-1">{errors.nozzleDiameter.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="studio-caption font-semibold">Dimensiones Cama (Ancho x Alto, mm)</label>
          <input 
            {...register('bedShape')}
            className="w-full bg-background border border-border rounded-lg px-4 py-2 font-mono focus:ring-2 focus:ring-foreground outline-none"
            placeholder="Ej: 220x220"
          />
          {errors.bedShape && <p className="text-red-500 text-xs mt-1">{errors.bedShape.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="studio-caption font-semibold">Altura Máxima Z (mm)</label>
          <input 
            type="number"
            {...register('maxPrintHeight', { valueAsNumber: true })}
            className="w-full bg-background border border-border rounded-lg px-4 py-2 font-mono focus:ring-2 focus:ring-foreground outline-none"
            placeholder="Ej: 250"
          />
          {errors.maxPrintHeight && <p className="text-red-500 text-xs mt-1">{errors.maxPrintHeight.message}</p>}
        </div>
      </div>

      <div className="pt-6 pb-2 border-t border-border/50 flex flex-col sm:flex-row gap-4">
        <button 
          type="button"
          onClick={onCancel}
          className="studio-button-secondary-pill flex-1 order-2 sm:order-1 gap-2"
        >
          <X size={18} />
          Cancelar
        </button>
        <button 
          type="submit"
          disabled={isLoading}
          className="studio-button-primary flex-1 order-1 sm:order-2 gap-2"
        >
          {isLoading ? (
            'Guardando...'
          ) : (
            <>
              <Save size={18} />
              Guardar Perfil
            </>
          )}
        </button>
      </div>
    </form>
  );
};
