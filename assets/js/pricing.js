document.addEventListener('DOMContentLoaded', () => {
    // Inicializar el chatbot
    window.chatWidget = new ChatWidget();

    // Configurar el reloj regresivo
    const countdownContainer = document.createElement('div');
    countdownContainer.className = 'countdown-container';
    document.querySelector('.chat-widget').after(countdownContainer);

    function startCountdown() {
        const now = new Date();
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        
        function updateCountdown() {
            const timeLeft = endOfDay - new Date();
            
            if (timeLeft <= 0) {
                // Reiniciar para el siguiente día
                endOfDay.setDate(endOfDay.getDate() + 1);
                updateCountdown();
                return;
            }

            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

            countdownContainer.innerHTML = `
                <div class="countdown-title">🔥 La oferta termina en:</div>
                <div class="countdown-timer">
                    <span>${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}</span>
                </div>
            `;
        }

        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    startCountdown();
}); 