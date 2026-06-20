export type EstadoPedido = 'BORRADOR' | 'COTIZADO' | 'CONFIRMADO' | 'EN_PRODUCCION' | 'LISTO_PARA_ENTREGAR' | 'ENTREGADO' | 'CANCELADO' | 'DEVUELTO';

export interface OrdenProduccionResumen {
  id: string;
  cantidad: number;
  tipo: 'INTERNA' | 'EXTERNA';
  estado: 'COLA' | 'IMPRIMIENDO' | 'COMPLETADO' | 'ENVIADO_PROVEEDOR' | 'RECIBIDO_PROVEEDOR' | 'CANCELADO';
  proveedor?: string;
  costoEstimado?: number;
}

export interface ItemPedido {
  id: string;
  productoId?: string;
  productoNombre?: string;
  perfilNombre: string;
  cantidad: number;
  cantidadMerma: number;
  subtotal: number;
  precioPersonalizado?: number;
  stockDisponible?: number;
  cantidadFaltante?: number;
  ordenesProduccion?: OrdenProduccionResumen[];
}

export interface Pedido {
  id: string;
  clienteNombre: string;
  estado: EstadoPedido;
  total: number;
  montoPagado: number;
  saldoPendiente: number;
  items: ItemPedido[];
  fechaCreacion: string;
}

export interface ItemPedidoRequest {
  productoId?: string;
  cantidad: number;
  precioPersonalizado?: number;
}

export interface PedidoCreate {
  clienteId?: string;
  items: ItemPedidoRequest[];
}
