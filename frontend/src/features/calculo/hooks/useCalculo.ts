import React from 'react';
import { useAjustes } from '../../ajustes/hooks/useAjustes';
import { usePerfilActivo } from '../../perfiles/hooks/usePerfilActivo';
import { PiezaInput, ResultadoCalculo } from '../types/calculo.types';
import * as utils from '../utils/calculos.utils';

export const useCalculo = (input: PiezaInput) => {
  const { ajustes } = useAjustes();
  const { perfilActivo } = usePerfilActivo();

  const resultado = React.useMemo((): ResultadoCalculo | null => {
    if (!perfilActivo) return null;

    // Si no hay ajustes, usamos valores por defecto seguros para no bloquear el cálculo
    const config = ajustes || {
      preciokWh: 0,
      filamentoPorKg: 0,
      costoRepuestos: 0,
      vidaUtilHoras: 10000,
      margenError: 10
    };

    const tiempoTotalHoras = utils.calcularTiempo(input.horas, input.minutosAdicionales);
    const costoEnergia = utils.calcularCostoEnergia(perfilActivo.consumoW, tiempoTotalHoras, config.preciokWh);
    const costoFilamento = utils.calcularCostoFilamento(input.gramos, config.filamentoPorKg);
    const costoDesgaste = utils.calcularCostoDesgaste(config.costoRepuestos, config.vidaUtilHoras, tiempoTotalHoras);
    
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
  }, [input, ajustes, perfilActivo]);

  return resultado;
};
