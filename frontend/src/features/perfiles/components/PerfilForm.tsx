import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Perfil, PerfilCreate } from '../types/perfiles.types';
import { MODELOS_IMPRESORA } from '../data/modelos-impresora';
import { useGetSlicerConfigs } from '../api/perfiles.api';

const perfilSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio").max(50),
  filamentoPorKg: z.number().min(0),
  preciokWh: z.number().min(0),
  modeloImpresora: z.string().min(1),
  consumoW: z.number().min(0),
  vidaUtilHoras: z.number().min(0),
  costoRepuestos: z.number().min(0),
  margenError: z.number().min(0).max(100),
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
      filamentoPorKg: 15000,
      preciokWh: 50,
      modeloImpresora: 'Prusa MK4',
      consumoW: 120,
      vidaUtilHoras: 5000,
      costoRepuestos: 25000,
      margenError: 10,
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 md:gap-x-12 gap-y-6">
        <div className="col-span-full border-b border-[#f0f0f0] pb-2 mb-2">
          <h3 className="studio-caption-strong uppercase tracking-widest text-[#7a7a7a]">Datos Generales</h3>
        </div>

        <div className="space-y-2">
          <label className="studio-caption font-semibold">Nombre del Perfil</label>
          <input 
            {...register('nombre')}
            className="w-full bg-white border border-[#e0e0e0] rounded-lg px-4 py-2 studio-body !text-[15px] outline-none focus:border-[#1d1d1f]"
            placeholder="Ej: MK4 - Trabajo"
          />
          {errors.nombre && <p className="text-red-500 text-[10px] uppercase font-bold">{errors.nombre.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="studio-caption font-semibold">Modelo de Impresora</label>
          <select 
            {...register('modeloImpresora')}
            className="w-full bg-white border border-[#e0e0e0] rounded-lg px-4 py-2 studio-body !text-[15px] outline-none focus:border-[#1d1d1f] appearance-none"
          >
            {MODELOS_IMPRESORA.map(m => (
              <option key={m.nombre} value={m.nombre}>{m.nombre}</option>
            ))}
          </select>
        </div>

        <div className="col-span-full border-b border-[#f0f0f0] pb-2 mt-4 mb-2">
          <h3 className="studio-caption-strong uppercase tracking-widest text-[#7a7a7a]">Costos e Insumos</h3>
        </div>

        <div className="space-y-2">
          <label className="studio-caption font-semibold">Filamento ($ / kg)</label>
          <input 
            type="number" step="any"
            {...register('filamentoPorKg', { valueAsNumber: true })}
            className="w-full bg-white border border-[#e0e0e0] rounded-lg px-4 py-2 studio-body !text-[15px] font-mono outline-none focus:border-[#1d1d1f]"
          />
        </div>

        <div className="space-y-2">
          <label className="studio-caption font-semibold">Costo Energía ($ / kWh)</label>
          <input 
            type="number" step="any"
            {...register('preciokWh', { valueAsNumber: true })}
            className="w-full bg-white border border-[#e0e0e0] rounded-lg px-4 py-2 studio-body !text-[15px] font-mono outline-none focus:border-[#1d1d1f]"
          />
        </div>

        <div className="space-y-2">
          <label className="studio-caption font-semibold">Consumo Promedio (W)</label>
          <input 
            type="number"
            {...register('consumoW', { valueAsNumber: true })}
            className="w-full bg-white border border-[#e0e0e0] rounded-lg px-4 py-2 studio-body !text-[15px] font-mono outline-none focus:border-[#1d1d1f]"
          />
        </div>

        <div className="space-y-2">
          <label className="studio-caption font-semibold">Vida Útil (Horas)</label>
          <input 
            type="number"
            {...register('vidaUtilHoras', { valueAsNumber: true })}
            className="w-full bg-white border border-[#e0e0e0] rounded-lg px-4 py-2 studio-body !text-[15px] font-mono outline-none focus:border-[#1d1d1f]"
          />
        </div>

        <div className="space-y-2">
          <label className="studio-caption font-semibold">Costo de Repuestos ($)</label>
          <input 
            type="number" step="any"
            {...register('costoRepuestos', { valueAsNumber: true })}
            className="w-full bg-white border border-[#e0e0e0] rounded-lg px-4 py-2 studio-body !text-[15px] font-mono outline-none focus:border-[#1d1d1f]"
          />
        </div>

        <div className="space-y-2">
          <label className="studio-caption font-semibold">Margen de Error (%)</label>
          <input 
            type="number"
            {...register('margenError', { valueAsNumber: true })}
            className="w-full bg-white border border-[#e0e0e0] rounded-lg px-4 py-2 studio-body !text-[15px] font-mono outline-none focus:border-[#1d1d1f]"
          />
        </div>

        <div className="col-span-full border-b border-[#f0f0f0] pb-2 mt-4 mb-2">
          <h3 className="studio-caption-strong uppercase tracking-widest text-[#7a7a7a]">Slicer Automático (.ini)</h3>
        </div>

        <div className="space-y-2">
          <label className="studio-caption font-semibold">Configuración de Impresión</label>
          <select 
            {...register('printConfig')}
            className="w-full bg-white border border-[#e0e0e0] rounded-lg px-4 py-2 studio-body !text-[15px] outline-none focus:border-[#1d1d1f] appearance-none"
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
            className="w-full bg-white border border-[#e0e0e0] rounded-lg px-4 py-2 studio-body !text-[15px] outline-none focus:border-[#1d1d1f] appearance-none"
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
            className="w-full bg-white border border-[#e0e0e0] rounded-lg px-4 py-2 studio-body !text-[15px] outline-none focus:border-[#1d1d1f] appearance-none"
          >
            <option value="">-- Seleccionar --</option>
            {slicerConfigs?.printer.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-[#f0f0f0]">
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
          className="studio-button-primary !py-3 flex-1 disabled:opacity-50 order-1 sm:order-2"
        >
          {isLoading ? 'Guardando...' : 'Guardar Perfil'}
        </button>
      </div>
    </form>
  );
};
