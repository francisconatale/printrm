export interface Onboarding {
  nombreUsuario: string;
  nombreEmprendimiento: string;
  completado: boolean;
}

export interface OnboardingFormData {
  nombreUsuario: string;
  nombreEmprendimiento: string;
  precioKwh: number;
  printerName: string;
  printerModel: string;
  consumoW: number;
  filamentName: string;
  filamentMaterial: string;
  filamentPriceKg: number;
}
