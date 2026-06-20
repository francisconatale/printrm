import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useGetPiezas } from '../../biblioteca/api/biblioteca.api';
import { useSaveProducto } from '../api/productos.api';
import { Modal } from '../../../components/ui/modal';
import { Package, Tag, Layers, AlertCircle, Plus, Calculator, Percent } from 'lucide-react';
import { ProductoCreate } from '../types/stock.types';

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
  preselectedParteId?: string;
}

export function ComposicionProductoModal({ isOpen, onClose, preselectedParteId }: ComposicionProductoModalProps) {
  const { data: piezas } = useGetPiezas();
  const { mutate: saveProducto, isPending: isSaving } = useSaveProducto();
  const [multiplicador, setMultiplicador] = React.useState(3);

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

  const selectedPartes = watch('parteIds') || [];

  React.useEffect(() => {
    if (preselectedParteId && piezas && isOpen) {
      const pieza = piezas.find(p => p.id === preselectedParteId);
      if (pieza) {
        setValue('nombre', pieza.nombre);
        setValue('parteIds', [preselectedParteId]);
      }
    }
  }, [preselectedParteId, piezas, setValue, isOpen]);

  const calculateTotalSuggested = React.useCallback(() => {
    if (!selectedPartes?.length || !piezas) return 0;
    
    let total = 0;
    selectedPartes.forEach(id => {
      const pieza = piezas.find(p => p.id === id);
      if (!pieza) return;
      
      total += (pieza.costoBase || 0) * multiplicador;
    });
    return Math.round(total);
  }, [selectedPartes, piezas, multiplicador]);

  // Update price when selection or multiplier changes
  React.useEffect(() => {
    const suggested = calculateTotalSuggested();
    if (suggested > 0) {
      setValue('precioSugerido', suggested);
    }
  }, [selectedPartes, multiplicador, calculateTotalSuggested, setValue]);

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
              <label htmlFor="prod-nombre" className="studio-caption font-semibold flex items-center gap-2">
                <Package size={14} aria-hidden="true" /> Nombre del Producto *
              </label>
              <input 
                id="prod-nombre"
                {...register('nombre')}
                className="w-full bg-white border border-[#e0e0e0] rounded-lg px-4 py-2 focus:ring-2 focus:ring-black outline-none transition-all"
                placeholder="Ej: Lámpara de Escritorio"
                required
              />
              {errors.nombre && <p className="text-red-500 text-xs">{errors.nombre.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="prod-precio" className="studio-caption font-semibold flex items-center gap-2">
                  <Tag size={14} aria-hidden="true" /> Precio Sugerido ($) *
                </label>
                <button 
                  type="button"
                  className="text-[10px] text-blue-600 font-bold hover:underline flex items-center gap-1"
                  onClick={() => {
                    setValue('precioSugerido', calculateTotalSuggested());
                  }}
                  aria-label="Recalcular precio sugerido"
                >
                  <Calculator size={10} aria-hidden="true" /> Recalcular
                </button>
              </div>
              <input 
                id="prod-precio"
                type="number"
                {...register('precioSugerido', { valueAsNumber: true })}
                className="w-full bg-white border border-[#e0e0e0] rounded-lg px-4 py-2 font-mono focus:ring-2 focus:ring-black outline-none"
                required
              />
              <p className="text-[10px] text-muted-foreground italic">
                Costo de producción × multiplicador.
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="prod-multiplicador" className="studio-caption font-semibold flex items-center gap-2">
                <Percent size={14} aria-hidden="true" /> Multiplicador de Ganancia
              </label>
              <div className="flex gap-2">
                <input
                  id="prod-multiplicador"
                  type="number"
                  min={1}
                  step={0.5}
                  value={multiplicador}
                  onChange={(e) => setMultiplicador(parseFloat(e.target.value) || 1)}
                  className="w-24 bg-white border border-[#e0e0e0] rounded-lg px-4 py-2 font-mono focus:ring-2 focus:ring-black outline-none"
                />
                <div className="flex gap-1">
                  {[2, 2.5, 3, 4].map(v => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setMultiplicador(v)}
                      className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all ${
                        multiplicador === v
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-zinc-600 border-[#e0e0e0] hover:border-zinc-400'
                      }`}
                    >
                      ×{v}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="prod-descripcion" className="studio-caption font-semibold">Descripción (Opcional)</label>
              <textarea 
                id="prod-descripcion"
                {...register('descripcion')}
                rows={3}
                className="w-full bg-white border border-[#e0e0e0] rounded-lg px-4 py-2 focus:ring-2 focus:ring-black outline-none transition-all resize-none"
                placeholder="Detalles del acabado, ensamble..."
              />
            </div>
          </div>

          <div className="space-y-2 flex flex-col h-full">
            <span className="studio-caption font-semibold flex items-center gap-2">
              <Layers size={14} aria-hidden="true" /> Partes (Archivos STL) *
            </span>
            <div className="flex-1 border border-border/50 rounded-xl overflow-y-auto max-h-[250px] bg-muted/5 p-2 custom-scrollbar">
              {piezas?.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center p-4 text-center opacity-40">
                  <AlertCircle size={20} aria-hidden="true" />
                  <p className="text-[10px] mt-1 uppercase font-bold">Biblioteca vacía</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {piezas?.map(pieza => (
                    <button 
                      key={pieza.id}
                      type="button"
                      onClick={() => toggleParte(pieza.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all text-left ${
                        selectedPartes.includes(pieza.id) 
                          ? 'bg-black text-white shadow-lg' 
                          : 'bg-white border border-transparent hover:border-zinc-200'
                      }`}
                      aria-label={`${selectedPartes.includes(pieza.id) ? 'Quitar' : 'Agregar'} pieza ${pieza.nombre}`}
                    >
                      <div className="truncate pr-2">
                        <p className="text-xs font-semibold truncate">{pieza.nombre}</p>
                        <p className={`text-[9px] ${selectedPartes.includes(pieza.id) ? 'text-zinc-400' : 'text-zinc-500'}`}>
                          {pieza.pesoGramos}g • {pieza.perfilFilamentoNombre}
                        </p>
                      </div>
                      <div className={`size-4 rounded-full border-2 flex items-center justify-center ${
                        selectedPartes.includes(pieza.id) ? 'border-white bg-white text-black' : 'border-zinc-200'
                      }`} aria-hidden="true">
                        {selectedPartes.includes(pieza.id) && <Plus size={10} />}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {errors.parteIds && <p className="text-red-500 text-xs mt-1">{errors.parteIds.message}</p>}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-[var(--studio-hairline)]">
          <button type="button" onClick={onClose} className="studio-button-secondary-pill">Cancelar</button>
          <button 
            type="submit" 
            disabled={isSaving || selectedPartes.length === 0 || !watch('nombre')} 
            className="studio-button-primary min-w-[140px] disabled:opacity-50 disabled:cursor-not-allowed"
            title={
              selectedPartes.length === 0 
                ? "Seleccioná al menos una pieza STL para armar el producto" 
                : !watch('nombre') 
                  ? "Ingresá un nombre para el producto antes de crearlo" 
                  : "Crear Producto"
            }
          >
            {isSaving ? 'Guardando...' : 'Crear Producto'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
