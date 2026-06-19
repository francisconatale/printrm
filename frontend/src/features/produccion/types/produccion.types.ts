export type TipoProduccion = 'INTERNA' | 'EXTERNA';

export type EstadoProduccion = 'COLA' | 'IMPRIMIENDO' | 'COMPLETADO' | 'ENVIADO_PROVEEDOR' | 'RECIBIDO_PROVEEDOR' | 'CANCELADO';

export interface OrdenProduccion {
  id: string;
  itemPedidoId?: string;
  pedidoId?: string;
  clienteNombre?: string;
  productoId?: string;
  productoNombre?: string;
  cantidad: number;
  tipo: TipoProduccion;
  estado: EstadoProduccion;
  costoEstimado?: number;
  proveedor?: string;
  fechaInicio?: string;
  fechaFin?: string;
}

export interface OrdenProduccionRequest {
  itemPedidoId?: string;
  productoId?: string;
  cantidad: number;
  tipo: TipoProduccion;
  proveedor?: string;
  costoEstimado?: number;
}
