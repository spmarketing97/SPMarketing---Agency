import os
import smtplib
import ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from datetime import datetime, timedelta
import schedule
import time
import sqlite3
import plotly.graph_objects as go

# Configuración de correo
EMAIL_REMITENTE = "hristiankrasimirov7@gmail.com"
EMAIL_PASSWORD = "jgtq ucny jpxc nyoy"
EMAIL_DESTINATARIO = "hristiankrasimirov7@gmail.com"

def obtener_estadisticas(dias):
    """Obtiene las estadísticas de la base de datos"""
    # Aquí irían las consultas a tu base de datos
    # Por ahora usaremos datos de ejemplo
    return {
        'visitas_totales': 1500,
        'visitas_ultimos_7': 350,
        'visitas_ultimos_30': 1200,
        'leads_total': 45,
        'leads_ultimos_7': 12,
        'leads_ultimos_30': 35,
        'servicios_populares': [
            ('Desarrollo Web', 15),
            ('SEO', 12),
            ('Marketing en Redes Sociales', 10)
        ],
        'tasa_conversion': 3.5,
        'tiempo_promedio': '2:45',
        'fuentes_trafico': {
            'Orgánico': 45,
            'Redes Sociales': 30,
            'Directo': 15,
            'Email': 10
        }
    }

def generar_graficas(stats):
    """Genera las gráficas para el informe"""
    # Gráfica de servicios populares
    fig_servicios = go.Figure(data=[
        go.Bar(
            x=[s[0] for s in stats['servicios_populares']],
            y=[s[1] for s in stats['servicios_populares']]
        )
    ])
    fig_servicios.update_layout(title='Servicios Más Solicitados')
    fig_servicios.write_image("imagenes_informe/servicios_populares.png")

    # Gráfica de fuentes de tráfico
    fig_trafico = go.Figure(data=[go.Pie(
        labels=list(stats['fuentes_trafico'].keys()),
        values=list(stats['fuentes_trafico'].values())
    )])
    fig_trafico.update_layout(title='Fuentes de Tráfico')
    fig_trafico.write_image("imagenes_informe/fuentes_trafico.png")

def generar_informe_html(dias=7):
    """Genera un informe HTML con las estadísticas detalladas de la landing page"""
    stats = obtener_estadisticas(dias)
    generar_graficas(stats)
    
    fecha_actual = datetime.now().strftime("%d/%m/%Y")
    
    return f"""
    <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 800px; margin: 0 auto; padding: 20px; }}
                .header {{ background-color: #003366; color: white; padding: 20px; text-align: center; }}
                .section {{ margin: 20px 0; padding: 20px; background-color: #f9f9f9; border-radius: 5px; }}
                .metric {{ display: inline-block; width: 45%; margin: 10px; padding: 15px; background-color: white; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }}
                .highlight {{ color: #003366; font-weight: bold; }}
                img {{ max-width: 100%; height: auto; margin: 20px 0; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Informe Semanal - SPMarketing Agency</h1>
                    <p>Fecha: {fecha_actual}</p>
                </div>
                
                <div class="section">
                    <h2>Resumen de Visitas</h2>
                    <div class="metric">
                        <h3>Últimos 7 días</h3>
                        <p class="highlight">{stats['visitas_ultimos_7']} visitas</p>
                    </div>
                    <div class="metric">
                        <h3>Últimos 30 días</h3>
                        <p class="highlight">{stats['visitas_ultimos_30']} visitas</p>
                    </div>
                </div>

                <div class="section">
                    <h2>Leads y Conversiones</h2>
                    <div class="metric">
                        <h3>Leads Generados (7 días)</h3>
                        <p class="highlight">{stats['leads_ultimos_7']} leads</p>
                    </div>
                    <div class="metric">
                        <h3>Tasa de Conversión</h3>
                        <p class="highlight">{stats['tasa_conversion']}%</p>
                    </div>
                </div>

                <div class="section">
                    <h2>Servicios Más Solicitados</h2>
                    <img src="imagenes_informe/servicios_populares.png" alt="Servicios populares">
                </div>

                <div class="section">
                    <h2>Fuentes de Tráfico</h2>
                    <img src="imagenes_informe/fuentes_trafico.png" alt="Fuentes de tráfico">
                </div>

                <div class="section">
                    <h2>Tiempo Promedio en Sitio</h2>
                    <p class="highlight">{stats['tiempo_promedio']} minutos</p>
                </div>

                <div class="section">
                    <p>Este informe fue generado automáticamente por SPMarketing Agency.</p>
                    <p>Para cualquier consulta, contacta con nuestro equipo.</p>
                </div>
            </div>
        </body>
    </html>
    """

def enviar_informe_email(dias=7):
    """Envía el informe por correo electrónico"""
    try:
        mensaje = MIMEMultipart()
        mensaje["From"] = EMAIL_REMITENTE
        mensaje["To"] = EMAIL_DESTINATARIO
        mensaje["Subject"] = f"Informe Semanal SPMarketing - {datetime.now().strftime('%d/%m/%Y')}"

        html = generar_informe_html(dias)
        mensaje.attach(MIMEText(html, "html"))

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as servidor:
            servidor.login(EMAIL_REMITENTE, EMAIL_PASSWORD)
            servidor.send_message(mensaje)

        print(f"✅ Informe enviado correctamente a {EMAIL_DESTINATARIO}")
    except Exception as e:
        print(f"❌ Error al enviar el informe: {str(e)}")

def programar_informe_semanal():
    """Programa el envío de informes para cada lunes a las 9:00 AM"""
    # Informe semanal cada lunes
    schedule.every().monday.at("09:00").do(enviar_informe_email, dias=7)
    
    # Informe mensual
    schedule.every(30).days.at("09:00").do(enviar_informe_email, dias=30)
    
    print(f"✅ Informes programados:")
    print(f"   - Informe semanal: Cada lunes a las 9:00 AM")
    print(f"   - Informe mensual: Cada 30 días a las 9:00 AM")
    print(f"   - Destinatario: {EMAIL_DESTINATARIO}")

    while True:
        schedule.run_pending()
        time.sleep(60)

if __name__ == "__main__":
    # Asegurar que existe el directorio para las imágenes
    if not os.path.exists("imagenes_informe"):
        os.makedirs("imagenes_informe")
    
    # Enviar un informe de prueba inicial
    print("📊 Generando informe de prueba...")
    enviar_informe_email(dias=7)
    
    # Iniciar la programación de informes
    print("⏰ Iniciando programación de informes...")
    programar_informe_semanal()