import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generarContenidoCSV } from './csv.utils';
import { ExportData } from './clipboard.utils';

describe('CSV Utils', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-15T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('generarContenidoCSV', () => {
    it('debe generar el contenido CSV correctamente', () => {
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
          horas: 2,
          minutosAdicionales: 30,
          gramos: 50,
          tiempoTotalHoras: 2.5,
          costoEnergia: 50,
          costoFilamento: 200,
          costoDesgaste: 20,
          subtotal: 370,
          costoBase: 407,
          precioVenta: 1221,
        },
        insumosExtra: 100,
      };

      const csv = generarContenidoCSV(data);
      const lines = csv.split('\n');

      expect(lines[0]).toBe(
        'fecha,perfil,horas,minutos,gramos,insumos_extra,multiplicador,costo_energia,costo_filamento,costo_desgaste,subtotal,costo_base,precio_venta'
      );
      expect(lines[1]).toContain('"2026-06-15T12:00:00.000Z"');
      expect(lines[1]).toContain('"Prusa MK3S"');
      expect(lines[1]).toContain('2,30,50,100,3,50,200,20,370,407,1221');
    });
  });
});
