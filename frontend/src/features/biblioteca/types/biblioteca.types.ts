export interface PiezaSTL {
  id: string;
  nombre: string;
  filePath: string;
  volumenCm3?: number;
  pesoGramos?: number;
  tiempoEstimado?: string;
  costoBase?: number;
  costoMaterial?: number;
  costoEnergia?: number;
  
  perfilImpresoraNombre?: string;
  perfilFilamentoNombre?: string;
  perfilImpresionNombre?: string;
  
  creadoEn: string;
  imagenBase64?: string;
}

export interface PiezaSTLCreate {
  nombre: string;
  filePath: string;
  volumenCm3?: number;
  pesoGramos?: number;
  tiempoEstimado?: string;
  costoBase?: number;
  
  perfilImpresoraId?: string;
  perfilFilamentoId?: string;
  perfilImpresionId?: string;
  imagenBase64?: string;
}
