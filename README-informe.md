# Informe Semanal de Landing Page - SPMarketing

Este script Python genera y envía informes semanales sobre el rendimiento de la landing page de SPMarketing.

## Características

- Envío automático de informes cada lunes a las 8:00 AM
- Datos de los últimos 7 días (semanal) y 30 días (mensual)
- Métricas importantes: vistas, visitantes únicos, conversiones, etc.
- Diseño atractivo y profesional en formato HTML

## Requisitos

- Python 3.6 o superior
- Bibliotecas requeridas (instalar con pip):
  - schedule
  - python-dotenv
  - requests

## Instalación

1. Clona o descarga este repositorio
2. Instala las dependencias:

```bash
pip install schedule python-dotenv requests
```

3. Configura el archivo `.env` con tus credenciales de correo:

```
EMAIL_REMITENTE=tu_correo@gmail.com
EMAIL_PASSWORD=tu_contraseña_o_clave_app
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
```

## Ejecución

Para ejecutar el script manualmente:

```bash
python informe_landing_page.py
```

### Ejecución automática

Para que el script se ejecute automáticamente al iniciar el sistema:

#### En Windows:

1. Crea un archivo batch (por ejemplo, `iniciar_informe.bat`) con el siguiente contenido:

```batch
@echo off
cd C:\ruta\a\tu\proyecto
python informe_landing_page.py
```

2. Agrega este archivo a las tareas de inicio de Windows.

#### En Linux:

1. Crea un servicio systemd o un cron job:

```bash
# Usando crontab
@reboot python /ruta/a/tu/proyecto/informe_landing_page.py
```

## Personalización

Puedes modificar el archivo `informe_landing_page.py` para:

- Cambiar el diseño del informe HTML
- Ajustar la frecuencia de envío
- Conectarlo a APIs reales (Google Analytics, etc.)
- Añadir más métricas o secciones al informe

## Soporte

Para cualquier consulta o problema, contacta con soporte@spmarketing.com 