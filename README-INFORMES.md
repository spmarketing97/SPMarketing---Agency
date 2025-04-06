# Sistema de Informes SPMarketing

Este sistema proporciona informes semanales automatizados sobre el rendimiento de tu landing page y envía notificaciones cuando los clientes completan formularios de contacto.

## Características

- **Informes semanales automáticos** enviados por correo electrónico
- **Notificaciones inmediatas** cuando alguien envía un formulario de contacto
- **Gráficos visuales** de tráfico, dispositivos y fuentes
- **Recomendaciones** para mejorar el rendimiento
- **Estadísticas detalladas** de vistas, conversiones y comportamiento de usuarios

## Requisitos

- Python 3.6 o superior
- Paquetes de Python: `matplotlib`, `schedule`, `requests`

## Configuración

1. **Instalar dependencias:**
   ```
   pip install matplotlib requests schedule
   ```

2. **Configurar el correo electrónico:**
   Abre el archivo `informe_landing_page.py` y modifica la siguiente sección con tu información de correo:
   ```python
   # Configuración de correo
   EMAIL_DESTINATARIO = "tu_email@ejemplo.com"
   EMAIL_REMITENTE = "email_remitente@ejemplo.com"
   EMAIL_PASSWORD = "tu_contraseña_segura"
   SMTP_SERVER = "smtp.ejemplo.com"
   SMTP_PORT = 587
   ```

   > **IMPORTANTE:** Para Gmail, necesitarás usar una "contraseña de aplicación" en lugar de tu contraseña normal.
   > Consulta [este enlace](https://support.google.com/accounts/answer/185833) para configurar una contraseña de aplicación.

3. **Configurar formularios:**
   Ya se han modificado los archivos `form-handler.php` y `enviar-cuestionario.php` para enviar notificaciones cuando los clientes completan un formulario.

## Uso

### Para iniciar el servicio manualmente:

```
python informe_landing_page.py
```

### Para probar el envío de informes:

```
python informe_landing_page.py --test
```

### Para iniciar fácilmente (Windows):

Ejecuta el archivo `iniciar_informes.bat`

## Programación

Por defecto, los informes se programan para enviarse:
- **Informe semanal**: Cada lunes a las 8:00 AM
- **Informe mensual**: Cada 30 días a las 8:00 AM

Puedes modificar esta programación en la función `programar_informe_semanal()` en el archivo `informe_landing_page.py`.

## Notificaciones de formularios

Cuando alguien completa un formulario de contacto o el cuestionario, recibirás inmediatamente una notificación por correo electrónico con los detalles.

## Resolución de problemas

### Error de envío de correo

Si encuentras errores como "SMTPAuthenticationError":
- Verifica que estás usando la contraseña correcta
- Para Gmail, asegúrate de usar una contraseña de aplicación

### Error de generación de gráficos

Si encuentras errores relacionados con gráficos:
- Asegúrate de tener `matplotlib` instalado
- Verifica que existe el directorio `informes/imagenes`

## Personalización

Para personalizar los informes, puedes editar las siguientes funciones en `informe_landing_page.py`:
- `obtener_estadisticas()`: Para conectar con tu sistema de analítica real
- `generar_graficos()`: Para cambiar los gráficos generados
- `generar_informe_html()`: Para modificar el diseño del informe

## Contacto

Si necesitas ayuda con la configuración, contacta a:
- Email: hristiankrasimirov7@gmail.com 