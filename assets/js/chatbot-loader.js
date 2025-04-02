let chatWidget;
let conversationId;
let retryCount = 0;
const maxRetries = 5;
const CHATBOT_URL = 'http://127.0.0.1:5000/chat'; // Cambiado de localhost a IP directa
const RETRY_DELAY = 2000;

function loadChatWidget() {
    conversationId = 'conv_' + Date.now();
    
    chatWidget = document.createElement('div');
    chatWidget.innerHTML = `
        <div id="chat-widget" class="chat-widget">
            <div class="chat-button" onclick="toggleChat()">
                <i class="fas fa-comments"></i>
            </div>
            <div class="chat-container">
                <div class="chat-header">
                    <img src="assets/img/LOGO PRINCIPAL.jpg" alt="SPMarketing Logo" class="chat-logo">
                    <span class="chat-title">SPMarketing Assistant</span>
                    <button class="chat-close" onclick="toggleChat()">×</button>
                </div>
                <div class="chat-messages" id="chat-messages"></div>
                <div class="chat-input">
                    <textarea 
                        id="user-message" 
                        placeholder="Escribe tu mensaje..." 
                        rows="1" 
                        onkeypress="handleKeyPress(event)"></textarea>
                    <button onclick="sendMessage()">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(chatWidget);
    
    const styles = document.createElement('style');
    styles.textContent = `
        .chat-widget {
            position: fixed;
            bottom: 90px;
            right: 30px;
            z-index: 1001;
            font-family: 'Roboto', sans-serif;
        }

        .chat-button {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background-color: var(--primary-color);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transition: all 0.3s ease;
        }

        .chat-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
            background-color: var(--accent-color);
        }

        .chat-button i {
            font-size: 24px;
        }

        .chat-container {
            position: fixed;
            bottom: 90px;
            right: 30px;
            width: 350px;
            height: 500px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 5px 25px rgba(0, 0, 0, 0.2);
            display: none;
            flex-direction: column;
            overflow: hidden;
        }

        .chat-container.active {
            display: flex;
        }

        .chat-header {
            padding: 15px;
            background: var(--primary-color);
            color: white;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .chat-logo {
            width: 35px;
            height: 35px;
            border-radius: 50%;
        }

        .chat-title {
            flex-grow: 1;
            font-weight: 500;
        }

        .chat-close {
            background: none;
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
            padding: 0;
        }

        .chat-messages {
            flex-grow: 1;
            padding: 15px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .message {
            max-width: 80%;
            padding: 10px 15px;
            border-radius: 15px;
            font-size: 14px;
            line-height: 1.4;
            white-space: pre-line;
        }

        .user-message {
            background-color: var(--accent-color);
            color: white;
            align-self: flex-end;
            border-bottom-right-radius: 5px;
        }

        .bot-message {
            background-color: #f0f0f0;
            color: #333;
            align-self: flex-start;
            border-bottom-left-radius: 5px;
        }

        .chat-input {
            padding: 15px;
            border-top: 1px solid #eee;
            display: flex;
            gap: 10px;
            align-items: flex-end;
        }

        .chat-input textarea {
            flex-grow: 1;
            border: 1px solid #ddd;
            border-radius: 20px;
            padding: 8px 15px;
            resize: none;
            font-family: inherit;
            font-size: 14px;
            max-height: 100px;
            outline: none;
        }

        .chat-input button {
            background-color: var(--accent-color);
            color: white;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .chat-input button:hover {
            background-color: var(--primary-color);
            transform: translateY(-2px);
        }

        .error-message {
            color: #dc3545;
            font-size: 12px;
            padding: 5px 10px;
            background-color: #fff;
            border-radius: 4px;
            margin: 5px 0;
            text-align: center;
        }

        @media (max-width: 480px) {
            .chat-container {
                width: 100%;
                height: 100%;
                bottom: 0;
                right: 0;
                border-radius: 0;
            }
            
            .chat-button {
                bottom: 20px;
                right: 20px;
            }
        }
    `;
    
    document.head.appendChild(styles);
    
    // Inicializar con mensaje de bienvenida después de un breve retraso
    setTimeout(() => {
        addMessage("¡Hola! 👋 Soy el asistente virtual de SPMarketing. ¿En qué puedo ayudarte hoy?", 'bot');
    }, 500);
}

function toggleChat() {
    const container = document.querySelector('.chat-container');
    const button = document.querySelector('.chat-button');
    
    if (container.style.display === 'flex') {
        container.style.display = 'none';
        button.style.display = 'flex';
    } else {
        container.style.display = 'flex';
        button.style.display = 'none';
    }
}

function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

function addMessage(text, sender) {
    const messages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    messageDiv.textContent = text;
    messages.appendChild(messageDiv);
    messages.scrollTop = messages.scrollHeight;
}

async function sendMessage() {
    const input = document.getElementById('user-message');
    const message = input.value.trim();
    
    if (!message) return;
    
    addMessage(message, 'user');
    input.value = '';
    
    try {
        const response = await fetchWithRetry(message);
        if (response.error) {
            throw new Error(response.error);
        }
        retryCount = 0;
        addMessage(response.response, 'bot');
    } catch (error) {
        console.error('Error:', error);
        handleError();
    }
}

async function fetchWithRetry(message, attempt = 1) {
    const urls = [
        'http://127.0.0.1:5000/chat',
        'http://localhost:5000/chat',
        'http://0.0.0.0:5000/chat'
    ];
    
    let lastError;
    
    for (const url of urls) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    message: message,
                    conversation_id: conversationId
                })
            });
            
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            lastError = error;
            console.log(`Intentando conectar a ${url}:`, error);
            continue;
        }
    }
    
    if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return fetchWithRetry(message, attempt + 1);
    }
    
    throw lastError;
}

function handleError() {
    if (retryCount < maxRetries) {
        retryCount++;
        addMessage(`Estoy teniendo problemas para conectar. Intento ${retryCount}/${maxRetries}...`, 'bot');
    } else {
        addMessage('Lo siento, parece que hay un problema de conexión. Por favor, intenta más tarde o contáctanos por:', 'bot');
        addMessage('WhatsApp: https://wa.link/uxacg0', 'bot');
        addMessage('Email: solucionesworld2016@gmail.com', 'bot');
    }
}

// Load chat widget when DOM is ready
document.addEventListener('DOMContentLoaded', loadChatWidget);