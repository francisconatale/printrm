export interface PiezaInput {
  horas: number;
  minutosAdicionales: number;
  gramos: number;
  insumosExtra: number;       // ARS
  multiplicador: number;      // default 3
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
  id: string;
  timestamp: string;            // ISO 8601
  perfilId: string;
  perfilNombre: string;         // snapshot — independiente del perfil actual
  input: {
    horas: number;
    minutosAdicionales: number;
    gramos: number;
    insumosExtra: number;
    multiplicador: number;
  };
  resultado: ResultadoCalculo;
}
