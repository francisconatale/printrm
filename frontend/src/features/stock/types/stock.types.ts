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
  cantidadStock: number;
  precioSugerido?: number;
  partes: PiezaSTL[];
  lotes: Lote[];
  creadoEn: string;
  actualizadoEn: string;
}

export interface ProductoCreate {
  id?: string;
  nombre: string;
  precioSugerido?: number;
  cantidadStock?: number;
  parteIds: string[];
}
