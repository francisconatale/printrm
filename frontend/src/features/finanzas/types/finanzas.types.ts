export type TipoTransaccion = 'INGRESO' | 'EGRESO' | 'REEMBOLSO';
export type CategoriaTransaccion = 'MATERIAL' | 'ENERGIA' | 'VENTA' | 'MERMA' | 'REPUESTO' | 'OTRO';

export interface Transaccion {
  id: string;
  tipo: TipoTransaccion;
  categoria: CategoriaTransaccion;
  monto: number;
  descripcion: string;
  pedidoId?: string;
  fecha: string;
}
