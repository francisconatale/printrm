package com.calc3d.domain.calculo;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CalculoService {
    private final CalculoRepository calculoRepository;

    @Transactional(readOnly = true)
    public List<CalculoResponseDTO> getHistorial() {
        return calculoRepository.findTop50ByOrderByTimestampDesc()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public CalculoResponseDTO guardarCalculo(CalculoRequestDTO request) {
        Calculo calculo = Calculo.builder()
                .perfilId(request.getPerfilId())
                .perfilNombre(request.getPerfilNombre())
                .horas(request.getHoras())
                .minutosAdicionales(request.getMinutosAdicionales() != null ? request.getMinutosAdicionales() : 0)
                .gramos(request.getGramos())
                .insumosExtra(request.getInsumosExtra() != null ? request.getInsumosExtra() : 0.0)
                .multiplicador(request.getMultiplicador())
                .costoEnergia(request.getCostoEnergia())
                .costoFilamento(request.getCostoFilamento())
                .costoDesgaste(request.getCostoDesgaste())
                .subtotal(request.getSubtotal())
                .costoBase(request.getCostoBase())
                .precioVenta(request.getPrecioVenta())
                .build();

        Calculo saved = calculoRepository.save(calculo);
        return mapToResponse(saved);
    }

    @Transactional
    public void eliminarCalculo(UUID id) {
        calculoRepository.deleteById(id);
    }

    @Transactional
    public void limpiarHistorial() {
        calculoRepository.deleteAll();
    }

    private CalculoResponseDTO mapToResponse(Calculo entity) {
        return CalculoResponseDTO.builder()
                .id(entity.getId())
                .timestamp(entity.getTimestamp())
                .perfilId(entity.getPerfilId())
                .perfilNombre(entity.getPerfilNombre())
                .horas(entity.getHoras())
                .minutosAdicionales(entity.getMinutosAdicionales())
                .gramos(entity.getGramos())
                .insumosExtra(entity.getInsumosExtra())
                .multiplicador(entity.getMultiplicador())
                .costoEnergia(entity.getCostoEnergia())
                .costoFilamento(entity.getCostoFilamento())
                .costoDesgaste(entity.getCostoDesgaste())
                .subtotal(entity.getSubtotal())
                .costoBase(entity.getCostoBase())
                .precioVenta(entity.getPrecioVenta())
                .build();
    }
}
