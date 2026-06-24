import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useGetPiezas } from '../../biblioteca/api/biblioteca.api';
import { useSaveProducto } from '../api/productos.api';
import { Modal } from '../../../components/ui/modal';
import { Button } from '../../../components/ui/button';
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
  if (!grams) return '\u2014';
  if (grams >= 1000) return `${(grams / 1000).toFixed(1)}kg`;
  return `${grams}g`;
};

export function ComposicionProductoModal({ isOpen, onClose, preselectedParteId }: ComposicionProductoModalProps) {
  const { data: piezasData } = useGetPiezas(0, 200);
  const piezas = piezasData?.content;
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
              <label htmlFor="prod-nombre" className="text-[13px] font-medium text-muted-foreground">
                Nombre <span className="text-destructive">*</span>
              </label>
              <input
                id="prod-nombre"
                {...register('nombre')}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-base font-medium text-foreground focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-muted-foreground/40"
                placeholder="Ej: Lámpara de Escritorio"
                required
              />
              {errors.nombre && <p className="text-destructive text-xs">{errors.nombre.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="prod-precio" className="text-[13px] font-medium text-muted-foreground flex items-center gap-1.5">
                <Tag size={13} className="text-muted-foreground" />
                Precio de Venta
              </label>
              <div className="flex items-center border border-border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-primary transition-all">
                <span className="text-sm font-medium text-muted-foreground pr-1.5 select-none">$</span>
                <input
                  id="prod-precio"
                  type="number"
                  min="0"
                  step="1"
                  {...register('precioSugerido', { valueAsNumber: true })}
                  className="w-full bg-transparent py-0 text-base font-medium text-foreground outline-none placeholder:text-muted-foreground/40"
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
              <span className="text-[13px] font-medium text-muted-foreground">
                Piezas STL <span className="text-destructive">*</span>
              </span>
              {selectedPartes.length > 0 && (
                <span className="text-[11px] font-semibold text-primary">
                  {selectedPartes.length} de {piezas?.length || 0}
                </span>
              )}
            </div>

            <div className="border border-border/50 rounded-2xl overflow-hidden bg-muted/30 max-h-[340px] overflow-y-auto custom-scrollbar">
              {!piezas || piezas.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-14 text-center">
                  <div className="size-12 rounded-xl bg-muted flex items-center justify-center mb-3">
                    <Cube size={22} className="text-muted-foreground/40" />
                  </div>
                  <p className="text-sm font-semibold text-muted-foreground">Sin piezas disponibles</p>
                  <p className="text-xs text-muted-foreground/60 mt-0.5">Subí archivos STL primero.</p>
                </div>
              ) : (
                <div className="divide-y divide-border/30">
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
                            : 'hover:bg-muted/60'
                        }`}
                        aria-label={`${isSelected ? 'Quitar' : 'Agregar'} ${pieza.nombre}`}
                      >
                        <div className={`size-5 rounded flex items-center justify-center shrink-0 transition-all ${
                          isSelected
                            ? 'bg-primary border border-primary text-primary-foreground'
                            : 'border-2 border-border'
                        }`} aria-hidden="true">
                          {isSelected && <Check size={12} className="text-primary-foreground" strokeWidth={3} />}
                        </div>

                        <div className="size-9 shrink-0 rounded-lg bg-muted border border-border/30 overflow-hidden flex items-center justify-center">
                          {pieza.imagenBase64 ? (
                            <img src={pieza.imagenBase64} alt="" className="w-full h-full object-contain p-0.5" />
                          ) : (
                            <Cube size={14} className="text-muted-foreground/40" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className={`text-[13px] font-semibold truncate leading-tight ${
                              isSelected ? 'text-primary' : 'text-foreground'
                          }`}>
                            {pieza.nombre}
                          </p>
                          <p className="flex items-center gap-1.5 mt-0.5">
                            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                              isSelected
                                ? 'bg-primary/15 text-primary'
                                : 'bg-muted text-muted-foreground'
                            }`}>
                              {formatWeight(pieza.pesoGramos)}
                            </span>
                            <span className={`text-[10px] ${isSelected ? 'text-primary/60' : 'text-muted-foreground/60'}`}>
                              {pieza.perfilFilamentoNombre || 'Sin filamento'}
                            </span>
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
              {errors.parteIds && <p className="text-destructive text-xs px-4 py-2">{errors.parteIds.message}</p>}
            </div>
          </div>
        </div>

        {/* Resumen + Actions */}
        <div className="mt-8 pt-5 border-t border-border/50">
          {selectedPiezasData.length > 0 && (() => {
            const costo = Math.round(selectedPiezasData.reduce((s, p) => s + (p.costoBase || 0), 0));
            const precio = watch('precioSugerido') ?? 0;
            const ganancia = precio - costo;
            const margen = costo > 0 && precio > 0 ? ((ganancia / precio) * 100) : 0;
            const isPositive = ganancia > 0;

            return (
              <div className="mb-5 p-4 rounded-2xl bg-muted/30 border border-border/50">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Costo prod.</p>
                    <p className="text-sm font-bold font-mono text-foreground">${costo.toLocaleString('es-AR')}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Precio venta</p>
                    <p className="text-sm font-bold font-mono text-foreground">${precio > 0 ? precio.toLocaleString('es-AR') : '\u2014'}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Ganancia</p>
                    <p className={`text-sm font-bold font-mono ${precio > 0 ? (isPositive ? 'text-success' : 'text-destructive') : 'text-muted-foreground'}`}>
                      {precio > 0 ? `${isPositive ? '+' : ''}$${ganancia.toLocaleString('es-AR')}` : '\u2014'}
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Margen</p>
                    <p className={`text-sm font-bold ${precio > 0 ? (isPositive ? 'text-success' : 'text-destructive') : 'text-muted-foreground'}`}>
                      {precio > 0 ? `${margen.toFixed(1)}%` : '\u2014'}
                    </p>
                  </div>
                </div>
              </div>
            );
          })()}

          <div className="flex items-center justify-end">
            <Button
              type="submit"
              size="lg"
              disabled={isSaving || selectedPartes.length === 0 || !watch('nombre')}
            >
              <Plus size={15} strokeWidth={2.5} />
              {isSaving ? 'Guardando...' : 'Crear Producto'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
