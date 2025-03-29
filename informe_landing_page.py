import os
import smtplib
import ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from datetime import datetime, timedelta
import schedule
import time
import json
import requests
from dotenv import load_dotenv

# Cargar variables de entorno desde .env
load_dotenv()

# Configuración de correo
EMAIL_DESTINATARIO = "hristiankrasimirov7@gmail.com"
EMAIL_REMITENTE = os.getenv("EMAIL_REMITENTE", "solucionesworld2016@gmail.com")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD", "SolucionesPc2016@/")
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))

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
            'fuentes_trafico': {
                'directo': '42%',
                'busqueda_organica': '28%',
                'redes_sociales': '18%',
                'email': '8%',
                'otros': '4%'
            }
        }
        return data
    except Exception as e:
        print(f"Error al obtener estadísticas: {e}")
        return None

# Función para generar el informe HTML
def generar_informe_html(dias=7):
    """Genera un informe HTML con las estadísticas de la landing page"""
    estadisticas = obtener_estadisticas(dias)
    if not estadisticas:
        return "<p>No se pudieron obtener las estadísticas.</p>"
    
    periodo = f"últimos {dias} días" if dias != 30 else "último mes"
    
    # Crear HTML del informe
    html = f"""
    <html>
    <head>
        <style>
            body {{
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 800px;
                margin: 0 auto;
            }}
            .header {{
                background-color: #003366;
                color: white;
                padding: 20px;
                text-align: center;
            }}
            .content {{
                padding: 20px;
            }}
            table {{
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
            }}
            th, td {{
                border: 1px solid #ddd;
                padding: 12px;
                text-align: left;
            }}
            th {{
                background-color: #f2f2f2;
            }}
            .metric {{
                font-size: 24px;
                font-weight: bold;
                color: #003366;
            }}
            .chart {{
                background-color: #f9f9f9;
                padding: 15px;
                border-radius: 5px;
                margin: 20px 0;
            }}
            .footer {{
                background-color: #f2f2f2;
                padding: 10px;
                text-align: center;
                font-size: 12px;
            }}
        </style>
    </head>
    <body>
        <div class="header">
            <h1>Informe de Landing Page - SPMarketing</h1>
            <p>Datos de los {periodo}</p>
        </div>
        <div class="content">
            <h2>Resumen de rendimiento</h2>
            
            <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
                <div style="flex: 1; min-width: 200px; margin: 10px; background: #f5f5f5; padding: 15px; border-radius: 5px; text-align: center;">
                    <h3>Vistas Totales</h3>
                    <div class="metric">{estadisticas['vistas_totales']}</div>
                </div>
                <div style="flex: 1; min-width: 200px; margin: 10px; background: #f5f5f5; padding: 15px; border-radius: 5px; text-align: center;">
                    <h3>Visitantes Únicos</h3>
                    <div class="metric">{estadisticas['visitantes_unicos']}</div>
                </div>
                <div style="flex: 1; min-width: 200px; margin: 10px; background: #f5f5f5; padding: 15px; border-radius: 5px; text-align: center;">
                    <h3>Conversiones</h3>
                    <div class="metric">{estadisticas['conversiones']}</div>
                </div>
            </div>
            
            <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
                <div style="flex: 1; min-width: 200px; margin: 10px; background: #f5f5f5; padding: 15px; border-radius: 5px; text-align: center;">
                    <h3>Tiempo Promedio</h3>
                    <div class="metric">{estadisticas['tiempo_promedio']}</div>
                </div>
                <div style="flex: 1; min-width: 200px; margin: 10px; background: #f5f5f5; padding: 15px; border-radius: 5px; text-align: center;">
                    <h3>Tasa de Rebote</h3>
                    <div class="metric">{estadisticas['tasa_rebote']}</div>
                </div>
            </div>
            
            <h2>Fuentes de tráfico</h2>
            <table>
                <tr>
                    <th>Fuente</th>
                    <th>Porcentaje</th>
                </tr>
                <tr>
                    <td>Directo</td>
                    <td>{estadisticas['fuentes_trafico']['directo']}</td>
                </tr>
                <tr>
                    <td>Búsqueda orgánica</td>
                    <td>{estadisticas['fuentes_trafico']['busqueda_organica']}</td>
                </tr>
                <tr>
                    <td>Redes sociales</td>
                    <td>{estadisticas['fuentes_trafico']['redes_sociales']}</td>
                </tr>
                <tr>
                    <td>Email</td>
                    <td>{estadisticas['fuentes_trafico']['email']}</td>
                </tr>
                <tr>
                    <td>Otros</td>
                    <td>{estadisticas['fuentes_trafico']['otros']}</td>
                </tr>
            </table>
            
            <h2>Recomendaciones</h2>
            <ul>
                <li>Optimizar la página para mejorar la tasa de conversión.</li>
                <li>Aumentar la presencia en redes sociales para generar más tráfico.</li>
                <li>Considerar estrategias para reducir la tasa de rebote.</li>
            </ul>
        </div>
        <div class="footer">
            <p>Este informe fue generado automáticamente por SPMarketing Agency.</p>
            <p>© {datetime.now().year} SPMarketing - Todos los derechos reservados</p>
        </div>
    </body>
    </html>
    """
    return html

# Función para enviar correo electrónico
def enviar_informe_email(dias=7):
    """Envía el informe por correo electrónico"""
    try:
        # Crear mensaje
        mensaje = MIMEMultipart()
        mensaje["From"] = EMAIL_REMITENTE
        mensaje["To"] = EMAIL_DESTINATARIO
        mensaje["Subject"] = f"Informe Semanal de Landing Page - SPMarketing"
        
        # Generar contenido HTML
        html = generar_informe_html(dias)
        mensaje.attach(MIMEText(html, "html"))
        
        # Crear conexión segura y enviar
        context = ssl.create_default_context()
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls(context=context)
            server.login(EMAIL_REMITENTE, EMAIL_PASSWORD)
            server.send_message(mensaje)
        
        print(f"Informe enviado correctamente a {EMAIL_DESTINATARIO}")
        return True
    except Exception as e:
        print(f"Error al enviar correo: {e}")
        return False

# Programar tarea para cada lunes
def programar_informe_semanal():
    """Programa el envío de informes para cada lunes a las 8:00 AM"""
    schedule.every().monday.at("08:00").do(enviar_informe_email, dias=7)
    
    # También podemos programar un informe mensual
    schedule.every(30).days.at("08:00").do(enviar_informe_email, dias=30)
    
    print(f"Informe programado para enviarse cada lunes a las 8:00 AM a {EMAIL_DESTINATARIO}")

    # Ejecutar inmediatamente un informe de prueba si se desea
    # enviar_informe_email(dias=7)

# Función para enviar un correo de prueba
def enviar_correo_prueba():
    """Envía un correo de prueba para verificar la configuración"""
    try:
        # Crear mensaje
        mensaje = MIMEMultipart()
        mensaje["From"] = EMAIL_REMITENTE
        mensaje["To"] = EMAIL_DESTINATARIO
        mensaje["Subject"] = "Prueba de Configuración - SPMarketing"
        
        # Contenido del mensaje
        texto = MIMEText("""
        <html>
        <body>
            <h2 style="color: #003366;">Prueba de Configuración Exitosa</h2>
            <p>Este es un correo de prueba para verificar que la configuración de envío de informes funciona correctamente.</p>
            <p>Si has recibido este correo, el sistema está configurado correctamente para enviar los informes semanales y mensuales.</p>
            <p style="color: #777; font-size: 12px;">© SPMarketing - Agency</p>
        </body>
        </html>
        """, "html")
        
        mensaje.attach(texto)
        
        # Crear conexión segura y enviar
        context = ssl.create_default_context()
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls(context=context)
            server.login(EMAIL_REMITENTE, EMAIL_PASSWORD)
            server.send_message(mensaje)
        
        print(f"Correo de prueba enviado correctamente a {EMAIL_DESTINATARIO}")
        return True
    except Exception as e:
        print(f"Error al enviar correo de prueba: {e}")
        return False

# Función principal
def main():
    """Función principal que inicia el programador de tareas"""
    print("Iniciando servicio de informes de Landing Page...")
    programar_informe_semanal()
    
    # Enviar un correo de prueba para verificar la configuración
    print("Enviando correo de prueba...")
    enviar_correo_prueba()
    
    # Mantener el script corriendo
    while True:
        schedule.run_pending()
        time.sleep(60)

if __name__ == "__main__":
    main() 