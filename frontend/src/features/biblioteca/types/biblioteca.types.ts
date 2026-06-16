export interface PiezaSTL {
  id: string;
  nombre: string;
  filePath: string;
  volumenCm3?: number;
  pesoGramos?: number;
  tiempoEstimado?: string;
  
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
  
  perfilImpresoraId?: string;
  perfilFilamentoId?: string;
  perfilImpresionId?: string;
  imagenBase64?: string;
}
