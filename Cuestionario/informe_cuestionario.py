#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import datetime
import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
import pandas as pd
import matplotlib.pyplot as plt
from googleapiclient.discovery import build
from google.oauth2.service_account import Credentials
import json
import logging
import requests
from pathlib import Path

# Configuración de logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    filename='informe_cuestionario.log'
)
logger = logging.getLogger('informe_cuestionario')

# Configuración del correo electrónico
REMITENTE = "informes@spmarketing.agency"  # Remitente (puedes cambiarlo)
DESTINATARIO = "hristiankrasimirov7@gmail.com"
ASUNTO = "SPMarketing Agency - Cuestionario - Informe Semanal"
CONTRASEÑA_APP = "jgtq ucny jpxc nyoy"  # Contraseña de aplicación de Google

# Configuración de Analytics
API_KEY = "AIzaSyBbxgAWvwIf84fiaIJa-F1X_dKEKpQ1ktI"
VIEW_ID = "GA4_PROPERTY_ID"  # Reemplazar con tu ID de propiedad GA4

# Directorio actual
DIRECTORIO_ACTUAL = os.path.dirname(os.path.abspath(__file__))

class InformeAnalytics:
    def __init__(self):
        self.fecha_inicio = (datetime.datetime.now() - datetime.timedelta(days=7)).strftime('%Y-%m-%d')
        self.fecha_fin = datetime.datetime.now().strftime('%Y-%m-%d')
        self.datos_simulados = True  # Cambiar a False cuando se configure la API de Analytics

    def obtener_datos_analytics(self):
        """
        Obtiene datos de Google Analytics
        """
        try:
            if self.datos_simulados:
                return self.simular_datos_analytics()
            
            # Aquí iría la implementación real de Google Analytics
            # Utilizando la API de Google Analytics para GA4
            
            # Ejemplo de cómo se conectaría (requiere configuración adicional)
            """
            scopes = ['https://www.googleapis.com/auth/analytics.readonly']
            key_file_location = os.path.join(DIRECTORIO_ACTUAL, 'credenciales.json')
            credentials = Credentials.from_service_account_file(key_file_location, scopes=scopes)
            analytics = build('analyticsdata', 'v1beta', credentials=credentials)
            
            response = analytics.properties().runReport(
                property=f"properties/{VIEW_ID}",
                body={
                    'dateRanges': [{'startDate': self.fecha_inicio, 'endDate': self.fecha_fin}],
                    'dimensions': [{'name': 'date'}],
                    'metrics': [
                        {'name': 'screenPageViews'},
                        {'name': 'totalUsers'},
                        {'name': 'eventCount'},
                        {'name': 'conversions'}
                    ]
                }
            ).execute()
            
            # Procesar respuesta
            return self.procesar_datos_analytics(response)
            """
            
            return self.simular_datos_analytics()
            
        except Exception as e:
            logger.error(f"Error al obtener datos de Analytics: {str(e)}")
            return self.simular_datos_analytics()

    def simular_datos_analytics(self):
        """
        Simula datos de Analytics para pruebas
        """
        # Generamos 7 días de datos simulados
        fechas = pd.date_range(end=datetime.datetime.now(), periods=7).strftime('%Y-%m-%d').tolist()
        
        # Simulación de datos de tráfico y eventos
        datos = {
            'fecha': fechas,
            'visitas_pagina': [95, 120, 85, 105, 130, 70, 90],
            'usuarios': [65, 80, 55, 70, 85, 45, 60],
            'tiempo_promedio': [120, 150, 110, 130, 160, 100, 125],  # en segundos
            'tasa_rebote': [35, 30, 40, 38, 28, 42, 36],  # en porcentaje
            'inicios_cuestionario': [40, 50, 35, 45, 55, 30, 38],
            'completados': [25, 35, 20, 28, 40, 18, 24],
            'tasa_conversion': [62.5, 70, 57.1, 62.2, 72.7, 60, 63.2]  # en porcentaje
        }
        
        # Simulación de datos demográficos
        datos_demograficos = {
            'dispositivo': ['Desktop', 'Mobile', 'Tablet'],
            'porcentaje': [45, 50, 5]
        }
        
        # Simulación de fuentes de tráfico
        fuentes_trafico = {
            'fuente': ['Directo', 'Redes Sociales', 'Búsqueda Orgánica', 'Referral', 'Email'],
            'porcentaje': [30, 40, 15, 10, 5]
        }
        
        return {
            'trafico': pd.DataFrame(datos),
            'demograficos': pd.DataFrame(datos_demograficos),
            'fuentes': pd.DataFrame(fuentes_trafico)
        }

    def generar_graficos(self, datos):
        """
        Genera gráficos para el informe
        """
        try:
            directorio_imagenes = os.path.join(DIRECTORIO_ACTUAL, 'imagenes_informe')
            os.makedirs(directorio_imagenes, exist_ok=True)
            
            # Lista para almacenar rutas de imágenes
            imagenes = []
            
            # 1. Gráfico de tráfico diario
            plt.figure(figsize=(10, 6))
            plt.plot(datos['trafico']['fecha'], datos['trafico']['visitas_pagina'], marker='o', linewidth=2, color='#003366')
            plt.grid(True, linestyle='--', alpha=0.7)
            plt.title('Visitas diarias a la página del cuestionario', fontsize=14, fontweight='bold')
            plt.xlabel('Fecha')
            plt.ylabel('Número de visitas')
            plt.xticks(rotation=45)
            plt.tight_layout()
            ruta_grafico = os.path.join(directorio_imagenes, 'trafico_diario.png')
            plt.savefig(ruta_grafico)
            plt.close()
            imagenes.append(ruta_grafico)
            
            # 2. Gráfico de conversión
            plt.figure(figsize=(10, 6))
            plt.bar(datos['trafico']['fecha'], datos['trafico']['tasa_conversion'], color='#FF4500')
            plt.grid(True, linestyle='--', alpha=0.7, axis='y')
            plt.title('Tasa de conversión diaria (cuestionarios completados)', fontsize=14, fontweight='bold')
            plt.xlabel('Fecha')
            plt.ylabel('Tasa de conversión (%)')
            plt.xticks(rotation=45)
            plt.tight_layout()
            ruta_grafico = os.path.join(directorio_imagenes, 'tasa_conversion.png')
            plt.savefig(ruta_grafico)
            plt.close()
            imagenes.append(ruta_grafico)
            
            # 3. Gráfico de dispositivos
            plt.figure(figsize=(8, 8))
            plt.pie(datos['demograficos']['porcentaje'], labels=datos['demograficos']['dispositivo'], 
                    autopct='%1.1f%%', startangle=90, colors=['#003366', '#FF4500', '#1B5E20'])
            plt.axis('equal')
            plt.title('Distribución de visitantes por dispositivo', fontsize=14, fontweight='bold')
            ruta_grafico = os.path.join(directorio_imagenes, 'dispositivos.png')
            plt.savefig(ruta_grafico)
            plt.close()
            imagenes.append(ruta_grafico)
            
            # 4. Gráfico de fuentes de tráfico
            plt.figure(figsize=(10, 6))
            plt.barh(datos['fuentes']['fuente'], datos['fuentes']['porcentaje'], color='#1B5E20')
            plt.grid(True, linestyle='--', alpha=0.7, axis='x')
            plt.title('Fuentes de tráfico', fontsize=14, fontweight='bold')
            plt.xlabel('Porcentaje (%)')
            plt.tight_layout()
            ruta_grafico = os.path.join(directorio_imagenes, 'fuentes_trafico.png')
            plt.savefig(ruta_grafico)
            plt.close()
            imagenes.append(ruta_grafico)
            
            return imagenes
            
        except Exception as e:
            logger.error(f"Error al generar gráficos: {str(e)}")
            return []

    def generar_informe_html(self, datos):
        """
        Genera el informe en formato HTML
        """
        try:
            # Generamos el HTML
            inicio_periodo = datos['trafico']['fecha'].iloc[0]
            fin_periodo = datos['trafico']['fecha'].iloc[-1]
            
            # Calculamos algunas métricas agregadas
            total_visitas = datos['trafico']['visitas_pagina'].sum()
            total_usuarios = datos['trafico']['usuarios'].sum()
            total_inicios = datos['trafico']['inicios_cuestionario'].sum()
            total_completados = datos['trafico']['completados'].sum()
            tasa_conversion_promedio = datos['trafico']['tasa_conversion'].mean()
            
            # Crear tabla HTML para datos diarios
            tabla_diaria = datos['trafico'].to_html(index=False, classes='tabla-datos')
            
            # Generar HTML
            html = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Informe Semanal SPMarketing Agency - Cuestionario</title>
                <style>
                    body {{
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        margin: 0;
                        padding: 0;
                    }}
                    .container {{
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 20px;
                    }}
                    .header {{
                        background-color: #003366;
                        color: white;
                        padding: 20px;
                        text-align: center;
                    }}
                    .section {{
                        margin-bottom: 30px;
                        border: 1px solid #ddd;
                        padding: 20px;
                        border-radius: 5px;
                    }}
                    h1, h2, h3 {{
                        color: #003366;
                    }}
                    .highlight {{
                        background-color: #f9f9f9;
                        padding: 15px;
                        border-left: 4px solid #FF4500;
                        margin-bottom: 20px;
                    }}
                    .stat-container {{
                        display: flex;
                        flex-wrap: wrap;
                        justify-content: space-between;
                        margin-bottom: 20px;
                    }}
                    .stat-box {{
                        background-color: #f9f9f9;
                        border-radius: 5px;
                        padding: 15px;
                        width: 48%;
                        margin-bottom: 15px;
                        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                    }}
                    .stat-value {{
                        font-size: 24px;
                        font-weight: bold;
                        color: #FF4500;
                    }}
                    .stat-label {{
                        font-size: 14px;
                        color: #666;
                    }}
                    .tabla-datos {{
                        width: 100%;
                        border-collapse: collapse;
                    }}
                    .tabla-datos th {{
                        background-color: #003366;
                        color: white;
                        padding: 10px;
                        text-align: left;
                    }}
                    .tabla-datos td {{
                        padding: 8px;
                        border-bottom: 1px solid #ddd;
                    }}
                    .tabla-datos tr:nth-child(even) {{
                        background-color: #f9f9f9;
                    }}
                    .footer {{
                        text-align: center;
                        margin-top: 30px;
                        padding-top: 20px;
                        border-top: 1px solid #ddd;
                        color: #666;
                        font-size: 14px;
                    }}
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Informe Semanal SPMarketing Agency</h1>
                    <p>Rendimiento del Cuestionario</p>
                </div>
                <div class="container">
                    <div class="section">
                        <h2>Resumen del Período: {inicio_periodo} a {fin_periodo}</h2>
                        <div class="highlight">
                            Este informe presenta los principales indicadores de rendimiento del cuestionario en tu sitio web durante la última semana.
                        </div>
                        
                        <div class="stat-container">
                            <div class="stat-box">
                                <div class="stat-value">{total_visitas}</div>
                                <div class="stat-label">Visitas totales</div>
                            </div>
                            <div class="stat-box">
                                <div class="stat-value">{total_usuarios}</div>
                                <div class="stat-label">Usuarios únicos</div>
                            </div>
                            <div class="stat-box">
                                <div class="stat-value">{total_inicios}</div>
                                <div class="stat-label">Inicios del cuestionario</div>
                            </div>
                            <div class="stat-box">
                                <div class="stat-value">{total_completados}</div>
                                <div class="stat-label">Cuestionarios completados</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="section">
                        <h2>Tasa de Conversión</h2>
                        <p>La tasa de conversión promedio para este período es: <strong>{tasa_conversion_promedio:.1f}%</strong></p>
                        <p>Este porcentaje representa la proporción de visitantes que completan el cuestionario después de haberlo iniciado.</p>
                    </div>
                    
                    <div class="section">
                        <h2>Datos Diarios Detallados</h2>
                        {tabla_diaria}
                    </div>
                    
                    <div class="section">
                        <h2>Recomendaciones para mejorar el rendimiento</h2>
                        <ul>
                            <li>Simplificar el formulario si la tasa de abandono es alta</li>
                            <li>Añadir incentivos para completar el cuestionario</li>
                            <li>Optimizar la página para dispositivos móviles</li>
                            <li>Probar diferentes llamados a la acción (CTA)</li>
                            <li>Implementar pruebas A/B para mejorar la conversión</li>
                        </ul>
                    </div>
                    
                    <div class="footer">
                        <p>Este informe ha sido generado automáticamente. Por favor no responda a este correo.</p>
                        <p>© {datetime.datetime.now().year} SPMarketing Agency</p>
                    </div>
                </div>
            </body>
            </html>
            """
            
            # Guardamos el HTML en un archivo
            ruta_html = os.path.join(DIRECTORIO_ACTUAL, 'informe_semanal.html')
            with open(ruta_html, 'w', encoding='utf-8') as f:
                f.write(html)
                
            return ruta_html
            
        except Exception as e:
            logger.error(f"Error al generar informe HTML: {str(e)}")
            return None

    def enviar_informe(self, ruta_html, imagenes):
        """
        Envía el informe por correo electrónico
        """
        try:
            mensaje = MIMEMultipart("alternative")
            mensaje["Subject"] = ASUNTO
            mensaje["From"] = REMITENTE
            mensaje["To"] = DESTINATARIO
            
            # Leemos el HTML
            with open(ruta_html, 'r', encoding='utf-8') as f:
                html_content = f.read()
                
            # Adjuntamos el HTML
            parte_html = MIMEText(html_content, "html")
            mensaje.attach(parte_html)
            
            # Adjuntamos las imágenes
            for img_path in imagenes:
                with open(img_path, 'rb') as img_file:
                    nombre_archivo = os.path.basename(img_path)
                    adjunto = MIMEApplication(img_file.read(), _subtype="png")
                    adjunto.add_header('Content-Disposition', 'attachment', filename=nombre_archivo)
                    mensaje.attach(adjunto)
            
            # Enviamos el correo
            context = ssl.create_default_context()
            with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
                server.login(DESTINATARIO, CONTRASEÑA_APP)
                server.sendmail(REMITENTE, DESTINATARIO, mensaje.as_string())
            
            logger.info(f"Informe enviado correctamente a {DESTINATARIO}")
            return True
            
        except Exception as e:
            logger.error(f"Error al enviar informe por correo: {str(e)}")
            return False

    def ejecutar(self):
        """
        Método principal para generar y enviar el informe
        """
        try:
            logger.info("Iniciando generación de informe semanal")
            
            # Obtener datos de Analytics
            datos = self.obtener_datos_analytics()
            
            # Generar gráficos
            imagenes = self.generar_graficos(datos)
            
            # Generar informe HTML
            ruta_html = self.generar_informe_html(datos)
            
            if ruta_html:
                # Enviar informe
                enviado = self.enviar_informe(ruta_html, imagenes)
                if enviado:
                    logger.info("Proceso de informe completado con éxito")
                else:
                    logger.error("Error al enviar el informe")
            else:
                logger.error("Error al generar el informe HTML")
                
        except Exception as e:
            logger.error(f"Error en la ejecución del informe: {str(e)}")

if __name__ == "__main__":
    informe = InformeAnalytics()
    informe.ejecutar() 