import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useGetPiezas } from '../../biblioteca/api/biblioteca.api';
import { useSaveProducto } from '../api/productos.api';
import { Modal } from '../../../components/ui/modal';
import { CuboidIcon as Cube, Check, Plus, Tag } from 'lucide-react';
import { ProductoCreate } from '../types/stock.types';
import { useAjustes } from '../../ajustes/hooks/useAjustes';

const productoSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio").max(100),
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
  const { ajustes } = useAjustes();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ProductoCreate>({
    resolver: zodResolver(productoSchema),
    defaultValues: {
      nombre: '',
      precioSugerido: 0,
      cantidadStock: 0,
      parteIds: [],
    }
  });

  const selectedPartes = watch('parteIds') || [];

  const selectedPiezasData = React.useMemo(() => {
    return piezas?.filter(p => selectedPartes.includes(p.id)) || [];
  }, [piezas, selectedPartes]);

  React.useEffect(() => {
    if (preselectedParteId && piezas && isOpen) {
      const pieza = piezas.find(p => p.id === preselectedParteId);
      if (pieza) {
        setValue('nombre', pieza.nombre);
        setValue('parteIds', [preselectedParteId]);
      }
    }
  }, [preselectedParteId, piezas, setValue, isOpen]);

  React.useEffect(() => {
    const totalCostoBase = selectedPiezasData.reduce((sum, p) => sum + (p.costoBase || 0), 0);
    const multiplier = 2;
    setValue('precioSugerido', Math.round(totalCostoBase * multiplier));
  }, [selectedPiezasData, ajustes, setValue]);

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
              <label htmlFor="prod-precio" className="text-[13px] font-medium text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5">
                <Tag size={13} className="text-muted-foreground" />
                Precio de Venta
              </label>
              <div className="flex items-center border-b-2 border-zinc-200 dark:border-zinc-700 focus-within:border-primary dark:focus-within:border-primary transition-colors">
                <span className="text-sm font-medium text-zinc-400 dark:text-zinc-500 pr-1.5 select-none">$</span>
                <input
                  id="prod-precio"
                  type="number"
                  min="0"
                  step="1"
                  {...register('precioSugerido', { valueAsNumber: true })}
                  className="w-full bg-transparent py-1.5 text-base font-medium text-zinc-900 dark:text-zinc-100 outline-none placeholder:text-zinc-300 dark:placeholder:text-zinc-600"
                  placeholder="0"
                />
              </div>
              <p className="text-[11px] text-muted-foreground leading-snug">
                Precio independiente del costo FIFO. Se precarga con costo × 2 como sugerencia.
              </p>
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

            <div className="border border-zinc-200/60 dark:border-zinc-800/50 rounded-2xl overflow-hidden bg-zinc-50/50 dark:bg-zinc-950/50 max-h-[340px] overflow-y-auto custom-scrollbar">
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
                            ? 'bg-primary/10 text-primary'
                            : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
                        }`}
                        aria-label={`${isSelected ? 'Quitar' : 'Agregar'} ${pieza.nombre}`}
                      >
                        <div className={`size-5 rounded flex items-center justify-center shrink-0 transition-all ${
                          isSelected
                            ? 'bg-primary border border-primary text-primary-foreground'
                            : 'border-2 border-zinc-200 dark:border-zinc-700'
                        }`} aria-hidden="true">
                          {isSelected && <Check size={12} className="text-white dark:text-zinc-950" strokeWidth={3} />}
                        </div>

                        <div className="size-9 shrink-0 rounded-lg bg-muted dark:bg-zinc-900 border border-zinc-200/40 dark:border-zinc-800/40 overflow-hidden flex items-center justify-center">
                          {pieza.imagenBase64 ? (
                            <img src={pieza.imagenBase64} alt="" className="w-full h-full object-contain p-0.5" />
                          ) : (
                            <Cube size={14} className="text-zinc-300 dark:text-zinc-600" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className={`text-[13px] font-semibold truncate leading-tight ${
                              isSelected ? 'text-primary' : 'text-zinc-800 dark:text-zinc-200'
                          }`}>
                            {pieza.nombre}
                          </p>
                          <p className="flex items-center gap-1.5 mt-0.5">
                            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                              isSelected
                                ? 'bg-primary/15 text-primary'
                                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
                            }`}>
                              {formatWeight(pieza.pesoGramos)}
                            </span>
                            <span className={`text-[10px] ${isSelected ? 'text-primary/60' : 'text-zinc-400 dark:text-zinc-500'}`}>
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
          {selectedPiezasData.length > 0 && (() => {
            const costo = Math.round(selectedPiezasData.reduce((s, p) => s + (p.costoBase || 0), 0));
            const precio = watch('precioSugerido') ?? 0;
            const ganancia = precio - costo;
            const margen = costo > 0 && precio > 0 ? ((ganancia / precio) * 100) : 0;
            const isPositive = ganancia > 0;

            return (
              <div className="mb-5 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/50">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Costo prod.</p>
                    <p className="text-sm font-bold font-mono text-foreground">${costo.toLocaleString('es-AR')}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Precio venta</p>
                    <p className="text-sm font-bold font-mono text-foreground">${precio > 0 ? precio.toLocaleString('es-AR') : '—'}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Ganancia</p>
                    <p className={`text-sm font-bold font-mono ${precio > 0 ? (isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500') : 'text-zinc-400'}`}>
                      {precio > 0 ? `${isPositive ? '+' : ''}$${ganancia.toLocaleString('es-AR')}` : '—'}
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Margen</p>
                    <p className={`text-sm font-bold ${precio > 0 ? (isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500') : 'text-zinc-400'}`}>
                      {precio > 0 ? `${margen.toFixed(1)}%` : '—'}
                    </p>
                  </div>
                </div>
              </div>
            );
          })()}

          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={isSaving || selectedPartes.length === 0 || !watch('nombre')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius-pill)] bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
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
