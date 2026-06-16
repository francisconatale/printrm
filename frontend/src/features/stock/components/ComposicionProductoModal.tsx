import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useGetPiezas } from '../../biblioteca/api/biblioteca.api';
import { useSaveProducto } from '../api/productos.api';
import { Modal } from '../../../components/ui/modal';
import { Package, Tag, Layers, AlertCircle, Plus, Calculator, Loader2 } from 'lucide-react';
import { ProductoCreate } from '../types/stock.types';
import { useCalculo } from '../../calculo/hooks/useCalculo';
import { useGetPerfiles, useGetFilamentProfiles } from '../../perfiles/api/perfiles.api';
import { useAjustes } from '../../ajustes/hooks/useAjustes';

const productoSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio").max(100),
  descripcion: z.string().optional(),
  precioSugerido: z.number().min(0, "El precio no puede ser negativo"),
  cantidadStock: z.number().min(0).default(0),
  parteIds: z.array(z.string()).min(1, "Debes seleccionar al menos una pieza STL"),
});

interface ComposicionProductoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ComposicionProductoModal({ isOpen, onClose }: ComposicionProductoModalProps) {
  const { data: piezas } = useGetPiezas();
  const { data: printers } = useGetPerfiles();
  const { mutate: saveProducto, isPending: isSaving } = useSaveProducto();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ProductoCreate>({
    resolver: zodResolver(productoSchema),
    defaultValues: {
      nombre: '',
      descripcion: '',
      precioSugerido: 0,
      cantidadStock: 0,
      parteIds: [],
    }
  });

  const selectedPartes = watch('parteIds');

  // TRIGGER BACKEND CALCULATION FOR PRICE SUGGESTION
  // In a real scenario, we'd loop through selected parts and sum their backend costs.
  // For simplicity and performance, we'll sum the pieces' metadata which already contains the current backend-calculated costoBase.
  const calculateTotalSuggested = React.useCallback(() => {
    if (!selectedPartes.length || !piezas) return 0;
    
    let total = 0;
    selectedPartes.forEach(id => {
      const pieza = piezas.find(p => p.id === id);
      if (!pieza) return;
      
      // Every piece in the library now has a costoBase calculated by the backend upon save/refresh
      total += (pieza.costoBase || 0) * 3; // Default multiplier 3
    });
    return Math.round(total);
  }, [selectedPartes, piezas]);

  // Update price when selection changes
  React.useEffect(() => {
    const suggested = calculateTotalSuggested();
    if (suggested > 0) {
      setValue('precioSugerido', suggested);
    }
  }, [selectedPartes, calculateTotalSuggested, setValue]);

  const toggleParte = (id: string) => {
    const current = [...selectedPartes];
    const index = current.indexOf(id);
    if (index > -1) current.splice(index, 1);
    else current.push(id);
    setValue('parteIds', current, { shouldValidate: true });
  };

  const onSubmit = (data: ProductoCreate) => {
    saveProducto(data, {
      onSuccess: () => onClose()
    });
  };

  return (
    <Modal
      title="Nuevo Producto de Catálogo"
      description="Agrupá tus piezas STL para crear un producto vendible con stock propio."
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="studio-caption font-semibold flex items-center gap-2">
                <Package size={14} /> Nombre del Producto
              </label>
              <input 
                {...register('nombre')}
                className="w-full bg-white border border-[#e0e0e0] rounded-lg px-4 py-2 focus:ring-2 focus:ring-black outline-none transition-all"
                placeholder="Ej: Lámpara de Escritorio"
              />
              {errors.nombre && <p className="text-red-500 text-xs">{errors.nombre.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="studio-caption font-semibold flex items-center gap-2">
                  <Tag size={14} /> Precio Sugerido ($)
                </label>
                <button 
                  type="button"
                  className="text-[10px] text-blue-600 font-bold hover:underline flex items-center gap-1"
                  onClick={() => {
                    setValue('precioSugerido', calculateTotalSuggested());
                  }}
                >
                  <Calculator size={10} /> Recalcular
                </button>
              </div>
              <input 
                type="number"
                {...register('precioSugerido', { valueAsNumber: true })}
                className="w-full bg-white border border-[#e0e0e0] rounded-lg px-4 py-2 font-mono focus:ring-2 focus:ring-black outline-none"
              />
              <p className="text-[10px] text-muted-foreground italic">
                Sugerencia basada en costos de producción (API) + margen.
              </p>
            </div>

            <div className="space-y-2">
              <label className="studio-caption font-semibold">Descripción (Opcional)</label>
              <textarea 
                {...register('descripcion')}
                rows={3}
                className="w-full bg-white border border-[#e0e0e0] rounded-lg px-4 py-2 focus:ring-2 focus:ring-black outline-none transition-all resize-none"
                placeholder="Detalles del acabado, ensamble..."
              />
            </div>
          </div>

          <div className="space-y-2 flex flex-col h-full">
            <label className="studio-caption font-semibold flex items-center gap-2">
              <Layers size={14} /> Partes (Archivos STL) *
            </label>
            <div className="flex-1 border border-border/50 rounded-xl overflow-y-auto max-h-[250px] bg-muted/5 p-2 custom-scrollbar">
              {piezas?.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center p-4 text-center opacity-40">
                  <AlertCircle size={20} />
                  <p className="text-[10px] mt-1 uppercase font-bold">Biblioteca vacía</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {piezas?.map(pieza => (
                    <div 
                      key={pieza.id}
                      onClick={() => toggleParte(pieza.id)}
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                        selectedPartes.includes(pieza.id) 
                          ? 'bg-black text-white shadow-lg' 
                          : 'bg-white border border-transparent hover:border-zinc-200'
                      }`}
                    >
                      <div className="truncate pr-2">
                        <p className="text-xs font-semibold truncate">{pieza.nombre}</p>
                        <p className={`text-[9px] ${selectedPartes.includes(pieza.id) ? 'text-zinc-400' : 'text-zinc-500'}`}>
                          {pieza.pesoGramos}g • {pieza.perfilFilamentoNombre}
                        </p>
                      </div>
                      <div className={`size-4 rounded-full border-2 flex items-center justify-center ${
                        selectedPartes.includes(pieza.id) ? 'border-white bg-white text-black' : 'border-zinc-200'
                      }`}>
                        {selectedPartes.includes(pieza.id) && <Plus size={10} />}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {errors.parteIds && <p className="text-red-500 text-xs mt-1">{errors.parteIds.message}</p>}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-[var(--studio-hairline)]">
          <button type="button" onClick={onClose} className="studio-button-secondary-pill">Cancelar</button>
          <button type="submit" disabled={isSaving} className="studio-button-primary min-w-[140px]">
            {isSaving ? 'Guardando...' : 'Crear Producto'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
