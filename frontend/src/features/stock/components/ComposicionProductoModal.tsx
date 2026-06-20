import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useGetPiezas } from '../../biblioteca/api/biblioteca.api';
import { useSaveProducto } from '../api/productos.api';
import { Modal } from '../../../components/ui/modal';
import { CuboidIcon as Cube, Weight, Shirt, Check, Plus } from 'lucide-react';
import { ProductoCreate } from '../types/stock.types';

const productoSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio").max(100),
  descripcion: z.string().optional(),
  precioSugerido: z.number().min(0).optional().default(0),
  cantidadStock: z.number().min(0).default(0),
  parteIds: z.array(z.string()).min(1, "Debes seleccionar al menos una pieza STL"),
});

interface ComposicionProductoModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedParteId?: string;
}

const formatWeight = (grams?: number) => {
  if (!grams) return '—';
  if (grams >= 1000) return `${(grams / 1000).toFixed(1)}kg`;
  return `${grams}g`;
};

export function ComposicionProductoModal({ isOpen, onClose, preselectedParteId }: ComposicionProductoModalProps) {
  const { data: piezas } = useGetPiezas();
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

  const selectedPiezasData = piezas?.filter(p => selectedPartes.includes(p.id)) || [];
  const totalWeight = selectedPiezasData.reduce((sum, p) => sum + (p.pesoGramos || 0), 0);

  return (
    <Modal
      title="Nuevo Producto de Catálogo"
      description="Agrupá tus piezas STL para crear un producto vendible con stock propio."
      isOpen={isOpen}
      onClose={onClose}
      size="3xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-6">
          {/* Columna izquierda: Información */}
          <div className="sm:col-span-2 space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="prod-nombre" className="text-[13px] font-medium text-zinc-600 dark:text-zinc-400">
                Nombre <span className="text-red-400">*</span>
              </label>
              <input
                id="prod-nombre"
                {...register('nombre')}
                className="w-full bg-transparent border-b-2 border-zinc-200 dark:border-zinc-700 px-0 py-1.5 text-base font-medium text-zinc-900 dark:text-zinc-100 focus:border-primary dark:focus:border-primary outline-none transition-colors placeholder:text-zinc-300 dark:placeholder:text-zinc-600"
                placeholder="Ej: Lámpara de Escritorio"
                required
              />
              {errors.nombre && <p className="text-red-500 text-xs">{errors.nombre.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="prod-descripcion" className="text-[13px] font-medium text-zinc-600 dark:text-zinc-400">Descripción</label>
              <textarea
                id="prod-descripcion"
                {...register('descripcion')}
                rows={4}
                className="w-full bg-transparent border-b-2 border-zinc-200 dark:border-zinc-700 px-0 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 focus:border-primary dark:focus:border-primary outline-none transition-colors resize-none placeholder:text-zinc-300 dark:placeholder:text-zinc-600"
                placeholder="Acabado, instrucciones de ensamble..."
              />
            </div>
          </div>

          {/* Columna derecha: STL List */}
          <div className="sm:col-span-3">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px] font-medium text-zinc-600 dark:text-zinc-400">
                Piezas STL <span className="text-red-400">*</span>
              </span>
              {selectedPartes.length > 0 && (
                <span className="text-[11px] font-semibold text-primary dark:text-primary">
                  {selectedPartes.length} de {piezas?.length || 0}
                </span>
              )}
            </div>

            <div className="border border-zinc-200/60 dark:border-zinc-800/50 rounded-2xl overflow-hidden bg-white dark:bg-zinc-950/50 max-h-[340px] overflow-y-auto custom-scrollbar">
              {!piezas || piezas.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-14 text-center">
                  <div className="size-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-3">
                    <Cube size={22} className="text-zinc-300 dark:text-zinc-600" />
                  </div>
                  <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Sin piezas disponibles</p>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">Subí archivos STL primero.</p>
                </div>
              ) : (
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800/40">
                  {piezas?.map(pieza => {
                    const isSelected = selectedPartes.includes(pieza.id);
                    return (
                      <button
                        key={pieza.id}
                        type="button"
                        onClick={() => toggleParte(pieza.id)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 transition-all text-left ${
                          isSelected
                            ? 'bg-primary dark:bg-primary'
                            : 'hover:bg-zinc-50 dark:hover:bg-zinc-900/40'
                        }`}
                        aria-label={`${isSelected ? 'Quitar' : 'Agregar'} ${pieza.nombre}`}
                      >
                        <div className={`size-5 rounded flex items-center justify-center shrink-0 transition-all ${
                          isSelected
                            ? 'bg-white dark:bg-zinc-900'
                            : 'border-2 border-zinc-200 dark:border-zinc-700'
                        }`} aria-hidden="true">
                          {isSelected && <Check size={12} className="text-primary dark:text-primary" strokeWidth={3} />}
                        </div>

                        <div className="size-9 shrink-0 rounded-lg bg-[#f5f5f7] dark:bg-zinc-900 border border-zinc-200/40 dark:border-zinc-800/40 overflow-hidden flex items-center justify-center">
                          {pieza.imagenBase64 ? (
                            <img src={pieza.imagenBase64} alt="" className="w-full h-full object-contain p-0.5" />
                          ) : (
                            <Cube size={14} className="text-zinc-300 dark:text-zinc-600" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className={`text-[13px] font-semibold truncate leading-tight ${
                              isSelected ? 'text-primary-foreground' : 'text-zinc-800 dark:text-zinc-200'
                          }`}>
                            {pieza.nombre}
                          </p>
                          <p className="flex items-center gap-1.5 mt-0.5">
                            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                              isSelected
                                ? 'bg-primary-foreground/15 text-primary-foreground'
                                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
                            }`}>
                              {formatWeight(pieza.pesoGramos)}
                            </span>
                            <span className={`text-[10px] ${isSelected ? 'text-primary-foreground/50' : 'text-zinc-400 dark:text-zinc-500'}`}>
                              {pieza.perfilFilamentoNombre || 'Sin filamento'}
                            </span>
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
              {errors.parteIds && <p className="text-red-500 text-xs px-4 py-2">{errors.parteIds.message}</p>}
            </div>
          </div>
        </div>

        {/* Resumen + Actions */}
        <div className="mt-8 pt-5 border-t border-zinc-200/60 dark:border-zinc-800/50">
          {selectedPiezasData.length > 0 && (
            <div className="flex items-center gap-4 mb-5 text-sm text-zinc-500 dark:text-zinc-400">
              <span className="flex items-center gap-1.5">
                <span className="font-semibold text-primary dark:text-primary">{selectedPiezasData.length}</span>
                {selectedPiezasData.length === 1 ? 'pieza' : 'piezas'}
              </span>
              <span className="text-zinc-300 dark:text-zinc-700">/</span>
              <span className="flex items-center gap-1.5">
                <span className="font-semibold text-primary dark:text-primary">{formatWeight(totalWeight)}</span>
                peso total
              </span>
            </div>
          )}

          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={isSaving || selectedPartes.length === 0 || !watch('nombre')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              {isSaving ? 'Guardando...' : (
                <>
                  <Plus size={15} strokeWidth={2.5} />
                  Crear Producto
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
