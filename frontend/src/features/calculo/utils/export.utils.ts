import { ResultadoCalculo } from '../types/calculo.types';
import { formatCurrency } from '../../../lib/utils';

/**
 * Genera el texto plano para compartir el resumen del cálculo.
 */
export function generateSummaryText(
  perfilNombre: string, 
  resultado: ResultadoCalculo, 
  multiplicador: number,
  insumosExtra: number
): string {
  const line = '─────────────────────────────';
  return [
    `Calculadora 3D — ${perfilNombre}`,
    `Tiempo: ${resultado.horas}h ${resultado.minutosAdicionales}min | Filamento: ${resultado.gramos}g`,
    line,
    `Energía:    ${formatCurrency(resultado.costoEnergia)}`,
    `Filamento:  ${formatCurrency(resultado.costoFilamento)}`,
    ...(resultado.costoError > 0 ? [`Margen Error: ${formatCurrency(resultado.costoError)}`] : []),
    `Máquina:    ${formatCurrency(resultado.costoDesgaste)}`,
    `Insumos:    ${formatCurrency(insumosExtra)}`,
    `Costo base: ${formatCurrency(resultado.costoBase)}`,
    line,
    `💰 Precio de venta: ${formatCurrency(resultado.precioVenta)} (x${multiplicador})`
  ].join('\n');
}

/**
 * Copia el texto proporcionado al portapapeles.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback para contextos no seguros
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        textArea.remove();
        return true;
      } catch (err) {
        textArea.remove();
        return false;
      }
    }
  } catch (err) {
    console.error('Error al copiar al portapapeles:', err);
    return false;
  }
}

/**
 * Comparte el texto vía WhatsApp.
 */
export function shareWhatsApp(text: string): void {
  const encodedText = encodeURIComponent(text);
  window.open(`https://wa.me/?text=${encodedText}`, '_blank');
}

/**
 * Descarga un archivo CSV con el desglose del cálculo.
 */
export function downloadCSV(
  perfilNombre: string, 
  resultado: ResultadoCalculo, 
  multiplicador: number,
  insumosExtra: number
): void {
  const headers = [
    'fecha', 'perfil', 'horas', 'minutos', 'gramos', 'insumos_extra', 'multiplicador',
    'costo_energia', 'costo_filamento', 'costo_error', 'costo_desgaste', 'subtotal', 'costo_base', 'precio_venta'
  ].join(',');

  const date = new Date().toISOString();
  const row = [
    date,
    `"${perfilNombre}"`,
    resultado.horas,
    resultado.minutosAdicionales,
    resultado.gramos,
    insumosExtra,
    multiplicador,
    resultado.costoEnergia,
    resultado.costoFilamento,
    resultado.costoError,
    resultado.costoDesgaste,
    resultado.subtotal,
    resultado.costoBase,
    resultado.precioVenta
  ].join(',');

  const csvContent = '\uFEFF' + headers + '\n' + row;
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `calculo_${new Date().getTime()}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
