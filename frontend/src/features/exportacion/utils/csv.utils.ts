import { ExportData } from './clipboard.utils';

/**
 * Genera el contenido de un archivo CSV a partir de los datos de exportación.
 */
export function generarContenidoCSV(data: ExportData): string {
  const headers = [
    'fecha',
    'perfil',
    'horas',
    'minutos',
    'gramos',
    'insumos_extra',
    'multiplicador',
    'costo_energia',
    'costo_filamento',
    'costo_desgaste',
    'subtotal',
    'costo_base',
    'precio_venta',
  ];

  const horas = Math.floor(data.resultado.tiempoTotalHoras);
  const minutos = Math.round((data.resultado.tiempoTotalHoras - horas) * 60);

  const row = [
    new Date().toISOString(),
    data.perfilNombre,
    horas,
    minutos,
    data.input.gramos,
    data.insumosExtra,
    data.input.multiplicador,
    data.resultado.costoEnergia,
    data.resultado.costoFilamento,
    data.resultado.costoDesgaste,
    data.resultado.subtotal,
    data.resultado.costoBase,
    data.resultado.precioVenta,
  ];

  // Convertir a string CSV (usando coma como separador)
  return [
    headers.join(','),
    row.map((val) => (typeof val === 'string' ? `"${val}"` : val)).join(','),
  ].join('\n');
}

/**
 * Genera un archivo CSV con el desglose del cálculo y dispara la descarga.
 */
export function exportarACSV(data: ExportData): void {
  const csvContent = generarContenidoCSV(data);

  // Agregar UTF-8 BOM para Excel
  const blob = new Blob(['\ufeff' + csvContent], {
    type: 'text/csv;charset=utf-8;',
  });
  const url = URL.createObjectURL(blob);

  // Crear link de descarga
  const link = document.createElement('a');
  const timestamp = new Date().getTime();
  link.setAttribute('href', url);
  link.setAttribute('download', `calculo_${timestamp}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
