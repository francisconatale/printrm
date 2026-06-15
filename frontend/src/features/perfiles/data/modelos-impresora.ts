export interface ModeloImpresora {
  nombre: string;
  consumoW: number;
  vidaUtilHoras: number;
  costoRepuestos: number;
}

export const MODELOS_IMPRESORA: ModeloImpresora[] = [
  { nombre: "Prusa MK4", consumoW: 120, vidaUtilHoras: 5000, costoRepuestos: 25000 },
  { nombre: "Prusa MK3S+", consumoW: 120, vidaUtilHoras: 5000, costoRepuestos: 20000 },
  { nombre: "Prusa MINI+", consumoW: 80, vidaUtilHoras: 4000, costoRepuestos: 15000 },
  { nombre: "Creality Ender 3", consumoW: 125, vidaUtilHoras: 4000, costoRepuestos: 12000 },
  { nombre: "Creality Ender 3 V2", consumoW: 125, vidaUtilHoras: 4000, costoRepuestos: 12000 },
  { nombre: "Creality CR-10", consumoW: 150, vidaUtilHoras: 4000, costoRepuestos: 18000 },
  { nombre: "Bambu Lab X1 Carbon", consumoW: 175, vidaUtilHoras: 3000, costoRepuestos: 35000 },
  { nombre: "Bambu Lab P1P", consumoW: 175, vidaUtilHoras: 3000, costoRepuestos: 25000 },
  { nombre: "Anycubic Mega S", consumoW: 110, vidaUtilHoras: 4000, costoRepuestos: 12000 },
  { nombre: "Artillery Sidewinder X2", consumoW: 140, vidaUtilHoras: 4000, costoRepuestos: 15000 },
  { nombre: "Otro / Personalizado", consumoW: 120, vidaUtilHoras: 5000, costoRepuestos: 20000 }
];
