import React from 'react';
import { useRegistrarMermaProduccion } from '../api/produccion.api';
import { Modal } from '../../../components/ui/modal';
import { AlertCircle, AlertTriangle } from 'lucide-react';
import { OrdenProduccion } from '../types/produccion.types';

interface RegistrarMermaProduccionModalProps {
  orden: OrdenProduccion | null;
  isOpen: boolean;
  onClose: () => void;
}

export function RegistrarMermaProduccionModal({ orden, isOpen, onClose }: RegistrarMermaProduccionModalProps) {
  const { mutate: registrarMerma, isPending } = useRegistrarMermaProduccion();
  const [unidades, setUnidades] = React.useState<string>('1');
  const [error, setError] = React.useState<string>('');

  React.useEffect(() => {
    if (isOpen) {
      setUnidades('1');
      setError('');
    }
  }, [isOpen]);

  if (!orden) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const parsedUnidades = parseInt(unidades);
    if (isNaN(parsedUnidades) || parsedUnidades <= 0) {
      setError('La cantidad de unidades debe ser mayor a 0.');
      return;
    }

    if (parsedUnidades > orden.cantidad) {
      setError(`No puedes marcar más de ${orden.cantidad} unidades (la cantidad actual en la orden).`);
      return;
    }

    registrarMerma(
      {
        id: orden.id,
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
      title="Registrar Fallo (Merma)"
      description={`Registrando unidades fallidas para: ${orden.productoNombre}`}
      isOpen={isOpen}
      onClose={onClose}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6 pt-4">
        {error && (
          <div className="flex items-center gap-2 text-red-500 bg-red-500/10 p-3 rounded-lg border border-red-500/20 text-[14px]">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <div className="flex gap-3 bg-[#fef9c3] border border-[#f59e0b]/20 p-4 rounded-xl text-[#b45309] text-[14px]">
          <AlertTriangle className="shrink-0" size={20} />
          <p>
            Al registrar la merma, se asumirá el costo del material perdido en el balance, pero no se sumará stock.
            {parseInt(unidades) < orden.cantidad ? (
               <span className="block mt-2 font-medium">Las unidades fallidas se descontarán de la orden actual, dejándola con {orden.cantidad - (parseInt(unidades) || 0)} unidades restantes.</span>
            ) : (
               <span className="block mt-2 font-medium">La orden pasará a estado MERMA completamente.</span>
            )}
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-[14px] font-semibold text-[#1d1d1f]">¿Cuántas unidades fallaron?</label>
          <input
            type="number"
            min="1"
            max={orden.cantidad}
            step="1"
            value={unidades}
            onChange={(e) => setUnidades(e.target.value)}
            className="w-full bg-[#f5f5f7] border border-[#e0e0e0] rounded-lg px-4 py-2 text-[17px] focus:ring-2 focus:ring-[#0066cc] outline-none transition-all"
            required
            autoFocus
          />
          <p className="text-[12px] text-[#7a7a7a]">La orden actual tiene {orden.cantidad} unidades en proceso.</p>
        </div>

        <div className="flex justify-end gap-3 border-t border-[#e0e0e0] pt-4 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-[#1d1d1f] border border-[#e0e0e0] rounded-full text-[14px] font-medium hover:bg-[#f5f5f7] transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isPending || !unidades}
            className="px-5 py-2.5 bg-red-600 text-white rounded-full text-[14px] font-medium hover:scale-95 transition-transform disabled:opacity-50"
          >
            {isPending ? 'Procesando...' : 'Confirmar Merma'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
