@echo off
echo ==========================================
echo   Iniciando servicio de informes SPMarketing
echo ==========================================
echo.

REM Crear directorios necesarios
if not exist informes\imagenes mkdir informes\imagenes

REM Comprobar configuración
echo Comprobando configuracion...
python informe_landing_page.py --test

echo.
echo Instrucciones:
echo 1. Configura la contraseña correcta en el archivo informe_landing_page.py
echo 2. Para ejecutar el servicio automáticamente al iniciar, copia este archivo a la carpeta de inicio
echo    (Win+R, shell:startup)
echo 3. Para detener el servicio, cierre la ventana de la consola o use Ctrl+C

echo.
echo Presiona cualquier tecla para salir...
pause > nul 