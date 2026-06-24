package com.printrm.studio.domain.perfil;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/perfiles")
@RequiredArgsConstructor
public class PerfilController {

    private final PerfilService service;

    @GetMapping
    public Page<PerfilResponseDTO> findAll(@PageableDefault(size = 20) Pageable pageable) {
        return service.findAll(pageable);
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

