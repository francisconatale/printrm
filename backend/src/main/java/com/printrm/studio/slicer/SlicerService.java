package com.printrm.studio.slicer;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

@Service
public class SlicerService {

    @Value("${studio.base-path}")
    private String basePath;

    private static final String BIN_DIR = "bin/";
    private static final String DEFAULT_EXE = "prusa-slicer-console.exe";
    private static final String DEFAULT_OUTPUT_DIR = "output/";

    public SlicingResult slice(String inputStl, String outputGcode, List<String> configPaths) throws IOException, InterruptedException {
        File outputDir = new File(basePath + "/" + DEFAULT_OUTPUT_DIR);
        if (!outputDir.exists()) {
            outputDir.mkdirs();
        }

        if (outputGcode == null || outputGcode.isEmpty()) {
            String baseName = new File(inputStl).getName().replaceAll("(?i)\\.stl$", "");
            outputGcode = basePath + "/" + DEFAULT_OUTPUT_DIR + baseName + ".gcode";
        }

        int exitCode = runSlicer(basePath + "/" + BIN_DIR + DEFAULT_EXE, inputStl, outputGcode, configPaths);

        if (exitCode == 0) {
            return parseGCodeMetadata(outputGcode);
        } else {
            throw new RuntimeException("PrusaSlicer failed with exit code: " + exitCode);
        }
    }

    private int runSlicer(String exePath, String inputPath, String outputPath, List<String> configPaths)
            throws IOException, InterruptedException {

        List<String> command = new ArrayList<>();
        command.add(new File(exePath).getAbsolutePath());
        command.add("--export-gcode");
        command.add(new File(inputPath).getAbsolutePath());

        if (outputPath != null && !outputPath.isEmpty()) {
            command.add("--output");
            command.add(new File(outputPath).getAbsolutePath());
        }

        if (configPaths != null) {
            for (String configPath : configPaths) {
                if (configPath != null && !configPath.isEmpty()) {
                    command.add("--load");
                    command.add(new File(configPath).getAbsolutePath());
                }
            }
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

    private SlicingResult parseGCodeMetadata(String filePath) {
        SlicingResult result = new SlicingResult();
        result.setGcodePath(filePath);

        try (Scanner scanner = new Scanner(new File(filePath))) {
            while (scanner.hasNextLine()) {
                String line = scanner.nextLine();
                if (line.contains("estimated printing time (normal mode)")) {
                    result.setEstimatedTime(line.split("=")[1].trim());
                } else if (line.contains("total filament used [g]")) {
                    result.setFilamentUsedG(Double.parseDouble(line.split("=")[1].trim()));
                } else if (line.contains("filament used [cm3]")) {
                    result.setFilamentUsedCm3(Double.parseDouble(line.split("=")[1].trim()));
                }
            }
        } catch (IOException | NumberFormatException e) {
            System.err.println("Error parsing metadata: " + e.getMessage());
        }
        return result;
    }

    public static class SlicingResult {
        private String gcodePath;
        private String estimatedTime;
        private double filamentUsedG;
        private double filamentUsedCm3;

        // Getters and Setters
        public String getGcodePath() { return gcodePath; }
        public void setGcodePath(String gcodePath) { this.gcodePath = gcodePath; }
        public String getEstimatedTime() { return estimatedTime; }
        public void setEstimatedTime(String estimatedTime) { this.estimatedTime = estimatedTime; }
        public double getFilamentUsedG() { return filamentUsedG; }
        public void setFilamentUsedG(double filamentUsedG) { this.filamentUsedG = filamentUsedG; }
        public double getFilamentUsedCm3() { return filamentUsedCm3; }
        public void setFilamentUsedCm3(double filamentUsedCm3) { this.filamentUsedCm3 = filamentUsedCm3; }
    }
}

