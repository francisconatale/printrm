import React from 'react';
import { usePerfilActivo } from '../../perfiles/hooks/usePerfilActivo';
import { PiezaInput, ResultadoCalculo } from '../types/calculo.types';
import * as utils from '../utils/calculos.utils';

export const useCalculo = (input: PiezaInput) => {
  const { perfilActivo } = usePerfilActivo();

  const resultado = React.useMemo((): ResultadoCalculo | null => {
    if (!perfilActivo) return null;

    const tiempoTotalHoras = utils.calcularTiempo(input.horas, input.minutosAdicionales);
    const costoEnergia = utils.calcularCostoEnergia(perfilActivo.consumoW, tiempoTotalHoras, perfilActivo.preciokWh);
    const costoFilamento = utils.calcularCostoFilamento(input.gramos, perfilActivo.filamentoPorKg);
    const costoDesgaste = utils.calcularCostoDesgaste(perfilActivo.costoRepuestos, perfilActivo.vidaUtilHoras, tiempoTotalHoras);
    
    const subtotal = costoEnergia + costoFilamento + costoDesgaste + input.insumosExtra;
    const costoBase = utils.calcularCostoBase(subtotal, perfilActivo.margenError);
    const precioVenta = utils.calcularPrecioVenta(costoBase, input.multiplicador);

    return {
      tiempoTotalHoras,
      costoEnergia,
      costoFilamento,
      costoDesgaste,
      subtotal,
      costoBase,
      precioVenta
    };
  }, [input, perfilActivo]);

  return resultado;
};
