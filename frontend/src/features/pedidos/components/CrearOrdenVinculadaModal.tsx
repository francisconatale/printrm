import React from 'react';
import { useCreateOrdenVinculada } from '../../produccion/api/produccion.api';
import { Modal } from '../../../components/ui/modal';
import { AlertCircle } from 'lucide-react';

interface CrearOrdenVinculadaModalProps {
  itemPedidoId: string;
  perfilNombre: string;
  cantidadRecomendada: number;
  isOpen: boolean;
  onClose: () => void;
}

export function CrearOrdenVinculadaModal({
  itemPedidoId,
  perfilNombre,
  cantidadRecomendada,
  isOpen,
  onClose,
}: CrearOrdenVinculadaModalProps) {
  const { mutate: crearOrden, isPending } = useCreateOrdenVinculada();
  const [cantidad, setCantidad] = React.useState<number>(cantidadRecomendada);
  const [error, setError] = React.useState<string>('');

  React.useEffect(() => {
    if (isOpen) {
      setCantidad(cantidadRecomendada);
      setError('');
    }
  }, [isOpen, cantidadRecomendada]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (cantidad <= 0) {
      setError('La cantidad debe ser mayor a 0.');
      return;
    }

    crearOrden(
      { itemPedidoId, cantidad },
      {
        onSuccess: () => onClose(),
        onError: (err: any) => {
          setError('Error al crear la orden: ' + (err.response?.data?.message || err.message));
        },
      }
    );
  };

  return (
    <Modal
      title="Mandar a Fabricar"
      description={`Iniciá una orden de producción para el ítem "${perfilNombre}".`}
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
            Cantidad a Producir
          </label>
          <input
            type="number"
            min="1"
            value={cantidad}
            onChange={(e) => setCantidad(parseInt(e.target.value) || 0)}
            className="w-full bg-background border border-[#e0e0e0] rounded-lg px-4 py-2 focus:ring-2 focus:ring-black outline-none transition-all"
            required
          />
          <p className="text-xs text-muted-foreground">Faltante neto sugerido: {cantidadRecomendada} unidades</p>
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
            disabled={isPending || cantidad <= 0}
            className="studio-button-primary"
          >
            {isPending ? 'Creando...' : 'Crear Orden'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
