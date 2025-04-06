// Configuración del ChatWidget
const TELEGRAM_TOKEN = '8114461498:AAGgUsgKDHn4kpbcQdtKl1E1OYqCYwkGgMk';
const WHATSAPP_LINK = 'https://wa.link/uxacg0';

class ChatWidget {
    constructor() {
        this.apiUrl = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;
        this.chatId = null;
        this.messagesContainer = null;
        this.input = null;
        this.sendButton = null;
        this.toggleButton = null;
        this.widget = null;
        this.isTyping = false;
        this.hasShownWelcome = false;
        this.init();
    }

    init() {
        this.createWidget();
        this.initializeEvents();
        
        // Mostrar popup pequeño después de 2 segundos
        setTimeout(() => {
            this.showPopup();
        }, 2000);
    }

    createWidget() {
        // Crear el popup
        const popup = document.createElement('div');
        popup.className = 'chat-popup';
        popup.style.display = 'none';
        popup.innerHTML = `
            <div class="chat-popup-content">
                👋 ¡Hola! ¿Necesitas ayuda?
            </div>
        `;
        
        // Crear el botón flotante
        const toggleButton = document.createElement('div');
        toggleButton.className = 'chat-widget-toggle';
        toggleButton.innerHTML = '<i class="fas fa-comments"></i>';
        
        // Contenedor para el popup y el botón
        const container = document.createElement('div');
        container.className = 'chat-widget-container';
        container.appendChild(popup);
        container.appendChild(toggleButton);
        document.body.appendChild(container);

        // Crear el widget
        const widget = document.createElement('div');
        widget.className = 'chat-widget';
        widget.innerHTML = `
            <div class="chat-widget-header">
                <div class="chat-widget-title">
                    <i class="fas fa-robot"></i>
                    <h3>Asistente SPMarketing</h3>
                </div>
                <button class="chat-widget-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="chat-widget-messages"></div>
            <div class="chat-widget-input">
                <input type="text" class="chat-input" placeholder="Escribe tu mensaje...">
                <button class="chat-send">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
        `;
        document.body.appendChild(widget);

        // Guardar referencias
        this.widget = widget;
        this.popup = popup;
        this.messagesContainer = widget.querySelector('.chat-widget-messages');
        this.input = widget.querySelector('.chat-input');
        this.sendButton = widget.querySelector('.chat-send');
        this.toggleButton = toggleButton;
    }

    initializeEvents() {
        // Toggle del widget
        this.toggleButton.addEventListener('click', () => {
            this.popup.style.display = 'none';
            this.toggleWidget();
            if (!this.hasShownWelcome) {
                this.showWelcomeMessage();
                this.hasShownWelcome = true;
            }
        });
        this.widget.querySelector('.chat-widget-close').addEventListener('click', () => this.toggleWidget());

        // Envío de mensajes
        this.sendButton.addEventListener('click', () => this.handleUserMessage());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleUserMessage();
            }
        });

        // Delegación de eventos para los botones de opciones
        this.messagesContainer.addEventListener('click', (e) => {
            const option = e.target.closest('.chat-option');
            if (option) {
                const action = option.getAttribute('data-action');
                const service = option.getAttribute('data-service');
                if (action) {
                    if (service) {
                        this[action](service);
                    } else {
                        this[action]();
                    }
                }
            } else if (e.target.closest('.bot-message')) {
                // Al hacer clic en cualquier mensaje del bot, redirigir al formulario
                document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
            }
        });

        // Hacer el widget globalmente accesible
        window.chatWidget = this;
    }

    handleUserMessage() {
        const message = this.input.value.trim();
        if (!message) return;

        // Limpiar input
        this.input.value = '';

        // Mostrar mensaje del usuario
        this.addMessage(message, 'user');

        // Procesar mensaje
        this.showTypingIndicator();
        setTimeout(() => {
            this.hideTypingIndicator();
            this.processUserMessage(message);
        }, 1000);
    }

    processUserMessage(message) {
        const lowerMessage = message.toLowerCase();
        
        this.showTypingIndicator();
        setTimeout(() => {
            this.hideTypingIndicator();
            if (lowerMessage.includes('servicio')) {
                this.showServices();
            } else if (lowerMessage.includes('beneficio')) {
                this.showBenefits();
            } else if (lowerMessage.includes('contacto') || lowerMessage.includes('whatsapp')) {
                this.showContactInfo();
            } else if (lowerMessage.includes('precio')) {
                this.showPricing();
            } else {
                this.addMessage('¿En qué puedo ayudarte? Selecciona una opción:', 'bot');
                this.showOptions();
            }
        }, 3000);
    }

    showWelcomeMessage() {
        const welcome = `
            ¡Hola! 👋 Soy tu asistente de SPMarketing.

            ¿En qué puedo ayudarte hoy?
        `;
        this.addMessage(welcome, 'bot');
        
        setTimeout(() => {
            this.showOptions();
        }, 3000);
    }

    showOptions() {
        const options = document.createElement('div');
        options.className = 'chat-options';
        options.innerHTML = `
            <div class="chat-option" data-action="showServices">🔍 Descubrir Servicios</div>
            <div class="chat-option" data-action="showBenefits">💎 Ver Beneficios</div>
            <div class="chat-option" data-action="showContactInfo">📱 Contactar Ahora</div>
        `;
        this.messagesContainer.appendChild(options);
        this.scrollToBottom();
    }

    showServices() {
        const servicesMessage = `
            🚀 Nuestros Servicios:

            Selecciona el servicio que te interese para más información:
        `;
        this.addMessage(servicesMessage, 'bot');
        
        setTimeout(() => {
            this.showServiceOptions();
        }, 3000);
    }

    showServiceOptions() {
        const options = document.createElement('div');
        options.className = 'chat-options';
        options.innerHTML = `
            <div class="chat-option" data-action="showServiceDetails" data-service="web">💻 Desarrollo Web</div>
            <div class="chat-option" data-action="showServiceDetails" data-service="landing">🎯 Landing Pages</div>
            <div class="chat-option" data-action="showServiceDetails" data-service="marketing">📱 Marketing Digital</div>
            <div class="chat-option" data-action="showServiceDetails" data-service="social">🌟 Redes Sociales</div>
        `;
        this.messagesContainer.appendChild(options);
        this.scrollToBottom();
    }

    showServiceDetails(service) {
        this.showTypingIndicator();
        setTimeout(() => {
            this.hideTypingIndicator();
            let details = '';
            switch (service) {
                case 'web':
                    details = `
                        💻 Desarrollo Web Profesional:

                        Incluye:
                        ✓ Diseño Responsive
                        ✓ SEO Optimizado
                        ✓ Alto Rendimiento
                        ✓ Soporte 24/7

                        💎 Agenda tu consulta gratuita y obtén el 80% del análisis y estrategia sin compromiso
                    `;
                    break;
                case 'landing':
                    details = `
                        🎯 Landing Pages:

                        Incluye:
                        ✓ Diseño Optimizado
                        ✓ A/B Testing
                        ✓ CTAs Optimizados
                        ✓ Análisis en tiempo real

                        💎 Agenda tu consulta gratuita y obtén el 80% del análisis y estrategia sin compromiso
                    `;
                    break;
                case 'marketing':
                    details = `
                        📱 Marketing Digital:

                        Incluye:
                        ✓ Estrategia Personalizada
                        ✓ Campañas Optimizadas
                        ✓ ROI Garantizado
                        ✓ Reportes Mensuales

                        💎 Agenda tu consulta gratuita y obtén el 80% del análisis y estrategia sin compromiso
                    `;
                    break;
                case 'social':
                    details = `
                        🌟 Redes Sociales:

                        Incluye:
                        ✓ Gestión de Contenido
                        ✓ Diseño Profesional
                        ✓ Campañas Ads
                        ✓ Análisis de Métricas

                        💎 Agenda tu consulta gratuita y obtén el 80% del análisis y estrategia sin compromiso
                    `;
                    break;
            }
            this.addMessage(details, 'bot');
            
            setTimeout(() => {
                this.addMessage('¿Te gustaría agendar tu consulta gratuita y obtener tu análisis personalizado?', 'bot');
                this.showContactOptions();
            }, 3000);
        }, 3000);
    }

    showBenefits() {
        const benefitsMessage = `
            💎 Beneficios Principales:

            ✓ ROI Garantizado (+150%)
            ✓ Tecnología IA Avanzada
            ✓ Atención 24/7
            ✓ +5 años de experiencia

            🎯 En tu primera consulta GRATUITA obtendrás:
            • 80% del análisis completo
            • Estrategia personalizada
            • Plan de acción detallado
            • Todo sin compromiso
        `;
        this.addMessage(benefitsMessage, 'bot');
        
        setTimeout(() => {
            const options = document.createElement('div');
            options.className = 'chat-options';
            options.innerHTML = `
                <div class="chat-option" data-action="handleBenefitAction" data-action="casos">📊 Casos de Éxito</div>
                <div class="chat-option" data-action="handleBenefitAction" data-action="consulta">💡 Consulta Gratuita</div>
            `;
            this.messagesContainer.appendChild(options);
            this.scrollToBottom();
        }, 3000);
    }

    showContactInfo() {
        const contactMessage = `
            📱 ¿Cómo prefieres contactarnos?

            Elige una opción:
        `;
        this.addMessage(contactMessage, 'bot');
        setTimeout(() => {
            this.showContactOptions();
        }, 3000);
    }

    showContactOptions() {
        const options = document.createElement('div');
        options.className = 'chat-options';
        options.innerHTML = `
            <div class="chat-option" data-action="handleContact" data-service="whatsapp">📱 WhatsApp</div>
            <div class="chat-option" data-action="handleContact" data-service="form">📝 Formulario</div>
        `;
        this.messagesContainer.appendChild(options);
        this.scrollToBottom();
    }

    handleContact(type) {
        this.showTypingIndicator();
        setTimeout(() => {
            this.hideTypingIndicator();
            let message = '';
            switch (type) {
                case 'whatsapp':
                    message = '¡Te redirijo a WhatsApp para atenderte inmediatamente! 📱';
                    this.addMessage(message, 'bot');
                    setTimeout(() => {
                        window.open(WHATSAPP_LINK, '_blank');
                    }, 1000);
                    break;
                case 'form':
                    message = 'Te llevaré al formulario de contacto 📝';
                    this.addMessage(message, 'bot');
                    setTimeout(() => {
                        document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
                    }, 1000);
                    break;
            }
        }, 3000);
    }

    handleBenefitAction(action) {
        this.showTypingIndicator();
        setTimeout(() => {
            this.hideTypingIndicator();
            let message = '';
            switch (action) {
                case 'casos':
                    message = `
                        📊 Resultados Reales:

                        🏆 E-commerce
                        • +200% en ventas
                        • ROI positivo mes 1

                        🏆 Servicios
                        • +150% tráfico orgánico
                        • +80% conversiones

                        💎 Agenda tu consulta gratuita y obtén el 80% del análisis y estrategia sin compromiso
                    `;
                    break;
                case 'consulta':
                    message = `
                        💡 Consulta Gratuita:

                        Te entregamos el 80% del trabajo:
                        ✓ Análisis completo de tu negocio
                        ✓ Estrategia personalizada
                        ✓ Plan de acción detallado
                        ✓ Sin ningún compromiso

                        ¡Nadie más te ofrece tanto valor sin compromiso!
                    `;
                    break;
            }
            this.addMessage(message, 'bot');
            setTimeout(() => {
                this.showContactOptions();
            }, 3000);
        }, 3000);
    }

    showPricing(service = null) {
        let message = '';
        if (service) {
            message = `
                💰 Planes para ${this.getServiceName(service)}:

                🔥 Plan Básico
                • Características esenciales
                • Soporte básico
                • Desde $XXX/mes

                ⭐ Plan Premium
                • Todas las características
                • Soporte prioritario
                • Desde $XXX/mes

                🌟 Plan Enterprise
                • Solución personalizada
                • Soporte 24/7
                • Precio a medida

                ¿Te gustaría solicitar una propuesta personalizada?
            `;
        } else {
            message = `
                💎 Consulta Inicial GRATUITA:

                ✓ Análisis de mercado
                ✓ Propuesta personalizada
                ✓ Sin compromiso
                ✓ Sin permanencia

                ¿Te gustaría agendar tu consulta gratuita?
            `;
        }
        this.addMessage(message, 'bot');
        this.showContactOptions();
    }

    getServiceName(service) {
        const services = {
            'web': 'Desarrollo Web',
            'landing': 'Landing Pages',
            'marketing': 'Marketing Digital',
            'social': 'Gestión de Redes Sociales'
        };
        return services[service] || 'nuestros servicios';
    }

    toggleWidget() {
        this.widget.classList.toggle('active');
        if (this.widget.classList.contains('active')) {
            this.input.focus();
        }
    }

    showPopup() {
        this.popup.style.display = 'block';
        // Ocultar popup al hacer clic en cualquier parte
        document.addEventListener('click', () => {
            this.popup.style.display = 'none';
        }, { once: true });
    }

    addMessage(text, type) {
        if (this.isTyping) {
            this.hideTypingIndicator();
        }
        const message = document.createElement('div');
        message.className = `chat-message ${type}-message`;
        message.innerHTML = text.trim().replace(/\n/g, '<br>');
        
        // Agregar cursor pointer y título solo a mensajes del bot
        if (type === 'bot') {
            message.style.cursor = 'pointer';
            message.title = 'Haz clic para ir al formulario de contacto';
        }
        
        this.messagesContainer.appendChild(message);
        this.scrollToBottom();
    }

    showTypingIndicator() {
        if (!this.isTyping) {
            this.isTyping = true;
            const typing = document.createElement('div');
            typing.className = 'chat-message bot-message typing';
            typing.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
            this.messagesContainer.appendChild(typing);
            this.scrollToBottom();
        }
    }

    hideTypingIndicator() {
        const typing = this.messagesContainer.querySelector('.typing');
        if (typing) {
            typing.remove();
        }
        this.isTyping = false;
    }

    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
}

// Inicializar el widget cuando el documento esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.chatWidget = new ChatWidget();
}); 