# Configuración general
EMAIL_CONFIG = {
    'sender_email': 'hristiankrasimirov7@gmail.com',
    'sender_password': 'jgtq ucny jpxc nyoy',
    'smtp_server': 'smtp.gmail.com',
    'smtp_port': 587
}

# Configuración del informe semanal
REPORT_CONFIG = {
    'schedule': {
        'day_of_week': 0,  # 0 = Lunes
        'hour': 9,
        'minute': 0
    },
    'report_period': {
        'last_days': 7,
        'last_month': 30
    },
    'metrics': [
        'visitas_totales',
        'clientes_potenciales',
        'servicios_solicitados',
        'tasa_conversion',
        'fuentes_trafico',
        'dispositivos',
        'paginas_populares'
    ]
}

# Configuración de limpieza de archivos
CLEANUP_CONFIG = {
    'retention_period': 365,  # días
    'cleanup_schedule': {
        'hour': 0,
        'minute': 0
    }
}