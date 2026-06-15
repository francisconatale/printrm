import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Perfil, PerfilCreate } from '../types/perfiles.types';
import { MODELOS_IMPRESORA } from '../data/modelos-impresora';
import { useGetSlicerConfigs } from '../api/perfiles.api';

const perfilSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio").max(50),
  modeloImpresora: z.string().min(1),
  consumoW: z.number().min(0),
  printConfig: z.string().optional(),
  filamentConfig: z.string().optional(),
  printerConfig: z.string().optional(),
});

interface PerfilFormProps {
  initialData?: Perfil | null;
  onSubmit: (data: PerfilCreate) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const PerfilForm: React.FC<PerfilFormProps> = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const { data: slicerConfigs } = useGetSlicerConfigs();
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<PerfilCreate>({
    resolver: zodResolver(perfilSchema),
    defaultValues: initialData || {
      nombre: '',
      modeloImpresora: 'Prusa MK4',
      consumoW: 120,
      printConfig: '',
      filamentConfig: '',
      printerConfig: '',
    }
  });

  const selectedModelo = watch('modeloImpresora');

  React.useEffect(() => {
    const modelo = MODELOS_IMPRESORA.find(m => m.nombre === selectedModelo);
    if (modelo && !initialData) {
      setValue('consumoW', modelo.consumoW);
    }
  }, [selectedModelo, setValue, initialData]);

  const onInternalSubmit = (data: PerfilCreate) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onInternalSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 md:gap-x-12 gap-y-6">
        <div className="col-span-full border-b border-[#f0f0f0] pb-2 mb-2">
          <h3 className="studio-caption-strong uppercase tracking-widest text-[#7a7a7a]">Datos Generales</h3>
        </div>

        <div className="space-y-2">
          <label className="studio-caption font-semibold">Nombre del Perfil</label>
          <input 
            {...register('nombre')}
            className="w-full bg-white border border-[#e0e0e0] rounded-lg px-4 py-2"
            placeholder="Ej: MK4 - Trabajo"
          />
          {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="studio-caption font-semibold">Modelo de Impresora</label>
          <select 
            {...register('modeloImpresora')}
            className="w-full bg-white border border-[#e0e0e0] rounded-lg px-4 py-2"
          >
            {MODELOS_IMPRESORA.map(m => (
              <option key={m.nombre} value={m.nombre}>{m.nombre}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="studio-caption font-semibold">Consumo Promedio (W)</label>
          <div className="relative">
            <input 
              type="number"
              {...register('consumoW', { valueAsNumber: true })}
              className="w-full bg-white border border-[#e0e0e0] rounded-lg px-4 py-2 font-mono"
            />
            <span className="absolute right-3 top-2 text-[10px] font-bold text-[#7a7a7a]">WATTS</span>
          </div>
        </div>

        <div className="col-span-full border-b border-[#f0f0f0] pb-2 mt-4 mb-2">
          <h3 className="studio-caption-strong uppercase tracking-widest text-[#7a7a7a]">Slicer Automático (.ini)</h3>
        </div>

        <div className="space-y-2">
          <label className="studio-caption font-semibold">Configuración de Impresión</label>
          <select 
            {...register('printConfig')}
            className="w-full bg-white border border-[#e0e0e0] rounded-lg px-4 py-2"
          >
            <option value="">-- Seleccionar --</option>
            {slicerConfigs?.print.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="studio-caption font-semibold">Configuración de Filamento</label>
          <select 
            {...register('filamentConfig')}
            className="w-full bg-white border border-[#e0e0e0] rounded-lg px-4 py-2"
          >
            <option value="">-- Seleccionar --</option>
            {slicerConfigs?.filament.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="studio-caption font-semibold">Configuración de Impresora</label>
          <select 
            {...register('printerConfig')}
            className="w-full bg-white border border-[#e0e0e0] rounded-lg px-4 py-2"
          >
            <option value="">-- Seleccionar --</option>
            {slicerConfigs?.printer.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
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
          {isLoading ? 'Guardando...' : 'Guardar Perfil'}
        </button>
      </div>
    </form>
  );
};
