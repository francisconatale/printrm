import React from 'react';
import { useRegistrarMermaProduccion } from '../api/produccion.api';
import { Modal } from '../../../components/ui/modal';
import { Button } from '../../../components/ui/button';
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
          <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20 text-[14px]">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <div className="flex gap-3 bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl text-amber-600 dark:text-amber-400 text-[14px]">
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
          <label className="text-[14px] font-semibold text-foreground">¿Cuántas unidades fallaron?</label>
          <input
            type="number"
            min="1"
            max={orden.cantidad}
            step="1"
            value={unidades}
            onChange={(e) => setUnidades(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-4 py-2 text-[17px] focus:ring-2 focus:ring-primary outline-none transition-all"
            required
            autoFocus
          />
          <p className="text-[12px] text-muted-foreground">La orden actual tiene {orden.cantidad} unidades en proceso.</p>
        </div>

        <div className="flex justify-end gap-3 border-t border-border pt-4 mt-6">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            type="submit"
            disabled={isPending || !unidades}
            isLoading={isPending}
          >
            {isPending ? 'Procesando...' : 'Confirmar Merma'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
