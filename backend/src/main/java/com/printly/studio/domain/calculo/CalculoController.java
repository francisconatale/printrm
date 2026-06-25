package com.printly.studio.domain.calculo;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/calculos")
@RequiredArgsConstructor
public class CalculoController {
    private final CostCalculationService costCalculationService;

    @PostMapping("/calculate")
    public CostCalculationResult calculateCost(@RequestBody CalculoRequestDTO request) {
        return costCalculationService.calculateCost(
            request.getGramos(),
            request.getHoras(),
            request.getMinutosAdicionales(),
            request.getInsumosExtra(),
            request.getPerfilId(),
            request.getFilamentId()
        );
    }
}
