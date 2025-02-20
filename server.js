const express = require("express");
const crypto = require("crypto");
const app = express();
const PORT = process.env.PORT || 3000;

// Lista de URLs de videos originales
const videoUrls = [
    "https://originalserver.com/embed/video1",
    "https://originalserver.com/embed/video2"
];

// Almacén temporal de enlaces generados
const tempLinks = {};

// Función para generar un token único con expiración
function generateToken(ip) {
    const token = crypto.randomBytes(16).toString("hex");
    const expiresAt = Date.now() + 10 * 60 * 1000; // Expira en 10 minutos
    tempLinks[token] = { ip, url: getVideoUrl(ip), expiresAt };
    return token;
}

// Función para seleccionar un video según la IP
function getVideoUrl(ip) {
    const hash = ip.split(".").reduce((acc, num) => acc + parseInt(num), 0);
    return videoUrls[hash % videoUrls.length];
}

// Endpoint para obtener un enlace temporal
app.get("/get-video", (req, res) => {
    const userIp = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const token = generateToken(userIp);
    res.json({ embedUrl: `/watch/${token}` });
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
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
