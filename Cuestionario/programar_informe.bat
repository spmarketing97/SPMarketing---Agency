@echo off
echo Configurando tarea programada para enviar informes semanales del cuestionario...

REM Obtener la ruta absoluta del script
set "SCRIPT_PATH=%~dp0informe_cuestionario.py"
set "PYTHON_PATH=python"

REM Crear la tarea programada (se ejecuta cada lunes a las 9:00 AM)
schtasks /create /tn "SPMarketingInformeSemanal" /tr "%PYTHON_PATH% %SCRIPT_PATH%" /sc weekly /d MON /st 09:00 /ru SYSTEM /f

echo.
echo La tarea ha sido programada correctamente.
echo Nombre de la tarea: SPMarketingInformeSemanal
echo Frecuencia: Cada lunes a las 9:00 AM
echo.
echo Para verificar la tarea, ejecuta: schtasks /query /tn "SPMarketingInformeSemanal"
echo.

pause 