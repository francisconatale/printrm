export interface Perfil {
  id: string;
  nombre: string;
  creadoEn: string;
  actualizadoEn: string;
  filamentoPorKg: number;
  preciokWh: number;
  modeloImpresora: string;
  consumoW: number;
  vidaUtilHoras: number;
  costoRepuestos: number;
  margenError: number;
  printConfig?: string;
  filamentConfig?: string;
  printerConfig?: string;
}

export type PerfilCreate = Omit<Perfil, 'id' | 'creadoEn' | 'actualizadoEn'>;
export type PerfilUpdate = Partial<PerfilCreate>;

export interface SlicerConfigs {
  print: string[];
  filament: string[];
  printer: string[];
}
