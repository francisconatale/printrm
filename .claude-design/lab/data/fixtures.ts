export type Estado = 'COLA' | 'IMPRIMIENDO' | 'COMPLETADO' | 'MERMA' | 'CANCELADO';

export interface OrdenFixture {
  id: string;
  productoNombre: string;
  cantidad: number;
  estado: Estado;
  clienteNombre?: string;
  pedidoId?: string;
  fechaInicio?: string;
  fechaFin?: string;
  esVinculada: boolean;
}

const today = new Date();
const fmtDate = (d: Date) => d.toISOString().split('T')[0];
const subHours = (h: number) => new Date(today.getTime() - h * 3600000).toISOString();

export const ordenes: OrdenFixture[] = [
  { id: 'ORD-001', productoNombre: 'Llavero Personalizado Logo', cantidad: 50, estado: 'IMPRIMIENDO', clienteNombre: 'TechCorp SRL', pedidoId: 'PED-1001', fechaInicio: subHours(2), esVinculada: true },
  { id: 'ORD-002', productoNombre: 'Caja Organizadora PLA', cantidad: 120, estado: 'COLA', clienteNombre: 'Distribuidora Norte', pedidoId: 'PED-1002', esVinculada: true },
  { id: 'ORD-003', productoNombre: 'Soporte Monitor 3M', cantidad: 30, estado: 'COLA', esVinculada: false },
  { id: 'ORD-004', productoNombre: 'Carcasa Arduino Premium', cantidad: 200, estado: 'IMPRIMIENDO', clienteNombre: 'EduLab', pedidoId: 'PED-1003', fechaInicio: subHours(5), esVinculada: true },
  { id: 'ORD-005', productoNombre: 'Letrero LED "Abierto"', cantidad: 15, estado: 'COMPLETADO', clienteNombre: 'Café Central', fechaFin: subHours(8), esVinculada: true },
  { id: 'ORD-006', productoNombre: 'Clip Sujetacables Pack', cantidad: 500, estado: 'COLA', esVinculada: false },
  { id: 'ORD-007', productoNombre: 'Base Goma para Tablet', cantidad: 80, estado: 'MERMA', clienteNombre: 'TabletPlus SA', pedidoId: 'PED-1004', fechaInicio: subHours(12), esVinculada: true },
  { id: 'ORD-008', productoNombre: 'Engranaje PLA 50mm', cantidad: 1000, estado: 'COMPLETADO', fechaFin: subHours(24), esVinculada: false },
  { id: 'ORD-009', productoNombre: 'Maceta Autorriego', cantidad: 40, estado: 'CANCELADO', clienteNombre: 'Vivero Verde', pedidoId: 'PED-1005', esVinculada: true },
  { id: 'ORD-010', productoNombre: 'Sello Personalizado Goma', cantidad: 25, estado: 'COLA', esVinculada: false },
  { id: 'ORD-011', productoNombre: 'Perfil Difusor LED', cantidad: 200, estado: 'COLA', clienteNombre: 'IluminaYa', pedidoId: 'PED-1006', esVinculada: true },
  { id: 'ORD-012', productoNombre: 'Tapón Silicona 20mm', cantidad: 300, estado: 'IMPRIMIENDO', fechaInicio: subHours(1), esVinculada: false },
];
