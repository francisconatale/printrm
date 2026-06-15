package com.printrm.studio.domain.biblioteca;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/biblioteca")
@RequiredArgsConstructor
public class PiezaSTLController {

    private final PiezaSTLService service;

    @GetMapping
    public List<PiezaSTLResponseDTO> getAll() {
        return service.getAll();
    }

    @PostMapping
    public PiezaSTLResponseDTO save(@RequestBody PiezaSTLRequestDTO dto) {
        return service.save(dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
}
