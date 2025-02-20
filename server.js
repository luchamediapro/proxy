const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

const tempLinks = {}; // Simulación de enlaces temporales de video

// Función para generar el token de video
function generateToken(ip) {
    const token = Math.random().toString(36).substr(2, 9); // Generar un token aleatorio
    const expiresAt = Date.now() + 5 * 60 * 1000; // Expiración del enlace en 5 minutos
    tempLinks[token] = {
        url: "https://ok.ru/videoembed/9858135820851", // URL del video real
        expiresAt,
    };
    return token;
}

// Ruta para obtener el enlace del video con el token
app.get("/get-video", (req, res) => {
    const userIp = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const token = generateToken(userIp);
    const videoUrl = `https://ip-01dt.onrender.com/watch/${token}`; // Enlace con token
    res.json({ embedUrl: videoUrl }); // Devuelve la URL con el token al frontend
});

// Ruta para ver el video real
app.get("/watch/:token", (req, res) => {
    const token = req.params.token;
    const linkData = tempLinks[token];

    if (!linkData || Date.now() > linkData.expiresAt) {
        return res.status(403).send("❌ Enlace expirado.");
    }

    res.redirect(linkData.url); // Redirige al video real
});

// Servir archivos estáticos (index.html)
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
