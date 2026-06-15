import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FilamentProfile, FilamentProfileCreate } from '../types/perfiles.types';

const filamentSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio").max(50),
  material: z.string().min(1, "El material es obligatorio"),
  filamentoPorKg: z.number().min(0, "Costo no puede ser negativo"),
  density: z.number().min(0.1, "Densidad mínima 0.1").max(5.0, "Densidad máxima 5.0"),
  diameter: z.number().min(0.5, "Diámetro mínimo 0.5 mm").max(5.0, "Diámetro máximo 5.0 mm"),
  colour: z.string().min(4).max(7).regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Debe ser un color hexadecimal válido"),
});

interface FilamentProfileFormProps {
  initialData?: FilamentProfile | null;
  onSubmit: (data: FilamentProfileCreate) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const FilamentProfileForm: React.FC<FilamentProfileFormProps> = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<FilamentProfileCreate>({
    resolver: zodResolver(filamentSchema),
    defaultValues: initialData || {
      nombre: '',
      material: 'PLA',
      filamentoPorKg: 15000,
      density: 1.24,
      diameter: 1.75,
      colour: '#FF0000',
    }
  });

  const onInternalSubmit = (data: FilamentProfileCreate) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onInternalSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 md:gap-x-12 gap-y-6">
        <div className="col-span-full border-b border-[#f0f0f0] pb-2 mb-2">
          <h3 className="studio-caption-strong uppercase tracking-widest text-[#7a7a7a]">Datos del Filamento</h3>
        </div>

        <div className="space-y-2">
          <label className="studio-caption font-semibold">Nombre del Perfil</label>
          <input 
            {...register('nombre')}
            className="w-full bg-white border border-[#e0e0e0] rounded-lg px-4 py-2"
            placeholder="Ej: PLA Grilon Rojo"
          />
          {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="studio-caption font-semibold">Material</label>
          <select 
            {...register('material')}
            className="w-full bg-white border border-[#e0e0e0] rounded-lg px-4 py-2"
          >
            <option value="PLA">PLA</option>
            <option value="ABS">ABS</option>
            <option value="PETG">PETG</option>
            <option value="TPU">TPU</option>
            <option value="Nylon">Nylon</option>
            <option value="Flex">Flex</option>
            <option value="Otro">Otro</option>
          </select>
          {errors.material && <p className="text-red-500 text-xs mt-1">{errors.material.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="studio-caption font-semibold">Costo por Kilogramo ($)</label>
          <div className="relative">
            <input 
              type="number"
              {...register('filamentoPorKg', { valueAsNumber: true })}
              className="w-full bg-white border border-[#e0e0e0] rounded-lg px-4 py-2 font-mono"
            />
            <span className="absolute right-3 top-2 text-[10px] font-bold text-[#7a7a7a]">ARS/KG</span>
          </div>
          {errors.filamentoPorKg && <p className="text-red-500 text-xs mt-1">{errors.filamentoPorKg.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="studio-caption font-semibold">Densidad (g/cm³)</label>
          <input 
            type="number"
            step="0.01"
            {...register('density', { valueAsNumber: true })}
            className="w-full bg-white border border-[#e0e0e0] rounded-lg px-4 py-2 font-mono"
            placeholder="Ej: 1.24"
          />
          {errors.density && <p className="text-red-500 text-xs mt-1">{errors.density.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="studio-caption font-semibold">Diámetro (mm)</label>
          <input 
            type="number"
            step="0.01"
            {...register('diameter', { valueAsNumber: true })}
            className="w-full bg-white border border-[#e0e0e0] rounded-lg px-4 py-2 font-mono"
            placeholder="Ej: 1.75"
          />
          {errors.diameter && <p className="text-red-500 text-xs mt-1">{errors.diameter.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="studio-caption font-semibold">Color del Filamento (Hex)</label>
          <div className="flex gap-3 items-center">
            <input 
              type="color"
              {...register('colour')}
              className="size-10 bg-white border border-[#e0e0e0] rounded-lg p-1 cursor-pointer"
            />
            <input 
              {...register('colour')}
              className="flex-1 bg-white border border-[#e0e0e0] rounded-lg px-4 py-2 font-mono uppercase"
              placeholder="#FF0000"
            />
          </div>
          {errors.colour && <p className="text-red-500 text-xs mt-1">{errors.colour.message}</p>}
        </div>

      </div>

      <div className="sticky bottom-0 bg-white pt-6 pb-2 mt-8 border-t border-[#f0f0f0] flex flex-col sm:flex-row gap-4 z-20">
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
          {isLoading ? 'Guardando...' : 'Guardar Filamento'}
        </button>
      </div>
    </form>
  );
};
