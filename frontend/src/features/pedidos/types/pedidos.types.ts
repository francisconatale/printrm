export type EstadoPedido = 'BORRADOR' | 'COTIZADO' | 'EN_PRODUCCION' | 'ENTREGADO' | 'CANCELADO' | 'DEVUELTO';

export interface ItemPedido {
  id: string;
  calculoId: string;
  cantidad: number;
  cantidadMerma: number;
  subtotal: number;
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
  calculoId?: string;
  productoId?: string;
  cantidad: number;
}

export interface PedidoCreate {
  clienteId?: string;
  items: ItemPedidoRequest[];
}
