# Cuestionario de Negocio - SPMarketing Agency

Este directorio contiene los archivos relacionados con el formulario de cuestionario para clientes potenciales de SPMarketing Agency.

## Archivos Incluidos

1. **cuestionario.html** - Página principal del cuestionario con formulario interactivo
2. **enviar-cuestionario.php** - Script PHP para procesar el formulario y enviar los datos por correo electrónico
3. **thank-you.html** - Página de agradecimiento a la que se redirige después de enviar el formulario

## Funcionamiento

El cuestionario está diseñado para recopilar información detallada sobre el negocio del cliente potencial, incluyendo:

- Sector al que pertenece el negocio
- Fase en la que se encuentra el negocio
- Objetivos principales de marketing digital
- Estrategias utilizadas anteriormente
- Presupuesto mensual disponible
- Desafíos específicos que enfrenta

Cuando un usuario completa y envía el formulario, los datos se procesan mediante el script PHP `enviar-cuestionario.php`, que formatea la información y la envía a la dirección de correo `hristiankrasimirov7@gmail.com`.

## Dependencias

- El formulario utiliza JavaScript vanilla para la navegación entre preguntas y validaciones
- El envío utiliza Fetch API para comunicarse con el backend
- El servidor debe tener PHP instalado y la función `mail()` configurada correctamente

## Instalación y Uso

1. Coloca estos archivos en tu servidor web con soporte para PHP
2. Asegúrate de que los permisos de archivos estén configurados correctamente
3. Puedes personalizar el destinatario del correo editando la variable `$destinatario` en `enviar-cuestionario.php` 