/**
 * SPMarketing Agency - Chatbot Script
 * Script para la funcionalidad del chatbot en todas las páginas
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Chatbot script loaded');
    
    // Elementos del chatbot
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotContainer = document.getElementById('chatbot-container');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');
    const chatbotMessages = document.getElementById('chatbot-messages');
    
    // Respuestas predefinidas
    const responses = {
        greeting: [
            "👋 ¡Hola! Soy el asistente virtual de SPMarketing. ¿En qué puedo ayudarte hoy?",
            "¡Bienvenido/a a SPMarketing! Estoy aquí para resolver tus dudas. ¿En qué te puedo ayudar?"
        ],
        services: "Ofrecemos servicios de marketing digital que incluyen: desarrollo web, gestión de redes sociales, SEO/SEM, campañas publicitarias, y estrategias personalizadas con IA. ¿Sobre cuál servicio te gustaría más información?",
        prices: "Tenemos diferentes planes adaptados a tus necesidades:\n• Consulta Inicial: GRATIS\n• Plan Pro: 149€/mes\n• Plan Premium: 299€/mes\n• Plan Business: Personalizado\n¿Te gustaría recibir más detalles sobre algún plan específico?",
        contact: "Puedes contactarnos a través de WhatsApp (https://wa.link/uxacg0), por email (hristiankrasimirov7@gmail.com) o agendar una consulta gratuita en nuestra web. ¿Qué método prefieres?",
        results: "Nuestros clientes han experimentado un promedio de 150% de ROI. Algunos casos destacados incluyen aumento del 185% en conversiones, triplicación de ventas en e-commerce, y duplicación de clientes potenciales en solo 2-3 meses.",
        thanks: "¡Ha sido un placer ayudarte! Si tienes más preguntas, no dudes en contactarnos. ¡Que tengas un excelente día! 😊",
        unknown: "Lo siento, no he entendido completamente tu consulta. ¿Podrías reformularla o elegir entre nuestros temas principales: servicios, precios o contacto?"
    };
    
    // Funciones del chatbot
    function toggleChatbot() {
        if (chatbotContainer.style.display === 'none' || chatbotContainer.style.display === '') {
            openChat();
        } else {
            closeChat();
        }
    }
    
    function openChat() {
        chatbotContainer.style.display = 'flex';
        chatbotContainer.style.opacity = '0';
        chatbotContainer.style.transform = 'translateY(20px)';
        
        // Trigger reflow para que la animación funcione
        chatbotContainer.offsetHeight;
        
        chatbotContainer.style.opacity = '1';
        chatbotContainer.style.transform = 'translateY(0)';
        
        if (chatbotMessages.childElementCount === 0) {
            // Primer mensaje del bot al abrir el chat
            setTimeout(() => {
                addBotMessage(responses.greeting[Math.floor(Math.random() * responses.greeting.length)]);
            }, 500);
        }
    }
    
    function closeChat() {
        chatbotContainer.style.opacity = '0';
        chatbotContainer.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            chatbotContainer.style.display = 'none';
        }, 300);
    }
    
    function addBotMessage(text) {
        const messageContainer = document.createElement('div');
        messageContainer.className = 'bot-message';
        messageContainer.style.cssText = 'background-color: #f5f7fb; border-radius: 15px 15px 15px 0; padding: 10px 15px; margin-bottom: 10px; max-width: 80%; align-self: flex-start; animation: fadeIn 0.3s; box-shadow: 0 1px 2px rgba(0,0,0,0.1);';
        
        messageContainer.innerHTML = text;
        chatbotMessages.appendChild(messageContainer);
        
        // Scroll al último mensaje
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
    
    function addUserMessage(text) {
        const messageContainer = document.createElement('div');
        messageContainer.className = 'user-message';
        messageContainer.style.cssText = 'background-color: #007bff; color: white; border-radius: 15px 15px 0 15px; padding: 10px 15px; margin-bottom: 10px; max-width: 80%; align-self: flex-end; animation: fadeIn 0.3s; box-shadow: 0 1px 2px rgba(0,0,0,0.1);';
        
        messageContainer.textContent = text;
        chatbotMessages.appendChild(messageContainer);
        
        // Scroll al último mensaje
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
    
    function sendMessage() {
        const message = chatbotInput.value.trim();
        
        if (message !== '') {
            // Añadir mensaje del usuario
            addUserMessage(message);
            
            // Limpiar input
            chatbotInput.value = '';
            
            // Procesar mensaje y responder (con pequeño retraso para simular procesamiento)
            setTimeout(() => {
                const response = getResponse(message);
                addBotMessage(response);
            }, 800);
        }
    }
    
    function getResponse(message) {
        message = message.toLowerCase();
        
        // Lógica simple de respuestas basada en palabras clave
        if (message.includes('hola') || message.includes('buenas') || message.includes('saludos')) {
            return responses.greeting[Math.floor(Math.random() * responses.greeting.length)];
        } else if (message.includes('servicio') || message.includes('ofrece') || message.includes('hace')) {
            return responses.services;
        } else if (message.includes('precio') || message.includes('costo') || message.includes('tarifa') || message.includes('plan')) {
            return responses.prices;
        } else if (message.includes('contacto') || message.includes('comunicar') || message.includes('hablar') || message.includes('email') || message.includes('telefono') || message.includes('whatsapp')) {
            return responses.contact;
        } else if (message.includes('resultado') || message.includes('caso') || message.includes('experiencia') || message.includes('exito') || message.includes('cliente')) {
            return responses.results;
        } else if (message.includes('gracias') || message.includes('adios') || message.includes('bye')) {
            return responses.thanks;
        } else {
            return responses.unknown;
        }
    }
    
    // Event listeners
    if (chatbotToggle) {
        chatbotToggle.addEventListener('click', toggleChatbot);
    }
    
    if (chatbotClose) {
        chatbotClose.addEventListener('click', closeChat);
    }
    
    if (chatbotSend) {
        chatbotSend.addEventListener('click', sendMessage);
    }
    
    if (chatbotInput) {
        chatbotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    // Mensaje de depuración
    console.log('Chatbot initialization complete');
});
