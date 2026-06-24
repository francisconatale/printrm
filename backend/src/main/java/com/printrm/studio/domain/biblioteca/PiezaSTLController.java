package com.printrm.studio.domain.biblioteca;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/v1/biblioteca")
@RequiredArgsConstructor
public class PiezaSTLController {

    private final PiezaSTLService service;

    @Value("${studio.base-path}")
    private String basePath;

    @GetMapping
    public Page<PiezaSTLResponseDTO> getAll(@PageableDefault(size = 20) Pageable pageable) {
        return service.getAll(pageable);
    }

    @PostMapping
    public PiezaSTLResponseDTO save(@RequestBody PiezaSTLRequestDTO dto) {
        return service.save(dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }

    @GetMapping("/files/{filename}")
    public ResponseEntity<Resource> getFile(@PathVariable String filename) {
        try {
            String currentBasePath = basePath != null ? basePath : ".";
            Path file = Paths.get(currentBasePath).resolve("saved-uploads").resolve(filename).normalize();
            Resource resource = new UrlResource(file.toUri());

            if (resource.exists() || resource.isReadable()) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                        .contentType(MediaType.APPLICATION_OCTET_STREAM)
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
