# SPMarketing - Agency

Sitio web de agencia de marketing digital especializada en estrategias personalizadas para impulsar negocios y emprendedores, con chatbot integrado e informes automáticos.

## Descripción

SPMarketing Agency es una agencia de marketing digital que ofrece soluciones personalizadas para negocios y emprendedores. El sitio web está diseñado para mostrar los servicios, beneficios y planes de la agencia, así como para proporcionar un medio de contacto directo con potenciales clientes. Incluye un chatbot interactivo y sistema de informes automáticos.

## Estructura del Proyecto

```
SPMarketing - AGENCY/
│
├── assets/                 # Recursos estáticos
│   ├── css/                # Archivos CSS
│   │   ├── animation.css   # Estilos para animaciones
│   │   ├── chat-widget.css # Estilos para el widget de chat
│   │   └── styles.css      # Estilos principales
│   ├── img/                # Imágenes del sitio
│   │   ├── LOGO PRINCIPAL.jpg
│   │   └── ...
│   └── js/                 # Scripts JavaScript
│       ├── calendar.js     # Funcionalidades del calendario
│       ├── chat-widget.js  # Widget de chat
│       ├── chatbot-loader.js # Cargador del chatbot
│       ├── chatbot.js      # Motor principal del chatbot
│       ├── chatbot-custom.js # Personalización del chatbot
│       ├── main.js         # Funcionalidades principales
│       ├── pricing.js      # Funcionalidades de la página de precios
│       ├── pricing-chat.js # Chat en página de precios
│       ├── script.js       # Scripts generales
│       └── scripts.js      # Scripts adicionales
│
├── Python/                 # Scripts y servicios de Python
│   ├── chatbot.py          # Servicio de chatbot
│   ├── chat_logs/          # Logs de conversaciones del chatbot
│   ├── templates/          # Plantillas HTML para el chatbot
│   ├── weekly_report.py    # Generador de informes semanales
│   └── start_chatbot.bat   # Script para iniciar el chatbot
│
├── LEGAL/                  # Documentos legales
│   ├── cookies-policy.html
│   ├── privacy-policy.html
│   └── terms-of-use.html
│
├── Chatbot/                # Recursos adicionales del chatbot
│
├── Cuestionario/           # Sistema de cuestionarios para clientes
│
├── informes/               # Carpeta para almacenar informes generados
│
├── index.html              # Página principal
├── precios.html            # Página de planes y precios
├── thank-you.html          # Página de agradecimiento post-contacto
├── chatbot-fix.js          # Script de reparación del chatbot
├── form-handler.php        # Manejador del formulario de contacto
├── iniciar_informes.bat    # Script para iniciar el servicio de informes
├── informe_landing_page.py # Generador de informes de la landing page
├── README.md               # Este archivo
├── README-INFORMES.md      # Documentación específica de informes
├── requirements.txt        # Dependencias de Python
├── styles-old.css          # Versión anterior de estilos (archivo de respaldo)
├── .gitignore              # Configuración para excluir archivos en Git
└── .env                    # Variables de entorno (no subir a GitHub)
```

## Archivos para Subir a GitHub

Al subir este proyecto a GitHub, asegúrate de incluir todos los archivos excepto los siguientes (que ya están especificados en el archivo .gitignore):

- `__pycache__/` y archivos `.pyc` (archivos compilados de Python)
- `.env` (contiene información sensible como credenciales)
- Archivos temporales en `informes/`
- Archivos de logs (`.log`)
- `iniciar_informes.bat` (script específico para entorno local)
- `pyrightconfig.json` (configuración específica del entorno de desarrollo)

Si necesitas añadir más archivos a la lista de ignorados, edita el archivo `.gitignore` en la raíz del proyecto.

## Tecnologías Utilizadas

- HTML5
- CSS3
- JavaScript (ES6+)
- Python (para informes y chatbot)
- Flask (para el servidor del chatbot)
- Librerías: Font Awesome 6.4.0, BeautifulSoup4

## Características

- **Diseño Responsive**: Adaptado para dispositivos móviles y de escritorio
- **Interfaz Moderna**: Diseño atractivo con animaciones y efectos visuales
- **Formulario de Contacto**: Integrado con formsubmit.co para recibir consultas
- **Calendario Interactivo**: Permite a los clientes seleccionar fecha y hora para consultas
- **Chatbot Integrado**: Asistente virtual para atención al cliente
- **Informes Automáticos**: Generación de informes semanales sobre el rendimiento

## Inicio Automático de Servicios

Para iniciar todos los servicios automáticamente (chatbot e informes):

1. Ejecuta el archivo `iniciar_servicios.bat` en la raíz del proyecto.

Este script creará accesos directos en el inicio de Windows para que los servicios se inicien automáticamente al arrancar el sistema.

Alternativamente, puedes iniciar los servicios por separado:

- Para iniciar solo el chatbot: `Python\start_chatbot.bat`
- Para iniciar solo los informes: `iniciar_informe.bat`
- **Sistema de Informes**: Envío automático de informes semanales y mensuales
- **Testimonios**: Sección de testimonios de clientes con carrusel automático
- **Planes y Precios**: Presentación clara de los diferentes paquetes ofrecidos
- **Cuestionario de Negocio**: Formulario detallado para entender mejor las necesidades del cliente

## Secciones Principales

1. **Inicio**: Presentación general de la agencia
2. **Servicios**: Desarrollo web, SEO, marketing en redes sociales y más
3. **Beneficios**: Ventajas para los clientes
4. **Testimonios**: Experiencias de clientes satisfechos
5. **Sobre Nosotros**: Historia y valores de la empresa
6. **Contacto**: Formulario y calendario para solicitar consultas
7. **Precios**: Diferentes planes disponibles

## Configuración del Sistema de Informes

El sistema de informes está desarrollado en Python y permite:
- Envío automático de informes semanales (lunes a las 8:00 AM)
- Envío de informes mensuales cada 30 días
- Datos sobre visitas, conversiones y rendimiento de la landing page
- Configuración mediante archivo `.env` para credenciales de correo

## Contacto

- **Email**: solucionesworld2016@gmail.com
- **WhatsApp**: [Contactar](https://wa.link/uxacg0)
- **Facebook**: [SPMarketingKR](https://www.facebook.com/SPMarketingKR/)
- **Instagram**: [spmarketing_agency](https://www.instagram.com/spmarketing_agency?igsh=MWM2YTZnd25nbDcwZg=)
- **Telegram**: [SPMarketing_KR](https://t.me/SPMarketing_KR)
- **YouTube**: [SPM3103](https://www.youtube.com/@SPM3103)

## Licencia

© 2025 SPMarketing - Agency. Todos los derechos reservados.

# Bot de Telegram para SPMarketing

Bot automático 24/7 para atención al cliente con información basada en la página web.

## Características

- 🤖 Atención automática 24/7
- 📊 Información detallada de servicios
- 💎 Precios y beneficios
- 🔄 Respuestas automáticas inteligentes
- 📱 Integración con WhatsApp

## Configuración

1. Instala las dependencias:
```bash
pip install -r requirements.txt
```

2. Configura el token:
- Abre el archivo `config.py`
- Reemplaza `TU_TOKEN_AQUI` con tu token de Telegram
- Ajusta las URLs y otros parámetros según necesites

3. Ejecuta el bot:
```bash
python bot.py
```

## Funcionalidades

- Respuesta automática a saludos
- Información detallada de servicios
- Detalles de precios y beneficios
- Integración con WhatsApp para contacto directo
- Sistema de logging para monitoreo

## Personalización

Puedes personalizar:
- Mensajes automáticos en `config.py`
- Horarios de atención
- URLs de contacto
- Palabras clave para detección de intenciones

## Mantenimiento

El bot genera un archivo `bot.log` con información detallada de:
- Errores
- Interacciones de usuarios
- Mensajes enviados/recibidos
- Estado del sistema

## Soporte

Para soporte técnico, contacta a:
- Email: solucionesworld2016@gmail.com
- WhatsApp: https://wa.link/uxacg0