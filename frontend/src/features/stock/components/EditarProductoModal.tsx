import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Producto } from '../types/stock.types';
import { useSaveProducto } from '../api/productos.api';
import { Modal } from '../../../components/ui/modal';
import { Button } from '../../../components/ui/button';
import { Tag, Info } from 'lucide-react';

const editarProductoSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio").max(100),
  precioSugerido: z.number().min(0, "El precio no puede ser negativo").optional().default(0),
});

type EditarProductoForm = z.infer<typeof editarProductoSchema>;

interface EditarProductoModalProps {
  isOpen: boolean;
  onClose: () => void;
  producto: Producto;
}

export function EditarProductoModal({ isOpen, onClose, producto }: EditarProductoModalProps) {
  const { mutate: saveProducto, isPending } = useSaveProducto();

  const ultimoLote = producto.lotes && producto.lotes.length > 0
    ? [...producto.lotes].sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime())[0]
    : null;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<EditarProductoForm>({
    resolver: zodResolver(editarProductoSchema),
    defaultValues: {
      nombre: producto.nombre,
      precioSugerido: producto.precioSugerido || 0,
    }
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        nombre: producto.nombre,
        precioSugerido: producto.precioSugerido || 0,
      });
    }
  }, [isOpen, producto, reset]);

  const onSubmit = (data: EditarProductoForm) => {
    saveProducto({
      id: producto.id,
      nombre: data.nombre,
      precioSugerido: data.precioSugerido,
      parteIds: producto.partes.map(p => p.id),
      cantidadStock: producto.cantidadStock,
    }, {
      onSuccess: () => {
        onClose();
      }
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar Producto"
      description="Modifica el nombre y precio de venta del producto."
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Nombre del Producto *</label>
            <input
              {...register('nombre')}
              className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="Ej: Maceta Groot"
              autoFocus
            />
            {errors.nombre && <span className="text-xs text-red-500 font-medium">{errors.nombre.message}</span>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Precio de Venta ($)</label>
            <div className="relative">
              <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="number"
                step="0.01"
                {...register('precioSugerido', { valueAsNumber: true })}
                className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="0.00"
              />
            </div>
            {errors.precioSugerido && <span className="text-xs text-red-500 font-medium">{errors.precioSugerido.message}</span>}

            {ultimoLote && (
              <div className="flex items-start gap-2 p-3 mt-2 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400">
                <Info size={16} className="mt-0.5 shrink-0" />
                <p className="text-xs leading-relaxed">
                  El costo unitario del último lote fue de <strong>${ultimoLote.costoUnitario.toFixed(2)}</strong>. 
                  Úsalo como referencia para establecer tu precio de venta.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-4 border-t border-border">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
