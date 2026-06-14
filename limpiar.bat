@echo off
setlocal
echo ========================================
echo   Limpieza de Carpeta - PrusaSlicer App
echo ========================================
echo.

echo [+] Cerrando procesos colgados (App y Java)...
taskkill /f /im "prusaslicer-portable.exe" >nul 2>&1
taskkill /f /im "java.exe" >nul 2>&1

echo [+] Eliminando archivos G-code generados...
if exist "backend\output" (
    del /q "backend\output\*.gcode" 2>nul
)

echo [+] Limpiando carpeta de salida (output)...
if exist "output" rd /s /q "output"

echo [+] Limpiando temporales de Java (Gradle/Maven)...
if exist "backend\build" rd /s /q "backend\build"
if exist "backend\.gradle" rd /s /q "backend\.gradle"
if exist "backend\target" rd /s /q "backend\target"

echo [+] Limpiando temporales de Frontend (Vite)...
if exist "frontend\dist" rd /s /q "frontend\dist"

echo [+] Intentando mover 'configs' a 'backend' para mayor orden...
if exist "configs" (
    move "configs" "backend\configs" >nul 2>&1
)

echo.
echo Limpieza completada. Ahora podes correr armar_portable.bat sin bloqueos.
echo.
pause
