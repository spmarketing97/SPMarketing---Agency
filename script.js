// Variables globales
const hamburger = document.getElementById('hamburger');
const menu = document.getElementById('menu');
const navbar = document.getElementById('navbar');
const countdownElement = document.getElementById('countdown');
const minutesElement = document.getElementById('minutos');
const secondsElement = document.getElementById('segundos');
const testimonialTrack = document.querySelector('.testimonial-track');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const contactForm = document.getElementById('contactForm');
const confirmationModal = document.getElementById('confirmationModal');
const closeModal = document.querySelector('.close-modal');
const modalBtn = document.querySelector('.modal-btn');
const calendarWrapper = document.getElementById('calendar');
const testimonialCards = document.querySelectorAll('.testimonial-card');
const scrollTopBtn = document.getElementById('scrollTopBtn');

// Función para el reloj regresivo
function setupCountdown() {
    // Verificar si hay un tiempo guardado en localStorage y si ha caducado
    let countdownTime = localStorage.getItem('countdownTime');
    let lastReset = localStorage.getItem('lastResetTime');
    const now = new Date().getTime();
    
    // Si el contador está a 0 por más de 5 días, reiniciarlo
    if (countdownTime && lastReset && (now - parseInt(lastReset)) > 5 * 24 * 60 * 60 * 1000 && parseInt(countdownTime) <= 0) {
        countdownTime = 25 * 60; // 25 minutos en segundos
        localStorage.setItem('countdownTime', countdownTime);
        localStorage.setItem('lastResetTime', now);
    } 
    // Si no hay tiempo guardado, establecer a 25 minutos
    else if (!countdownTime) {
        countdownTime = 25 * 60; // 25 minutos en segundos
        localStorage.setItem('countdownTime', countdownTime);
        localStorage.setItem('lastResetTime', now);
    }
    
    // Actualizar el contador cada segundo
    const countdownInterval = setInterval(() => {
        // Obtener el tiempo actual del localStorage
        countdownTime = localStorage.getItem('countdownTime');
        
        if (countdownTime <= 0) {
            clearInterval(countdownInterval);
            countdownElement.style.backgroundColor = 'red';
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
        
        // Si llega a cero, cambiar el color a rojo
        if (countdownTime <= 0) {
            countdownElement.style.backgroundColor = 'red';
        }
    }, 1000);
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
    const interval = 5000; // Cambiar cada 5 segundos
    
    // Función para cambiar el testimonio activo
    function changeTestimonial() {
        // Quitar la clase active del testimonio actual
        testimonialCards[currentIndex].classList.remove('active');
        
        // Incrementar el índice
        currentIndex = (currentIndex + 1) % testimonialCards.length;
        
        // Agregar clase active al siguiente testimonio
        testimonialCards[currentIndex].classList.add('active');
    }
    
    // Cambiar automáticamente cada 5 segundos
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

// Smooth Scroll para los enlaces de anclaje
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                window.scrollTo({
                    top: targetElement.offsetTop - navbarHeight, // Offset para el header
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Función para el botón de volver arriba
function setupScrollTopButton() {
    if (!scrollTopBtn) return;
    
    // Mostrar/ocultar botón dependiendo del scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('active');
        } else {
            scrollTopBtn.classList.remove('active');
        }
    });
    
    // Volver arriba al hacer clic
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Inicializar todo cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    setupCountdown();
    setupMobileMenu();
    setupNavbar();
    setupTestimonialFade();
    setupCalendar();
    setupContactForm();
    setupSmoothScroll();
    setupScrollTopButton();
    
    // Animación al hacer scroll para revelar elementos
    const revealElements = document.querySelectorAll('.service-card, .benefit-card, .pricing-card, .about-content > div');
    
    window.addEventListener('scroll', () => {
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    });
    
    // Inicialmente establecer los elementos como ocultos
    revealElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
}); 