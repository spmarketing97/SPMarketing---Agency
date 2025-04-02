@echo off
echo Iniciando SPMarketing Chatbot Server...

:: Crear un acceso directo en el inicio
echo Set oWS = WScript.CreateObject("WScript.Shell") > CreateStartupShortcut.vbs
echo sLinkFile = oWS.SpecialFolders("Startup") ^& "\SPMarketing_Chatbot.lnk" >> CreateStartupShortcut.vbs
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> CreateStartupShortcut.vbs
echo oLink.TargetPath = "%~dp0start_chatbot.bat" >> CreateStartupShortcut.vbs
echo oLink.WorkingDirectory = "%~dp0" >> CreateStartupShortcut.vbs
echo oLink.Save >> CreateStartupShortcut.vbs
cscript //nologo CreateStartupShortcut.vbs
del CreateStartupShortcut.vbs

:: Crear directorio de logs si no existe
if not exist "chat_logs" mkdir "chat_logs"

:: Verificar archivo .env
if not exist ".env" (
    echo ERROR: Archivo .env no encontrado
    echo Por favor, crea un archivo .env con tu token de Telegram:
    echo TELEGRAM_TOKEN=YOUR_TELEGRAM_TOKEN
    pause
    exit
)

:: Activar entorno virtual si existe
if exist "%~dp0../.venv/Scripts/activate.bat" (
    call "%~dp0../.venv/Scripts/activate.bat"
)

:: Iniciar el chatbot
python "%~dp0chatbot.py"

pause