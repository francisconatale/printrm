import React from 'react';
import { useCreateTransaccion } from '../api/finanzas.api';
import { Modal } from '../../../components/ui/modal';
import { AlertCircle } from 'lucide-react';
import { TipoTransaccion, CategoriaTransaccion } from '../types/finanzas.types';

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES: { value: CategoriaTransaccion; label: string }[] = [
  { value: 'MATERIAL', label: 'Material / Filamento' },
  { value: 'ENERGIA', label: 'Energía / Electricidad' },
  { value: 'REPUESTO', label: 'Repuestos / Mantenimiento' },
  { value: 'VENTA', label: 'Venta / Ingreso Extra' },
  { value: 'MERMA', label: 'Merma / Pérdida' },
  { value: 'OTRO', label: 'Otro' },
];

export function TransactionForm({ isOpen, onClose }: TransactionFormProps) {
  const { mutate: createTransaccion, isPending } = useCreateTransaccion();
  const [tipo, setTipo] = React.useState<TipoTransaccion>('EGRESO');
  const [categoria, setCategoria] = React.useState<CategoriaTransaccion>('REPUESTO');
  const [montoStr, setMontoStr] = React.useState<string>('');
  const [descripcion, setDescripcion] = React.useState<string>('');
  const [error, setError] = React.useState<string>('');

  React.useEffect(() => {
    if (isOpen) {
      setTipo('EGRESO');
      setCategoria('REPUESTO');
      setMontoStr('');
      setDescripcion('');
      setError('');
    }
  }, [isOpen]);

  const handleTipoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTipo = e.target.value as TipoTransaccion;
    setTipo(newTipo);
    // Suggest appropriate category
    if (newTipo === 'INGRESO') {
      setCategoria('VENTA');
    } else {
      setCategoria('REPUESTO');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const parsedMonto = parseFloat(montoStr);
    if (isNaN(parsedMonto) || parsedMonto <= 0) {
      setError('El monto debe ser un número positivo.');
      return;
    }

    if (!descripcion.trim()) {
      setError('La descripción es obligatoria.');
      return;
    }

    // Convert to negative if it's an EGRESO or positive if INGRESO
    const finalMonto = tipo === 'EGRESO' ? -Math.abs(parsedMonto) : Math.abs(parsedMonto);

    createTransaccion(
      {
        tipo,
        categoria,
        monto: finalMonto,
        descripcion: descripcion.trim(),
      },
      {
        onSuccess: () => {
          onClose();
        },
        onError: (err: any) => {
          setError('Error al registrar la transacción: ' + (err.response?.data?.message || err.message));
        }
      }
    );
  };

  return (
    <Modal
      title="Registrar Transacción"
      description="Cargá un ingreso o egreso de dinero manual en el Libro Diario."
      isOpen={isOpen}
      onClose={onClose}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6 pt-4">
        {error && (
          <div className="flex items-center gap-2 text-red-500 bg-red-500/10 p-3 rounded-lg border border-red-500/20 text-sm animate-in fade-in duration-200">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Tipo de Transacción */}
        <div className="space-y-2">
          <label htmlFor="tx-tipo" className="studio-caption font-semibold">Tipo de Movimiento *</label>
          <select
            id="tx-tipo"
            value={tipo}
            onChange={handleTipoChange}
            className="w-full bg-background border border-[#e0e0e0] rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-black outline-none transition-all text-sm"
            required
          >
            <option value="EGRESO">Egreso (Gasto / Salida)</option>
            <option value="INGRESO">Ingreso (Entrada)</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Categoría */}
          <div className="space-y-2">
            <label htmlFor="tx-categoria" className="studio-caption font-semibold">Categoría *</label>
            <select
              id="tx-categoria"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value as CategoriaTransaccion)}
              className="w-full bg-background border border-[#e0e0e0] rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-black outline-none transition-all text-sm"
              required
            >
              {CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          {/* Monto */}
          <div className="space-y-2">
            <label htmlFor="tx-monto" className="studio-caption font-semibold">Monto *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-sm" aria-hidden="true">$</span>
              <input
                id="tx-monto"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                value={montoStr}
                onChange={(e) => setMontoStr(e.target.value)}
                className="w-full bg-background border border-[#e0e0e0] rounded-lg pl-7 pr-4 py-2.5 focus:ring-2 focus:ring-black outline-none transition-all text-sm font-mono"
                required
              />
            </div>
          </div>
        </div>

        {/* Descripción */}
        <div className="space-y-2">
          <label htmlFor="tx-descripcion" className="studio-caption font-semibold">Descripción *</label>
          <input
            id="tx-descripcion"
            type="text"
            placeholder="Ej: Compra de 2kg filamento PLA PLA"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full bg-background border border-[#e0e0e0] rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-black outline-none transition-all text-sm"
            required
          />
        </div>

        {/* Acciones */}
        <div className="flex justify-end gap-3 border-t border-[var(--studio-hairline)] pt-5 mt-8">
          <button
            type="button"
            onClick={onClose}
            className="studio-button-secondary-pill"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isPending || !montoStr || parseFloat(montoStr) <= 0 || !descripcion.trim()}
            className="studio-button-primary disabled:opacity-50 disabled:cursor-not-allowed"
            title={
              !montoStr || parseFloat(montoStr) <= 0
                ? "Ingresá un monto válido mayor a 0 antes de guardar"
                : !descripcion.trim()
                  ? "Ingresá una descripción para registrar la transacción"
                  : "Guardar Movimiento"
            }
          >
            {isPending ? 'Procesando...' : 'Guardar Movimiento'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
