package com.prusaslicer.wrapper;

import java.io.File;
import java.util.Collections;
import java.util.List;
import java.util.Map;

public class PrusaSlicerBasicTest {
    public static void main(String[] args) {
        PrusaSlicer slicer = new PrusaSlicer(); // Uses dynamic resolution

        String userDir = System.getProperty("user.dir");
        String stlPath = new File(userDir, "bin/gansterglasses.stl").getAbsolutePath();
        
        // Fallback check for staging
        if (!new File(stlPath).exists()) {
            stlPath = new File(userDir, "app/bin/gansterglasses.stl").getAbsolutePath();
        }

        System.out.println("Using PrusaSlicer at: " + slicer.getExecutablePath());

        System.out.println("--- Test 1: Info Query ---");
        try {
            SlicingResult result = slicer.execute(List.of("--info"), Map.of()); // Map.of is Java 9+, using it here assuming user has it
            System.out.println("Success! Exit code: " + result.getExitCode());
            System.out.println("Stdout contains 'Size': " + result.getStandardOutput().contains("Size"));
        } catch (Exception e) {
            e.printStackTrace();
        }

        System.out.println("\n--- Test 2: Info for STL ---");
        try {
            SlicingResult result = slicer.execute(List.of(stlPath), Map.of("--info", ""));
            System.out.println("Success! Exit code: " + result.getExitCode());
            System.out.println("Stdout preview: " + result.getStandardOutput().substring(0, Math.min(100, result.getStandardOutput().length())));
        } catch (Exception e) {
            e.printStackTrace();
        }

        System.out.println("\n--- Test 3: Error Handling ---");
        try {
            slicer.execute(List.of("--invalid-param"));
            System.out.println("Error: Should have thrown an exception!");
        } catch (PrusaSlicerException e) {
            System.out.println("Caught expected exception: " + e.getMessage());
        }
    }
}
