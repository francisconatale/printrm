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
  consumoW: z.number().min(0),
  vidaUtilHoras: z.number().min(1),
  costoRepuestos: z.number().min(0),
  filamentoPorKg: z.number().min(0),
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

export const PerfilForm: React.FC<PerfilFormProps> = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<PerfilCreate>({
    resolver: zodResolver(perfilSchema),
    defaultValues: initialData || {
      nombre: '',
      modeloImpresora: 'Prusa MK4',
      consumoW: 120,
      vidaUtilHoras: 5000,
      costoRepuestos: 25000,
      filamentoPorKg: 15000,
      nozzleDiameter: 0.4,
      bedShape: '250x210',
      maxPrintHeight: 220,
    }
  });

  const selectedModelo = watch('modeloImpresora');

  React.useEffect(() => {
    const modelo = MODELOS_IMPRESORA.find(m => m.nombre === selectedModelo);
    if (modelo && !initialData) {
      setValue('consumoW', modelo.consumoW);
      setValue('vidaUtilHoras', modelo.vidaUtilHoras);
      setValue('costoRepuestos', modelo.costoRepuestos);
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

  const onInternalSubmit = (data: PerfilCreate) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onInternalSubmit)} className="flex flex-col h-full max-h-[80vh]">
      <div className="flex-1 overflow-y-auto px-1 py-2 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 md:gap-x-12 gap-y-6">
          <div className="col-span-full border-b border-[var(--border-subtle)] pb-2 mb-2 flex items-center gap-2">
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

          <div className="space-y-2">
            <label className="studio-caption font-semibold">Consumo Promedio (W)</label>
            <div className="relative">
              <input 
                type="number"
                {...register('consumoW', { valueAsNumber: true })}
                className="w-full bg-background border border-border rounded-lg px-4 py-2 font-mono focus:ring-2 focus:ring-foreground outline-none"
              />
              <span className="absolute right-3 top-2 text-[10px] font-bold text-muted-foreground">WATTS</span>
            </div>
            {errors.consumoW && <p className="text-red-500 text-xs mt-1">{errors.consumoW.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="studio-caption font-semibold">Vida Útil (Horas)</label>
            <div className="relative">
              <input 
                type="number"
                {...register('vidaUtilHoras', { valueAsNumber: true })}
                className="w-full bg-background border border-border rounded-lg px-4 py-2 font-mono focus:ring-2 focus:ring-foreground outline-none"
              />
              <span className="absolute right-3 top-2 text-[10px] font-bold text-muted-foreground">HS</span>
            </div>
            {errors.vidaUtilHoras && <p className="text-red-500 text-xs mt-1">{errors.vidaUtilHoras.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="studio-caption font-semibold">Costo Repuestos ($)</label>
            <div className="relative">
              <input 
                type="number"
                {...register('costoRepuestos', { valueAsNumber: true })}
                className="w-full bg-background border border-border rounded-lg px-4 py-2 font-mono focus:ring-2 focus:ring-foreground outline-none"
              />
              <span className="absolute right-3 top-2 text-[10px] font-bold text-muted-foreground">ARS</span>
            </div>
            {errors.costoRepuestos && <p className="text-red-500 text-xs mt-1">{errors.costoRepuestos.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="studio-caption font-semibold">Costo Filamento ($ / kg)</label>
            <div className="relative">
              <input 
                type="number"
                {...register('filamentoPorKg', { valueAsNumber: true })}
                className="w-full bg-background border border-border rounded-lg px-4 py-2 font-mono focus:ring-2 focus:ring-foreground outline-none"
              />
              <span className="absolute right-3 top-2 text-[10px] font-bold text-muted-foreground">ARS/KG</span>
            </div>
            {errors.filamentoPorKg && <p className="text-red-500 text-xs mt-1">{errors.filamentoPorKg.message}</p>}
          </div>

          <div className="col-span-full border-b border-[var(--border-subtle)] pb-2 mt-4 mb-2 flex items-center gap-2">
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
      </div>

      <div className="sticky bottom-0 bg-background pt-6 pb-2 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row gap-4 z-20 mt-auto">
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
