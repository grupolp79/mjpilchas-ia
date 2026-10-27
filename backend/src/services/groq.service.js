const systemPrompt = require("../config/systemPrompt");

if (!process.env.GROQ_API_KEY) {
  throw new Error("Falta configurar GROQ_API_KEY en .env");
}

// Modelo LLM que usamos (gratis en Groq)
const MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-120b";

const API_URL = "https://api.groq.com/openai/v1/chat/completions";

async function generateResponse(message, history = []) {
  // Armamos la conversación:
  // 1) el prompt de sistema (rol, objetivo, contexto, estilo, restricciones y estructura)
  // 2) los mensajes anteriores (para que la IA recuerde)
  // 3) el mensaje nuevo del cliente
  const messages = [
    { role: "system", content: systemPrompt },
    ...history.map((item) => ({
      role: item.role === "assistant" ? "assistant" : "user",
      content: item.text
    })),
    { role: "user", content: message }
  ];

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: MODEL,
      messages: messages,
      // Temperatura baja = respuestas más precisas, inventa menos
      temperature: 0.3
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(JSON.stringify(data));
  }

  return data.choices[0].message.content;
}

module.exports = {
  generateResponse,
  MODEL
};
