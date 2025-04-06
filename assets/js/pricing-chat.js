// Configuración del ChatWidget para Precios
const TELEGRAM_TOKEN = '8114461498:AAGgUsgKDHn4kpbcQdtKl1E1OYqCYwkGgMk';
const WHATSAPP_LINK = 'https://wa.link/uxacg0';

class PricingChatWidget extends ChatWidget {
    constructor() {
        super();
    }

    showWelcomeMessage() {
        const welcome = `
            ¡Hola! 👋 Bienvenido a la sección de precios.

            ¿Te gustaría conocer nuestros planes personalizados?
        `;
        this.addMessage(welcome, 'bot');
        
        setTimeout(() => {
            this.showPricingOptions();
        }, 3000);
    }

    showPricingOptions() {
        const options = document.createElement('div');
        options.className = 'chat-options';
        options.innerHTML = `
            <div class="chat-option" data-action="showPricingDetails" data-service="web">💻 Desarrollo Web</div>
            <div class="chat-option" data-action="showPricingDetails" data-service="landing">🎯 Landing Pages</div>
            <div class="chat-option" data-action="showPricingDetails" data-service="marketing">📱 Marketing Digital</div>
            <div class="chat-option" data-action="showPricingDetails" data-service="social">🌟 Redes Sociales</div>
        `;
        this.messagesContainer.appendChild(options);
        this.scrollToBottom();
    }

    showPricingDetails(service) {
        this.showTypingIndicator();
        setTimeout(() => {
            this.hideTypingIndicator();
            let details = '';
            switch (service) {
                case 'web':
                    details = `
                        💻 Planes de Desarrollo Web:

                        🔥 Plan Básico
                        • Diseño Responsive
                        • SEO Básico
                        • Hosting 1 año
                        • Desde $XXX/mes

                        ⭐ Plan Premium
                        • Todo lo básico +
                        • SEO Avanzado
                        • Mantenimiento
                        • Desde $XXX/mes

                        🌟 Plan Enterprise
                        • Solución a medida
                        • Soporte 24/7
                        • Precio personalizado
                    `;
                    break;
                case 'landing':
                    details = `
                        🎯 Planes Landing Pages:

                        🔥 Plan Básico
                        • Diseño Optimizado
                        • A/B Testing
                        • Desde $XXX/mes

                        ⭐ Plan Premium
                        • Todo lo básico +
                        • Análisis Avanzado
                        • Desde $XXX/mes

                        🌟 Plan Enterprise
                        • Múltiples Landing
                        • Optimización continua
                        • Precio personalizado
                    `;
                    break;
                case 'marketing':
                    details = `
                        📱 Planes Marketing Digital:

                        🔥 Plan Básico
                        • Estrategia Base
                        • ROI Garantizado
                        • Desde $XXX/mes

                        ⭐ Plan Premium
                        • Todo lo básico +
                        • Campañas Avanzadas
                        • Desde $XXX/mes

                        🌟 Plan Enterprise
                        • Estrategia Completa
                        • Resultados Premium
                        • Precio personalizado
                    `;
                    break;
                case 'social':
                    details = `
                        🌟 Planes Redes Sociales:

                        🔥 Plan Básico
                        • Gestión 2 redes
                        • Posts semanales
                        • Desde $XXX/mes

                        ⭐ Plan Premium
                        • Todo lo básico +
                        • Campañas Ads
                        • Desde $XXX/mes

                        🌟 Plan Enterprise
                        • Gestión Completa
                        • Estrategia Premium
                        • Precio personalizado
                    `;
                    break;
            }
            this.addMessage(details, 'bot');
            
            setTimeout(() => {
                this.addMessage('¿Te gustaría solicitar una propuesta personalizada?', 'bot');
                this.showContactOptions();
            }, 3000);
        }, 3000);
    }

    processUserMessage(message) {
        const lowerMessage = message.toLowerCase();
        
        this.showTypingIndicator();
        setTimeout(() => {
            this.hideTypingIndicator();
            if (lowerMessage.includes('precio') || lowerMessage.includes('plan')) {
                this.showPricingOptions();
            } else if (lowerMessage.includes('contacto') || lowerMessage.includes('whatsapp')) {
                this.showContactInfo();
            } else {
                this.addMessage('¿Sobre qué servicio te gustaría conocer los precios?', 'bot');
                this.showPricingOptions();
            }
        }, 3000);
    }
}

// Inicializar el widget cuando el documento esté listo
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('precios')) {
        window.chatWidget = new PricingChatWidget();
    }
}); 