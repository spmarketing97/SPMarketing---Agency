// Botón volver arriba
const scrollTopBtn = document.getElementById('scrollTopBtn');

// Mostrar/ocultar botón según la posición del scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollTopBtn.classList.add('active');
    } else {
        scrollTopBtn.classList.remove('active');
    }
});

// Función para volver arriba suavemente
scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Ajustar posición cuando el chatbot está visible
function adjustScrollButtonPosition() {
    const chatContainer = document.querySelector('.chat-container');
    if (chatContainer && chatContainer.style.display === 'flex') {
        scrollTopBtn.style.bottom = '120px'; // Ajustado para no solaparse con el chatbot
    } else {
        scrollTopBtn.style.bottom = '30px';
    }
}

// Observar cambios en el chatbot
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
            adjustScrollButtonPosition();
        }
    });
});

// Iniciar observación cuando el chatbot se cargue
window.addEventListener('load', () => {
    const chatContainer = document.querySelector('.chat-container');
    if (chatContainer) {
        observer.observe(chatContainer, {
            attributes: true
        });
    }
    adjustScrollButtonPosition();
});