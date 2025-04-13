/**
 * SPMarketing Agency - Chatbot Fix Script
 * Este script arregla y mejora la funcionalidad del chatbot
 */

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    console.log('Chatbot fix script loaded');
    
    // Variables globales
    let chatbotContainer = null;
    let chatbotMessages = null;
    let chatbotToggle = null;
    let typingIndicator = null;
    let userMessage = '';
    
    // Información del sitio para que el chatbot pueda responder con datos reales
    const siteInfo = {
        services: [
            { name: "Desarrollo Web", description: "Sitios web profesionales y optimizados para convertir visitantes en clientes" },
            { name: "Landing Pages", description: "Páginas de aterrizaje con alto ratio de conversión para campañas específicas" },
            { name: "Marketing Digital", description: "Estrategias personalizadas para potenciar tu presencia online" },
            { name: "Gestión de Redes Sociales", description: "Creamos y gestionamos contenido atractivo optimizado con IA" },
            { name: "SEO", description: "Mejoramos tu posicionamiento en buscadores para aumentar el tráfico cualificado" }
        ],
        benefits: [
            { name: "Experiencia", description: "Más de 5 años en el sector del marketing digital" },
            { name: "Resultados", description: "Estrategias orientadas a ROI medible y crecimiento real" },
            { name: "Personalización", description: "Soluciones a medida según tus objetivos específicos" },
            { name: "Tecnología IA", description: "Optimización avanzada con inteligencia artificial 24/7" },
            { name: "Sin Permanencia", description: "Trabajamos sin contratos de larga duración" }
        ],
        plans: [
            { name: "Consulta Inicial", price: "GRATIS", features: ["Análisis de mercado y competencia", "Propuesta de estrategia", "Diseño e Identificación de Mejoras", "Sin permanencia", "Sin compromiso"] },
            { name: "Plan Pro", price: "149€/mes", features: ["Gestión de 1 red social", "3 publicaciones semanales", "Estrategia básica", "Atención personalizada", "Sin permanencia"] },
            { name: "Plan Premium", price: "299€/mes", features: ["Desarrollo de Landing Page", "Gestión de 3 redes sociales", "Campaña publicitaria", "Estrategia avanzada", "Soporte prioritario"] },
            { name: "Plan Business", price: "A convenir", features: ["Solución completa personalizada", "Estrategia avanzada con IA", "Presencia digital completa", "Soporte prioritario 24/7"] }
        ],
        contact: {
            email: "hristiankrasimirov7@gmail.com",
            whatsapp: "https://wa.link/uxacg0",
            phone: "+34 624 27 32 32"
        }
    };
    
    // Inicializar chatbot una vez que la página esté completamente cargada
    setTimeout(initializeChatbot, 1000);
    
    function initializeChatbot() {
        console.log('Initializing chatbot...');
        
        // Verificar si el chatbot ya existe
        chatbotContainer = document.querySelector('.chatbot-container');
        
        if (!chatbotContainer) {
            console.log('Creating chatbot UI...');
            createChatbotUI();
        } else {
            console.log('Chatbot UI already exists, enhancing functionality...');
            enhanceChatbotFunctionality();
        }
        
        // Añadir el evento al botón de toggle si existe
        chatbotToggle = document.querySelector('.chatbot-toggle');
        if (chatbotToggle) {
            chatbotToggle.addEventListener('click', toggleChatbot);
        }
    }
    
    function createChatbotUI() {
        // Crear el contenedor principal del chatbot
        chatbotContainer = document.createElement('div');
        chatbotContainer.className = 'chatbot-container';
        chatbotContainer.style.display = 'none'; // Asegurar que el chatbot inicie cerrado
        
        // Estructura HTML del chatbot
        chatbotContainer.innerHTML = `
            <div class="chatbot-header">
                <div class="header-left">
                    <img src="assets/img/LOGO PRINCIPAL.jpg" alt="SPMarketing Logo" class="chat-logo">
                    <span>Agente SPMarketing</span>
                </div>
                <button class="close-button">×</button>
            </div>
            <div id="chatbot-messages" class="chatbot-messages"></div>
            <div class="chatbot-input-container">
                <input type="text" id="chatbot-input" placeholder="Escribe tu consulta aquí...">
                <button id="chatbot-send">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 2L11 13" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>
        `;
        
        // Añadir estilos adicionales
        const chatbotStyle = document.createElement('style');
        chatbotStyle.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes pulseEffect {
                0% { transform: scale(1); box-shadow: 0 4px 10px rgba(0,0,0,0.2); }
                50% { transform: scale(1.1); box-shadow: 0 4px 15px rgba(0,0,0,0.3); }
                100% { transform: scale(1); box-shadow: 0 4px 10px rgba(0,0,0,0.2); }
            }
            
            .chat-open {
                animation: fadeIn 0.3s ease forwards;
            }
            
            .chat-close {
                animation: fadeIn 0.3s ease backwards reverse;
            }
            
            .chatbot-container {
                position: fixed;
                bottom: 90px;
                right: 20px;
                width: 300px; /* Tamaño reducido general */
                height: 400px; /* Altura reducida general */
                background: #FFFFFF;
                border-radius: 16px;
                box-shadow: 0 5px 25px rgba(0,0,0,0.15);
                display: none;
                flex-direction: column;
                z-index: 1000;
                overflow: hidden;
                font-family: 'Inter', 'Roboto', sans-serif;
                border: 1px solid rgba(0,0,0,0.1);
                transform-origin: bottom right;
            }
            
            /* Ajustes específicos para dispositivos móviles */
            @media (max-width: 576px) {
                .chatbot-container {
                    width: 260px;
                    height: 380px;
                    bottom: 80px;
                    right: 15px;
                }
            }
            
            .chatbot-header {
                background: linear-gradient(45deg, #003366, #005999);
                color: white;
                padding: 15px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            }
            
            .header-left {
                display: flex;
                align-items: center;
            }
            
            .chat-logo {
                width: 28px;
                height: 28px;
                border-radius: 50%;
                margin-right: 10px;
                border: 2px solid rgba(255,255,255,0.6);
            }
            
            .chatbot-header span {
                font-weight: 600;
                font-size: 15px;
                letter-spacing: 0.3px;
            }
            
            .close-button {
                background: none;
                border: none;
                color: white;
                font-size: 22px;
                cursor: pointer;
                opacity: 0.8;
                transition: opacity 0.2s;
                padding: 0 5px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .close-button:hover {
                opacity: 1;
            }
            
            .chatbot-messages {
                flex: 1;
                padding: 18px;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                gap: 12px;
                scroll-behavior: smooth;
                background: #f9f9f9;
            }
            
            .chatbot-message {
                max-width: 85%;
                padding: 12px 16px;
                border-radius: 18px;
                margin-bottom: 2px;
                word-wrap: break-word;
                line-height: 1.4;
                font-size: 14px;
                animation: fadeIn 0.3s ease;
                box-shadow: 0 1px 2px rgba(0,0,0,0.1);
            }
            
            .bot {
                align-self: flex-start;
                background-color: white;
                color: #333;
                border-bottom-left-radius: 5px;
                border: 1px solid rgba(0,0,0,0.08);
            }
            
            .user {
                align-self: flex-end;
                background: linear-gradient(135deg, #005999, #003366);
                color: white;
                border-bottom-right-radius: 5px;
            }
            
            .chatbot-input-container {
                display: flex;
                padding: 12px 15px;
                background: white;
                border-top: 1px solid rgba(0,0,0,0.08);
                align-items: center;
            }
            
            #chatbot-input {
                flex: 1;
                padding: 12px 16px;
                border: 1px solid rgba(0,0,0,0.15);
                border-radius: 24px;
                outline: none;
                font-size: 14px;
                transition: border 0.3s, box-shadow 0.3s;
            }
            
            #chatbot-input:focus {
                border-color: #003366;
                box-shadow: 0 0 0 3px rgba(0,51,102,0.1);
            }
            
            #chatbot-send {
                background: linear-gradient(135deg, #005999, #003366);
                color: white;
                border: none;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                margin-left: 10px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: transform 0.2s, box-shadow 0.2s;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            }
            
            #chatbot-send:hover {
                transform: scale(1.05);
                box-shadow: 0 4px 8px rgba(0,0,0,0.15);
            }
            
            .option-button {
                background: white;
                border: 1px solid rgba(0,51,102,0.3);
                color: #003366;
                border-radius: 18px;
                padding: 8px 16px;
                margin: 5px 6px 5px 0;
                cursor: pointer;
                transition: all 0.2s;
                font-weight: 500;
                font-size: 13px;
                box-shadow: 0 1px 2px rgba(0,0,0,0.05);
            }
            
            .option-button:hover {
                background-color: rgba(0,51,102,0.1);
                transform: translateY(-2px);
                box-shadow: 0 3px 5px rgba(0,0,0,0.1);
            }
            
            .typing-indicator {
                display: flex;
                align-items: center;
                background-color: white;
                padding: 12px 16px;
                border-radius: 18px;
                border-bottom-left-radius: 5px;
                width: fit-content;
                margin-bottom: 2px;
                align-self: flex-start;
                box-shadow: 0 1px 2px rgba(0,0,0,0.1);
                border: 1px solid rgba(0,0,0,0.08);
            }
            
            .typing-dot {
                width: 7px;
                height: 7px;
                background-color: #003366;
                border-radius: 50%;
                margin: 0 2px;
                opacity: 0.7;
                animation: typingAnimation 1.2s infinite both;
            }
            
            .typing-dot:nth-child(1) { animation-delay: 0s; }
            .typing-dot:nth-child(2) { animation-delay: 0.2s; }
            .typing-dot:nth-child(3) { animation-delay: 0.4s; }
            
            @keyframes typingAnimation {
                0%, 60%, 100% { transform: translateY(0); }
                30% { transform: translateY(-4px); }
            }
            
            .chatbot-toggle {
                position: fixed;
                bottom: 30px;
                right: 30px;
                width: 58px;
                height: 58px;
                background: linear-gradient(135deg, #005999, #003366);
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                z-index: 999;
                box-shadow: 0 4px 10px rgba(0,0,0,0.2);
                border: none;
                font-size: 24px;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
            }
            
            .chatbot-toggle:hover {
                transform: scale(1.05);
                box-shadow: 0 6px 15px rgba(0,0,0,0.25);
            }
            
            .chatbot-toggle.active {
                animation: pulseEffect 1s infinite ease-in-out;
            }
        `;
        
        // Añadir el chatbot y los estilos al DOM
        document.head.appendChild(chatbotStyle);
        document.body.appendChild(chatbotContainer);
        
        // Añadir el botón de toggle si no existe
        if (!document.querySelector('.chatbot-toggle')) {
            const toggleButton = document.createElement('button');
            toggleButton.className = 'chatbot-toggle';
            toggleButton.innerHTML = `
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;
            toggleButton.addEventListener('click', toggleChatbot);
            document.body.appendChild(toggleButton);
            chatbotToggle = toggleButton;
        }
        
        // Configurar los eventos del chatbot
        enhanceChatbotFunctionality();
    }
    
    function enhanceChatbotFunctionality() {
        // Obtener elementos del chatbot
        chatbotMessages = document.getElementById('chatbot-messages');
        const chatbotInput = document.getElementById('chatbot-input');
        const chatbotSend = document.getElementById('chatbot-send');
        const closeButton = document.querySelector('.close-button');
        
        // Añadir eventos
        if (chatbotSend) {
            chatbotSend.addEventListener('click', handleUserMessage);
        }
        
        if (chatbotInput) {
            chatbotInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    handleUserMessage();
                }
            });
        }
        
        if (closeButton) {
            closeButton.addEventListener('click', toggleChatbot);
        }
        
        // Enviar mensaje de bienvenida si el contenedor de mensajes está vacío
        if (chatbotMessages && chatbotMessages.children.length === 0) {
            setTimeout(() => {
                sendBotMessage("¡Hola! 👋 Soy el asistente virtual de SPMarketing. ¿En qué puedo ayudarte hoy?");
                setTimeout(() => {
                    displayOptions();
                }, 3000);
            }, 3000);
        }
    }
    
    // Función para alternar la visibilidad del chatbot (abrir/cerrar con un clic)
    function toggleChatbot() {
        if (chatbotContainer) {
            // Verificar si el chatbot está visible basándonos en el display style o una clase
            const isDisplayed = chatbotContainer.style.display === 'flex' || window.getComputedStyle(chatbotContainer).display === 'flex';
            
            if (isDisplayed) {
                // El chatbot está visible, así que lo cerramos
                // Añadir animación de cierre
                chatbotContainer.classList.remove('chat-open');
                chatbotContainer.classList.add('chat-close');
                
                // Esperar a que la animación termine antes de ocultar
                setTimeout(() => {
                    chatbotContainer.style.display = 'none';
                    if (chatbotToggle) {
                        chatbotToggle.classList.remove('active');
                    }
                }, 300);
                
                console.log('Chatbot cerrado con clic');
            } else {
                // El chatbot está oculto, así que lo abrimos
                // Mostrar inmediatamente y luego animar
                chatbotContainer.style.display = 'flex';
                if (chatbotToggle) {
                    chatbotToggle.classList.add('active');
                }
                
                // Aplicar animación de apertura
                setTimeout(() => {
                    chatbotContainer.classList.remove('chat-close');
                    chatbotContainer.classList.add('chat-open');
                }, 10);
                
                // Enfoque en el input
                const input = document.getElementById('chatbot-input');
                if (input) {
                    setTimeout(() => input.focus(), 300);
                }
                
                // Si es la primera vez que se abre, enviar mensaje de bienvenida
                if (chatbotMessages && chatbotMessages.children.length === 0) {
                    setTimeout(() => {
                        sendBotMessage("👋 ¿En qué puedo ayudarte hoy? Soy tu agente de marketing");
                        setTimeout(() => {
                            displayOptions();
                        }, 3000);
                    }, 3000);
                }
                
                console.log('Chatbot abierto con clic');
            }
        }
    }
    
    function handleUserMessage() {
        const input = document.getElementById('chatbot-input');
        if (!input || !chatbotMessages) return;
        
        userMessage = input.value.trim();
        if (userMessage === '') return;
        
        // Añadir mensaje del usuario al chat
        sendUserMessage(userMessage);
        input.value = '';
        
        // Mostrar indicador de escritura
        showTypingIndicator();
        
        // Procesar la respuesta del bot
        setTimeout(() => {
            processBotResponse(userMessage);
        }, 1000);
    }
    
    function sendUserMessage(message) {
        if (!chatbotMessages) return;
        
        const messageElement = document.createElement('div');
        messageElement.className = 'chatbot-message user';
        messageElement.textContent = message;
        chatbotMessages.appendChild(messageElement);
        
        // Se eliminó el scroll automático para permitir al usuario leer a su ritmo
    }
    
    function sendBotMessage(message) {
        // Primero mostrar indicador de escritura
        showTypingIndicator();
        
        // Simular tiempo de respuesta (3 segundos)
        setTimeout(() => {
            // Eliminar indicador de escritura
            removeTypingIndicator();
            
            // Crear y mostrar el mensaje del bot
            const messageElement = document.createElement('div');
            messageElement.className = 'chatbot-message bot';
            
            // Procesar el mensaje para destacar palabras clave
            let processedMessage = message;
            // Resaltar palabras clave como "descuento", "oferta", etc.
            const keywords = ['descuento', 'oferta', 'gratis', 'ahorro', 'beneficio', 'estrategia', 'resultados'];
            
            keywords.forEach(keyword => {
                const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
                processedMessage = processedMessage.replace(regex, `<strong style="color:#003366">${keyword}</strong>`);
            });
            
            messageElement.innerHTML = `<div>${processedMessage}</div>`;
            chatbotMessages.appendChild(messageElement);
            
            // Efecto de aparición suave
            setTimeout(() => {
                messageElement.style.opacity = '1';
                messageElement.style.transform = 'translateY(0)';
            }, 50);
            
            // Se eliminó el scroll automático para permitir al usuario leer a su ritmo
        }, 3000); // Simular tiempo de respuesta de 3 segundos
    }
    
    function showTypingIndicator() {
        if (!chatbotMessages) return;
        
        // Eliminar indicador anterior si existe
        removeTypingIndicator();
        
        // Crear nuevo indicador
        typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        typingIndicator.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        
        chatbotMessages.appendChild(typingIndicator);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
    
    function removeTypingIndicator() {
        if (chatbotMessages) {
            const existingIndicator = chatbotMessages.querySelector('.typing-indicator');
            if (existingIndicator) {
                existingIndicator.remove();
            }
        }
    }
    
    function displayOptions() {
        const options = [
            "¿Qué servicios ofrecen?",
            "¿Cuáles son sus planes y precios?",
            "¿Por qué elegir SPMarketing?",
            "Quiero una consulta gratuita"
        ];
        
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'chatbot-message bot';
        optionsContainer.innerHTML = `
            <div>¿En qué puedo ayudarte hoy?</div>
            <div style="display: flex; flex-wrap: wrap; margin-top: 12px; gap: 6px;">
                <button class="option-button">🚀 Servicios</button>
                <button class="option-button">💰 Precios</button>
                <button class="option-button">✨ Ventajas</button>
                <button class="option-button">📞 Contacto</button>
            </div>
        `;
        
        chatbotMessages.appendChild(optionsContainer);
        
        // Se eliminó el scroll automático para permitir al usuario leer a su ritmo
        
        // Añadir eventos a los botones de opciones
        const optionButtons = optionsContainer.querySelectorAll('.option-button');
        optionButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Extraer solo el texto sin el emoji
                const text = this.textContent.trim();
                const optionText = text.substring(text.indexOf(' ') + 1);
                sendUserMessage(optionText);
                
                // Deshabilitar todos los botones después de hacer clic
                optionButtons.forEach(btn => {
                    btn.disabled = true;
                    btn.style.opacity = '0.6';
                    btn.style.cursor = 'default';
                    btn.style.pointerEvents = 'none';
                });
                
                // Procesar la opción seleccionada directamente
                // Mostrar indicador de escritura
                showTypingIndicator();
                
                setTimeout(() => {
                    // Procesar la respuesta según la opción
                    if (optionText === "Servicios") {
                        displayServices();
                    } else if (optionText === "Precios") {
                        displayPricing();
                    } else if (optionText === "Ventajas") {
                        displayBenefits();
                    } else if (optionText === "Contacto") {
                        displayContact();
                    }
                }, 3000);
            });
        });
        
        // Se eliminó el scroll automático para permitir al usuario leer a su ritmo
    }
    
    function processBotResponse(message) {
        message = message.toLowerCase();
        
        // Verificar palabras clave en el mensaje
        if (message.includes('servicio') || message.includes('ofrecen')) {
            displayServices();
        } else if (message.includes('precio') || message.includes('plan') || message.includes('planes') || message.includes('costo')) {
            displayPricing();
        } else if (message.includes('por qué') || message.includes('beneficio') || message.includes('elegir')) {
            displayBenefits();
        } else if (message.includes('consulta') || message.includes('contacto') || message.includes('contactar') || message.includes('asesor')) {
            displayContact();
        } else if (message.includes('gracias') || message.includes('adios') || message.includes('adiós')) {
            sendBotMessage("¡Gracias por contactar con SPMarketing! Si necesitas algo más, estaré aquí para ayudarte. 😊");
        } else {
            // Respuesta general
            sendBotMessage("Gracias por tu mensaje. ¿En qué más puedo ayudarte?");
            setTimeout(displayOptions, 500);
        }
    }
    
    function displayServices() {
        sendBotMessage("Ofrecemos los siguientes servicios:");
        
        setTimeout(() => {
            const servicesContainer = document.createElement('div');
            servicesContainer.className = 'chatbot-services';
            
            siteInfo.services.forEach(service => {
                const serviceItem = document.createElement('div');
                serviceItem.className = 'service-item';
                serviceItem.innerHTML = `<strong>${service.name}</strong>: ${service.description}`;
                serviceItem.style.marginBottom = '10px';
                servicesContainer.appendChild(serviceItem);
            });
            
            const messageElement = document.createElement('div');
            messageElement.className = 'chatbot-message bot';
            messageElement.appendChild(servicesContainer);
            chatbotMessages.appendChild(messageElement);
            
            // Se eliminó el scroll automático para permitir al usuario leer a su ritmo
            
            // Ofrecer más opciones después de mostrar los servicios
            setTimeout(() => {
                sendBotMessage("¿Te gustaría saber más sobre algún tema en específico?");
                setTimeout(displayOptions, 3000);
            }, 3000);
        }, 3000);
    }
    
    function displayPricing() {
        sendBotMessage("Estos son nuestros planes disponibles:");
        
        setTimeout(() => {
            const pricingContainer = document.createElement('div');
            pricingContainer.className = 'chatbot-pricing';
            
            siteInfo.plans.forEach(plan => {
                const planItem = document.createElement('div');
                planItem.className = 'plan-item';
                planItem.innerHTML = `<strong>${plan.name} - ${plan.price}</strong>`;
                planItem.style.marginBottom = '5px';
                
                // Lista de características principal
                const mainFeature = document.createElement('div');
                mainFeature.textContent = plan.features[0];
                mainFeature.style.marginBottom = '5px';
                
                planItem.appendChild(mainFeature);
                pricingContainer.appendChild(planItem);
            });
            
            const messageElement = document.createElement('div');
            messageElement.className = 'chatbot-message bot';
            messageElement.appendChild(pricingContainer);
            chatbotMessages.appendChild(messageElement);
            
            // Añadir botón para ver todos los planes
            setTimeout(() => {
                const optionsContainer = document.createElement('div');
                optionsContainer.style.display = 'flex';
                optionsContainer.style.flexWrap = 'wrap';
                
                const button = document.createElement('button');
                button.className = 'option-button';
                button.textContent = "Ver todos los planes";
                button.addEventListener('click', () => {
                    window.open('precios.html', '_blank');
                });
                
                optionsContainer.appendChild(button);
                
                const messageElement = document.createElement('div');
                messageElement.className = 'chatbot-message bot';
                messageElement.appendChild(optionsContainer);
                chatbotMessages.appendChild(messageElement);
                
                // Se eliminó el scroll automático para permitir al usuario leer a su ritmo
                
                // Ofrecer consulta gratuita
                setTimeout(() => {
                    sendBotMessage("¿Te gustaría solicitar una consulta gratuita para conocer qué plan se adapta mejor a tus necesidades?");
                    
                    // Opciones de SI/NO
                    setTimeout(() => {
                        const optionsContainer = document.createElement('div');
                        optionsContainer.style.display = 'flex';
                        optionsContainer.style.gap = '10px';
                        
                        const yesButton = document.createElement('button');
                        yesButton.className = 'option-button';
                        yesButton.textContent = "Sí, me interesa";
                        yesButton.addEventListener('click', () => {
                            sendUserMessage("Sí, me interesa");
                            
                            showTypingIndicator();
                            setTimeout(() => {
                                displayContact();
                            }, 3000);
                        });
                        
                        const noButton = document.createElement('button');
                        noButton.className = 'option-button';
                        noButton.textContent = "No, gracias";
                        noButton.addEventListener('click', () => {
                            sendUserMessage("No, gracias");
                            
                            showTypingIndicator();
                            setTimeout(() => {
                                sendBotMessage("Entendido. Si tienes alguna otra pregunta, no dudes en consultarme. ¿En qué más puedo ayudarte?");
                                setTimeout(displayOptions, 3000);
                            }, 3000);
                        });
                        
                        optionsContainer.appendChild(yesButton);
                        optionsContainer.appendChild(noButton);
                        
                        const messageElement = document.createElement('div');
                        messageElement.className = 'chatbot-message bot';
                        messageElement.appendChild(optionsContainer);
                        chatbotMessages.appendChild(messageElement);
                        
                        // Se eliminó el scroll automático para permitir al usuario leer a su ritmo
                    }, 3000);
                }, 3000);
            }, 3000);
        }, 3000);
    }
    
    function displayBenefits() {
        sendBotMessage("Estas son las ventajas de elegir SPMarketing:");
        
        setTimeout(() => {
            const benefitsContainer = document.createElement('div');
            benefitsContainer.className = 'chatbot-benefits';
            
            siteInfo.benefits.forEach(benefit => {
                const benefitItem = document.createElement('div');
                benefitItem.className = 'benefit-item';
                benefitItem.innerHTML = `<strong>${benefit.name}</strong>: ${benefit.description}`;
                benefitItem.style.marginBottom = '10px';
                benefitsContainer.appendChild(benefitItem);
            });
            
            const messageElement = document.createElement('div');
            messageElement.className = 'chatbot-message bot';
            messageElement.appendChild(benefitsContainer);
            chatbotMessages.appendChild(messageElement);
            
            // Se eliminó el scroll automático para permitir al usuario leer a su ritmo
            
            // Ofrecer más opciones después de mostrar los beneficios
            setTimeout(() => {
                sendBotMessage("¿Te gustaría conocer más sobre nuestros servicios o planes?");
                setTimeout(displayOptions, 3000);
            }, 3000);
        }, 3000);
    }
    
    function displayContact() {
        sendBotMessage("Elige cómo prefieres ponerte en contacto con nosotros:");
        
        setTimeout(() => {
            // Crear contenedor para los botones CTA
            const ctaContainer = document.createElement('div');
            ctaContainer.className = 'chatbot-cta-buttons';
            ctaContainer.style.display = 'flex';
            ctaContainer.style.flexDirection = 'column';
            ctaContainer.style.gap = '10px';
            ctaContainer.style.marginTop = '10px';
            
            // CTA 1: Reservar cita
            const reservaButton = document.createElement('button');
            reservaButton.className = 'chatbot-cta-button';
            reservaButton.innerHTML = `
                <div class="cta-content">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 2V5" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M16 2V5" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M3.5 9.09H20.5" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M12 13.43H15.5" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M12 17.43H15.5" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M8.5 13.43H8.51" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M8.5 17.43H8.51" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>Reservar Consulta Gratuita</span>
                </div>
            `;
            reservaButton.style.cssText = `
                background: linear-gradient(135deg, #005999, #003366);
                color: white;
                border: none;
                border-radius: 8px;
                padding: 12px 16px;
                cursor: pointer;
                font-weight: 500;
                width: 100%;
                text-align: start;
                transition: transform 0.2s, box-shadow 0.2s;
            `;
            
            // CTA 2: WhatsApp
            const whatsappButton = document.createElement('button');
            whatsappButton.className = 'chatbot-cta-button';
            whatsappButton.innerHTML = `
                <div class="cta-content">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.9 20.6C8.4 21.5 10.2 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 13.8 2.5 15.5 3.3 17L2.4 21.7L6.9 20.6Z" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M16.5 14.8C16.5 15 16.4 15.3 16.2 15.5C16 15.7 15.8 15.8 15.6 15.9C15.3 16.1 15 16.1 14.6 16.1C14.1 16.1 13.5 16 12.8 15.7C12.1 15.4 11.5 15 10.9 14.5C10.3 14 9.7 13.4 9.2 12.7C8.7 12 8.3 11.3 8 10.6C7.7 9.9 7.6 9.3 7.6 8.7C7.6 8.4 7.6 8.1 7.7 7.8C7.8 7.5 8 7.3 8.2 7.1C8.4 6.9 8.7 6.8 9 6.8C9.1 6.8 9.2 6.8 9.3 6.8C9.4 6.9 9.5 7 9.6 7.2L10.5 8.8C10.6 9 10.6 9.1 10.7 9.3C10.8 9.5 10.8 9.6 10.8 9.7C10.8 9.9 10.7 10 10.6 10.1C10.5 10.2 10.4 10.4 10.3 10.5L10 10.8C9.9 10.9 9.9 11 9.9 11.1C10 11.3 10.1 11.5 10.3 11.7C10.5 11.9 10.7 12.2 10.9 12.4C11.1 12.6 11.4 12.8 11.6 13C11.8 13.2 12 13.3 12.2 13.3C12.3 13.3 12.4 13.3 12.5 13.2C12.6 13.1 12.7 13 12.8 12.9L13.1 12.6C13.2 12.5 13.4 12.4 13.5 12.3C13.6 12.2 13.7 12.1 13.9 12.1C14 12.1 14.1 12.1 14.3 12.2C14.5 12.3 14.6 12.3 14.8 12.4L16.4 13.3C16.6 13.4 16.7 13.5 16.8 13.6C16.9 13.7 16.9 13.8 16.9 14C16.5 14.2 16.5 14.5 16.5 14.8Z" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10"/>
                    </svg>
                    <span>Contactar por WhatsApp</span>
                </div>
            `;
            whatsappButton.style.cssText = `
                background-color: #25D366;
                color: white;
                border: none;
                border-radius: 8px;
                padding: 12px 16px;
                cursor: pointer;
                font-weight: 500;
                width: 100%;
                text-align: start;
                transition: transform 0.2s, box-shadow 0.2s;
            `;
            
            // CTA 3: Correo
            const emailButton = document.createElement('button');
            emailButton.className = 'chatbot-cta-button';
            emailButton.innerHTML = `
                <div class="cta-content">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 20.5H7C4 20.5 2 19 2 15.5V8.5C2 5 4 3.5 7 3.5H17C20 3.5 22 5 22 8.5V15.5C22 19 20 20.5 17 20.5Z" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M17 9L13.87 11.5C12.84 12.32 11.15 12.32 10.12 11.5L7 9" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>Enviar un Correo</span>
                </div>
            `;
            emailButton.style.cssText = `
                background-color: #4285F4;
                color: white;
                border: none;
                border-radius: 8px;
                padding: 12px 16px;
                cursor: pointer;
                font-weight: 500;
                width: 100%;
                text-align: start;
                transition: transform 0.2s, box-shadow 0.2s;
            `;
            
            // Estilos para el contenido interior de los botones
            const style = document.createElement('style');
            style.textContent = `
                .cta-content {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                
                .chatbot-cta-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                }
            `;
            document.head.appendChild(style);
            
            // Añadir eventos a los botones
            reservaButton.addEventListener('click', () => {
                // Cerrar el chatbot y desplazarse al formulario de contacto
                const contactSection = document.getElementById('contacto');
                if (contactSection) {
                    toggleChatbot(); // Cerrar el chatbot
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
            
            whatsappButton.addEventListener('click', () => {
                window.open(siteInfo.contact.whatsapp, '_blank');
            });
            
            emailButton.addEventListener('click', () => {
                window.location.href = `mailto:${siteInfo.contact.email}?subject=Consulta desde web de SPMarketing`;  
            });
            
            // Añadir los botones al contenedor
            ctaContainer.appendChild(reservaButton);
            ctaContainer.appendChild(whatsappButton);
            ctaContainer.appendChild(emailButton);
            
            // Crear el mensaje del bot que contiene los CTA
            const messageElement = document.createElement('div');
            messageElement.className = 'chatbot-message bot';
            messageElement.appendChild(ctaContainer);
            chatbotMessages.appendChild(messageElement);
            
            // Se eliminó el scroll automático para permitir al usuario leer a su ritmo
            
            // Mensaje final
            setTimeout(() => {
                sendBotMessage("Nuestro equipo está listo para ayudarte a potenciar tu presencia online y aumentar tus ventas. ¿En qué más te puedo ayudar?");
                setTimeout(displayOptions, 3000);
            }, 3000);
        }, 3000);
    }
});
