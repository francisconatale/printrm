import { describe, it, expect } from 'vitest';
import { generarUrlWhatsApp } from './whatsapp.utils';

describe('WhatsApp Utils', () => {
  describe('generarUrlWhatsApp', () => {
    it('debe generar la URL de WhatsApp correctamente encoded', () => {
      const texto = 'Hola Mundo';
      const url = generarUrlWhatsApp(texto);
      expect(url).toBe('https://wa.me/?text=Hola%20Mundo');
    });

    it('debe manejar caracteres especiales', () => {
      const texto = 'Precio: $100';
      const url = generarUrlWhatsApp(texto);
      expect(url).toBe('https://wa.me/?text=Precio%3A%20%24100');
    });
  });
});
