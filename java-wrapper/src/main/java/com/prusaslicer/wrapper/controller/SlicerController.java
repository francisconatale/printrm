package com.prusaslicer.wrapper.controller;

import com.prusaslicer.wrapper.service.SlicerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api")
public class SlicerController {

    @Autowired
    private SlicerService slicerService;

    private static final String UPLOAD_DIR = "temp-uploads/";

    @PostMapping("/slice")
    public ResponseEntity<?> sliceStl(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "config", required = false) String configName) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("No file uploaded");
        }

        try {
            // Ensure upload directory exists
            File uploadDir = new File(UPLOAD_DIR);
            if (!uploadDir.exists()) uploadDir.mkdirs();

            // Save uploaded STL
            Path path = Paths.get(UPLOAD_DIR + file.getOriginalFilename());
            Files.write(path, file.getBytes());

            // Resolve config path if provided
            String configPath = null;
            if (configName != null && !configName.isEmpty()) {
                configPath = "../configs/" + configName;
                if (!configName.endsWith(".ini")) configPath += ".ini";
            }

            // Execute slicing
            SlicerService.SlicingResult result = slicerService.slice(path.toString(), null, configPath);

            return ResponseEntity.ok(result);

        } catch (IOException | InterruptedException e) {
            return ResponseEntity.internalServerError().body("Error during slicing: " + e.getMessage());
        }
    }
}
