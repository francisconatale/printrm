import { PiezaInput, ResultadoCalculo } from '../../calculo/types/calculo.types';

export interface ExportData {
  perfilNombre: string;
  input: PiezaInput;
  resultado: ResultadoCalculo;
  insumosExtra: number;
}

/**
 * Genera un resumen de texto formateado para copiar al portapapeles o enviar por WhatsApp.
 */
export function generarResumenTexto(data: ExportData): string {
  const { perfilNombre, input, resultado, insumosExtra } = data;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
    }).format(value);

  const horas = Math.floor(resultado.tiempoTotalHoras);
  const minutos = Math.round((resultado.tiempoTotalHoras - horas) * 60);

  return [
    `Calculadora 3D — ${perfilNombre}`,
    `Tiempo: ${horas}h ${minutos}min | Filamento: ${input.gramos}g`,
    `─────────────────────────────`,
    `Energía:    ${formatCurrency(resultado.costoEnergia)}`,
    `Filamento:  ${formatCurrency(resultado.costoFilamento)}`,
    `Máquina:    ${formatCurrency(resultado.costoDesgaste)}`,
    `Insumos:    ${formatCurrency(insumosExtra)}`,
    `Costo base: ${formatCurrency(resultado.costoBase)}`,
    `─────────────────────────────`,
    `💰 Precio de venta: ${formatCurrency(resultado.precioVenta)} (x${input.multiplicador})`,
  ].join('\n');
}

/**
 * Copia un texto al portapapeles utilizando la Clipboard API.
 */
export async function copiarAlPortapapeles(texto: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(texto);
      return true;
    } else {
      // Fallback para contextos no seguros o navegadores viejos
      const textArea = document.createElement('textarea');
      textArea.value = texto;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      textArea.style.top = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    }
  } catch (err) {
    console.error('Error al copiar al portapapeles:', err);
    return false;
  }
}
