import React from 'react';
import { useAjustes } from '../../ajustes/hooks/useAjustes';
import { usePerfilActivo } from '../../perfiles/hooks/usePerfilActivo';
import { Perfil, FilamentProfile } from '../../perfiles/types/perfiles.types';
import { PiezaInput, ResultadoCalculo } from '../types/calculo.types';
import * as utils from '../utils/calculos.utils';

export const useCalculo = (
  input: PiezaInput,
  printerOverride?: Perfil | null,
  filamentOverride?: FilamentProfile | null
) => {
  const { ajustes } = useAjustes();
  const { perfilActivo } = usePerfilActivo();

  const resultado = React.useMemo((): ResultadoCalculo | null => {
    // We need at least one printer profile to perform wear and energy calculation
    const printer = printerOverride || perfilActivo;
    if (!printer) return null;

    // Si no hay ajustes, usamos valores por defecto seguros para no bloquear el cálculo
    const config = ajustes || {
      preciokWh: 0,
      filamentoPorKg: 0,
      margenError: 10
    };

    const tiempoTotalHoras = utils.calcularTiempo(input.horas, input.minutosAdicionales);
    const costoEnergia = utils.calcularCostoEnergia(printer.consumoW, tiempoTotalHoras, config.preciokWh);
    
    // Filament cost is taken from the selected filament profile, falling back to global settings
    const filamentoPorKg = filamentOverride ? filamentOverride.filamentoPorKg : config.filamentoPorKg;
    const costoFilamento = utils.calcularCostoFilamento(input.gramos, filamentoPorKg);
    
    const costoDesgaste = utils.calcularCostoDesgaste(
      printer.costoRepuestos || 0,
      printer.vidaUtilHoras || 1,
      tiempoTotalHoras
    );
    
    const subtotal = costoEnergia + costoFilamento + costoDesgaste + input.insumosExtra;
    const costoBase = utils.calcularCostoBase(subtotal, config.margenError);
    const precioVenta = utils.calcularPrecioVenta(costoBase, input.multiplicador);

    return {
      horas: input.horas,
      minutosAdicionales: input.minutosAdicionales,
      gramos: input.gramos,
      tiempoTotalHoras,
      costoEnergia,
      costoFilamento,
      costoDesgaste,
      subtotal,
      costoBase,
      precioVenta
    };
  }, [input, ajustes, perfilActivo, printerOverride, filamentOverride]);

  return resultado;
};
