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
        
        double precioKwh = 0.15;
        double margenError = 0.0;
        if (ajustes != null) {
            if (ajustes.getPreciokWh() != null) {
                precioKwh = ajustes.getPreciokWh();
            }
            if (ajustes.getMargenError() != null) {
                margenError = ajustes.getMargenError();
            }
        }

        // 1. Energía
        double consumoW = (printer != null && printer.getConsumoW() != null) ? printer.getConsumoW() : 120.0;
        double costoEnergia = (consumoW / 1000.0) * tiempoTotalHoras * precioKwh;

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
        double costoError = costoFilamento * (margenError / 100.0);
        double costoBase = subtotal + costoError;

        return CostCalculationResult.builder()
                .horas(horas)
                .minutosAdicionales(minutos)
                .gramos(gramos)
                .tiempoTotalHoras(tiempoTotalHoras)
                .costoEnergia(costoEnergia)
                .costoFilamento(costoFilamento)
                .costoError(costoError)
                .subtotal(subtotal)
                .costoBase(costoBase)
                .build();
    }

    public CostCalculationResult calculateForProducto(com.printrm.studio.domain.stock.Producto producto, AjustesDTO ajustes) {
        Double totalFilamento = 0.0;
        Double totalEnergia = 0.0;
        Double totalError = 0.0;
        Double totalBase = 0.0;
        
        for (com.printrm.studio.domain.biblioteca.PiezaSTL pieza : producto.getPartes()) {
            CostCalculationResult res = calculate(
                pieza.getPesoGramos(),
                parseHours(pieza.getTiempoEstimado()),
                parseMinutes(pieza.getTiempoEstimado()),
                0.0,
                pieza.getPerfilPreferido(),
                pieza.getFilamentoPreferido(),
                ajustes
            );
            totalFilamento += res.getCostoFilamento();
            totalEnergia += res.getCostoEnergia();
            totalError += (res.getCostoError() != null ? res.getCostoError() : 0.0);
            totalBase += res.getCostoBase();
        }

        return CostCalculationResult.builder()
                .costoFilamento(totalFilamento)
                .costoEnergia(totalEnergia)
                .costoError(totalError)
                .costoBase(totalBase)
                .build();
    }

    public Integer parseHours(String time) {
        if (time == null) return 0;
        try {
            String h = time.split("h")[0].trim();
            return Integer.parseInt(h);
        } catch (Exception e) { return 0; }
    }

    public Integer parseMinutes(String time) {
        if (time == null || !time.contains("h")) return 0;
        try {
            String m = time.split("h")[1].replace("m", "").trim();
            return Integer.parseInt(m);
        } catch (Exception e) { return 0; }
    }
}
