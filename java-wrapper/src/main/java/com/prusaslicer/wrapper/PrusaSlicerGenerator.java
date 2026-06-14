package com.prusaslicer.wrapper;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

/**
 * A parameterized wrapper to invoke PrusaSlicer CLI for G-code generation.
 */
public class PrusaSlicerGenerator {

    private static final String DEFAULT_EXE = "bin/prusa-slicer-console.exe";
    private static final String DEFAULT_OUTPUT_DIR = "output/";

    public static void main(String[] args) {
        if (args.length < 1) {
            System.out.println("Uso: java PrusaSlicerGenerator <archivo.stl> [archivo_salida.gcode] [config.ini]");
            System.out.println("Nota: Los archivos de salida se guardarán en la carpeta 'output/' por defecto.");
            return;
        }

        String inputStl = args[0];
        String outputGcode;
        
        if (args.length > 1) {
            outputGcode = args[1];
        } else {
            // Generar nombre automático en la carpeta de salida
            String baseName = new java.io.File(inputStl).getName().replaceAll("(?i)\\.stl$", "");
            outputGcode = DEFAULT_OUTPUT_DIR + baseName + ".gcode";
        }
        
        String configFile = (args.length > 2) ? args[2] : null;

        System.out.println("--- Iniciando Generación de G-code ---");
        System.out.println("Entrada:  " + inputStl);
        System.out.println("Salida:   " + outputGcode);
        if (configFile != null) System.out.println("Config:   " + configFile);

        try {
            int exitCode = runSlicer(DEFAULT_EXE, inputStl, outputGcode, configFile);
            
            if (exitCode == 0) {
                System.out.println("\n[SUCCESS] G-code generado con éxito: " + outputGcode);
                parseGCodeMetadata(outputGcode);
            } else {
                System.err.println("\n[ERROR] PrusaSlicer terminó con código: " + exitCode);
            }
        } catch (IOException | InterruptedException e) {
            System.err.println("\n[FATAL] Error de ejecución: " + e.getMessage());
        }
    }

    /**
     * Analiza el final del archivo G-code para extraer datos relevantes.
     */
    private static void parseGCodeMetadata(String filePath) {
        System.out.println("\n--- Resumen de Análisis de G-code ---");
        try (java.util.Scanner scanner = new java.util.Scanner(new java.io.File(filePath))) {
            String time = "Desconocido";
            String grams = "0.00";
            String volume = "0.00";

            while (scanner.hasNextLine()) {
                String line = scanner.nextLine();
                if (line.contains("estimated printing time (normal mode)")) {
                    time = line.split("=")[1].trim();
                } else if (line.contains("total filament used [g]")) {
                    grams = line.split("=")[1].trim();
                } else if (line.contains("filament used [cm3]")) {
                    volume = line.split("=")[1].trim();
                }
            }

            System.out.println("Tiempo estimado:  " + time);
            System.out.println("Gramos usados:    " + grams + " g");
            System.out.println("Volumen usado:    " + volume + " cm3");

        } catch (IOException e) {
            System.err.println("Error al leer metadatos: " + e.getMessage());
        }
    }

    /**
     * Ejecuta PrusaSlicer con parámetros variables.
     *
     * @param exePath    Ruta al ejecutable
     * @param inputPath  Ruta al STL
     * @param outputPath Ruta de salida (opcional)
     * @param configPath Ruta al archivo .ini de configuración (opcional)
     * @return Código de salida del proceso
     */
    public static int runSlicer(String exePath, String inputPath, String outputPath, String configPath) 
            throws IOException, InterruptedException {
        
        List<String> command = new ArrayList<>();
        command.add(exePath);
        command.add("--export-gcode");
        command.add(inputPath);

        if (outputPath != null && !outputPath.isEmpty()) {
            command.add("--output");
            command.add(outputPath);
        }

        if (configPath != null && !configPath.isEmpty()) {
            command.add("--load");
            command.add(configPath);
        }

        ProcessBuilder pb = new ProcessBuilder(command);
        pb.redirectErrorStream(true);
        
        Process process = pb.start();

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println("[PrusaSlicer] " + line);
            }
        }

        return process.waitFor();
    }
}
