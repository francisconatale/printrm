package com.printrm.studio.domain.calculo;

import com.printrm.studio.domain.ajustes.AjustesDTO;
import com.printrm.studio.domain.ajustes.AjustesService;
import com.printrm.studio.domain.perfil.FilamentProfile;
import com.printrm.studio.domain.perfil.FilamentProfileRepository;
import com.printrm.studio.domain.perfil.Perfil;
import com.printrm.studio.domain.perfil.PerfilRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CostCalculationService {

    private final AjustesService ajustesService;
    private final PerfilRepository perfilRepository;
    private final FilamentProfileRepository filamentProfileRepository;

    public CostCalculationResult calculateCost(
            Double gramos,
            Integer horas,
            Integer minutos,
            Double insumosExtra,
            UUID printerId,
            UUID filamentId) {

        AjustesDTO ajustes = ajustesService.getAjustes();
        
        Perfil printer = null;
        if (printerId != null) {
            printer = perfilRepository.findById(printerId).orElse(null);
        }

        FilamentProfile filament = null;
        if (filamentId != null) {
            filament = filamentProfileRepository.findById(filamentId).orElse(null);
        }

        return calculate(gramos, horas, minutos, insumosExtra, printer, filament, ajustes);
    }

    public CostCalculationResult calculate(
            Double gramos,
            Integer horas,
            Integer minutos,
            Double insumosExtra,
            Perfil printer,
            FilamentProfile filament,
            AjustesDTO ajustes) {

        double tiempoTotalHoras = (horas != null ? horas : 0) + (minutos != null ? minutos / 60.0 : 0);
        
        // 1. Energía
        double consumoW = (printer != null && printer.getConsumoW() != null) ? printer.getConsumoW() : 120.0;
        double costoEnergia = (consumoW / 1000.0) * tiempoTotalHoras * ajustes.getPreciokWh();

        // 2. Material
        double precioKg = 0.0;
        if (filament != null && filament.getFilamentoPorKg() != null) {
            precioKg = filament.getFilamentoPorKg();
        } else if (printer != null && printer.getFilamentoPorKg() != null) {
            precioKg = printer.getFilamentoPorKg();
        }
        double costoFilamento = ((gramos != null ? gramos : 0) / 1000.0) * precioKg;

        // 3. Subtotal e Insumos
        double subtotal = costoEnergia + costoFilamento + (insumosExtra != null ? insumosExtra : 0.0);
        
        // 4. Margen de Error (Costo Base)
        double costoBase = subtotal * (1 + (ajustes.getMargenError() / 100.0));

        return CostCalculationResult.builder()
                .horas(horas)
                .minutosAdicionales(minutos)
                .gramos(gramos)
                .tiempoTotalHoras(tiempoTotalHoras)
                .costoEnergia(costoEnergia)
                .costoFilamento(costoFilamento)
                .subtotal(subtotal)
                .costoBase(costoBase)
                .build();
    }
}
