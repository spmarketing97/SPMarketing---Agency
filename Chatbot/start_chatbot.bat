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
    echo TELEGRAM_TOKEN=tu_token_aqui
    pause
    exit /b 1
)

:: Instalar dependencias si no están instaladas
pip install -r requirements.txt

:: Iniciar el servidor
python chatbot.py