export interface ItemVentaRequest {
  productoId: string;
  cantidad: number;
}

export interface ItemDevolucion {
  productoId: string;
  cantidad: number;
}

export interface DevolucionRequest {
  items: ItemDevolucion[];
  motivo?: string;
}

export interface ItemDevuelto {
  productoId: string;
  productoNombre: string;
  cantidad: number;
  subtotal: number;
}

export interface DevolucionResponse {
  items: ItemDevuelto[];
  totalReembolsado: number;
  mensaje: string;
}

export interface VentaRequest {
  items: ItemVentaRequest[];
  compradorNombre?: string;
  compradorEmail?: string;
}

export interface ItemVentaResponse {
  productoId: string;
  productoNombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface VentaResponse {
  grupoId: string;
  total: number;
  compradorNombre?: string;
  compradorEmail?: string;
  fecha: string;
  devueltoTotalmente: boolean;
  items: ItemVentaResponse[];
}
