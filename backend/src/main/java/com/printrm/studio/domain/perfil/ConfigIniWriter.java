package com.printrm.studio.domain.perfil;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;

@Component
public class ConfigIniWriter {

    @Value("${studio.base-path}")
    private String basePath;

    public void writePrinterIni(Perfil printer) {
        String dirPath = basePath + "/configs/printer";
        ensureDirectoryExists(dirPath);
        
        String filePath = dirPath + "/" + printer.getPrinterConfig() + ".ini";
        
        try (PrintWriter writer = new PrintWriter(new FileWriter(filePath))) {
            writer.println("; PrusaSlicer Printer Profile");
            writer.println("nozzle_diameter = " + (printer.getNozzleDiameter() != null ? printer.getNozzleDiameter() : 0.4));
            writer.println("max_print_height = " + (printer.getMaxPrintHeight() != null ? printer.getMaxPrintHeight() : 250));
            
            // bed_shape can be standard 220x220 or a bed shape string like 0x0,220x0,220x220,0x220
            String bedShape = printer.getBedShape();
            if (bedShape == null || bedShape.isEmpty()) {
                bedShape = "0x0,220x0,220x220,0x220";
            } else if (!bedShape.contains(",")) {
                // If user just input "220x220", format it
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
        } catch (IOException e) {
            throw new RuntimeException("Error writing printer .ini file: " + e.getMessage(), e);
        }
    }

    public void writeFilamentIni(FilamentProfile filament) {
        String dirPath = basePath + "/configs/filament";
        ensureDirectoryExists(dirPath);
        
        String filePath = dirPath + "/" + filament.getFilamentConfig() + ".ini";
        
        try (PrintWriter writer = new PrintWriter(new FileWriter(filePath))) {
            writer.println("; PrusaSlicer Filament Profile");
            writer.println("filament_colour = " + (filament.getColour() != null ? filament.getColour() : "#FF0000"));
            writer.println("filament_diameter = " + (filament.getDiameter() != null ? filament.getDiameter() : 1.75));
            writer.println("filament_density = " + (filament.getDensity() != null ? filament.getDensity() : 1.24));
            writer.println("filament_cost = " + (filament.getFilamentoPorKg() != null ? filament.getFilamentoPorKg().intValue() : 15000));
        } catch (IOException e) {
            throw new RuntimeException("Error writing filament .ini file: " + e.getMessage(), e);
        }
    }

    public void writePrintIni(PrintProfile print) {
        String dirPath = basePath + "/configs/print";
        ensureDirectoryExists(dirPath);
        
        String filePath = dirPath + "/" + print.getPrintConfig() + ".ini";
        
        try (PrintWriter writer = new PrintWriter(new FileWriter(filePath))) {
            writer.println("; PrusaSlicer Print Profile");
            writer.println("layer_height = " + (print.getLayerHeight() != null ? print.getLayerHeight() : 0.2));
            writer.println("perimeters = " + (print.getPerimeters() != null ? print.getPerimeters() : 3));
            
            String fillDensity = print.getFillDensity();
            if (fillDensity != null && !fillDensity.endsWith("%")) {
                fillDensity += "%";
            }
            writer.println("fill_density = " + (fillDensity != null ? fillDensity : "15%"));
            writer.println("speed_print = " + (print.getSpeedPrint() != null ? print.getSpeedPrint().intValue() : 60));
        } catch (IOException e) {
            throw new RuntimeException("Error writing print .ini file: " + e.getMessage(), e);
        }
    }

    private void ensureDirectoryExists(String path) {
        File dir = new File(path);
        if (!dir.exists()) {
            dir.mkdirs();
        }
    }
}
