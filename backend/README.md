# PrusaSlicer Java Wrapper

A lightweight Java wrapper for the PrusaSlicer CLI and a GUI launcher.

## Features
- **Local Data:** Automatically uses a local `data` folder for settings (`--datadir`), ensuring no impact on the host system.
- **GUI Launcher:** Can launch the PrusaSlicer GUI or CLI.
- **API:** Robust Java API to programmatically control PrusaSlicer.

## Requirements
- Java 11 or higher
- PrusaSlicer executable installed

## Usage (API)
```java
PrusaSlicer slicer = new PrusaSlicer(); // Uses bundled binaries and local data dir
SlicingResult result = slicer.execute(
    List.of("model.stl"),
    Map.of("--layer-height", "0.2", "--export-gcode", "")
);
```

## Launcher
The distribution includes an `iniciar.bat` which runs the `PrusaSlicerLauncher`.
- **Default:** Launches the PrusaSlicer GUI with a local data directory.
- **CLI:** Pass arguments to `iniciar.bat` to run the console version.
