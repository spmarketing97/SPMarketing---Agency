import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
from datetime import datetime, timedelta
import schedule
import time
import json
import requests
import matplotlib.pyplot as plt
import matplotlib
matplotlib.use('Agg')  # Para generar gráficos sin interfaz gráfica

# Configuración de correo
EMAIL_DESTINATARIO = "hristiankrasimirov7@gmail.com"
EMAIL_REMITENTE = "solucionesworld2016@gmail.com"
EMAIL_PASSWORD = "jgtq ucny jpxc nyoy"  # Contraseña de aplicación de Google
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587

# Directorio para imágenes
DIRECTORIO_IMAGENES = "informes/imagenes"
os.makedirs(DIRECTORIO_IMAGENES, exist_ok=True)

# Función para obtener estadísticas (simulado - reemplazar con API real)
def obtener_estadisticas(dias=7):
    """
    Obtiene estadísticas de vistas de la landing page.
    En un entorno real, esto se conectaría a Google Analytics, Firebase u otra API.
    """
    # Simulación - reemplazar con llamada API real
    fecha_inicio = (datetime.now() - timedelta(days=dias)).strftime('%Y-%m-%d')
    fecha_fin = datetime.now().strftime('%Y-%m-%d')
    
    try:
        # Aquí iría la llamada a la API real
        # Ejemplo con Google Analytics API o similar
        # response = requests.get(f"https://tu-api-analytics.com/stats?start={fecha_inicio}&end={fecha_fin}")
        # data = response.json()
        
        # Datos simulados para demostración
        data = {
            'vistas_totales': 1250 + (dias * 10),
            'visitantes_unicos': 820 + (dias * 5),
            'tiempo_promedio': '2m 45s',
            'tasa_rebote': '35.8%',
            'conversiones': 43 + (dias * 1),
            'tasa_conversion': f"{(43 + (dias * 1)) / (1250 + (dias * 10)) * 100:.1f}%",
            'fuentes_trafico': {
                'directo': '42%',
                'busqueda_organica': '28%',
                'redes_sociales': '18%',
                'email': '8%',
                'otros': '4%'
            },
            'dispositivos': {
                'desktop': '58%',
                'mobile': '35%',
                'tablet': '7%'
            }
        }
        return data
    except Exception as e:
        print(f"Error al obtener estadísticas: {e}")
        return None

# Función para generar gráficos
def generar_graficos(datos):
    """Genera gráficos para el informe"""
    rutas_imagenes = {}
    
    try:
        # Gráfico de fuentes de tráfico
        plt.figure(figsize=(8, 6))
        fuentes = list(datos['fuentes_trafico'].keys())
        valores = [float(v.strip('%')) for v in datos['fuentes_trafico'].values()]
        
        plt.pie(valores, labels=fuentes, autopct='%1.1f%%', 
                shadow=True, startangle=90, 
                colors=['#003366', '#FF4500', '#1B5E20', '#E91E63', '#FFC107'])
        plt.axis('equal')
        plt.title('Fuentes de Tráfico')
        ruta = os.path.join(DIRECTORIO_IMAGENES, 'fuentes_trafico.png')
        plt.savefig(ruta)
        plt.close()
        rutas_imagenes['fuentes_trafico'] = ruta
        
        # Gráfico de dispositivos
        plt.figure(figsize=(8, 6))
        dispositivos = list(datos['dispositivos'].keys())
        valores_disp = [float(v.strip('%')) for v in datos['dispositivos'].values()]
        
        plt.pie(valores_disp, labels=dispositivos, autopct='%1.1f%%', 
                shadow=True, startangle=90,
                colors=['#4285F4', '#DB4437', '#F4B400'])
        plt.axis('equal')
        plt.title('Accesos por Tipo de Dispositivo')
        ruta = os.path.join(DIRECTORIO_IMAGENES, 'dispositivos.png')
        plt.savefig(ruta)
        plt.close()
        rutas_imagenes['dispositivos'] = ruta
        
        return rutas_imagenes
    except Exception as e:
        print(f"Error al generar gráficos: {e}")
        return {}

# Función para generar el informe HTML
def generar_informe_html(dias=7):
    """Genera un informe HTML con las estadísticas de la landing page"""
    estadisticas = obtener_estadisticas(dias)
    if not estadisticas:
        return "<p>No se pudieron obtener las estadísticas.</p>"
    
    periodo = f"últimos {dias} días" if dias != 30 else "último mes"
    
    # Crear HTML del informe
    html = """
    <html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 800px;
                margin: 0 auto;
            }
            .header {
                background-color: #003366;
                color: white;
                padding: 20px;
                text-align: center;
            }
            .content {
                padding: 20px;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
            }
            th, td {
                border: 1px solid #ddd;
                padding: 12px;
                text-align: left;
            }
            th {
                background-color: #f2f2f2;
            }
            .metric {
                font-size: 24px;
                font-weight: bold;
                color: #003366;
            }
            .chart {
                background-color: #f9f9f9;
                padding: 15px;
                border-radius: 5px;
                margin: 20px 0;
                text-align: center;
            }
            .footer {
                background-color: #f2f2f2;
                padding: 10px;
                text-align: center;
                font-size: 12px;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>Informe de Landing Page - SPMarketing</h1>
            <p>Datos de los """ + periodo + """</p>
        </div>
        <div class="content">
            <h2>Resumen General</h2>
            <table>
                <tr>
                    <th>Métrica</th>
                    <th>Valor</th>
                </tr>
                <tr>
                    <td>Vistas totales</td>
                    <td class="metric">""" + str(estadisticas['vistas_totales']) + """</td>
                </tr>
                <tr>
                    <td>Visitantes únicos</td>
                    <td class="metric">""" + str(estadisticas['visitantes_unicos']) + """</td>
                </tr>
                <tr>
                    <td>Tasa de conversión</td>
                    <td class="metric">""" + estadisticas['tasa_conversion'] + """</td>
                </tr>
                <tr>
                    <td>Tiempo promedio en la página</td>
                    <td>""" + estadisticas['tiempo_promedio'] + """</td>
                </tr>
                <tr>
                    <td>Tasa de rebote</td>
                    <td>""" + estadisticas['tasa_rebote'] + """</td>
                </tr>
            </table>
            
            <h2>Fuentes de Tráfico</h2>
            <div class="chart">
                <img src="cid:fuentes_trafico" alt="Gráfico de fuentes de tráfico" style="max-width: 100%;">
            </div>
            
            <h2>Dispositivos</h2>
            <div class="chart">
                <img src="cid:dispositivos" alt="Gráfico de dispositivos" style="max-width: 100%;">
            </div>
            
            <h2>Detalles de Fuentes de Tráfico</h2>
            <table>
                <tr>
                    <th>Fuente</th>
                    <th>Porcentaje</th>
                </tr>
                <tr>
                    <td>Directo</td>
                    <td>""" + estadisticas['fuentes_trafico']['directo'] + """</td>
                </tr>
                <tr>
                    <td>Búsqueda orgánica</td>
                    <td>""" + estadisticas['fuentes_trafico']['busqueda_organica'] + """</td>
                </tr>
                <tr>
                    <td>Redes sociales</td>
                    <td>""" + estadisticas['fuentes_trafico']['redes_sociales'] + """</td>
                </tr>
                <tr>
                    <td>Email</td>
                    <td>""" + estadisticas['fuentes_trafico']['email'] + """</td>
                </tr>
                <tr>
                    <td>Otros</td>
                    <td>""" + estadisticas['fuentes_trafico']['otros'] + """</td>
                </tr>
            </table>
            
            <h2>Recomendaciones</h2>
            <ul>
                <li>Optimizar la página para mejorar la tasa de conversión.</li>
                <li>Aumentar la presencia en redes sociales para generar más tráfico.</li>
                <li>Considerar estrategias para reducir la tasa de rebote.</li>
                <li>Mejorar la experiencia en dispositivos móviles para aumentar las conversiones.</li>
            </ul>
        </div>
        <div class="footer">
            <p>Este informe fue generado automáticamente por SPMarketing Agency.</p>
            <p>© """ + str(datetime.now().year) + """ SPMarketing - Todos los derechos reservados</p>
        </div>
    </body>
    </html>
    """
    return html

def enviar_informe_email(dias=7):
    """Envía el informe por correo electrónico"""
    try:
        # Obtener estadísticas
        estadisticas = obtener_estadisticas(dias)
        if not estadisticas:
            print("Error: No se pudieron obtener las estadísticas.")
            return False
        
        # Generar gráficos
        rutas_imagenes = generar_graficos(estadisticas)
        
        # Crear mensaje
        mensaje = MIMEMultipart()
        mensaje["From"] = EMAIL_REMITENTE
        mensaje["To"] = EMAIL_DESTINATARIO
        mensaje["Subject"] = f"Informe Semanal SPMarketing - {datetime.now().strftime('%d/%m/%Y')}"

        # Agregar contenido HTML
        html = generar_informe_html(dias)
        mensaje.attach(MIMEText(html, "html", "utf-8"))
        
        # Agregar imágenes
        for img_id, img_path in rutas_imagenes.items():
            with open(img_path, 'rb') as img_file:
                img = MIMEImage(img_file.read())
                img.add_header('Content-ID', f'<{img_id}>')
                mensaje.attach(img)

        # Enviar correo
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as servidor:
            servidor.starttls()
            servidor.login(EMAIL_REMITENTE, EMAIL_PASSWORD)
            servidor.send_message(mensaje)

        print(f"✅ Informe enviado correctamente a {EMAIL_DESTINATARIO}")
        return True
    except Exception as e:
        print(f"❌ Error al enviar el informe: {str(e)}")
        return False

def enviar_notificacion_formulario(datos_formulario):
    """
    Envía una notificación por correo cuando alguien completa un formulario.
    Esta función puede ser llamada desde los scripts de procesamiento de formularios.
    """
    try:
        # Crear mensaje
        mensaje = MIMEMultipart()
        mensaje["From"] = EMAIL_REMITENTE
        mensaje["To"] = EMAIL_DESTINATARIO
        mensaje["Subject"] = f"Nuevo contacto en SPMarketing - {datetime.now().strftime('%d/%m/%Y %H:%M')}"

        # Generar HTML
        nombre = datos_formulario.get('name', 'No especificado')
        email = datos_formulario.get('email', 'No especificado')
        telefono = datos_formulario.get('phone', 'No especificado')
        servicio = datos_formulario.get('service', 'No especificado')
        mensaje_texto = datos_formulario.get('message', 'No especificado')
        
        html = """
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .header { background-color: #003366; color: white; padding: 10px; text-align: center; }
                .content { padding: 15px; }
                .field { margin-bottom: 10px; }
                .label { font-weight: bold; }
                .value { padding-left: 10px; }
                .footer { background-color: #f2f2f2; padding: 10px; text-align: center; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h2>Nuevo contacto recibido</h2>
            </div>
            <div class="content">
                <div class="field">
                    <span class="label">Nombre:</span>
                    <span class="value">""" + nombre + """</span>
                </div>
                <div class="field">
                    <span class="label">Email:</span>
                    <span class="value">""" + email + """</span>
                </div>
                <div class="field">
                    <span class="label">Teléfono:</span>
                    <span class="value">""" + telefono + """</span>
                </div>
                <div class="field">
                    <span class="label">Servicio solicitado:</span>
                    <span class="value">""" + servicio + """</span>
                </div>
                <div class="field">
                    <span class="label">Mensaje:</span>
                    <div class="value">""" + mensaje_texto.replace('\n', '<br>') + """</div>
                </div>
                <div class="field">
                    <span class="label">Fecha y hora:</span>
                    <span class="value">""" + datetime.now().strftime('%d/%m/%Y %H:%M:%S') + """</span>
                </div>
            </div>
            <div class="footer">
                <p>Este mensaje fue generado automaticamente por SPMarketing Agency.</p>
            </div>
        </body>
        </html>
        """
        
        mensaje.attach(MIMEText(html, "html", "utf-8"))

        # Enviar correo
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as servidor:
            servidor.starttls()
            servidor.login(EMAIL_REMITENTE, EMAIL_PASSWORD)
            servidor.send_message(mensaje)

        print(f"✅ Notificación de nuevo contacto enviada a {EMAIL_DESTINATARIO}")
        return True
    except Exception as e:
        print(f"❌ Error al enviar la notificación: {str(e)}")
        return False

def enviar_correo_prueba():
    """Envía un correo de prueba para verificar la configuración"""
    try:
        mensaje = MIMEMultipart()
        mensaje["From"] = EMAIL_REMITENTE
        mensaje["To"] = EMAIL_DESTINATARIO
        mensaje["Subject"] = "Prueba de configuracion - SPMarketing"
        
        contenido = """
        <html>
        <body>
            <h2>Prueba de configuracion de correo</h2>
            <p>Este es un correo de prueba para verificar que la configuracion de envio de informes esta funcionando correctamente.</p>
            <p>Si estas recibiendo este mensaje, la configuracion es correcta.</p>
            <hr>
            <p><em>SPMarketing Agency</em></p>
        </body>
        </html>
        """
        
        mensaje.attach(MIMEText(contenido, "html", "utf-8"))
        
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as servidor:
            servidor.starttls()
            servidor.login(EMAIL_REMITENTE, EMAIL_PASSWORD)
            servidor.send_message(mensaje)
            
        print(f"✅ Correo de prueba enviado correctamente a {EMAIL_DESTINATARIO}")
        return True
    except Exception as e:
        print(f"❌ Error al enviar el correo de prueba: {str(e)}")
        return False

# Programar tarea para cada lunes
def programar_informe_semanal():
    """Programa el envío de informes para cada lunes a las 8:00 AM"""
    schedule.every().monday.at("08:00").do(enviar_informe_email, dias=7)
    
    # También podemos programar un informe mensual
    schedule.every(30).days.at("08:00").do(enviar_informe_email, dias=30)
    
    print(f"Informe programado para enviarse cada lunes a las 8:00 AM a {EMAIL_DESTINATARIO}")

# Modificar archivos PHP para integrar la notificación de formularios
def configurar_notificacion_formularios():
    """Añade código a los archivos PHP para enviar notificaciones cuando se reciban formularios"""
    try:
        # Archivo form-handler.php
        print("Configurando notificaciones en archivos de formularios...")
        
        # Esta función simplemente imprime instrucciones, no modifica archivos automáticamente
        print("Para activar las notificaciones de formulario, debes añadir el siguiente código a tus archivos PHP:")
        print("\n1. En form-handler.php, añade después del procesamiento del formulario:")
        print("```php")
        print("// Notificar usando el script de Python")
        print("$comando = 'python informe_landing_page.py --notificar-formulario'")
        print("$datos = json_encode($_POST);")
        print("file_put_contents('ultimo_formulario.json', $datos);")
        print("exec($comando . ' > /dev/null 2>&1 &');")
        print("```")
        
        print("\n2. En enviar-cuestionario.php, añade código similar.")
        
        return True
    except Exception as e:
        print(f"Error al configurar notificaciones: {e}")
        return False

# Función principal
def main():
    """Función principal que inicia el programador de tareas"""
    print("Iniciando servicio de informes de Landing Page...")
    
    # Parsear argumentos de línea de comandos
    import sys
    if len(sys.argv) > 1:
        if sys.argv[1] == '--notificar-formulario':
            # Este modo se usa cuando un formulario ha sido enviado
            try:
                with open('ultimo_formulario.json', 'r') as f:
                    datos = json.load(f)
                    enviar_notificacion_formulario(datos)
            except Exception as e:
                print(f"Error al procesar notificación de formulario: {e}")
            return
        elif sys.argv[1] == '--test':
            # Modo de prueba - enviar un informe inmediatamente
            print("Enviando informe de prueba...")
            enviar_informe_email(7)
            return
    
    # Modo normal - programar tarea
    programar_informe_semanal()
    
    # Configurar notificaciones
    configurar_notificacion_formularios()
    
    # Enviar un correo de prueba para verificar la configuración
    print("Enviando correo de prueba...")
    enviar_correo_prueba()
    
    # Mantener el script corriendo
    print("Servicio iniciado. Presiona Ctrl+C para detener.")
    try:
        while True:
            schedule.run_pending()
            time.sleep(60)
    except KeyboardInterrupt:
        print("Servicio detenido.")

if __name__ == "__main__":
    main() 