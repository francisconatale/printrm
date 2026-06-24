import { parseISO } from 'date-fns/parseISO';
import { format } from 'date-fns/format';
import { es } from 'date-fns/locale/es';

export function fmtDate(dateStr: string, fmt: string = 'dd/MM/yyyy HH:mm'): string {
  return format(parseISO(dateStr), fmt, { locale: es });
}

export function fmtDateShort(dateStr: string): string {
  return fmtDate(dateStr, 'dd/MM/yyyy');
}

export function fmtDateFull(dateStr: string): string {
  return fmtDate(dateStr, "dd 'de' MMMM, yyyy");
}

export function fmtDateTime(dateStr: string): string {
  return fmtDate(dateStr, 'dd/MM/yyyy HH:mm');
}

export const formatCurrency = (value: number) => {
  const absValue = Math.abs(value);
  const formatted = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(absValue);
  return value < 0 ? `- ${formatted}` : formatted;
};
