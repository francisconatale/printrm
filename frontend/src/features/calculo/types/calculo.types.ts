export interface PiezaInput {
  horas: number;
  minutosAdicionales: number;
  gramos: number;
  insumosExtra: number;       // ARS
  multiplicador: number;      // default 3
}

export interface ResultadoCalculo {
  tiempoTotalHoras: number;
  costoEnergia: number;
  costoFilamento: number;
  costoDesgaste: number;
  subtotal: number;
  costoBase: number;          // subtotal × (1 + margenError/100)
  precioVenta: number;        // costoBase × multiplicador
}
