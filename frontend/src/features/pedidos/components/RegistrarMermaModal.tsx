import React from 'react';
import { useRegistrarMerma } from '../api/pedidos.api';
import { Modal } from '../../../components/ui/modal';
import { AlertCircle, AlertTriangle } from 'lucide-react';

interface RegistrarMermaModalProps {
  pedidoId: string;
  itemId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function RegistrarMermaModal({ pedidoId, itemId, isOpen, onClose }: RegistrarMermaModalProps) {
  const { mutate: registrarMerma, isPending } = useRegistrarMerma();
  const [unidades, setUnidades] = React.useState<string>('1');
  const [error, setError] = React.useState<string>('');

  React.useEffect(() => {
    if (isOpen) {
      setUnidades('1');
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const parsedUnidades = parseInt(unidades);
    if (isNaN(parsedUnidades) || parsedUnidades <= 0) {
      setError('La cantidad de unidades debe ser un número entero positivo.');
      return;
    }

    registrarMerma(
      {
        pedidoId,
        itemId,
        unidadesFallidas: parsedUnidades
      },
      {
        onSuccess: () => {
          onClose();
        },
        onError: (err: any) => {
          setError('Error al registrar la merma: ' + (err.response?.data?.message || err.message));
        }
      }
    );
  };

  return (
    <Modal
      title="Registrar Merma"
      description="Registrá mermas o impresiones fallidas para ajustar las estadísticas de consumo."
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

        <div className="flex gap-3 bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl text-amber-600 dark:text-amber-400 text-sm">
          <AlertTriangle className="shrink-0" size={20} />
          <p className="studio-caption">
            Registrar merma reclasifica estadísticamente el costo del filamento y la energía correspondientes, pero <strong>no descuenta dinero del balance dos veces</strong>.
          </p>
        </div>

        <div className="space-y-2">
          <label className="studio-caption font-semibold">Unidades Fallidas *</label>
          <input
            type="number"
            min="1"
            step="1"
            value={unidades}
            onChange={(e) => setUnidades(e.target.value)}
            className="w-full bg-background border border-[#e0e0e0] rounded-lg px-4 py-2 focus:ring-2 focus:ring-black outline-none transition-all"
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
            disabled={isPending || !unidades}
            className="studio-button-primary"
          >
            {isPending ? 'Procesando...' : 'Registrar Merma'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
