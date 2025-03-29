Write-Host "Iniciando servicio de informes de SPMarketing..." -ForegroundColor Green

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location -Path $scriptPath

# Iniciar el proceso en segundo plano
Start-Process -FilePath "pythonw" -ArgumentList "informe_landing_page.py" -WindowStyle Hidden -WorkingDirectory $scriptPath

Write-Host "Servicio de informes iniciado en segundo plano." -ForegroundColor Green
Write-Host "Se enviarán informes semanales a hristiankrasimirov7@gmail.com" -ForegroundColor Cyan
Write-Host "Para detener el servicio, usa el Administrador de tareas y busca el proceso python." -ForegroundColor Yellow 