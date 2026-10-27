const chatForm = document.getElementById("chat-form");
const messageInput = document.getElementById("message-input");
const messagesContainer = document.getElementById("messages");
const newChatButton = document.getElementById("new-chat");
const newChatMobile = document.getElementById("new-chat-mobile");
const welcomeTemplate = document.getElementById("welcome-template");

// Historial de la conversación (para que la IA recuerde lo que se habló)
let history = [];

// Agrega un mensaje a la conversación
function addMessage(text, sender) {
    // Si todavía está visible la bienvenida, la quitamos
    const welcome = messagesContainer.querySelector(".welcome");

    if (welcome) {
        welcome.remove();
    }

    const message = document.createElement("div");

    message.classList.add("message", sender);
    // Sacamos los ** que usa la IA para la negrita
    message.textContent = text.replace(/\*\*/g, "");

    messagesContainer.appendChild(message);

    // Desplaza el chat hasta el último mensaje
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    return message;
}

// Enviar mensaje al backend
async function sendMessage(message) {
    const typing = addMessage("Escribiendo...", "assistant");

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: message,
                history: history
            })
        });

        const data = await response.json();

        console.log("Respuesta del backend:", data);

        if (!response.ok || !data.success) {
            throw new Error(data.message || "Error del servidor");
        }

        typing.remove();
        addMessage(data.response, "assistant");

        // Guardamos la pregunta y la respuesta en el historial
        history.push({ role: "user", text: message });
        history.push({ role: "assistant", text: data.response });

    } catch (error) {
        console.error("Error al comunicarse con el backend:", error);

        typing.remove();
        addMessage("No se pudo conectar con el servidor.", "assistant");
    }
}

// Envío del formulario
chatForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const text = messageInput.value.trim();

    if (!text) return;

    // Mostrar inmediatamente el mensaje del usuario
    addMessage(text, "user");

    // Limpiar input
    messageInput.value = "";
    messageInput.focus();

    // Enviar al backend
    await sendMessage(text);
});

// Pantalla de bienvenida con preguntas sugeridas
function showWelcome() {
    messagesContainer.innerHTML = "";
    messagesContainer.appendChild(welcomeTemplate.content.cloneNode(true));

    messagesContainer.querySelectorAll(".suggestion").forEach((button) => {
        button.addEventListener("click", () => {
            addMessage(button.textContent, "user");
            sendMessage(button.textContent);
        });
    });
}

// Nuevo chat: borra la conversación y el historial
function newChat() {
    history = [];
    showWelcome();
    messageInput.focus();
}

newChatButton.addEventListener("click", newChat);
newChatMobile.addEventListener("click", newChat);

showWelcome();
