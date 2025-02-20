const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

// Simulación de los videos con tokens (puedes adaptarlo a tu base de datos o lógica)
const tempLinks = {};

// Función para generar el token basado en la IP del usuario
function generateToken(ip) {
    const token = Math.random().toString(36).substr(2, 9); // Simulación de token
    const expiresAt = Date.now() + 5 * 60 * 1000; // Expiración en 5 minutos
    tempLinks[token] = {
        url: "https://ok.ru/videoembed/9858135820851", // Aquí pones tu enlace real
        expiresAt,
    };
    return token;
}

// Ruta para servir el archivo estático (index.html)
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint para obtener un enlace temporal de video
app.get("/get-video", (req, res) => {
    const userIp = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const token = generateToken(userIp);
    res.json({ embedUrl: `https://ip-01dt.onrender.com/watch/${token}` }); // Usando la URL de Render
});

// Endpoint para servir el video con validación del token
app.get("/watch/:token", (req, res) => {
    const token = req.params.token;
    const linkData = tempLinks[token];

    if (!linkData || Date.now() > linkData.expiresAt) {
        return res.status(403).send("❌ Enlace expirado.");
    }

    res.redirect(linkData.url); // Redirige al video real
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en ${process.env.PORT || 'http://localhost:3000'}`);
});
