// Main JavaScript file for SPMarketing Agency
document.addEventListener('DOMContentLoaded', () => {
    setupCountdown();
    setupMobileMenu();
    setupNavbar();
    setupTestimonialFade();
    setupCalendar();
    setupContactForm();
    setupSmoothScroll();
    initCalendar();
    checkCookieConsent();
    
    // Animation on scroll for revealing elements
    setupScrollReveal();
});

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

// Countdown Timer Setup
function setupCountdown() {
    const countdownElement = document.getElementById('countdown');
    const minutesElement = document.getElementById('minutos');
    const secondsElement = document.getElementById('segundos');
    
    if (!minutesElement || !secondsElement) return;
    
    let endTime = localStorage.getItem('countdownEndTime');
    
    if (!endTime || new Date(parseInt(endTime)) <= new Date()) {
        endTime = new Date().getTime() + (30 * 60 * 1000);
        localStorage.setItem('countdownEndTime', endTime);
    }
    
    const countdownInterval = setInterval(() => {
        const currentTime = new Date().getTime();
        const timeLeft = parseInt(endTime) - currentTime;
        
        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            if (countdownElement) countdownElement.classList.add('expired');
            minutesElement.textContent = '00';
            secondsElement.textContent = '00';
            
            setTimeout(() => {
                if (countdownElement) countdownElement.classList.remove('expired');
                endTime = new Date().getTime() + (30 * 60 * 1000);
                localStorage.setItem('countdownEndTime', endTime);
                setupCountdown();
            }, 5000);
            return;
        }
        
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        minutesElement.textContent = minutes.toString().padStart(2, '0');
        secondsElement.textContent = seconds.toString().padStart(2, '0');
        
        if (minutes < 5) {
            countdownElement?.classList.add('expiring');
        } else {
            countdownElement?.classList.remove('expiring');
        }
    }, 1000);
}

// Mobile Menu Setup
function setupMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const menu = document.getElementById('menu');
    
    if (!hamburger || !menu) return;
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        menu.classList.toggle('active');
    });
    
    document.querySelectorAll('.menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            menu.classList.remove('active');
        });
    });
}

// Navbar Scroll Effect
function setupNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Testimonials Carousel
function setupTestimonialFade() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    if (!testimonialCards.length) return;
    
    // Ocultar todos los testimonios primero
    testimonialCards.forEach(card => {
        card.classList.remove('active');
        card.style.display = 'none';
    });
    
    // Mostrar el primer testimonio
    testimonialCards[0].classList.add('active');
    testimonialCards[0].style.display = 'block';
    
    let currentIndex = 0;
    
    setInterval(() => {
        // Ocultar el testimonio actual
        testimonialCards[currentIndex].classList.remove('active');
        setTimeout(() => {
            testimonialCards[currentIndex].style.display = 'none';
            
            // Actualizar el índice al siguiente testimonio
            currentIndex = (currentIndex + 1) % testimonialCards.length;
            
            // Mostrar el nuevo testimonio
            testimonialCards[currentIndex].style.display = 'block';
            setTimeout(() => {
                testimonialCards[currentIndex].classList.add('active');
            }, 50);
        }, 500);
    }, 7000);
}

// Calendar Setup
function setupCalendar() {
    const calendarWrapper = document.getElementById('calendar');
    if (!calendarWrapper) return;
    
    let currentDate = new Date();
    let selectedDate = null;
    let selectedTimeSlot = null;
    
    generateCalendar();
    setupCalendarControls();
}

// Form Validation
function setupContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        if (!validateForm(form)) {
            e.preventDefault();
        }
    });
    
    setupFormFieldValidation(form);
}

function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    
    if (!value) {
        showError(field, 'Este campo es obligatorio');
        return false;
    }
    
    if (field.type === 'email' && !validateEmail(value)) {
        showError(field, 'Por favor introduce un email válido');
        return false;
    }
    
    hideError(field);
    return true;
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(field, message) {
    const errorElement = field.nextElementSibling;
    if (errorElement?.classList.contains('error-message')) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    field.classList.add('error');
}

function hideError(field) {
    const errorElement = field.nextElementSibling;
    if (errorElement?.classList.contains('error-message')) {
        errorElement.style.display = 'none';
    }
    field.classList.remove('error');
}

// Smooth Scroll
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navbarHeight = document.getElementById('navbar')?.offsetHeight || 0;
                window.scrollTo({
                    top: targetElement.offsetTop - navbarHeight,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll Reveal Animation
function setupScrollReveal() {
    const revealElements = document.querySelectorAll('.service-card, .benefit-card, .pricing-card, .about-content > div');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.1
    });
    
    revealElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        observer.observe(element);
    });
}