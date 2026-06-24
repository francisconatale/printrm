export const mockProducto = {
  id: 'mock-1',
  nombre: 'Maceta Groot Pequeña',
  descripcion: 'Maceta decorativa impresa en PLA Wood. Alta resolución.',
  cantidadStock: 15,
  precioSugerido: 4500,
  currentProductionCost: 850,
  imagenUrl: '' // Will show placeholder if empty
};

export const formatCurrency = (val: number) => 
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(val);
