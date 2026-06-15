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

    @GetMapping
    public List<CalculoResponseDTO> getHistorial() {
        return calculoService.getHistorial();
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

