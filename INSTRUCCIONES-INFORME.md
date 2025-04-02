# Instrucciones para Configurar los Informes Semanales

## Paso 1: Configurar Contraseña de Aplicación para Gmail

Para que los informes se puedan enviar automáticamente a tu correo `hristiankrasimirov7@gmail.com`, debes generar una contraseña de aplicación en tu cuenta de Google:

1. Ve a tu cuenta de Google (https://myaccount.google.com/)
2. Selecciona "Seguridad" en el menú lateral
3. Si no está activada la "Verificación en dos pasos", actívala primero
4. Busca "Contraseñas de aplicación" y haz clic en ella
5. En "Seleccionar aplicación", elige "Otra (nombre personalizado)"
6. Escribe un nombre como "SPMarketing Informes" y haz clic en "Generar"
7. Google te mostrará una contraseña de 16 caracteres. **CÓPIALA** (después no podrás verla de nuevo)

## Paso 2: Actualizar el archivo .env

1. Abre el archivo `.env` en la carpeta del proyecto
2. Busca la línea `EMAIL_PASSWORD=tu_contraseña_de_aplicacion`
3. Reemplaza `tu_contraseña_de_aplicacion` con la contraseña que acabas de generar
4. Guarda el archivo

## Paso 3: Probar el envío de correo

1. Abre PowerShell (puedes buscarlo en el menú de inicio)
2. Navega hasta la carpeta del proyecto con el comando:
   ```
  D:\PROYECTOS\SPMarketing\SPMarketing - AGENCY
   ```
3. Ejecuta el siguiente comando para enviar un correo de prueba:
   ```
   python -c "import informe_landing_page; informe_landing_page.enviar_correo_prueba()"
   ```
4. Deberías ver un mensaje que indica "Correo de prueba enviado correctamente"
5. Verifica tu bandeja de entrada en `hristiankrasimirov7@gmail.com` para confirmar que recibiste el correo

## Paso 4: Configurar el inicio automático

### Opción A: Ejecución manual cuando lo necesites

Para iniciar el servicio manualmente cuando quieras que comience a enviar informes:

1. Haz clic derecho en el archivo `iniciar_informe.ps1`
2. Selecciona "Ejecutar con PowerShell"

### Opción B: Configurar inicio automático con Windows

Para que el servicio se inicie automáticamente cada vez que enciendes el ordenador:

1. Presiona `Win + R` para abrir "Ejecutar"
2. Escribe `shell:startup` y presiona Enter
3. Se abrirá la carpeta de inicio de Windows
4. Crea un acceso directo al archivo `iniciar_informe.ps1` en esta carpeta:
   - Haz clic derecho en un espacio vacío y selecciona "Nuevo" > "Acceso directo"
   - En ubicación, escribe: `powershell -ExecutionPolicy Bypass -File "D:\PROYECTOS\SPMarketing\SPMarketing - AGENCY\iniciar_informe.ps1"`
   - Haz clic en "Siguiente" y ponle un nombre como "Informes SPMarketing"

## Información importante

- Los informes se enviarán automáticamente cada lunes a las 8:00 AM
- También se enviará un informe mensual cada 30 días
- El correo destinatario configurado es: `hristiankrasimirov7@gmail.com`
- Para cambiar el correo destinatario, edita la línea `EMAIL_DESTINATARIO` en el archivo `informe_landing_page.py`

Si necesitas detener el servicio en algún momento, abre el Administrador de tareas (Ctrl+Shift+Esc), busca los procesos de Python y finalízalos. 