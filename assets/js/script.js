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
                description: "Sitios web profesionales y optimizados",
                features: ["Diseño Responsive", "SEO Optimizado", "Alto Rendimiento", "Diseño UX/UI"]
            },
            {
                name: "Landing Pages",
                description: "Landing pages optimizadas para conversión",
                features: ["Alto Ratio de Conversión", "A/B Testing", "CTA Optimizados", "Análisis de Datos"]
            },
            {
                name: "Marketing Digital",
                description: "Estrategias personalizadas para tu negocio",
                features: ["Análisis de mercado", "Estrategia personalizada", "Optimización continua", "Reportes mensuales"]
            }
        ]
    },
    beneficios: {
        title: "Nuestros Beneficios",
        items: [
            {
                name: "ROI Garantizado",
                description: "+150% ROI promedio en campañas",
                features: ["Métricas en tiempo real", "Optimización continua", "Reportes detallados"]
            },
            {
                name: "Tecnología IA",
                description: "Optimización automática 24/7",
                features: ["Automatización inteligente", "Análisis predictivo", "Decisiones basadas en datos"]
            },
            {
                name: "Respuesta Rápida",
                description: "Atención en menos de 24 horas",
                features: ["Soporte prioritario", "Atención personalizada", "Seguimiento continuo"]
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
        ]
    }
};

// Variable para controlar si ya se mostró el saludo
let welcomeMessageShown = false;

// Función para mostrar el mensaje de bienvenida al abrir el chat
function showWelcomeMessage() {
    addBotMessage('👋 ¡Hola! Soy el asistente virtual de SPMarketing. ¿En qué puedo ayudarte hoy?');
    
    // Mostrar opciones principales después de un breve retraso
    setTimeout(() => {
        showMainOptions();
    }, 500);
}

// Función para mostrar las opciones principales
function showMainOptions() {
    const options = [
        { text: "💻 Servicios", description: "Conoce nuestras soluciones" },
        { text: "💰 Planes y Precios", description: "Planes adaptados a tu negocio" },
        { text: "✨ Beneficios", description: "¿Por qué elegirnos?" },
        { text: "📱 Contacto", description: "Habla con un asesor" }
    ];
    
    const optionsHTML = `
        <div class="chat-options-container" style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px;">
            ${options.map(option => `
                <button class="option-button" onclick="handleOptionClick('${option.text}')" style="background-color: #f0f0f0; border: none; border-radius: 8px; padding: 8px 12px; cursor: pointer; text-align: left; min-width: 120px; transition: all 0.2s ease;">
                    <div style="font-weight: 500; font-size: 14px;">${option.text}</div>
                    <div style="font-size: 12px; opacity: 0.8;">${option.description}</div>
                </button>
            `).join('')}
        </div>
    `;
    
    const optionsElement = document.createElement('div');
    optionsElement.className = 'chatbot-message bot';
    optionsElement.innerHTML = optionsHTML;
    
    const chatbotMessages = document.getElementById('chatbot-messages');
    if (chatbotMessages) {
        chatbotMessages.appendChild(optionsElement);
        scrollToBottom();
    }
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
    // El CTA del banner ha sido eliminado, por lo que ya no necesitamos manejarlo específicamente
    
    // Manejar enlaces de navegación suave
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
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
    chatbotToggleBtn.addEventListener('click', toggleChatbot);
    chatbotSendBtn.addEventListener('click', handleSendMessage);
    chatbotCloseBtn.addEventListener('click', toggleChatbot);
    
    // Event listener para la tecla Enter en el input
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    });
}

// Alternar la visibilidad del chatbot
function toggleChatbot() {
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
            
            // Enfocar el input
            chatbotInput.focus();
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
function handleSendMessage() {
    const message = chatbotInput.value.trim();
    
    if (message === '') return;
    
    // Añadir mensaje del usuario
    addUserMessage(message);
    
    // Limpiar el input
    chatbotInput.value = '';
    
    // Mostrar indicador de escritura
    showTypingIndicator();
    
    // Procesar la respuesta (simulación de tiempo de respuesta)
    setTimeout(() => {
        hideTypingIndicator();
        
        // Procesar la consulta del usuario
        processUserMessage(message);
    }, 1000);
}

// Procesar mensaje del usuario
function processUserMessage(message) {
    message = message.toLowerCase();
    
    if (message.includes('servicio') || message.includes('que hace') || message.includes('qué hace')) {
        showServicesInfo();
    } else if (message.includes('precio') || message.includes('costo') || message.includes('plan') || message.includes('valor') || message.includes('cuánto')) {
        showPricingInfo();
    } else if (message.includes('beneficio') || message.includes('ventaja') || message.includes('por qué elegir')) {
        showBenefitsInfo();
    } else if (message.includes('contacto') || message.includes('hablar') || message.includes('asesor') || message.includes('llamar')) {
        showContactInfo();
    } else {
        // Respuesta genérica
        addBotMessage('Disculpa, no he entendido bien tu consulta. ¿Puedo ayudarte con información sobre nuestros servicios, precios, beneficios o para contactar con un asesor?');
        
        // Mostrar opciones principales
        setTimeout(() => {
            showMainOptions();
        }, 500);
    }
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

// Función para mostrar información sobre servicios
function showServicesInfo() {
    let message = `<strong>Nuestros servicios principales:</strong><br><br>`;
    message += `• <strong>Desarrollo Web 💻</strong>: Sitios web profesionales optimizados para convertir visitas en clientes.<br><br>`;
    message += `• <strong>Landing Pages 🚀</strong>: Páginas de aterrizaje para campañas específicas con alto ratio de conversión.<br><br>`;
    message += `• <strong>Marketing Digital 📊</strong>: Estrategias personalizadas para potenciar tu presencia online.<br><br>`;
    
    // Agregar botones CTA
    const buttonsHTML = `
        <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px;">
            <a href="precios.html" class="chatbot-cta-btn" style="text-decoration: none; background-color: #0084ff; color: white; padding: 8px 15px; border-radius: 20px; font-size: 13px; text-align: center; min-width: 100px;">Ver Precios</a>
            <button onclick="handleOptionClick('Contacto')" class="chatbot-cta-btn" style="background-color: #e0e0e0; color: #333; padding: 8px 15px; border-radius: 20px; border: none; font-size: 13px; cursor: pointer; min-width: 100px;">Contactar</button>
        </div>
    `;
    
    addBotMessage(message + buttonsHTML);
}

// Función para mostrar información sobre precios
function showPricingInfo() {
    let message = `<strong>Nuestros planes:</strong><br><br>`;
    message += `• <strong>Plan Básico 🔹</strong>: Ideal para pequeños negocios desde €300/mes.<br><br>`;
    message += `• <strong>Plan Premium 🔷</strong>: Optimizado para empresas en crecimiento desde €600/mes.<br><br>`;
    message += `• <strong>Plan Enterprise 💎</strong>: Soluciones avanzadas para grandes empresas. Precio personalizado.<br><br>`;
    message += `Todos nuestros planes incluyen <strong>consulta inicial GRATUITA</strong> sin compromiso.<br><br>`;
    
    // Agregar botones CTA
    const buttonsHTML = `
        <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px;">
            <a href="precios.html" class="chatbot-cta-btn" style="text-decoration: none; background-color: #0084ff; color: white; padding: 8px 15px; border-radius: 20px; font-size: 13px; text-align: center; min-width: 100px;">Ver Detalles</a>
            <button onclick="handleOptionClick('Contacto')" class="chatbot-cta-btn" style="background-color: #e0e0e0; color: #333; padding: 8px 15px; border-radius: 20px; border: none; font-size: 13px; cursor: pointer; min-width: 100px;">Consulta Gratis</button>
        </div>
    `;
    
    addBotMessage(message + buttonsHTML);
}

// Función para mostrar información sobre beneficios
function showBenefitsInfo() {
    let message = `<strong>Por qué elegirnos:</strong><br><br>`;
    message += `• <strong>ROI Garantizado 📈</strong>: +150% ROI promedio en nuestras campañas.<br><br>`;
    message += `• <strong>Tecnología IA 🤖</strong>: Optimización automática 24/7 de tus campañas.<br><br>`;
    message += `• <strong>Respuesta Rápida ⚡</strong>: Atención personalizada en menos de 24 horas.<br><br>`;
    message += `• <strong>Sin Permanencia 🔓</strong>: Sin contratos de permanencia ni compromisos a largo plazo.<br><br>`;
    
    // Agregar botones CTA
    const buttonsHTML = `
        <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px;">
            <button onclick="handleOptionClick('Servicios')" class="chatbot-cta-btn" style="background-color: #e0e0e0; color: #333; padding: 8px 15px; border-radius: 20px; border: none; font-size: 13px; cursor: pointer; min-width: 100px;">Ver Servicios</button>
            <button onclick="handleOptionClick('Contacto')" class="chatbot-cta-btn" style="background-color: #0084ff; color: white; padding: 8px 15px; border-radius: 20px; border: none; font-size: 13px; cursor: pointer; min-width: 100px;">Hablar con Asesor</button>
        </div>
    `;
    
    addBotMessage(message + buttonsHTML);
}

// Función para mostrar información de contacto
function showContactInfo() {
    let message = `<strong>¿Quieres hablar con un asesor?</strong><br><br>`;
    message += `• <strong>Teléfono ☎️</strong>: +34 666 777 888<br><br>`;
    message += `• <strong>Email 📧</strong>: info@spmarketing.es<br><br>`;
    message += `• <strong>Horario 🕒</strong>: Lunes a Viernes de 9:00 a 18:00<br><br>`;
    
    // Agregar botones CTA
    const buttonsHTML = `
        <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px;">
            <a href="#contactForm" onclick="document.getElementById('chatbot-container').style.display='none';" class="chatbot-cta-btn" style="text-decoration: none; background-color: #0084ff; color: white; padding: 8px 15px; border-radius: 20px; font-size: 13px; text-align: center; min-width: 100px;">Formulario Contacto</a>
            <a href="tel:+34666777888" class="chatbot-cta-btn" style="text-decoration: none; background-color: #e0e0e0; color: #333; padding: 8px 15px; border-radius: 20px; font-size: 13px; text-align: center; min-width: 100px;">Llamar Ahora</a>
        </div>
    `;
    
    addBotMessage(message + buttonsHTML);
}

// Función para manejar clics en opciones
function handleOptionClick(option) {
    console.log("Opción seleccionada:", option);
    addUserMessage(option);
        
        // Mostrar indicador de "escribiendo..."
        showTypingIndicator();
        
    // Procesar la opción seleccionada
        setTimeout(() => {
            hideTypingIndicator();
            
        if (option.includes("Servicios")) {
            showServicesInfo();
        } 
        else if (option.includes("Planes") || option.includes("Precios")) {
            showPricingInfo();
        }
        else if (option.includes("Beneficios")) {
            showBenefitsInfo();
        }
        else if (option.includes("Contacto")) {
            showContactInfo();
        }
        else {
            // Si no coincide con ninguna opción predefinida
            sendMessage(option);
        }
    }, 1000);
}

// Función para mostrar saludo inicial
function showChatGreeting() {
    console.log("Mostrando saludo del chat...");
    
    if (chatbotMessages && chatbotMessages.children.length === 0) {
        // Solo mostrar el saludo si no hay mensajes ya
        addBotMessage('👋 ¡Hola! Soy el asistente virtual de SPMarketing. ¿En qué puedo ayudarte hoy?');
        
        // Mostrar opciones principales después de un breve retraso
        setTimeout(() => {
            showMainOptions();
        }, 500);
    }
}

// Función para mostrar el indicador de escritura
function showTypingIndicator() {
    const typingElement = document.createElement('div');
    typingElement.className = 'typing-indicator';
    typingElement.id = 'typing-indicator';
    typingElement.innerHTML = `
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
    `;
    
    // Agregar al contenedor de mensajes
    const chatbotMessages = document.getElementById('chatbot-messages');
    if (chatbotMessages) {
        chatbotMessages.appendChild(typingElement);
        scrollToBottom();
    }
}

// Función para ocultar el indicador de escritura
function hideTypingIndicator() {
    const typingElement = document.getElementById('typing-indicator');
    if (typingElement && typingElement.parentNode) {
        typingElement.parentNode.removeChild(typingElement);
    }
}

// Función para añadir un mensaje del bot con animación
function addBotMessage(message) {
    // Crear elemento de mensaje
    const messageElement = document.createElement('div');
    messageElement.className = 'chatbot-message bot';
    
    // Formatear mensaje con Markdown simple
    let formattedMessage = message
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')  // Negrita con **texto**
        .replace(/\*(.*?)\*/g, '<em>$1</em>')             // Cursiva con *texto*
        .replace(/__(.*?)__/g, '<u>$1</u>')               // Subrayado con __texto__
        .replace(/\n/g, '<br>');                          // Saltos de línea
    
    // Establecer el contenido HTML
    messageElement.innerHTML = formattedMessage;
    
    // Agregar mensaje al contenedor
    const chatbotMessages = document.getElementById('chatbot-messages');
    if (chatbotMessages) {
        chatbotMessages.appendChild(messageElement);
        
        // Animar la entrada del mensaje
        messageElement.style.animation = 'fadeIn 0.3s ease';
        
        // Desplazar hacia abajo
        scrollToBottom();
    }
}

// Función para añadir un mensaje del usuario
function addUserMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'chatbot-message user';
    messageElement.textContent = message;
    
    const chatbotMessages = document.getElementById('chatbot-messages');
    if (chatbotMessages) {
        chatbotMessages.appendChild(messageElement);
        scrollToBottom();
    }
}

// Función para desplazar hacia abajo la conversación
function scrollToBottom() {
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// Estilos adicionales para el diseño moderno
const styles = document.createElement('style');
styles.textContent = `
    .modern-style {
        border-radius: 20px;
        background: linear-gradient(145deg, #ffffff, #f5f5f5);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    }

    .chatbot-cta-btn.modern {
        width: 100%;
        padding: 15px 20px;
        margin: 8px 0;
        border: none;
        border-radius: 12px;
        background: linear-gradient(145deg, var(--primary-color), var(--accent-color));
        color: white;
        cursor: pointer;
        transition: all 0.3s ease;
        text-align: left;
        display: flex;
        flex-direction: column;
    }

    .chatbot-cta-btn.modern:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    }

    .cta-text {
        font-size: 1.1em;
        font-weight: 600;
        margin-bottom: 5px;
    }

    .cta-description {
        font-size: 0.9em;
        opacity: 0.9;
    }

    .chatbot-icon.modern {
        width: 60px;
        height: 60px;
        border-radius: 30px;
        background: linear-gradient(145deg, var(--primary-color), var(--accent-color));
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        position: fixed;
        bottom: 30px;
        right: 30px;
        z-index: 1000;
    }

    .chatbot-icon.modern:hover {
        transform: scale(1.1);
    }

    .chatbot-icon.modern i {
        color: white;
        font-size: 24px;
    }
`;

document.head.appendChild(styles);

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

// Función para procesar el mensaje del usuario y enviar una respuesta
function sendMessage(message) {
    console.log("Procesando mensaje del usuario:", message);
    
    // Convertir a minúsculas para facilitar la comparación
    const messageLC = message.toLowerCase();
    
    // Detectar intenciones basadas en palabras clave
    if (messageLC.includes('servicio') || messageLC.includes('ofrece') || messageLC.includes('haces')) {
        showServicesInfo();
    } 
    else if (messageLC.includes('precio') || messageLC.includes('costo') || messageLC.includes('plan') || messageLC.includes('valor')) {
        showPricingInfo();
    }
    else if (messageLC.includes('beneficio') || messageLC.includes('ventaja') || messageLC.includes('por qué') || messageLC.includes('conviene')) {
        showBenefitsInfo();
    }
    else if (messageLC.includes('contrato') || messageLC.includes('contacto') || messageLC.includes('hablar') || messageLC.includes('asesor') || messageLC.includes('comunic')) {
        showContactInfo();
    }
    else {
        // Respuesta genérica si no se detecta una intención clara
        addBotMessage(`Parece que estás interesado en nuestros servicios. ¿En qué puedo ayudarte?`);
        
        // Mostrar opciones principales
        setTimeout(() => {
            showMainOptions();
        }, 500);
    }
}

// Añadir estilos para las animaciones
function addChatAnimationStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(-20px); }
        }
    `;
    document.head.appendChild(styleElement);
}

// Añadir estilos para las animaciones del chatbot
const styles = document.createElement('style');
styles.textContent = `
    .chatbot-message {
        max-width: 80%;
        padding: 12px 16px;
        margin-bottom: 10px;
        border-radius: 15px;
        animation: fadeIn 0.3s;
        line-height: 1.4;
        word-wrap: break-word;
    }
    
    .chatbot-message.user {
        background-color: #0084ff;
        color: white;
        align-self: flex-end;
        border-bottom-right-radius: 5px;
        margin-left: auto;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
    
    .chatbot-message.bot {
        background-color: #f1f1f1;
        color: #333;
        align-self: flex-start;
        border-bottom-left-radius: 5px;
        margin-right: auto;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;

document.head.appendChild(styles);

// Función para añadir estilos del indicador de escritura
function addTypingIndicatorStyles() {
    // Verificar si ya existe
    if (document.getElementById('typing-indicator-styles')) {
        return;
    }
    
    // Crear elemento de estilo
    const styleElement = document.createElement('style');
    styleElement.id = 'typing-indicator-styles';
    
    // Definir los estilos
    styleElement.textContent = `
        .typing-indicator {
            display: flex;
            align-items: center;
            background-color: #f0f0f0;
            border-radius: 18px;
            padding: 8px 12px;
            max-width: 100px;
            margin-bottom: 10px;
        }
        
        .typing-dot {
            width: 8px;
            height: 8px;
            background-color: #999;
            border-radius: 50%;
            margin: 0 2px;
            animation: typing-animation 1.4s infinite;
            opacity: 0.6;
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
        
        @keyframes typing-animation {
            0%, 60%, 100% {
                transform: translateY(0);
            }
            30% {
                transform: translateY(-5px);
            }
        }
        
        .chatbot-message {
            border-radius: 18px;
            padding: 10px 14px;
            margin-bottom: 10px;
            max-width: 80%;
            word-wrap: break-word;
            animation: fadeIn 0.3s ease;
        }
        
        .chatbot-message.bot {
            background-color: #f0f0f0;
            color: #333;
            align-self: flex-start;
            margin-right: auto;
            border-bottom-left-radius: 4px;
        }
        
        .chatbot-message.user {
            background-color: #0084ff;
            color: white;
            align-self: flex-end;
            margin-left: auto;
            border-bottom-right-radius: 4px;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        #chatbot-messages {
            display: flex;
            flex-direction: column;
            overflow-y: auto;
        }
    `;
    
    // Añadir al documento
    document.head.appendChild(styleElement);
}