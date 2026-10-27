# MJPilchas IA – Asistente de ventas con Groq

Parcial 2 – Proyecto de Inteligencia Artificial · UTU 2026

## Problema

**MJPilchas** es una marca uruguaya que vende ropa original importada de EE.UU. (Lacoste, Tommy Hilfiger, Michael Kors, Armani Exchange, Hugo Boss, Guess, Jordan, EA7) por Instagram y WhatsApp.

Cada día llegan alrededor de 10 mensajes con preguntas que se repiten: *"precio?"*, *"¿tenés en talle M?"*, *"¿hacen envíos al interior?"*. Contestarlas a mano lleva tiempo, y si la respuesta tarda el cliente se enfría y la venta se pierde.

## Solución

Un **asistente de ventas con IA** que responde al instante y a cualquier hora:

- precios y talles de las prendas en stock (drop actual);
- cómo funciona el encargo (seña del 50%, ~14 días por courier USX);
- envíos (punto de encuentro en Montevideo o DAC al interior) y formas de pago;
- cuando el cliente quiere comprar, arma un **resumen del pedido** y lo deriva a un vendedor.

## Tecnologías

| Parte | Tecnología |
|---|---|
| Modelo LLM | **Groq** (`openai/gpt-oss-120b`) mediante su API compatible con OpenAI (`fetch`, sin librerías extra) |
| Backend | Node.js + Express (API `POST /api/chat`) |
| Frontend | HTML, CSS y JavaScript |

## Cómo funciona

```
Cliente (frontend)  →  POST /api/chat { message, history }  →  Backend Express
                                                                  │
                                    prompt de sistema + catálogo  │
                                                                  ▼
                                                             Groq (LLM)
                                                                  │
Cliente (frontend)  ←────────────── { success, response } ←───────┘
```

- **Prompt de sistema** (`backend/src/config/systemPrompt.js`): rol, objetivo, contexto, forma y estilo, restricciones y estructura de las respuestas.
- **Memoria de la conversación:** el frontend manda los últimos mensajes (`history`) para que la IA entienda preguntas como *"¿y en talle L?"*.
- **Temperatura 0.3:** respuestas más consistentes y con menos invención.

## Ejecutar en tu PC

```bash
cd backend
npm install
# crear el archivo .env a partir de .env.example y pegar tu GROQ_API_KEY
npm run dev
```

Después abrí `frontend/index.html` con **Live Server** en VS Code.

## Estructura

```
├── backend/
│   ├── .env.example
│   ├── package.json
│   └── src/
│       ├── app.js                    → servidor Express
│       ├── routes/chat.routes.js     → endpoint /api/chat
│       ├── services/groq.service.js  → conexión con Groq
│       └── config/systemPrompt.js    → prompt de sistema (6 partes)
└── frontend/
    ├── index.html
    ├── css/styles.css
    ├── js/config.js                  → URL del backend
    └── js/app.js                     → lógica del chat
```
