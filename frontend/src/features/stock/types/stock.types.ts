import { PiezaSTL } from '../../biblioteca/types/biblioteca.types';

export interface Lote {
  id: string;
  cantidadActual: number;
  costoUnitario: number;
  fechaCreacion: string;
}

export interface Producto {
  id: string;
  nombre: string;
  descripcion?: string;
  partes: PiezaSTL[];
  cantidadStock: number;
  precioSugerido?: number;
  lotes: Lote[];
  creadoEn: string;
  actualizadoEn: string;
}

export interface ProductoCreate {
  nombre: string;
  descripcion?: string;
  precioSugerido?: number;
  cantidadStock?: number;
  parteIds: string[];
}
