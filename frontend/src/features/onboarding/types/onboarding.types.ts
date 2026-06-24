export interface Onboarding {
  nombreUsuario: string;
  nombreEmprendimiento: string;
  completado: boolean;
}

export interface OnboardingFormData {
  nombreUsuario: string;
  nombreEmprendimiento: string;
  precioKwh: number;

  // Printer profile
  printerName: string;
  printerModel: string;
  consumoW: number;
  nozzleDiameter: number;
  bedShape: string;
  maxPrintHeight: number;

  // Filament profile
  filamentName: string;
  filamentMaterial: string;
  filamentPriceKg: number;
  density: number;
  diameter: number;
  colour: string;

  // Print profile
  layerHeight: number;
  perimeters: number;
  fillDensity: string;
  speedPrint: number;
}
