package com.calc3d.domain.perfil;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/perfiles")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PerfilController {

    private final PerfilService service;

    @GetMapping
    public List<PerfilResponseDTO> findAll() {
        return service.findAll();
    }

    @GetMapping("/configs")
    public Map<String, List<String>> getSlicerConfigs() {
        return service.getSlicerConfigs();
    }

    @GetMapping("/{id}")
    public PerfilResponseDTO findById(@PathVariable UUID id) {
        return service.findById(id);
    }


    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PerfilResponseDTO create(@Valid @RequestBody PerfilRequestDTO dto) {
        return service.create(dto);
    }

    @PutMapping("/{id}")
    public PerfilResponseDTO update(@PathVariable UUID id, @Valid @RequestBody PerfilRequestDTO dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        service.delete(id);
    }
}
