export interface Cliente {
  id: string;
  nombre: string;
  email?: string;
  telefono?: string;
  notas?: string;
  fechaCreacion: string;
}

export interface ClienteCreate {
  nombre: string;
  email?: string;
  telefono?: string;
  notas?: string;
}

export interface ClienteUpdate extends Partial<ClienteCreate> {
  id: string;
}
