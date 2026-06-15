/**
 * Genera una URL para compartir el resumen en WhatsApp.
 */
export function generarUrlWhatsApp(texto: string): string {
  const encodedText = encodeURIComponent(texto);
  return `https://wa.me/?text=${encodedText}`;
}

/**
 * Abre WhatsApp Web en una nueva pestaña con el texto pre-cargado.
 */
export function compartirPorWhatsApp(texto: string): void {
  const url = generarUrlWhatsApp(texto);
  window.open(url, '_blank');
}
