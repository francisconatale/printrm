import { describe, it, expect } from 'vitest';
import {
  calcularTiempo,
  calcularCostoEnergia,
  calcularCostoFilamento,
  calcularCostoDesgaste,
  calcularCostoBase,
  calcularPrecioVenta,
} from './calculos.utils';

describe('Calculos Utils', () => {
  describe('calcularTiempo', () => {
    it('debe calcular correctamente horas y minutos', () => {
      expect(calcularTiempo(1, 30)).toBe(1.5);
      expect(calcularTiempo(0, 45)).toBe(0.75);
      expect(calcularTiempo(2, 0)).toBe(2);
    });

    it('debe manejar ceros', () => {
      expect(calcularTiempo(0, 0)).toBe(0);
    });
  });

  describe('calcularCostoEnergia', () => {
    it('debe calcular el costo de energía correctamente', () => {
      // 200W, 1h, $100/kWh -> (200/1000) * 1 * 100 = 20
      expect(calcularCostoEnergia(200, 1, 100)).toBe(20);
    });

    it('debe manejar decimales', () => {
      // 150.5W, 2.5h, $50.5/kWh
      const result = calcularCostoEnergia(150.5, 2.5, 50.5);
      expect(result).toBeCloseTo(18.999375);
    });
  });

  describe('calcularCostoFilamento', () => {
    it('debe calcular el costo de filamento correctamente', () => {
      // 500g, $10000/kg -> (500/1000) * 10000 = 5000
      expect(calcularCostoFilamento(500, 10000)).toBe(5000);
    });

    it('debe manejar valores pequeños', () => {
      expect(calcularCostoFilamento(1, 10000)).toBe(10);
    });
  });

  describe('calcularCostoDesgaste', () => {
    it('debe calcular el costo de desgaste correctamente', () => {
      // $50000 repuestos, 5000h vida útil, 10h uso -> (50000/5000) * 10 = 100
      expect(calcularCostoDesgaste(50000, 5000, 10)).toBe(100);
    });

    it('debe retornar 0 si la vida útil es 0 para evitar división por cero', () => {
      expect(calcularCostoDesgaste(50000, 0, 10)).toBe(0);
    });
  });

  describe('calcularCostoBase', () => {
    it('debe aplicar el margen de error correctamente', () => {
      // $1000 subtotal, 10% margen -> 1000 * 1.1 = 1100
      expect(calcularCostoBase(1000, 10)).toBe(1100);
    });

    it('debe manejar margen de 0%', () => {
      expect(calcularCostoBase(1000, 0)).toBe(1000);
    });
  });

  describe('calcularPrecioVenta', () => {
    it('debe aplicar el multiplicador correctamente', () => {
      // $1100 costo base, 3x multiplicador -> 3300
      expect(calcularPrecioVenta(1100, 3)).toBe(3300);
    });

    it('debe manejar multiplicadores decimales', () => {
      expect(calcularPrecioVenta(1000, 2.5)).toBe(2500);
    });
  });
});
