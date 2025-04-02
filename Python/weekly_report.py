import schedule
import time
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.image import MIMEImage
import os
from datetime import datetime, timedelta
from config import EMAIL_CONFIG, REPORT_CONFIG
from informe_landing_page import generate_report

def send_email_report(report_html, images):
    try:
        msg = MIMEMultipart()
        msg['From'] = EMAIL_CONFIG['sender_email']
        msg['To'] = EMAIL_CONFIG['sender_email']  # Sending to same email
        msg['Subject'] = f'Informe Semanal SPMarketing - {datetime.now().strftime("%d/%m/%Y")}'

        # Add HTML content
        msg.attach(MIMEText(report_html, 'html'))

        # Add images
        for img_name, img_path in images.items():
            with open(img_path, 'rb') as f:
                img_data = f.read()
                image = MIMEImage(img_data)
                image.add_header('Content-ID', f'<{img_name}>')
                msg.attach(image)

        # Connect to SMTP server and send email
        with smtplib.SMTP(EMAIL_CONFIG['smtp_server'], EMAIL_CONFIG['smtp_port']) as server:
            server.starttls()
            server.login(EMAIL_CONFIG['sender_email'], EMAIL_CONFIG['sender_password'])
            server.send_message(msg)
            
        print(f"Informe enviado correctamente a {EMAIL_CONFIG['sender_email']}")
        return True
    except Exception as e:
        print(f"Error al enviar el informe: {str(e)}")
        return False

def generate_and_send_report():
    print(f"Generando informe semanal - {datetime.now().strftime('%d/%m/%Y %H:%M')}")
    
    # Generate report
    report_html, images = generate_report(
        last_days=REPORT_CONFIG['report_period']['last_days'],
        last_month=REPORT_CONFIG['report_period']['last_month']
    )
    
    # Send report
    if report_html and images:
        send_email_report(report_html, images)
    else:
        print("Error: No se pudo generar el informe")

def schedule_report():
    # Schedule weekly report for Monday at 9:00
    schedule.every().monday.at("09:00").do(generate_and_send_report)
    
    print("Informe semanal programado para todos los lunes a las 09:00")
    
    while True:
        schedule.run_pending()
        time.sleep(60)  # Check every minute

if __name__ == "__main__":
    schedule_report()