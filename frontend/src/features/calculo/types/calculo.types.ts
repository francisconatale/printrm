export interface PiezaInput {
  horas: number;
  minutosAdicionales: number;
  gramos: number;
  insumosExtra: number;       // ARS
}

export interface ResultadoCalculo {
  horas: number;
  minutosAdicionales: number;
  gramos: number;
  tiempoTotalHoras: number;
  costoEnergia: number;
  costoFilamento: number;
  costoDesgaste: number;
  subtotal: number;
  costoBase: number;          // subtotal × (1 + margenError/100)
  precioVenta: number;        // costoBase × multiplicador
}

export interface CalculoSnapshot {
  id?: string;
  timestamp?: string;            // ISO 8601
  perfilId: string;
  perfilNombre: string;          // snapshot — independiente del perfil actual

  // Inputs
  horas: number;
  minutosAdicionales: number;
  gramos: number;
  insumosExtra: number;

  // Results
  costoEnergia: number;
  costoFilamento: number;
  costoDesgaste: number;
  subtotal: number;
  costoBase: number;
}

