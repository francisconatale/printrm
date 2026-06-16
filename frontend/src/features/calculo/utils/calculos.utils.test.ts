import { describe, it, expect } from 'vitest';
import { parseEstimatedTime } from './calculos.utils';

describe('parseEstimatedTime', () => {
  it('debe parsear correctamente horas y minutos combinados', () => {
    expect(parseEstimatedTime('2h 30m')).toEqual({ horas: 2, minutos: 30 });
  });

  it('debe parsear solo horas', () => {
    expect(parseEstimatedTime('3h')).toEqual({ horas: 3, minutos: 0 });
  });

  it('debe parsear solo minutos', () => {
    expect(parseEstimatedTime('45m')).toEqual({ horas: 0, minutos: 45 });
  });

  it('debe retornar ceros para valores vacíos o mal formados', () => {
    expect(parseEstimatedTime('')).toEqual({ horas: 0, minutos: 0 });
    expect(parseEstimatedTime('xyz')).toEqual({ horas: 0, minutos: 0 });
  });
});
