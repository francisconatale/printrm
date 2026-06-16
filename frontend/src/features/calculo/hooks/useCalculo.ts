import React from 'react';
import { useAjustes } from '../../ajustes/hooks/useAjustes';
import { usePerfilActivo } from '../../perfiles/hooks/usePerfilActivo';
import { Perfil, FilamentProfile } from '../../perfiles/types/perfiles.types';
import { PiezaInput, ResultadoCalculo } from '../types/calculo.types';
import { MODELOS_IMPRESORA } from '../../perfiles/data/modelos-impresora';
import * as utils from '../utils/calculos.utils';
import { Ajustes } from '../../ajustes/types/ajustes.types';

export const calculatePrecioSugerido = (
  gramos: number,
  horas: number,
  minutos: number,
  insumosExtra: number,
  multiplicador: number,
  printer: Perfil | null,
  filament: FilamentProfile | null,
  ajustes: Ajustes | null
): ResultadoCalculo | null => {
  if (!printer) return null;

  // Fallback values from model data if missing in profile
  const modeloData = MODELOS_IMPRESORA.find(m => m.nombre === printer.modeloImpresora) || MODELOS_IMPRESORA[MODELOS_IMPRESORA.length - 1];
  
  const consumoW = printer.consumoW ?? modeloData.consumoW;
  const vidaUtilHoras = printer.vidaUtilHoras ?? modeloData.vidaUtilHoras;
  const costoRepuestos = printer.costoRepuestos ?? modeloData.costoRepuestos;

  // Si no hay ajustes, usamos valores por defecto seguros para no bloquear el cálculo
  const config = ajustes || {
    preciokWh: 0,
    margenError: 10
  };

  const tiempoTotalHoras = utils.calcularTiempo(horas, minutos);
  const costoEnergia = utils.calcularCostoEnergia(consumoW, tiempoTotalHoras, config.preciokWh);
  
  // Filament cost: filament profile > printer profile > 0
  const filamentoPorKg = filament ? filament.filamentoPorKg : (printer.filamentoPorKg || 0);
  const costoFilamento = utils.calcularCostoFilamento(gramos, filamentoPorKg);
  
  const costoDesgaste = utils.calcularCostoDesgaste(
    costoRepuestos,
    vidaUtilHoras || 1,
    tiempoTotalHoras
  );
  
  const subtotal = costoEnergia + costoFilamento + costoDesgaste + insumosExtra;
  const costoBase = utils.calcularCostoBase(subtotal, config.margenError);
  const precioVenta = utils.calcularPrecioVenta(costoBase, multiplicador);

  return {
    horas,
    minutosAdicionales: minutos,
    gramos,
    tiempoTotalHoras,
    costoEnergia,
    costoFilamento,
    costoDesgaste,
    subtotal,
    costoBase,
    precioVenta
  };
};

export const useCalculo = (
  input: PiezaInput,
  printerOverride?: Perfil | null,
  filamentOverride?: FilamentProfile | null
) => {
  const { ajustes } = useAjustes();
  const { perfilActivo } = usePerfilActivo();

  const resultado = React.useMemo((): ResultadoCalculo | null => {
    const printer = printerOverride || perfilActivo;
    return calculatePrecioSugerido(
      input.gramos,
      input.horas,
      input.minutosAdicionales,
      input.insumosExtra,
      input.multiplicador,
      printer,
      filamentOverride || null,
      ajustes || null
    );
  }, [input, ajustes, perfilActivo, printerOverride, filamentOverride]);

  return resultado;
};
