export interface ModeloImpresora {
  nombre: string;
  consumoW: number;
}

export const MODELOS_IMPRESORA: ModeloImpresora[] = [
  { nombre: "Prusa MK4", consumoW: 120 },
  { nombre: "Prusa MK3S+", consumoW: 120 },
  { nombre: "Prusa MINI+", consumoW: 80 },
  { nombre: "Creality Ender 3", consumoW: 125 },
  { nombre: "Creality Ender 3 V2", consumoW: 125 },
  { nombre: "Creality CR-10", consumoW: 150 },
  { nombre: "Bambu Lab X1 Carbon", consumoW: 175 },
  { nombre: "Bambu Lab P1P", consumoW: 175 },
  { nombre: "Anycubic Mega S", consumoW: 110 },
  { nombre: "Artillery Sidewinder X2", consumoW: 140 },
  { nombre: "Otro / Personalizado", consumoW: 120 }
];
