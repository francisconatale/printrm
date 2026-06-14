@echo off
setlocal
echo ==============================================
echo   Build Portable - PrusaSlicer Cost Calculator
echo ==============================================
echo.

echo [+] Instalando dependencias del proyecto raiz...
call npm install
if errorlevel 1 goto :error

echo.
echo [+] Instalando dependencias del frontend...
cd frontend && call npm install && cd ..
if errorlevel 1 goto :error

echo.
echo [+] Limpiando builds anteriores de Java...
if exist "java-wrapper\build" rd /s /q "java-wrapper\build"
if exist "java-wrapper\jre" rd /s /q "java-wrapper\jre"

echo.
echo [+] Iniciando proceso de compilacion y empaquetado...
echo (Java + React + Electron)
echo.

call npm run dist

if errorlevel 1 goto :error

echo.
echo ==============================================
echo [EXITO] Version portable creada correctamente.
echo El ejecutable se encuentra en: output\printcrm
echo ==============================================
goto :end

:error
echo.
echo ==============================================
echo [ERROR] Hubo un problema durante el build.
echo Revisa los logs arriba para identificar el fallo.
echo ==============================================

:end
echo.
pause
