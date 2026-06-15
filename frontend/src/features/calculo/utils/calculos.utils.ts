/**
 * Calcula el tiempo total en horas a partir de horas y minutos.
 */
export function calcularTiempo(horas: number, minutos: number): number {
  return horas + minutos / 60;
}

/**
 * Calcula el costo de energía basado en consumo (W), tiempo (H) y precio por kWh.
 */
export function calcularCostoEnergia(
  consumoW: number,
  tiempoH: number,
  preciokWh: number
): number {
  return (consumoW / 1000) * tiempoH * preciokWh;
}

/**
 * Calcula el costo de filamento basado en gramos y precio por kg.
 */
export function calcularCostoFilamento(
  gramos: number,
  precioPorKg: number
): number {
  return (gramos / 1000) * precioPorKg;
}

/**
 * Calcula el costo de desgaste de máquina basado en costo de repuestos,
 * vida útil (H) y tiempo de uso (H).
 */
export function calcularCostoDesgaste(
  costoRepuestos: number,
  vidaUtilH: number,
  tiempoH: number
): number {
  if (vidaUtilH === 0) return 0;
  return (costoRepuestos / vidaUtilH) * tiempoH;
}

/**
 * Calcula el costo base aplicando un margen de error al subtotal.
 */
export function calcularCostoBase(
  subtotal: number,
  margenError: number
): number {
  return subtotal * (1 + margenError / 100);
}

/**
 * Calcula el precio de venta final aplicando un multiplicador al costo base.
 */
export function calcularPrecioVenta(
  costoBase: number,
  multiplicador: number
): number {
  return costoBase * multiplicador;
}
