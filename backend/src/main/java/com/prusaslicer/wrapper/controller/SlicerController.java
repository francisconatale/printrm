package com.prusaslicer.wrapper.controller;

import com.prusaslicer.wrapper.service.SlicerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
public class SlicerController {

    @Autowired
    private SlicerService slicerService;
    
    @Value("${studio.base-path}")
    private String basePath;

    private static final String UPLOAD_DIR = "temp-uploads/";

    @PostMapping("/slice")
    public ResponseEntity<?> sliceStl(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "printConfig", required = false) String printConfig,
            @RequestParam(value = "filamentConfig", required = false) String filamentConfig,
            @RequestParam(value = "printerConfig", required = false) String printerConfig) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("No file uploaded");
        }

        try {
            // Ensure upload directory exists
            File uploadDir = new File(basePath + "/" + UPLOAD_DIR);
            if (!uploadDir.exists()) uploadDir.mkdirs();

            // Save uploaded STL
            Path path = Paths.get(basePath + "/" + UPLOAD_DIR + file.getOriginalFilename());
            Files.write(path, file.getBytes());

            // Resolve config paths
            List<String> configPaths = new ArrayList<>();
            addConfigPath(configPaths, "print/", printConfig);
            addConfigPath(configPaths, "filament/", filamentConfig);
            addConfigPath(configPaths, "printer/", printerConfig);

            // Execute slicing
            SlicerService.SlicingResult result = slicerService.slice(path.toString(), null, configPaths);

            return ResponseEntity.ok(result);

        } catch (IOException | InterruptedException e) {
            return ResponseEntity.internalServerError().body("Error during slicing: " + e.getMessage());
        }
    }

    private void addConfigPath(List<String> list, String subDir, String name) {
        if (name != null && !name.isEmpty()) {
            String fullPath = basePath + "/configs/" + subDir + name;
            if (!name.endsWith(".ini")) fullPath += ".ini";
            list.add(fullPath);
        }
    }
}
