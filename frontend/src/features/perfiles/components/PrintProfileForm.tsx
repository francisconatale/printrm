import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PrintProfile, PrintProfileCreate } from '../types/perfiles.types';

const printSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio").max(50),
  layerHeight: z.number().min(0.05, "M�nimo 0.05 mm").max(1.2, "M�ximo 1.2 mm"),
  perimeters: z.number().min(1, "M�nimo 1 per�metro").max(10, "M�ximo 10 per�metros"),
  fillDensity: z.string().min(1, "Relleno obligatorio"),
  speedPrint: z.number().min(5, "Velocidad m�nima 5 mm/s").max(500, "Velocidad m�xima 500 mm/s"),
});

interface PrintProfileFormProps {
  initialData?: PrintProfile | null;
  onSubmit: (data: PrintProfileCreate) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const PrintProfileForm: React.FC<PrintProfileFormProps> = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<PrintProfileCreate>({
    resolver: zodResolver(printSchema),
    defaultValues: initialData || {
      nombre: '',
      layerHeight: 0.2,
      perimeters: 3,
      fillDensity: '15%',
      speedPrint: 60,
    }
  });

  const onInternalSubmit = (data: PrintProfileCreate) => {
    // Standardize % in fillDensity
    let fill = data.fillDensity;
    if (fill && !fill.endsWith('%') && !isNaN(Number(fill))) {
      fill += '%';
    }
    onSubmit({
      ...data,
      fillDensity: fill,
    });
  };

  return (
    <form onSubmit={handleSubmit(onInternalSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 md:gap-x-12 gap-y-6">
        <div className="col-span-full border-b border-[var(--border-subtle)] pb-2 mb-2">
          <h3 className="studio-caption-strong uppercase tracking-widest text-muted-foreground">Datos de Ajustes de Impresi�n</h3>
        </div>

        <div className="space-y-2">
          <label className="studio-caption font-semibold">Nombre del Ajuste</label>
          <input 
            {...register('nombre')}
            className="w-full bg-background border border-border rounded-lg px-4 py-2"
            placeholder="Ej: Calidad Est�ndar 0.2"
          />
          {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="studio-caption font-semibold">Altura de Capa (mm)</label>
          <input 
            type="number"
            step="0.01"
            {...register('layerHeight', { valueAsNumber: true })}
            className="w-full bg-background border border-border rounded-lg px-4 py-2 font-mono"
            placeholder="Ej: 0.2"
          />
          {errors.layerHeight && <p className="text-red-500 text-xs mt-1">{errors.layerHeight.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="studio-caption font-semibold">Per�metros / Paredes</label>
          <input 
            type="number"
            {...register('perimeters', { valueAsNumber: true })}
            className="w-full bg-background border border-border rounded-lg px-4 py-2 font-mono"
            placeholder="Ej: 3"
          />
          {errors.perimeters && <p className="text-red-500 text-xs mt-1">{errors.perimeters.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="studio-caption font-semibold">Densidad de Relleno (%)</label>
          <input 
            {...register('fillDensity')}
            className="w-full bg-background border border-border rounded-lg px-4 py-2 font-mono"
            placeholder="Ej: 15%"
          />
          {errors.fillDensity && <p className="text-red-500 text-xs mt-1">{errors.fillDensity.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="studio-caption font-semibold">Velocidad de Impresi�n (mm/s)</label>
          <input 
            type="number"
            {...register('speedPrint', { valueAsNumber: true })}
            className="w-full bg-background border border-border rounded-lg px-4 py-2 font-mono"
            placeholder="Ej: 60"
          />
          {errors.speedPrint && <p className="text-red-500 text-xs mt-1">{errors.speedPrint.message}</p>}
        </div>

      </div>

      <div className="pt-6 pb-2 mt-8 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row gap-4">
        <button 
          type="button"
          onClick={onCancel}
          className="studio-button-secondary-pill !py-3 flex-1 order-2 sm:order-1"
        >
          Cancelar
        </button>
        <button 
          type="submit"
          disabled={isLoading}
          className="bg-black text-white rounded-full px-8 py-3 flex-1"
        >
          {isLoading ? 'Guardando...' : 'Guardar Ajustes'}
        </button>
      </div>
    </form>
  );
};
