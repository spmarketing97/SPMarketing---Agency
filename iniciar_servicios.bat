@echo off
echo Iniciando servicios de SPMarketing...

:: Crear acceso directo en el inicio para que se ejecute al arrancar Windows
echo Set oWS = WScript.CreateObject("WScript.Shell") > CreateStartupShortcut.vbs
echo sLinkFile = oWS.SpecialFolders("Startup") ^& "\SPMarketing_Servicios.lnk" >> CreateStartupShortcut.vbs
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> CreateStartupShortcut.vbs
echo oLink.TargetPath = "%~dp0iniciar_servicios.bat" >> CreateStartupShortcut.vbs
echo oLink.WorkingDirectory = "%~dp0" >> CreateStartupShortcut.vbs
echo oLink.Save >> CreateStartupShortcut.vbs
cscript //nologo CreateStartupShortcut.vbs
del CreateStartupShortcut.vbs

:: Iniciar el chatbot en segundo plano
echo Iniciando chatbot...
start /min cmd /c "cd /d "%~dp0Python" && start_chatbot.bat"

:: Iniciar el servicio de informes en segundo plano
echo Iniciando servicio de informes...
start /min powershell -ExecutionPolicy Bypass -File "%~dp0iniciar_informe.ps1"

echo Todos los servicios han sido iniciados correctamente.
echo Los servicios se iniciarán automáticamente al arrancar Windows.
echo.
echo Presiona cualquier tecla para cerrar esta ventana...
pause > nul