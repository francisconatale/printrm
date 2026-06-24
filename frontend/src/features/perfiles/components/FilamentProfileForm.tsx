import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FilamentProfile, FilamentProfileCreate } from '../types/perfiles.types';
import { MATERIAL_STANDARDS } from '../data/material-standards';
import { Save, X, Info, Palette } from 'lucide-react';

const PRESET_COLORS = [
  '#FF0000', '#CC0000', '#8B0000',
  '#FF4500', '#FF8C00', '#FFA500',
  '#FFD700', '#FFFF00', '#FFFACD',
  '#00FF00', '#228B22', '#006400',
  '#00FFFF', '#00CED1', '#008080',
  '#0000FF', '#00008B', '#000080',
  '#8A2BE2', '#800080', '#4B0082',
  '#FF69B4', '#FF1493', '#FFC0CB',
  '#FFFFFF', '#F5F5F5', '#D3D3D3',
  '#A9A9A9', '#808080', '#000000',
];

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
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FilamentProfileCreate>({
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

  const selectedMaterial = watch('material');
  const selectedColour = watch('colour');
  const colourInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!initialData && selectedMaterial && MATERIAL_STANDARDS[selectedMaterial]) {
      const standard = MATERIAL_STANDARDS[selectedMaterial];
      setValue('density', standard.density, { shouldValidate: true });
      setValue('diameter', standard.diameter, { shouldValidate: true });
    }
  }, [selectedMaterial, setValue, initialData]);

  const onInternalSubmit = (data: FilamentProfileCreate) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onInternalSubmit)} className="space-y-8">
      
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 md:gap-x-12 gap-y-6">
          <div className="col-span-full border-b border-[var(--border)] pb-2 mb-2 flex items-center gap-2">
            <h3 className="studio-caption-strong uppercase tracking-widest text-muted-foreground">Datos del Filamento</h3>
          </div>

          <div className="space-y-2">
            <label className="studio-caption font-semibold">Nombre del Perfil</label>
            <input 
              {...register('nombre')}
              className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-foreground outline-none transition-all"
              placeholder="Ej: PLA Grilon Rojo"
            />
            {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="studio-caption font-semibold">Material</label>
            <div className="relative">
              <select 
                {...register('material')}
                className="w-full bg-background border border-border rounded-lg px-4 py-2 appearance-none focus:ring-2 focus:ring-foreground outline-none"
              >
                {Object.keys(MATERIAL_STANDARDS).map(mat => (
                  <option key={mat} value={mat}>{mat}</option>
                ))}
                <option value="Otro">Otro</option>
              </select>
            </div>
            {errors.material && <p className="text-red-500 text-xs mt-1">{errors.material.message}</p>}
            {selectedMaterial && MATERIAL_STANDARDS[selectedMaterial] && (
              <div className="flex items-start gap-1.5 mt-1.5 text-muted-foreground">
                <Info size={10} className="mt-0.5" />
                <p className="text-[10px] leading-tight italic">
                  {MATERIAL_STANDARDS[selectedMaterial].description}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="studio-caption font-semibold">Costo por Kilogramo ($)</label>
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

          <div className="space-y-2">
            <label className="studio-caption font-semibold">Densidad (g/cm³)</label>
            <input 
              type="number"
              step="0.01"
              {...register('density', { valueAsNumber: true })}
              className="w-full bg-background border border-border rounded-lg px-4 py-2 font-mono focus:ring-2 focus:ring-foreground outline-none"
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
              className="w-full bg-background border border-border rounded-lg px-4 py-2 font-mono focus:ring-2 focus:ring-foreground outline-none"
              placeholder="Ej: 1.75"
            />
            {errors.diameter && <p className="text-red-500 text-xs mt-1">{errors.diameter.message}</p>}
          </div>

          <div className="space-y-2 col-span-full">
            <label className="studio-caption font-semibold">Color del Filamento</label>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setValue('colour', c, { shouldValidate: true })}
                  className={`size-7 rounded-full border-2 transition-all hover:scale-110 active:scale-95 ${
                    selectedColour?.toUpperCase() === c.toUpperCase()
                      ? 'border-foreground scale-110 ring-2 ring-foreground/20'
                      : 'border-border'
                  }`}
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
              <button
                type="button"
                onClick={() => colourInputRef.current?.click()}
                className={`size-7 rounded-full border-2 border-dashed border-border flex items-center justify-center hover:border-foreground/30 transition-all hover:scale-110 active:scale-95 ${
                  !PRESET_COLORS.some(c => c.toUpperCase() === selectedColour?.toUpperCase())
                    ? 'border-foreground ring-2 ring-foreground/20'
                    : ''
                }`}
                title="Color personalizado"
              >
                <Palette size={12} className="text-muted-foreground" />
              </button>
            </div>
            <div className="flex gap-3 items-center mt-2">
              <input
                ref={colourInputRef}
                type="color"
                value={selectedColour || '#FF0000'}
                onChange={(e) => setValue('colour', e.target.value, { shouldValidate: true })}
                className="size-10 bg-background border border-border rounded-lg p-1 cursor-pointer hidden"
              />
              <input
                {...register('colour')}
                className="flex-1 bg-background border border-border rounded-lg px-4 py-2 font-mono uppercase focus:ring-2 focus:ring-foreground outline-none"
                placeholder="#FF0000"
              />
            </div>
            {errors.colour && <p className="text-red-500 text-xs mt-1">{errors.colour.message}</p>}
          </div>
        </div>
      

      <div className="pt-6 pb-2 mt-8 border-t border-[var(--border)] flex flex-col sm:flex-row gap-4">
        <button 
          type="button"
          onClick={onCancel}
          className="studio-button-secondary-pill flex-1 order-2 sm:order-1 gap-2 bg-transparent text-black border border-foreground hover:bg-muted transition-colors"
        >
          <X size={18} />
          Cancelar
        </button>
        <button 
          type="submit"
          disabled={isLoading}
          className="studio-button-primary flex-1 order-1 sm:order-2 gap-2 bg-black text-white hover:bg-zinc-800 transition-colors"
        >
          {isLoading ? (
            'Guardando...'
          ) : (
            <>
              <Save size={18} />
              Guardar Filamento
            </>
          )}
        </button>
      </div>
    </form>
  );
};
