const express = require("express");
const { generateResponse } = require("../services/groq.service");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "El mensaje no puede estar vacío."
      });
    }

    const response = await generateResponse(message, history || []);

    res.json({
      success: true,
      response
    });

  } catch (error) {
    console.error("Error al consultar la IA:", error.message);

    res.status(500).json({
      success: false,
      message: "No se pudo obtener una respuesta de la IA."
    });
  }
});

module.exports = router;
