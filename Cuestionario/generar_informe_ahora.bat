@echo off
echo Generando informe de SPMarketing Agency - Cuestionario...
echo.
echo Este proceso puede tardar unos momentos mientras se recopilan los datos,
echo se generan los gráficos y se envía el informe a tu correo electrónico.
echo.

python "%~dp0informe_cuestionario.py"

IF %ERRORLEVEL% EQU 0 (
    echo.
    echo El informe ha sido generado y enviado correctamente.
) ELSE (
    echo.
    echo Ha ocurrido un error al generar el informe.
    echo Por favor, verifica el archivo de registro informe_cuestionario.log
)

echo.
pause 