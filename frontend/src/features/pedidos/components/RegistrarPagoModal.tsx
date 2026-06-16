import React from 'react';
import { useRegistrarPago } from '../api/pedidos.api';
import { Modal } from '../../../components/ui/modal';
import { AlertCircle, DollarSign, FileText } from 'lucide-react';

interface RegistrarPagoModalProps {
  pedidoId: string;
  saldoPendiente: number;
  isOpen: boolean;
  onClose: () => void;
}

export function RegistrarPagoModal({ pedidoId, saldoPendiente, isOpen, onClose }: RegistrarPagoModalProps) {
  const { mutate: registrarPago, isPending } = useRegistrarPago();
  const [monto, setMonto] = React.useState<string>('');
  const [descripcion, setDescripcion] = React.useState<string>('');
  const [error, setError] = React.useState<string>('');

  React.useEffect(() => {
    if (isOpen) {
      setMonto(saldoPendiente.toFixed(2));
      setDescripcion('');
      setError('');
    }
  }, [isOpen, saldoPendiente]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const parsedMonto = parseFloat(monto);
    if (isNaN(parsedMonto) || parsedMonto <= 0) {
      setError('El monto debe ser un número positivo.');
      return;
    }

    registrarPago(
      {
        id: pedidoId,
        monto: parsedMonto,
        descripcion: descripcion || undefined
      },
      {
        onSuccess: () => {
          onClose();
        },
        onError: (err: any) => {
          setError('Error al registrar el pago: ' + (err.response?.data?.message || err.message));
        }
      }
    );
  };

  return (
    <Modal
      title="Registrar Pago"
      description="Registrá un pago parcial (seña) o la liquidación del saldo pendiente."
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
            <DollarSign size={14} /> Monto a Cobrar *
          </label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            className="w-full bg-white border border-[#e0e0e0] rounded-lg px-4 py-2 focus:ring-2 focus:ring-black outline-none transition-all"
            placeholder="0.00"
            required
          />
          <p className="text-xs text-muted-foreground">Saldo pendiente máximo recomendado: ${saldoPendiente.toFixed(2)}</p>
        </div>

        <div className="space-y-2">
          <label className="studio-caption font-semibold flex items-center gap-2">
            <FileText size={14} /> Descripción / Notas (opcional)
          </label>
          <input
            type="text"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full bg-white border border-[#e0e0e0] rounded-lg px-4 py-2 focus:ring-2 focus:ring-black outline-none transition-all"
            placeholder="Ej: Seña del 50%, Pago total, Transferencia..."
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
            disabled={isPending || !monto}
            className="studio-button-primary"
          >
            {isPending ? 'Procesando...' : 'Registrar Pago'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
