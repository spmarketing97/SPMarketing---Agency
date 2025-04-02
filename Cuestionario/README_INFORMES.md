# Sistema de Informes Automáticos - SPMarketing Agency

Este sistema genera y envía automáticamente informes semanales sobre el rendimiento del cuestionario de SPMarketing Agency.

## Características

- Envío automático de informes cada lunes a las 9:00 AM
- Informe detallado con gráficos y estadísticas de uso
- Datos sobre visitas, conversiones y comportamiento de los usuarios
- Recomendaciones para mejorar el rendimiento

## Requisitos previos

Para utilizar este sistema necesitas:

1. Python 3.7 o superior instalado en tu sistema
2. Las siguientes bibliotecas de Python:
   - pandas
   - matplotlib
   - google-api-python-client
   - google-auth

## Instalación

1. Instala las dependencias necesarias:

```bash
pip install pandas matplotlib google-api-python-client google-auth
```

2. Configura las credenciales de Google Analytics:
   - Si deseas conectar con Analytics real, necesitarás crear un archivo de credenciales de servicio en la consola de Google Cloud.
   - Coloca el archivo de credenciales en la carpeta del proyecto.
   - Actualiza la variable `VIEW_ID` en el archivo `informe_cuestionario.py` con tu ID de propiedad GA4.

## Configuración de la tarea programada

### En Windows:

Simplemente ejecuta el archivo `programar_informe.bat` como administrador. Esto creará una tarea programada que ejecutará el script cada lunes a las 9:00 AM.

### En Linux/macOS:

Ejecuta el siguiente comando para editar el crontab:

```bash
crontab -e
```

Y añade la siguiente línea:

```
0 9 * * 1 python /ruta/completa/a/informe_cuestionario.py
```

## Configuración del correo electrónico

El sistema está configurado para enviar correos utilizando una cuenta de Gmail. Para usar tu propia cuenta:

1. Verifica que la contraseña de aplicación proporcionada es correcta
2. Si necesitas generar una nueva contraseña de aplicación:
   - Ve a la configuración de tu cuenta de Google
   - Selecciona "Seguridad"
   - En "Acceso a Google", selecciona "Contraseñas de aplicaciones"
   - Genera una nueva contraseña y reemplázala en la variable `CONTRASEÑA_APP` del script

## Personalización

Puedes personalizar varios aspectos del informe:

- Diseño del HTML: Edita la función `generar_informe_html` en el archivo Python
- Gráficos: Modifica la función `generar_graficos` para cambiar los tipos de gráficos o su apariencia
- Métricas: Añade o elimina métricas en la función `simular_datos_analytics` o en la implementación real de Analytics

## Solución de problemas

El script genera un archivo de registro `informe_cuestionario.log` que contiene información detallada sobre la ejecución. Consulta este archivo si experimentas problemas.

Problemas comunes:
- **Error al enviar correo**: Verifica que la contraseña de aplicación sea correcta y que permitas el acceso de aplicaciones menos seguras si estás usando una cuenta de Gmail.
- **Error con los gráficos**: Asegúrate de que matplotlib está correctamente instalado.
- **La tarea programada no se ejecuta**: Verifica los permisos del usuario y que Python esté en el PATH del sistema.

## Contacto

Para cualquier consulta o soporte técnico, contacta a:
- Correo: hristiankrasimirov7@gmail.com 