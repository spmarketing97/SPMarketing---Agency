// Validación de formulario
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            let isValid = true;
            const requiredFields = form.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    showError(field, 'Este campo es obligatorio');
                } else if (field.type === 'email' && !validateEmail(field.value)) {
                    isValid = false;
                    showError(field, 'Por favor introduce un email válido');
                } else {
                    hideError(field);
                }
            });
            
            if (!isValid) {
                e.preventDefault();
            } else {
                // Guardar en localStorage que el formulario se ha enviado correctamente
                // para redireccionar manualmente si FormSubmit.co no lo hace
                localStorage.setItem('formSubmitted', 'true');
                
                // Establecer un timeout para redireccionar manualmente 
                // si formsubmit.co no redirecciona después de 3 segundos
                setTimeout(function() {
                    if (localStorage.getItem('formSubmitted') === 'true') {
                        localStorage.removeItem('formSubmitted');
                        window.location.href = '/thank-you.html';
                    }
                }, 3000);
            }
        });
        
        // Limpiar mensajes de error al escribir
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            field.addEventListener('input', function() {
                if (field.value.trim()) {
                    hideError(field);
                }
            });
        });
    }
    
    // Inicializar el calendario
    initCalendar();
    
    // Inicializar contador regresivo
    initCountdown();
    
    // Inicialización del menú scrollable
    initScrollMenu();
    
    handleScrollMenu();
    handleScrollTopButton();
    
    // Inicializar el slider de testimonios
    initTestimonialSlider();
    
    // Manejar opción de esconder fecha y hora
    const hideDateTime = document.getElementById('hideDateTime');
    const calendarContainer = document.getElementById('calendarContainer');
    
    if (hideDateTime && calendarContainer) {
        hideDateTime.addEventListener('change', function() {
            if (this.checked) {
                calendarContainer.style.display = 'none';
                // Si está marcado, indicamos que no se requiere una fecha/hora específica
                const datetimeInput = document.getElementById('selectedDatetime');
                if (datetimeInput) {
                    datetimeInput.value = 'Cualquier momento';
                }
            } else {
                calendarContainer.style.display = 'block';
                // Reiniciar el valor si se desmarca
                const datetimeInput = document.getElementById('selectedDatetime');
                if (datetimeInput) {
                    datetimeInput.value = '';
                }
            }
        });
    }
});

// Función para el menú scrollable
function initScrollMenu() {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
}

// Función para el contador regresivo
function initCountdown() {
    const minutesElement = document.getElementById('minutos');
    const secondsElement = document.getElementById('segundos');
    
    if (!minutesElement || !secondsElement) return;
    
    // Obtener tiempo almacenado o establecer nuevo tiempo
    let endTime = localStorage.getItem('countdownEndTime');
    let minutes, seconds;
    
    if (!endTime || new Date(parseInt(endTime)) <= new Date()) {
        // Si no hay tiempo almacenado o ya pasó, establecer 25 minutos desde ahora
        endTime = new Date().getTime() + (25 * 60 * 1000);
        localStorage.setItem('countdownEndTime', endTime);
    }
    
    // Actualizar el contador cada segundo
    const countdownInterval = setInterval(function() {
        // Calcular tiempo restante
        const currentTime = new Date().getTime();
        const timeLeft = parseInt(endTime) - currentTime;
        
        if (timeLeft <= 0) {
            // Reiniciar el contador cuando llega a cero
            clearInterval(countdownInterval);
            endTime = new Date().getTime() + (25 * 60 * 1000);
            localStorage.setItem('countdownEndTime', endTime);
            
            setTimeout(function() {
                initCountdown();
            }, 1000);
            return;
        }
        
        // Convertir a minutos y segundos
        minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        // Formatear el tiempo como "MM:SS"
        const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
        const formattedSeconds = seconds < 10 ? "0" + seconds : seconds;
        
        // Actualizar los elementos del contador
        minutesElement.textContent = formattedMinutes;
        secondsElement.textContent = formattedSeconds;
        
        // Cambiar a rojo cuando queden menos de 5 minutos
        if (minutes < 5) {
            minutesElement.parentElement.style.color = "#e74c3c";
        } else {
            minutesElement.parentElement.style.color = "";
        }
    }, 1000);
}

function showError(field, message) {
    const errorElement = field.nextElementSibling;
    if (errorElement && errorElement.classList.contains('error-message')) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    field.classList.add('error');
}

function hideError(field) {
    const errorElement = field.nextElementSibling;
    if (errorElement && errorElement.classList.contains('error-message')) {
        errorElement.style.display = 'none';
    }
    field.classList.remove('error');
}

function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Funcionalidad del Calendario
function initCalendar() {
    const calendarContainer = document.getElementById('calendarContainer');
    
    if (calendarContainer) {
        // Generar el calendario de inmediato
        generateCalendar();
        
        // Inicializar botones de navegación
        const prevBtn = document.getElementById('prevMonth');
        const nextBtn = document.getElementById('nextMonth');
        
        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', function() {
                navigateMonth(-1);
            });
            
            nextBtn.addEventListener('click', function() {
                navigateMonth(1);
            });
        }
    }
}

let currentDate = new Date();
let selectedDate = null;
let selectedTimeSlot = null;

function generateCalendar() {
    updateCalendarHeader();
    generateDays();
}

function updateCalendarHeader() {
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const currentMonthElement = document.querySelector('.current-month');
    
    if (currentMonthElement) {
        currentMonthElement.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    }
}

function generateDays() {
    const daysContainer = document.querySelector('.calendar-days');
    if (!daysContainer) return;
    
    daysContainer.innerHTML = '';
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Primer día del mes actual
    const firstDay = new Date(year, month, 1);
    // Último día del mes actual
    const lastDay = new Date(year, month + 1, 0);
    
    // Día de la semana del primer día (0 = Domingo, 6 = Sábado)
    let firstDayIndex = firstDay.getDay();
    // Ajustar para que lunes sea el primer día (0) y domingo el último (6)
    firstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
    
    // Obtener el número de días del mes anterior
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    
    // Día actual para destacarlo
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Resetear las horas para comparar solo fechas
    
    // Días del mes anterior
    for (let i = firstDayIndex; i > 0; i--) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('day', 'prev-month-day');
        dayElement.textContent = prevMonthLastDay - i + 1;
        daysContainer.appendChild(dayElement);
    }
    
    // Días del mes actual
    for (let i = 1; i <= lastDay.getDate(); i++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('day');
        dayElement.textContent = i;
        
        const dayDate = new Date(year, month, i);
        dayDate.setHours(0, 0, 0, 0); // Resetear las horas para comparar solo fechas
        
        // Verificar si es hoy
        if (dayDate.getTime() === today.getTime()) {
            dayElement.classList.add('today');
        }
        
        // Verificar si es el día seleccionado
        if (selectedDate && dayDate.getTime() === selectedDate.getTime()) {
            dayElement.classList.add('selected');
        }
        
        // Deshabilitar días pasados y fines de semana
        const dayOfWeek = dayDate.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const isPast = dayDate.getTime() < today.getTime();
        
        if (isPast || isWeekend) {
            dayElement.classList.add('disabled');
        } else {
            dayElement.addEventListener('click', () => selectDate(dayDate, dayElement));
        }
        
        daysContainer.appendChild(dayElement);
    }
    
    // Calcular cuántos días del próximo mes necesitamos mostrar
    const totalDays = firstDayIndex + lastDay.getDate();
    const rowsNeeded = Math.ceil(totalDays / 7);
    const totalCells = rowsNeeded * 7;
    const remainingDays = totalCells - totalDays;
    
    // Días del mes siguiente
    for (let i = 1; i <= remainingDays; i++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('day', 'next-month-day');
        dayElement.textContent = i;
        daysContainer.appendChild(dayElement);
    }
}

function navigateMonth(direction) {
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1);
    generateCalendar();
}

function selectDate(date, element) {
    // Quitar la clase selected de todos los días
    document.querySelectorAll('.day').forEach(day => day.classList.remove('selected'));
    // Añadir la clase selected al día seleccionado
    element.classList.add('selected');
    
    // Actualizar la fecha seleccionada
    selectedDate = date;
    
    // Generar franjas horarias disponibles
    generateTimeSlots(date);
    
    // Actualizar la fecha seleccionada en el elemento de resumen
    updateSelectedDateTime();
    
    // Asegurarse de que el contenedor de fecha y hora seleccionada se muestre
    const selectedDatetimeElement = document.querySelector('.selected-datetime');
    if (selectedDatetimeElement) {
        selectedDatetimeElement.style.display = 'block';
    }
}

function generateTimeSlots(date) {
    const timeSlotsContainer = document.querySelector('.time-slots');
    if (!timeSlotsContainer) return;
    
    timeSlotsContainer.innerHTML = '';
    
    // Franjas horarias disponibles (9:00 - 17:00, cada 1 hora)
    const availableSlots = ['9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
    
    availableSlots.forEach(time => {
        const timeSlotElement = document.createElement('div');
        timeSlotElement.classList.add('time-slot');
        timeSlotElement.textContent = time;
        
        // Si es la franja horaria seleccionada, marcarla
        if (selectedTimeSlot === time) {
            timeSlotElement.classList.add('selected');
        }
        
        timeSlotElement.addEventListener('click', () => selectTimeSlot(time, timeSlotElement));
        
        timeSlotsContainer.appendChild(timeSlotElement);
    });
    
    // Mostrar el selector de hora
    const timeSelector = document.querySelector('.time-selector');
    if (timeSelector) {
        timeSelector.style.display = 'block';
    }
}

function selectTimeSlot(time, element) {
    // Quitar la clase selected de todas las franjas horarias
    document.querySelectorAll('.time-slot').forEach(slot => slot.classList.remove('selected'));
    // Añadir la clase selected a la franja horaria seleccionada
    element.classList.add('selected');
    
    // Actualizar la franja horaria seleccionada
    selectedTimeSlot = time;
    
    // Mostrar el resumen de la fecha y hora seleccionada
    const selectedDatetimeElement = document.querySelector('.selected-datetime');
    if (selectedDatetimeElement) {
        selectedDatetimeElement.style.display = 'block';
    }
    
    // Actualizar el resumen de fecha y hora
    updateSelectedDateTime();
    
    // Actualizar el campo oculto con la fecha y hora seleccionada
    const datetimeInput = document.getElementById('selectedDatetime');
    if (datetimeInput) {
        const dateFormatted = selectedDate.toLocaleDateString('es-ES');
        datetimeInput.value = `${dateFormatted} - ${selectedTimeSlot}`;
    }
}

function updateSelectedDateTime() {
    const dateElement = document.getElementById('selectedDate');
    const timeElement = document.getElementById('selectedTime');
    
    if (dateElement && selectedDate) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = selectedDate.toLocaleDateString('es-ES', options);
    }
    
    if (timeElement && selectedTimeSlot) {
        timeElement.textContent = selectedTimeSlot;
    }
    
    // Mostrar el contenedor de fecha y hora seleccionada
    const selectedDatetimeElement = document.querySelector('.selected-datetime');
    if (selectedDatetimeElement) {
        selectedDatetimeElement.style.display = selectedDate && selectedTimeSlot ? 'block' : 'none';
    }
}

function resetCalendarSelection() {
    selectedDate = null;
    selectedTimeSlot = null;
    
    // Ocultar el selector de hora y el resumen
    const timeSelector = document.querySelector('.time-selector');
    const selectedDatetimeElement = document.querySelector('.selected-datetime');
    
    if (timeSelector) {
        timeSelector.classList.remove('active');
    }
    
    if (selectedDatetimeElement) {
        selectedDatetimeElement.style.display = 'none';
    }
    
    // Ocultar el calendario
    const calendarContainer = document.querySelector('.calendar-container');
    if (calendarContainer) {
        calendarContainer.classList.remove('active');
    }
    
    // Limpiar el campo oculto
    const datetimeInput = document.getElementById('selectedDatetime');
    if (datetimeInput) {
        datetimeInput.value = '';
    }
}

// Función para manejar el menú al hacer scroll
function handleScrollMenu() {
    const navbar = document.getElementById('navbar');
    const scrollPosition = window.scrollY;
    
    if (scrollPosition > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// Función para manejar el botón de volver arriba
function handleScrollTopButton() {
    const scrollBtn = document.getElementById('scrollTopBtn');
    
    if (window.scrollY > 500) {
        scrollBtn.classList.add('active');
    } else {
        scrollBtn.classList.remove('active');
    }
}

// Evento scroll para activar las funciones
window.addEventListener('scroll', function() {
    handleScrollMenu();
    handleScrollTopButton();
});

// Evento click para el botón de volver arriba
document.getElementById('scrollTopBtn').addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Inicializar el slider de testimonios
function initTestimonialSlider() {
    const testimonials = document.querySelectorAll('.testimonial-card');
    if (testimonials.length === 0) return;
    
    let currentIndex = 0;
    
    // Mostrar el primer testimonio
    testimonials[0].classList.add('active');
    
    // Función para mostrar el siguiente testimonio
    function showNextTestimonial() {
        // Ocultar el testimonio actual
        testimonials[currentIndex].classList.remove('active');
        
        // Calcular el siguiente índice
        currentIndex = (currentIndex + 1) % testimonials.length;
        
        // Mostrar el siguiente testimonio
        testimonials[currentIndex].classList.add('active');
        
        // Reiniciar la animación de fade
        testimonials[currentIndex].style.animation = 'none';
        testimonials[currentIndex].offsetHeight; // Trigger reflow
        testimonials[currentIndex].style.animation = 'fadeInOut 5s forwards';
    }
    
    // Cambiar testimonios cada 5 segundos
    setInterval(showNextTestimonial, 5000);
}