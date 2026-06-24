import React, { useState } from 'react';
import { Modal } from '../../../components/ui/modal';
import { Button } from '../../../components/ui/button';
import { Producto } from '../types/stock.types';
import { useUpdateStock } from '../api/productos.api';

interface AgregarStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  producto: Producto;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 2 }).format(value);
};

export function AgregarStockModal({ isOpen, onClose, producto }: AgregarStockModalProps) {
  const [cantidad, setCantidad] = useState(1);
  const { mutate: updateStock, isPending } = useUpdateStock();

  // Calcular desglose unitario
  const costoMaterialUnitario = producto.partes?.reduce((sum, p) => sum + (p.costoMaterial || 0), 0) || 0;
  const costoEnergiaUnitario = producto.partes?.reduce((sum, p) => sum + (p.costoEnergia || 0), 0) || 0;
  const costoBaseUnitario = producto.partes?.reduce((sum, p) => sum + (p.costoBase || 0), 0) || (producto.lotes?.[0]?.costoUnitario || 0);

  // Calcular totales
  const totalMaterial = costoMaterialUnitario * cantidad;
  const totalEnergia = costoEnergiaUnitario * cantidad;
  const totalCosto = costoBaseUnitario * cantidad;

  const handleConfirm = () => {
    updateStock(
      { id: producto.id, delta: cantidad },
      {
        onSuccess: () => {
          onClose();
          setCantidad(1); // reset para la proxima
        }
      }
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Fabricar Producto"
      description={`Confirma los costos de fabricación para agregar stock a ${producto.nombre}.`}
      size="md"
    >
      <div className="space-y-6 mt-4">
        {/* Cantidad Input */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">Cantidad a fabricar</label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCantidad(Math.max(1, cantidad - 1))}
              className="size-10 rounded-lg border border-border bg-muted/50 hover:bg-muted flex items-center justify-center transition-colors text-foreground font-bold"
            >
              -
            </button>
            <input
              type="number"
              min="1"
              value={cantidad}
              onChange={(e) => setCantidad(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-20 text-center bg-background border border-border rounded-lg h-10 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all font-semibold"
            />
            <button
              onClick={() => setCantidad(cantidad + 1)}
              className="size-10 rounded-lg border border-border bg-muted/50 hover:bg-muted flex items-center justify-center transition-colors text-foreground font-bold"
            >
              +
            </button>
          </div>
        </div>

        {/* Desglose */}
        <div className="space-y-3 bg-muted/30 p-4 rounded-xl border border-border/50">
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Desglose de Costos (Total)</h4>
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-foreground">
              <span>Costo Material</span>
            </div>
            <span className="text-sm font-medium">{formatCurrency(totalMaterial)}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-foreground">
              <span>Costo Energía (Luz)</span>
            </div>
            <span className="text-sm font-medium">{formatCurrency(totalEnergia)}</span>
          </div>

          {/* Otros costos si los hubiera (la diferencia entre costo base y material+energia) */}
          {totalCosto - (totalMaterial + totalEnergia) > 0.01 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-foreground">
                <span>Otros costos</span>
              </div>
              <span className="text-sm font-medium">
                {formatCurrency(totalCosto - (totalMaterial + totalEnergia))}
              </span>
            </div>
          )}

          <div className="pt-3 border-t border-border/50 flex items-center justify-between mt-2">
            <span className="text-sm font-bold text-foreground">Costo Total Estimado</span>
            <span className="text-lg font-bold text-foreground">{formatCurrency(totalCosto)}</span>
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-4 border-t border-border">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={isPending}>
            {isPending ? 'Agregando...' : 'Confirmar'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
