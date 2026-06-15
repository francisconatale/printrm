export interface Perfil {
  id: string;
  nombre: string;
  creadoEn: string;
  actualizadoEn: string;
  modeloImpresora: string;
  consumoW: number;
  vidaUtilHoras: number;
  costoRepuestos: number;
  
  // Slicer settings
  nozzleDiameter: number;
  bedShape: string;
  maxPrintHeight: number;

  printConfig?: string;
  filamentConfig?: string;
  printerConfig?: string;
}

export type PerfilCreate = Omit<Perfil, 'id' | 'creadoEn' | 'actualizadoEn'>;
export type PerfilUpdate = Partial<PerfilCreate>;

export interface FilamentProfile {
  id: string;
  nombre: string;
  material: string;
  filamentoPorKg: number;
  density: number;
  diameter: number;
  colour: string;
  filamentConfig?: string;
  creadoEn: string;
  actualizadoEn: string;
}

export type FilamentProfileCreate = Omit<FilamentProfile, 'id' | 'creadoEn' | 'actualizadoEn'>;
export type FilamentProfileUpdate = Partial<FilamentProfileCreate>;

export interface PrintProfile {
  id: string;
  nombre: string;
  layerHeight: number;
  perimeters: number;
  fillDensity: string;
  speedPrint: number;
  printConfig?: string;
  creadoEn: string;
  actualizadoEn: string;
}

export type PrintProfileCreate = Omit<PrintProfile, 'id' | 'creadoEn' | 'actualizadoEn'>;
export type PrintProfileUpdate = Partial<PrintProfileCreate>;

export interface SlicerConfigs {
  print: string[];
  filament: string[];
  printer: string[];
}
