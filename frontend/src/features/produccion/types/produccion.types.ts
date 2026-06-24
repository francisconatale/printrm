export type EstadoProduccion = 'COLA' | 'IMPRIMIENDO' | 'COMPLETADO' | 'CANCELADO' | 'MERMA';

export interface OrdenProduccion {
  id: string;
  itemPedidoId?: string;
  pedidoId?: string;
  clienteNombre?: string;
  productoId?: string;
  productoNombre?: string;
  cantidad: number;
  estado: EstadoProduccion;
  fechaInicio?: string;
  fechaFin?: string;
}

export interface OrdenProduccionRequest {
  itemPedidoId?: string;
  productoId?: string;
  cantidad: number;
}
