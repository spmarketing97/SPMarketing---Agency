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
                            elif 'twitter' in link['href']:
                                social_type = 'Twitter'
                            elif 'instagram' in link['href']:
                                social_type = 'Instagram'
                            elif 'linkedin' in link['href']:
                                social_type = 'LinkedIn'
                            elif 'whatsapp' in link['href']:
                                social_type = 'WhatsApp'
                            elif 'telegram' in link['href']:
                                social_type = 'Telegram'
                            
                            landing_page_data['contact_info']['social'].append({
                                'type': social_type,
                                'url': link['href']
                            })
                
                # Extraer información de la empresa
                about_section = soup.find('section', {'id': re.compile(r'sobre-nosotros|about')}) or soup.find('section', {'class': re.compile(r'about|sobre')})
                if about_section:
                    about_text = about_section.find('p')
                    if about_text:
                        landing_page_data['company_info']['description'] = about_text.text.strip()
        
        # Analizar precios.html si existe
        if os.path.exists(pricing_path):
            with open(pricing_path, 'r', encoding='utf-8') as file:
                content = file.read()
                soup = BeautifulSoup(content, 'html.parser')
                
                # Extraer planes de precios
                pricing_cards = soup.find_all('div', {'class': re.compile(r'pricing-card|price-card|card')})
                for card in pricing_cards:
                    plan_name = card.find('h3')
                    price_element = card.find('span', {'class': re.compile(r'price-value')})
                    features_list = card.find('ul')
                    
                    if plan_name and price_element:
                        price_text = price_element.text.strip()
                        # Extraer solo los números del precio
                        price_value = re.search(r'\d+', price_text)
                        price = int(price_value.group()) if price_value else 0
                        
                        plan = {
                            'name': plan_name.text.strip(),
                            'price': price,
                            'price_text': price_text,
                            'features': []
                        }
                        
                        if features_list:
                            features = features_list.find_all('li')
                            for feature in features:
                                feature_text = feature.text.strip()
                                # Determinar si la característica está incluida o no
                                is_included = True
                                if feature.find('i', {'class': re.compile(r'fa-times')}):
                                    is_included = False
                                
                                plan['features'].append({
                                    'text': feature_text,
                                    'included': is_included
                                })
                        
                        landing_page_data['pricing'].append(plan)
                
                # Extraer FAQ si existe
                faq_section = soup.find('section', {'class': re.compile(r'faq')})
                if faq_section:
                    faq_items = faq_section.find_all('div', {'class': re.compile(r'faq-item')})
                    for item in faq_items:
                        question = item.find('div', {'class': re.compile(r'faq-question')}) or item.find('h3')
                        answer = item.find('div', {'class': re.compile(r'faq-answer')}) or item.find('p')
                        
                        if question and answer:
                            landing_page_data['faq'].append({
                                'question': question.text.strip(),
                                'answer': answer.text.strip()
                            })
    
    except Exception as e:
        print(f"Error al analizar la landing page: {e}")
    
    return landing_page_data

# Configurar CORS para permitir solicitudes desde cualquier origen
CORS(app, resources={r"/*": {"origins": "*"}})

# Directorio para almacenar logs de conversaciones
LOG_DIR = os.path.join(os.path.dirname(__file__), 'chat_logs')
os.makedirs(LOG_DIR, exist_ok=True)

# Cargar datos de la landing page
landing_page_data = analyze_landing_page()

# Respuestas predefinidas para preguntas comunes
common_responses = {
    'saludo': [
        "¡Hola! Soy el asistente virtual de SPMarketing. ¿En qué puedo ayudarte hoy?",
        "¡Bienvenido/a a SPMarketing! Estoy aquí para responder tus preguntas. ¿Cómo puedo ayudarte?",
        "Hola, gracias por contactar con SPMarketing. ¿Qué información necesitas?"
    ],
    'despedida': [
        "¡Gracias por contactar con SPMarketing! Si tienes más preguntas, no dudes en escribirnos. ¡Que tengas un excelente día!",
        "Ha sido un placer ayudarte. Si necesitas algo más, estaré aquí. ¡Hasta pronto!",
        "Gracias por tu interés en SPMarketing. Estamos a tu disposición para cualquier consulta adicional. ¡Hasta luego!"
    ],
    'agradecimiento': [
        "¡De nada! Estoy aquí para ayudarte con cualquier duda sobre nuestros servicios de marketing digital.",
        "Es un placer poder ayudarte. Si tienes más preguntas, no dudes en consultarme.",
        "No hay de qué. En SPMarketing nos encanta poder resolver tus dudas."
    ],
    'contacto': [
        "Puedes contactarnos a través de nuestro formulario en la web, por email a solucionesworld2016@gmail.com o por WhatsApp en https://wa.link/uxacg0",
        "Estaremos encantados de atenderte personalmente. Puedes escribirnos a solucionesworld2016@gmail.com o contactarnos por WhatsApp: https://wa.link/uxacg0",
        "Para una atención más personalizada, contáctanos por email (solucionesworld2016@gmail.com) o WhatsApp (https://wa.link/uxacg0). También puedes usar el formulario de contacto en nuestra web."
    ],
    'consulta': [
        "Ofrecemos una consulta inicial gratuita donde analizamos tu situación actual y te proponemos estrategias personalizadas. Puedes agendarla desde nuestra web en la sección de contacto.",
        "¡Buenas noticias! Tu primera consulta es totalmente gratuita. En ella, analizaremos tu negocio y te daremos recomendaciones específicas. Puedes agendarla ahora mismo.",
        "Nuestra consulta inicial no tiene costo. En ella evaluamos tu presencia digital actual y te ofrecemos un plan estratégico personalizado. ¿Te gustaría agendar una?"
    ],
    'precios': [
        "Tenemos diferentes planes adaptados a tus necesidades. Nuestro Plan Premium cuesta 299€/mes e incluye desarrollo web, gestión de redes sociales y estrategias personalizadas. El Plan Pro, a 599€/mes, añade optimización SEO profesional y más funcionalidades. ¿Te gustaría conocer más detalles?",
        "Ofrecemos dos planes principales: Premium (299€/mes) y Pro (599€/mes). Ambos incluyen desarrollo web y gestión de redes sociales, pero el Pro añade SEO profesional y más publicaciones semanales. También ofrecemos una consulta inicial gratuita.",
        "Nuestros precios son muy competitivos: 299€/mes para el Plan Premium y 599€/mes para el Plan Pro. Ambos sin permanencia y con soporte continuo. ¿Sobre cuál te gustaría más información?"
    ],
    'servicios': [
        "En SPMarketing ofrecemos desarrollo web, gestión de redes sociales, optimización SEO, marketing con IA, análisis de competencia y estrategias personalizadas. ¿Hay algún servicio específico que te interese?",
        "Nuestros servicios incluyen creación de landing pages y sitios web, gestión de contenido en redes sociales, SEO, estrategias de marketing digital potenciadas con IA y análisis detallados de tu mercado. ¿Qué necesita tu negocio?",
        "Somos especialistas en desarrollo web, marketing digital, gestión de redes sociales, SEO y estrategias personalizadas con IA. También ofrecemos análisis de competencia y reportes detallados. ¿En qué podemos ayudarte?"
    ],
    'beneficios': [
        "Al trabajar con nosotros obtendrás mayor visibilidad online, aumento de tráfico web, mejor posicionamiento en buscadores, más conversiones y una estrategia personalizada para tu negocio. Todo esto con el poder de la IA para optimizar resultados.",
        "Los beneficios de nuestros servicios incluyen: aumento de visibilidad online, mayor engagement en redes sociales, mejora en el posicionamiento SEO, estrategias optimizadas con IA y un incremento en tus conversiones y ventas.",
        "Trabajar con SPMarketing te dará: presencia digital profesional, estrategias personalizadas, contenido optimizado con IA, mejor posicionamiento en buscadores y un aumento significativo en tus conversiones. Todo sin permanencia y con soporte continuo."
    ],
    'default': [
        "Gracias por tu pregunta. Para darte la mejor respuesta, ¿podrías proporcionar más detalles sobre lo que necesitas?",
        "Entiendo tu consulta. Para ayudarte mejor, ¿podrías ser un poco más específico/a?",
        "Estoy aquí para ayudarte. Para ofrecerte la información más relevante, ¿podrías aclarar un poco más tu pregunta?"
    ]
}

# Función para registrar conversaciones
def log_conversation(conversation_id, user_message, bot_response):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    log_file = os.path.join(LOG_DIR, f"{conversation_id}.txt")
    
    with open(log_file, 'a', encoding='utf-8') as f:
        f.write(f"[{timestamp}] Usuario: {user_message}\n")
        f.write(f"[{timestamp}] Bot: {bot_response}\n\n")

# Función para detectar la intención del usuario
def detect_intent(message):
    message = message.lower()
    
    # Patrones para cada intención
    patterns = {
        'saludo': r'\b(hola|buenos días|buenas tardes|buenas noches|saludos|hey|hi|hello)\b',
        'despedida': r'\b(adiós|chao|hasta luego|hasta pronto|bye|nos vemos)\b',
        'agradecimiento': r'\b(gracias|te lo agradezco|muchas gracias|thank you)\b',
        'contacto': r'\b(contacto|contactar|email|correo|teléfono|llamar|whatsapp)\b',
        'consulta': r'\b(consulta|asesoría|cita|reunión|agendar|gratis|gratuita)\b',
        'precios': r'\b(precio|precios|costo|costos|tarifa|tarifas|plan|planes|cuánto cuesta|cuanto vale)\b',
        'servicios': r'\b(servicio|servicios|qué ofrecen|que hacen|marketing|web|redes|social)\b',
        'beneficios': r'\b(beneficio|beneficios|ventaja|ventajas|por qué|resultados|qué gano)\b'
    }
    
    # Verificar cada patrón
    for intent, pattern in patterns.items():
        if re.search(pattern, message):
            return intent
    
    # Buscar coincidencias con servicios específicos
    services_keywords = {
        'servicios': ['web', 'página', 'sitio', 'landing', 'redes', 'social', 'facebook', 'instagram', 'seo', 'posicionamiento', 'marketing', 'digital', 'contenido', 'estrategia']
    }
    
    for intent, keywords in services_keywords.items():
        for keyword in keywords:
            if keyword in message:
                return intent
    
    # Si no se detecta ninguna intención específica
    return 'default'

# Función para generar respuesta basada en la intención
def generate_response(message, conversation_id):
    intent = detect_intent(message.lower())
    
    # Seleccionar una respuesta aleatoria para la intención detectada
    responses = common_responses.get(intent, common_responses['default'])
    response = random.choice(responses)
    
    # Personalizar respuesta con datos de la landing page si es relevante
    if intent == 'servicios' and landing_page_data['services']:
        services_info = "Nuestros servicios principales incluyen: "
        for service in landing_page_data['services'][:3]:  # Limitar a 3 servicios para no hacer la respuesta muy larga
            services_info += f"\n- {service['title']}: {service['description'][:100]}..."
        
        response += "\n\n" + services_info
    
    elif intent == 'precios' and landing_page_data['pricing']:
        pricing_info = "Estos son nuestros planes: "
        for plan in landing_page_data['pricing']:
            if plan['name'] != "Consulta Inicial":  # Excluir la consulta gratuita que ya se menciona
                pricing_info += f"\n- {plan['name']}: {plan['price_text']} - "
                # Añadir algunas características destacadas
                features = [f['text'] for f in plan['features'][:3] if f['included']]
                pricing_info += ", ".join(features)
        
        response += "\n\n" + pricing_info
    
    return response

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        user_message = data.get('message', '')
        conversation_id = data.get('conversation_id', f'conv_{int(time.time())}')
        
        if not user_message:
            return jsonify({'error': 'No message provided'}), 400
        
        # Generar respuesta
        bot_response = generate_response(user_message, conversation_id)
        
        # Registrar la conversación
        log_conversation(conversation_id, user_message, bot_response)
        
        return jsonify({
            'response': bot_response,
            'conversation_id': conversation_id
        })
    
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Crear directorio para logs si no existe
    os.makedirs(LOG_DIR, exist_ok=True)
    
    # Iniciar el servidor Flask
    app.run(host='0.0.0.0', port=5000, debug=False)