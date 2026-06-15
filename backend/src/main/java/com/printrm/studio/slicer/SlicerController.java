package com.printrm.studio.slicer;

import com.printrm.studio.domain.perfil.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileWriter;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class SlicerController {

    @Autowired
    private SlicerService slicerService;

    @Autowired
    private PerfilRepository perfilRepository;

    @Autowired
    private FilamentProfileRepository filamentProfileRepository;

    @Autowired
    private PrintProfileRepository printProfileRepository;
    
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

        File tempConfigFile = null;
        try {
            // Ensure upload directory exists
            File uploadDir = new File(basePath + "/" + UPLOAD_DIR);
            if (!uploadDir.exists()) uploadDir.mkdirs();

            // Save uploaded STL
            Path path = Paths.get(basePath + "/" + UPLOAD_DIR + file.getOriginalFilename());
            Files.write(path, file.getBytes());

            // Resolve config paths
            List<String> configPaths = new ArrayList<>();
            
            boolean isDbDriven = false;
            UUID printerId = null, filamentId = null, printId = null;
            try {
                if (printerConfig != null && !printerConfig.isEmpty()) {
                    printerId = UUID.fromString(printerConfig);
                    isDbDriven = true;
                }
                if (filamentConfig != null && !filamentConfig.isEmpty()) {
                    filamentId = UUID.fromString(filamentConfig);
                    isDbDriven = true;
                }
                if (printConfig != null && !printConfig.isEmpty()) {
                    printId = UUID.fromString(printConfig);
                    isDbDriven = true;
                }
            } catch (IllegalArgumentException e) {
                // Not UUIDs, fallback to file paths
                isDbDriven = false;
            }

            if (isDbDriven) {
                String tempConfigName = "temp_slice_" + UUID.randomUUID().toString() + ".ini";
                tempConfigFile = new File(basePath + "/" + UPLOAD_DIR + tempConfigName);
                
                try (PrintWriter writer = new PrintWriter(new FileWriter(tempConfigFile))) {
                    writer.println("; PrusaSlicer Dynamic Config");
                    
                    // 1. Printer Profile
                    if (printerId != null) {
                        Perfil printer = perfilRepository.findById(printerId).orElse(null);
                        if (printer != null) {
                            writer.println("nozzle_diameter = " + (printer.getNozzleDiameter() != null ? printer.getNozzleDiameter() : 0.4));
                            writer.println("max_print_height = " + (printer.getMaxPrintHeight() != null ? printer.getMaxPrintHeight() : 250));
                            
                            String bedShape = printer.getBedShape();
                            if (bedShape == null || bedShape.isEmpty()) {
                                bedShape = "0x0,220x0,220x220,0x220";
                            } else if (!bedShape.contains(",")) {
                                try {
                                    String[] parts = bedShape.toLowerCase().split("x");
                                    if (parts.length == 2) {
                                        double w = Double.parseDouble(parts[0].trim());
                                        double h = Double.parseDouble(parts[1].trim());
                                        bedShape = String.format("0x0,%.0fx0,%.0fx%.0f,0x%.0f", w, w, h, h);
                                    }
                                } catch (Exception ignored) {}
                            }
                            writer.println("bed_shape = " + bedShape);
                        }
                    }
                    
                    // 2. Filament Profile
                    if (filamentId != null) {
                        FilamentProfile filament = filamentProfileRepository.findById(filamentId).orElse(null);
                        if (filament != null) {
                            writer.println("filament_colour = " + (filament.getColour() != null ? filament.getColour() : "#FF0000"));
                            writer.println("filament_diameter = " + (filament.getDiameter() != null ? filament.getDiameter() : 1.75));
                            writer.println("filament_density = " + (filament.getDensity() != null ? filament.getDensity() : 1.24));
                            writer.println("filament_cost = " + (filament.getFilamentoPorKg() != null ? filament.getFilamentoPorKg().intValue() : 15000));
                        }
                    }
                    
                    // 3. Print Profile
                    if (printId != null) {
                        PrintProfile print = printProfileRepository.findById(printId).orElse(null);
                        if (print != null) {
                            writer.println("layer_height = " + (print.getLayerHeight() != null ? print.getLayerHeight() : 0.2));
                            writer.println("perimeters = " + (print.getPerimeters() != null ? print.getPerimeters() : 3));
                            String fillDensity = print.getFillDensity();
                            if (fillDensity != null && !fillDensity.endsWith("%")) fillDensity += "%";
                            writer.println("fill_density = " + (fillDensity != null ? fillDensity : "15%"));
                            writer.println("speed_print = " + (print.getSpeedPrint() != null ? print.getSpeedPrint().intValue() : 60));
                        }
                    }
                }
                
                configPaths.add(tempConfigFile.getAbsolutePath());
            } else {
                addConfigPath(configPaths, "print/", printConfig);
                addConfigPath(configPaths, "filament/", filamentConfig);
                addConfigPath(configPaths, "printer/", printerConfig);
            }

            // Execute slicing
            SlicerService.SlicingResult result = slicerService.slice(path.toString(), null, configPaths);

            // Clean up temporary config file
            if (tempConfigFile != null && tempConfigFile.exists()) {
                tempConfigFile.delete();
            }

            // Clean up temporary STL file
            File stlFile = new File(path.toString());
            if (stlFile.exists()) {
                stlFile.delete();
            }

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            e.printStackTrace();
            if (tempConfigFile != null && tempConfigFile.exists()) {
                tempConfigFile.delete();
            }
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
