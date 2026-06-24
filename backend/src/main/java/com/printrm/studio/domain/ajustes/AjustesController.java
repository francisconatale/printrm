package com.printrm.studio.domain.ajustes;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ajustes")
public class AjustesController {

    private final AjustesService ajustesService;

    public AjustesController(AjustesService ajustesService) {
        this.ajustesService = ajustesService;
    }

    @GetMapping
    public ResponseEntity<AjustesDTO> getAjustes() {
        return ResponseEntity.ok(ajustesService.getAjustes());
    }

    @PutMapping
    public ResponseEntity<AjustesDTO> updateAjustes(@jakarta.validation.Valid @RequestBody AjustesDTO dto) {
        return ResponseEntity.ok(ajustesService.updateAjustes(dto));
    }
}
