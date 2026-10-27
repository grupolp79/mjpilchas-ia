require("dotenv").config();
//importamos Express
const express = require("express");
const cors = require("cors");

//importamos las rutas del chat
const chatRoutes = require("./routes/chat.routes");
const { MODEL } = require("./services/groq.service");

//creamos nuestra aplicación
const app = express();

const PORT = process.env.PORT || 3000;

// Permitir peticiones desde el frontend - Configuración de CORS
app.use(cors());

//le dice a Express que pueda recibir información en formato JSON
app.use(express.json());

// Rutas
app.use("/api/chat", chatRoutes);

// Ruta inicial (sirve para comprobar que el backend está funcionando)
app.get("/", (req, res) => {
    res.json({
        message: "Backend MJPilchas IA funcionando",
        modelo: MODEL
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    console.log(`Modelo de IA (Groq): ${MODEL}`);
});
