package com.printrm.studio.domain.calculo;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/calculos")
@RequiredArgsConstructor
public class CalculoController {
    private final CalculoService calculoService;
    private final CostCalculationService costCalculationService;

    @GetMapping
    public List<CalculoResponseDTO> getHistorial() {
        return calculoService.getHistorial();
    }

    @PostMapping("/calculate")
    public CostCalculationResult calculateCost(@RequestBody CalculoRequestDTO request) {
        return costCalculationService.calculateCost(
            request.getGramos(),
            request.getHoras(),
            request.getMinutosAdicionales(),
            request.getInsumosExtra(),
            request.getPerfilId(),
            null // Standard filament logic can be extended if needed
        );
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CalculoResponseDTO guardarCalculo(@RequestBody @Valid CalculoRequestDTO request) {
        return calculoService.guardarCalculo(request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminarCalculo(@PathVariable UUID id) {
        calculoService.eliminarCalculo(id);
    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void limpiarHistorial() {
        calculoService.limpiarHistorial();
    }
}
