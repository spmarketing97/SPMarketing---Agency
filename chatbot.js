// Variables globales
const hamburger = document.getElementById('hamburger');
const menu = document.getElementById('menu');
const navbar = document.getElementById('navbar');
const testimonialTrack = document.querySelector('.testimonial-track');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const contactForm = document.getElementById('contactForm');
const confirmationModal = document.getElementById('confirmationModal');
const closeModal = document.querySelector('.close-modal');
const modalBtn = document.querySelector('.modal-btn');
const calendarWrapper = document.getElementById('calendar');
const testimonialCards = document.querySelectorAll('.testimonial-card');
const welcomePopup = document.getElementById('welcomePopup');
const closePopupBtn = document.querySelector('.close-popup');

// Chatbot variables
let chatbotOpen = false;
let chatbotContainer = null;
let chatbotMessages = null;
let chatbotInput = null;
let chatbotSendBtn = null;
let chatbotToggleBtn = null;
let chatbotCloseBtn = null;
const TELEGRAM_TOKEN = '8114461498:AAGgUsgKDHn4kpbcQdtKl1E1OYqCYwkGgMk';
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

// Información de las secciones
const sectionInfo = {
    servicios: {
        title: "Nuestros Servicios",
        items: [
            {
                name: "Desarrollo Web",
                description: "Sitios web profesionales y optimizados para convertir visitantes en clientes",
                features: ["Diseño Responsive", "SEO Optimizado", "Alto Rendimiento", "Diseño UX/UI"]
            },
            {
                name: "Landing Pages",
                description: "Páginas de aterrizaje con alto ratio de conversión para campañas específicas",
                features: ["Alto Ratio de Conversión", "A/B Testing", "CTA Optimizados", "Análisis de Datos"]
            },
            {
                name: "Marketing Digital",
                description: "Estrategias personalizadas para potenciar tu presencia online",
                features: ["Análisis de mercado", "Estrategia personalizada", "Optimización continua", "Reportes mensuales"]
            },
            {
                name: "Gestión de Redes Sociales",
                description: "Creamos y gestionamos contenido atractivo optimizado con IA",
                features: ["Contenido de calidad", "Publicaciones semanales", "Interacción con audiencia", "Análisis de métricas"]
            },
            {
                name: "SEO",
                description: "Mejoramos tu posicionamiento en buscadores para aumentar el tráfico cualificado",
                features: ["Auditoría SEO", "Optimización palabras clave", "Contenido optimizado", "Reportes detallados"]
            }
        ]
    },
    beneficios: {
        title: "¿Por qué elegirnos?",
        items: [
            {
                name: "Experiencia",
                description: "Más de 5 años en el sector del marketing digital",
                features: ["Equipo profesional", "Proyectos exitosos", "Conocimiento especializado"]
            },
            {
                name: "Resultados",
                description: "Estrategias orientadas a ROI medible y crecimiento real",
                features: ["Métricas en tiempo real", "Optimización continua", "Reportes detallados"]
            },
            {
                name: "Personalización",
                description: "Soluciones a medida según tus objetivos específicos",
                features: ["Análisis previo", "Estrategia personalizada", "Adaptación constante"]
            },
            {
                name: "Tecnología IA",
                description: "Optimización avanzada con inteligencia artificial 24/7",
                features: ["Automatización inteligente", "Análisis predictivo", "Decisiones basadas en datos"]
            },
            {
                name: "Sin Permanencia",
                description: "Trabajamos sin contratos de larga duración",
                features: ["Flexibilidad total", "Sin compromisos", "Cancela cuando quieras"]
            }
        ]
    },
    precios: {
        title: "Planes Disponibles",
        description: "Consulta inicial GRATUITA que incluye:",
        features: [
            "Análisis de mercado y competencia",
            "Propuesta de estrategia personalizada",
            "Diseño e Identificación de Mejoras",
            "Sin permanencia",
            "Sin compromiso"
        ],
        plans: [
            {
                name: "Plan Premium",
                price: "299€/mes",
                original_price: "399€",
                features: [
                    "Desarrollo de Landing Page o Sitio Web",
                    "Optimización SEO básica",
                    "Gestión de redes sociales",
                    "5 Publicaciones Semanales Optimizadas con IA",
                    "Análisis de mercado y competencia",
                    "Propuesta de mejoras e Informe completo",
                    "Soporte continuo",
                    "Sin permanencia"
                ]
            },
            {
                name: "Plan Pro",
                price: "599€/mes",
                original_price: "799€",
                features: [
                    "Desarrollo web, landing page o Ecommerce",
                    "Optimización SEO Profesional",
                    "Gestión de redes sociales con IA",
                    "7 Publicaciones Semanales optimizadas",
                    "Análisis de Mercado avanzado",
                    "Informes semanales detallados",
                    "Soporte prioritario",
                    "Sin permanencia"
                ]
            },
            {
                name: "Plan Business",
                price: "A convenir",
                features: [
                    "Solución completa personalizada",
                    "Estrategia avanzada con IA",
                    "Presencia digital completa",
                    "Desarrollo a medida",
                    "Campañas publicitarias optimizadas",
                    "Soporte prioritario 24/7"
                ]
            }
        ]
    }
};

// Variable para controlar si ya se mostró el saludo
let welcomeMessageShown = false;

// Nueva función mejorada para agregar mensajes del bot con retraso y simulación de escritura
function addBotMessageWithDelay(message, chatbotMessages, delay = 3000, isFirstMessage = false, isImage = false, isCTA = false) {
    return new Promise((resolve) => {
        // Mostrar indicador de escritura
        showTypingIndicator(chatbotMessages);
        
        // Determinar el retraso apropiado
        let finalDelay = delay;
        if (delay === 0) {
            if (isFirstMessage) {
                finalDelay = 2000;
            } else {
                finalDelay = 3000;
            }
        }
        
        // Después del retraso, ocultar el indicador y mostrar el mensaje
        setTimeout(() => {
            // Ocultar el indicador de escritura
            hideTypingIndicator();
            
            // Crear y mostrar el mensaje
            const messageElement = document.createElement('div');
            messageElement.className = 'chatbot-message bot';
            messageElement.innerHTML = message;
            
            chatbotMessages.appendChild(messageElement);
            scrollToBottom(chatbotMessages);
            
            resolve();
        }, finalDelay);
    });
}

// Función para mostrar el mensaje de bienvenida inicial
function showWelcomeMessage() {
    // Crear contenido del mensaje de bienvenida con logo (imagen)
    const welcomeMessage = `
        <div style="display: flex; align-items: center; margin-bottom: 8px;">
            <img src="assets/img/LOGO PRINCIPAL.jpg" alt="SPMarketing Logo" style="width: 40px; height: 40px; border-radius: 50%; margin-right: 10px; object-fit: cover;">
            <strong>Asistente de SPMarketing</strong>
        </div>
        👋 ¡Hola! Soy el asistente virtual de <strong>SPMarketing</strong>. ¿En qué puedo ayudarte hoy?
    `;
    
    // Mostrar el primer mensaje con retraso de 2 segundos (porque contiene una imagen)
    showTypingIndicator(document.getElementById('chatbot-messages'));
    
    setTimeout(() => {
        hideTypingIndicator();
        
        const messageElement = document.createElement('div');
        messageElement.className = 'chatbot-message bot';
        messageElement.innerHTML = welcomeMessage;
        
        const chatbotMessages = document.getElementById('chatbot-messages');
        chatbotMessages.appendChild(messageElement);
        scrollToBottom(chatbotMessages);
        
        // Mostrar opciones principales con retraso de 2 segundos (son CTAs)
        setTimeout(() => {
            showMainOptions(document.getElementById('chatbot-messages'));
        }, 2000);
    }, 2000);
}

// Funciones para manejar las diferentes opciones
function showServices() {
    const servicesMessage = `
        <strong>Nuestros Servicios:</strong><br>
        • <strong>Desarrollo Web:</strong> Sitios web optimizados para conversión<br>
        • <strong>Landing Pages:</strong> Páginas optimizadas para maximizar conversiones<br>
        • <strong>Marketing Digital:</strong> Estrategias personalizadas para aumentar ventas<br>
        • <strong>Gestión de Redes Sociales:</strong> Potencia tu marca en las principales redes sociales
    `;
    
    addBotMessageWithDelay(servicesMessage, document.getElementById('chatbot-messages'), 0, false, false, false);
    
    setTimeout(() => {
        addOptionsButtons([
            { text: "💰 Ver Precios", handler: showPricing },
            { text: "🏠 Volver al Inicio", handler: backToMainMenu }
        ]);
    }, 3000);
}

function showPricing() {
    const pricingMessage = `
        <strong>Nuestros Planes:</strong><br>
        • <strong>Plan Premium:</strong> 299€/mes - Ideal para pequeños negocios<br>
        • <strong>Plan Pro:</strong> 599€/mes - Para empresas en crecimiento<br>
        • <strong>Plan Business:</strong> Personalizado - Para grandes empresas
    `;
    
    addBotMessageWithDelay(pricingMessage, document.getElementById('chatbot-messages'), 0, false, false, false);
    
    setTimeout(() => {
        addOptionsButtons([
            { text: "💼 Ver Servicios", handler: showServices },
            { text: "🏠 Volver al Inicio", handler: backToMainMenu }
        ]);
    }, 3000);
}

function showBenefits() {
    const benefitsMessage = `
        <strong>Nuestros Beneficios:</strong><br>
        • <strong>ROI Garantizado:</strong> +150% ROI promedio con estrategias optimizadas<br>
        • <strong>Tecnología IA:</strong> Optimización automática 24/7 con inteligencia artificial<br>
        • <strong>Respuesta Rápida:</strong> Atención personalizada en menos de 24 horas<br>
        • <strong>Experiencia Comprobada:</strong> +6.849 clientes satisfechos y resultados comprobables
    `;
    
    addBotMessageWithDelay(benefitsMessage, document.getElementById('chatbot-messages'), 0, false, false, false);
    
    setTimeout(() => {
        addOptionsButtons([
            { text: "💼 Ver Servicios", handler: showServices },
            { text: "💰 Ver Precios", handler: showPricing },
            { text: "🏠 Volver al Inicio", handler: backToMainMenu }
        ]);
    }, 3000);
}

function showContactInfo() {
    const contactMessage = `
        <strong>Contacta con Nosotros:</strong><br>
        • <strong>WhatsApp:</strong> <a href="https://wa.link/uxacg0" target="_blank">Enviar mensaje</a><br>
        • <strong>Email:</strong> <a href="mailto:solucionesworld2016@gmail.com">solucionesworld2016@gmail.com</a><br>
        • <strong>Telegram:</strong> <a href="https://t.me/SPMarketing_KR" target="_blank">@SPMarketing_KR</a>
    `;
    
    addBotMessageWithDelay(contactMessage, document.getElementById('chatbot-messages'), 0, false, false, false);
    
    setTimeout(() => {
        addOptionsButtons([
            { text: "🏠 Volver al Inicio", handler: backToMainMenu }
        ]);
    }, 3000);
}

function backToMainMenu() {
    addOptionsButtons([
        { text: "💼 Servicios", handler: showServices },
        { text: "💰 Precios", handler: showPricing },
        { text: "🌟 Beneficios", handler: showBenefits },
        { text: "📞 Contacto", handler: showContactInfo }
    ]);
}

// Función para agregar el mensaje de consulta gratuita
function addConsultaGratuitaMessage(chatbotMessages) {
    const ctaButton = `
        <div style="margin-top: 15px; text-align: center;">
            <a href="index.html#contacto" style="
                display: inline-block;
                background: linear-gradient(135deg, #ff4500, #ff7b00);
                color: white;
                padding: 12px 24px;
                border-radius: 30px;
                font-weight: 600;
                text-decoration: none;
                box-shadow: 0 4px 15px rgba(255, 69, 0, 0.3);
                transition: all 0.3s ease;
            " onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='translateY(0)'">
                CONSULTA GRATUITA
            </a>
        </div>
    `;
    
    // Este es un CTA, debe mostrarse después de 5 segundos
    addBotMessageWithDelay(`¿Quieres saber más sobre cómo podemos ayudarte a impulsar tu negocio? Agenda una <strong>consulta gratuita</strong> con nuestros expertos.${ctaButton}`, chatbotMessages, 5000, false, false, true);
}

// Función para mostrar servicios con imágenes (3 seg) y CTA (5 seg)
function showServicesInfo(chatbotMessages) {
    // Título (texto normal, 5 segundos)
    addBotMessageWithDelay(`<strong>${sectionInfo.servicios.title}</strong>`, chatbotMessages).then(() => {
        // Mensaje con íconos de servicios (contiene iconos/imágenes, 3 segundos)
        let serviceInfo = 'Potenciamos tu negocio con servicios digitales integrales:<br><br>';
        sectionInfo.servicios.items.forEach(service => {
            serviceInfo += `<strong>✅ ${service.name}:</strong> ${service.description}<br><br>`;
        });
        
        addBotMessageWithDelay(serviceInfo, chatbotMessages, 3000, false, true).then(() => {
            // Agregar mensaje de consulta gratuita (CTA, 5 segundos)
            addConsultaGratuitaMessage(chatbotMessages);
            
            // Mostrar opciones principales después (CTAs, 5 segundos)
            setTimeout(() => {
                showMainOptions(chatbotMessages);
            }, 5000);
        });
    });
}

// Función para mostrar información de precios
function showPricingInfo(chatbotMessages) {
    // Título (texto normal, 5 segundos)
    addBotMessageWithDelay(`<strong>${sectionInfo.precios.title}</strong>`, chatbotMessages).then(() => {
        // Detalles de la consulta gratuita (texto principalmente, 5 segundos)
        let pricingInfo = 'Todos nuestros planes comienzan con una <strong>consulta inicial GRATUITA</strong> que incluye:<br><ul>';
        sectionInfo.precios.features.forEach(feature => {
            pricingInfo += `<li>✅ ${feature}</li>`;
        });
        pricingInfo += '</ul>';
        
        addBotMessageWithDelay(pricingInfo, chatbotMessages).then(() => {
            // Plan Premium (tiene iconos e imágenes, 3 segundos)
            const premiumPlan = sectionInfo.precios.plans[0];
            const plansInfo = `
                <div style="border: 1px solid #e9ecef; border-radius: 12px; padding: 15px; margin-bottom: 15px; background-color: #f8f9fa;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <h3 style="margin: 0; color: #003366; font-size: 18px;">${premiumPlan.name}</h3>
                        <div>
                            <span style="text-decoration: line-through; color: #999; font-size: 14px;">${premiumPlan.original_price}</span>
                            <span style="font-weight: 700; color: #ff4500; font-size: 18px; margin-left: 5px;">${premiumPlan.price}</span>
                        </div>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <ul style="padding-left: 20px; margin: 0;">
                            ${premiumPlan.features.slice(0, 4).map(feature => `<li style="margin-bottom: 5px;">${feature}</li>`).join('')}
                        </ul>
                    </div>
                    <div style="text-align: center;">
                        <a href="index.html#contacto" style="
                            display: inline-block;
                            background-color: #003366;
                            color: white;
                            padding: 8px 16px;
                            border-radius: 20px;
                            font-weight: 500;
                            text-decoration: none;
                            font-size: 14px;
                        ">Ver detalles completos</a>
                    </div>
                </div>
            `;
            
            addBotMessageWithDelay(plansInfo, chatbotMessages, 3000, false, true).then(() => {
                // Información adicional de planes (texto, 5 segundos)
                addBotMessageWithDelay(`También ofrecemos el <strong>Plan Pro (599€/mes)</strong> y <strong>Plan Business (personalizado)</strong> para necesidades más avanzadas. Todos nuestros planes son sin permanencia y con soporte continuo.`, chatbotMessages).then(() => {
                    // Agregar mensaje de consulta gratuita (CTA, 5 segundos)
                    addConsultaGratuitaMessage(chatbotMessages);
                    
                    // Mostrar opciones principales después (CTAs, 5 segundos)
                    setTimeout(() => {
                        showMainOptions(chatbotMessages);
                    }, 5000);
                });
            });
        });
    });
}

// Función para mostrar información de beneficios
function showBenefitsInfo(chatbotMessages) {
    // Título (texto normal, 5 segundos)
    addBotMessageWithDelay(`<strong>${sectionInfo.beneficios.title}</strong>`, chatbotMessages).then(() => {
        // Crear un solo mensaje con todos los beneficios (tiene iconos, 3 segundos)
        let benefitsHTML = `<div style="margin: 10px 0;">`;
        
        sectionInfo.beneficios.items.forEach(benefit => {
            benefitsHTML += `
                <div style="margin-bottom: 12px; display: flex; align-items: flex-start;">
                    <div style="
                        min-width: 28px;
                        height: 28px;
                        border-radius: 50%;
                        background: linear-gradient(135deg, #003366, #0066cc);
                        color: white;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-right: 10px;
                        margin-top: 2px;
                        font-size: 14px;
                    ">
                        <i class="fas fa-check"></i>
                    </div>
                    <div>
                        <strong style="color: #003366;">${benefit.name}:</strong> ${benefit.description}
                    </div>
                </div>
            `;
        });
        
        benefitsHTML += `</div>`;
        
        // Agregar todos los beneficios (tienen iconos, 3 segundos)
        addBotMessageWithDelay(benefitsHTML, chatbotMessages, 3000, false, true).then(() => {
            // Testimonial (texto, 5 segundos)
            const testimonialHTML = `
                <div style="
                    border-left: 3px solid #0066cc;
                    padding-left: 15px;
                    margin: 15px 0;
                    font-style: italic;
                    color: #555;
                ">
                    "SPMarketing ha transformado nuestra presencia online. Nuestras ventas han aumentado un 143% en solo 3 meses gracias a sus estrategias de marketing personalizadas." - María G., Propietaria de Tienda Online
                </div>
            `;
            
            addBotMessageWithDelay(testimonialHTML, chatbotMessages).then(() => {
                // Agregar mensaje de consulta gratuita (CTA, 5 segundos)
                addConsultaGratuitaMessage(chatbotMessages);
                
                // Mostrar opciones principales después (CTAs, 5 segundos)
                setTimeout(() => {
                    showMainOptions(chatbotMessages);
                }, 5000);
            });
        });
    });
}

// Función para mostrar las opciones principales
function showMainOptions(chatbotMessages) {
    const options = [
        { 
            text: "💼 Nuestros Servicios", 
            description: "Desarrollo web, SEO, redes sociales y más",
            icon: "fa-rocket"
        },
        { 
            text: "💰 Planes y Precios", 
            description: "Desde 299€/mes sin permanencia",
            icon: "fa-tag"
        },
        { 
            text: "🌟 Beneficios", 
            description: "Por qué somos tu mejor opción",
            icon: "fa-star"
        },
        { 
            text: "📱 Contacto Directo", 
            description: "Habla con un asesor ahora",
            icon: "fa-headset"
        }
    ];
    
    // Crear un solo mensaje con todas las opciones juntas
    const optionsHTML = `
        <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 8px; margin-bottom: 8px;">
            ${options.map(option => `
                <button class="option-button" onclick="handleOptionClick('${option.text}', this)" style="
                    background-color: #f8f9fa; 
                    border: 1px solid #e9ecef; 
                    border-radius: 12px; 
                    padding: 12px 15px; 
                    cursor: pointer; 
                    text-align: left; 
                    width: 100%; 
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
                    margin: 0;
                ">
                    <div style="
                        min-width: 36px;
                        height: 36px;
                        border-radius: 50%;
                        background: linear-gradient(135deg, #003366, #006699);
                        color: white;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-right: 12px;
                    ">
                        <i class="fas ${option.icon}"></i>
                    </div>
                    <div>
                        <div style="font-weight: 600; font-size: 14px; color: #333;">${option.text}</div>
                        <div style="font-size: 12px; color: #666; margin-top: 4px;">${option.description}</div>
                    </div>
                </button>
            `).join('')}
        </div>
    `;
    
    // Agregar todas las opciones en un solo mensaje (contiene iconos pero son principalmente CTAs)
    addBotMessageWithDelay(optionsHTML, chatbotMessages, 5000, false, false, true);
    scrollToBottom(chatbotMessages);
}

// Función para el reloj regresivo
function setupCountdown() {
    const countdownElement = document.getElementById('countdown');
    const minutesElement = document.getElementById('minutos');
    const secondsElement = document.getElementById('segundos');
    
    if (!countdownElement || !minutesElement || !secondsElement) {
        console.error("Elementos del contador no encontrados:", 
                     "countdown:", countdownElement ? "OK" : "No encontrado", 
                     "minutos:", minutesElement ? "OK" : "No encontrado",
                     "segundos:", secondsElement ? "OK" : "No encontrado");
        return;
    }
    
    console.log("Inicializando contador regresivo");
    
    // Verificar si hay un tiempo guardado en localStorage y si ha caducado
    let countdownTime = localStorage.getItem('countdownTime');
    let lastReset = localStorage.getItem('lastResetTime');
    const now = new Date().getTime();
    
    // Si el contador está a 0 por más de 5 días, reiniciarlo
    if (countdownTime && lastReset && (now - parseInt(lastReset)) > 5 * 24 * 60 * 60 * 1000 && parseInt(countdownTime) <= 0) {
        console.log("Reiniciando contador (pasaron 5 días)");
        countdownTime = 25 * 60; // 25 minutos en segundos
        localStorage.setItem('countdownTime', countdownTime);
        localStorage.setItem('lastResetTime', now);
    } 
    // Si no hay tiempo guardado, establecer a 25 minutos
    else if (!countdownTime) {
        console.log("Inicializando contador por primera vez");
        countdownTime = 25 * 60; // 25 minutos en segundos
        localStorage.setItem('countdownTime', countdownTime);
        localStorage.setItem('lastResetTime', now);
    }
    
    // Actualizar el contador cada segundo
    const countdownInterval = setInterval(() => {
        // Obtener el tiempo actual del localStorage
        countdownTime = localStorage.getItem('countdownTime');
        
        if (countdownTime <= 0) {
            console.log("Contador llegó a cero");
            clearInterval(countdownInterval);
            countdownElement.classList.add('expired');
            minutesElement.textContent = '00';
            secondsElement.textContent = '00';
            return;
        }
        
        // Decrementar en 1 segundo
        countdownTime--;
        localStorage.setItem('countdownTime', countdownTime);
        
        // Calcular minutos y segundos
        const minutes = Math.floor(countdownTime / 60);
        const seconds = countdownTime % 60;
        
        // Actualizar el DOM
        minutesElement.textContent = minutes < 10 ? `0${minutes}` : minutes;
        secondsElement.textContent = seconds < 10 ? `0${seconds}` : seconds;
        
        // Si queda menos de 5 minutos, cambiar a estado "expirando"
        if (countdownTime <= 300 && countdownTime > 0) {
            countdownElement.classList.add('expiring');
        }
        
        // Si llega a cero, cambiar a estado "expirado"
        if (countdownTime <= 0) {
            countdownElement.classList.remove('expiring');
            countdownElement.classList.add('expired');
        }
    }, 1000);
    
    // Mostrar valores iniciales
    const initialMinutes = Math.floor(countdownTime / 60);
    const initialSeconds = countdownTime % 60;
    minutesElement.textContent = initialMinutes < 10 ? `0${initialMinutes}` : initialMinutes;
    secondsElement.textContent = initialSeconds < 10 ? `0${initialSeconds}` : initialSeconds;
    
    // Si ya está en cero, mostrar como expirado
    if (countdownTime <= 0) {
        countdownElement.classList.add('expired');
        minutesElement.textContent = '00';
        secondsElement.textContent = '00';
    } else if (countdownTime <= 300) {
        countdownElement.classList.add('expiring');
    }
}

// Menú móvil
function setupMobileMenu() {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        menu.classList.toggle('active');
    });
    
    // Cerrar el menú al hacer clic en un enlace
    document.querySelectorAll('.menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            menu.classList.remove('active');
        });
    });
}

// Navbar que cambia al hacer scroll
function setupNavbar() {
    if (!navbar) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Carrusel de testimonios con fade
function setupTestimonialFade() {
    if (!testimonialCards || testimonialCards.length === 0) return;
    
    // Establecer el primer testimonio como activo
    testimonialCards[0].classList.add('active');
    
    let currentIndex = 0;
    const interval = 7000; // Cambiar cada 7 segundos
    
    // Función para cambiar el testimonio activo
    function changeTestimonial() {
        // Quitar la clase active del testimonio actual
        testimonialCards[currentIndex].classList.remove('active');
        
        // Incrementar el índice
        currentIndex = (currentIndex + 1) % testimonialCards.length;
        
        // Agregar clase active al siguiente testimonio
        testimonialCards[currentIndex].classList.add('active');
    }
    
    // Cambiar automáticamente cada 7 segundos
    setInterval(changeTestimonial, interval);
}

// Calendario simple
function setupCalendar() {
    if (!calendarWrapper) return;
    
    const date = new Date();
    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth();
    
    // Nombre de los meses
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    
    // Días de la semana
    const weekdays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    
    // Crear estructura del calendario
    const calendarHTML = `
        <div class="calendar-header">
            <button class="prev-month"><i class="fas fa-chevron-left"></i></button>
            <h4 class="current-month">${monthNames[currentMonth]} ${currentYear}</h4>
            <button class="next-month"><i class="fas fa-chevron-right"></i></button>
        </div>
        <div class="weekdays">
            ${weekdays.map(day => `<div class="weekday">${day}</div>`).join('')}
        </div>
        <div class="calendar-days"></div>
        <div class="time-selector">
            <h4>Selecciona una hora:</h4>
            <div class="time-slots">
                <button class="time-slot">09:00</button>
                <button class="time-slot">10:00</button>
                <button class="time-slot">11:00</button>
                <button class="time-slot">12:00</button>
                <button class="time-slot">16:00</button>
                <button class="time-slot">17:00</button>
                <button class="time-slot">18:00</button>
            </div>
        </div>
        <div class="selected-datetime">
            <p>Fecha y hora seleccionada: <span id="selected-date">No seleccionada</span></p>
        </div>
    `;
    
    calendarWrapper.innerHTML = calendarHTML;
    
    // Variables para el calendario
    let activeMonth = currentMonth;
    let activeYear = currentYear;
    const calendarDaysElement = calendarWrapper.querySelector('.calendar-days');
    const prevMonthBtn = calendarWrapper.querySelector('.prev-month');
    const nextMonthBtn = calendarWrapper.querySelector('.next-month');
    const currentMonthElement = calendarWrapper.querySelector('.current-month');
    const selectedDateElement = calendarWrapper.querySelector('#selected-date');
    
    // Función para generar los días del mes
    function generateCalendarDays(month, year) {
        calendarDaysElement.innerHTML = '';
        
        // Primer día del mes (0 = Domingo, 1 = Lunes, etc.)
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        
        // Último día del mes
        const lastDay = new Date(year, month + 1, 0).getDate();
        
        // Días del mes anterior para rellenar la primera semana
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        
        // Fecha actual
        const today = new Date();
        
        // Días del mes anterior
        for (let i = 0; i < firstDayOfMonth; i++) {
            const dayDiv = document.createElement('div');
            dayDiv.classList.add('day', 'prev-month-day');
            dayDiv.textContent = prevMonthLastDay - (firstDayOfMonth - i - 1);
            calendarDaysElement.appendChild(dayDiv);
        }
        
        // Días del mes actual
        for (let i = 1; i <= lastDay; i++) {
            const dayDiv = document.createElement('div');
            dayDiv.classList.add('day');
            dayDiv.textContent = i;
            
            // Marcar día actual
            if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                dayDiv.classList.add('today');
            }
            
            // No permitir seleccionar días pasados
            const dayDate = new Date(year, month, i);
            if (dayDate < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
                dayDiv.classList.add('disabled');
            } else {
                dayDiv.addEventListener('click', function() {
                    // Deseleccionar día previamente seleccionado
                    const selectedDay = calendarDaysElement.querySelector('.selected');
                    if (selectedDay) {
                        selectedDay.classList.remove('selected');
                    }
                    
                    // Seleccionar este día
                    this.classList.add('selected');
                    
                    // Actualizar fecha seleccionada
                    const selectedTimeSlot = calendarWrapper.querySelector('.time-slot.selected');
                    if (selectedTimeSlot) {
                        selectedDateElement.textContent = `${i} de ${monthNames[month]} de ${year} a las ${selectedTimeSlot.textContent}`;
                    } else {
                        selectedDateElement.textContent = `${i} de ${monthNames[month]} de ${year} (selecciona una hora)`;
                    }
                });
            }
            
            calendarDaysElement.appendChild(dayDiv);
        }
        
        // Calcular cuántos días del próximo mes necesitamos para completar la vista
        const totalCells = 42; // 6 filas x 7 columnas
        const remainingCells = totalCells - (firstDayOfMonth + lastDay);
        
        // Días del mes siguiente
        for (let i = 1; i <= remainingCells; i++) {
            const dayDiv = document.createElement('div');
            dayDiv.classList.add('day', 'next-month-day');
            dayDiv.textContent = i;
            calendarDaysElement.appendChild(dayDiv);
        }
    }
    
    // Función para cambiar de mes
    function changeMonth(direction) {
        if (direction === 'prev') {
            activeMonth--;
            if (activeMonth < 0) {
                activeMonth = 11;
                activeYear--;
            }
        } else {
            activeMonth++;
            if (activeMonth > 11) {
                activeMonth = 0;
                activeYear++;
            }
        }
        
        currentMonthElement.textContent = `${monthNames[activeMonth]} ${activeYear}`;
        generateCalendarDays(activeMonth, activeYear);
    }
    
    // Event listeners para botones de mes
    prevMonthBtn.addEventListener('click', () => changeMonth('prev'));
    nextMonthBtn.addEventListener('click', () => changeMonth('next'));
    
    // Event listeners para selección de hora
    const timeSlots = calendarWrapper.querySelectorAll('.time-slot');
    timeSlots.forEach(slot => {
        slot.addEventListener('click', function() {
            // Deseleccionar hora previamente seleccionada
            const selectedTimeSlot = calendarWrapper.querySelector('.time-slot.selected');
            if (selectedTimeSlot) {
                selectedTimeSlot.classList.remove('selected');
            }
            
            // Seleccionar esta hora
            this.classList.add('selected');
            
            // Actualizar fecha y hora seleccionada
            const selectedDay = calendarDaysElement.querySelector('.selected');
            if (selectedDay) {
                const day = selectedDay.textContent;
                selectedDateElement.textContent = `${day} de ${monthNames[activeMonth]} de ${activeYear} a las ${this.textContent}`;
            }
        });
    });
    
    // Generar días iniciales
    generateCalendarDays(activeMonth, activeYear);
}

// Formulario de contacto
function setupContactForm() {
    if (!contactForm) return;
    
    // Si el formulario está usando FormSubmit, no necesitamos procesarlo aquí
    if (contactForm.action && contactForm.action.includes('formsubmit.co')) {
        return;
    }
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Aquí normalmente se enviarían los datos del formulario
        // Pero para esta demo, solo mostraremos el modal de confirmación
        
        // Mostrar modal de confirmación
        confirmationModal.style.display = 'flex';
    });
    
    // Cerrar modal con el botón de cerrar
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            confirmationModal.style.display = 'none';
        });
    }
    
    // Cerrar modal con el botón de aceptar
    if (modalBtn) {
        modalBtn.addEventListener('click', () => {
            confirmationModal.style.display = 'none';
        });
    }
    
    // Cerrar modal al hacer clic fuera del contenido
    if (confirmationModal) {
        confirmationModal.addEventListener('click', (e) => {
            if (e.target === confirmationModal) {
                confirmationModal.style.display = 'none';
            }
        });
    }
}

// Función mejorada para scroll suave
function setupSmoothScroll() {
    // Manejar el CTA del banner específicamente
    const bannerCTA = document.getElementById('bannerCTA');
    if (bannerCTA) {
        bannerCTA.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = document.querySelector('#beneficios');
            if (targetSection) {
                const navbarHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }

    // Manejar otros enlaces de navegación suave
    document.querySelectorAll('a[href^="#"]:not(#bannerCTA)').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navbarHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Inicializar la aplicación cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar componentes existentes
    setupCountdown();
    setupMobileMenu();
    setupNavbar();
    
    if (testimonialCards && testimonialCards.length > 0) {
        setupTestimonialFade();
    }
    
    if (calendarWrapper) {
        setupCalendar();
    }
    
    if (contactForm) {
        setupContactForm();
    }
    
    setupSmoothScroll();
    
    // Inicializar el chatbot
    initChatbot();
    
    // Verificar consentimiento de cookies
    checkCookieConsent();
    
    // Eliminar botón scrollTopBtn
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
        scrollTopBtn.remove();
    }
});

// Inicializar el chatbot
function initChatbot() {
    chatbotToggleBtn = document.getElementById('chatbot-toggle');
    chatbotContainer = document.getElementById('chatbot-container');
    chatbotMessages = document.getElementById('chatbot-messages');
    chatbotInput = document.getElementById('chatbot-input');
    chatbotSendBtn = document.getElementById('chatbot-send');
    chatbotCloseBtn = document.getElementById('chatbot-close');
    
    if (!chatbotToggleBtn || !chatbotContainer || !chatbotMessages || !chatbotInput || !chatbotSendBtn || !chatbotCloseBtn) {
        console.error('No se encontraron elementos del chatbot');
        return;
    }
    
    // Agregar event listeners
    chatbotToggleBtn.addEventListener('click', () => toggleChatbot(chatbotContainer, chatbotMessages));
    chatbotSendBtn.addEventListener('click', () => handleSendMessage(chatbotInput, chatbotMessages));
    chatbotCloseBtn.addEventListener('click', () => toggleChatbot(chatbotContainer, chatbotMessages));
    
    // Event listener para la tecla Enter en el input
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSendMessage(chatbotInput, chatbotMessages);
        }
    });
}

// Alternar la visibilidad del chatbot
function toggleChatbot(chatbotContainer, chatbotMessages) {
    chatbotOpen = !chatbotOpen;
    
    if (chatbotOpen) {
        chatbotContainer.style.display = 'flex';
        setTimeout(() => {
            chatbotContainer.style.opacity = '1';
            chatbotContainer.style.transform = 'translateY(0)';
            
            // Mostrar mensaje de bienvenida si es la primera vez
            if (chatbotMessages.children.length === 0) {
                showWelcomeMessage();
            }
            
            // Enfocar el input para facilitar la escritura
            document.getElementById('chatbot-input').focus();
        }, 50);
    } else {
        chatbotContainer.style.opacity = '0';
        chatbotContainer.style.transform = 'translateY(20px)';
        setTimeout(() => {
            chatbotContainer.style.display = 'none';
        }, 300);
    }
}

// Manejar el envío de mensajes
function handleSendMessage(chatbotInput, chatbotMessages) {
    const message = chatbotInput.value.trim();
    
    if (message === '') return;
    
    // Añadir mensaje del usuario
    addUserMessage(message, chatbotMessages);
    
    // Limpiar el input
    chatbotInput.value = '';
    
    // Mostrar indicador de escritura
    showTypingIndicator(chatbotMessages);
    
    // Procesar la respuesta (simulación de tiempo de respuesta)
    setTimeout(() => {
        hideTypingIndicator();
        
        // Procesar la consulta del usuario
        processUserMessage(message, chatbotMessages);
    }, 1000);
}

// Procesar mensaje del usuario
function processUserMessage(message, chatbotMessages) {
    message = message.toLowerCase();
    
    // Mostrar indicador de escritura
    showTypingIndicator(chatbotMessages);
    
    setTimeout(() => {
        hideTypingIndicator();
        
        if (message.includes('servicio') || message.includes('que hace') || message.includes('qué hace') || message.includes('ofrece') || message.includes('desarrollo') || message.includes('web') || message.includes('seo') || message.includes('redes')) {
            showServicesInfo(chatbotMessages);
        } else if (message.includes('precio') || message.includes('costo') || message.includes('plan') || message.includes('valor') || message.includes('cuánto') || message.includes('pago') || message.includes('299') || message.includes('599') || message.includes('premium') || message.includes('pro') || message.includes('business')) {
            showPricingInfo(chatbotMessages);
        } else if (message.includes('beneficio') || message.includes('ventaja') || message.includes('por qué') || message.includes('porqué') || message.includes('elegir') || message.includes('mejor') || message.includes('diferencia')) {
            showBenefitsInfo(chatbotMessages);
        } else if (message.includes('contacto') || message.includes('hablar') || message.includes('asesor') || message.includes('llamar') || message.includes('whatsapp') || message.includes('consulta') || message.includes('teléfono') || message.includes('email') || message.includes('correo')) {
            showContactInfo(chatbotMessages);
        } else if (message.includes('hola') || message.includes('buenas') || message.includes('saludos') || message.includes('tal') || message.includes('ayuda')) {
            // Saludos
            addBotMessageWithDelay('👋 ¡Hola! Estoy aquí para ayudarte con todo lo que necesites saber sobre nuestros servicios de marketing digital. ¿En qué puedo asistirte hoy?', chatbotMessages).then(() => {
                setTimeout(() => {
                    showMainOptions(chatbotMessages);
                }, 5000);
            });
        } else if (message.includes('gracias') || message.includes('thank') || message.includes('ok') || message.includes('perfecto')) {
            // Agradecimientos
            addBotMessageWithDelay('¡Ha sido un placer ayudarte! Si tienes más preguntas en el futuro, no dudes en contactarnos. Estamos aquí para ayudarte a impulsar tu negocio. 😊', chatbotMessages).then(() => {
                addBotMessageWithDelay('¿Hay algo más en lo que pueda ayudarte hoy?', chatbotMessages).then(() => {
                    setTimeout(() => {
                        showMainOptions(chatbotMessages);
                    }, 5000);
                });
            });
        } else {
            // Respuesta genérica
            addBotMessageWithDelay('Entiendo tu interés. Para ofrecerte la información más relevante, ¿podrías indicarme qué aspecto de nuestros servicios te interesa más?', chatbotMessages).then(() => {
                // Mostrar opciones principales
                setTimeout(() => {
                    showMainOptions(chatbotMessages);
                }, 5000);
            });
        }
    }, 1500);
}

// Cookie Consent Functions
function checkCookieConsent() {
    const cookieConsent = document.getElementById('cookieConsent');
    if (cookieConsent && !localStorage.getItem('cookiesAccepted')) {
        cookieConsent.style.display = 'block';
    }
}

function acceptCookies() {
    document.getElementById('cookieConsent').style.display = 'none';
    localStorage.setItem('cookiesAccepted', 'true');
}

function rejectCookies() {
    document.getElementById('cookieConsent').style.display = 'none';
    localStorage.setItem('cookiesAccepted', 'false');
}

// Función para mostrar el indicador de escritura
function showTypingIndicator(chatbotMessages) {
    // Eliminar el indicador existente si hay alguno
    hideTypingIndicator();
    
    // Crear nuevo indicador
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'typing-indicator';
    typingIndicator.id = 'typing-indicator';
    
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.className = 'typing-dot';
        typingIndicator.appendChild(dot);
    }
    
    chatbotMessages.appendChild(typingIndicator);
    scrollToBottom(chatbotMessages);
    
    return typingIndicator;
}

// Función para ocultar el indicador de escritura
function hideTypingIndicator() {
    const existingIndicator = document.getElementById('typing-indicator');
    if (existingIndicator && existingIndicator.parentNode) {
        existingIndicator.parentNode.removeChild(existingIndicator);
    }
}

function addUserMessage(message, chatbotMessages) {
    const messageElement = document.createElement('div');
    messageElement.className = 'chatbot-message user';
    messageElement.textContent = message;
    
    chatbotMessages.appendChild(messageElement);
    scrollToBottom(chatbotMessages);
}

function addBotMessage(message, chatbotMessages) {
    const messageElement = document.createElement('div');
    messageElement.className = 'chatbot-message bot';
    messageElement.innerHTML = message;
    
        chatbotMessages.appendChild(messageElement);
    scrollToBottom(chatbotMessages);
}

function scrollToBottom(chatbotMessages) {
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// Estilos para el chatbot
const chatbotStyles = document.createElement('style');
chatbotStyles.textContent = `
    .typing-indicator {
        display: flex;
        align-items: center;
        background-color: #f0f0f0;
        border-radius: 18px;
        padding: 8px 12px;
        max-width: 100px;
        margin-bottom: 10px;
        align-self: flex-start;
    }
    
    .typing-dot {
        width: 8px;
        height: 8px;
        background-color: #999;
        border-radius: 50%;
        margin: 0 3px;
        animation: typing 1.4s infinite ease-in-out both;
    }
    
    .typing-dot:nth-child(1) { animation-delay: 0s; }
    .typing-dot:nth-child(2) { animation-delay: 0.2s; }
    .typing-dot:nth-child(3) { animation-delay: 0.4s; }
    
    @keyframes typing {
        0%, 80%, 100% { transform: scale(0.7); opacity: 0.5; }
        40% { transform: scale(1); opacity: 1; }
    }
    
    .chatbot-message {
        border-radius: 18px;
        padding: 12px 16px;
        margin-bottom: 10px;
        max-width: 85%;
        word-wrap: break-word;
        line-height: 1.5;
        animation: fadeIn 0.3s ease;
    }
    
    .chatbot-message.bot {
        background-color: #f0f0f0;
        color: #333;
        align-self: flex-start;
        border-bottom-left-radius: 4px;
    }
    
    .chatbot-message.user {
        background: linear-gradient(135deg, #003366, #0066cc);
        color: white;
        align-self: flex-end;
        border-bottom-right-radius: 4px;
    }
    
    .chatbot-message a {
        color: #0066cc;
        text-decoration: none;
        font-weight: 500;
    }
    
    .chatbot-message a:hover {
        text-decoration: underline;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .chatbot-container {
        box-shadow: 0 5px 30px rgba(0, 0, 0, 0.25);
    }
    
    .chatbot-toggle {
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        background: linear-gradient(135deg, #003366, #0066cc);
    }
    
    .chatbot-toggle:hover {
        transform: scale(1.1);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
    }
`;

document.head.appendChild(chatbotStyles);

// Función para eliminar welcomePopup
function removeWelcomePopup() {
    const welcomePopup = document.getElementById('welcomePopup');
    if (welcomePopup && welcomePopup.parentNode) {
        welcomePopup.parentNode.removeChild(welcomePopup);
    }
    
    // Eliminar también el mensaje breve si existe
    const briefMessage = document.getElementById('chat-brief-message');
    if (briefMessage && briefMessage.parentNode) {
        briefMessage.parentNode.removeChild(briefMessage);
    }
}

// Añadir estilos para los puntos de escritura
const typingStyles = document.createElement('style');
typingStyles.textContent = `
    .typing-dot {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: #ccc;
        margin: 0 3px;
        animation: typing 1.4s infinite ease-in-out both;
    }
    .typing-dot:nth-child(1) {
        animation-delay: 0s;
    }
    .typing-dot:nth-child(2) {
        animation-delay: 0.2s;
    }
    .typing-dot:nth-child(3) {
        animation-delay: 0.4s;
    }
    @keyframes typing {
        0%, 80%, 100% { transform: scale(0.7); opacity: 0.5; }
        40% { transform: scale(1); opacity: 1; }
    }
`;
document.head.appendChild(typingStyles);

// Restaurar la función handleOptionClick que falta
function handleOptionClick(option, buttonElement) {
    const chatbotMessages = document.getElementById('chatbot-messages');
    if (!chatbotMessages) return;

    // Simular un mensaje del usuario
    addUserMessage(option, chatbotMessages);
    
    // Mostrar indicador de escritura tras un breve retraso
    setTimeout(() => {
        // Procesar la opción seleccionada
        if (option.includes('Servicios')) {
            showServicesInfo(chatbotMessages);
        } else if (option.includes('Planes') || option.includes('Precios')) {
            showPricingInfo(chatbotMessages);
        } else if (option.includes('Beneficios')) {
            showBenefitsInfo(chatbotMessages);
        } else if (option.includes('Contacto')) {
            showContactInfo(chatbotMessages);
        }
    }, 500);
}

// Función modificada para añadir opciones con botones
function addOptionsButtons(options) {
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'chatbot-options';
    optionsContainer.style.display = 'flex';
    optionsContainer.style.flexWrap = 'wrap';
    optionsContainer.style.gap = '10px';
    optionsContainer.style.marginTop = '10px';
    
    options.forEach(option => {
        const button = document.createElement('button');
        button.className = 'chatbot-option-button';
        button.innerHTML = option.text;
        button.style.backgroundColor = '#f0f2f5';
        button.style.border = 'none';
        button.style.borderRadius = '18px';
        button.style.padding = '8px 15px';
        button.style.margin = '5px 0';
        button.style.cursor = 'pointer';
        button.style.transition = 'background-color 0.3s';
        button.style.fontSize = '14px';
        button.style.color = '#303030';
        
        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = '#e4e6eb';
        });
        
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = '#f0f2f5';
        });
        
        button.addEventListener('click', () => {
            // Añadir mensaje del usuario seleccionando esta opción
            addUserMessage(option.text);
            
            // Ejecutar el handler correspondiente
            if (typeof option.handler === 'function') {
                option.handler();
            }
        });
        
        optionsContainer.appendChild(button);
    });
    
    // Añadir opciones al contenedor de mensajes
    const messagesContainer = document.getElementById('chatbot-messages');
    const botMessageElement = document.createElement('div');
    botMessageElement.className = 'chatbot-message bot';
    botMessageElement.appendChild(optionsContainer);
    messagesContainer.appendChild(botMessageElement);
    
    // Scroll al final
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}