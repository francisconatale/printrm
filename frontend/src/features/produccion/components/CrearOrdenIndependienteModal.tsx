import React from 'react';
import { useCreateOrdenIndependiente } from '../api/produccion.api';
import { useGetProductos } from '../../stock/api/productos.api';
import { Modal } from '../../../components/ui/modal';
import { AlertCircle, Package } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';

interface CrearOrdenIndependienteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CrearOrdenIndependienteModal({ isOpen, onClose }: CrearOrdenIndependienteModalProps) {
  const { data: productos, isLoading: loadingProductos } = useGetProductos();
  const { mutate: crearOrden, isPending } = useCreateOrdenIndependiente();

  const [productoId, setProductoId] = React.useState<string>('');
  const [cantidad, setCantidad] = React.useState<number>(1);
  const [error, setError] = React.useState<string>('');

  React.useEffect(() => {
    if (isOpen) {
      setProductoId('');
      setCantidad(1);
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!productoId) {
      setError('Por favor, seleccioná un producto.');
      return;
    }

    if (cantidad <= 0) {
      setError('La cantidad debe ser mayor a 0.');
      return;
    }

    crearOrden(
      { productoId, cantidad },
      {
        onSuccess: () => onClose(),
        onError: (err: any) => {
          setError('Error al crear la orden de stock: ' + (err.response?.data?.message || err.message));
        },
      }
    );
  };

  return (
    <Modal
      title="Nueva Orden de Stock"
      description="Creá una orden de producción para reponer o fabricar inventario propio."
      isOpen={isOpen}
      onClose={onClose}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6 pt-4">
        {error && (
          <div className="flex items-center gap-2 text-red-500 bg-red-500/10 p-3 rounded-lg border border-red-500/20 text-sm">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-2">
          <label className="studio-caption font-semibold flex items-center gap-2">
            <Package size={14} /> Producto *
          </label>
          <Select 
            value={productoId} 
            onValueChange={setProductoId}
            disabled={loadingProductos}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccionar Producto..." />
            </SelectTrigger>
            <SelectContent className="z-[300]" position="popper" side="bottom">
              <SelectItem value="">
                Seleccionar Producto...
              </SelectItem>
              {productos?.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.nombre} (Stock actual: {p.cantidadStock})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {loadingProductos && <p className="text-xs text-muted-foreground">Cargando productos...</p>}
        </div>

        <div className="space-y-2">
          <label className="studio-caption font-semibold flex items-center gap-2">
            Cantidad a Producir
          </label>
          <input
            type="number"
            min="1"
            value={cantidad}
            onChange={(e) => setCantidad(parseInt(e.target.value) || 0)}
            className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-black outline-none transition-all"
            required
          />
        </div>

        <div className="flex justify-end gap-3 border-t border-[var(--studio-hairline)] pt-4">
          <button
            type="button"
            onClick={onClose}
            className="studio-button-secondary-pill"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isPending || cantidad <= 0 || !productoId}
            className="studio-button-primary"
          >
            {isPending ? 'Creando...' : 'Crear Orden'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
