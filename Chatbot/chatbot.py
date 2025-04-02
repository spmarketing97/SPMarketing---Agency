from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import time
import os
import re
import random
from datetime import datetime
from bs4 import BeautifulSoup
import requests

app = Flask(__name__)

# Función para analizar el contenido de la landing page
def analyze_landing_page():
    landing_page_data = {
        'services': [],
        'benefits': [],
        'testimonials': [],
        'pricing': [],
        'contact_info': {},
        'company_info': {},
        'faq': []  # Para preguntas frecuentes si existen en la landing page
    }
    
    try:
        # Rutas a los archivos HTML de la landing page
        index_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'index.html')
        pricing_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'precios.html')
        
        # Analizar index.html
        if os.path.exists(index_path):
            with open(index_path, 'r', encoding='utf-8') as file:
                content = file.read()
                soup = BeautifulSoup(content, 'html.parser')
                
                # Extraer servicios
                services_section = soup.find('section', {'id': 'servicios'}) or soup.find('section', {'class': re.compile(r'servicios|services')})
                if services_section:
                    service_cards = services_section.find_all('div', {'class': re.compile(r'benefit-card|service-card|card')})
                    for card in service_cards:
                        title = card.find('h3') or card.find('h2') or card.find('h4')
                        description = card.find('p')
                        if title and description:
                            landing_page_data['services'].append({
                                'title': title.text.strip(),
                                'description': description.text.strip(),
                                'keywords': [word.lower() for word in title.text.strip().split() if len(word) > 3]
                            })
                
                # Extraer beneficios
                benefits_section = soup.find('section', {'id': 'beneficios'}) or soup.find('section', {'class': re.compile(r'beneficios|benefits')})
                if benefits_section:
                    benefit_items = benefits_section.find_all('div', {'class': re.compile(r'benefit-card|card')})
                    for item in benefit_items:
                        title = item.find('h3') or item.find('h2') or item.find('h4')
                        description = item.find('p')
                        if title and description:
                            landing_page_data['benefits'].append({
                                'title': title.text.strip(),
                                'description': description.text.strip(),
                                'keywords': [word.lower() for word in title.text.strip().split() if len(word) > 3]
                            })
                
                # Extraer testimonios
                testimonials_section = soup.find('section', {'id': 'testimonios'}) or soup.find('section', {'class': re.compile(r'testimonios|testimonials')})
                if testimonials_section:
                    testimonial_items = testimonials_section.find_all('div', {'class': re.compile(r'testimonial-card|testimonial|card')})
                    for item in testimonial_items:
                        quote = item.find('p', {'class': re.compile(r'testimonial-text|quote')}) or item.find('p')
                        author = item.find('p', {'class': re.compile(r'testimonial-author|author')}) or item.find('cite') or item.find_all('p')[-1] if item.find_all('p') else None
                        if quote and author:
                            landing_page_data['testimonials'].append({
                                'quote': quote.text.strip(),
                                'author': author.text.strip()
                            })
                
                # Extraer información de contacto
                contact_section = soup.find('section', {'id': re.compile(r'contacto|contact')}) or soup.find('footer')
                if contact_section:
                    # Buscar correo electrónico
                    email_pattern = r'[\w.+-]+@[\w-]+\.[\w.-]+'
                    email_matches = re.findall(email_pattern, contact_section.text)
                    if email_matches:
                        landing_page_data['contact_info']['email'] = email_matches[0]
                    
                    # Buscar teléfono
                    phone_pattern = r'(?:\+\d{1,3}\s?)?(?:\(\d{1,4}\)\s?)?\d{6,10}'
                    phone_matches = re.findall(phone_pattern, contact_section.text)
                    if phone_matches:
                        landing_page_data['contact_info']['phone'] = phone_matches[0]
                    
                    # Buscar enlaces de redes sociales
                    social_links = contact_section.find_all('a', href=re.compile(r'facebook|twitter|instagram|linkedin|whatsapp|telegram'))
                    if social_links:
                        landing_page_data['contact_info']['social'] = []
                        for link in social_links:
                            social_type = ''
                            if 'facebook' in link['href']:
                                social_type = 'Facebook'
                            elif 'twitter' in link['href'] or 'x.com' in link['href']:
                                social_type = 'Twitter'
                            elif 'instagram' in link['href']:
                                social_type = 'Instagram'
                            elif 'linkedin' in link['href']:
                                social_type = 'LinkedIn'
                            elif 'whatsapp' in link['href']:
                                social_type = 'WhatsApp'
                            elif 'telegram' in link['href']:
                                social_type = 'Telegram'
                            
                            if social_type:
                                landing_page_data['contact_info']['social'].append({
                                    'type': social_type,
                                    'url': link['href']
                                })
                
                # Extraer información de la empresa
                about_section = soup.find('section', {'id': re.compile(r'sobre-nosotros|about|nosotros|quienes-somos')}) or soup.find('section', {'class': re.compile(r'about|nosotros')})
                if about_section:
                    company_description = about_section.find('p')
                    if company_description:
                        landing_page_data['company_info']['description'] = company_description.text.strip()
                
                # Extraer FAQ si existe
                faq_section = soup.find('section', {'id': re.compile(r'faq|preguntas|faqs')}) or soup.find('section', {'class': re.compile(r'faq|preguntas|faqs')})
                if faq_section:
                    questions = faq_section.find_all('h3') or faq_section.find_all('h4') or faq_section.find_all('strong')
                    for q in questions:
                        answer = q.find_next('p')
                        if answer:
                            landing_page_data['faq'].append({
                                'question': q.text.strip(),
                                'answer': answer.text.strip()
                            })
        
        # Analizar precios.html
        if os.path.exists(pricing_path):
            with open(pricing_path, 'r', encoding='utf-8') as file:
                content = file.read()
                soup = BeautifulSoup(content, 'html.parser')
                
                # Extraer planes de precios
                pricing_cards = soup.find_all('div', {'class': re.compile(r'pricing-card|price-card|card')})
                for card in pricing_cards:
                    plan_name = card.find('h3') or card.find('h2') or card.find('h4')
                    price_value = card.find('span', {'class': re.compile(r'price-value|price')}) or card.find('strong')
                    features = card.find('div', {'class': re.compile(r'pricing-features|features')}) or card.find('ul')
                    
                    if plan_name and price_value:
                        plan_info = {
                            'name': plan_name.text.strip(),
                            'price': price_value.text.strip(),
                            'features': [],
                            'keywords': [word.lower() for word in plan_name.text.strip().split() if len(word) > 3]
                        }
                        
                        if features:
                            feature_items = features.find_all('li')
                            for item in feature_items:
                                if item.text.strip():
                                    plan_info['features'].append(item.text.strip())
                        
                        landing_page_data['pricing'].append(plan_info)
    
    except Exception as e:
        print(f"Error analyzing landing page: {str(e)}")
    
    return landing_page_data

# Analizar la landing page al iniciar
landing_page_info = analyze_landing_page()
CORS(app)

# Respuestas predefinidas del chatbot con información detallada de la landing page
responses = {
    'greeting': [
        "¡Hola! 👋 Soy el asistente virtual de SPMarketing. ¿En qué puedo ayudarte hoy?",
        "Te puedo ayudar con:\n1️⃣ Información sobre nuestros servicios de marketing digital\n2️⃣ Detalles de nuestros planes y precios\n3️⃣ Agendar una consulta gratuita personalizada\n4️⃣ Conocer casos de éxito y testimonios\n5️⃣ Información sobre nuestras estrategias con IA",
    ],
    'greeting_personalized': [
        "¡Hola {name}! 👋 Soy el asistente virtual de SPMarketing. ¿En qué puedo ayudarte hoy?",
        "¡Bienvenido/a de nuevo {name}! ¿En qué puedo ayudarte hoy con tu {industry}?",
    ],
    'services': [
        "En SPMarketing ofrecemos servicios especializados en marketing digital:\n\n"
        "🚀 Desarrollo web y landing pages - Creamos sitios web optimizados para convertir visitantes en clientes\n\n"
        "📱 Gestión de redes sociales - Creamos y gestionamos contenido atractivo para aumentar tu comunidad\n\n"
        "🎯 Marketing con IA - Utilizamos inteligencia artificial para optimizar tus campañas y contenidos\n\n"
        "📊 SEO y análisis de datos - Mejoramos tu visibilidad en buscadores y analizamos resultados\n\n"
        "¿Sobre cuál de estos servicios te gustaría más información?"
    ],
    'services_web': [
        "Nuestro servicio de desarrollo web incluye:\n\n"
        "✅ Diseño personalizado y responsive\n"
        "✅ Optimización para motores de búsqueda (SEO)\n"
        "✅ Integración con redes sociales y herramientas de marketing\n"
        "✅ Análisis de comportamiento de usuarios\n"
        "✅ Optimización de velocidad de carga\n\n"
        "Todos nuestros sitios web están diseñados para maximizar conversiones y generar resultados medibles."
    ],
    'services_social': [
        "Nuestra gestión de redes sociales incluye:\n\n"
        "✅ Creación de contenido optimizado con IA\n"
        "✅ Programación y publicación de posts\n"
        "✅ Interacción con tu audiencia\n"
        "✅ Análisis de métricas y resultados\n"
        "✅ Estrategias para aumentar seguidores y engagement\n\n"
        "Dependiendo del plan, publicamos entre 5-7 posts semanales optimizados con IA."
    ],
    'services_ai': [
        "Nuestras estrategias de marketing con IA incluyen:\n\n"
        "✅ Análisis predictivo de tendencias de mercado\n"
        "✅ Personalización de contenidos según tu audiencia\n"
        "✅ Optimización automática de campañas\n"
        "✅ Generación de contenido de alta calidad\n"
        "✅ Análisis de sentimiento en redes sociales\n\n"
        "La IA nos permite maximizar resultados mientras optimizamos recursos."
    ],
    'services_seo': [
        "Nuestros servicios de SEO y análisis incluyen:\n\n"
        "✅ Auditoría SEO completa\n"
        "✅ Optimización de palabras clave\n"
        "✅ Creación de contenido optimizado\n"
        "✅ Análisis de competencia\n"
        "✅ Informes semanales detallados\n\n"
        "Trabajamos para mejorar tu posicionamiento en buscadores y aumentar el tráfico cualificado."
    ],
    'pricing': [
        "Tenemos varios planes adaptados a diferentes necesidades:\n\n"
        "💎 Plan Premium (299€/mes)\n"
        "🔥 Plan Pro (599€/mes)\n"
        "👑 Plan Business (Personalizado)\n\n"
        "Todos nuestros planes incluyen soporte continuo y no tienen permanencia.\n\n"
        "¿Te gustaría conocer los detalles de algún plan específico?"
    ],
    'pricing_premium': [
        "El Plan Premium (299€/mes) incluye:\n\n"
        "✅ Desarrollo de Landing Page o Sitio Web\n"
        "✅ Optimización SEO básica\n"
        "✅ Gestión de redes sociales\n"
        "✅ 5 Publicaciones Semanales Optimizados con AI\n"
        "✅ Análisis de mercado y competencia\n"
        "✅ Informes semanales detallados\n"
        "✅ Sin permanencia\n\n"
        "Es ideal para emprendedores y pequeñas empresas que quieren iniciar o mejorar su presencia digital."
    ],
    'pricing_pro': [
        "El Plan Pro (599€/mes) incluye:\n\n"
        "✅ Desarrollo web, landing page o Ecommerce\n"
        "✅ Optimización SEO Profesional\n"
        "✅ Gestión de redes sociales y Contenido Automatizado con AI\n"
        "✅ 7 Publicaciones Semanales optimizadas con AI\n"
        "✅ Análisis de Mercado y Competencia optimizado con AI\n"
        "✅ Informes semanales detallados\n"
        "✅ Sin permanencia\n\n"
        "Perfecto para empresas que buscan un crecimiento significativo en su presencia digital."
    ],
    'pricing_business': [
        "El Plan Business (precio personalizado) es nuestra solución más completa:\n\n"
        "✅ Solución completa y personalizada\n"
        "✅ Estrategia de marketing digital integral\n"
        "✅ Desarrollo web avanzado\n"
        "✅ Campañas publicitarias optimizadas\n"
        "✅ Contenido premium generado con IA\n"
        "✅ Análisis avanzado de datos\n\n"
        "Ideal para empresas medianas y grandes con objetivos ambiciosos de crecimiento."
    ],
    'consultation': [
        "¡Excelente decisión! Ofrecemos una consulta inicial totalmente gratuita donde:\n\n"
        "✅ Analizaremos tu situación actual\n"
        "✅ Evaluaremos tu competencia\n"
        "✅ Identificaremos oportunidades de mejora\n"
        "✅ Propondremos una estrategia personalizada\n\n"
        "¿Te gustaría agendar tu consulta gratuita ahora? Puedes hacerlo a través de nuestro formulario de contacto o directamente por WhatsApp."
    ],
    'testimonials': [
        "Nuestros clientes han experimentado resultados excepcionales:\n\n"
        "🌟 'Aumentamos nuestras ventas en un 150% en solo 3 meses' - María G., Tienda Online\n\n"
        "🌟 'Nuestra presencia en redes sociales creció exponencialmente' - Carlos R., Consultoría\n\n"
        "🌟 'El ROI de nuestra inversión en marketing se multiplicó por 3' - Laura S., Agencia Inmobiliaria\n\n"
        "Tenemos más de 6.800 clientes satisfechos que respaldan nuestro trabajo."
    ],
    'contact': [
        "Puedes contactarnos por varios medios:\n\n"
        "📱 WhatsApp: https://wa.link/uxacg0\n"
        "📧 Email: solucionesworld2016@gmail.com\n"
        "📱 Telegram: https://t.me/SPMarketing_KR\n\n"
        "¿Qué medio prefieres para comunicarte? Estamos disponibles para responder tus consultas y agendar una llamada personalizada."
    ],
    'benefits': [
        "Al trabajar con SPMarketing obtendrás beneficios como:\n\n"
        "✅ Estrategias personalizadas basadas en datos\n"
        "✅ Tecnología de IA avanzada para optimizar resultados\n"
        "✅ Informes detallados y transparentes\n"
        "✅ Flexibilidad sin contratos de permanencia\n"
        "✅ Equipo de expertos en marketing digital\n\n"
        "Nuestro objetivo es maximizar tu ROI y ayudarte a alcanzar tus metas de negocio."
    ],
    'closing': [
        "¿Te gustaría dar el siguiente paso?\n\n"
        "Podemos agendar una consulta gratuita para analizar tu caso específico y proponerte una estrategia personalizada.\n\n"
        "También puedes aprovechar nuestra oferta especial por tiempo limitado. ¿Te interesaría conocer más detalles?"
    ],
    'default': [
        "Entiendo. Para ayudarte mejor, ¿te gustaría:\n\n"
        "1️⃣ Conocer más sobre nuestros servicios de marketing digital\n"
        "2️⃣ Ver detalles de nuestros planes y precios\n"
        "3️⃣ Agendar una consulta gratuita personalizada\n"
        "4️⃣ Hablar directamente con un asesor\n"
        "5️⃣ Conocer casos de éxito y testimonios"
    ],
    'faq': [
        "Aquí tienes la respuesta a tu pregunta:\n\n"
        "[RESPUESTA_FAQ]\n\n"
        "¿Hay algo más en lo que pueda ayudarte?"
    ]
}

def get_intent(message, conversation_history=None, conversation_id=None):
    message = message.lower()
    
    # Mapeo de palabras clave a intenciones
    intents = {
        'greeting': ['hola', 'buenos días', 'buenas', 'hey', 'saludos', 'qué tal', 'como estás', 'buen día', 'holi', 'buenas tardes', 'buenas noches'],
        'services': ['servicios', 'ofreces', 'hacen', 'marketing', 'digital', 'ofrecen', 'qué hacen', 'qué ofrecen', 'cómo trabajan'],
        'services_web': ['web', 'página', 'sitio', 'landing', 'desarrollo web', 'diseño web', 'página web', 'sitio web', 'landing page', 'ecommerce', 'tienda online'],
        'services_social': ['redes', 'redes sociales', 'facebook', 'instagram', 'twitter', 'linkedin', 'social media', 'comunidad', 'seguidores', 'engagement'],
        'services_ai': ['ia', 'inteligencia artificial', 'ai', 'automatización', 'automatizado', 'tecnología', 'machine learning', 'algoritmo', 'chatbot', 'robot'],
        'services_seo': ['seo', 'posicionamiento', 'google', 'buscadores', 'análisis', 'datos', 'métricas', 'tráfico', 'keywords', 'palabras clave', 'orgánico'],
        'pricing': ['precio', 'precios', 'planes', 'costo', 'cuanto', 'cuánto', 'valor', 'tarifa', 'tarifas', 'pagar', 'inversión', 'presupuesto', 'mensualidad'],
        'pricing_premium': ['premium', '299', 'básico', 'plan básico', 'plan premium', 'plan inicial', 'empezar', 'comenzar', 'principiante'],
        'pricing_pro': ['pro', '599', 'profesional', 'plan pro', 'plan profesional', 'intermedio', 'avanzado'],
        'pricing_business': ['business', 'empresa', 'personalizado', 'plan business', 'plan empresa', 'corporativo', 'grande', 'completo'],
        'consultation': ['consulta', 'asesoría', 'reunión', 'agendar', 'cita', 'llamada', 'consultoría', 'gratis', 'gratuita', 'demo', 'prueba'],
        'testimonials': ['testimonios', 'opiniones', 'clientes', 'casos', 'éxito', 'resultados', 'experiencias', 'reseñas', 'valoraciones', 'feedback'],
        'benefits': ['beneficios', 'ventajas', 'por qué', 'diferencia', 'mejor', 'especial', 'único', 'valor añadido', 'propuesta de valor'],
        'contact': ['contacto', 'contactar', 'whatsapp', 'email', 'teléfono', 'llamar', 'correo', 'mensaje', 'comunicar', 'hablar'],
        'closing': ['contratar', 'empezar', 'comenzar', 'interesado', 'interesa', 'siguiente paso', 'comprar', 'adquirir', 'listo', 'decidido'],
        'faq': ['faq', 'preguntas', 'frecuentes', 'duda', 'consulta', 'pregunta']
    }
    
    # Verificar si hay contexto de conversación previo
    previous_intent = None
    if conversation_history and conversation_id in conversation_history:
        previous_intent = conversation_history[conversation_id].get('last_intent')
    
    # Primero buscar coincidencias específicas
    for intent, keywords in intents.items():
        # Buscar frases exactas primero
        for keyword in keywords:
            if ' ' in keyword and keyword in message:
                return intent
    
    # Luego buscar palabras individuales
    for intent, keywords in intents.items():
        if any(keyword in message.split() or 
               (len(keyword) > 3 and keyword in message) for keyword in keywords):
            return intent
    
    # Análisis de contexto para intenciones no detectadas directamente
    if any(word in message for word in ['ayuda', 'duda', 'pregunta', 'información', 'info']):
        return 'greeting'
    
    if any(word in message for word in ['mejor', 'recomendación', 'sugerir', 'recomendar', 'aconsejar']):
        return 'benefits'
    
    if any(word in message for word in ['comprar', 'contratar', 'pagar', 'adquirir', 'interesa', 'quiero']):
        return 'closing'
    
    # Análisis contextual basado en la conversación previa
    if previous_intent:
        # Si estaba hablando de servicios y pregunta por más detalles
        if previous_intent == 'services' and any(word in message for word in ['más', 'detalles', 'explica', 'cómo']):
            return 'services'
        
        # Si estaba hablando de precios y pregunta por comparaciones o detalles
        if previous_intent.startswith('pricing') and any(word in message for word in ['diferencia', 'comparar', 'mejor', 'incluye']):
            return 'pricing'
        
        # Si estaba en proceso de cierre y muestra interés
        if previous_intent == 'closing' and any(word in message for word in ['sí', 'ok', 'vale', 'bueno', 'adelante']):
            return 'consultation'
    
    # Análisis semántico básico para preguntas comunes
    if re.search(r'(cuál|qué|cómo) es (el|la|tu) mejor', message) or re.search(r'recomiendas', message):
        return 'benefits'
    
    if re.search(r'(cuánto|qué precio|cuál es el costo)', message):
        return 'pricing'
    
    if re.search(r'(cómo|dónde) (puedo|te) contactar', message) or re.search(r'(cuál es tu|tienes) (teléfono|correo|whatsapp)', message):
        return 'contact'
    
    # Buscar coincidencias con información extraída de la landing page
    for service in landing_page_info['services']:
        if any(keyword in message for keyword in service.get('keywords', [])):
            if 'web' in ' '.join(service.get('keywords', [])).lower():
                return 'services_web'
            elif any(kw in ' '.join(service.get('keywords', [])).lower() for kw in ['redes', 'social']):
                return 'services_social'
            elif any(kw in ' '.join(service.get('keywords', [])).lower() for kw in ['ia', 'ai', 'inteligencia']):
                return 'services_ai'
            elif any(kw in ' '.join(service.get('keywords', [])).lower() for kw in ['seo', 'posicionamiento']):
                return 'services_seo'
            else:
                return 'services'
    
    for plan in landing_page_info['pricing']:
        if any(keyword in message for keyword in plan.get('keywords', [])):
            plan_name = plan.get('name', '').lower()
            if 'premium' in plan_name or '299' in plan_name:
                return 'pricing_premium'
            elif 'pro' in plan_name or '599' in plan_name:
                return 'pricing_pro'
            elif 'business' in plan_name or 'empresa' in plan_name:
                return 'pricing_business'
            else:
                return 'pricing'
    
    # Buscar coincidencias con preguntas frecuentes
    for faq_item in landing_page_info['faq']:
        question_words = set(faq_item.get('question', '').lower().split())
        message_words = set(message.split())
        # Si hay al menos 3 palabras en común con la pregunta
        if len(question_words.intersection(message_words)) >= 3:
            return 'faq'
    
    return 'default'

def log_conversation(conversation_id, user_message, bot_response, intent=None):
    log_dir = "chat_logs"
    if not os.path.exists(log_dir):
        os.makedirs(log_dir)
    
    log_file = os.path.join(log_dir, f"chat_{datetime.now().strftime('%Y%m%d')}.log")
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    with open(log_file, "a", encoding="utf-8") as f:
        f.write(f"[{timestamp}] Conversation ID: {conversation_id}\n")
        f.write(f"User: {user_message}\n")
        f.write(f"Intent: {intent}\n")
        f.write(f"Bot: {bot_response}\n")
        f.write("-" * 50 + "\n")

# Almacenamiento de conversaciones para seguimiento
conversation_history = {}

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        user_message = data.get('message', '').strip()
        conversation_id = data.get('conversation_id', 'unknown')
        
        if not user_message:
            return jsonify({'error': 'Mensaje vacío'}), 400
        
        # Inicializar o recuperar el historial de esta conversación
        if conversation_id not in conversation_history:
            conversation_history[conversation_id] = {
                'messages': [],
                'last_intent': None,
                'services_discussed': [],
                'plans_discussed': [],
                'stage': 'initial',  # initial, exploring, interested, closing
                'user_info': {},     # Almacenar información del usuario
                'questions_asked': [] # Seguimiento de preguntas realizadas
            }
        
        # Guardar el mensaje del usuario
        conversation_history[conversation_id]['messages'].append({
            'role': 'user',
            'content': user_message,
            'timestamp': datetime.now().isoformat()
        })
        
        # Determinar la intención del usuario con contexto de la conversación
        intent = get_intent(user_message, conversation_history, conversation_id)
        
        # Actualizar el historial con la intención detectada
        conversation_history[conversation_id]['last_intent'] = intent
        
        # Actualizar la etapa de la conversación
        conv_history = conversation_history[conversation_id]
        message_lower = user_message.lower()
        
        # Extraer posible información del usuario
        if re.search(r'me llamo|soy|mi nombre es', message_lower):
            name_match = re.search(r'(?:me llamo|soy|mi nombre es)\s+([A-Za-zÁáÉéÍíÓóÚúÑñ]+)', message_lower)
            if name_match:
                conv_history['user_info']['name'] = name_match.group(1).capitalize()
        
        if re.search(r'mi empresa|mi negocio|mi compañía', message_lower):
            company_match = re.search(r'(?:mi empresa|mi negocio|mi compañía)\s+(?:es|se llama)?\s+([A-Za-zÁáÉéÍíÓóÚúÑñ\s]+)', message_lower)
            if company_match:
                conv_history['user_info']['company'] = company_match.group(1).strip()
        
        # Extraer posible sector o industria
        industry_keywords = ['ecommerce', 'tienda', 'restaurante', 'hotel', 'inmobiliaria', 'educación', 'salud', 'tecnología', 'consultoría']
        for keyword in industry_keywords:
            if keyword in message_lower:
                conv_history['user_info']['industry'] = keyword
                break
        
        if intent in ['services', 'services_web', 'services_social', 'services_ai', 'services_seo']:
            # Registrar qué servicios se han discutido
            service_type = intent.replace('services_', '') if '_' in intent else 'general'
            if service_type not in conv_history['services_discussed']:
                conv_history['services_discussed'].append(service_type)
            
            # Si está explorando servicios, actualizar etapa
            if conv_history['stage'] == 'initial':
                conv_history['stage'] = 'exploring'
        
        elif intent in ['pricing', 'pricing_premium', 'pricing_pro', 'pricing_business']:
            # Registrar qué planes se han discutido
            plan_type = intent.replace('pricing_', '') if '_' in intent else 'general'
            if plan_type not in conv_history['plans_discussed']:
                conv_history['plans_discussed'].append(plan_type)
            
            # Si pregunta por precios, probablemente esté interesado
            if conv_history['stage'] in ['initial', 'exploring']:
                conv_history['stage'] = 'interested'
        
        elif intent == 'closing' or any(keyword in message_lower for keyword in ['contratar', 'comprar', 'adquirir', 'interesa', 'empezar']):
            # Si muestra clara intención de compra
            conv_history['stage'] = 'closing'
        
        # Registrar la pregunta para no repetir información
        if intent not in ['greeting', 'default']:
            if intent not in conv_history['questions_asked']:
                conv_history['questions_asked'].append(intent)
        
        # Obtener la respuesta apropiada basada en la intención y el contexto
        response = responses.get(intent, responses['default'])[0]
        
        # Analizar si el mensaje contiene preguntas específicas sobre planes o servicios
        message_lower = user_message.lower()
        
        # Personalizar saludo si tenemos información del usuario
        if intent == 'greeting' and conv_history['user_info']:
            if 'name' in conv_history['user_info']:
                greeting_template = random.choice(responses['greeting_personalized'])
                response = greeting_template.format(
                    name=conv_history['user_info']['name'],
                    industry=conv_history['user_info'].get('industry', 'negocio')
                )
        
        # Detección de preguntas específicas sobre servicios
        if intent == 'services':
            if any(keyword in message_lower for keyword in ['web', 'página', 'sitio', 'landing']):
                response = responses['services_web'][0]
                # Añadir información específica de la landing page si está disponible
                if landing_page_info['services']:
                    web_services = [s for s in landing_page_info['services'] if any(kw in s['title'].lower() for kw in ['web', 'landing', 'página', 'sitio'])]
                    if web_services:
                        response += f"\n\nEn nuestra web destacamos: {web_services[0]['title']} - {web_services[0]['description']}"
                        
                        # Personalizar según la industria del usuario si la conocemos
                        if 'industry' in conv_history['user_info']:
                            industry = conv_history['user_info']['industry']
                            response += f"\n\nPara negocios de {industry} como el tuyo, nuestras soluciones web están especialmente optimizadas para aumentar conversiones y mejorar la experiencia de usuario."
                            
            elif any(keyword in message_lower for keyword in ['redes', 'facebook', 'instagram', 'social']):
                response = responses['services_social'][0]
                # Añadir información específica de la landing page si está disponible
                if landing_page_info['services']:
                    social_services = [s for s in landing_page_info['services'] if any(kw in s['title'].lower() for kw in ['redes', 'social'])]
                    if social_services:
                        response += f"\n\nEn nuestra web destacamos: {social_services[0]['title']} - {social_services[0]['description']}"
                        
                        # Personalizar según la industria del usuario si la conocemos
                        if 'industry' in conv_history['user_info']:
                            industry = conv_history['user_info']['industry']
                            response += f"\n\nPara {industry}, las redes sociales más efectivas suelen ser {get_recommended_social_networks(industry)}. Podemos ayudarte a destacar en ellas."
                            
            elif any(keyword in message_lower for keyword in ['ia', 'ai', 'inteligencia', 'artificial']):
                response = responses['services_ai'][0]
                # Añadir información específica de la landing page si está disponible
                if landing_page_info['services']:
                    ai_services = [s for s in landing_page_info['services'] if any(kw in s['title'].lower() for kw in ['ia', 'ai', 'inteligencia'])]
                    if ai_services:
                        response += f"\n\nEn nuestra web destacamos: {ai_services[0]['title']} - {ai_services[0]['description']}"
                        
                        # Personalizar según la industria del usuario si la conocemos
                        if 'industry' in conv_history['user_info']:
                            industry = conv_history['user_info']['industry']
                            response += f"\n\nLa IA está revolucionando el sector de {industry}, permitiendo automatizar procesos y personalizar la experiencia del cliente."
                            
            elif any(keyword in message_lower for keyword in ['seo', 'posicionamiento', 'google', 'buscadores']):
                response = responses['services_seo'][0]
                # Añadir información específica de la landing page si está disponible
                if landing_page_info['services']:
                    seo_services = [s for s in landing_page_info['services'] if any(kw in s['title'].lower() for kw in ['seo', 'posicionamiento', 'análisis'])]
                    if seo_services:
                        response += f"\n\nEn nuestra web destacamos: {seo_services[0]['title']} - {seo_services[0]['description']}"
                        
                        # Personalizar según la industria del usuario si la conocemos
                        if 'industry' in conv_history['user_info']:
                            industry = conv_history['user_info']['industry']
                            response += f"\n\nPara negocios de {industry}, el SEO es crucial para captar clientes que ya están buscando tus servicios. Podemos ayudarte a destacar frente a tu competencia."
        
        # Detección de preguntas específicas sobre precios
        elif intent == 'pricing':
            if any(keyword in message_lower for keyword in ['premium', '299', 'básico']):
                response = responses['pricing_premium'][0]
                # Añadir información específica de la landing page si está disponible
                if landing_page_info['pricing']:
                    premium_plans = [p for p in landing_page_info['pricing'] if 'premium' in p['name'].lower()]
                    if premium_plans and premium_plans[0]['features']:
                        response += "\n\nAlgunas características destacadas:\n" + "\n".join(premium_plans[0]['features'][:3])
            elif any(keyword in message_lower for keyword in ['pro', '599', 'profesional']):
                response = responses['pricing_pro'][0]
                # Añadir información específica de la landing page si está disponible
                if landing_page_info['pricing']:
                    pro_plans = [p for p in landing_page_info['pricing'] if 'pro' in p['name'].lower()]
                    if pro_plans and pro_plans[0]['features']:
                        response += "\n\nAlgunas características destacadas:\n" + "\n".join(pro_plans[0]['features'][:3])
            elif any(keyword in message_lower for keyword in ['business', 'empresa', 'personalizado']):
                response = responses['pricing_business'][0]
                # Añadir información específica de la landing page si está disponible
                if landing_page_info['pricing']:
                    business_plans = [p for p in landing_page_info['pricing'] if 'business' in p['name'].lower()]
                    if business_plans and business_plans[0]['features']:
                        response += "\n\nAlgunas características destacadas:\n" + "\n".join(business_plans[0]['features'][:3])
        
        # Detección de preguntas sobre testimonios
        elif intent == 'testimonials':
            response = responses['testimonials'][0]
            # Añadir testimonios reales de la landing page si están disponibles
            if landing_page_info['testimonials'] and len(landing_page_info['testimonials']) > 0:
                # Si conocemos la industria del usuario, intentar mostrar un testimonio relevante
                if 'industry' in conv_history['user_info']:
                    industry = conv_history['user_info']['industry']
                    relevant_testimonials = [t for t in landing_page_info['testimonials'] 
                                           if industry.lower() in t['quote'].lower() or industry.lower() in t['author'].lower()]
                    
                    if relevant_testimonials:
                        random_testimonial = random.choice(relevant_testimonials)
                    else:
                        random_testimonial = random.choice(landing_page_info['testimonials'])
                else:
                    random_testimonial = random.choice(landing_page_info['testimonials'])
                    
                response += f"\n\nUn testimonio reciente:\n\"{random_testimonial['quote']}\" - {random_testimonial['author']}"
                
                # Si hay más de un testimonio, ofrecer ver más
                if len(landing_page_info['testimonials']) > 1:
                    response += "\n\n¿Te gustaría ver más testimonios de nuestros clientes?"
        
        # Detección de preguntas sobre beneficios
        elif intent == 'benefits':
            response = responses['benefits'][0]
            # Añadir beneficios reales de la landing page si están disponibles
            if landing_page_info['benefits'] and len(landing_page_info['benefits']) > 0:
                # Si conocemos la industria del usuario, priorizar beneficios relevantes
                if 'industry' in conv_history['user_info']:
                    industry = conv_history['user_info']['industry']
                    relevant_benefits = [b for b in landing_page_info['benefits'] 
                                       if industry.lower() in b['title'].lower() or industry.lower() in b['description'].lower()]
                    
                    if relevant_benefits:
                        selected_benefits = relevant_benefits[:2]  # Tomar hasta 2 beneficios relevantes
                        if len(selected_benefits) < 2 and len(landing_page_info['benefits']) > len(selected_benefits):
                            # Completar con otros beneficios si no hay suficientes relevantes
                            other_benefits = [b for b in landing_page_info['benefits'] if b not in relevant_benefits]
                            selected_benefits.extend(other_benefits[:2-len(selected_benefits)])
                    else:
                        selected_benefits = random.sample(landing_page_info['benefits'], min(2, len(landing_page_info['benefits'])))
                else:
                    selected_benefits = random.sample(landing_page_info['benefits'], min(2, len(landing_page_info['benefits'])))
                
                benefits_text = "\n\nAlgunos beneficios destacados:\n"
                for benefit in selected_benefits:
                    benefits_text += f"• {benefit['title']}: {benefit['description']}\n"
                response += benefits_text
                
                # Personalizar según la etapa de la conversación
                if conv_history['stage'] == 'interested' or conv_history['stage'] == 'closing':
                    response += "\n\nEstos beneficios se traducen en resultados concretos para tu negocio. ¿Te gustaría que programemos una consulta para analizar cómo podemos aplicarlos específicamente a tu caso?"
        
        # Responder a preguntas frecuentes si se detecta esa intención
        elif intent == 'faq':
            response = responses['faq'][0]
            
            # Buscar la pregunta más similar en el FAQ
            if landing_page_info['faq']:
                best_match = None
                highest_similarity = 0
                
                for faq_item in landing_page_info['faq']:
                    question_words = set(faq_item['question'].lower().split())
                    message_words = set(message_lower.split())
                    common_words = question_words.intersection(message_words)
                    similarity = len(common_words) / max(len(question_words), len(message_words))
                    
                    if similarity > highest_similarity:
                        highest_similarity = similarity
                        best_match = faq_item
                
                if best_match and highest_similarity > 0.3:  # Umbral de similitud
                    response = response.replace('[RESPUESTA_FAQ]', f"Pregunta: {best_match['question']}\n\nRespuesta: {best_match['answer']}")
                else:
                    response = "No tengo una respuesta exacta para esa pregunta. ¿Puedo ayudarte con información sobre nuestros servicios o precios?"
        
        # Detección de intención de cierre o compra
        elif intent == 'closing' or ('default' in intent and any(keyword in message_lower for keyword in ['contratar', 'comprar', 'adquirir', 'interesa', 'empezar'])):
            response = responses['closing'][0]
            
            # Personalizar según la información del usuario
            if 'name' in conv_history['user_info']:
                response = f"¡Excelente decisión, {conv_history['user_info']['name']}! " + response[response.find('¿'):]  # Reemplazar la primera frase
            
            # Personalizar según los servicios discutidos
            if conv_history['services_discussed']:
                services_text = ", ".join(conv_history['services_discussed'])
                response += f"\n\nBasado en tu interés en {services_text}, creo que podríamos ofrecerte una solución personalizada."
            
            # Personalizar según los planes discutidos
            if conv_history['plans_discussed']:
                plan = conv_history['plans_discussed'][-1]  # El último plan discutido
                if plan == 'premium':
                    discount = "10%"
                elif plan == 'pro':
                    discount = "15%"
                else:
                    discount = "especial"
                
                response += f"\n\n🔥 OFERTA ESPECIAL: Si contratas el plan {plan.capitalize()} hoy, recibirás un descuento del {discount} en tu primer mes y un análisis de competencia valorado en 150€ totalmente GRATIS."
        
        # Personalizar respuesta de contacto con información real de la landing page
        elif intent == 'contact':
            response = responses['contact'][0]
            
            # Añadir información de contacto real extraída de la landing page
            if landing_page_info['contact_info']:
                if 'email' in landing_page_info['contact_info']:
                    response = response.replace('solucionesworld2016@gmail.com', landing_page_info['contact_info']['email'])
                
                if 'social' in landing_page_info['contact_info']:
                    for social in landing_page_info['contact_info']['social']:
                        if social['type'] == 'WhatsApp' and 'https://wa.link/uxacg0' in response:
                            response = response.replace('https://wa.link/uxacg0', social['url'])
                        elif social['type'] == 'Telegram' and 'https://t.me/SPMarketing_KR' in response:
                            response = response.replace('https://t.me/SPMarketing_KR', social['url'])
        
        # Añadir un call-to-action al final de las respuestas para fomentar la conversión
        if intent not in ['greeting', 'contact', 'closing'] and not any(keyword in message_lower for keyword in ['gracias', 'adios', 'chao']):
            # Personalizar CTA según la etapa de la conversación
            if conv_history['stage'] == 'initial':
                cta_options = [
                    "\n\n¿Sobre qué servicio te gustaría conocer más detalles?",
                    "\n\n¿Hay algún aspecto específico del marketing digital que te interese?",
                    "\n\n¿Tienes alguna otra pregunta o te gustaría conocer más detalles sobre nuestros servicios?"
                ]
            elif conv_history['stage'] == 'exploring':
                cta_options = [
                    "\n\n¿Te gustaría conocer nuestros planes y precios para este servicio?",
                    "\n\n¿Quieres ver algunos ejemplos de resultados que hemos logrado con este servicio?",
                    "\n\n¿Hay algún otro servicio que te interese conocer?"
                ]
            elif conv_history['stage'] == 'interested':
                cta_options = [
                    "\n\n¿Te gustaría agendar una consulta gratuita para analizar tu caso específico?",
                    "\n\n¿Quieres que te contactemos para discutir cómo podemos ayudarte específicamente?",
                    "\n\n¿Tienes alguna duda sobre nuestros planes o servicios antes de tomar una decisión?"
                ]
            else:  # closing
                cta_options = [
                    "\n\n¿Prefieres que te contactemos por WhatsApp o por correo electrónico?",
                    "\n\n¿Cuál sería el mejor momento para agendar una llamada con uno de nuestros especialistas?",
                    "\n\n¿Hay algo más que necesites saber antes de comenzar?"
                ]
            
            # Personalizar según la información del usuario
            if 'name' in conv_history['user_info'] and random.random() > 0.5:  # 50% de probabilidad
                selected_cta = random.choice(cta_options)
                response += selected_cta.replace('?', f", {conv_history['user_info']['name']}?")
            else:
                response += random.choice(cta_options)
        
        # Registrar la conversación con la intención detectada
        log_conversation(conversation_id, user_message, response, intent)
        
        return jsonify({
            'response': response,
            'conversation_id': conversation_id,
            'intent': intent
        })
    
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}), 500

# Función para recomendar redes sociales según la industria
def get_recommended_social_networks(industry):
    industry = industry.lower()
    if industry in ['ecommerce', 'tienda']:
        return "Instagram, Facebook y Pinterest"
    elif industry in ['restaurante', 'hotel']:
        return "Instagram, Facebook y Google Business"
    elif industry in ['inmobiliaria']:
        return "Instagram, Facebook y LinkedIn"
    elif industry in ['educación', 'salud']:
        return "Facebook, LinkedIn y YouTube"
    elif industry in ['tecnología', 'consultoría']:
        return "LinkedIn, Twitter y Medium"
    else:
        return "Instagram, Facebook y LinkedIn"

# Función para obtener respuesta a una pregunta frecuente
def get_faq_response(message, faq_data):
    if not faq_data:
        return None
    
    message_words = set(message.lower().split())
    best_match = None
    highest_score = 0
    
    for faq in faq_data:
        question_words = set(faq['question'].lower().split())
        common_words = message_words.intersection(question_words)
        score = len(common_words) / len(question_words) if question_words else 0
        
        if score > highest_score and score > 0.3:  # Umbral mínimo de similitud
            highest_score = score
            best_match = faq
    
    return best_match['answer'] if best_match else None

# Función para reiniciar el análisis de la landing page (útil si se actualiza el contenido)
def refresh_landing_page_data():
    global landing_page_info
    landing_page_info = analyze_landing_page()
    return landing_page_info

# Endpoint para reiniciar el análisis de la landing page
@app.route('/refresh-landing-page', methods=['POST'])
def refresh_landing_page():
    try:
        new_data = refresh_landing_page_data()
        return jsonify({
            'status': 'success',
            'message': 'Datos de la landing page actualizados correctamente',
            'data_summary': {
                'services_count': len(new_data['services']),
                'benefits_count': len(new_data['benefits']),
                'testimonials_count': len(new_data['testimonials']),
                'pricing_count': len(new_data['pricing']),
                'faq_count': len(new_data['faq'])
            }
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'Error al actualizar datos: {str(e)}'
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
