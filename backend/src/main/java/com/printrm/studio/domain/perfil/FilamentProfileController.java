package com.printrm.studio.domain.perfil;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/filament-profiles")
@RequiredArgsConstructor
public class FilamentProfileController {

    private final FilamentProfileService service;

    @GetMapping
    public List<FilamentProfileResponseDTO> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public FilamentProfileResponseDTO findById(@PathVariable UUID id) {
        return service.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public FilamentProfileResponseDTO create(@Valid @RequestBody FilamentProfileRequestDTO dto) {
        return service.create(dto);
    }

    @PutMapping("/{id}")
    public FilamentProfileResponseDTO update(@PathVariable UUID id, @Valid @RequestBody FilamentProfileRequestDTO dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        service.delete(id);
    }
}
