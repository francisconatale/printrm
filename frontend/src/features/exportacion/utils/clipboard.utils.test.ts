import { describe, it, expect } from 'vitest';
import { generarResumenTexto, ExportData } from './clipboard.utils';

describe('Clipboard Utils', () => {
  describe('generarResumenTexto', () => {
    it('debe generar un resumen de texto correctamente formateado', () => {
      const data: ExportData = {
        perfilNombre: 'Prusa MK3S',
        input: {
          horas: 2,
          minutosAdicionales: 30,
          gramos: 50,
          insumosExtra: 100,
          multiplicador: 3,
        },
        resultado: {
          tiempoTotalHoras: 2.5,
          costoEnergia: 50,
          costoFilamento: 200,
          costoDesgaste: 20,
          subtotal: 370,
          costoBase: 407, // 370 * 1.1 (suponiendo 10% margen error en el flujo real)
          precioVenta: 1221,
        },
        insumosExtra: 100,
      };

      const resumen = generarResumenTexto(data);

      expect(resumen).toContain('Calculadora 3D — Prusa MK3S');
      expect(resumen).toContain('Tiempo: 2h 30min | Filamento: 50g');
      expect(resumen).toContain('Energía:');
      expect(resumen).toContain('Filamento:');
      expect(resumen).toContain('Máquina:');
      expect(resumen).toContain('Insumos:');
      expect(resumen).toContain('Costo base:');
      expect(resumen).toContain('💰 Precio de venta:');
      expect(resumen).toContain('(x3)');
    });
  });
});
