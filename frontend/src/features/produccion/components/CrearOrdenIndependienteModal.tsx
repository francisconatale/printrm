import React from 'react';
import { useCreateOrdenIndependiente } from '../api/produccion.api';
import { useGetProductos } from '../../stock/api/productos.api';
import { Modal } from '../../../components/ui/modal';
import { AlertCircle, FileText, Layers, Tag, DollarSign, Package } from 'lucide-react';

interface CrearOrdenIndependienteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CrearOrdenIndependienteModal({ isOpen, onClose }: CrearOrdenIndependienteModalProps) {
  const { data: productos, isLoading: loadingProductos } = useGetProductos();
  const { mutate: crearOrden, isPending } = useCreateOrdenIndependiente();

  const [productoId, setProductoId] = React.useState<string>('');
  const [cantidad, setCantidad] = React.useState<number>(1);
  const [tipo, setTipo] = React.useState<'INTERNA' | 'EXTERNA'>('INTERNA');
  const [proveedor, setProveedor] = React.useState<string>('');
  const [costoEstimado, setCostoEstimado] = React.useState<string>('');
  const [error, setError] = React.useState<string>('');

  React.useEffect(() => {
    if (isOpen) {
      setProductoId('');
      setCantidad(1);
      setTipo('INTERNA');
      setProveedor('');
      setCostoEstimado('');
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

    const parsedCosto = parseFloat(costoEstimado);
    if (tipo === 'EXTERNA' && (!proveedor.trim() || isNaN(parsedCosto) || parsedCosto < 0)) {
      setError('Para producción externa, debés especificar el proveedor y un costo estimado válido.');
      return;
    }

    crearOrden(
      {
        productoId,
        cantidad,
        tipo,
        proveedor: tipo === 'EXTERNA' ? proveedor : undefined,
        costoEstimado: tipo === 'EXTERNA' ? parsedCosto : undefined,
      },
      {
        onSuccess: () => {
          onClose();
        },
        onError: (err: any) => {
          setError('Error al crear la orden de stock: ' + (err.response?.data?.message || err.message));
        },
      }
    );
  };

  return (
    <Modal
      title="Nueva Orden de Stock"
      description="Creá una orden de producción independiente para reponer o fabricar inventario propio."
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
          <select
            value={productoId}
            onChange={(e) => setProductoId(e.target.value)}
            className="w-full bg-white border border-[#e0e0e0] rounded-lg px-4 py-2 focus:ring-2 focus:ring-black outline-none transition-all"
            required
            disabled={loadingProductos}
          >
            <option value="">Seleccionar Producto...</option>
            {productos?.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre} (Stock actual: {p.cantidadStock})
              </option>
            ))}
          </select>
          {loadingProductos && <p className="text-xs text-muted-foreground">Cargando productos...</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setTipo('INTERNA')}
            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
              tipo === 'INTERNA'
                ? 'border-black bg-black/5 dark:border-white dark:bg-white/5 font-semibold text-foreground'
                : 'border-border/60 text-muted-foreground hover:bg-muted/10'
            }`}
          >
            <Layers size={20} />
            <span className="text-xs">Interna (Propia)</span>
          </button>
          <button
            type="button"
            onClick={() => setTipo('EXTERNA')}
            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
              tipo === 'EXTERNA'
                ? 'border-black bg-black/5 dark:border-white dark:bg-white/5 font-semibold text-foreground'
                : 'border-border/60 text-muted-foreground hover:bg-muted/10'
            }`}
          >
            <Tag size={20} />
            <span className="text-xs">Externa (Proveedor)</span>
          </button>
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
            className="w-full bg-white border border-[#e0e0e0] rounded-lg px-4 py-2 focus:ring-2 focus:ring-black outline-none transition-all"
            required
          />
        </div>

        {tipo === 'EXTERNA' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="space-y-2">
              <label className="studio-caption font-semibold flex items-center gap-2">
                Proveedor *
              </label>
              <input
                type="text"
                value={proveedor}
                onChange={(e) => setProveedor(e.target.value)}
                className="w-full bg-white border border-[#e0e0e0] rounded-lg px-4 py-2 focus:ring-2 focus:ring-black outline-none transition-all"
                placeholder="Nombre del proveedor"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="studio-caption font-semibold flex items-center gap-2">
                <DollarSign size={14} /> Costo Estimado Total *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={costoEstimado}
                onChange={(e) => setCostoEstimado(e.target.value)}
                className="w-full bg-white border border-[#e0e0e0] rounded-lg px-4 py-2 focus:ring-2 focus:ring-black outline-none transition-all"
                placeholder="0.00"
                required
              />
              <p className="text-xs text-muted-foreground">Se registrará como un egreso contable cuando se reciba.</p>
            </div>
          </div>
        )}

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
